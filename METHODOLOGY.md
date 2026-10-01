# The Monster's Adjustment
### Decomposing Roki Sasaki's Transition from NPB Phenom to MLB Question Mark

---

## Project Overview

This project investigates one of the most compelling performance puzzles in modern baseball: why has Roki Sasaki, arguably the most hyped Japanese pitching prospect since Shohei Ohtani, struggled to translate his NPB and World Baseball Classic dominance into consistent MLB success — except in a postseason closer role where he was untouchable?

The project is structured as a **controlled case study**. Sasaki is the analytical subject; **Yoshinobu Yamamoto** is used as a matched control. The two pitchers share the same MLB team, the same pitching coach (Mark Prior), the same catchers, the same travel and rest schedule, and the same NPB-to-MLB transition pathway, with Yamamoto roughly one MLB year ahead of Sasaki. Holding all of that constant isolates the pitcher-specific variables (stuff, command, arsenal depth, role) that explain Sasaki's gap between expected and actual MLB performance.

The project decomposes Sasaki's performance across five distinct contexts and benchmarks each finding against Yamamoto's parallel data wherever the comparison is structurally valid.

---

## The Performance Puzzle

| Context | Year | Stats |
|---------|------|-------|
| NPB peak (Chiba Lotte) | 2022 | Perfect game, NPB strikeout records |
| NPB final season | 2024 | 10-5, 2.35 ERA, 129 K in 111 IP across 18 starts |
| WBC | 2023 | Dominant — established as elite international arm |
| MLB starter (rookie) | 2025 | 8 GS, 4.72 ERA, 34.1 IP, shoulder impingement (60-day IL) |
| MLB postseason closer | 2025 | 9 G, 10.2 IP, **0.84 ERA, 1.03 WHIP, .167 BAA, 3 saves** |
| MLB starter (current) | 2026 | 0-2, **6.11 ERA**, 1.87 WHIP through early appearances |

**The central question:** Why did the same pitcher — same arm, same arsenal — produce a 0.84 postseason ERA and a 6.11 starter ERA within six months of each other?

---

## The Control: Yoshinobu Yamamoto

Yamamoto serves as the project's primary control. He is not a second analytical subject — he is the matched comparison that makes Sasaki's results interpretable.

**Why Yamamoto specifically:**
- **Same staff, same system.** Dodgers organization, Mark Prior as pitching coach, same catchers, same analytics infrastructure. If a development decision worked on Yamamoto and not Sasaki, the staff is not the variable.
- **Same NPB-to-MLB pathway.** Both posted from NPB, both arrived as top-of-rotation talent, both faced the same league and ball-conditioning differences.
- **One MLB year ahead.** Yamamoto's 2024 rookie year overlaps almost exactly with Sasaki's 2025 rookie year in terms of career stage. A month-by-month overlay of Year 1 is structurally fair.
- **Different arsenal.** Yamamoto is a deep four-pitch arsenal pitcher with an elite curveball; Sasaki is fastball-splitter heavy. If H2 (two-pitch problem) is real, the *difference* between their times-through-order penalties is direct evidence.

**Why other Japanese pitchers (Senga, Imai, Ohtani) are not analytical subjects:**
With Sasaki's small samples, adding more pitchers as data points produces a comparison group too small to support generalizable claims about "Japanese pitchers in MLB." Senga, Imai, and Ohtani appear in the writeup as **narrative anchors** to contextualize Sasaki's case — not as analytical subjects whose data is folded into the tests.

**Known asymmetries between Sasaki and Yamamoto** (must be acknowledged in every comparison):
- Sasaki had a 2025 shoulder impingement; Yamamoto's Year 1 was comparatively healthy.
- Sasaki's two-pitch arsenal vs. Yamamoto's four-pitch arsenal is itself one of the hypotheses being tested, so the comparison illuminates rather than confounds H2.

---

## Research Hypotheses (Ranked by Priority)

### H1: The Command Hypothesis
**Claim:** Sasaki's raw stuff is largely intact from his NPB peak. The actual deterioration is in command — zone%, edge%, and walk rate. FanGraphs evaluator Eric Longenhagen has publicly stated this is the real issue.

