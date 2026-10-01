# 2027 Projection — Roki Sasaki

**Written:** 2026-10-01. **Status:** LOCKED (committed 2026-10-01).
Graded by `scripts/grade_2027.py`. Dominant hypothesis behind it: **H3 — fastball velocity** (see `decisions.md`).

## Projection (owner's words)

> For 2027 I predict that Sasaki will make his full transition into a starting pitcher for the Dodgers rotation,
> and in terms of his numbers I believe that he will start 2027 with the same numbers that he had post All-Star
> break, in which he really looked like the prospect that teams were excited to go after.

## Baseline: 2026 post-All-Star-break starts (Jul 17 – Aug 26, 2026)

| GS | IP | ERA | RA9 | WHIP | K% | BB% | xwOBA | FF velo | IP/GS |
|---|---|---|---|---|---|---|---|---|---|
| 7 | 38.1 | 3.05 | 3.29 | 1.28 | 23.3 | 9.4 | .301 | 98.5 | 5.5 |

## Operationalized

**Part 1 — Role: full transition into the rotation**
- Hit if, through June 30, 2027, he has ≥ 10 regular-season starts AND ≥ 80% of his appearances are starts.
- If he misses > 30 days to the IL in that window, the result is recorded as "miss (injury)", kept separate from a role miss.

**Part 2 — Numbers: starts 2027 like his post-break 2026**
- Window: his first 10 regular-season starts of 2027.
- Hit if RA9 ≤ 3.75 (baseline 3.29 plus a tolerance of ~0.5 for a ~55 IP sample).
- Reported alongside, not graded: ERA, WHIP, K%, BB%, xwOBA (baseline .301), FF velocity (baseline 98.5), IP per start.
- Fewer than 6 starts in the window → "insufficient sample".

**Part 3 — H3 consequence (proposed by Claude, accepted by owner)**
The doc asks that the projection follow from the dominant hypothesis. If velocity is the driver, then within
his first 10 starts, the starts with FF average ≥ 98.0 mph should have a lower pooled xwOBA than the starts
below 98.0 mph. Graded only if each group has ≥ 3 starts.
