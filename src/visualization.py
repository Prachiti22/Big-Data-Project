"""
Matplotlib / Seaborn plots for the descriptive analytics, model evaluation,
and anomaly detection results. Every function saves a PNG into `fig_dir`.
"""
from pathlib import Path
from typing import Dict

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

sns.set_theme(style="whitegrid", context="talk")


def _save(fig, fig_dir: Path, name: str) -> Path:
    fig_dir.mkdir(parents=True, exist_ok=True)
    out = fig_dir / f"{name}.png"
    fig.tight_layout()
    fig.savefig(out, dpi=140, bbox_inches="tight")
    plt.close(fig)
    print(f"[plot  ] {out}")
    return out


def plot_trips_per_hour(pdf: pd.DataFrame, fig_dir: Path):
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.barplot(data=pdf, x="pickup_hour", y="trip_count", ax=ax, color="#1f77b4")
    ax.set_title("NYC Yellow Taxi Demand by Hour of Day (Jan–Mar 2023)")
    ax.set_xlabel("Pickup hour (0–23)")
    ax.set_ylabel("Trip count")
    return _save(fig, fig_dir, "trips_per_hour")


def plot_trips_per_day(pdf: pd.DataFrame, fig_dir: Path):
    fig, ax = plt.subplots(figsize=(12, 5))
    ax.plot(pdf["pickup_date"], pdf["trip_count"], color="#d62728")
    ax.set_title("Daily Yellow Taxi Trip Volume (Jan–Mar 2023)")
    ax.set_xlabel("Date"); ax.set_ylabel("Trips per day")
    fig.autofmt_xdate()
    return _save(fig, fig_dir, "trips_per_day")


def plot_trips_per_dow(pdf: pd.DataFrame, fig_dir: Path):
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.barplot(data=pdf, x="dow_name", y="trip_count", ax=ax, color="#2ca02c")
    ax.set_title("Demand by Day of Week")
    ax.set_xlabel("Day of week"); ax.set_ylabel("Trip count")
    return _save(fig, fig_dir, "trips_per_dow")


def plot_busiest_zones(pdf: pd.DataFrame, fig_dir: Path, kind: str = "pickup"):
    col = f"{kind}_zone"
    fig, ax = plt.subplots(figsize=(10, 7))
    sns.barplot(data=pdf, y=col, x="trip_count", ax=ax, color="#ff7f0e")
    ax.set_title(f"Top 15 {kind.capitalize()} Zones")
    ax.set_xlabel("Trip count"); ax.set_ylabel("")
    return _save(fig, fig_dir, f"busiest_{kind}_zones")


def plot_passenger_distribution(pdf: pd.DataFrame, fig_dir: Path):
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.barplot(data=pdf, x="passenger_count", y="trip_count", ax=ax, color="#9467bd")
    ax.set_title("Passenger Count Distribution")
    ax.set_xlabel("Passengers"); ax.set_ylabel("Trip count")
    ax.set_yscale("log")
    return _save(fig, fig_dir, "passenger_distribution")


def plot_payment_breakdown(pdf: pd.DataFrame, fig_dir: Path):
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.barplot(data=pdf, x="payment_name", y="trip_count", ax=ax, color="#17becf")
    ax.set_title("Payment Type Breakdown")
    ax.set_xlabel("Payment type"); ax.set_ylabel("Trip count")
    for label in ax.get_xticklabels():
        label.set_rotation(20)
    return _save(fig, fig_dir, "payment_breakdown")


def plot_hour_zone_heatmap(pdf: pd.DataFrame, fig_dir: Path):
    pivot = pdf.pivot(index="pickup_zone", columns="pickup_hour", values="trip_count").fillna(0)
    pivot = pivot.loc[pivot.sum(axis=1).sort_values(ascending=False).index]
    fig, ax = plt.subplots(figsize=(14, 7))
    sns.heatmap(pivot, cmap="YlOrRd", ax=ax, cbar_kws={"label": "trips"})
    ax.set_title("Hourly Demand by Top Pickup Zone")
    ax.set_xlabel("Hour"); ax.set_ylabel("Pickup zone")
    return _save(fig, fig_dir, "hour_zone_heatmap")


def plot_fare_vs_distance(sample_pdf: pd.DataFrame, fig_dir: Path):
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.scatter(sample_pdf["trip_distance"], sample_pdf["fare_amount"],
               s=8, alpha=0.3, color="#1f77b4")
    ax.set_xlim(0, 30); ax.set_ylim(0, 120)
    ax.set_title("Fare vs. Trip Distance (10k sample)")
    ax.set_xlabel("Trip distance (miles)"); ax.set_ylabel("Fare amount ($)")
    return _save(fig, fig_dir, "fare_vs_distance")


def plot_model_metrics(metrics: Dict[str, Dict[str, float]], fig_dir: Path):
    mdf = pd.DataFrame(metrics).T.reset_index().rename(columns={"index": "model"})
    melted = mdf.melt(id_vars="model", var_name="metric", value_name="value")
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.barplot(data=melted, x="metric", y="value", hue="model", ax=ax)
    ax.set_title("Demand Prediction — Model Comparison")
    return _save(fig, fig_dir, "model_metrics")


def plot_feature_importance(pdf: pd.DataFrame, fig_dir: Path):
    fig, ax = plt.subplots(figsize=(9, 5))
    sns.barplot(data=pdf, y="feature", x="importance", ax=ax, color="#8c564b")
    ax.set_title("Random Forest — Feature Importance")
    return _save(fig, fig_dir, "feature_importance")


def plot_predicted_vs_actual(sample_pdf: pd.DataFrame, fig_dir: Path):
    fig, ax = plt.subplots(figsize=(7, 7))
    ax.scatter(sample_pdf["demand"], sample_pdf["prediction"], s=10, alpha=0.5)
    lims = [0, max(sample_pdf["demand"].max(), sample_pdf["prediction"].max()) * 1.05]
    ax.plot(lims, lims, "--", color="red", linewidth=1)
    ax.set_xlim(lims); ax.set_ylim(lims)
    ax.set_title("Predicted vs. Actual Hourly Demand (RF)")
    ax.set_xlabel("Actual demand"); ax.set_ylabel("Predicted demand")
    return _save(fig, fig_dir, "predicted_vs_actual")


def plot_anomaly_rule_counts(pdf: pd.DataFrame, fig_dir: Path):
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.barplot(data=pdf, x="rule", y="count", ax=ax, color="#e377c2")
    ax.set_title("Anomalies per Rule")
    ax.set_xlabel("Rule"); ax.set_ylabel("Flagged trips")
    for label in ax.get_xticklabels():
        label.set_rotation(25); label.set_ha("right")
    return _save(fig, fig_dir, "anomaly_rule_counts")


def plot_fare_box_with_bounds(df_pandas_sample: pd.DataFrame, bounds_df: pd.DataFrame, fig_dir: Path):
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    for ax, col in zip(axes, ["fare_amount", "trip_distance", "trip_duration_min"]):
        sns.boxplot(y=df_pandas_sample[col], ax=ax, color="#6baed6")
        b = bounds_df.set_index("column").loc[col]
        ax.axhline(b["upper"], linestyle="--", color="red", linewidth=1, label=f"upper={b['upper']:.1f}")
        ax.set_title(col); ax.legend(loc="upper right", fontsize=10)
    fig.suptitle("Boxplots with IQR Upper Bound")
    return _save(fig, fig_dir, "anomaly_boxplots")