**Why this matters first:** If true, it explains both the starter struggles (can't survive 5+ innings if you can't locate) and the closer success (1-2 innings of max-effort stuff lets him overpower command issues).

**Test:** Compare zone%, edge%, first-pitch strike%, and walk rate across NPB 2024, WBC 2023, MLB starter 2025, MLB postseason 2025, MLB starter 2026. Benchmark each MLB-context metric against Yamamoto's parallel Year 1 distribution to establish what "normal Dodgers-pipeline command development" looks like.

**Pre-registered threshold:** Decide before pulling data what magnitude of zone% / walk-rate gap counts as evidence vs. noise. A 1–2 percentage-point shift over ~8 starts is within the sampling envelope and does *not* confirm H1.

---

### H2: The Two-Pitch Problem
**Claim:** Sasaki's fastball-splitter arsenal is sufficient for 1-2 innings of relief work where hitters can't recalibrate, but inadequate for starting where lineups see him 3+ times. The 2026 addition of an 88 mph slider is a direct response to this problem.

**Why this matters:** This is testable through times-through-order penalty (TTOP) analysis and pitch mix data. If Sasaki's wOBA against jumps significantly the second and third time through the order, this hypothesis gains support.

**Test:** Compute wOBA, whiff%, and barrel% by TTO bucket (1st PA, 2nd PA, 3rd PA) for his 2025 starter stretch, pooled with 2026 starts to maximize sample. Compare to (a) Yamamoto's TTOP profile over the same career stage, and (b) league-average TTOP for starters. The direct Sasaki–Yamamoto delta is the cleanest test of H2 because arsenal depth is the primary structural difference between them.

---

### H3: The Stuff Decline Hypothesis
**Claim:** His fastball has lost meaningful velocity from NPB peak. The high school 101 mph fastball and NPB peak averaged ~98-99 mph; MLB 2025-2026 sits closer to 96 mph.

**Why this matters:** This is the simplest explanation if true. Less velocity means less margin for command errors and reduced splitter deception (smaller velocity differential).

**Test:** Plot average and max fastball velocity by context. Quantify velocity differential between fastball and splitter across contexts.

---

### H4: The Splitter Shape Hypothesis
**Claim:** His splitter — the pitch that made him famous — moves differently in MLB than it did in NPB. Different ball, different mound, different conditioning could all affect the pitch shape.

**Why this matters:** If the splitter has measurably less drop or velocity differential in MLB, the pitch is structurally weaker even if usage is unchanged.

**Test:** Compare vertical movement, velocity differential, and whiff rate on the splitter across contexts. This requires NPB Statcast-equivalent data (challenging — see Data Sources).

---

### H5: The Workload/Recovery Hypothesis
**Claim:** NPB starters work on a once-per-week schedule. MLB starters work every 5 days. Sasaki's body may not be adapted to the shorter rest cycle, leading to in-season degradation.

**Why this matters:** If true, it suggests structural challenges in transitioning any NPB starter to MLB rotation work, not just a Sasaki-specific problem.

**Test:** Compare his stuff (velocity, spin) and results (ERA, whiff%) across his 2025 starts in chronological order. Look for monotonic decline patterns. Also compare day-to-day rest splits.

---

## Three-Section Analytical Structure

The writeup is organized into three sections, each anchored to a hypothesis cluster. Each section should have its own Jupyter notebook or Python script.

### Section 1: The Stuff Decomposition
**Hypotheses addressed:** H3, H4

**Goal:** Determine whether Sasaki's physical stuff has actually declined or whether the stuff is intact and something else is wrong.

**Required data:**
- MLB Statcast pitch-level data for all 2025 and 2026 appearances
- NPB pitch-level data from 2022-2024 (limited availability — workaround required)
- WBC 2023 pitch-level data (Statcast captured this)

**Metrics to compute and visualize:**
- Average and max fastball velocity by context
- Splitter velocity and velocity differential from fastball
- Vertical break (induced and gravitational) on both pitches
- Horizontal movement on both pitches
- Release point consistency (vertical, horizontal, extension)
- Spin rate on fastball

