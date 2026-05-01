"""
Entry point that runs the full NYC Yellow Taxi Big Data pipeline end-to-end:
ingestion -> preprocessing -> descriptive -> predictive -> anomaly -> plots.

Usage:
    python -m src.run_pipeline
    # or
    python src/run_pipeline.py
"""
from __future__ import annotations
import sys
from pathlib import Path

# Allow running as a script (python src/run_pipeline.py)
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.config import FIG_DIR, RESULTS_DIR
from src.spark_session import get_spark
from src.ingestion import load_trips, load_zones, attach_zone_names
from src.preprocessing import preprocess
from src.descriptive import run_all as run_descriptive
from src.predictive import (
    train_demand_models,
    feature_importance_pdf,
    save_predictions_sample,
)
from src.anomaly import detect as detect_anomalies
from src import visualization as viz


def main() -> None:
    spark = get_spark()
    print(f"[spark ] v{spark.version}  master={spark.sparkContext.master}")

    # 1. Ingest + zone enrichment
    trips = load_trips(spark)
    zones = load_zones(spark)
    trips = attach_zone_names(trips, zones)

    # 2. Preprocess
    clean = preprocess(trips)

    # 3. Descriptive analytics
    descriptive = run_descriptive(clean, RESULTS_DIR)

    # 4. Plots for descriptive section
    viz.plot_trips_per_hour(descriptive["trips_per_hour"], FIG_DIR)
    viz.plot_trips_per_day(descriptive["trips_per_day"], FIG_DIR)
    viz.plot_trips_per_dow(descriptive["trips_per_day_of_week"], FIG_DIR)
    viz.plot_busiest_zones(descriptive["busiest_pickup_zones"], FIG_DIR, kind="pickup")
    viz.plot_busiest_zones(descriptive["busiest_dropoff_zones"], FIG_DIR, kind="dropoff")
    viz.plot_passenger_distribution(descriptive["passenger_count_distribution"], FIG_DIR)
    viz.plot_payment_breakdown(descriptive["payment_type_breakdown"], FIG_DIR)
    viz.plot_hour_zone_heatmap(descriptive["hour_zone_heatmap"], FIG_DIR)

    # Fare vs distance scatter — take a small random sample
    sample_pdf = (
        clean.select("trip_distance", "fare_amount")
        .sample(False, 0.002, seed=1)
        .toPandas()
    )
    viz.plot_fare_vs_distance(sample_pdf, FIG_DIR)

    # 5. Predictive modelling
    model_out = train_demand_models(clean)
    viz.plot_model_metrics(model_out["metrics"], FIG_DIR)

    # Persist metrics for the Streamlit dashboard.
    import pandas as _pd
    _pd.DataFrame(model_out["metrics"]).T.reset_index().rename(
        columns={"index": "model"}
    ).to_csv(RESULTS_DIR / "model_metrics.csv", index=False)

    feature_names = [
        "pickup_hour", "pickup_day_of_week", "is_weekend",
        "PULocationID", "borough_idx", "avg_distance", "avg_fare",
    ]
    fi_pdf = feature_importance_pdf(model_out["rf_model"], feature_names)
    fi_pdf.to_csv(RESULTS_DIR / "feature_importance.csv", index=False)
    viz.plot_feature_importance(fi_pdf, FIG_DIR)

    preds_pdf = save_predictions_sample(
        model_out["rf_model"], model_out["test"],
        RESULTS_DIR / "predictions_sample.csv",
    )
    viz.plot_predicted_vs_actual(preds_pdf, FIG_DIR)

    # 6. Anomaly detection
    anom = detect_anomalies(clean, RESULTS_DIR)
    viz.plot_anomaly_rule_counts(anom["rule_counts"], FIG_DIR)

    box_sample = (
        clean.select("fare_amount", "trip_distance", "trip_duration_min")
        .sample(False, 0.002, seed=2)
        .toPandas()
    )
    viz.plot_fare_box_with_bounds(box_sample, anom["bounds"], FIG_DIR)

    print("\n[done  ] figures  ->", FIG_DIR)
    print("[done  ] results  ->", RESULTS_DIR)
    spark.stop()


if __name__ == "__main__":
    main()
