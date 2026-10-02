"""Pull league-wide per-pitcher-per-game summaries from Baseball Savant for the league benchmark (s8_design_spec.md).

Three grouped queries per date chunk: all pitches, four-seam only, 1st inning only. Regular season 2025-26.
Writes data/raw/league/{season}_{all,ff,inn1}.csv.
    .venv/bin/python scripts/pull_league_grouped.py
"""

import io
import time
from datetime import date, timedelta
from pathlib import Path

import pandas as pd
import requests

OUT = Path(__file__).resolve().parent.parent / "data" / "raw" / "league"
OUT.mkdir(parents=True, exist_ok=True)
BASE = ("https://baseballsavant.mlb.com/statcast_search/csv?all=true&player_type=pitcher&group_by=name-date"
        "&hfGT=R%7C&hfSea={season}%7C&game_date_gt={start}&game_date_lt={end}"
        "&min_pitches=0&min_results=0&min_pas=0&sort_col=pitches&sort_order=desc")
KINDS = {"all": "", "ff": "&hfPT=FF%7C", "inn1": "&hfInn=1%7C"}
SEASONS = {2025: (date(2025, 3, 18), date(2025, 9, 28)), 2026: (date(2026, 3, 25), date(2026, 9, 27))}
CHUNK_DAYS = 5

for season, (first, last) in SEASONS.items():
    for kind, extra in KINDS.items():
        frames, day = [], first
        while day <= last:
            end = min(day + timedelta(days=CHUNK_DAYS - 1), last)
            url = BASE.format(season=season, start=day, end=end) + extra
            for attempt in range(3):
                r = requests.get(url, timeout=120)
                if r.ok and r.text.strip():
                    break
                time.sleep(5)
            df = pd.read_csv(io.StringIO(r.content.decode("utf-8-sig")))
            frames.append(df)
            day = end + timedelta(days=1)
            time.sleep(1)
        out = pd.concat(frames, ignore_index=True).drop_duplicates(["player_id", "game_pk"])
        out.to_csv(OUT / f"{season}_{kind}.csv", index=False)
        print(f"{season} {kind}: {len(out):,} pitcher-games, {out.player_id.nunique()} pitchers")