**Deliverable:** Side-by-side movement profile visualizations across MLB contexts (starter 2025, post-IL relief, postseason 2025, starter 2026), with Yamamoto's Year 1 four-seam and splitter equivalents as a control overlay. NPB data is included where available but framed as qualitative reference, not statistical comparison, given the public-data gap noted in Limitations.

---

### Section 2: The Command Investigation
**Hypotheses addressed:** H1

**Goal:** Quantify whether command — not stuff — is the actual differentiator between dominant Sasaki and struggling Sasaki.

**Required data:**
- MLB Statcast plate location data for 2025 and 2026 appearances
- Pitch-by-pitch outcome data (called strikes, balls, swings, whiffs)

**Metrics to compute:**
- Zone% by pitch type
- Edge% (pitches at the edges of the zone — the "good" location)
- First-pitch strike%
- Walk rate
- Chase rate (swings on pitches outside the zone)
- "Hittable mistake" rate — middle-middle pitches as % of total

**Critical comparison:** MLB starter 2025 stretch vs. MLB postseason 2025 closer stretch. Same pitcher, same arsenal, six weeks apart, dramatically different results. If command metrics shift significantly between these contexts, H1 is supported.

**Named confound — must be addressed, not waved away:** The closer-vs-starter comparison is *not* a clean role-only contrast. Closer outings come with higher effort levels, higher leverage, fresher matchups (often vs. bottom-of-order hitters), and adrenaline. So a command-metric shift between starter and closer outings cannot be attributed to "role" alone — it is jointly confounded with effort, leverage, and hitter quality. The writeup must state this explicitly and, where possible, restrict the closer-context sample to comparable hitter quality.

**Deliverable:** Strike zone heatmaps for fastball and splitter across all four MLB contexts (starter early 2025, post-IL relief late 2025, postseason 2025, starter 2026), with Yamamoto's parallel Year 1 heatmaps as a control panel. Visual + statistical comparison.

---

### Section 3: The Role Question
**Hypotheses addressed:** H2, H5

**Goal:** Determine whether Sasaki's struggles are role-specific (can't start, can close) versus universal (struggles everywhere except for short adrenaline-fueled bursts).

**Required data:**
- All MLB pitch-level data with TTO indicators
- Game logs with rest days between appearances

**Metrics to compute:**
- TTOP analysis: wOBA, whiff%, and velocity by 1st/2nd/3rd PA against
- Performance by inning (1st inning, 2nd inning, etc.)
- Performance by pitch count bucket (pitches 1-25, 26-50, 51-75, 76+)
- Days of rest splits

**Critical comparison:** TTOP for Sasaki vs. (a) Yamamoto's TTOP profile at the same career stage, and (b) league-average TTOP for starters. Yamamoto is the more informative comparison because arsenal depth is the only structural variable that differs meaningfully between them — if Sasaki's TTOP penalty is materially larger than Yamamoto's, H2 gains direct support.

**Sample-size caveat (must be disclosed in writeup):** Pooling Sasaki's 2025 and 2026 starts yields ~150–200 PAs split across three TTO buckets. Confidence intervals will be wide. Report effect sizes and bootstrapped CIs alongside any test statistic; do not treat marginal p-values as confirmation.

**Deliverable:** A "stamina decay" visualization showing velocity, whiff%, and command metrics by pitch number within an outing. Compare Sasaki starter vs. reliever outings on the same chart, with Yamamoto's starter curve as a control overlay.

---

## Tech Stack

### Data Collection
- **Python 3.11+**
- **pybaseball** — primary scraper for Baseball Savant, FanGraphs, Baseball Reference. This is the single most important library for the project.
- **requests / beautifulsoup4** — for NPB data scraping (DELTA Graphs, NPB official site) if needed
- **pandas** — data manipulation

### Analysis
- **pandas + numpy** — primary analytical layer
- **scipy.stats** — significance testing for cross-context comparisons
- **scikit-learn** — only if needed for clustering similar outings

### Visualization
- **matplotlib + seaborn** — static charts
- **plotly** — interactive charts for the final writeup
- **pybaseball's built-in spraychart and strike zone helpers** — for quick visualizations

### Writeup
- **Quarto** OR **Jupyter notebook exported to HTML** — for the final deliverable
- **Markdown** for narrative sections
- Embed all charts as inline visualizations, not external images

---

