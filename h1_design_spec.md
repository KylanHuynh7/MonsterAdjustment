# DESIGN SPEC — H1: The Command Hypothesis

## 1. Hypothesis being tested
When Sasaki can't put a hitter away with two strikes, he tries to get them to chase out of the zone;
when they don't chase, the at-bat ends in a walk — and those walks, not hard contact, are what separate
his scoreless or quality starts from his 3+ run starts.

Chain:
(a) two-strike putaway fails → (b) he expands out of the zone for a chase → (c) hitters don't bite
→ (d) walk → (e) walks drive the good-start / bad-start split

## 2. Comparison baseline ("ceiling")
All Sasaki MLB relief appearances, pooled:
- 2025 late regular season relief (2 G, 25 pitches, 7 BF)
- 2025 postseason (9 G, 166 pitches, 43 BF)
- 2026 September relief (3 G, 48 pitches, 11 BF)
- plus any 2026 postseason relief appearances (TBD: include or hold out)
Total to date: 14 G, 239 pitches, 61 BF. Pitch-level metrics preferred over outcome metrics at this sample size.
Intermediate group ("fresh starter"): every PA that begins within the first 15 pitches of a Sasaki start,
played out in full (31 starts, 127 BF, ~503 pitches).
Controls for within-start fatigue, not for effort level: fresh-starter FF avg 97.6 vs relief 99.0.
Secondary benchmark: Yamamoto (same staff/system, larger sample).

### Known confounds (starter vs. reliever)
- Effort level / velocity: relief FF ~1.4 mph harder than fresh-starter FF.
- Pre-appearance routine: starters do a full scheduled pregame warmup and pitch immediately;
  relievers watch ~5-6 innings, then warm up quickly in the bullpen on call. Not measurable in Statcast.
- Leverage and adrenaline (postseason, save situations).
- Hitter quality (ADJUSTED): fresh-starter PAs skew to lineup spots 1-4 (median adj xwOBA .330 vs relief .320).
  Adjustment: batter same-season xwOBA regressed with K=100 PA toward league average,
  split into two tiers at the league PA-weighted median; comparisons made within tier.

## 3. Metric definition
Two strikes = any count with 2 strikes (0-2, 1-2, 2-2, 3-2).

(a) Two-strike putaway fails
- Primary: Putaway% = strikeouts / two-strike pitches (Savant definition)
- Secondary: two-strike whiff% = swinging strikes / two-strike swings (stuff check)

(b) Expands for chase
- Out of zone = Savant `zone` 11-14
- Expansion gap = out-of-zone% in 0-2/1-2/2-2 minus out-of-zone% in <2-strike counts (within group); 3-2 excluded
(c) Hitters don't bite — two-strike out-of-zone pitches (zone 11-14) in 0-2/1-2/2-2, within hitter tier
- Bands: Savant attack zones by % of center-to-edge distance (heart <67, shadow 67-133, chase 133-200, waste >200),
  computed from plate_x/plate_z, sz_top/sz_bot
- (c-i) Waste share = waste-band pitches / all two-strike out-of-zone pitches   [command]
- (c-ii) Chase rate = swings / shadow+chase-band pitches                        [stuff/deception]
(d) Walk — walks = unintentional BB only (IBB excluded; HBP counts as PA, not walk)
- Primary: two-strike walk rate = walks / PAs reaching two strikes
- Reported alongside: overall BB% (walks / all PAs) and share of walks that passed through two strikes
Swing / whiff definitions
- Whiff = swinging_strike, swinging_strike_blocked, missed_bunt
- Swing = whiffs + foul, foul_tip, foul_bunt, bunt_foul_tip, hit_into_play (foul tips count as contact)

(e) Walks drive good vs. bad starts — unit = start (31 starts: 8 in 2025, 23 in 2026)
- Outcome: official runs charged (R) per start, from game logs
- Good start = 0-2 R; bad start = 3+ R
- Explanatory metrics per start: walk rate (unintentional BB / BF) vs. xwOBA on contact

## 4. Data filters
- Spring training excluded.
- Sasaki: all 2025-26 regular season + postseason. Start = appearance beginning in the 1st inning; else relief.
- 2026 postseason relief held out of the ceiling (reserved for grading the projection).
- Yamamoto benchmark: 2024-26 regular season + postseason starts only (fresh / rest split, same rules).
- Dropped: intentional-walk PAs, pitchouts, pitches missing location.
- No pitch-type grouping (no H1 metric is split by pitch type).
- No minimum-sample exclusions; n reported everywhere, cells < 30 flagged "low n".

## 5. Statistical method
- Metrics computed within hitter tier, then tier-standardized (50/50 average of tiers).
- 95% CIs via cluster bootstrap by game, 10,000 reps; relief and start games resampled separately;
  fresh and rest-of-starts share resampled start games.
- Contrasts: all starts vs. relief (primary); relief -> fresh starter (role); fresh -> rest of starts (fatigue).
- Link (e): bad-minus-good difference in mean BB% and mean xwOBAcon with bootstrap CIs over starts;
  standardized differences to compare them; secondary logistic regression bad ~ z(BB%) + z(xwOBAcon).
- No claims rest on p-values.

## 6. Pre-registered threshold (starts vs. relief, tier-standardized)
Verdict per link: Supported = 95% CI of difference excludes 0 in predicted direction AND |point| >= meaningful diff;
Contradicted = CI excludes 0 in the opposite direction; otherwise Inconclusive.
- (a) putaway% lower in starts by >= 5 pts. Stuff check: 2K whiff% "not shown to decline" if |diff| < 5 pts;
  "declined" if starts lower by >= 5 with CI excluding 0.
- (b) expansion gap > 0 in starts (descriptive; no between-group direction predicted).
- (c-i) waste share higher in starts by >= 10 pts.
- (c-ii) chase rate lower in starts by >= 5 pts with CI excluding 0 -> points to stuff/deception (H4), not command.
- (d) two-strike walk rate higher in starts by >= 4 pts.
- (e) bad-minus-good BB% >= 3 pts with CI excluding 0, AND BB% standardized diff > xwOBAcon standardized diff.

## 7. Expected visualization
1. Headline "chain ladder": one panel per link; dot + 95% CI for Sasaki relief / fresh starter / rest of starts;
   Yamamoto fresh / rest in gray.
2. Link (e) scatter: per-start BB% vs. xwOBAcon, colored good / bad.
3. Supporting: two-strike out-of-zone pitch locations with attack-band outlines, relief vs. starts.

## 8. What would change my conclusion
- (e): contact quality separates bad starts more than walks, or the BB% gap isn't meaningful -> chain fails.
- (a): 2K whiff% meaningfully lower in starts -> stuff, not command.
- (c): waste share similar but chase rate lower in starts -> hitters reading competitive pitches (H4).
- Links hold in rest-of-starts but not fresh-starter -> fatigue (H5) rather than role.
