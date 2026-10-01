# DESIGN SPEC — Section 1: The Stuff Decomposition (H3, H4)

All items below are Claude's recommendations, applied by default per the owner's instruction (2026-09-30)
and logged in `decisions.md`. The owner may override any of them.

**Disclosure:** some descriptive velocity and pitch-shape numbers were seen before this spec was written
(phase 1 data review; the FO/FS check on 2026-10-01). Thresholds below were set after that exposure.

## 1. Hypotheses being tested
- **H3 (velocity):** Sasaki's fastball has lost meaningful velocity from his NPB peak (doc: NPB peak ~98–99 mph avg).
- **H4 (splitter):** His splitter is structurally weaker in MLB: less drop, a smaller velocity gap from the fastball,
  or less effective. With no NPB pitch data, H4 is tested within MLB: across contexts, and across his two splitters
  (2025 FO vs. 2026 FS).

## 2. Contexts
Sasaki: 2025 starts, 2025 relief (late season + postseason), 2026 starts, 2026 relief (September).
Spring training excluded; 2026 postseason excluded (held out for the locked prediction).
Benchmark: Yamamoto starts by season (2024, 2025, 2026), FF and FS.
NPB: qualitative reference band only (98–99 mph four-seam average, per METHODOLOGY.md); no statistical comparison.

## 3. Metric definitions
- Pitch groups: FF, FO, FS kept separate (FO and FS differ by ~5 mph, ~300 rpm, ~4 in of horizontal break).
  Breaking balls (2025 ST, 2026 SL) appear in the movement chart only.
- Physical (no hitter adjustment): velocity (mean and per-game 90th percentile for FF), spin rate,
  induced vertical break (pfx_z × 12, in), horizontal break (pfx_x × 12, in; negative = arm side for this RHP),
  FF-minus-splitter velocity gap.
- Delivery: arm angle, release_pos_x, release_pos_z, extension; consistency = per-game SD of FF release_pos_x / release_pos_z.
- Effectiveness (tier-standardized as in H1): whiff per swing; chase rate = swings / out-of-zone pitches (zone 11–14), all counts.

## 4. Data filters
Same as H1: intentional-walk PAs, pitchouts, and pitches with no location or tracking dropped. Unknown pitch types dropped.

## 5. Statistical method
Context means with 95% cluster-bootstrap CIs (resampling games, 10,000 reps). Effectiveness metrics are
tier-standardized (two tiers, regressed same-season xwOBA, league median split).
Contrasts are differences of bootstrap draws (independent pools for different contexts).

## 6. Pre-registered thresholds
- **H3:** "Below NPB band" = a context's FF average is ≥ 1.0 mph under 98.0 (i.e., ≤ 97.0). Descriptive only.
  A within-MLB velocity change is meaningful if |diff| ≥ 1.0 mph with a CI excluding 0.
- **H4:** a splitter shape change is meaningful if |ΔIVB| or |ΔHB| ≥ 2.0 in, or the FF-splitter gap changes ≥ 1.5 mph,
  with CI excluding 0. An effectiveness change is meaningful if whiff per swing or chase rate differs ≥ 8 pts with CI excluding 0.
- Contrasts graded: 2026 starts − 2025 starts (FF); relief − starts within each season (FF, splitter);
  2026 FS − 2025 FO in starts (the splitter change).

## 7. Expected visualization
1. Movement plot (HB vs. IVB), Sasaki pitch types by context, with Yamamoto FF/FS centroids in gray.
2. Velocity timeline: per-appearance FF and splitter average, starts vs. relief marked, FO→FS transition visible.
3. Delivery panel: arm angle and release point by context.

## 8. What would change the conclusion
- H3 fails if MLB starter FF averages sit within 1 mph of the NPB band (> 97.0).
- H4 fails if splitter shape and effectiveness don't differ meaningfully between starts and relief, and the 2026 FS
  isn't weaker than the 2025 FO on movement or results.
- If velocity and shape are unchanged but effectiveness drops, the problem lies outside raw stuff
  (sequencing, location, or deception), which points back to H1 / H2.
