"""
Demand prediction using Spark MLlib.

Aggregates trips to (pickup_zone, pickup_hour, day_of_week, date) buckets and
trains Linear Regression and Random Forest models to predict trips-per-bucket.
"""
from pathlib import Path
from typing import Dict

import pandas as pd
from pyspark.ml import Pipeline
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.feature import StringIndexer, VectorAssembler
from pyspark.ml.regression import LinearRegression, RandomForestRegressor
from pyspark.sql import DataFrame
from pyspark.sql import functions as F


def build_demand_dataset(df: DataFrame) -> DataFrame:
    """Aggregate trips into hourly demand per pickup zone."""
    return (
        df.groupBy(
            "pickup_date",
            "pickup_hour",
            "pickup_day_of_week",
            "is_weekend",
            "PULocationID",
            "pickup_zone",
            "pickup_borough",
        )
        .agg(
            F.count("*").alias("demand"),
            F.avg("trip_distance").alias("avg_distance"),
            F.avg("fare_amount").alias("avg_fare"),
        )
        .where(F.col("pickup_zone").isNotNull())
    )


def train_demand_models(df: DataFrame, seed: int = 42) -> Dict[str, object]:
    """
    Train Linear Regression and Random Forest models predicting hourly demand.
    Returns a dict with fitted pipelines and evaluation metrics.
    """
    demand = build_demand_dataset(df)
    print(f"[model ] demand rows: {demand.count():,}")

    borough_indexer = StringIndexer(
        inputCol="pickup_borough", outputCol="borough_idx", handleInvalid="keep"
    )
    feature_cols = [
        "pickup_hour",
        "pickup_day_of_week",
        "is_weekend",
        "PULocationID",
        "borough_idx",
        "avg_distance",
        "avg_fare",
    ]
    assembler = VectorAssembler(
        inputCols=feature_cols, outputCol="features", handleInvalid="skip"
    )

    train, test = demand.randomSplit([0.8, 0.2], seed=seed)
    train.cache(); test.cache()

    lr = LinearRegression(featuresCol="features", labelCol="demand")
    rf = RandomForestRegressor(
        featuresCol="features", labelCol="demand",
        numTrees=60, maxDepth=10, seed=seed,
    )

    lr_pipeline = Pipeline(stages=[borough_indexer, assembler, lr])
    rf_pipeline = Pipeline(stages=[borough_indexer, assembler, rf])

    print("[model ] training Linear Regression...")
    lr_model = lr_pipeline.fit(train)
    print("[model ] training Random Forest...")
    rf_model = rf_pipeline.fit(train)

    metrics = {
        "Linear Regression": _evaluate(lr_model, test),
        "Random Forest": _evaluate(rf_model, test),
    }
    for name, m in metrics.items():
        print(f"[model ] {name:20s} RMSE={m['rmse']:.3f}  MAE={m['mae']:.3f}  R2={m['r2']:.3f}")

    return {
        "demand_df": demand,
        "train": train,
        "test": test,
        "lr_model": lr_model,
        "rf_model": rf_model,
        "metrics": metrics,
    }


def _evaluate(model, test_df: DataFrame) -> Dict[str, float]:
    predictions = model.transform(test_df)
    out = {}
    for metric in ("rmse", "mae", "r2"):
        evaluator = RegressionEvaluator(
            labelCol="demand", predictionCol="prediction", metricName=metric
        )
        out[metric] = float(evaluator.evaluate(predictions))
    return out


def feature_importance_pdf(rf_model, feature_names) -> pd.DataFrame:
    """Return a Pandas DataFrame of feature importances from the fitted RF."""
    rf_stage = rf_model.stages[-1]
    importances = rf_stage.featureImportances.toArray()
    return (
        pd.DataFrame({"feature": feature_names, "importance": importances})
        .sort_values("importance", ascending=False)
        .reset_index(drop=True)
    )


def save_predictions_sample(rf_model, test_df: DataFrame, path: Path, n: int = 200) -> pd.DataFrame:
    """Save a sample of predictions vs. actuals for plotting / inspection."""
    sample = (
        rf_model.transform(test_df)
        .select("pickup_date", "pickup_hour", "pickup_zone", "demand", "prediction")
        .orderBy(F.rand(seed=0))
        .limit(n)
        .toPandas()
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    sample.to_csv(path, index=False)
    return sample
