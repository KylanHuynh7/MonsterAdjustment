import type { Metadata } from "next";
import Chart, { type LineSeries, type ScatterSeries } from "@/components/Chart";
import { Callout, DataTable, Figure, PageHeader, Stat, StatRow } from "@/components/ui";
import Verdict from "@/components/Verdict";
import { takeaways } from "@/content/takeaways";
import { num, s3, str } from "@/lib/data";

export const metadata: Metadata = { title: "Role — times through the order and workload" };

const BUCKETS = ["1-25", "26-50", "51-75", "76+"];

function ttoSeries(metric: string): LineSeries[] {
  const mk = (pitcher: string, sample: string, name: string, color: LineSeries["color"], dash = false): LineSeries => ({
    name, color, dash,
    points: [1, 2, 3].map((t) => {
      const r = s3.tto.find((x) => x.pitcher === pitcher && x.sample === sample && x.metric === metric && x.tto === t)!;
      return { x: t, est: num(r.est), lo: num(r.lo), hi: num(r.hi) };
    }),
  });
  return [mk("sasaki", "2025+26", "Sasaki 2025–26", "sasaki"), mk("sasaki", "2026", "Sasaki 2026", "relief", true), mk("yamamoto", "2024-26", "Yamamoto 2024–26", "yamamoto")];
}

function decaySeries(metric: string): LineSeries[] {
  return [
    { group: "sasaki starts", name: "Sasaki starts", color: "sasaki" as const },
    { group: "yamamoto starts", name: "Yamamoto starts", color: "yamamoto" as const },
  ].map((g) => ({
    name: g.name, color: g.color,
    points: BUCKETS.map((b) => {
      const r = s3.decay.find((x) => x.group === g.group && x.metric === metric && x.bucket === b)!;
      return { x: b, est: num(r.est), lo: num(r.lo), hi: num(r.hi) };
    }),
  }));
}

