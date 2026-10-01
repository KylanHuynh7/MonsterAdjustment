"""Grade the locked 2026 postseason prediction (predictions/2026_postseason.md).

Re-pull data first so the postseason games are included:
    .venv/bin/python scripts/pull_statcast.py
    .venv/bin/python scripts/pull_game_logs.py
Then:
    .venv/bin/python scripts/grade_postseason.py          # grades 2026
    .venv/bin/python scripts/grade_postseason.py 2025     # reproduces the 2025 baseline
"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd

RAW = Path(__file__).resolve().parent.parent / "data" / "raw"
SEASON = int(sys.argv[1]) if len(sys.argv) > 1 else 2026
POSTSEASON = ["F", "D", "L", "W"]

logs = pd.read_csv(RAW / "sasaki_game_logs.csv")
logs = logs[(logs.season == SEASON) & (logs.game_type == "P")]
pitches = pd.read_csv(RAW / f"sasaki_statcast_mlb_{SEASON}.csv", low_memory=False)
pitches = pitches[pitches.game_type.isin(POSTSEASON)].sort_values(["game_pk", "at_bat_number", "pitch_number"])

if logs.empty:
    sys.exit(f"No {SEASON} postseason appearances in the data yet.")

ip = logs.inningsPitched.astype(str).map(lambda s: int(s.split(".")[0]) + int(s.split(".")[1]) / 3).sum()
ra9 = 9 * logs.runs.sum() / ip

pa = pitches[pitches.events.notna()]
bf = len(pa)
k_pct = 100 * pa.events.isin(["strikeout", "strikeout_double_play"]).sum() / bf
bb_pct = 100 * (pa.events == "walk").sum() / bf
xw = np.where(pa.estimated_woba_using_speedangle.notna(), pa.estimated_woba_using_speedangle, pa.woba_value)
xwoba = np.nansum(xw) / pa.woba_denom.sum()
ff_velo = pitches.loc[pitches.pitch_type == "FF", "release_speed"].mean()
swings = pitches.description.isin(["swinging_strike", "swinging_strike_blocked", "missed_bunt", "foul",
                                   "foul_tip", "foul_bunt", "bunt_foul_tip", "hit_into_play"])
whiffs = pitches.description.isin(["swinging_strike", "swinging_strike_blocked", "missed_bunt"])

entry = pitches.groupby("game_pk").first()
lead = entry.fld_score - entry.bat_score
high_lev = ((entry.inning >= 7) & lead.between(0, 3)).sum()
starts = int(logs.gamesStarted.sum())

print(f"{SEASON} postseason: {len(logs)} G ({starts} GS), {ip:.2f} IP, {logs.runs.sum()} R, RA9 {ra9:.2f}, "
      f"{logs.saves.sum()} SV, {logs.holds.sum()} HLD")
print(f"Reported: BF {bf}, K% {k_pct:.1f}, BB% {bb_pct:.1f}, xwOBA {xwoba:.3f}, FF velo {ff_velo:.1f}, "
      f"whiff/swing {100 * whiffs.sum() / swings.sum():.1f}")

relief_apps = len(logs) - starts
if relief_apps < 4 or bf < 15:
    print(f"\nVERDICT: insufficient sample ({relief_apps} relief appearances, {bf} BF; need >= 4 and >= 15)")
else:
    part1 = high_lev / len(entry) >= 0.5
    part2 = ra9 <= 2.50
    print(f"\nPart 1 (role): {high_lev}/{len(entry)} high-leverage entries -> {'HIT' if part1 else 'MISS'}")
    print(f"Part 2 (performance): RA9 {ra9:.2f} vs <= 2.50 -> {'HIT' if part2 else 'MISS'}")
