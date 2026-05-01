"""
Preprocessing: drop nulls on critical columns, filter invalid records,
and derive time-based features (hour, day of week, trip duration).
"""
from pyspark.sql import DataFrame
from pyspark.sql import functions as F

REQUIRED_COLS = [
    "tpep_pickup_datetime",
    "tpep_dropoff_datetime",
    "passenger_count",
    "trip_distance",
    "PULocationID",
    "DOLocationID",
    "fare_amount",
    "total_amount",
]


def drop_nulls(df: DataFrame) -> DataFrame:
    """Drop rows with null values in required columns."""
    return df.dropna(subset=REQUIRED_COLS)


def filter_invalid(df: DataFrame) -> DataFrame:
    """
    Remove records that can't be real trips:
      - pickup >= dropoff
      - pickup outside Jan-Mar 2023 window
      - non-positive distance or fare
      - passenger count outside [1, 8]
    """
    pickup = F.col("tpep_pickup_datetime")
    dropoff = F.col("tpep_dropoff_datetime")
    return df.where(
        (pickup < dropoff)
        & (pickup >= F.lit("2023-01-01"))
        & (pickup < F.lit("2023-04-01"))
        & (F.col("trip_distance") > 0)
        & (F.col("fare_amount") > 0)
        & (F.col("total_amount") > 0)
        & (F.col("passenger_count").between(1, 8))
    )


def add_time_features(df: DataFrame) -> DataFrame:
    """Derive trip duration (minutes), hour, day-of-week, and date columns."""
    duration_sec = F.unix_timestamp("tpep_dropoff_datetime") - F.unix_timestamp(
        "tpep_pickup_datetime"
    )
    return (
        df.withColumn("trip_duration_min", F.round(duration_sec / 60.0, 2))
        .withColumn("pickup_hour", F.hour("tpep_pickup_datetime"))
        .withColumn("pickup_day_of_week", F.dayofweek("tpep_pickup_datetime"))
        .withColumn("pickup_date", F.to_date("tpep_pickup_datetime"))
        .withColumn("pickup_month", F.month("tpep_pickup_datetime"))
        .withColumn("is_weekend", F.col("pickup_day_of_week").isin(1, 7).cast("int"))
        .withColumn(
            "avg_speed_mph",
            F.when(
                F.col("trip_duration_min") > 0,
                F.col("trip_distance") / (F.col("trip_duration_min") / 60.0),
            ).otherwise(F.lit(None)),
        )
    )


def preprocess(df: DataFrame) -> DataFrame:
    """Full preprocessing pipeline. Caches result for downstream reuse."""
    before = df.count()
    df = drop_nulls(df)
    df = filter_invalid(df)
    df = add_time_features(df)
    after = df.count()
    dropped_pct = 100 * (before - after) / max(before, 1)
    print(f"[clean ] kept {after:,} / {before:,} rows ({dropped_pct:.2f}% dropped)")
    return df.cache()
