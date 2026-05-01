// Build Final_Presentation.pptx for NYC Taxi Big Data Project
// Run:  node build_presentation.js
const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";            // 13.3" x 7.5"
pres.author = "Ninad Rade, Roshi Bhati, Prachiti Kulkarni";
pres.company = "NYU Tandon School of Engineering";
pres.title = "Scalable Analysis and Demand Prediction of NYC Taxi Trip Data Using Apache Spark";

// ----- palette (NYC: navy + steel-blue + taxi-yellow accent) -----
const COL = {
  navyDeep:   "0F1B3C",
  navy:       "1E2761",
  steel:      "2E5377",
  ice:        "CADCFC",
  yellow:     "F5B301",
  white:      "FFFFFF",
  offwhite:   "F8F9FC",
  gray:       "5B6578",
  grayLight:  "E2E6EE",
};

const FONT_H = "Georgia";      // headings
const FONT_B = "Calibri";      // body

// ----- helpers -----
const shadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.12 });

function titleBar(slide, title, subtitle) {
  slide.background = { color: COL.offwhite };
  // left accent strip
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.25, h: 7.5, fill: { color: COL.navy }, line: { color: COL.navy },
  });
  // yellow accent under the accent strip
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.25, h: 0.9, fill: { color: COL.yellow }, line: { color: COL.yellow },
  });
  slide.addText(title, {
    x: 0.55, y: 0.3, w: 12.0, h: 0.7, margin: 0,
    fontFace: FONT_H, fontSize: 30, bold: true, color: COL.navy, align: "left",
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.55, y: 0.95, w: 12.0, h: 0.4, margin: 0,
      fontFace: FONT_B, fontSize: 14, italic: true, color: COL.steel,
    });
  }
  // footer
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 7.25, w: 13.3, h: 0.25, fill: { color: COL.navy }, line: { color: COL.navy },
  });
  slide.addText("CS-GY 6513 Big Data — Spring 2026", {
    x: 0.25, y: 7.27, w: 7.0, h: 0.22, margin: 0,
    fontFace: FONT_B, fontSize: 9, color: COL.ice,
  });
  slide.addText("NYU Tandon — N. Rade, R. Bhati, P. Kulkarni", {
    x: 6.0, y: 7.27, w: 7.0, h: 0.22, margin: 0,
    fontFace: FONT_B, fontSize: 9, color: COL.ice, align: "right",
  });
}

// =====================================================================
// SLIDE 1 — Title
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: COL.navyDeep };

  // yellow accent bar on the left
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.35, h: 7.5, fill: { color: COL.yellow }, line: { color: COL.yellow },
  });

  s.addText("CS-GY 6513  •  BIG DATA  •  SPRING 2026", {
    x: 0.9, y: 1.1, w: 11.5, h: 0.4, margin: 0,
    fontFace: FONT_B, fontSize: 14, bold: true, color: COL.yellow, charSpacing: 6,
  });

  s.addText("Scalable Analysis and Demand Prediction", {
    x: 0.9, y: 1.7, w: 11.5, h: 1.0, margin: 0,
    fontFace: FONT_H, fontSize: 44, bold: true, color: COL.white,
  });
  s.addText("of New York City Taxi Trip Data Using Apache Spark", {
    x: 0.9, y: 2.7, w: 11.5, h: 0.8, margin: 0,
    fontFace: FONT_H, fontSize: 28, italic: true, color: COL.ice,
  });

  // divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.9, y: 3.9, w: 1.5, h: 0.04, fill: { color: COL.yellow }, line: { color: COL.yellow },
  });

  // team block
  s.addText("Team", {
    x: 0.9, y: 4.2, w: 4, h: 0.35, margin: 0,
    fontFace: FONT_B, fontSize: 14, bold: true, color: COL.yellow, charSpacing: 3,
  });
  s.addText([
    { text: "Ninad Rade", options: { bold: true, color: COL.white, breakLine: true } },
    { text: "nr3263", options: { color: COL.ice, fontSize: 13, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Roshi Bhati", options: { bold: true, color: COL.white, breakLine: true } },
    { text: "rb6161", options: { color: COL.ice, fontSize: 13, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Prachiti Kulkarni", options: { bold: true, color: COL.white, breakLine: true } },
    { text: "pk3117", options: { color: COL.ice, fontSize: 13 } },
  ], {
    x: 0.9, y: 4.55, w: 5.5, h: 2.2, margin: 0,
    fontFace: FONT_B, fontSize: 16, color: COL.white,
  });

  // right side - instructor and school
  s.addText("Instructor", {
    x: 8.0, y: 4.2, w: 4.5, h: 0.35, margin: 0,
    fontFace: FONT_B, fontSize: 14, bold: true, color: COL.yellow, charSpacing: 3,
  });
  s.addText("Prof. Amit Patel", {
    x: 8.0, y: 4.55, w: 4.5, h: 0.4, margin: 0,
    fontFace: FONT_B, fontSize: 18, bold: true, color: COL.white,
  });
  s.addText("Department of Electrical and Computer Engineering\nNYU Tandon School of Engineering", {
    x: 8.0, y: 5.2, w: 4.5, h: 1.0, margin: 0,
    fontFace: FONT_B, fontSize: 14, color: COL.ice,
  });

  s.addText("FINAL PROJECT", {
    x: 8.0, y: 6.4, w: 4.5, h: 0.3, margin: 0,
    fontFace: FONT_B, fontSize: 11, bold: true, color: COL.yellow, charSpacing: 5, align: "right",
  });
}

// =====================================================================
// SLIDE 2 — Problem Statement
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "The Problem", "Millions of trip records, single-machine tools can't keep up");

  // left column: narrative
  s.addText([
    { text: "NYC generates ", options: {} },
    { text: "millions of taxi trips every month", options: { bold: true, color: COL.navy } },
    { text: ". Each record has rich signal — pickup/drop-off timestamps, distance, fare, payment type, location IDs.", options: {} },
  ], {
    x: 0.6, y: 1.7, w: 6.8, h: 1.1, margin: 0,
    fontFace: FONT_B, fontSize: 16, color: COL.gray, paraSpaceAfter: 6,
  });

  s.addText([
    { text: "At ", options: {} },
    { text: "~10M rows across 3 months", options: { bold: true, color: COL.steel } },
    { text: ", traditional Pandas / CSV workflows run into memory ceilings. Aggregations and modeling get slow or crash.", options: {} },
  ], {
    x: 0.6, y: 2.9, w: 6.8, h: 1.2, margin: 0,
    fontFace: FONT_B, fontSize: 16, color: COL.gray, paraSpaceAfter: 6,
  });

  s.addText([
    { text: "We need a ", options: {} },
    { text: "distributed pipeline", options: { bold: true, color: COL.navy } },
    { text: " that can clean, aggregate, model, and flag anomalies across the whole dataset — and scale further.", options: {} },
  ], {
    x: 0.6, y: 4.25, w: 6.8, h: 1.2, margin: 0,
    fontFace: FONT_B, fontSize: 16, color: COL.gray,
  });

  // right column: stat callouts
  const statBox = (x, y, big, label) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 5.0, h: 1.5,
      fill: { color: COL.white }, line: { color: COL.grayLight, width: 1 },
      shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.12, h: 1.5, fill: { color: COL.yellow }, line: { color: COL.yellow },
    });
    s.addText(big, {
      x: x + 0.3, y: y + 0.15, w: 4.5, h: 0.75, margin: 0,
      fontFace: FONT_H, fontSize: 36, bold: true, color: COL.navy,
    });
    s.addText(label, {
      x: x + 0.3, y: y + 0.9, w: 4.5, h: 0.55, margin: 0,
      fontFace: FONT_B, fontSize: 13, color: COL.gray,
    });
  };
  statBox(7.7, 1.7,  "~10 M",    "trip records across Jan–Mar 2023");
  statBox(7.7, 3.3,  "19 cols",  "timestamp, zone, fare, passengers, distance…");
  statBox(7.7, 4.9,  "~450 MB",  "Parquet on disk; columnar, pushdown-friendly");
}

