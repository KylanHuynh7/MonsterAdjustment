# The Monster's Adjustment

Why did Roki Sasaki post a 0.84 ERA as a 2025 postseason closer but struggle as an MLB starter? This project
breaks his NPB-to-MLB transition into testable hypotheses, using **Yoshinobu Yamamoto as a matched control**:
same team, same pitching coach, same catchers, same NPB-to-MLB path, one MLB year ahead.

> **Picking this up after a break?** Start with [`AGENDA.md`](AGENDA.md) for where things stand and what's next.
> [`METHODOLOGY.md`](METHODOLOGY.md) is the original research plan and the working rules for Claude Code sessions.
> [`decisions.md`](decisions.md) records every design choice and why it was made.
> [`LIMITATIONS.md`](LIMITATIONS.md) covers what the analysis cannot claim.

## How the project was run

- **Pre-registered.** Each section's design spec (hypothesis, metrics, filters, method, thresholds, falsification
  criteria) was written and committed before its analysis code ran. Analyses designed after seeing results are
  labelled **exploratory**.
- **Uncertainty everywhere.** Samples are small, so results are reported as effect sizes with 95% cluster-bootstrap
  confidence intervals (resampling games, not pitches). No claim rests on a p-value.
- **Hitter-quality adjusted.** Comparisons are made within two tiers of opposing-batter quality (same-season xwOBA,
  regressed toward league average).
- **Predictions locked before outcomes.** Both forecasts were committed before any of the games they predict.

## Results by section

| Section | Hypothesis | Pre-registered verdict |
|---|---|---|
| 2 — Command ([spec](h1_design_spec.md), [notebook](notebooks/03_command_investigation.ipynb)) | **H1** walk chain: failed two-strike putaway → expands → no chase → walk → walks separate good starts from bad | Links (a), (c) and (d) inconclusive; (b) he expands, supported; **(e) not supported**: contact quality separated bad starts, walks did not |
| 1 — Stuff ([spec](s1_design_spec.md), [notebook](notebooks/02_stuff_decomposition.ipynb)) | **H3** velocity loss; **H4** splitter shape | 2025 starter FF (96.0) below the NPB reference band; 2026 starter FF (97.8) not. The 2026 FS is a different, harder pitch than the 2025 FO (+5.4 mph, +5.1 in IVB) |
| 3 — Role ([spec](s3_design_spec.md), [notebook](notebooks/04_role_question.ipynb)) | **H2** times-through-order penalty; **H5** workload | H2 not supported. H5 rest and within-game fade not meaningful; in-season velocity trend meaningful (2025 −2.75 mph across 8 pre-IL starts; 2026 +1.6 mph) |
| Exploratory ([notebook](notebooks/05_velocity_exploratory.ipynb)) | Does per-start velocity track per-start results? | Per-start FF velocity vs. xwOBA allowed: r = −0.54 (all 31 starts); r = −0.43 within new-splitter starts only (19), −0.49 with the time trend removed |

**Dominant hypothesis (owner's call): H3, specifically fastball velocity.**

## Locked predictions

| Prediction | Locked | Graded by |
|---|---|---|
| [2026 postseason](predictions/2026_postseason.md): repeats his 2025 postseason performance as a high-leverage reliever | 2026-10-01, before NLDS Game 1 | `scripts/grade_postseason.py` |
| [2027 season](predictions/2027_season.md): full-time starter, opens 2027 like his 2026 post-break starts, results track velocity | 2026-10-01 | `scripts/grade_2027.py` |

## Repository

```
data/raw/          Statcast pitch data, MLB Stats API game logs, batter xwOBA (as pulled, unfiltered)
data/processed/    Result tables written by the notebooks
notebooks/         01 data first look · 02 stuff (S1) · 03 command (S2/H1) · 04 role (S3) · 05 velocity (exploratory)
figures/           All charts
scripts/           Data pulls, prediction graders, run_all.sh
predictions/       Locked forecasts
*_design_spec.md   Pre-registered specs per section
```

## Reproduce

Requires [uv](https://docs.astral.sh/uv/).

```bash
bash scripts/run_all.sh          # re-run every notebook on the committed data
bash scripts/run_all.sh --pull   # re-pull all data first
```

Bootstraps are seeded, so a re-run on the same data reproduces every table and figure exactly.

*Data: Baseball Savant (Statcast), MLB Stats API, Baseball Reference. Pitcher: Roki Sasaki (#11, LA Dodgers).*
