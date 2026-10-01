# Limitations

What this analysis cannot claim, and why. Each item links back to the decision or result it comes from.

## Data coverage
- **No pre-MLB pitch tracking.** NPB doesn't publish Statcast-equivalent data, and Savant returns nothing for
  Sasaki's 2023 WBC games. Every NPB comparison is against a reported reference band (98–99 mph four-seam average),
  not tracked data.
- **Retroactive pitch relabel.** In spring 2026 Statcast renamed Sasaki's original splitter "forkball" (FO) after he
  introduced a new splitter grip (FS). All 2025 data shows FO. Analyses follow Statcast's current labels.
- **Attack-zone bands are approximated.** Shadow / chase / waste bands are computed from pitch location and batter
  zone height using Savant's published percentages, not taken from Savant's own field.
- **No league-average benchmarks.** League times-through-order and league velocity-sensitivity comparisons would need
  a full-league pull and were deferred. Yamamoto is the only comparison.

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
- **Exploratory analyses.** The per-start velocity checks (notebook 05) were designed after seeing Sections 1–3. They
  generate hypotheses and don't confirm them.
- **Multiple comparisons.** Section 1 ran 38 contrasts and Section 3 several more. Some "meaningful" verdicts are
  expected by chance, and no family-wise correction has been applied yet.
- **Thresholds after partial exposure.** Some descriptive velocity and shape numbers were seen before the Section 1
  thresholds were set (disclosed in its spec).
- **Post-hoc candidates not applied.** The two high-walk Tokyo/March 2025 starts were flagged but kept, per the
  pre-registration.
