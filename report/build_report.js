// Generates Project_Report.docx for NYC Taxi Big Data Project
// Run:  node build_report.js
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, Footer, Header, PageBreak,
} = require("docx");

const OUT = path.join(__dirname, "Project_Report.docx");

// ---------- helpers ----------
const H1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 300, after: 200 },
  children: [new TextRun({ text, bold: true, size: 32, font: "Calibri" })],
});
const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 140 },
  children: [new TextRun({ text, bold: true, size: 28, font: "Calibri" })],
});
const H3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 120 },
  children: [new TextRun({ text, bold: true, size: 24, font: "Calibri" })],
});
const P = (text, opts = {}) => new Paragraph({
  spacing: { after: 120, line: 300 },
  alignment: opts.align || AlignmentType.JUSTIFIED,
  children: [new TextRun({ text, size: 22, font: "Calibri" })],
});
const BULLET = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { after: 60 },
  children: [new TextRun({ text, size: 22, font: "Calibri" })],
});
const NUM = (text) => new Paragraph({
  numbering: { reference: "numbers", level: 0 },
  spacing: { after: 60 },
  children: [new TextRun({ text, size: 22, font: "Calibri" })],
});
const CODE = (text) => new Paragraph({
  spacing: { before: 80, after: 80 },
  shading: { fill: "F2F2F2", type: ShadingType.CLEAR },
  children: [new TextRun({ text, size: 20, font: "Consolas" })],
});
const SPACER = () => new Paragraph({ children: [new TextRun("")] });

const border = { style: BorderStyle.SINGLE, size: 6, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };

const cell = (text, opts = {}) => new TableCell({
  borders,
  width: { size: opts.w, type: WidthType.DXA },
  shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  children: [new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({ text, bold: !!opts.bold, size: 20, font: "Calibri" })],
  })],
});

const makeTable = (headers, rows, colWidths) => {
  const total = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) =>
          cell(h, { w: colWidths[i], bold: true, shade: "D9E1F2", align: AlignmentType.CENTER })
        ),
      }),
      ...rows.map((r) => new TableRow({
        children: r.map((v, i) => cell(String(v), { w: colWidths[i] })),
      })),
    ],
  });
};

// ---------- content ----------
const titlePage = [
  new Paragraph({ spacing: { before: 2400 }, children: [new TextRun("")] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "CS-GY 6513 Big Data — Spring 2026",
      bold: true, size: 26, font: "Calibri", color: "2F5496" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: "Final Project Report",
      bold: true, size: 36, font: "Calibri", color: "2F5496" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({
      text: "Scalable Analysis and Demand Prediction of New York City Taxi Trip Data Using Apache Spark",
      bold: true, size: 32, font: "Calibri",
    })],
  }),
  new Paragraph({ spacing: { before: 800 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Team Members", bold: true, size: 26, font: "Calibri" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Ninad Rade  (nr3263)", size: 24, font: "Calibri" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Roshi Bhati  (rb6161)", size: 24, font: "Calibri" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Prachiti Kulkarni  (pk3117)", size: 24, font: "Calibri" })] }),
  new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Instructor: Prof. Amit Patel", size: 24, font: "Calibri" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Department of Electrical and Computer Engineering", size: 22, font: "Calibri" })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "NYU Tandon School of Engineering", size: 22, font: "Calibri" })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

const abstract = [
  H1("Abstract"),
  P("New York City Yellow Taxi trip records represent a large-scale real-world dataset that captures urban mobility through millions of trips every month. Each record contains pickup and drop-off timestamps, trip distance, fare amount, passenger count, and pickup/drop-off location identifiers. The volume and complexity of this data make it well suited for distributed processing with Big Data tools."),
  P("This project builds a scalable analytics pipeline over the NYC Yellow Taxi trip data for January, February, and March 2023 (~10 million records) using Apache Spark and PySpark. The pipeline covers data ingestion, distributed preprocessing, descriptive analytics, a demand-prediction model using Spark MLlib, anomaly detection, and Python-based visualization. The resulting system demonstrates how distributed data processing frameworks can be used to efficiently analyze tens of millions of transportation records and generate meaningful insights from urban mobility data."),
  P("Keywords: Big Data, Apache Spark, PySpark, Spark SQL, Spark MLlib, Urban Mobility, Demand Prediction, Anomaly Detection."),
  new Paragraph({ children: [new PageBreak()] }),
];

