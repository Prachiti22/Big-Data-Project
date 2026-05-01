"""
Descriptive analytics using Spark SQL and DataFrame APIs.
Each function returns a small Pandas DataFrame suitable for plotting.
"""
from pathlib import Path
from typing import Dict

import pandas as pd
from pyspark.sql import DataFrame
from pyspark.sql import functions as F


def summary_statistics(df: DataFrame) -> pd.DataFrame:
    """Descriptive stats on key numeric columns."""
    cols = [
        "trip_distance",
        "fare_amount",
        "tip_amount",
        "total_amount",
        "trip_duration_min",
        "passenger_count",
        "avg_speed_mph",
    ]
    return df.select(cols).summary(
        "count", "mean", "stddev", "min", "25%", "50%", "75%", "max"
    ).toPandas()


def trips_per_day(df: DataFrame) -> pd.DataFrame:
    return (
        df.groupBy("pickup_date")
        .agg(F.count("*").alias("trip_count"))
        .orderBy("pickup_date")
        .toPandas()
    )


def trips_per_hour(df: DataFrame) -> pd.DataFrame:
    return (
        df.groupBy("pickup_hour")
        .agg(
            F.count("*").alias("trip_count"),
            F.avg("fare_amount").alias("avg_fare"),
            F.avg("trip_distance").alias("avg_distance"),
        )
        .orderBy("pickup_hour")
        .toPandas()
    )


def trips_per_day_of_week(df: DataFrame) -> pd.DataFrame:
    """Spark's dayofweek: 1=Sunday ... 7=Saturday."""
    name_expr = F.element_at(
        F.array(
            F.lit("Sun"), F.lit("Mon"), F.lit("Tue"), F.lit("Wed"),
            F.lit("Thu"), F.lit("Fri"), F.lit("Sat"),
        ),
        F.col("pickup_day_of_week"),
    )
    return (
        df.withColumn("dow_name", name_expr)
        .groupBy("pickup_day_of_week", "dow_name")
        .agg(F.count("*").alias("trip_count"))
        .orderBy("pickup_day_of_week")
        .toPandas()
    )


def busiest_pickup_zones(df: DataFrame, top_n: int = 15) -> pd.DataFrame:
    return (
        df.groupBy("pickup_zone", "pickup_borough")
        .agg(
            F.count("*").alias("trip_count"),
            F.avg("fare_amount").alias("avg_fare"),
            F.avg("trip_distance").alias("avg_distance"),
        )
        .orderBy(F.desc("trip_count"))
        .limit(top_n)
        .toPandas()
    )


def busiest_dropoff_zones(df: DataFrame, top_n: int = 15) -> pd.DataFrame:
    return (
        df.groupBy("dropoff_zone", "dropoff_borough")
        .agg(F.count("*").alias("trip_count"))
        .orderBy(F.desc("trip_count"))
        .limit(top_n)
        .toPandas()
    )


def passenger_count_distribution(df: DataFrame) -> pd.DataFrame:
    return (
        df.groupBy("passenger_count")
        .agg(F.count("*").alias("trip_count"))
        .orderBy("passenger_count")
        .toPandas()
    )


def payment_type_breakdown(df: DataFrame) -> pd.DataFrame:
    """Payment type codes per TLC data dictionary."""
    mapping = F.element_at(
        F.create_map(
            F.lit(1), F.lit("Credit card"),
            F.lit(2), F.lit("Cash"),
            F.lit(3), F.lit("No charge"),
            F.lit(4), F.lit("Dispute"),
            F.lit(5), F.lit("Unknown"),
            F.lit(6), F.lit("Voided"),
        ),
        F.col("payment_type").cast("int"),
    )
    return (
        df.withColumn("payment_name", mapping)
        .groupBy("payment_type", "payment_name")
        .agg(F.count("*").alias("trip_count"), F.avg("total_amount").alias("avg_total"))
        .orderBy(F.desc("trip_count"))
        .toPandas()
    )


def hour_zone_heatmap(df: DataFrame, top_zones: int = 10) -> pd.DataFrame:
    """Hour x Zone demand matrix restricted to the top-N busiest pickup zones."""
    top = (
        df.groupBy("pickup_zone")
        .count()
        .orderBy(F.desc("count"))
        .limit(top_zones)
        .select("pickup_zone")
    )
    joined = df.join(F.broadcast(top), "pickup_zone")
    return (
        joined.groupBy("pickup_zone", "pickup_hour")
        .agg(F.count("*").alias("trip_count"))
        .toPandas()
    )


def run_all(df: DataFrame, results_dir: Path) -> Dict[str, pd.DataFrame]:
    """Run every descriptive analytic and persist CSVs to results_dir."""
    results: Dict[str, pd.DataFrame] = {
        "summary_statistics": summary_statistics(df),
        "trips_per_day": trips_per_day(df),
        "trips_per_hour": trips_per_hour(df),
        "trips_per_day_of_week": trips_per_day_of_week(df),
        "busiest_pickup_zones": busiest_pickup_zones(df),
        "busiest_dropoff_zones": busiest_dropoff_zones(df),
        "passenger_count_distribution": passenger_count_distribution(df),
        "payment_type_breakdown": payment_type_breakdown(df),
        "hour_zone_heatmap": hour_zone_heatmap(df),
    }
    results_dir.mkdir(parents=True, exist_ok=True)
    for name, pdf in results.items():
        pdf.to_csv(results_dir / f"{name}.csv", index=False)
    return results
