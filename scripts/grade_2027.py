"""Grade the 2027 projection (predictions/2027_season.md).

Re-pull first (add 2027 to SEASONS in scripts/pull_statcast.py and scripts/pull_game_logs.py):
    .venv/bin/python scripts/pull_statcast.py
    .venv/bin/python scripts/pull_game_logs.py
Then:
    .venv/bin/python scripts/grade_2027.py             # grades 2027
    .venv/bin/python scripts/grade_2027.py 2026        # dry run on 2026 data
"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd

RAW = Path(__file__).resolve().parent.parent / "data" / "raw"
SEASON = int(sys.argv[1]) if len(sys.argv) > 1 else 2027

logs = pd.read_csv(RAW / "sasaki_game_logs.csv")
logs = logs[(logs.season == SEASON) & (logs.game_type == "R")].copy()
if logs.empty:
    sys.exit(f"No {SEASON} regular-season appearances in the data yet.")
logs["date"] = pd.to_datetime(logs.date)
logs = logs.sort_values("date")
logs["ip"] = logs.inningsPitched.astype(str).map(lambda s: int(s.split(".")[0]) + int(s.split(".")[1]) / 3)

# Part 1 — role through June 30
h1 = logs[logs.date <= f"{SEASON}-06-30"]
gs, apps = int(h1.gamesStarted.sum()), len(h1)
share = gs / apps if apps else 0
gaps = h1.date.diff().dt.days.max() if apps > 1 else np.nan
print(f"Part 1 (through Jun 30): {gs} starts / {apps} appearances ({100 * share:.0f}%), longest gap {gaps} days")
if apps and gaps > 30 and not (gs >= 10 and share >= 0.8):
    print("  -> MISS (injury) — check IL history to confirm")
else:
    print("  ->", "HIT" if (gs >= 10 and share >= 0.8) else "MISS")

# Part 2 — first 10 starts
st = logs[logs.gamesStarted == 1].head(10)
ip = st.ip.sum()
pitches = pd.read_csv(RAW / f"sasaki_statcast_mlb_{SEASON}.csv", low_memory=False)
pitches = pitches[pitches.game_pk.isin(st.game_pk)]
pa = pitches[pitches.events.notna() & (pitches.events != "intent_walk")].copy()
pa["xw"] = np.where(pa.estimated_woba_using_speedangle.notna(), pa.estimated_woba_using_speedangle, pa.woba_value)
print(f"\nPart 2 (first {len(st)} starts): IP {ip:.2f}, RA9 {9 * st.runs.sum() / ip:.2f}, ERA {9 * st.earnedRuns.sum() / ip:.2f}, "
      f"WHIP {(st.hits.sum() + st.baseOnBalls.sum()) / ip:.2f}, K% {100 * st.strikeOuts.sum() / st.battersFaced.sum():.1f}, "
      f"BB% {100 * st.baseOnBalls.sum() / st.battersFaced.sum():.1f}, xwOBA {pa.xw.sum() / pa.woba_denom.sum():.3f}, "
      f"FF {pitches[pitches.pitch_type == 'FF'].release_speed.mean():.1f}, IP/GS {ip / len(st):.1f}")
if len(st) < 6:
    print("  -> insufficient sample (< 6 starts)")
else:
    print("  ->", "HIT" if 9 * st.runs.sum() / ip <= 3.75 else "MISS", "(RA9 <= 3.75)")

# Part 3 — H3 consequence (only if accepted in the prediction file)
per = pa.groupby("game_pk").agg(xn=("xw", "sum"), xd=("woba_denom", "sum"))
per["ff"] = pitches[pitches.pitch_type == "FF"].groupby("game_pk").release_speed.mean()
hi, lo = per[per.ff >= 98.0], per[per.ff < 98.0]
print(f"\nPart 3 (H3): >=98.0 mph starts {len(hi)}, xwOBA {hi.xn.sum() / hi.xd.sum():.3f} | "
      f"<98.0 starts {len(lo)}, xwOBA {lo.xn.sum() / max(lo.xd.sum(), 1):.3f}")
if len(hi) < 3 or len(lo) < 3:
    print("  -> not gradeable (need >= 3 starts in each group)")
else:
    print("  ->", "HIT" if hi.xn.sum() / hi.xd.sum() < lo.xn.sum() / lo.xd.sum() else "MISS")
