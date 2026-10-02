import Link from "next/link";
import Chart, { type ScatterSeries } from "@/components/Chart";
import { Callout, DataTable, Figure, PageHeader, Rule, Stat, StatRow } from "@/components/ui";
import Verdict from "@/components/Verdict";
import { takeaways } from "@/content/takeaways";
import { fmt, ordinal } from "@/lib/charts";
import { appearances, fitLine, league, num, puzzle, str } from "@/lib/data";

export default function HomePage() {
  const ps = puzzle.find((l) => l.label === "2025 postseason")!;
  const full = puzzle.find((l) => l.label === "2026 full season")!;
  const asStarter = puzzle.find((l) => l.label === "2026 as a starter")!;
  const second = puzzle.find((l) => l.label === "2026 second half")!;
  const bench = league.benchmark.find((b) => b.version === "raw")!;

  const starts = appearances.filter((a) => a.role === "start" && a.ff_velo !== null && a.xwoba !== null);
  const series: ScatterSeries[] = [2025, 2026].map((y) => ({
    name: `${y} starts`,
    color: y === 2025 ? "relief" : "sasaki",
    points: starts.filter((a) => a.season === y).map((a) => ({ x: a.ff_velo, y: a.xwoba, text: a.date })),
  }));
  const fit = fitLine(starts.map((a) => a.ff_velo!), starts.map((a) => a.xwoba!));

  const hypotheses = [
    { h: "H1", name: "Command: a walk chain", page: "/command", verdict: "Not supported", note: "Contact quality, not walks, separated his bad starts" },
    { h: "H2", name: "Two-pitch problem (times through the order)", page: "/role", verdict: "Not supported", note: "No larger penalty than Yamamoto's" },
    { h: "H3", name: "Fastball velocity", page: "/velocity", verdict: "Dominant (owner's call)", note: "Per-start velocity tracks xwOBA allowed, r = −0.54" },
    { h: "H4", name: "Splitter shape", page: "/stuff", verdict: "Changed", note: "The 2026 splitter is a different, harder pitch" },
    { h: "H5", name: "Workload and recovery", page: "/role", verdict: "Not meaningful", note: "Rest and within-game fade match Yamamoto" },
  ];

  return (
    <>
      <PageHeader
        kicker="Roki Sasaki · Los Angeles Dodgers · 2025–26"
        title={<>0.84 in October.<br />{fmt(asStarter.era)} in the rotation.</>}
        dek={<>Same arm, same arsenal, six months apart. This project tests five explanations for the gap, against a matched control who shares his team, his coach and his path from Japan.</>}
      />

      <StatRow>
        <Stat label="2025 postseason ERA" value={fmt(ps.era)} note={`${ps.ip_display} IP as the closer, ${ps.saves} saves`} accent />
        <Stat label="2026 ERA" value={fmt(full.era)} note={`${full.ip_display} IP, ${full.gs} starts`} />
        <Stat label="2026 post-break ERA" value={fmt(second.era)} note={`${second.gs} starts after the All-Star break`} />
        <Stat label="Velocity vs. results" value="r = −0.54" note="Per-start four-seam velocity vs. xwOBA allowed, 31 starts" />
      </StatRow>

      <p className="lede">
        Roki Sasaki arrived as the most hyped Japanese pitching prospect since Shohei Ohtani. As a 2025 postseason
        closer he was close to untouchable. As a starter he has been ordinary. The question this project asks is narrow:
        <strong> what changes between those two versions of the same pitcher?</strong>
      </p>
      <p>
        <strong>Yoshinobu Yamamoto</strong> is the control. Same team, same pitching coach, same catchers, same
        NPB-to-MLB path, one MLB year ahead. If something differs between the two of them, the Dodgers&rsquo; staff
        and system aren&rsquo;t the explanation.
      </p>

      <h2>The puzzle, in numbers</h2>
      <DataTable
        columns={[
          { key: "label", header: "Context" },
          { key: "ip", header: "IP", numeric: true },
          { key: "era", header: "ERA", numeric: true },
          { key: "whip", header: "WHIP", numeric: true },
          { key: "k", header: "K%", numeric: true },
          { key: "bb", header: "BB%", numeric: true },
          { key: "note", header: "" },
        ]}
        rows={puzzle.map((l) => ({
          label: <strong>{l.label}</strong>, ip: l.ip_display, era: fmt(l.era), whip: fmt(l.whip),
          k: fmt(l.k_pct, 1), bb: fmt(l.bb_pct, 1), note: l.note,
        }))}
        caption="Official lines from the MLB Stats API. Regular season unless noted."
      />

      <Figure
        number={1}
        title="Harder fastball, better start"
        subtitle="Each dot is one Sasaki start: average four-seam velocity vs. xwOBA allowed"
        legend={[{ label: "2025 starts", color: "var(--c-relief)" }, { label: "2026 starts", color: "var(--c-sasaki)" }]}
        caption={<>Dashed line: least-squares fit across all 31 starts (−.031 xwOBA per mph). Exploratory: designed after the pre-registered sections had run. The relationship holds within 2026&rsquo;s new-splitter starts alone (r = −0.43) and against 200 MLB starters it is <Link href="/velocity">typical rather than extreme</Link>.</>}
      >
        <Chart
          ariaLabel="Scatter of per-start fastball velocity against xwOBA allowed"
          spec={{ kind: "scatter", series, xTitle: "Avg four-seam velocity (mph)", yTitle: "xwOBA allowed", fit: { ...fit, color: "ink" } }}
        />
      </Figure>

      {takeaways.home ? (
        <div className="owner-take">
          <span className="callout-label">The project owner&rsquo;s conclusion</span>
          {takeaways.home}
        </div>
      ) : null}

      <h2>Five hypotheses, tested in order</h2>
      <DataTable
        columns={[
          { key: "h", header: "" },
          { key: "name", header: "Hypothesis" },
          { key: "verdict", header: "Result" },
          { key: "note", header: "Why" },
        ]}
        rows={hypotheses.map((r) => ({
          h: <strong>{r.h}</strong>, name: <Link href={r.page}>{r.name}</Link>, verdict: <Verdict text={r.verdict} />, note: r.note,
        }))}
      />

      <Callout kind="key" label="Against the league">
        Sasaki&rsquo;s velocity dependence is real (permutation p = {str(bench["Sasaki perm p"])}) but sits at the{" "}
        {ordinal(num(bench["Sasaki percentile"]))} percentile of 200 MLB starters: a normal velocity-dependent
        pitcher, not an outlier. Yamamoto sits at the {ordinal(num(bench["Yamamoto percentile"]))}.
      </Callout>

      <Rule />

      <h2>How it was run</h2>
      <ul>
        <li><strong>Pre-registered.</strong> Each section&rsquo;s hypothesis, metrics, filters, thresholds and falsification criteria were written and committed before its analysis ran.</li>
        <li><strong>Uncertainty first.</strong> Samples are small, so every result is an effect size with a 95% cluster-bootstrap interval (resampling games, not pitches). No claim rests on a p-value.</li>
        <li><strong>Hitter-quality adjusted.</strong> Comparisons are made within tiers of opposing-batter quality, so a starter who faces the top of the order isn&rsquo;t penalised for it.</li>
        <li><strong>Predictions locked before outcomes.</strong> Two forecasts are committed with git timestamps that predate the games they predict.</li>
      </ul>

      <div className="card-row">
        <Link href="/command" className="card-link"><p className="card-title">The walk chain</p><p>H1: does a failed putaway snowball into a walk and a bad start?</p></Link>
        <Link href="/stuff" className="card-link"><p className="card-title">The stuff</p><p>Velocity by role, and two different splitters.</p></Link>
        <Link href="/velocity" className="card-link"><p className="card-title">Velocity, start by start</p><p>The headline relationship, and how 200 starters compare.</p></Link>
        <Link href="/predictions" className="card-link"><p className="card-title">The prediction ledger</p><p>Two forecasts, locked in git before the games were played.</p></Link>
      </div>
    </>
  );
}
