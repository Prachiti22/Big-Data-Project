"""
Anomaly detection on NYC Yellow Taxi trips.

Two complementary strategies:

1. Rule-based flags — specific suspicious patterns (zero-distance paid trips,
   fare > $500, duration > 3 hours, etc.).
2. IQR outliers — distribution-based detection on fare_amount, trip_distance,
   and trip_duration_min using Spark's approxQuantile.
"""
from pathlib import Path
from typing import Dict

import pandas as pd
from pyspark.sql import DataFrame
from pyspark.sql import functions as F


# Rule names are safe at import time; the Column expressions are built lazily
# inside _build_rule_flags() because pyspark 3.5 requires an active SparkContext
# before F.col(...) can be called.
RULE_NAMES = [
    "zero_distance_paid",
    "extreme_fare",
    "extreme_total",
    "extreme_distance",
    "extreme_duration",
    "neg_tip",
    "impossible_speed",
]


def _build_rule_flags():
    """Construct the rule-name -> Column-expression map (requires active Spark)."""
    return {
        "zero_distance_paid": (F.col("trip_distance") <= 0) & (F.col("fare_amount") > 0),
        "extreme_fare":       F.col("fare_amount") > 500,
        "extreme_total":      F.col("total_amount") > 700,
        "extreme_distance":   F.col("trip_distance") > 100,
        "extreme_duration":   F.col("trip_duration_min") > 180,
        "neg_tip":            F.col("tip_amount") < 0,
        "impossible_speed":   F.col("avg_speed_mph") > 90,
    }


def apply_rule_flags(df: DataFrame) -> DataFrame:
    """Add one 0/1 column per rule plus a combined `is_anomaly_rule` column."""
    out = df
    rules = _build_rule_flags()
    for name, cond in rules.items():
        out = out.withColumn(f"flag_{name}", cond.cast("int"))
    flag_cols = [F.col(f"flag_{n}") for n in rules]
    out = out.withColumn(
        "is_anomaly_rule",
        (sum(flag_cols) > 0).cast("int"),
    )
    return out


def rule_flag_counts(df: DataFrame) -> pd.DataFrame:
    """Summarize how many trips fall into each rule bucket."""
    exprs = [F.sum(f"flag_{n}").alias(n) for n in RULE_NAMES]
    row = df.agg(*exprs).toPandas().iloc[0]
    return (
        pd.DataFrame({"rule": row.index, "count": row.values})
        .sort_values("count", ascending=False)
        .reset_index(drop=True)
    )


def iqr_outlier_bounds(df: DataFrame, cols=None, relative_error: float = 0.01) -> Dict[str, Dict[str, float]]:
    """Compute IQR-based lower/upper bounds for each column."""
    cols = cols or ["fare_amount", "trip_distance", "trip_duration_min"]
    bounds: Dict[str, Dict[str, float]] = {}
    for c in cols:
        q1, q3 = df.approxQuantile(c, [0.25, 0.75], relative_error)
        iqr = q3 - q1
        bounds[c] = {
            "q1": q1, "q3": q3, "iqr": iqr,
            "lower": q1 - 1.5 * iqr,
            "upper": q3 + 1.5 * iqr,
        }
    return bounds


def apply_iqr_flags(df: DataFrame, bounds: Dict[str, Dict[str, float]]) -> DataFrame:
    """Flag trips outside IQR bounds for each monitored column."""
    out = df
    for col, b in bounds.items():
        out = out.withColumn(
            f"iqr_{col}",
            ((F.col(col) < b["lower"]) | (F.col(col) > b["upper"])).cast("int"),
        )
    iqr_cols = [F.col(f"iqr_{c}") for c in bounds]
    out = out.withColumn("is_anomaly_iqr", (sum(iqr_cols) > 0).cast("int"))
    return out


def combined_anomalies(df: DataFrame) -> DataFrame:
    """Union rule- and IQR-based anomalies into a single indicator."""
    return df.withColumn(
        "is_anomaly",
        ((F.col("is_anomaly_rule") == 1) | (F.col("is_anomaly_iqr") == 1)).cast("int"),
    )


def detect(df: DataFrame, results_dir: Path) -> Dict[str, object]:
    """End-to-end detection. Persists bounds, counts, and a sample of anomalies."""
    results_dir.mkdir(parents=True, exist_ok=True)

    flagged = apply_rule_flags(df)
    bounds = iqr_outlier_bounds(flagged)
    flagged = apply_iqr_flags(flagged, bounds)
    flagged = combined_anomalies(flagged)

    total = flagged.count()
    n_rule = flagged.filter("is_anomaly_rule = 1").count()
    n_iqr  = flagged.filter("is_anomaly_iqr  = 1").count()
    n_any  = flagged.filter("is_anomaly      = 1").count()

    summary = pd.DataFrame(
        {
            "metric": [
                "total_trips",
                "rule_anomalies",
                "iqr_anomalies",
                "combined_anomalies",
                "pct_combined",
            ],
            "value": [
                total,
                n_rule,
                n_iqr,
                n_any,
                round(100 * n_any / total, 3),
            ],
        }
    )
    summary.to_csv(results_dir / "anomaly_summary.csv", index=False)

    rule_counts = rule_flag_counts(flagged)
    rule_counts.to_csv(results_dir / "anomaly_rule_counts.csv", index=False)

    bounds_df = pd.DataFrame(bounds).T.reset_index().rename(columns={"index": "column"})
    bounds_df.to_csv(results_dir / "anomaly_iqr_bounds.csv", index=False)

    sample = (
        flagged.filter("is_anomaly = 1")
        .select(
            "tpep_pickup_datetime", "pickup_zone", "dropoff_zone",
            "trip_distance", "trip_duration_min", "fare_amount",
            "total_amount", "avg_speed_mph",
            *[f"flag_{n}" for n in RULE_NAMES],
            *[f"iqr_{c}" for c in bounds],
        )
        .orderBy(F.desc("fare_amount"))
        .limit(100)
        .toPandas()
    )
    sample.to_csv(results_dir / "anomaly_samples.csv", index=False)

    print(f"[anom  ] rule={n_rule:,}  iqr={n_iqr:,}  combined={n_any:,}  ({100*n_any/total:.2f}%)")

    return {
        "flagged_df": flagged,
        "summary": summary,
        "rule_counts": rule_counts,
        "bounds": bounds_df,
        "sample": sample,
    }
