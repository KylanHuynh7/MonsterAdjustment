import type { Metadata } from "next";
import Chart, { type ScatterSeries } from "@/components/Chart";
import { Callout, DataTable, Figure, PageHeader, Stat, StatRow } from "@/components/ui";
import Verdict from "@/components/Verdict";
import { takeaways } from "@/content/takeaways";
import { fmt, fmtRate, fmtSigned, ordinal } from "@/lib/charts";
import { SASAKI, YAMAMOTO, appearances, fitLine, league, num, str, velocity } from "@/lib/data";

export const metadata: Metadata = { title: "Velocity — start by start, and against the league" };

export default function VelocityPage() {
  const fsEra = appearances.filter((a) => a.fs_era && a.ff_velo !== null && a.xwoba !== null);
  const fit = fitLine(fsEra.map((a) => a.ff_velo!), fsEra.map((a) => a.xwoba!));
  const fsSeries: ScatterSeries[] = [{ name: "FS-era starts", color: "sasaki", size: 11, points: fsEra.map((a) => ({ x: a.ff_velo, y: a.xwoba, text: a.date })) }];

  const raw = league.benchmark.find((b) => b.version === "raw")!;
  const cen = league.benchmark.find((b) => b.version === "centered")!;
  const sas = league.pitchers.find((p) => p.player_id === SASAKI)!;
  const yam = league.pitchers.find((p) => p.player_id === YAMAMOTO)!;
  const top = [...league.pitchers].sort((a, b) => num(a.slope_raw) - num(b.slope_raw)).slice(0, 8);

  const sasAll = velocity.all.filter((r) => r.pitcher === "sasaki" && r.outcome === "xwoba");
  const fsRows = velocity.fs_era.filter((r) => r.outcome === "xwoba");
  const model = velocity.model.filter((m) => (m.term === "release_speed" || m.term === "game_ff_velo") && !String(m.model).includes("standardized"));

  return (
    <>
      <PageHeader
        kicker="H3 · the dominant hypothesis"
        title="Velocity, start by start"
        dek="If the fastball is the story, harder-throwing starts should go better. They do. The harder question is whether that's unusual."
      />

      <StatRow>
        <Stat label="All 31 starts" value="r = −0.54" note="Four-seam velocity vs. xwOBA allowed" accent />
        <Stat label="Per mph" value={fmtRate(-0.031, 3, true)} unit="xwOBA" note="CI −.048 to −.017" />
        <Stat label="New-splitter starts only" value="r = −0.43" note="19 starts; −0.49 with the time trend removed" />
        <Stat label="League percentile" value={ordinal(num(raw["Sasaki percentile"]))} note="Of 200 MLB starters (lower = more velocity-dependent)" />
      </StatRow>

      <Callout kind="caveat" label="Exploratory">
        The start-by-start check was designed after the pre-registered sections had run, to test the owner&rsquo;s
        conclusion. It generates evidence; it doesn&rsquo;t confirm it. The league comparison further down <em>was</em>{" "}
        pre-registered, before any league data was pulled.
      </Callout>

      <h2>Separating velocity from everything else that changed</h2>
      <p>
        Every one of his ten hardest-throwing starts came in 2026, when he also had a new splitter, a new slider and a
        higher arm angle. So the check was repeated on the 2026 new-splitter starts only, holding the splitter fixed,
        and again with the season&rsquo;s time trend removed.
      </p>
      <Figure
        number={1}
        title="Within the new-splitter era alone"
        subtitle="2026 starts from April 25 on: same splitter in every start"
        caption="Dashed line: least-squares fit."
      >
        <Chart ariaLabel="FS-era per-start velocity against xwOBA" spec={{ kind: "scatter", series: fsSeries, xTitle: "Avg four-seam velocity (mph)", yTitle: "xwOBA allowed", fit: { ...fit, color: "ink" } }} />
      </Figure>
      <DataTable
        columns={[{ key: "s", header: "Sample" }, { key: "n", header: "Starts", numeric: true }, { key: "sl", header: "xwOBA per mph", numeric: true }, { key: "ci", header: "95% CI", numeric: true }, { key: "r", header: "r", numeric: true }]}
        rows={[
          ...sasAll.map((r) => ({ s: `All starts · ${r.predictor}`, n: str(r.starts), sl: fmtRate(num(r["slope per mph"]), 3, true), ci: str(r["slope CI"]), r: fmtSigned(num(r.r), 2) })),
          ...fsRows.map((r) => ({ s: `New-splitter starts · ${r.version}`, n: str(r.starts), sl: fmtRate(num(r["slope per mph"]), 3, true), ci: str(r["slope CI"]), r: fmtSigned(num(r.r), 2) })),
        ]}
        caption="Season-centered = velocity relative to that season's average, which strips out the 2025→2026 changes."
      />

      <h3>By velocity third</h3>
      <DataTable
        columns={[{ key: "t", header: "Third" }, { key: "r", header: "Four-seam range", numeric: true }, { key: "n", header: "Starts (2025 / 2026)", numeric: true }, { key: "x", header: "xwOBA", numeric: true }, { key: "ra", header: "Runs / 9", numeric: true }]}
        rows={velocity.terciles.map((t) => ({ t: <strong>{str(t.tercile)}</strong>, r: `${fmt(num(t.lo), 1)}–${fmt(num(t.hi), 1)}`, n: `${t.starts} (${t.n2025} / ${t.n2026})`, x: fmtRate(num(t.xwoba)), ra: fmt(num(t.runs_per_9), 2) }))}
        caption="Low and Mid overlap within their intervals; the clear gap is High vs. the rest. Mid is mostly early 2026, before the new splitter settled in."
      />

      <h2>Against the league (pre-registered)</h2>
      <p>
        The same per-start slope was computed for every four-seam starter with at least 15 starts in 2025–26, from
        Savant&rsquo;s per-game data. The source was first checked against our own pitch-level numbers for all 31 Sasaki
        starts (velocity within 0.03 mph, xwOBA within .001). The pre-set rule: Sasaki is <em>unusually</em> velocity-dependent
        only if his slope is below the league&rsquo;s 10th percentile <em>and</em> his own relationship beats a shuffle test.
      </p>
      <Figure
        number={2}
        title={`Velocity dependence across ${raw.pitchers} MLB starters`}
        subtitle="xwOBA per +1 mph of four-seam velocity, per start (negative = harder fastball, better results)"
        legend={[{ label: "League", color: "var(--c-neutral)" }, { label: `Sasaki (${fmtRate(num(sas.slope_raw), 3, true)})`, color: "var(--c-sasaki)" }, { label: `Yamamoto (${fmtRate(num(yam.slope_raw), 3, true)})`, color: "var(--c-yamamoto)" }]}
        caption="Shaded band: the typical range one pitcher's slope can wander from noise alone (median of each pitcher's shuffle-test 95% range). Most of the spread across starters is noise; the estimated real spread is about half the observed."
      >
        <Chart
          height={340}
          ariaLabel="Histogram of league velocity-dependence slopes with Sasaki and Yamamoto marked"
          spec={{ kind: "hist", bins: league.bins, band: league.noise_band, xTitle: "xwOBA per mph", yTitle: "Starters",
            markers: [{ x: num(sas.slope_raw), label: "Sasaki", color: "sasaki" }, { x: num(yam.slope_raw), label: "Yamamoto", color: "yamamoto" }] }}
        />
      </Figure>
      <DataTable
        columns={[{ key: "k", header: "" }, { key: "raw", header: "Raw", numeric: true }, { key: "cen", header: "Season-centered", numeric: true }]}
        rows={[
          { k: "League median", raw: fmtRate(num(raw["league median"]), 3, true), cen: fmtRate(num(cen["league median"]), 3, true) },
          { k: "League 10th percentile", raw: fmtRate(num(raw["league p10"]), 3, true), cen: fmtRate(num(cen["league p10"]), 3, true) },
          { k: "Sasaki slope", raw: fmtRate(num(raw["Sasaki slope"]), 3, true), cen: fmtRate(num(cen["Sasaki slope"]), 3, true) },
          { k: "Sasaki percentile", raw: `${fmt(num(raw["Sasaki percentile"]), 1)}`, cen: `${fmt(num(cen["Sasaki percentile"]), 1)}` },
          { k: "Sasaki shuffle-test p", raw: fmt(num(raw["Sasaki perm p"]), 3), cen: fmt(num(cen["Sasaki perm p"]), 3) },
          { k: "Yamamoto percentile", raw: `${fmt(num(raw["Yamamoto percentile"]), 1)}`, cen: `${fmt(num(cen["Yamamoto percentile"]), 1)}` },
          { k: "Verdict", raw: <Verdict text={str(raw.verdict)} />, cen: <Verdict text={str(cen.verdict)} /> },
        ]}
      />
      <Callout kind="key" label="What the pre-registration said this would mean">
        &ldquo;If Sasaki sits inside the league&rsquo;s 10th–90th percentile, velocity still describes his results, but
        it isn&rsquo;t unique to him: he&rsquo;s a normal velocity-dependent pitcher, not an unusually velocity-dependent
        one.&rdquo;
      </Callout>
      <DataTable
        columns={[{ key: "n", header: "Most velocity-dependent starters" }, { key: "s", header: "Starts", numeric: true }, { key: "v", header: "Avg FF", numeric: true }, { key: "sl", header: "xwOBA per mph", numeric: true }, { key: "r", header: "r", numeric: true }]}
        rows={top.map((p) => ({ n: str(p.player_name), s: str(p.starts), v: fmt(num(p.ff_velo), 1), sl: fmtRate(num(p.slope_raw), 3, true), r: fmtSigned(num(p.r_raw), 2) }))}
      />

      <h2>What a mph is worth on a single pitch</h2>
      <p>
        A pitch-level regression (exploratory) holds movement, spin, release, location and count fixed and asks what one
        extra mph does to a four-seamer. Per-pitch run value is extremely noisy (R² ≈ 0.03), so only large effects can show.
      </p>
      <DataTable
        columns={[{ key: "m", header: "Model" }, { key: "t", header: "Per +1 mph of" }, { key: "c", header: "Effect", numeric: true }, { key: "ci", header: "95% CI", numeric: true }]}
        rows={model.map((m, i) => ({
          m: i < 3 ? `Four-seam run value · ${m.model}` : i < 5 ? `Four-seam whiff on swings · ${m.model}` : `Sasaki ${m.model}`,
          t: m.term === "game_ff_velo" ? "that day's four-seam" : "the pitch",
          c: fmtSigned(num(m.coef), 2), ci: `[${fmtSigned(num(m.ci_lo), 2)}, ${fmtSigned(num(m.ci_hi), 2)}]`,
        }))}
        caption="Run value in runs saved per 100 pitches; whiff and chase in percentage points. Standard errors clustered by game. Four-seam whiffs rise with velocity (Sasaki +1.8 pts per mph); per-pitch run value and the splitter-on-harder-days effects can't be told apart from zero."
      />

      {takeaways.velocity ? <div className="owner-take"><span className="callout-label">The project owner&rsquo;s take</span>{takeaways.velocity}</div> : null}
    </>
  );
}