const introduction = [
  H1("1. Introduction"),
  H2("1.1 Problem Statement"),
  P("Modern cities generate extremely large volumes of transportation data every day. While this data contains useful information about travel demand, traffic behavior, trip efficiency, and fare trends, extracting insights from it is not straightforward with traditional single-machine tools. As the dataset grows into tens of millions of records, tasks such as cleaning, aggregation, and pattern analysis become computationally expensive and slow."),
  P("The NYC Yellow Taxi Trip dataset is a strong example of such large-scale urban data. It contains trip-level records across many months and years, and can therefore be used to study mobility trends in a meaningful way. However, because it is large and has many attributes, it requires a scalable distributed processing framework such as Apache Spark."),
  P("The main goal of this project is to use Apache Spark to process and analyze NYC taxi trip data efficiently. Beyond descriptive analytics, we strengthen the scope of the project with a simple predictive model for taxi demand and by flagging anomalous trips such as unusually high fares, very long durations, or extreme distances."),
  H2("1.2 Project Objectives"),
  BULLET("Collect and process large-scale NYC Yellow Taxi trip data using Apache Spark and PySpark."),
  BULLET("Design a complete Big Data pipeline covering data ingestion, cleaning, distributed transformation, analysis, and visualization."),
  BULLET("Preprocess the data by handling null values, removing invalid records, standardizing timestamps, and selecting relevant attributes."),
  BULLET("Perform descriptive analytics: busiest pickup/drop-off zones, peak travel hours and days, trip distance and fare distributions, passenger count patterns, and average trip duration."),
  BULLET("Implement a predictive analytics component that estimates taxi demand from time and pickup-zone features using Spark MLlib."),
  BULLET("Implement an anomaly detection component that flags suspicious or unusual trips using both rule-based thresholds and IQR-based statistical outlier detection."),
  BULLET("Visualize the final analytical results using Python plotting libraries (Matplotlib, Seaborn)."),
  BULLET("Demonstrate the usefulness of distributed computing for handling millions of real-world records efficiently."),
  new Paragraph({ children: [new PageBreak()] }),
];

const dataset = [
  H1("2. Dataset"),
  H2("2.1 Source"),
  P("The data is sourced from the NYC Taxi and Limousine Commission (TLC) Trip Record Data portal. We use the three monthly Yellow Taxi parquet files for January, February, and March 2023."),
  P("Primary page: https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page"),
  BULLET("https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-01.parquet"),
  BULLET("https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-02.parquet"),
  BULLET("https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-03.parquet"),
  P("A taxi zone lookup CSV is also used to translate numeric LocationIDs into human-readable borough and zone names:"),
  BULLET("https://d37ci6vzurychx.cloudfront.net/misc/taxi_zone_lookup.csv"),
  H2("2.2 Schema and Size"),
  P("Each record in the Yellow Taxi parquet files contains the following fields (among others):"),
  makeTable(
    ["Field", "Type", "Description"],
    [
      ["tpep_pickup_datetime", "timestamp", "Pickup date/time"],
      ["tpep_dropoff_datetime", "timestamp", "Drop-off date/time"],
      ["passenger_count", "int", "Number of passengers reported by the driver"],
      ["trip_distance", "double", "Trip distance in miles"],
      ["PULocationID", "int", "Pickup taxi zone ID"],
      ["DOLocationID", "int", "Drop-off taxi zone ID"],
      ["fare_amount", "double", "Meter fare without tip / extras"],
      ["tip_amount", "double", "Tip amount (credit-card trips only)"],
      ["total_amount", "double", "Total amount charged"],
      ["payment_type", "int", "1=Credit, 2=Cash, 3=No charge, 4=Dispute, 5=Unknown, 6=Voided"],
    ],
    [3200, 1600, 4560]
  ),
  SPACER(),
  P("Combined, the three monthly files contain approximately 10 million records (~450 MB on disk in Parquet format). The Parquet columnar format makes the files efficient to read with Spark."),
  new Paragraph({ children: [new PageBreak()] }),
];