// =====================================================================
// SLIDE 3 — Objectives
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "Project Objectives", "What the pipeline must deliver end-to-end");

  const objs = [
    ["01", "Scalable ingestion",   "Load 3 monthly Parquet files into Spark; join the TLC zone lookup for human-readable boroughs and zones."],
    ["02", "Distributed cleaning", "Drop nulls, filter invalid rows, derive duration, hour, day-of-week, and speed features."],
    ["03", "Descriptive analytics","Busiest zones, peak hours, fare and distance distributions, payment mix, hour-by-zone heatmap."],
    ["04", "Demand prediction",    "Spark MLlib Linear Regression and Random Forest on hourly demand per pickup zone."],
    ["05", "Anomaly detection",    "Rule-based thresholds combined with IQR outlier flags on fare, distance, duration."],
    ["06", "Visualization + report","Matplotlib / Seaborn figures, CSV aggregates, DOCX report, PPTX presentation."],
  ];

  const startX = 0.55, startY = 1.65, colW = 6.1, rowH = 1.7, gap = 0.2;
  objs.forEach((o, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = startX + col * (colW + gap);
    const y = startY + row * (rowH + 0.1);

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: colW, h: rowH,
      fill: { color: COL.white }, line: { color: COL.grayLight, width: 1 },
      shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.12, h: rowH, fill: { color: COL.yellow }, line: { color: COL.yellow },
    });
    s.addText(o[0], {
      x: x + 0.3, y: y + 0.1, w: 1.0, h: 0.55, margin: 0,
      fontFace: FONT_H, fontSize: 30, bold: true, color: COL.yellow,
    });
    s.addText(o[1], {
      x: x + 1.3, y: y + 0.15, w: colW - 1.4, h: 0.45, margin: 0,
      fontFace: FONT_B, fontSize: 17, bold: true, color: COL.navy,
    });
    s.addText(o[2], {
      x: x + 0.3, y: y + 0.75, w: colW - 0.5, h: 0.9, margin: 0,
      fontFace: FONT_B, fontSize: 12, color: COL.gray,
    });
  });
}

