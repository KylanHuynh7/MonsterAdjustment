"""Pull raw Statcast pitch-level data for Sasaki (subject) and Yamamoto (control).

Pulls every pitch Baseball Savant has for each pitcher-season, unfiltered.
No context grouping, IL handling, or game-type filtering happens here --
those are design decisions and belong in the analysis notebooks.

Run from the project root:
    .venv/bin/python scripts/pull_statcast.py
"""

from pathlib import Path

from pybaseball import cache, statcast_pitcher

cache.enable()

RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

# MLBAM ids, confirmed via pybaseball.playerid_lookup
PITCHERS = {
    "sasaki": 808963,
    "yamamoto": 808967,
}

# Sasaki's MLB career starts in 2025; Yamamoto's in 2024.
SEASONS = {
    "sasaki": [2025, 2026],
    "yamamoto": [2024, 2025, 2026],
}

for name, mlbam_id in PITCHERS.items():
    for season in SEASONS[name]:
        # Full calendar year so spring training and postseason are captured if present
        df = statcast_pitcher(f"{season}-01-01", f"{season}-12-31", player_id=mlbam_id)
        out = RAW_DIR / f"{name}_statcast_mlb_{season}.csv"
        df.to_csv(out, index=False)
        game_types = df["game_type"].value_counts().to_dict() if len(df) else {}
        print(f"{name} {season}: {len(df):,} pitches, "
              f"{df['game_pk'].nunique() if len(df) else 0} games, "
              f"game_type counts {game_types} -> {out.name}")