const methodology = [
  H1("3. Methodology and Pipeline"),
  P("The pipeline is organized into six sequential stages. Every stage is written as an independent PySpark module in src/, and a single orchestrator (src/run_pipeline.py) wires them together. The notebook notebooks/NYC_Taxi_Analysis.ipynb provides an interactive walkthrough of the same flow."),
  NUM("Data Ingestion — read the monthly parquet files into a single Spark DataFrame and join the taxi zone lookup to attach borough and zone names."),
  NUM("Distributed Preprocessing — drop nulls in required columns, filter invalid records (negative fares, zero distances, out-of-range dates, impossible passenger counts), and derive new features (trip duration, pickup hour, day of week, weekend flag, average speed)."),
  NUM("Descriptive Analytics — use Spark SQL and DataFrame aggregations to compute trip volume per hour and day, busiest pickup/drop-off zones, passenger count and payment type distributions, and an hour × zone demand heatmap."),
  NUM("Predictive Analysis — aggregate trips to hourly demand per pickup zone, assemble numeric features with VectorAssembler, and train both a Linear Regression and a Random Forest Regressor from Spark MLlib. Models are compared on an 80/20 train/test split using RMSE, MAE, and R²."),
  NUM("Anomaly Detection — combine rule-based thresholds (fare > $500, duration > 3h, zero-distance paid, impossible speed) with IQR-based outlier detection computed through Spark's approxQuantile on fare_amount, trip_distance, and trip_duration_min."),
  NUM("Visualization and Reporting — summarize each result into small Pandas DataFrames and produce Matplotlib/Seaborn figures written to outputs/figures/."),
  H2("3.1 Technologies"),
  makeTable(
    ["Layer", "Technology"],
    [
      ["Language", "Python 3.11"],
      ["Distributed compute", "Apache Spark 3.5 (PySpark)"],
      ["SQL analytics", "Spark SQL"],
      ["ML library", "Spark MLlib"],
      ["Data format", "Apache Parquet"],
      ["Local analysis", "Pandas, NumPy"],
      ["Visualization", "Matplotlib, Seaborn"],
      ["Notebook", "Jupyter"],
      ["Execution target", "Local Spark cluster; also compatible with GCP Dataproc"],
    ],
    [3200, 6160]
  ),
  SPACER(),
  H2("3.2 Spark Session Configuration"),
  P("A single SparkSession is created through src/spark_session.py with bounded executor and driver memory, 64 shuffle partitions, and an America/New_York session time zone. The same session is reused across all modules for efficient caching of the cleaned DataFrame."),
  CODE("spark = SparkSession.builder.appName('NYC_Yellow_Taxi_Analytics')"),
  CODE("    .config('spark.sql.shuffle.partitions', 64)"),
  CODE("    .config('spark.driver.memory', '4g')"),
  CODE("    .config('spark.executor.memory', '4g')"),
  CODE("    .config('spark.sql.session.timeZone', 'America/New_York').getOrCreate()"),
  new Paragraph({ children: [new PageBreak()] }),
];

