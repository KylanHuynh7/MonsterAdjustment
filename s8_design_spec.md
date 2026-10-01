# DESIGN SPEC — League benchmark for velocity dependence (H3)

Claude's recommendations, accepted by the owner (2026-10-01). Committed **before** any league data was pulled.
Disclosure: Sasaki's and Yamamoto's own per-start slopes are already known (notebook 05). A two-day test query
(2026-06-01 to 06-03) was run only to confirm Savant's grouped CSV format; no league results were examined.

## 1. Question
Is Sasaki's start-to-start link between four-seam velocity and results (xwOBA allowed) unusually strong compared
with other MLB starters, or typical?

## 2. Data (option B)
Baseball Savant search CSV grouped by pitcher × game (`group_by=name-date`), regular season 2025 and 2026, pulled
in date chunks:
- all pitches → per-game PA and xwOBA;
- four-seam only (`hfPT=FF`) → per-game four-seam velocity and count;
- 1st inning only (`hfInn=1`) → which pitchers pitched the 1st inning (start indicator).
**Validation gate:** before any league analysis, Savant's grouped values must reproduce our own Sasaki per-start
values (four-seam velocity mean absolute difference ≤ 0.1 mph, xwOBA mean absolute difference ≤ .010, r ≥ 0.98).
If the gate fails, switch to option A (full pitch-level pull) and note it in `decisions.md`.

## 3. Inclusion
- Start = pitched in the 1st inning AND ≥ 9 PA in the game (removes openers).
- Start counts only if it has ≥ 10 four-seamers (velocity needs a real sample).
- Pitcher included if he has ≥ 15 qualifying starts across 2025–26. Pitchers without a four-seam are excluded by
  construction; the benchmark describes four-seam starters only.

## 4. Metrics
Per pitcher: OLS slope of per-start xwOBA on per-start four-seam velocity (xwOBA per +1 mph) and Pearson r, both
raw and season-centered (velocity minus that pitcher's season mean). Sasaki and Yamamoto computed the same way from
the same Savant source, so they're comparable with the league.

## 5. Method
- League distribution of slopes; Sasaki's percentile (lower = more velocity-dependent, i.e., more negative).
- Noise check: for each pitcher, shuffle velocity across his starts 1,000 times to get the noise-only slope
  distribution. Report Sasaki's permutation p-value, and estimate the real spread across pitchers as observed slope
  variance minus mean noise variance.
- Primary = raw; secondary = season-centered.

## 6. Pre-registered threshold
Sasaki is **unusually velocity-dependent** if BOTH:
(a) his raw slope is below the league's 10th percentile, and
(b) his permutation p < 0.05 (one-sided, negative direction).
Otherwise his dependence is **typical** (within the 10th–90th percentile) or **not distinguishable from noise**.
The same rule applied to the season-centered slope is reported as secondary.

## 7. Visualization
Distribution (histogram + strip) of league slopes, with Sasaki and Yamamoto marked and the median noise-only 95%
band shaded.

## 8. What would change the conclusion
If Sasaki sits inside the league's 10th–90th percentile, velocity still describes his results, but it isn't
unique to him: H3 becomes "he's a normal velocity-dependent pitcher", not "he's unusually velocity-dependent."