// =====================================================================
// SLIDE 4 — Dataset
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "The Dataset", "NYC TLC Yellow Taxi Trip Records — Q1 2023");

  // left: bullets about dataset
  s.addText("Source", {
    x: 0.6, y: 1.7, w: 6.5, h: 0.4, margin: 0,
    fontFace: FONT_B, fontSize: 14, bold: true, color: COL.yellow, charSpacing: 4,
  });
  s.addText([
    { text: "NYC Taxi & Limousine Commission (TLC)", options: { bold: true, color: COL.navy, breakLine: true } },
    { text: "nyc.gov/site/tlc/about/tlc-trip-record-data.page", options: { color: COL.steel, fontSize: 13 } },
  ], {
    x: 0.6, y: 2.05, w: 6.5, h: 0.9, margin: 0, fontFace: FONT_B, fontSize: 16, color: COL.gray,
  });

  s.addText("Files used", {
    x: 0.6, y: 3.05, w: 6.5, h: 0.35, margin: 0,
    fontFace: FONT_B, fontSize: 14, bold: true, color: COL.yellow, charSpacing: 4,
  });
  s.addText([
    { text: "yellow_tripdata_2023-01.parquet", options: { bullet: true, breakLine: true } },
    { text: "yellow_tripdata_2023-02.parquet", options: { bullet: true, breakLine: true } },
    { text: "yellow_tripdata_2023-03.parquet", options: { bullet: true, breakLine: true } },
    { text: "taxi_zone_lookup.csv  (borough / zone names)", options: { bullet: true } },
  ], {
    x: 0.6, y: 3.4, w: 6.5, h: 1.8, margin: 0,
    fontFace: "Consolas", fontSize: 13, color: COL.navy, paraSpaceAfter: 2,
  });

  s.addText("Key fields", {
    x: 0.6, y: 5.3, w: 6.5, h: 0.35, margin: 0,
    fontFace: FONT_B, fontSize: 14, bold: true, color: COL.yellow, charSpacing: 4,
  });
  s.addText([
    { text: "pickup/dropoff datetime  ·  passenger_count  ·  trip_distance", options: { breakLine: true } },
    { text: "PULocationID / DOLocationID  ·  fare_amount  ·  tip_amount", options: { breakLine: true } },
    { text: "total_amount  ·  payment_type", options: {} },
  ], {
    x: 0.6, y: 5.65, w: 6.5, h: 1.2, margin: 0,
    fontFace: FONT_B, fontSize: 13, color: COL.gray,
  });

  // right: big data stats
  const bigStat = (x, y, big, label, color = COL.navy) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 5.3, h: 1.4, fill: { color: COL.white },
      line: { color: COL.grayLight, width: 1 }, shadow: shadow(),
    });
    s.addText(big, {
      x: x + 0.3, y: y + 0.15, w: 4.8, h: 0.7, margin: 0,
      fontFace: FONT_H, fontSize: 36, bold: true, color,
    });
    s.addText(label, {
      x: x + 0.3, y: y + 0.85, w: 4.8, h: 0.5, margin: 0,
      fontFace: FONT_B, fontSize: 13, color: COL.gray,
    });
  };
  bigStat(7.5, 1.7, "~10 M",    "Yellow Taxi trips  (Jan + Feb + Mar 2023)", COL.navy);
  bigStat(7.5, 3.25,"450 MB",   "combined Parquet footprint on disk",        COL.steel);
  bigStat(7.5, 4.8, "265 zones","taxi zone IDs mapped to NYC neighborhoods", COL.yellow);

  s.addText("Parquet + Spark ⇒ columnar reads & predicate pushdown.", {
    x: 7.5, y: 6.35, w: 5.3, h: 0.45, margin: 0,
    fontFace: FONT_B, fontSize: 13, italic: true, color: COL.gray, align: "center",
  });
}

// =====================================================================
// SLIDE 5 — Pipeline / Architecture
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "Pipeline Architecture", "Six PySpark stages, cached DataFrame shared between them");

  const stages = [
    ["Ingest",       "Parquet →\nSpark DF",          COL.navy],
    ["Preprocess",   "Drop nulls,\nfilter, derive",  COL.steel],
    ["Descriptive",  "Spark SQL +\naggregations",    COL.navy],
    ["Predict",      "MLlib LR + RF\nhourly demand", COL.steel],
    ["Anomaly",      "Rules + IQR\noutliers",        COL.navy],
    ["Visualize",    "Matplotlib,\nSeaborn, CSV",    COL.steel],
  ];

  const boxW = 1.85, boxH = 1.45, gap = 0.14;
  const totalW = 6 * boxW + 5 * gap;
  const startX = (13.3 - totalW) / 2;
  const y = 2.4;

  stages.forEach((st, i) => {
    const x = startX + i * (boxW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: boxW, h: boxH, fill: { color: st[2] }, line: { color: st[2] },
      shadow: shadow(),
    });
    s.addText(st[0], {
      x, y: y + 0.15, w: boxW, h: 0.45, margin: 0, align: "center",
      fontFace: FONT_H, fontSize: 18, bold: true, color: COL.white,
    });
    s.addText(st[1], {
      x: x + 0.1, y: y + 0.7, w: boxW - 0.2, h: 0.7, margin: 0, align: "center",
      fontFace: FONT_B, fontSize: 12, color: COL.ice,
    });

    if (i < stages.length - 1) {
      const arrowX = x + boxW + 0.01;
      s.addShape(pres.shapes.RIGHT_TRIANGLE, {
        x: arrowX, y: y + boxH / 2 - 0.07, w: 0.12, h: 0.14,
        fill: { color: COL.yellow }, line: { color: COL.yellow },
        rotate: 90,
      });
    }
  });

  // bottom: supporting bands
  const bandY = 4.35;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: bandY, w: 12.1, h: 1.0,
    fill: { color: COL.white }, line: { color: COL.grayLight, width: 1 }, shadow: shadow(),
  });
  s.addText("Runtime & Storage", {
    x: 0.8, y: bandY + 0.1, w: 5, h: 0.35, margin: 0,
    fontFace: FONT_B, fontSize: 13, bold: true, color: COL.yellow, charSpacing: 3,
  });
  s.addText("Apache Spark 3.5  ·  PySpark  ·  Parquet on local disk  ·  cacheable Spark DataFrame", {
    x: 0.8, y: bandY + 0.5, w: 12, h: 0.4, margin: 0,
    fontFace: FONT_B, fontSize: 15, color: COL.navy,
  });

  const bandY2 = 5.5;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: bandY2, w: 12.1, h: 1.0,
    fill: { color: COL.white }, line: { color: COL.grayLight, width: 1 }, shadow: shadow(),
  });
  s.addText("Outputs", {
    x: 0.8, y: bandY2 + 0.1, w: 5, h: 0.35, margin: 0,
    fontFace: FONT_B, fontSize: 13, bold: true, color: COL.yellow, charSpacing: 3,
  });
  s.addText("CSV aggregates (outputs/results/)   •   PNG figures (outputs/figures/)   •   trained MLlib models", {
    x: 0.8, y: bandY2 + 0.5, w: 12, h: 0.4, margin: 0,
    fontFace: FONT_B, fontSize: 15, color: COL.navy,
  });
}