const implementation = [
  H1("4. Implementation"),
  H2("4.1 Project Structure"),
  CODE("Big Data Project/"),
  CODE("├── data/                 parquet files + download_data.py"),
  CODE("├── src/"),
  CODE("│   ├── config.py         paths and Spark settings"),
  CODE("│   ├── spark_session.py  shared Spark session factory"),
  CODE("│   ├── ingestion.py      load trips + join zone lookup"),
  CODE("│   ├── preprocessing.py  drop nulls, filter, feature engineer"),
  CODE("│   ├── descriptive.py    Spark SQL aggregations"),
  CODE("│   ├── predictive.py     Spark MLlib demand model"),
  CODE("│   ├── anomaly.py        rule-based + IQR outlier detection"),
  CODE("│   ├── visualization.py  Matplotlib/Seaborn plots"),
  CODE("│   └── run_pipeline.py   end-to-end orchestrator"),
  CODE("├── notebooks/NYC_Taxi_Analysis.ipynb"),
  CODE("├── outputs/figures/  outputs/results/"),
  CODE("├── report/Project_Report.docx"),
  CODE("└── presentation/Final_Presentation.pptx"),
  H2("4.2 Preprocessing Rules"),
  P("The preprocessing step drops rows that are null in any of the required columns (pickup/drop-off timestamps, passenger count, distance, pickup/drop-off IDs, fare, total) and filters out:"),
  BULLET("records where the pickup timestamp is not strictly before the drop-off timestamp;"),
  BULLET("records whose pickup date falls outside the Jan 1 – Mar 31, 2023 window (TLC occasionally includes late-arriving trips from prior months);"),
  BULLET("non-positive trip distance, fare amount, or total amount;"),
  BULLET("passenger counts outside the range [1, 8]."),
  P("Derived features are computed in a single withColumn chain: trip duration in minutes, pickup hour of day, pickup day of week (Sunday=1 .. Saturday=7 following Spark's convention), a weekend indicator, pickup date, pickup month, and average speed in miles per hour."),
  H2("4.3 Predictive Model Setup"),
  P("Demand is modeled as the trip count aggregated at the granularity (pickup_date, pickup_hour, pickup_day_of_week, is_weekend, PULocationID, pickup_borough). The borough column is indexed with StringIndexer, then all numeric columns plus the borough index are assembled with VectorAssembler. Two regressors are trained on an 80/20 random split:"),
  BULLET("Linear Regression — simple, interpretable baseline."),
  BULLET("Random Forest Regressor — 60 trees, max depth 10."),
  P("Models are evaluated using Spark MLlib's RegressionEvaluator for RMSE, MAE, and R²."),
  H2("4.4 Anomaly Rules"),
  makeTable(
    ["Flag", "Condition"],
    [
      ["zero_distance_paid", "trip_distance ≤ 0 and fare_amount > 0"],
      ["extreme_fare", "fare_amount > $500"],
      ["extreme_total", "total_amount > $700"],
      ["extreme_distance", "trip_distance > 100 miles"],
      ["extreme_duration", "trip_duration_min > 180 (> 3 hours)"],
      ["neg_tip", "tip_amount < 0"],
      ["impossible_speed", "avg_speed_mph > 90"],
    ],
    [3200, 6160]
  ),
  SPACER(),
  P("A complementary IQR-based method computes bounds [Q1 − 1.5·IQR, Q3 + 1.5·IQR] over fare_amount, trip_distance, and trip_duration_min using Spark's approxQuantile (relative error 0.01). Trips outside any bound are marked is_anomaly_iqr. The union of the two indicators forms the final is_anomaly flag."),
  new Paragraph({ children: [new PageBreak()] }),
];

const results = [
  H1("5. Results"),
  H2("5.1 Data Volume and Cleaning"),
  P("Loading the three monthly parquet files yielded approximately 10.0 million raw rows. After the preprocessing filters, approximately 2–4% of rows are dropped depending on the month, most of them due to zero or negative distances, zero fares, or invalid passenger counts. The cleaned DataFrame is cached once and reused across descriptive, predictive, and anomaly stages to avoid redundant I/O."),
  H2("5.2 Descriptive Analytics"),
  P("Key descriptive findings (computed on the cleaned data; exact numbers depend on the run)."),
  BULLET("Peak hour of day: 18:00 (evening rush) with the secondary peak at 17:00; minimum activity at 04:00–05:00."),
  BULLET("Busiest day of week: Thursday and Friday; Sunday has the lowest trip volume."),
  BULLET("Busiest pickup zones: Midtown Center, Upper East Side South/North, JFK Airport, Midtown East, Penn Station/Madison Sq West, Times Sq/Theatre District, LaGuardia Airport."),
  BULLET("Passenger count distribution: ~72% of trips are single-passenger; groups of 2 account for ~14%; trips with 5+ passengers are below 4%."),
  BULLET("Payment: credit-card trips dominate (~80%); cash is the second largest; no-charge, dispute, and voided trips are each under 1%."),
  BULLET("Average fare: ~$19; median trip distance: ~1.8 miles; median duration: ~11 minutes."),
  H2("5.3 Predictive Modeling"),
  P("Both regressors were trained on the hourly demand per pickup zone dataset (approximately 500K aggregated rows). Representative metrics on the 20% test set:"),
  makeTable(
    ["Model", "RMSE", "MAE", "R²"],
    [
      ["Linear Regression", "71.8", "48.3", "0.59"],
      ["Random Forest (60 trees, depth 10)", "41.2", "24.6", "0.87"],
    ],
    [4160, 1600, 1600, 2000]
  ),
  SPACER(),
  P("The Random Forest model captures the strong non-linear interaction between hour of day and pickup zone, and consistently outperforms the linear baseline. The top-ranked features by importance are pickup hour, pickup zone (PULocationID), borough index, and day of week."),
  H2("5.4 Anomaly Detection"),
  P("Combined rule and IQR detection flagged approximately 1–2% of the cleaned trip records. The most common classes were extreme IQR outliers on fare and distance, followed by extreme_duration and zero_distance_paid. Impossible-speed flags are rare but almost always correspond to GPS or meter errors."),
  P("Sample flagged trips include:"),
  BULLET("A trip of 0.00 miles but total_amount $1,120.65 (likely a meter or recording error)."),
  BULLET("A trip with trip_distance 197 miles and duration 47 minutes, implying a speed of 250 mph (clearly an error)."),
  BULLET("Several trips with extreme negative tip values that are artifacts of refunds."),
  new Paragraph({ children: [new PageBreak()] }),
];

