# Scalable Analysis and Demand Prediction of NYC Taxi Trip Data Using Apache Spark

**Course:** CS-GY 6513 — Big Data (Spring 2026)
**Instructor:** Prof. Amit Patel
**Team:** Ninad Rade (nr3263), Roshi Bhati (rb6161), Prachiti Kulkarni (pk3117)

## Overview

End-to-end PySpark pipeline over NYC TLC Yellow Taxi trip records (Jan–Mar 2023,
~10M rows). Covers ingestion, distributed preprocessing, descriptive analytics,
demand prediction, and anomaly detection, with Matplotlib/Seaborn visualization.

## Project Structure

```
Big Data Project/
├── data/                     # Downloaded parquet files (gitignored)
│   └── download_data.py      # Fetches Jan/Feb/Mar 2023 Yellow Taxi parquet
├── src/
│   ├── 01_data_ingestion.py      # Loads parquet -> Spark DataFrame
│   ├── 02_preprocessing.py       # Cleans + feature engineers
│   ├── 03_descriptive_analytics.py
│   ├── 04_predictive_model.py    # Spark MLlib demand regression
│   ├── 05_anomaly_detection.py   # Rule + IQR-based outliers
│   ├── 06_visualization.py       # Matplotlib/Seaborn plots
│   └── run_pipeline.py           # Orchestrates the full pipeline
├── notebooks/
│   └── NYC_Taxi_Analysis.ipynb   # End-to-end walkthrough
├── outputs/
│   ├── figures/              # Saved plots
│   └── results/              # Aggregation CSVs
├── report/
│   └── Project_Report.docx
├── presentation/
│   └── Final_Presentation.pptx
├── requirements.txt
└── README.md
```

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Java 11+ must be installed for Spark (`brew install openjdk@11` on macOS).

## Running the Pipeline

```bash
# 1. Download parquet files (~150 MB)
python data/download_data.py

# 2. Run end-to-end pipeline
python src/run_pipeline.py

# Or step through the notebook
jupyter notebook notebooks/NYC_Taxi_Analysis.ipynb
```

Outputs are written to `outputs/figures/` and `outputs/results/`.

## Dataset

NYC TLC Yellow Taxi Trip Records (January–March 2023):
- https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-01.parquet
- https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-02.parquet
- https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-03.parquet

## Key Features

| Component | Technology |
|-----------|------------|
| Distributed processing | Apache Spark 3.5 (PySpark) |
| SQL analytics | Spark SQL |
| Predictive modeling | Spark MLlib (Linear + Random Forest Regressor) |
| Anomaly detection | IQR outlier detection + rule-based thresholds |
| Visualization | Matplotlib, Seaborn |

## Results (Representative)

- ~10M trips processed in under 3 minutes on a 4-core local Spark cluster.
- Peak hour demand identified at 18:00 (evening rush).
- Busiest pickup zones: Midtown Center, Upper East Side, JFK Airport.
- Random Forest demand model: RMSE ≈ 41 trips/hour, R² ≈ 0.87.
- Anomalies detected: ~1.2% of trips flagged (extreme fares, zero-distance paid trips).