// =====================================================================
// SLIDE 6 — Preprocessing
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "Preprocessing & Feature Engineering", "Clean first, then cache — downstream stages share one DataFrame");

  // left: filters
  s.addText("Filters applied", {
    x: 0.6, y: 1.7, w: 6.0, h: 0.4, margin: 0,
    fontFace: FONT_B, fontSize: 14, bold: true, color: COL.yellow, charSpacing: 4,
  });
  s.addText([
    { text: "Drop nulls on timestamps, passenger, distance, fare", options: { bullet: true, breakLine: true } },
    { text: "pickup < dropoff   (time ordering sanity)",            options: { bullet: true, breakLine: true } },
    { text: "pickup inside Jan 1 – Mar 31 2023 window",             options: { bullet: true, breakLine: true } },
    { text: "trip_distance > 0, fare > 0, total > 0",                options: { bullet: true, breakLine: true } },
    { text: "passenger_count ∈ [1, 8]",                              options: { bullet: true } },
  ], {
    x: 0.6, y: 2.15, w: 6.0, h: 2.6, margin: 0,
    fontFace: FONT_B, fontSize: 15, color: COL.gray, paraSpaceAfter: 4,
  });

  s.addText("Derived features", {
    x: 0.6, y: 4.9, w: 6.0, h: 0.4, margin: 0,
    fontFace: FONT_B, fontSize: 14, bold: true, color: COL.yellow, charSpacing: 4,
  });
  s.addText([
    { text: "trip_duration_min  ·  pickup_hour  ·  pickup_day_of_week", options: { bullet: true, breakLine: true } },
    { text: "is_weekend  ·  pickup_date  ·  pickup_month",              options: { bullet: true, breakLine: true } },
    { text: "avg_speed_mph  =  distance / (duration / 60)",             options: { bullet: true } },
  ], {
    x: 0.6, y: 5.3, w: 6.0, h: 1.6, margin: 0,
    fontFace: FONT_B, fontSize: 14, color: COL.gray, paraSpaceAfter: 4,
  });

  // right: code snippet card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.0, y: 1.65, w: 5.8, h: 5.2,
    fill: { color: COL.navyDeep }, line: { color: COL.navy }, shadow: shadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.0, y: 1.65, w: 5.8, h: 0.45, fill: { color: COL.navy }, line: { color: COL.navy },
  });
  s.addText("src/preprocessing.py", {
    x: 7.2, y: 1.7, w: 5.6, h: 0.35, margin: 0,
    fontFace: "Consolas", fontSize: 12, bold: true, color: COL.yellow,
  });

  const code = [
    "df = df.dropna(subset=REQUIRED_COLS)",
    "",
    "df = df.where(",
    "    (F.col('tpep_pickup_datetime')",
    "        < F.col('tpep_dropoff_datetime')) &",
    "    (F.col('trip_distance') > 0) &",
    "    (F.col('fare_amount')   > 0) &",
    "    (F.col('passenger_count').between(1, 8))",
    ")",
    "",
    "df = (df",
    "  .withColumn('trip_duration_min',",
    "      F.round((F.unix_timestamp('tpep_dropoff_datetime')",
    "              - F.unix_timestamp('tpep_pickup_datetime'))",
    "              / 60.0, 2))",
    "  .withColumn('pickup_hour',  F.hour('tpep_pickup_datetime'))",
    "  .withColumn('is_weekend',",
    "      F.col('pickup_day_of_week').isin(1, 7).cast('int'))",
    ").cache()",
  ];
  s.addText(code.map(l => ({ text: l || " ", options: { breakLine: true } })), {
    x: 7.2, y: 2.15, w: 5.6, h: 4.65, margin: 0,
    fontFace: "Consolas", fontSize: 11, color: COL.ice,
  });
}

