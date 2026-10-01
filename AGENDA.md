# Agenda

## Where things stand (2026-10-01)

- Analysis phase complete. Sections 1–3 run against pre-registered specs; exploratory velocity checks done.
- Dominant hypothesis named by the owner: **H3, fastball velocity**.
- Two predictions locked and committed: 2026 postseason and 2027 season.

## Next

1. **Website** (replaces the Quarto writeup). Static site in the style of Variance97, with all numbers precomputed
   at build time.
2. **Optional strengthening** (from the 2026-10-01 review), owner to pick:
   - League benchmark: where Sasaki's per-start velocity sensitivity sits among all MLB starters.
   - Prediction ledger page: each prediction, its commit timestamp, and status.
   - Small pitch-level run-value model to quantify what velocity is worth.
   - Robustness page (Tokyo starts excluded, K = 50, tertile hitter tiers).
   - Multiple-comparison correction across contrasts.
   - Validate the attack-zone approximation against Savant's published swing/take numbers.

## Dated checkpoints

| When | What | How |
|---|---|---|
| After the Dodgers' 2026 postseason ends | Grade the postseason prediction | Re-run the pull scripts, then `scripts/grade_postseason.py` |
| ~Mid-May 2027 (10th start) | Grade 2027 Parts 2 and 3 | Add 2027 to the pull scripts' season lists, re-pull, then `scripts/grade_2027.py` |
| July 1, 2027 | Grade 2027 Part 1 (role through June 30) | Same |
| End of 2027 season | Optional grading addendum post | — |
