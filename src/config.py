"""Central configuration for paths and Spark settings."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
OUTPUT_DIR = ROOT / "outputs"
FIG_DIR = OUTPUT_DIR / "figures"
RESULTS_DIR = OUTPUT_DIR / "results"

PARQUET_GLOB = str(DATA_DIR / "yellow_tripdata_2023-*.parquet")
ZONE_LOOKUP = DATA_DIR / "taxi_zone_lookup.csv"

SPARK_APP_NAME = "NYC_Yellow_Taxi_Analytics"

# Keep runs reproducible and bounded in memory for local execution.
SPARK_CONF = {
    "spark.sql.shuffle.partitions": "64",
    "spark.driver.memory": "4g",
    "spark.executor.memory": "4g",
    "spark.sql.parquet.enableVectorizedReader": "true",
    "spark.sql.session.timeZone": "America/New_York",
}

for d in (OUTPUT_DIR, FIG_DIR, RESULTS_DIR):
    d.mkdir(parents=True, exist_ok=True)
