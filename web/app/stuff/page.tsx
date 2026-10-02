import type { Metadata } from "next";
import Chart, { type DotRow, type ScatterSeries } from "@/components/Chart";
import { Callout, DataTable, Figure, PageHeader, Stat, StatRow } from "@/components/ui";
import Verdict from "@/components/Verdict";
import { takeaways } from "@/content/takeaways";
import { fmt, fmtSigned } from "@/lib/charts";
import { appearances, num, s1, str } from "@/lib/data";

export const metadata: Metadata = { title: "Stuff — velocity and the two splitters" };

const CTX_LABEL: Record<string, string> = {
  "2025 start": "2025 starts", "2025 relief": "2025 relief", "2026 start": "2026 starts", "2026 relief": "2026 relief",
  "2024 start": "2024 starts",
};

export default function StuffPage() {
  const veloRows: DotRow[] = [
    ...["2025 start", "2025 relief", "2026 start", "2026 relief"].map((c) => {
      const r = s1.velo_ctx.find((x) => x.pitcher === "sasaki" && x.context === c)!;
      return { label: `Sasaki · ${CTX_LABEL[c]}`, est: num(r.est), lo: num(r.lo), hi: num(r.hi), color: (c.includes("relief") ? "relief" : "sasaki") as DotRow["color"] };
    }),
    ...["2024 start", "2025 start", "2026 start"].map((c) => {
      const r = s1.velo_ctx.find((x) => x.pitcher === "yamamoto" && x.context === c)!;
      return { label: `Yamamoto · ${CTX_LABEL[c]}`, est: num(r.est), lo: num(r.lo), hi: num(r.hi), color: "yamamoto" as const };
    }),
  ];

  // x = position in the full chronological list of appearances, so starts and relief share one axis.
  const pts = (pick: (a: (typeof appearances)[number]) => number | null, keep: (a: (typeof appearances)[number]) => boolean) =>
    appearances.map((a, i) => (keep(a) && pick(a) !== null ? { x: i + 1, y: pick(a), text: a.date } : null)).filter((p) => p !== null);
  const timeline: ScatterSeries[] = [
    { name: "Four-seam · start", color: "sasaki", points: pts((a) => a.ff_velo, (a) => a.role === "start") },
    { name: "Four-seam · relief", color: "relief", symbol: "diamond", points: pts((a) => a.ff_velo, (a) => a.role === "relief") },
    { name: "Old splitter (FO)", color: "neutral", symbol: "triangle-down", points: pts((a) => a.fo_velo, () => true) },
    { name: "New splitter (FS)", color: "yamamoto", symbol: "square", points: pts((a) => a.fs_velo, () => true) },
  ];

  const mvLabel = (c: string, p: string) => `${c.replace(" start", "").replace(" relief", " RP")} ${p}`;
  const movement: ScatterSeries[] = [
    { name: "Sasaki starts", color: "sasaki", labels: true, size: 12, points: s1.movement.filter((m) => String(m.context).endsWith("start") && num(m.n) >= 50).map((m) => ({ x: -num(m.hb), y: num(m.ivb), text: mvLabel(str(m.context), str(m.pitch_type)) })) },
    { name: "Sasaki relief", color: "relief", labels: true, size: 10, symbol: "diamond", points: s1.movement.filter((m) => String(m.context).endsWith("relief") && num(m.n) >= 50).map((m) => ({ x: -num(m.hb), y: num(m.ivb), text: mvLabel(str(m.context), str(m.pitch_type)) })) },
    { name: "Yamamoto", color: "yamamoto", size: 9, symbol: "circle-open", points: s1.yam_movement.map((m) => ({ x: -num(m.hb), y: num(m.ivb), text: `Yamamoto ${m.season} ${m.pitch_type}` })) },
  ];

  const keyContrasts = s1.contrasts.filter((c) => String(c.contrast).startsWith("Splitter change") || String(c.contrast).startsWith("Gap: 2026") || (String(c.contrast).startsWith("FF:") && c.metric === "velo"));
  const spl = s1.splitters.filter((s) => s.pitcher === "sasaki" && num(s.n) >= 50);

  return (
    <>
      <PageHeader
        kicker="Section 1 · H3 & H4 · pre-registered"
        title="The stuff"
        dek="Did Sasaki lose velocity on the way from Japan, and does his famous splitter move differently in MLB?"
      />

      <StatRow>
        <Stat label="2025 starter four-seam" value="96.0" unit="mph" note="Below the 98–99 NPB reference band" />
        <Stat label="2026 starter four-seam" value="97.8" unit="mph" note="+1.8 mph on 2025 (CI 1.0 to 2.7)" accent />
        <Stat label="Relief four-seam" value="≈99" unit="mph" note="1.4–2.9 mph harder than starting" />
        <Stat label="New splitter" value="+5.4" unit="mph" note="2026 FS vs. 2025 FO, in starts" />
      </StatRow>

      <h2>Velocity depends on the role</h2>
      <Figure
        number={1}
        title="Average four-seam velocity by context"
        subtitle="95% cluster-bootstrap intervals; shaded band = reported NPB average (98–99 mph)"
        legend={[{ label: "Sasaki starts", color: "var(--c-sasaki)" }, { label: "Sasaki relief", color: "var(--c-relief)" }, { label: "Yamamoto starts", color: "var(--c-yamamoto)" }]}
        caption="No tracked NPB or WBC pitch data exists for Sasaki, so the NPB band is a reported reference, not a statistical comparison. 2026 relief is three games."
      >
        <Chart height={320} ariaLabel="Four-seam velocity by context" spec={{ kind: "dotci", rows: veloRows, xTitle: "mph", band: [98, 99], bandLabel: "NPB reference", digits: 1 }} />
      </Figure>

      <Figure
        number={2}
        title="Every appearance, in order"
        subtitle="Average velocity per appearance: four-seam (starts and relief) and both splitters"
        legend={[
          { label: "Four-seam · start", color: "var(--c-sasaki)" }, { label: "Four-seam · relief", color: "var(--c-relief)" },
          { label: "Old splitter (FO)", color: "var(--c-neutral)" }, { label: "New splitter (FS)", color: "var(--c-yamamoto)" },
        ]}
        caption="Appearances 1–19 are 2025 (8 starts, then relief after the shoulder IL); 20 onward are 2026. The new splitter arrives on 2026-04-25."
      >
        <Chart height={360} ariaLabel="Velocity per appearance over time" spec={{ kind: "scatter", series: timeline, xTitle: "Appearance (chronological)", yTitle: "Avg velocity (mph)", yBand: [98, 99] }} />
      </Figure>

      <h2>Two different splitters</h2>
      <p>
        During 2025 Statcast called his offspeed pitch a split-finger. After he introduced a new grip in late April 2026,
        Statcast relabelled the old pitch a <strong>forkball (FO)</strong> and tracks the new one as a <strong>splitter (FS)</strong>.
        They&rsquo;re physically different pitches, so they&rsquo;re analysed separately.
      </p>
      <Figure
        number={3}
        title="Pitch movement"
        subtitle="Average break per pitch type and context; arm side to the right"
        legend={[{ label: "Sasaki starts", color: "var(--c-sasaki)" }, { label: "Sasaki relief", color: "var(--c-relief)" }, { label: "Yamamoto (FF, FS)", color: "var(--c-yamamoto)" }]}
        caption="FF four-seam, FO old splitter, FS new splitter, ST 2025 sweeper, SL 2026 slider. Pitch types with fewer than 50 thrown are omitted."
      >
        <Chart height={420} ariaLabel="Pitch movement chart" spec={{ kind: "scatter", series: movement, xTitle: "Arm-side break (in)", yTitle: "Induced vertical break (in)", zeroX: true, zeroY: true }} />
      </Figure>

      <DataTable
        columns={[
          { key: "p", header: "Splitter" }, { key: "velo", header: "mph", numeric: true }, { key: "spin", header: "rpm", numeric: true },
          { key: "ivb", header: "IVB in", numeric: true }, { key: "hb", header: "Arm-side in", numeric: true },
          { key: "whiff", header: "Whiff/swing %", numeric: true }, { key: "chase", header: "Chase %", numeric: true },
        ]}
        rows={[...spl, ...s1.splitters.filter((s) => s.pitcher === "yamamoto")].map((s) => ({
          p: <strong>{s.pitcher === "yamamoto" ? `Yamamoto ${String(s.context).slice(0, 4)} FS` : `Sasaki ${CTX_LABEL[str(s.context)]} ${s.pitch}`}</strong>,
          velo: fmt(num(s.velo), 1), spin: fmt(num(s.spin), 0), ivb: fmtSigned(num(s.ivb), 1), hb: fmt(-num(s.hb), 1),
          whiff: fmt(num(s.whiff), 1), chase: fmt(num(s.chase), 1),
        }))}
        caption="Whiff and chase are tier-standardized for hitter quality."
      />

      <h2>Pre-registered contrasts</h2>
      <DataTable
        columns={[{ key: "c", header: "Contrast" }, { key: "m", header: "Metric" }, { key: "d", header: "Difference", numeric: true }, { key: "ci", header: "95% CI", numeric: true }, { key: "v", header: "Verdict" }]}
        rows={keyContrasts.map((c) => ({ c: str(c.contrast), m: str(c.metric), d: fmtSigned(num(c.diff), 1), ci: str(c.ci), v: <Verdict text={str(c.verdict)} /> }))}
        caption="Meaningful = interval excludes zero and the change clears a pre-set size (1 mph, 2 in of movement, 1.5 mph of gap, 8 points of whiff or chase). Full table of 38 contrasts in notebook 02."
      />
      <Callout kind="note" label="What didn't change">
        The new splitter is harder, spins more and runs more to the arm side, but its whiff rate per swing is the same as
        the old one&rsquo;s (difference +0.4 points, CI −13.3 to +12.3). Its chase rate is higher (+13.2 points).
      </Callout>

      {takeaways.stuff ? <div className="owner-take"><span className="callout-label">The project owner&rsquo;s take</span>{takeaways.stuff}</div> : null}
    </>
  );
}
