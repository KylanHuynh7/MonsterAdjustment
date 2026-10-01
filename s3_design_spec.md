# DESIGN SPEC — Section 3: The Role Question (H2, H5)

All items are Claude's recommendations, applied by default per the owner's instruction (2026-09-30), and logged
in `decisions.md`. Disclosure: sample sizes (rest-day counts, BF per time through the order) were checked
before this spec was written; no outcome metrics were viewed.

## 1. Hypotheses
- **H2 (two-pitch problem):** Sasaki's arsenal holds up for 1–2 innings but not for repeated looks, so his
  times-through-order penalty (TTOP) is larger than Yamamoto's.
- **H5 (workload/recovery):** his body isn't adapted to MLB workload, which shows up as (a) worse stuff/results
  on shorter rest, (b) decline across a season, and/or (c) faster within-game decay than Yamamoto.
  Note: Sasaki never started on 4 days off (the Dodgers used a six-man rotation), so the "every 5 days" premise
  is untestable for him. The rest test is 5 days off vs. 6+ days off.

## 2. Groups and filters
Same filters as H1/Section 1 (no spring training, no 2026 postseason, no IBB PAs, pitchouts and untracked pitches dropped).
- H2: starts only. TTO 1/2/3 from `n_thruorder_pitcher`; TTO 4 excluded (Yamamoto only, 20 BF).
  Primary = 2025+2026 pooled; secondary = 2026 only (arsenal changed: FS added, SL replaced ST).
- H5(a): starts with 5 vs. 6+ days off since the previous appearance; starts after >10 days off (season start, IL return) excluded.
- H5(b): per-start trend within each season.
- H5(c): pitch-count buckets within starts: 1–25, 26–50, 51–75, 76+. Sasaki relief shown as a reference point.

## 3. Metrics
- xwOBA per PA (estimated wOBA on balls in play; actual wOBA value for K/BB/HBP), K%, BB% (unintentional), whiff per swing.
- FF velocity; zone% (Savant zone 1–9) as a command proxy in H5(c).
- Pitch mix by TTO (descriptive).
- TTO penalty = metric(TTO2) − metric(TTO1) and metric(TTO3) − metric(TTO1).

## 4. Method
- H2 and H5(c): tier-standardized (H1 hitter tiers), cluster bootstrap by game, 10,000 reps. TTO and pitch-bucket
  contrasts use the same resampled games (paired). Sasaki vs. Yamamoto contrasts use independent pools.
- H5(a): pooled over starts in each rest bucket (raw, not tier-standardized: too few PAs per start per tier), bootstrap over starts.
- H5(b): OLS slope of per-start FF velocity and per-start xwOBA on start number, bootstrap over starts.

## 5. Pre-registered thresholds
- H2: Sasaki's own TTO3−TTO1 xwOBA penalty is meaningful if ≥ .030 with CI excluding 0. **H2 supported** if Sasaki's
  penalty exceeds Yamamoto's by ≥ .030 with the CI of the difference excluding 0.
- H5(a): meaningful if FF velo differs ≥ 1.0 mph or xwOBA ≥ .040 between 5 and 6+ days off, CI excluding 0.
- H5(b): meaningful if the FF velo slope CI excludes 0 and implies ≥ 1.0 mph of change across that season's starts.
- H5(c): meaningful if Sasaki's FF velo drop (76+ minus 1–25) is ≥ 0.8 mph larger than Yamamoto's, CI excluding 0.

## 6. Visualization
1. TTO chart: xwOBA, K%, BB%, whiff by TTO, Sasaki vs. Yamamoto with CIs.
2. Stamina decay: FF velo, whiff, zone% by pitch-count bucket, Sasaki starts vs. Yamamoto starts, Sasaki relief marked.
3. Season timeline: per-start FF velo with fitted trend and days off annotated.

## 7. What would change the conclusion
- H2 fails if Sasaki's TTO penalty is no larger than Yamamoto's (or the gap is under .030 / CI includes 0).
- H5 fails if rest, season-long trend and within-game decay all show no meaningful effect.
- A large TTO penalty with no within-game velo decay would point at arsenal/sequencing (H2) rather than fatigue (H5);
  the reverse would point at H5.
