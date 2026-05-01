"""
Data ingestion: loads the three monthly parquet files into a single Spark
DataFrame and joins the zone lookup for human-readable borough/zone names.
"""
from functools import reduce
from pathlib import Path

from pyspark.sql import DataFrame, SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import LongType, DoubleType, IntegerType

from .config import DATA_DIR, ZONE_LOOKUP


# Canonical dtype for each column across monthly files. NYC TLC publishes
# different integer widths (INT32 vs INT64) for the same column across months,
# which breaks Spark's vectorized reader when loading via a glob. We read each
# file separately and coerce to these canonical types before unioning.
_CANONICAL_TYPES = {
    "VendorID":              LongType(),
    "passenger_count":       LongType(),
    "RatecodeID":            LongType(),
    "PULocationID":          LongType(),
    "DOLocationID":          LongType(),
    "payment_type":          LongType(),
    "trip_distance":         DoubleType(),
    "fare_amount":           DoubleType(),
    "extra":                 DoubleType(),
    "mta_tax":               DoubleType(),
    "tip_amount":            DoubleType(),
    "tolls_amount":          DoubleType(),
    "improvement_surcharge": DoubleType(),
    "total_amount":          DoubleType(),
    "congestion_surcharge":  DoubleType(),
    "airport_fee":           DoubleType(),
}


def _normalize(df: DataFrame) -> DataFrame:
    """Cast known columns to canonical types so monthly files can be unioned."""
    for col, dtype in _CANONICAL_TYPES.items():
        if col in df.columns:
            df = df.withColumn(col, F.col(col).cast(dtype))
    return df


def load_trips(spark: SparkSession) -> DataFrame:
    """Load Jan/Feb/Mar 2023 Yellow Taxi parquet files into one DataFrame.

    Reads each monthly parquet file individually, normalizes column dtypes,
    then unions them with allowMissingColumns so a month that is missing
    airport_fee (or similar) does not break the merge.
    """
    files = sorted(Path(DATA_DIR).glob("yellow_tripdata_2023-*.parquet"))
    if not files:
        raise FileNotFoundError(
            f"No yellow_tripdata_2023-*.parquet files found in {DATA_DIR}. "
            "Run `python data/download_data.py` first."
        )

    dfs = [_normalize(spark.read.parquet(str(f))) for f in files]
    out = reduce(lambda a, b: a.unionByName(b, allowMissingColumns=True), dfs)

    print(f"[ingest] files   : {len(files)}")
    print(f"[ingest] raw rows: {out.count():,}")
    print(f"[ingest] columns : {out.columns}")
    return out


def load_zones(spark: SparkSession) -> DataFrame:
    """Load taxi zone lookup table as a Spark DataFrame."""
    return (
        spark.read.option("header", True)
        .option("inferSchema", True)
        .csv(str(ZONE_LOOKUP))
    )


def attach_zone_names(trips: DataFrame, zones: DataFrame) -> DataFrame:
    """Join human-readable borough/zone names for pickup and dropoff IDs."""
    # Cast LocationID to long so it matches the trips-side IDs (long).
    zones = zones.withColumn("LocationID", F.col("LocationID").cast("long"))
    pickup = zones.selectExpr(
        "LocationID as PULocationID",
        "Borough as pickup_borough",
        "Zone as pickup_zone",
    )
    dropoff = zones.selectExpr(
        "LocationID as DOLocationID",
        "Borough as dropoff_borough",
        "Zone as dropoff_zone",
    )
    return trips.join(pickup, "PULocationID", "left").join(dropoff, "DOLocationID", "left")