## Project Directory Structure (Recommended)

```
sasaki-monster-adjustment/
├── README.md
├── data/
│   ├── raw/
│   │   ├── sasaki_statcast_mlb_2025.csv
│   │   ├── sasaki_statcast_mlb_2026.csv
│   │   ├── yamamoto_statcast_mlb_2024.csv
│   │   ├── yamamoto_statcast_mlb_2025.csv
│   │   ├── npb_career_aggregate.csv
│   │   └── wbc_2023.csv
│   └── processed/
│       ├── sasaki_pitch_level.parquet
│       ├── yamamoto_pitch_level.parquet
│       └── context_aggregates.csv
├── notebooks/
│   ├── 01_data_collection.ipynb
│   ├── 02_stuff_decomposition.ipynb
│   ├── 03_command_investigation.ipynb
│   └── 04_role_question.ipynb
├── scripts/
│   ├── pull_statcast.py
│   ├── compute_ttop.py
│   └── generate_heatmaps.py
├── figures/
│   └── (all output charts go here)
└── writeup/
    └── monsters_adjustment.qmd
```

---

## Design vs. Implementation Boundaries

This project exists specifically because the previous project lost design control to AI tooling. The fix is not "review every line of code" — that's slow and impractical. The fix is enforcing a clean boundary between **design decisions (yours)** and **implementation decisions (Claude Code's)**.

### Decisions You Own (Non-Negotiable)

Claude Code does not make these decisions. If Claude Code makes one without explicit instruction from you, that's a failure of the workflow and must be corrected.

- **Hypothesis framing** — what question is being asked and what would constitute evidence for or against it
- **Metric definitions** — how "command", "stuff decline", "two-pitch problem" are operationalized in numbers
- **Statistical methodology** — which test, model, or comparison technique is used and why
- **Filtering and inclusion rules** — what games count, minimum sample sizes, how the shoulder IL period is treated, how NPB-MLB differences are handled
- **Context grouping** — how "NPB peak" vs "NPB final season" vs "MLB starter 2025" are defined
- **Metric selection** — which variables matter for a given question and which are noise
- **Visualization intent** — what each chart is meant to communicate before any code is written
- **Conclusions and narrative** — what the data actually means and how it's framed in the writeup

### Decisions Claude Code Owns

Claude Code is faster than you at these and should be trusted to handle them.

- Syntax for pybaseball calls and dataframe manipulation
- Plotting library specifics (matplotlib, seaborn, plotly configuration)
- File I/O, directory handling, dependency management
- Code refactoring, cleanup, optimization
- Boilerplate and infrastructure code

### Required Design Spec Before Implementation

Before invoking Claude Code on any analytical task, fill out the spec below. Paste the completed spec into your Claude Code prompt. Claude Code is instructed to refuse implementation if the spec is incomplete or ambiguous.

```
DESIGN SPEC

Hypothesis being tested:
[One sentence. What are you trying to prove or disprove?]

Metric definition:
[How is the variable operationalized? E.g., "Command = zone% on fastballs in 0-0 and 1-1 counts"]

Data filters:
[What rows are included or excluded? E.g., "MLB 2025 starts only, pre-IL appearances (April 5 – May 9), minimum 3 IP"]

Statistical method:
[What comparison or test? E.g., "Two-sample t-test of zone% between pre-IL starts and postseason relief appearances"]

Expected visualization:
[Sketch or describe the chart. E.g., "Strike zone heatmap, 4 panels: starter 2025 / closer 2025 / starter 2026 / overlay difference"]

What would change my conclusion:
[What result would falsify the hypothesis? E.g., "If zone% is unchanged across contexts, command is not the differentiator"]
```

### The Standing Instruction Prompt for Claude Code

Paste this into Claude Code as a system-level instruction at the start of any session. Re-paste it if the session drifts.

