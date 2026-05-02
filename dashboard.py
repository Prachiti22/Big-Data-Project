"""
Streamlit dashboard for the NYC Yellow Taxi Big Data project.

Reads pre-computed CSVs from outputs/results/ — no Spark runtime needed.
Run with:
    streamlit run dashboard.py
"""
from pathlib import Path

import pandas as pd
import plotly.express as px
import streamlit as st

ROOT = Path(__file__).resolve().parent
RESULTS = ROOT / "outputs" / "results"

st.set_page_config(
    page_title="NYC Yellow Taxi Analytics",
    page_icon="🚕",
    layout="wide",
)


@st.cache_data
def load(name: str):
    path = RESULTS / name
    return pd.read_csv(path) if path.exists() else None


# ---------- Load all data ----------
summary        = load("summary_statistics.csv")
tph            = load("trips_per_hour.csv")
tpd            = load("trips_per_day.csv")
tpdow          = load("trips_per_day_of_week.csv")
busiest_pu     = load("busiest_pickup_zones.csv")
busiest_do     = load("busiest_dropoff_zones.csv")
passengers     = load("passenger_count_distribution.csv")
payments       = load("payment_type_breakdown.csv")
heatmap        = load("hour_zone_heatmap.csv")
feat_imp       = load("feature_importance.csv")
preds          = load("predictions_sample.csv")
model_metrics  = load("model_metrics.csv")
anom_summary   = load("anomaly_summary.csv")
anom_rules     = load("anomaly_rule_counts.csv")
anom_bounds    = load("anomaly_iqr_bounds.csv")
anom_samples   = load("anomaly_samples.csv")


# ---------- Header + KPIs ----------
st.title("🚕 NYC Yellow Taxi — Big Data Analytics")
st.caption("Apache Spark · MLlib · NYU CS-GY 6513 BIG DATA · Prof. Amit Patel")

k1, k2, k3, k4 = st.columns(4)
if anom_summary is not None:
    total = int(anom_summary.loc[anom_summary["metric"] == "total_trips", "value"].iloc[0])
    pct   = float(anom_summary.loc[anom_summary["metric"] == "pct_combined", "value"].iloc[0])
    k1.metric("Clean Trips", f"{total:,}")
    k2.metric("Anomaly Rate", f"{pct:.2f}%")
if model_metrics is not None:
    rf_r2  = float(model_metrics.loc[model_metrics["model"] == "Random Forest", "r2"].iloc[0])
    rf_mae = float(model_metrics.loc[model_metrics["model"] == "Random Forest", "mae"].iloc[0])
    k3.metric("Best Model R²", f"{rf_r2:.3f}", help="Random Forest")
    k4.metric("Best Model MAE", f"{rf_mae:.2f} trips", help="Random Forest")


# ---------- Tabs ----------
tab_overview, tab_temporal, tab_geo, tab_model, tab_anom = st.tabs(
    ["📊 Overview", "⏰ Temporal", "🗺️ Zones", "🤖 Model", "🚨 Anomalies"]
)


with tab_overview:
    st.subheader("Descriptive Statistics")
    if summary is not None:
        st.dataframe(summary, use_container_width=True, hide_index=True)

    c1, c2 = st.columns(2)
    with c1:
        st.subheader("Passenger Count")
        if passengers is not None:
            fig = px.bar(
                passengers, x="passenger_count", y="trip_count",
                log_y=True, color_discrete_sequence=["#FFB900"],
            )
            fig.update_layout(showlegend=False)
            st.plotly_chart(fig, use_container_width=True)
    with c2:
        st.subheader("Payment Type")
        if payments is not None:
            fig = px.pie(
                payments, names="payment_name", values="trip_count",
                color_discrete_sequence=px.colors.sequential.YlOrBr_r,
            )
            st.plotly_chart(fig, use_container_width=True)


