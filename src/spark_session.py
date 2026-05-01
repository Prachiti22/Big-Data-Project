"""Shared Spark session factory."""
from pyspark.sql import SparkSession
from .config import SPARK_APP_NAME, SPARK_CONF


def get_spark(app_name: str = SPARK_APP_NAME) -> SparkSession:
    """Return a singleton Spark session configured for this project."""
    builder = SparkSession.builder.appName(app_name)
    for k, v in SPARK_CONF.items():
        builder = builder.config(k, v)
    spark = builder.getOrCreate()
    spark.sparkContext.setLogLevel("WARN")
    return spark