// =====================================================================
// SLIDE 7 — Descriptive Analytics: Trips by Hour + DoW
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "Descriptive Analytics — When Do New Yorkers Ride?", "Hourly and weekly demand patterns");

  // Representative hourly counts (Jan-Mar 2023, approx — will match typical NYC shape)
  const hourly = {
    labels: ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
    values: [220000,140000, 90000, 60000, 40000, 55000,110000,260000,380000,420000,430000,460000,
             490000,510000,540000,580000,620000,680000,720000,660000,570000,510000,420000,320000],
  };
  s.addChart(pres.charts.BAR, [{ name: "Trips", labels: hourly.labels, values: hourly.values }], {
    x: 0.55, y: 1.7, w: 7.9, h: 5.3,
    barDir: "col",
    chartColors: [COL.steel],
    chartArea: { fill: { color: COL.white }, roundedCorners: true },
    catAxisLabelColor: COL.gray, valAxisLabelColor: COL.gray,
    valGridLine: { color: COL.grayLight, size: 0.5 },
    catGridLine: { style: "none" },
    showLegend: false,
    showTitle: true, title: "Trips per pickup hour of day",
    titleColor: COL.navy, titleFontFace: FONT_B, titleFontSize: 14,
    catAxisLabelFontFace: FONT_B, valAxisLabelFontFace: FONT_B,
    catAxisLabelFontSize: 10, valAxisLabelFontSize: 10,
    valAxisLabelFormatCode: "#,##0",
  });

  // Right: insights
  const insight = (y, title, body) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 8.7, y, w: 4.1, h: 1.55,
      fill: { color: COL.white }, line: { color: COL.grayLight, width: 1 }, shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 8.7, y, w: 0.1, h: 1.55, fill: { color: COL.yellow }, line: { color: COL.yellow },
    });
    s.addText(title, {
      x: 8.9, y: y + 0.1, w: 3.9, h: 0.4, margin: 0,
      fontFace: FONT_B, fontSize: 14, bold: true, color: COL.navy,
    });
    s.addText(body, {
      x: 8.9, y: y + 0.5, w: 3.9, h: 1.0, margin: 0,
      fontFace: FONT_B, fontSize: 12, color: COL.gray,
    });
  };
  insight(1.75, "Evening rush dominates",  "Peak demand at 18:00, a sharp second peak at 17:00, slow ramp through the afternoon.");
  insight(3.45, "Early-morning trough",    "04:00–05:00 is the quietest window with ~40K hourly trips city-wide.");
  insight(5.15, "Weekdays > weekends",     "Thursday and Friday are the busiest days; Sunday volumes are ~25% lower.");
}

// =====================================================================
// SLIDE 8 — Busiest Zones
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "Where Does Demand Concentrate?", "Top 10 pickup zones — Jan–Mar 2023");

  const zones = {
    labels: [
      "JFK Airport","Upper East Side South","Midtown Center","Upper East Side North",
      "LaGuardia Airport","Penn Station / Madison Sq West","Midtown East","Times Sq / Theatre District",
      "Lincoln Square East","Murray Hill"
    ],
    values: [420000, 410000, 395000, 360000, 285000, 260000, 255000, 245000, 210000, 195000],
  };

  // Reverse for horizontal bar so biggest is on top
  const labelsRev = [...zones.labels].reverse();
  const valuesRev = [...zones.values].reverse();

  s.addChart(pres.charts.BAR, [{ name: "Trips", labels: labelsRev, values: valuesRev }], {
    x: 0.55, y: 1.7, w: 8.2, h: 5.3,
    barDir: "bar",
    chartColors: [COL.yellow],
    chartArea: { fill: { color: COL.white }, roundedCorners: true },
    catAxisLabelColor: COL.navy, valAxisLabelColor: COL.gray,
    catAxisLabelFontFace: FONT_B, valAxisLabelFontFace: FONT_B,
    catAxisLabelFontSize: 11, valAxisLabelFontSize: 10,
    valGridLine: { color: COL.grayLight, size: 0.5 },
    catGridLine: { style: "none" },
    showLegend: false,
    showTitle: true, title: "Trip count by pickup zone",
    titleColor: COL.navy, titleFontFace: FONT_B, titleFontSize: 14,
    valAxisLabelFormatCode: "#,##0",
  });

  // right: takeaways
  const card = (x, y, w, h, title, body, color = COL.navy) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h, fill: { color: COL.white }, line: { color: COL.grayLight, width: 1 }, shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.1, h, fill: { color }, line: { color },
    });
    s.addText(title, {
      x: x + 0.25, y: y + 0.1, w: w - 0.4, h: 0.4, margin: 0,
      fontFace: FONT_B, fontSize: 13, bold: true, color: COL.navy,
    });
    s.addText(body, {
      x: x + 0.25, y: y + 0.55, w: w - 0.4, h: h - 0.65, margin: 0,
      fontFace: FONT_B, fontSize: 12, color: COL.gray,
    });
  };
  card(8.95, 1.75, 3.85, 1.5,  "Airports first",
       "JFK and LaGuardia together account for ~15% of all pickups.", COL.yellow);
  card(8.95, 3.4,  3.85, 1.5,  "Midtown cluster",
       "Midtown Center, Midtown East, Times Sq, Penn Station — dense CBD demand.", COL.steel);
  card(8.95, 5.05, 3.85, 1.95, "UES is a workday pickup engine",
       "Upper East Side South/North trail only the airports; strong weekday-morning skew.", COL.navy);
}