with tab_temporal:
    st.subheader("Hourly Demand")
    if tph is not None:
        fig = px.bar(
            tph, x="pickup_hour", y="trip_count",
            labels={"pickup_hour": "Hour of day", "trip_count": "Trips"},
            color="trip_count", color_continuous_scale="YlOrRd",
        )
        fig.update_layout(coloraxis_showscale=False)
        st.plotly_chart(fig, use_container_width=True)
        peak_hour = int(tph.loc[tph["trip_count"].idxmax(), "pickup_hour"])
        st.caption(f"**Peak hour:** {peak_hour}:00 ({tph['trip_count'].max():,} trips).")

    st.subheader("Daily Volume (Jan–Mar 2023)")
    if tpd is not None:
        fig = px.line(
            tpd, x="pickup_date", y="trip_count",
            labels={"pickup_date": "Date", "trip_count": "Trips"},
        )
        fig.update_traces(line_color="#D90000")
        st.plotly_chart(fig, use_container_width=True)

    st.subheader("Demand by Day of Week")
    if tpdow is not None:
        fig = px.bar(
            tpdow, x="dow_name", y="trip_count",
            category_orders={"dow_name": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
            color_discrete_sequence=["#1F3A93"],
        )
        st.plotly_chart(fig, use_container_width=True)


with tab_geo:
    top_n = st.slider("Top N zones", 5, 15, 10)

    c1, c2 = st.columns(2)
    with c1:
        st.subheader("Top Pickup Zones")
        if busiest_pu is not None:
            df = busiest_pu.head(top_n).iloc[::-1]
            fig = px.bar(
                df, x="trip_count", y="pickup_zone", orientation="h",
                color="pickup_borough",
                color_discrete_sequence=px.colors.qualitative.Set2,
                labels={"trip_count": "Trips", "pickup_zone": ""},
            )
            st.plotly_chart(fig, use_container_width=True)
    with c2:
        st.subheader("Top Dropoff Zones")
        if busiest_do is not None:
            df = busiest_do.head(top_n).iloc[::-1]
            fig = px.bar(
                df, x="trip_count", y="dropoff_zone", orientation="h",
                color="dropoff_borough",
                color_discrete_sequence=px.colors.qualitative.Set2,
                labels={"trip_count": "Trips", "dropoff_zone": ""},
            )
            st.plotly_chart(fig, use_container_width=True)

    st.subheader("Hour × Zone Heatmap")
    if heatmap is not None:
        pivot = (
            heatmap.pivot(index="pickup_zone", columns="pickup_hour", values="trip_count")
            .fillna(0)
        )
        pivot = pivot.loc[pivot.sum(axis=1).sort_values(ascending=False).index]
        fig = px.imshow(
            pivot, aspect="auto",
            labels={"x": "Hour of day", "y": "Pickup zone", "color": "Trips"},
            color_continuous_scale="YlOrRd",
        )
        st.plotly_chart(fig, use_container_width=True)


with tab_model:
    st.subheader("Linear Regression vs. Random Forest")
    if model_metrics is not None:
        c1, c2 = st.columns([1, 2])
        with c1:
            st.dataframe(
                model_metrics.round(3), use_container_width=True, hide_index=True
            )
        with c2:
            melted = model_metrics.melt(id_vars="model", var_name="metric", value_name="value")
            fig = px.bar(
                melted, x="metric", y="value", color="model", barmode="group",
                color_discrete_sequence=["#1F3A93", "#FFB900"],
            )
            st.plotly_chart(fig, use_container_width=True)
        st.info(
            "Random Forest wins across RMSE, MAE, and R² — captures "
            "non-linear interactions between zone, hour, and day-of-week."
        )

    st.subheader("Feature Importance (Random Forest)")
    if feat_imp is not None:
        fig = px.bar(
            feat_imp.iloc[::-1], x="importance", y="feature", orientation="h",
            color="importance", color_continuous_scale="YlOrRd",
        )
        fig.update_layout(coloraxis_showscale=False)
        st.plotly_chart(fig, use_container_width=True)

    st.subheader("Predicted vs. Actual Demand (sample)")
    if preds is not None:
        fig = px.scatter(
            preds, x="demand", y="prediction",
            hover_data=["pickup_zone", "pickup_hour", "pickup_date"],
            opacity=0.55, color_discrete_sequence=["#1F3A93"],
        )
        m = float(max(preds["demand"].max(), preds["prediction"].max())) * 1.05
        fig.add_shape(type="line", x0=0, y0=0, x1=m, y1=m,
                      line=dict(dash="dash", color="red"))
        fig.update_layout(xaxis_title="Actual demand", yaxis_title="Predicted demand")
        st.plotly_chart(fig, use_container_width=True)


with tab_anom:
    if anom_summary is not None:
        c1, c2, c3, c4 = st.columns(4)
        get = lambda k: int(anom_summary.loc[anom_summary["metric"] == k, "value"].iloc[0])
        c1.metric("Total trips", f"{get('total_trips'):,}")
        c2.metric("Rule-based", f"{get('rule_anomalies'):,}")
        c3.metric("IQR-based", f"{get('iqr_anomalies'):,}")
        c4.metric("Combined", f"{get('combined_anomalies'):,}")

    st.subheader("Anomalies per Rule")
    if anom_rules is not None:
        fig = px.bar(
            anom_rules, x="rule", y="count", color="rule",
            color_discrete_sequence=px.colors.qualitative.Set2,
        )
        fig.update_layout(showlegend=False)
        st.plotly_chart(fig, use_container_width=True)

    st.subheader("IQR Outlier Bounds")
    if anom_bounds is not None:
        st.dataframe(anom_bounds.round(2), use_container_width=True, hide_index=True)

    st.subheader("Sample Flagged Trips")
    if anom_samples is not None and len(anom_samples) > 0:
        lo, hi = st.slider(
            "Filter by fare ($)",
            min_value=200.0, max_value=1000.0,
            value=(200.0, 1000.0),
            step=10.0,
        )
        filt = anom_samples[
            (anom_samples["fare_amount"] >= lo) & (anom_samples["fare_amount"] <= hi)
        ]
        st.caption(f"Showing {len(filt):,} of {len(anom_samples):,} flagged trips")
        st.dataframe(filt, use_container_width=True, hide_index=True)


# ---------- Sidebar ----------
with st.sidebar:
    st.header("About")
    st.write(
        "End-to-end PySpark pipeline on NYC TLC Yellow Taxi data "
        "(Jan–Mar 2023). Covers ingestion, cleaning, descriptive "
        "analytics, demand forecasting, and anomaly detection."
    )
    st.divider()
    st.subheader("Team")
    st.write("Prachiti Kulkarni · Ninad Rade · Roshi Bhati")
    st.caption("NYU Tandon · Prof. Amit Patel")
    st.divider()
    st.subheader("Stack")
    st.write("Spark 3.5 · MLlib · Pandas · Plotly · Streamlit")