```
You are working on a baseball analytics research project about Roki Sasaki's
performance transition from NPB to MLB. The project owner is intentionally
maintaining tight design control while delegating implementation to you.

Your behavior rules:

1. CHALLENGE DESIGN DECISIONS. Do not implement silently. Before writing code,
   review the design spec the user provides and push back on anything that
   seems weak. Specifically interrogate:
   - Is the hypothesis actually falsifiable as stated?
   - Is the metric definition vulnerable to confounders the user hasn't addressed?
   - Is the statistical test appropriate for the data structure and sample size?
   - Are the data filters defensible, or are they cherry-picked?
   - Will the proposed visualization actually answer the question, or is it
     decorative?
   - Are there alternative explanations for the expected result that the
     analysis won't distinguish?

2. PROPOSE ALTERNATIVES WHEN YOU PUSH BACK. Don't just identify problems.
   Suggest a better metric, test, or framing and explain why it's better.

3. REQUIRE EXPLICIT RESOLUTION. If you identify a design weakness, do not
   proceed with implementation until the user has either accepted your
   alternative, defended the original choice, or explicitly chosen to proceed
   despite the flaw.

4. NEVER INVENT DESIGN DECISIONS. If the spec is silent on something
   (e.g., how to handle the IL period, what counts as "NPB peak"), STOP and
   ask. Do not pick a default and move on.

5. DO NOT OVER-ENGINEER. The user wants flat scripts and notebooks, not
   frameworks. Do not introduce classes, abstractions, or utility modules
   unless explicitly requested.

6. EXPLAIN STATISTICAL CHOICES. When implementing any test or model, briefly
   explain in plain English what it does, what its assumptions are, and what
   could break it. The user values understanding the method over speed.

7. FLAG SAMPLE SIZE CONCERNS PROACTIVELY. Sasaki has small samples in every
   MLB context. If a proposed analysis is underpowered, say so before running
   it, not after.

8. PRESERVE THE USER'S NARRATIVE OWNERSHIP. Do not draft conclusions,
   write-up paragraphs, or interpretations of results unless explicitly asked.
   Your job is to produce the analysis; the user's job is to decide what it
   means.

The user values rigorous discussion over fast implementation. A 20-minute
conversation about whether a t-test is appropriate is more valuable than 20
minutes of clean code answering the wrong question.
```

### Workflow Rules

These are the operational rules that enforce the boundaries above.

1. **Write the design spec before opening Claude Code.** If you can't complete the spec, you don't understand the question well enough yet — sit with it longer.

2. **One notebook per hypothesis section.** Don't let work sprawl. If a notebook exceeds ~30 cells, split it.

3. **Commit early and often.** Every meaningful step gets a git commit with a real message describing the *decision*, not just the change. Example: not "added zone% calculation" but "chose zone% over edge% as primary command metric because edge% is too noisy at this sample size".

4. **Sketch the visualization on paper first.** Before Claude Code writes plotting code, draw the chart by hand. If you can't draw it, you don't know what you're asking for.

5. **Push back on Claude Code's pushback.** This is mutual. If Claude Code challenges your design and you disagree, defend the choice in writing. Don't capitulate just because the AI raised an objection. The point is dialogue, not deference in either direction.

6. **Maintain a decisions log.** Keep a running `decisions.md` file at the project root documenting every non-trivial design choice and the reasoning. This is the artifact that proves the project is yours.

---

## Honest Limitations

- **NPB data scarcity:** NPB does not publish Statcast-equivalent pitch-level data publicly. Section 1's NPB panel is qualitative reference, not statistical comparison. The primary comparisons happen within MLB contexts (Sasaki starter vs. closer vs. starter-2026) and against Yamamoto's parallel MLB data.

- **Small sample sizes:** Sasaki's 2025 starter sample (8 starts), postseason sample (9 appearances), and 2026 sample (still developing) are all small. Conclusions must report effect sizes and bootstrapped confidence intervals, not just point estimates or p-values.

- **Single-control limitations:** Using Yamamoto as the sole control means n=1 in the comparison group. This is a deliberate trade against the alternative of a small, noisy peer group. Yamamoto strengthens internal validity (same staff, same system) at the cost of external validity (claims do not generalize to "Japanese pitchers in MLB" broadly). The writeup must respect that boundary.

- **Sasaki–Yamamoto asymmetries:** Sasaki's 2025 shoulder impingement, his fastball-splitter arsenal vs. Yamamoto's four-pitch mix, and Yamamoto being one MLB year ahead are real differences. The arsenal asymmetry is *useful* (it is what makes the H2 test possible). The injury and career-stage asymmetries must be disclosed in every comparison.