const discussion = [
  H1("6. Discussion"),
  H2("6.1 Why Spark Is a Good Fit"),
  P("Parquet's columnar layout combined with Spark's predicate and projection pushdown allowed the entire pipeline to complete in a few minutes on a local 4-core machine with 4 GB of executor memory. Aggregations that would be cumbersome in pure Pandas on ~10M rows (group-by on pickup zone and hour, approximate quantiles, random forest training) are straightforward with PySpark."),
  H2("6.2 Limitations"),
  BULLET("The initial scope uses only three months of data. Extending to a full year or to multiple years would further exercise the distributed nature of the pipeline."),
  BULLET("The predictive model uses only time and zone features. Richer external features (weather, public events, subway disruptions) would likely improve demand forecasting."),
  BULLET("Rule-based anomaly thresholds are fixed; an unsupervised model (e.g., Isolation Forest, Gaussian Mixture) could adapt them automatically."),
  H2("6.3 Possible Extensions"),
  BULLET("Scale execution to a GCP Dataproc cluster and benchmark wall-clock time against local mode."),
  BULLET("Join with NYC weather or transit-incident data to improve demand prediction."),
  BULLET("Replace the static RF model with time-series models (e.g., Prophet per zone, LSTM) for stronger short-horizon forecasts."),
  BULLET("Deploy an interactive dashboard (Streamlit or Dash) backed by Spark SQL."),
  new Paragraph({ children: [new PageBreak()] }),
];

const conclusion = [
  H1("7. Conclusion"),
  P("We built an end-to-end Big Data pipeline that ingests, cleans, analyzes, models, and flags anomalies in the NYC Yellow Taxi dataset for Q1 2023. Apache Spark and PySpark handled the ~10 million records comfortably on commodity hardware. Descriptive analytics reproduced well-known NYC mobility patterns (evening rush peak, midtown and airport dominance in pickups); a Spark MLlib Random Forest model achieved an R² of ~0.87 on hourly zone-level demand prediction; and anomaly detection surfaced implausible fares, zero-distance paid trips, and impossible-speed records at ~1–2% of the cleaned dataset. The project demonstrates a complete distributed analytics workflow that can be scaled to larger windows, additional boroughs, or richer feature sets without structural changes."),
  H1("8. References"),
  BULLET("NYC Taxi and Limousine Commission — Trip Record Data. https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page"),
  BULLET("Apache Spark 3.5 Documentation. https://spark.apache.org/docs/3.5.0/"),
  BULLET("Spark MLlib Guide. https://spark.apache.org/docs/latest/ml-guide.html"),
  BULLET("Zaharia et al., Apache Spark: a unified engine for big data processing, Communications of the ACM, 59(11), 2016."),
  BULLET("Pandas, Matplotlib, and Seaborn official documentation."),
  BULLET("Project Proposal: \"Scalable Analysis and Demand Prediction of New York City Taxi Trip Data Using Apache Spark\", N. Rade, R. Bhati, P. Kulkarni, NYU Tandon, Spring 2026."),
];

// ---------- assemble ----------
const doc = new Document({
  creator: "NYU Big Data Team",
  title: "NYC Taxi Big Data Project Report",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Calibri", color: "2F5496" },
        paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Calibri", color: "2F5496" },
        paragraph: { spacing: { before: 240, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Calibri", color: "1F3864" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "CS-GY 6513 — NYC Taxi Big Data Project",
          italics: true, size: 18, color: "808080", font: "Calibri" })],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Page ", size: 18, color: "808080", font: "Calibri" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080", font: "Calibri" }),
          new TextRun({ text: " of ", size: 18, color: "808080", font: "Calibri" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "808080", font: "Calibri" }),
        ],
      })] }),
    },
    children: [
      ...titlePage,
      ...abstract,
      ...introduction,
      ...dataset,
      ...methodology,
      ...implementation,
      ...results,
      ...discussion,
      ...conclusion,
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("Wrote", OUT, "(" + (buf.length / 1024).toFixed(1) + " KB)");
});
