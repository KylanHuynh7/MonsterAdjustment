"""Pull official pitching game logs (runs charged, ER, IP, BB, etc.) from the MLB Stats API.

Run from the project root:
    .venv/bin/python scripts/pull_game_logs.py
"""

from pathlib import Path

import pandas as pd
import requests

RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw"

PITCHERS = {"sasaki": 808963, "yamamoto": 808967}
SEASONS = {"sasaki": [2025, 2026], "yamamoto": [2024, 2025, 2026]}
GAME_TYPES = ["R", "P"]  # regular season, postseason

for name, mlbam_id in PITCHERS.items():
    rows = []
    for season in SEASONS[name]:
        for gt in GAME_TYPES:
            url = (f"https://statsapi.mlb.com/api/v1/people/{mlbam_id}/stats"
                   f"?stats=gameLog&group=pitching&season={season}&gameType={gt}")
            stats = requests.get(url, timeout=30).json()["stats"]
            splits = stats[0]["splits"] if stats else []  # empty when no games of this type
            for s in splits:
                rows.append({"season": season, "game_type": gt, "date": s["date"],
                             "game_pk": s["game"]["gamePk"], "opponent": s["opponent"]["name"],
                             **s["stat"]})
    df = pd.DataFrame(rows)
    out = RAW_DIR / f"{name}_game_logs.csv"
    df.to_csv(out, index=False)
    print(f"{name}: {len(df)} games -> {out.name}")