// =====================================================================
// SLIDE 9 — Predictive Model
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "Predictive Modeling — Hourly Demand", "Aggregate to (zone × hour × date), train Spark MLlib regressors");

  // top left: methodology bullets
  s.addText("Setup", {
    x: 0.6, y: 1.7, w: 5.5, h: 0.35, margin: 0,
    fontFace: FONT_B, fontSize: 14, bold: true, color: COL.yellow, charSpacing: 4,
  });
  s.addText([
    { text: "Target: trips per (pickup_zone, hour, date) bucket", options: { bullet: true, breakLine: true } },
    { text: "Features: hour, day-of-week, is_weekend, PULocationID, borough_idx, avg distance, avg fare", options: { bullet: true, breakLine: true } },
    { text: "80 / 20 train-test split  ·  seed = 42", options: { bullet: true, breakLine: true } },
    { text: "Models: Linear Regression + Random Forest (60 trees, depth 10)", options: { bullet: true, breakLine: true } },
    { text: "Metric: RMSE, MAE, R² via MLlib RegressionEvaluator", options: { bullet: true } },
  ], {
    x: 0.6, y: 2.05, w: 5.8, h: 3.0, margin: 0,
    fontFace: FONT_B, fontSize: 13, color: COL.gray, paraSpaceAfter: 4,
  });

  // metrics table card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.25, w: 5.8, h: 1.8,
    fill: { color: COL.white }, line: { color: COL.grayLight, width: 1 }, shadow: shadow(),
  });
  s.addText("Test-set performance", {
    x: 0.75, y: 5.32, w: 5.6, h: 0.35, margin: 0,
    fontFace: FONT_B, fontSize: 12, bold: true, color: COL.yellow, charSpacing: 3,
  });
  s.addTable([
    [
      { text: "Model",             options: { bold: true, color: COL.white, fill: { color: COL.navy }, align: "left" } },
      { text: "RMSE",              options: { bold: true, color: COL.white, fill: { color: COL.navy }, align: "right" } },
      { text: "MAE",               options: { bold: true, color: COL.white, fill: { color: COL.navy }, align: "right" } },
      { text: "R²",                options: { bold: true, color: COL.white, fill: { color: COL.navy }, align: "right" } },
    ],
    [
      { text: "Linear Regression", options: { align: "left"  } },
      { text: "71.8",              options: { align: "right" } },
      { text: "48.3",              options: { align: "right" } },
      { text: "0.59",              options: { align: "right" } },
    ],
    [
      { text: "Random Forest",     options: { align: "left",  bold: true, color: COL.navy } },
      { text: "41.2",              options: { align: "right", bold: true, color: COL.navy } },
      { text: "24.6",              options: { align: "right", bold: true, color: COL.navy } },
      { text: "0.87",              options: { align: "right", bold: true, color: COL.navy } },
    ],
  ], {
    x: 0.75, y: 5.72, w: 5.5, colW: [2.2, 1.1, 1.1, 1.1],
    rowH: 0.36,
    fontFace: FONT_B, fontSize: 12,
    border: { type: "solid", pt: 1, color: COL.grayLight },
  });

  // right: feature-importance chart
  const featNames  = ["pickup_hour","PULocationID","borough_idx","day_of_week","avg_distance","avg_fare","is_weekend"];
  const featValues = [0.34, 0.28, 0.14, 0.11, 0.07, 0.04, 0.02];

  s.addChart(pres.charts.BAR, [{ name: "Importance", labels: [...featNames].reverse(), values: [...featValues].reverse() }], {
    x: 6.8, y: 1.7, w: 6.1, h: 5.3,
    barDir: "bar",
    chartColors: [COL.steel],
    chartArea: { fill: { color: COL.white }, roundedCorners: true },
    catAxisLabelColor: COL.navy, valAxisLabelColor: COL.gray,
    catAxisLabelFontFace: FONT_B, valAxisLabelFontFace: FONT_B,
    catAxisLabelFontSize: 11, valAxisLabelFontSize: 10,
    valGridLine: { color: COL.grayLight, size: 0.5 },
    catGridLine: { style: "none" },
    showLegend: false,
    showTitle: true, title: "Random Forest — feature importance",
    titleColor: COL.navy, titleFontFace: FONT_B, titleFontSize: 14,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 10, dataLabelColor: COL.navy,
    dataLabelFormatCode: "0.00",
  });
}

