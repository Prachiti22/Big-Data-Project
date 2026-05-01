"""
Downloads NYC TLC Yellow Taxi parquet files for Jan, Feb, and Mar 2023.
Also fetches the taxi zone lookup CSV used for human-readable zone names.
"""
import os
import sys
from pathlib import Path
import requests

DATA_DIR = Path(__file__).parent
TRIP_FILES = [
    ("yellow_tripdata_2023-01.parquet",
     "https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-01.parquet"),
    ("yellow_tripdata_2023-02.parquet",
     "https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-02.parquet"),
    ("yellow_tripdata_2023-03.parquet",
     "https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-03.parquet"),
]
ZONE_LOOKUP = (
    "taxi_zone_lookup.csv",
    "https://d37ci6vzurychx.cloudfront.net/misc/taxi_zone_lookup.csv",
)


def download(url: str, dest: Path, chunk_size: int = 1 << 20) -> None:
    """Streaming download with a simple progress indicator."""
    if dest.exists():
        print(f"[skip] {dest.name} already exists ({dest.stat().st_size/1e6:.1f} MB)")
        return
    print(f"[get ] {dest.name} <- {url}")
    with requests.get(url, stream=True, timeout=60) as r:
        r.raise_for_status()
        total = int(r.headers.get("content-length", 0))
        got = 0
        with open(dest, "wb") as f:
            for chunk in r.iter_content(chunk_size=chunk_size):
                if not chunk:
                    continue
                f.write(chunk)
                got += len(chunk)
                if total:
                    pct = 100 * got / total
                    sys.stdout.write(f"\r       {got/1e6:6.1f} / {total/1e6:6.1f} MB  ({pct:5.1f}%)")
                    sys.stdout.flush()
        sys.stdout.write("\n")


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    for name, url in TRIP_FILES:
        download(url, DATA_DIR / name)
    download(ZONE_LOOKUP[1], DATA_DIR / ZONE_LOOKUP[0])
    print("\nAll files ready in", DATA_DIR)


if __name__ == "__main__":
    main()
