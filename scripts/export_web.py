"""Build web/public/data.json, the website's only data source.

Every number the site shows is computed here at build time from data/processed (notebook outputs) and data/raw.
The site makes no API calls and runs no model at page load.
    .venv/bin/python scripts/export_web.py
"""

import json
import re
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
RAW, PROC = ROOT / "data" / "raw", ROOT / "data" / "processed"
OUT = ROOT / "web" / "public" / "data.json"
POSTSEASON = ["F", "D", "L", "W"]
FS_ERA_START = "2026-04-25"


def est_ci(s):
    """Parse '98.9 [98.5, 99.5]' -> (98.9, 98.5, 99.5)."""
    m = re.match(r"\s*(-?[\d.]+|nan)\s*\[\s*(-?[\d.]+|nan),\s*(-?[\d.]+|nan)\]", str(s))
    return [None if v == "nan" else float(v) for v in m.groups()] if m else [None, None, None]


def clean(o):
    """Recursively turn NaN/numpy into JSON-safe values."""
    if isinstance(o, dict):
        return {k: clean(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [clean(v) for v in o]
    if isinstance(o, (np.integer,)):
        return int(o)
    if isinstance(o, (np.floating, float)):
        return None if np.isnan(o) else round(float(o), 4)
    if isinstance(o, np.bool_):
        return bool(o)
    return o


def ip_to_float(s):
    a, b = str(s).split(".")
    return int(a) + int(b) / 3


# ---------------------------------------------------------------- puzzle lines (official game logs)
logs = pd.read_csv(RAW / "sasaki_game_logs.csv")
logs["date"] = pd.to_datetime(logs.date)
logs["ip"] = logs.inningsPitched.map(ip_to_float)


def line(df, label, note):
    ip = df.ip.sum()
    return {"label": label, "note": note, "g": len(df), "gs": int(df.gamesStarted.sum()), "ip": ip,
            "ip_display": f"{int(ip)}.{round((ip - int(ip)) * 3)}", "era": 9 * df.earnedRuns.sum() / ip,
            "ra9": 9 * df.runs.sum() / ip, "whip": (df.hits.sum() + df.baseOnBalls.sum()) / ip,
            "k_pct": 100 * df.strikeOuts.sum() / df.battersFaced.sum(),
            "bb_pct": 100 * df.baseOnBalls.sum() / df.battersFaced.sum(), "saves": int(df.saves.sum())}


reg = logs[logs.game_type == "R"]
puzzle = [
    line(reg[(reg.season == 2025) & (reg.gamesStarted == 1)], "2025 starter", "8 starts before the shoulder IL"),
    line(logs[(logs.season == 2025) & (logs.game_type == "P")], "2025 postseason", "Closer for the World Series run"),
    line(reg[(reg.season == 2026) & (reg.date < "2026-07-14")], "2026 first half", "All starts, through the All-Star break"),
    line(reg[(reg.season == 2026) & (reg.date > "2026-07-14") & (reg.gamesStarted == 1)], "2026 second half",
         "Starts after the All-Star break"),
    line(reg[reg.season == 2026], "2026 full season", "23 starts, 3 relief outings"),
]


# ---------------------------------------------------------------- per-start table (velocity / xwOBA)
def load_pitches(name, seasons):
    d = pd.concat([pd.read_csv(RAW / f"{name}_statcast_mlb_{y}.csv", low_memory=False).assign(season=y)
                   for y in seasons], ignore_index=True)
    d = d[(d.game_type != "S") & ~((d.season == 2026) & d.game_type.isin(POSTSEASON))]
    d["pa_id"] = d.game_pk.astype(str) + "_" + d.at_bat_number.astype(str)
    return d[~d.pa_id.isin(d.loc[d.events == "intent_walk", "pa_id"])]


sas = load_pitches("sasaki", [2025, 2026])
sas["role"] = np.where(sas.groupby("game_pk").inning.transform("min") == 1, "start", "relief")
pa = sas[sas.events.notna()].copy()
pa["xw"] = np.where(pa.estimated_woba_using_speedangle.notna(), pa.estimated_woba_using_speedangle, pa.woba_value)
app = pd.DataFrame({
    "date": sas.groupby("game_pk").game_date.first(),
    "season": sas.groupby("game_pk").season.first(),
    "role": sas.groupby("game_pk").role.first(),
    "game_type": sas.groupby("game_pk").game_type.first(),
    "ff_velo": sas[sas.pitch_type == "FF"].groupby("game_pk").release_speed.mean(),
    "fo_velo": sas[sas.pitch_type == "FO"].groupby("game_pk").release_speed.mean(),
    "fs_velo": sas[sas.pitch_type == "FS"].groupby("game_pk").release_speed.mean(),
    "xwoba": pa.groupby("game_pk").xw.sum() / pa.groupby("game_pk").woba_denom.sum(),
}).reset_index().sort_values("date")
app = app.merge(logs[["game_pk", "runs", "inningsPitched"]], on="game_pk", how="left")
app["fs_era"] = (app.role == "start") & (app.date >= FS_ERA_START)
appearances = app.to_dict("records")

# ---------------------------------------------------------------- movement centroids
sas["ivb"], sas["hb"] = sas.pfx_z * 12, sas.pfx_x * 12
sas["context"] = sas.season.astype(str) + " " + sas.role
mv = (sas[sas.pitch_type.isin(["FF", "FO", "FS", "ST", "SL"])].groupby(["context", "pitch_type"])
      .agg(n=("ivb", "size"), ivb=("ivb", "mean"), hb=("hb", "mean"), velo=("release_speed", "mean")).reset_index())
yam = load_pitches("yamamoto", [2024, 2025, 2026])
yam = yam[yam.groupby("game_pk").inning.transform("min") == 1]
yam["ivb"], yam["hb"] = yam.pfx_z * 12, yam.pfx_x * 12
ymv = (yam[yam.pitch_type.isin(["FF", "FS"])].groupby(["season", "pitch_type"])
       .agg(n=("ivb", "size"), ivb=("ivb", "mean"), hb=("hb", "mean"), velo=("release_speed", "mean")).reset_index())

# ---------------------------------------------------------------- notebook outputs
h1_groups = pd.read_csv(PROC / "h1_group_results.csv")
h1_contrasts = pd.read_csv(PROC / "h1_contrasts.csv")
h1_link_e = pd.read_csv(PROC / "h1_link_e.csv", index_col=0)
h1_starts = pd.read_csv(PROC / "h1_start_level.csv")
s1_phys = pd.read_csv(PROC / "s1_physical.csv")
s1_eff = pd.read_csv(PROC / "s1_effectiveness.csv")
s1_con = pd.read_csv(PROC / "s1_contrasts.csv")
s3_tto = pd.read_csv(PROC / "s3_tto.csv")
s3_decay = pd.read_csv(PROC / "s3_decay.csv")
s3_rest = pd.read_csv(PROC / "s3_rest.csv")
s3_trend = pd.read_csv(PROC / "s3_trend.csv")
s5 = pd.read_csv(PROC / "s5_velocity_exploratory.csv")
s5_fs = pd.read_csv(PROC / "s5_fs_era.csv")
s7 = pd.read_csv(PROC / "s7_pitch_model.csv")
s8_slopes = pd.read_csv(PROC / "s8_league_slopes.csv")
s8_bench = pd.read_csv(PROC / "s8_benchmark.csv")
mc = pd.read_csv(PROC / "s6_multiple_comparisons.csv")
rob = pd.read_csv(PROC / "s6_robustness_h1.csv")
zone = pd.read_csv(PROC / "s6_attack_zone_validation.csv")

velo_ctx = []
for _, r in s1_phys[s1_phys.pitch == "FF"].iterrows():
    e, lo, hi = est_ci(r.velo)
    velo_ctx.append({"pitcher": r.pitcher, "context": r.context, "games": r.games, "n": r.n, "est": e, "lo": lo, "hi": hi})

splitters = []
for _, r in s1_phys[(s1_phys.pitcher == "sasaki") & s1_phys.pitch.isin(["FO", "FS"])].iterrows():
    row = {"pitcher": r.pitcher, "context": r.context, "pitch": r.pitch, "n": r.n}
    for col in ["velo", "spin", "IVB (in)", "HB (in)"]:
        row[col.split(" ")[0].lower()] = est_ci(r[col])[0]
    eff = s1_eff[(s1_eff.pitcher == r.pitcher) & (s1_eff.context == r.context) & (s1_eff.pitch == r.pitch)]
    if len(eff):
        row["whiff"], row["chase"] = est_ci(eff.iloc[0]["whiff/swing"])[0], est_ci(eff.iloc[0]["chase"])[0]
    splitters.append(row)
yam_fs = s1_phys[(s1_phys.pitcher == "yamamoto") & (s1_phys.pitch == "FS")]
for _, r in yam_fs.iterrows():
    eff = s1_eff[(s1_eff.pitcher == "yamamoto") & (s1_eff.context == r.context) & (s1_eff.pitch == "FS")].iloc[0]
    splitters.append({"pitcher": "yamamoto", "context": r.context, "pitch": "FS", "n": r.n, "velo": est_ci(r.velo)[0],
                      "spin": est_ci(r.spin)[0], "ivb": est_ci(r["IVB (in)"])[0], "hb": est_ci(r["HB (in)"])[0],
                      "whiff": est_ci(eff["whiff/swing"])[0], "chase": est_ci(eff["chase"])[0]})

tto = []
for _, r in s3_tto.iterrows():
    for t in [1, 2, 3]:
        e, lo, hi = est_ci(r[f"TTO{t}"])
        tto.append({"pitcher": r.pitcher, "sample": r["sample"], "metric": r.metric, "tto": t, "est": e, "lo": lo, "hi": hi})

decay = []
for _, r in s3_decay.iterrows():
    for b in ["1-25", "26-50", "51-75", "76+"]:
        if isinstance(r.get(b), str):
            e, lo, hi = est_ci(r[b])
            decay.append({"group": r.group, "metric": r.metric, "bucket": b, "est": e, "lo": lo, "hi": hi})

# season velocity timeline (starts) with days off
st = logs[(logs.gamesStarted == 1) & (logs.game_type == "R")].sort_values("date").copy()
st["days_off"] = st.groupby("season").date.diff().dt.days - 1
st = st.merge(app[["game_pk", "ff_velo", "xwoba"]], on="game_pk")
st["start_no"] = st.groupby("season").cumcount() + 1
season_starts = st[["season", "date", "start_no", "days_off", "ff_velo", "xwoba", "runs", "ip"]].to_dict("records")

# terciles of Sasaki starts by velocity
sp = app[app.role == "start"].copy()
sp["tercile"] = pd.qcut(sp.ff_velo, 3, labels=["Low", "Mid", "High"])
pa_st = pa[pa.game_pk.isin(sp.game_pk)]
terc = []
for t, g in sp.groupby("tercile", observed=True):
    p = pa_st[pa_st.game_pk.isin(g.game_pk)]
    terc.append({"tercile": t, "starts": len(g), "lo": g.ff_velo.min(), "hi": g.ff_velo.max(),
                 "n2025": int((g.season == 2025).sum()), "n2026": int((g.season == 2026).sum()),
                 "xwoba": p.xw.sum() / p.woba_denom.sum(), "runs_per_9": 9 * g.runs.sum() / g.inningsPitched.map(ip_to_float).sum()})

# league histogram bins (Plotly basic has no histogram trace)
edges = np.arange(-0.12, 0.125, 0.01)
counts, _ = np.histogram(s8_slopes.slope_raw.clip(-0.119, 0.119), bins=edges)
league = {
    "bins": [{"x0": float(a), "x1": float(b), "count": int(c)} for a, b, c in zip(edges[:-1], edges[1:], counts)],
    "pitchers": s8_slopes[["player_id", "player_name", "starts", "ff_velo", "slope_raw", "r_raw", "p_raw",
                           "slope_centered"]].to_dict("records"),
    "noise_band": [float(s8_slopes.null_lo_raw.median()), float(s8_slopes.null_hi_raw.median())],
    "benchmark": s8_bench.to_dict("records"),
}

# multiple-comparison summary
mc_summary = []
for fam, g in mc.groupby("family", sort=False):
    mc_summary.append({"family": fam, "tests": len(g), "claimed": int(g.claimed.sum()),
                       "surviving": int((g.claimed & g.holm_reject).sum()), "expected_fp": round(0.05 * len(g), 1)})

# exploratory (2026-10-02): balls in play and strikeouts per PA, bad vs. good starts
pa_r = pa[(pa.game_type == "R") & pa.game_pk.isin(app.loc[app.role == "start", "game_pk"]) & (pa.events != "intent_walk")]
bip = pa_r.groupby("game_pk").agg(n=("events", "size"), bip=("description", lambda x: (x == "hit_into_play").sum()),
                                  k=("events", lambda e: e.isin(["strikeout", "strikeout_double_play"]).sum()))
bip["bad"] = bip.index.map(logs.set_index("game_pk").runs) >= 3
rng = np.random.default_rng(1)
contact = []
for col, label in [("bip", "Balls in play per PA"), ("k", "Strikeout rate")]:
    good, bad = bip[~bip.bad], bip[bip.bad]
    obs = 100 * (bad[col].sum() / bad.n.sum() - good[col].sum() / good.n.sum())
    draws = []
    for _ in range(10_000):
        gi, bi = rng.integers(0, len(good), len(good)), rng.integers(0, len(bad), len(bad))
        draws.append(100 * (bad[col].values[bi].sum() / bad.n.values[bi].sum() - good[col].values[gi].sum() / good.n.values[gi].sum()))
    contact.append({"metric": label, "good": 100 * good[col].sum() / good.n.sum(), "bad": 100 * bad[col].sum() / bad.n.sum(),
                    "diff": obs, "lo": float(np.percentile(draws, 2.5)), "hi": float(np.percentile(draws, 97.5))})

ledger = json.loads((ROOT / "predictions" / "ledger.json").read_text())
head = __import__("subprocess").run(["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True).stdout.strip()

bundle = {
    "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    "commit": head,
    "data_through": str(logs[logs.game_type == "R"].date.max().date()),
    "puzzle": puzzle,
    "appearances": appearances,
    "h1": {
        "groups": h1_groups.to_dict("records"),
        "contrasts": h1_contrasts.to_dict("records"),
        "link_e": h1_link_e.reset_index().rename(columns={"index": "metric"}).to_dict("records"),
        "starts": h1_starts[["pitcher_name", "date", "runs", "bb_pct", "xwobacon", "bad"]].to_dict("records"),
        "contact_exploratory": contact,
    },
    "s1": {"velo_ctx": velo_ctx, "splitters": splitters, "contrasts": s1_con.to_dict("records"),
           "movement": mv.to_dict("records"), "yam_movement": ymv.to_dict("records")},
    "s3": {"tto": tto, "decay": decay, "rest": s3_rest.to_dict("records"), "trend": s3_trend.to_dict("records"),
           "season_starts": season_starts},
    "velocity": {"all": s5.to_dict("records"), "fs_era": s5_fs.to_dict("records"), "terciles": terc,
                 "model": s7.to_dict("records")},
    "league": league,
    "rigor": {"mc_summary": mc_summary, "mc": mc.to_dict("records"), "robustness": rob.to_dict("records"),
              "zone": zone.to_dict("records")},
    "ledger": ledger,
}
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(clean(bundle), default=str))
print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.0f} KB)")
