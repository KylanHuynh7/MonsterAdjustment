# Limitations

What this analysis cannot claim, and why. Each item links back to the decision or result it comes from.

## Data coverage
- **No pre-MLB pitch tracking.** NPB doesn't publish Statcast-equivalent data, and Savant returns nothing for
  Sasaki's 2023 WBC games. Every NPB comparison is against a reported reference band (98–99 mph four-seam average),
  not tracked data.
- **Retroactive pitch relabel.** In spring 2026 Statcast renamed Sasaki's original splitter "forkball" (FO) after he
  introduced a new splitter grip (FS). All 2025 data shows FO. Analyses follow Statcast's current labels.
- **Attack-zone bands are approximated, and validated.** Bands are computed from pitch location and batter zone height
  using Savant's published percentages. Checked against Savant's run value by zone, chase and waste agree within
  0.25 runs per pitcher-season; heart and shadow within 0.91 (pitches on that boundary). See `notebooks/06_checks.ipynb`.
- **League benchmark covers velocity dependence only.** It compares 200 four-seam starters (2025–26) using Savant's
  per-game summaries, validated against our own Sasaki values. Sinker-first starters are excluded by construction.
  League times-through-order was not benchmarked; Yamamoto remains the only TTO comparison.

## Sample size
- **Relief ceiling:** 14 appearances, 239 pitches, 61 batters faced. Several H1 cells fall below 30 per hitter tier
  and are flagged "low n".
- **2026 relief:** 3 games. Game-resampled intervals here rest on very few distinct resamples and are unreliable.
- **Starts:** 31 in total (8 in 2025, 23 in 2026). Start-level analyses (H1 link (e), rest, trends, velocity) have
  wide intervals.
- **Single control.** Yamamoto is n = 1. That buys internal validity (same staff and system) at the cost of external
  validity. Nothing here generalizes to "Japanese pitchers in MLB."

## Confounds
- **Role package.** Starter vs. reliever differs in effort, leverage, adrenaline and warm-up routine, as well as
  velocity. The fresh-starter group removes fatigue only. Warm-up routine isn't measurable in Statcast.
- **Velocity is bundled with other 2026 changes.** His high-velocity starts are all from 2026, alongside a new
  splitter, a new slider and a ~5° higher arm angle. The FS-era-only check holds the splitter constant, but
  mechanics and the time of season remain partly entangled.
- **2025 injury.** The 2025 in-season velocity decline covers the 8 starts before his shoulder-impingement IL stint.
  It can't be separated from the injury.
- **Rest premise untestable.** Sasaki never started on 4 days off (the Dodgers used a six-man rotation), so the
  "every 5 days" version of H5 can't be tested.

## Inference
- **Exploratory analyses.** The per-start velocity checks (notebook 05) and the pitch-level model (notebook 07) were
  designed after seeing Sections 1–3. They generate hypotheses and don't confirm them. Per-pitch run value is very
  noisy (R² ≈ 0.03), so the pitch model can only detect large effects.
- **Multiple comparisons.** Pre-registered verdicts use uncorrected 95% CIs. A Holm check within each section
  (`notebooks/06_checks.ipynb`) keeps 12 of 16 claimed Section 1 effects and 1 of 3 in Section 3 (only the 2025
  velocity decline). Results that don't survive should be presented as suggestive.
- **Thresholds after partial exposure.** Some descriptive velocity and shape numbers were seen before the Section 1
  thresholds were set (disclosed in its spec).
- **Post-hoc candidates not applied.** The two high-walk Tokyo/March 2025 starts were kept, per the pre-registration.
  Dropping them (robustness check) changes no H1 verdict.
