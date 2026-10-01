# 2026 Postseason Prediction — Roki Sasaki

**Written:** 2026-10-01, before the Dodgers' first postseason game (NLDS Game 1, Oct 3).
**Status:** LOCKED once committed. Graded by `scripts/grade_postseason.py`.

## Prediction (owner's words)

> For the upcoming postseason I predict that Sasaki will maintain the same performance that he had as a
> closer in the 2025 postseason run. Though Sasaki will likely not function as the team's designated
> closer, he will still likely remain as a high leverage arm out of the pen for the Dodgers.

## Operationalized (how it gets graded)

**Gradeable only if** Sasaki makes ≥ 4 postseason relief appearances and faces ≥ 15 batters.
Otherwise the result is "insufficient sample" — neither a hit nor a miss.

**Part 1 — Role: high-leverage arm, not the designated closer**
- Hit if ≥ 50% of his appearances begin in the 7th inning or later with the Dodgers tied or leading by 1–3 runs.
  (2025 postseason: 7 of 9.)
- The "not the designated closer" half is recorded but not graded (saves alone can't define a closer role).

**Part 2 — Performance: same as the 2025 postseason**
- Hit if runs allowed per 9 innings (RA9, all runs charged) ≤ 2.50.
  (2025 postseason: 0.84 RA9 over 10.2 IP. 2.50 is the tolerance for "same performance" over a ~10 IP sample.)

**Reported alongside, not graded** (2025 postseason baseline in brackets):
K% [14.0], BB% [11.6], xwOBA allowed [.337], four-seam avg velo [98.9], whiff per swing [28.8%],
saves [3], holds [2], plus the H1 chain metrics on the held-out sample.

## 2025 postseason baseline

| G | IP | R | ER | RA9 | H | BB | SV | HLD | BF | K% | BB% | xwOBA | FF velo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 9 | 10.2 | 1 | 1 | 0.84 | 6 | 5 | 3 | 2 | 43 | 14.0 | 11.6 | .337 | 98.9 |
