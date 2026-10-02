import type { Metadata } from "next";
import Chart, { type DotRow } from "@/components/Chart";
import { Callout, DataTable, Figure, PageHeader, Stat, StatRow } from "@/components/ui";
import Verdict from "@/components/Verdict";
import { takeaways } from "@/content/takeaways";
import { fmt, fmtRate, fmtSigned } from "@/lib/charts";
import { h1, num, str } from "@/lib/data";

export const metadata: Metadata = { title: "Command — the walk chain" };

const PANELS = [
  { metric: "(a) Putaway%", title: "(a) Putaway%", sub: "Strikeouts per two-strike pitch" },
  { metric: "(a) 2K whiff% [stuff]", title: "(a) Two-strike whiff%", sub: "Stuff check: misses per two-strike swing" },
  { metric: "(b) Expansion gap (pts)", title: "(b) Expansion gap", sub: "Out-of-zone% with two strikes, minus earlier counts" },
  { metric: "(c-i) Waste share", title: "(c-i) Waste share", sub: "Two-strike misses landing nowhere near the zone" },
  { metric: "(c-ii) Chase rate", title: "(c-ii) Chase rate", sub: "Swings on competitive out-of-zone pitches" },
  { metric: "(d) 2K walk rate", title: "(d) Two-strike walk rate", sub: "Walks per PA that reached two strikes" },
];
const GROUPS: { pitcher: string; group: string; label: string; color: DotRow["color"] }[] = [
  { pitcher: "sasaki", group: "Relief", label: "Sasaki · relief", color: "relief" },
  { pitcher: "sasaki", group: "Fresh starter", label: "Sasaki · first 15 pitches", color: "sasaki" },
  { pitcher: "sasaki", group: "Rest of starts", label: "Sasaki · rest of starts", color: "sasaki" },
  { pitcher: "yamamoto", group: "Fresh starter", label: "Yamamoto · first 15", color: "yamamoto" },
  { pitcher: "yamamoto", group: "Rest of starts", label: "Yamamoto · rest", color: "yamamoto" },
];