- **Confounding variables (cross-league):** Mound differences, ball differences (NPB ball vs. MLB ball, including seam-height conditioning), and league conditioning regimens confound any NPB-to-MLB comparison. Using Yamamoto as control absorbs most of these on the MLB side.

- **Closer-vs-starter confound:** Effort level, leverage, and hitter quality differ between roles. Role-related conclusions in Section 2 and Section 3 must explicitly carry this caveat.

- **Recency bias:** 2026 data is limited to early-season appearances at project start. Conclusions about 2026 are preliminary and the final projection (see "What Success Looks Like") is designed to be graded against future 2026 data.

---

## What Success Looks Like

A completed project produces a writeup that does the following:

1. **Identifies the dominant explanatory variable.** Among stuff decline, command issues, two-pitch problem, and workload effects, which one explains the most variance in Sasaki's performance — measured against the Yamamoto control.

2. **Defensibly rules out at least one popular narrative.** The "Sasaki has lost his stuff" or "he's just not built for MLB" takes should be either supported or refuted with evidence.

3. **Produces at least one analytically-driven headline visualization.** A chart that *makes the central argument visible* — not optimized for shareability, optimized for clarity of the claim. If it ends up tweet-worthy, fine, but that is downstream of the argument, not the goal.

4. **Stakes out a falsifiable, hypothesis-driven projection.** This is the climactic deliverable of the project. Whichever hypothesis the analysis identifies as dominant generates a forward-looking prediction for the remainder of Sasaki's 2026 season — for example, "if H1 is correct, Sasaki's ERA should converge toward X as his walk rate regresses toward Y by date Z." The projection is not a separate ZiPS-style model; it is a *consequence* of the analysis, expressed as a specific testable outcome. This becomes the artifact that lets the project be graded against reality after publication.

5. **Connects back to the broader splitter resurgence question.** Sasaki is one of the central figures in the splitter's modern story. The writeup should briefly contextualize what his case reveals about Japanese pitching development and MLB adaptation, with Senga, Imai, and Ohtani referenced as narrative anchors rather than analyzed data points.

---

## Stopping Criteria

Open-ended projects fail by sprawl. This one has defined endpoints.

- **Analysis phase ends** when Sections 1–3 are written, the dominant hypothesis is named, and the projection from item 4 above is committed in writing.
- **Project ships** when the Quarto/notebook writeup is published with that projection locked in. The published writeup is the primary deliverable.
- **Optional grading addendum** at end of 2026 season: a short follow-up post comparing the locked projection to actual results. This is what separates a project from a portfolio piece — most analytics writeups never grade themselves.
- **Out of scope for this project:** A second analytical subject (Imai, Senga, Ohtani as data), an evergreen projections dashboard, an in-season tracking tool, or any work that requires ongoing maintenance after the writeup ships.

---

## First Steps to Take

Once this document is in your hands and you're ready to begin:

1. Set up the project directory structure above
2. Initialize a git repo with a clear README
3. Install pybaseball and pull **both** Sasaki's and Yamamoto's full Statcast data as the first script. The control needs to be wired in from day one, not bolted on later.
4. Run `data.describe()` on both pitchers and look at the raw data yourself before writing any analysis. Get a feel for what's there and where the gaps are.
5. Pick ONE hypothesis (recommend H1 — the Command Hypothesis) and build Section 2 first. It's the most testable with the cleanest data and the strongest evaluator quote backing it. Write the H1 design spec, including pre-registered thresholds, before any analysis code runs.

---

## Source Material Anchors

- Dave Roberts comments on splitter analytics gap (Jeff Passan interview, 2025)
- Eric Longenhagen on Effectively Wild podcast: Sasaki "probably a closer" assessment
- Fabian Ardaya, The Athletic: Sasaki postseason analysis
- Mark Prior (Dodgers pitching coach): "still gonna be meat-and-potatoes with four-seam and split"
- True Blue LA 2025 season review

---

*Project initiated: May 2026*
*Pitcher: Roki Sasaki (#11, LA Dodgers)*
*Data sources: Baseball Savant, FanGraphs, Baseball Reference, NPB official records*