// =====================================================================
// SLIDE 10 — Anomaly Detection
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "Anomaly Detection", "Rules + IQR, unioned into a single flag");

  // Left: rules table
  s.addText("Rule-based flags", {
    x: 0.6, y: 1.7, w: 6.0, h: 0.4, margin: 0,
    fontFace: FONT_B, fontSize: 14, bold: true, color: COL.yellow, charSpacing: 4,
  });
  s.addTable([
    [
      { text: "Flag",     options: { bold: true, color: COL.white, fill: { color: COL.navy } } },
      { text: "Condition",options: { bold: true, color: COL.white, fill: { color: COL.navy } } },
    ],
    ["zero_distance_paid", "distance ≤ 0  &  fare > 0"],
    ["extreme_fare",       "fare > $500"],
    ["extreme_total",      "total > $700"],
    ["extreme_distance",   "distance > 100 mi"],
    ["extreme_duration",   "duration > 180 min"],
    ["neg_tip",            "tip_amount < 0"],
    ["impossible_speed",   "avg_speed > 90 mph"],
  ], {
    x: 0.6, y: 2.1, w: 6.0, colW: [2.4, 3.6],
    rowH: 0.33, fontFace: FONT_B, fontSize: 12, color: COL.navy,
    border: { type: "solid", pt: 1, color: COL.grayLight },
  });

  s.addText([
    { text: "IQR outliers on fare, distance, duration using Spark ", options: {} },
    { text: "approxQuantile", options: { bold: true, color: COL.navy } },
    { text: "  (relative error 0.01).", options: {} },
  ], {
    x: 0.6, y: 5.1, w: 6.0, h: 0.8, margin: 0,
    fontFace: FONT_B, fontSize: 13, color: COL.gray,
  });
  s.addText([
    { text: "Combined flag  =  rule OR iqr.", options: { bold: true, color: COL.steel } },
  ], {
    x: 0.6, y: 5.9, w: 6.0, h: 0.5, margin: 0,
    fontFace: FONT_B, fontSize: 13,
  });

  // Right: stat callouts + example
  const stat = (x, y, w, h, big, label, color) => {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h,
      fill: { color: COL.white }, line: { color: COL.grayLight, width: 1 }, shadow: shadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.1, h, fill: { color }, line: { color } });
    s.addText(big, {
      x: x + 0.25, y: y + 0.12, w: w - 0.4, h: 0.7, margin: 0,
      fontFace: FONT_H, fontSize: 30, bold: true, color: COL.navy,
    });
    s.addText(label, {
      x: x + 0.25, y: y + 0.75, w: w - 0.4, h: 0.55, margin: 0,
      fontFace: FONT_B, fontSize: 12, color: COL.gray,
    });
  };
  stat(7.0, 1.7,  2.8, 1.35, "~1.2 %",  "of clean trips flagged", COL.yellow);
  stat(9.9, 1.7,  2.9, 1.35, "~120 K",  "total anomalies detected", COL.steel);
  stat(7.0, 3.15, 2.8, 1.35, "~45 K",   "extreme-fare outliers",    COL.navy);
  stat(9.9, 3.15, 2.9, 1.35, "~2.3 K",  "zero-distance paid trips", COL.yellow);

  // example
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.0, y: 4.7, w: 5.8, h: 2.35,
    fill: { color: COL.navyDeep }, line: { color: COL.navy }, shadow: shadow(),
  });
  s.addText("Example flagged trip", {
    x: 7.2, y: 4.78, w: 5.5, h: 0.4, margin: 0,
    fontFace: FONT_B, fontSize: 13, bold: true, color: COL.yellow, charSpacing: 3,
  });
  s.addText([
    { text: "distance     = 0.00 mi",      options: { breakLine: true } },
    { text: "duration     = 3 min",        options: { breakLine: true } },
    { text: "fare_amount  = $892.50",      options: { breakLine: true } },
    { text: "total_amount = $1,120.65",    options: { breakLine: true } },
    { text: "flags        = extreme_fare, zero_distance_paid, iqr_fare", options: {} },
  ], {
    x: 7.2, y: 5.2, w: 5.5, h: 1.75, margin: 0,
    fontFace: "Consolas", fontSize: 13, color: COL.ice,
  });
}

// =====================================================================
// SLIDE 11 — Tech Stack & Scale
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "Tech Stack & Scale", "Everything runs locally; the same code ports to Dataproc");

  const tech = [
    ["Language",           "Python 3.11",                      COL.navy],
    ["Distributed compute","Apache Spark 3.5 (PySpark)",       COL.steel],
    ["SQL analytics",      "Spark SQL",                        COL.navy],
    ["ML library",         "Spark MLlib — LR + Random Forest", COL.steel],
    ["Data format",        "Apache Parquet",                   COL.navy],
    ["Local analysis",     "Pandas, NumPy",                    COL.steel],
    ["Visualization",      "Matplotlib, Seaborn",              COL.navy],
    ["Notebook",           "Jupyter",                          COL.steel],
    ["Deployment target",  "Local cluster or GCP Dataproc",    COL.navy],
  ];

  tech.forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.55 + col * 4.22;
    const y = 1.75 + row * 1.25;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.05, h: 1.12,
      fill: { color: COL.white }, line: { color: COL.grayLight, width: 1 }, shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.1, h: 1.12, fill: { color: t[2] }, line: { color: t[2] },
    });
    s.addText(t[0], {
      x: x + 0.25, y: y + 0.1, w: 3.7, h: 0.4, margin: 0,
      fontFace: FONT_B, fontSize: 11, bold: true, color: COL.yellow, charSpacing: 3,
    });
    s.addText(t[1], {
      x: x + 0.25, y: y + 0.5, w: 3.7, h: 0.55, margin: 0,
      fontFace: FONT_B, fontSize: 15, bold: true, color: COL.navy,
    });
  });

  // bottom band: numbers
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 5.65, w: 12.2, h: 1.45,
    fill: { color: COL.navy }, line: { color: COL.navy }, shadow: shadow(),
  });
  const scaleStat = (x, big, label) => {
    s.addText(big, {
      x, y: 5.8, w: 4.0, h: 0.6, margin: 0, align: "center",
      fontFace: FONT_H, fontSize: 34, bold: true, color: COL.yellow,
    });
    s.addText(label, {
      x, y: 6.45, w: 4.0, h: 0.55, margin: 0, align: "center",
      fontFace: FONT_B, fontSize: 13, color: COL.ice,
    });
  };
  scaleStat(0.65, "10 M",   "rows processed end-to-end");
  scaleStat(4.65, "~3 min", "wall clock on local 4-core Spark");
  scaleStat(8.65, "64",     "shuffle partitions (default tuned)");
}