export default function CommandPage() {
  const primary = h1.contrasts.filter((c) => c.contrast === "All starts − Relief" && c.verdict);
  const bb = h1.link_e.find((r) => r.metric === "bb_pct")!;
  const xw = h1.link_e.find((r) => r.metric === "xwobacon")!;
  const sasStarts = h1.starts.filter((s) => s.pitcher_name === "sasaki");

  return (
    <>
      <PageHeader
        kicker="Section 2 · H1 · pre-registered"
        title="The walk chain"
        dek="The first hypothesis: Sasaki's stuff is fine, his command isn't, and walks are what turn a quality start into a three-run start."
      />

      <p>
        The hypothesis was written as a chain, so each link could fail on its own: <strong>(a)</strong> he can&rsquo;t
        finish hitters with two strikes, <strong>(b)</strong> so he expands out of the zone, <strong>(c)</strong> hitters
        don&rsquo;t bite, <strong>(d)</strong> the at-bat ends in a walk, and <strong>(e)</strong> those walks are what
        separate his 0–2 run starts from his 3+ run starts.
      </p>
      <p>
        The ceiling is <strong>relief Sasaki</strong>, the best MLB version of him. To separate fatigue from role, starts
        are split into the first 15 pitches (a &ldquo;fresh starter&rdquo;) and the rest. Every rate is computed within
        two tiers of opposing-hitter quality and averaged, because the first 15 pitches of a start always go to the top
        of the order.
      </p>

      <StatRow>
        <Stat label="Relief ceiling" value="239" unit="pitches" note="14 appearances, 61 batters faced" />
        <Stat label="Starts" value="31" note="8 in 2025, 23 in 2026" />
        <Stat label="Links supported" value="1 of 5" note="(b): he does expand with two strikes" />
        <Stat label="Link (e)" value="Not supported" accent note="Bad starts were separated by contact, not walks" />
      </StatRow>

      <h2>The chain, link by link</h2>
      <div className="chart-grid">
        {PANELS.map((p, i) => (
          <Figure key={p.metric} number={i + 1} title={p.title} subtitle={p.sub}>
            <Chart
              height={260}
              ariaLabel={`${p.title} by group`}
              spec={{
                kind: "dotci",
                xTitle: p.metric.includes("gap") ? "points" : "%",
                rows: GROUPS.map((g) => {
                  const r = h1.groups.find((x) => x.pitcher === g.pitcher && x.group === g.group && x.metric === p.metric)!;
                  return { label: g.label, est: num(r.est), lo: num(r.ci_lo), hi: num(r.ci_hi), color: g.color };
                }),
              }}
            />
          </Figure>
        ))}
      </div>
      <p className="figure-sub">
        Dots are tier-standardized rates; bars are 95% cluster-bootstrap intervals. Relief cells are small (often under 30
        per hitter tier), which is why their intervals are wide.
      </p>

      <h2>Pre-registered verdicts</h2>
      <DataTable
        columns={[
          { key: "metric", header: "Link" },
          { key: "diff", header: "Starts − relief", numeric: true },
          { key: "ci", header: "95% CI", numeric: true },
          { key: "verdict", header: "Verdict" },
        ]}
        rows={primary.map((c) => ({
          metric: str(c.metric), diff: fmtSigned(num(c.diff), 1),
          ci: `[${fmt(num(c.ci_lo), 1)}, ${fmt(num(c.ci_hi), 1)}]`, verdict: <Verdict text={str(c.verdict)} />,
        }))}
        caption="Supported needs the interval to exclude zero in the predicted direction and the effect to clear a pre-set size (e.g. 5 points for putaway%)."
      />

      <h2>Link (e): what actually separated bad starts</h2>
      <Figure
        number={7}
        title="Walks vs. contact, start by start"
        subtitle="Each dot is one Sasaki start"
        legend={[{ label: "0–2 runs", color: "var(--c-sasaki)" }, { label: "3+ runs", color: "var(--c-yamamoto)" }]}
        caption="If walks drove the bad starts, red dots would sit to the right. They sit higher instead: more damage on contact."
      >
        <Chart
          ariaLabel="Per-start walk rate against xwOBA on contact, good vs bad starts"
          spec={{
            kind: "scatter",
            xTitle: "Unintentional BB% in the start",
            yTitle: "xwOBA on contact",
            series: [
              { name: "0–2 runs", color: "sasaki", points: sasStarts.filter((s) => !s.bad).map((s) => ({ x: num(s.bb_pct), y: num(s.xwobacon), text: str(s.date) })) },
              { name: "3+ runs", color: "yamamoto", points: sasStarts.filter((s) => s.bad).map((s) => ({ x: num(s.bb_pct), y: num(s.xwobacon), text: str(s.date) })) },
            ],
          }}
        />
      </Figure>
      <DataTable
        columns={[
          { key: "m", header: "Bad − good starts" },
          { key: "d", header: "Difference", numeric: true },
          { key: "ci", header: "95% CI", numeric: true },
          { key: "s", header: "Standardized", numeric: true },
        ]}
        rows={[
          { m: "Walk rate (BB%)", d: fmtSigned(num(bb.diff), 1), ci: `[${fmt(num(bb.diff_lo), 1)}, ${fmt(num(bb.diff_hi), 1)}]`, s: fmtSigned(num(bb.std_diff), 2) },
          { m: "xwOBA on contact", d: fmtRate(num(xw.diff), 3, true), ci: `[${fmtRate(num(xw.diff_lo))}, ${fmtRate(num(xw.diff_hi))}]`, s: fmtSigned(num(xw.std_diff), 2) },
        ]}
      />
      <h3>More contact, harder contact, a slower fastball (exploratory)</h3>
      <DataTable
        columns={[
          { key: "m", header: "Bad vs. good starts" },
          { key: "g", header: "0–2 run starts", numeric: true },
          { key: "b", header: "3+ run starts", numeric: true },
          { key: "d", header: "Difference", numeric: true },
          { key: "ci", header: "95% CI", numeric: true },
        ]}
        rows={h1.contact_exploratory.map((r) => ({
          m: str(r.metric), g: `${fmt(num(r.good), 1)}${r.unit ? "" : "%"}`, b: `${fmt(num(r.bad), 1)}${r.unit ? "" : "%"}`, d: fmtSigned(num(r.diff), 1),
          ci: `[${fmtSigned(num(r.lo), 1)}, ${fmtSigned(num(r.hi), 1)}]`,
        }))}
        caption="Added after the pre-registered analysis, to check the project owner's reading of link (e). Bootstrap over starts."
      />

      <Callout kind="caveat" label="Robustness">
        His first two MLB starts (Tokyo, March 2025) were short, high-walk and low-scoring. Dropping them shrinks the
        walk gap to almost nothing but changes no verdict. Neither do two alternative hitter-quality adjustments.
      </Callout>

      {takeaways.command ? <div className="owner-take"><span className="callout-label">The project owner&rsquo;s take</span>{takeaways.command}</div> : null}
    </>
  );
}