export default function RolePage() {
  const season: ScatterSeries[] = [2025, 2026].map((y) => ({
    name: `${y}`, color: y === 2025 ? "relief" : "sasaki",
    points: s3.season_starts.filter((s) => s.season === y).map((s) => ({ x: num(s.start_no), y: num(s.ff_velo), text: `${s.date}${s.days_off !== null ? ` · ${s.days_off} days off` : ""}` })),
  }));
  const velTrend = s3.trend.filter((t) => t.metric === "ff_velo");

  return (
    <>
      <PageHeader
        kicker="Section 3 · H2 & H5 · pre-registered"
        title="The role question"
        dek="Is Sasaki's arsenal found out the second and third time through a lineup — or is his body not built for an MLB workload?"
      />

      <StatRow>
        <Stat label="3rd-time penalty (xwOBA)" value="−.002" note="Sasaki, 2025–26. Yamamoto: +.011" />
        <Stat label="H2 verdict" value="Not supported" note="Penalty no larger than Yamamoto's" />
        <Stat label="Starts on 4 days off" value="0" note="Six-man rotation: 5+ days every time" />
        <Stat label="2025 velocity trend" value="−2.75" unit="mph" accent note="Across 8 starts before the shoulder IL" />
      </StatRow>

      <h2>H2 · Times through the order</h2>
      <p>
        If a fastball-splitter arsenal works for an inning but not for a lineup&rsquo;s third look, Sasaki should leak
        more than Yamamoto, who throws six pitches, as a start goes on. The pre-registered test: his third-time-through
        xwOBA penalty must exceed Yamamoto&rsquo;s by at least .030.
      </p>
      <ul className="legend grid-legend">
        <li><span className="swatch" style={{ background: "var(--c-sasaki)" }} />Sasaki 2025–26</li>
        <li><span className="swatch" style={{ background: "var(--c-relief)" }} />Sasaki 2026 (dotted)</li>
        <li><span className="swatch" style={{ background: "var(--c-yamamoto)" }} />Yamamoto 2024–26</li>
      </ul>
      <div className="chart-grid">
        {[
          { m: "xwOBA", t: "xwOBA allowed", d: 3 },
          { m: "K%", t: "Strikeout %", d: 1 },
          { m: "BB%", t: "Walk %", d: 1 },
        ].map((p, i) => (
          <Figure key={p.m} number={i + 1} title={p.t} subtitle="1st, 2nd, 3rd time through the order (starts)">
            <Chart height={280} ariaLabel={`${p.t} by time through the order`} spec={{ kind: "lines", series: ttoSeries(p.m), xTitle: "Time through the order", yTitle: p.t, digits: p.d }} />
          </Figure>
        ))}
      </div>

      <h2>H5 · Workload and recovery</h2>
      <p>Three ways a body unready for MLB workload would show up: worse on shorter rest, fading across a season, or fading faster within a game than Yamamoto.</p>

      <ul className="legend grid-legend">
        <li><span className="swatch" style={{ background: "var(--c-sasaki)" }} />Sasaki starts</li>
        <li><span className="swatch" style={{ background: "var(--c-yamamoto)" }} />Yamamoto starts</li>
      </ul>
      <div className="chart-grid">
        {[
          { m: "FF velo", t: "Four-seam velocity", d: 1 },
          { m: "xwOBA", t: "xwOBA allowed", d: 3 },
        ].map((p, i) => (
          <Figure key={p.m} number={i + 4} title={`${p.t} by pitch count`} subtitle="Pitch count at the start of each PA (starts)">
            <Chart height={280} ariaLabel={`${p.t} by pitch count`} spec={{ kind: "lines", categorical: true, series: decaySeries(p.m), xTitle: "Pitches thrown", yTitle: p.t, digits: p.d }} />
          </Figure>
        ))}
      </div>
      <Callout kind="note" label="Within-game fade">
        From the first 25 pitches to 76+, both pitchers lose the same 0.47 mph. Difference −0.01 mph (CI −0.49 to +0.54): not meaningful.
      </Callout>

      <Figure
        number={6}
        title="Four-seam velocity, start by start"
        subtitle="Each dot is one start; hover for date and days off"
        legend={[{ label: "2025", color: "var(--c-relief)" }, { label: "2026", color: "var(--c-sasaki)" }]}
        caption="2025's slide ends in the shoulder-impingement IL stint, so it can't be separated from the injury. 2026 climbs instead."
      >
        <Chart height={320} ariaLabel="Per-start four-seam velocity by start number" spec={{ kind: "scatter", series: season, xTitle: "Start number within season", yTitle: "Avg four-seam velocity (mph)" }} />
      </Figure>

      <DataTable
        columns={[{ key: "p", header: "Season trend" }, { key: "s", header: "Starts", numeric: true }, { key: "sl", header: "mph per start", numeric: true }, { key: "ci", header: "95% CI", numeric: true }, { key: "span", header: "Over the season", numeric: true }, { key: "v", header: "Verdict" }]}
        rows={velTrend.map((t) => ({
          p: <strong>{`${String(t.pitcher).replace(/^./, (c) => c.toUpperCase())} ${t.season}`}</strong>, s: str(t.starts),
          sl: num(t["slope per start"]).toFixed(2), ci: str(t.ci), span: `${num(t["implied change over season"]) > 0 ? "+" : ""}${num(t["implied change over season"]).toFixed(2)} mph`,
          v: <Verdict text={str(t.verdict)} />,
        }))}
        caption="After a Holm correction across Section 3's twelve tests, only Sasaki's 2025 decline survives."
      />

      <h3>Rest: 5 vs. 6+ days off</h3>
      <DataTable
        columns={[{ key: "p", header: "" }, { key: "m", header: "Metric" }, { key: "a", header: "5 days off", numeric: true }, { key: "b", header: "6+ days off", numeric: true }, { key: "d", header: "Difference", numeric: true }, { key: "v", header: "Verdict" }]}
        rows={s3.rest.filter((r) => r.verdict).map((r) => ({
          p: <strong>{String(r.pitcher).replace(/^./, (c) => c.toUpperCase())}</strong>, m: str(r.metric),
          a: str(r["5 days off"]), b: str(r["6+ days off"]), d: str(r["5 − 6+"]), v: <Verdict text={str(r.verdict)} />,
        }))}
        caption="Sasaki never started on the standard 4 days off, so the 'every five days' version of H5 can't be tested for him."
      />

      {takeaways.role ? <div className="owner-take"><span className="callout-label">The project owner&rsquo;s take</span>{takeaways.role}</div> : null}
    </>
  );
}