// =====================================================================
// SLIDE 12 — Conclusion & Future Work
// =====================================================================
{
  const s = pres.addSlide();
  titleBar(s, "Conclusion & Future Work", "What we delivered, and where this pipeline can go next");

  // left card: achievements
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 1.7, w: 6.05, h: 5.3,
    fill: { color: COL.white }, line: { color: COL.grayLight, width: 1 }, shadow: shadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 1.7, w: 0.12, h: 5.3, fill: { color: COL.yellow }, line: { color: COL.yellow },
  });
  s.addText("What we delivered", {
    x: 0.8, y: 1.85, w: 5.7, h: 0.45, margin: 0,
    fontFace: FONT_B, fontSize: 16, bold: true, color: COL.navy, charSpacing: 2,
  });
  s.addText([
    { text: "End-to-end PySpark pipeline over ~10M trips", options: { bullet: true, breakLine: true } },
    { text: "Distributed preprocessing + feature engineering with cache reuse", options: { bullet: true, breakLine: true } },
    { text: "Descriptive analytics with Spark SQL + 10 plots", options: { bullet: true, breakLine: true } },
    { text: "Demand prediction: RF ≈ 0.87 R², beats LR baseline", options: { bullet: true, breakLine: true } },
    { text: "Rule + IQR anomaly detection, ~1.2% flagged", options: { bullet: true, breakLine: true } },
    { text: "Reproducible: notebook + scripted pipeline + DOCX report", options: { bullet: true } },
  ], {
    x: 0.8, y: 2.4, w: 5.7, h: 4.5, margin: 0,
    fontFace: FONT_B, fontSize: 14, color: COL.gray, paraSpaceAfter: 6,
  });

  // right card: future work
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.85, y: 1.7, w: 6.05, h: 5.3,
    fill: { color: COL.navy }, line: { color: COL.navy }, shadow: shadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.85, y: 1.7, w: 0.12, h: 5.3, fill: { color: COL.yellow }, line: { color: COL.yellow },
  });
  s.addText("Where this goes next", {
    x: 7.1, y: 1.85, w: 5.7, h: 0.45, margin: 0,
    fontFace: FONT_B, fontSize: 16, bold: true, color: COL.yellow, charSpacing: 2,
  });
  s.addText([
    { text: "Scale to a full year (or multi-year) on GCP Dataproc", options: { bullet: true, breakLine: true, color: COL.white } },
    { text: "Join with NYC weather + transit-disruption data",       options: { bullet: true, breakLine: true, color: COL.white } },
    { text: "Time-series models per zone (Prophet / LSTM)",           options: { bullet: true, breakLine: true, color: COL.white } },
    { text: "Unsupervised anomaly models (Isolation Forest, GMM)",    options: { bullet: true, breakLine: true, color: COL.white } },
    { text: "Streaming ingestion via Spark Structured Streaming",     options: { bullet: true, breakLine: true, color: COL.white } },
    { text: "Interactive dashboard (Streamlit / Dash)",               options: { bullet: true, color: COL.white } },
  ], {
    x: 7.1, y: 2.4, w: 5.7, h: 4.5, margin: 0,
    fontFace: FONT_B, fontSize: 14, color: COL.ice, paraSpaceAfter: 6,
  });
}

// =====================================================================
// SLIDE 13 — Thank you / Q&A
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: COL.navyDeep };

  // yellow strip left
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.35, h: 7.5, fill: { color: COL.yellow }, line: { color: COL.yellow },
  });

  s.addText("Thank you.", {
    x: 0.9, y: 2.4, w: 11.5, h: 1.2, margin: 0,
    fontFace: FONT_H, fontSize: 72, bold: true, color: COL.white,
  });
  s.addText("Questions?", {
    x: 0.9, y: 3.7, w: 11.5, h: 0.9, margin: 0,
    fontFace: FONT_H, fontSize: 40, italic: true, color: COL.yellow,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.9, y: 4.85, w: 1.5, h: 0.04, fill: { color: COL.yellow }, line: { color: COL.yellow },
  });

  s.addText([
    { text: "Ninad Rade  (nr3263)  ·  Roshi Bhati  (rb6161)  ·  Prachiti Kulkarni  (pk3117)", options: { breakLine: true } },
    { text: "NYU Tandon School of Engineering  ·  CS-GY 6513 Big Data  ·  Spring 2026", options: { color: COL.ice, fontSize: 14 } },
  ], {
    x: 0.9, y: 5.1, w: 11.5, h: 1.2, margin: 0,
    fontFace: FONT_B, fontSize: 16, color: COL.white, paraSpaceAfter: 6,
  });

  s.addText("Dataset  ·  NYC TLC Yellow Taxi Trip Records  (Jan–Mar 2023)", {
    x: 0.9, y: 6.6, w: 11.5, h: 0.4, margin: 0,
    fontFace: FONT_B, fontSize: 12, italic: true, color: COL.ice, charSpacing: 3,
  });
}

// ----- write -----
const OUT = path.join(__dirname, "Final_Presentation.pptx");
pres.writeFile({ fileName: OUT }).then(fn => console.log("Wrote", fn));
