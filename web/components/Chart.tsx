"use client";

/**
 * One client component for every figure on the site. Server pages pass a
 * plain-data spec (functions can't cross the server/client boundary); this
 * turns it into Plotly traces against the live theme.
 */
import { useCallback } from "react";
import Plot from "@/components/Plot";
import { baseLayout, COMPACT_WIDTH, type ChartTheme, type ColorKey } from "@/lib/charts";

type Num = number | null;

export type DotRow = { label: string; est: Num; lo: Num; hi: Num; color: ColorKey; hover?: string };
export type LinePoint = { x: string | number; est: Num; lo?: Num; hi?: Num };
export type LineSeries = { name: string; color: ColorKey; dash?: boolean; points: LinePoint[] };
export type ScatterPoint = { x: Num; y: Num; text?: string };
export type ScatterSeries = { name: string; color: ColorKey; symbol?: string; size?: number; points: ScatterPoint[]; labels?: boolean };

export type ChartSpec =
  | { kind: "dotci"; rows: DotRow[]; xTitle: string; band?: [number, number]; bandLabel?: string; zero?: boolean; digits?: number }
  | { kind: "lines"; series: LineSeries[]; xTitle?: string; yTitle: string; categorical?: boolean; digits?: number }
  | { kind: "scatter"; series: ScatterSeries[]; xTitle: string; yTitle: string; fit?: { x0: number; x1: number; slope: number; intercept: number; color: ColorKey }; yBand?: [number, number]; xBand?: [number, number]; zeroX?: boolean; zeroY?: boolean; digits?: number }
  | { kind: "hist"; bins: { x0: number; x1: number; count: number }[]; markers: { x: number; label: string; color: ColorKey }[]; band?: [number, number]; xTitle: string; yTitle: string };

const color = (t: ChartTheme, k: ColorKey) => (k === "ink" ? t.ink : t[k]);

function build(spec: ChartSpec, t: ChartTheme, width: number) {
  const base = baseLayout(t, width);
  const compact = width < COMPACT_WIDTH;

  if (spec.kind === "dotci") {
    const rows = [...spec.rows].reverse(); // first row at the top
    const d = spec.digits ?? 1;
    const data = [
      {
        type: "scatter",
        mode: "markers",
        x: rows.map((r) => r.est),
        y: rows.map((r) => r.label),
        error_x: {
          type: "data",
          symmetric: false,
          array: rows.map((r) => (r.hi ?? r.est ?? 0) - (r.est ?? 0)),
          arrayminus: rows.map((r) => (r.est ?? 0) - (r.lo ?? r.est ?? 0)),
          color: t.inkMuted,
          thickness: 1.5,
          width: 4,
        },
        marker: { size: 11, color: rows.map((r) => color(t, r.color)), line: { width: 1, color: t.surface } },
        text: rows.map((r) => r.hover ?? `${r.label}: ${r.est?.toFixed(d)} [${r.lo?.toFixed(d)}, ${r.hi?.toFixed(d)}]`),
        hovertemplate: "%{text}<extra></extra>",
      },
    ];
    const shapes: Record<string, unknown>[] = [];
    if (spec.band)
      shapes.push({ type: "rect", xref: "x", yref: "paper", x0: spec.band[0], x1: spec.band[1], y0: 0, y1: 1, fillcolor: t.band, line: { width: 0 }, layer: "below" });
    if (spec.zero)
      shapes.push({ type: "line", xref: "x", yref: "paper", x0: 0, x1: 0, y0: 0, y1: 1, line: { color: t.axis, width: 1 } });
    return {
      data,
      layout: {
        ...base,
        margin: { l: compact ? 120 : 170, r: 16, t: spec.bandLabel ? 26 : 8, b: 48 },
        xaxis: { ...base.xaxis, title: { text: spec.xTitle, font: { size: 12 } } },
        yaxis: { ...base.yaxis, gridcolor: "rgba(0,0,0,0)" },
        shapes,
        annotations: spec.band && spec.bandLabel
          ? [{ x: (spec.band[0] + spec.band[1]) / 2, y: 1, xref: "x", yref: "paper", yanchor: "bottom", text: spec.bandLabel, showarrow: false, font: { size: 11, color: t.inkMuted } }]
          : [],
      },
    };
  }

  if (spec.kind === "lines") {
    const n = spec.series.length;
    const data = spec.series.map((s, i) => {
      const off = spec.categorical ? 0 : (i - (n - 1) / 2) * 0.06;
      return {
        type: "scatter",
        mode: "lines+markers",
        name: s.name,
        x: s.points.map((p) => (typeof p.x === "number" ? p.x + off : p.x)),
        y: s.points.map((p) => p.est),
        line: { color: color(t, s.color), width: 2.5, dash: s.dash ? "dot" : "solid" },
        marker: { size: 9, color: color(t, s.color) },
        error_y: s.points.some((p) => p.lo !== undefined)
          ? {
              type: "data",
              symmetric: false,
              array: s.points.map((p) => (p.hi ?? p.est ?? 0) - (p.est ?? 0)),
              arrayminus: s.points.map((p) => (p.est ?? 0) - (p.lo ?? p.est ?? 0)),
              color: color(t, s.color),
              thickness: 1.2,
              width: 4,
            }
          : undefined,
        hovertemplate: `${s.name}: %{y:.${spec.digits ?? 3}f}<extra></extra>`,
      };
    });
    return {
      data,
      layout: {
        ...base,
        margin: { l: 56, r: 16, t: 8, b: 52 },
        xaxis: { ...base.xaxis, title: { text: spec.xTitle ?? "", font: { size: 12 } }, type: spec.categorical ? "category" : "linear", dtick: spec.categorical ? undefined : 1 },
        yaxis: { ...base.yaxis, title: { text: spec.yTitle, font: { size: 12 } } },
      },
    };
  }

  if (spec.kind === "scatter") {
    const data: Record<string, unknown>[] = spec.series.map((s) => ({
      type: "scatter",
      mode: s.labels ? "markers+text" : "markers",
      name: s.name,
      x: s.points.map((p) => p.x),
      y: s.points.map((p) => p.y),
      text: s.points.map((p) => p.text ?? ""),
      textposition: "top center",
      textfont: { size: 10.5, color: t.inkMuted },
      marker: { size: s.size ?? 9, symbol: s.symbol ?? "circle", color: color(t, s.color), opacity: 0.9, line: { width: 1, color: t.surface } },
      hovertemplate: `%{text}<br>${spec.xTitle}: %{x:.${spec.digits ?? 1}f}<br>${spec.yTitle}: %{y:.3f}<extra>${s.name}</extra>`,
    }));
    if (spec.fit) {
      const f = spec.fit;
      data.push({
        type: "scatter",
        mode: "lines",
        x: [f.x0, f.x1],
        y: [f.intercept + f.slope * f.x0, f.intercept + f.slope * f.x1],
        line: { color: color(t, f.color), width: 1.5, dash: "dash" },
        hoverinfo: "skip",
      });
    }
    const shapes: Record<string, unknown>[] = [];
    if (spec.yBand) shapes.push({ type: "rect", xref: "paper", yref: "y", x0: 0, x1: 1, y0: spec.yBand[0], y1: spec.yBand[1], fillcolor: t.band, line: { width: 0 }, layer: "below" });
    if (spec.xBand) shapes.push({ type: "rect", xref: "x", yref: "paper", x0: spec.xBand[0], x1: spec.xBand[1], y0: 0, y1: 1, fillcolor: t.band, line: { width: 0 }, layer: "below" });
    return {
      data,
      layout: {
        ...base,
        margin: { l: 60, r: 16, t: 8, b: 52 },
        xaxis: { ...base.xaxis, title: { text: spec.xTitle, font: { size: 12 } }, zeroline: !!spec.zeroX },
        yaxis: { ...base.yaxis, title: { text: spec.yTitle, font: { size: 12 } }, zeroline: !!spec.zeroY },
        shapes,
      },
    };
  }

  // hist
  const data: Record<string, unknown>[] = [
    {
      type: "bar",
      x: spec.bins.map((b) => (b.x0 + b.x1) / 2),
      y: spec.bins.map((b) => b.count),
      width: spec.bins.map((b) => (b.x1 - b.x0) * 0.92),
      marker: { color: t.neutral },
      hovertemplate: "%{y} starters<extra></extra>",
    },
  ];
  const ymax = Math.max(...spec.bins.map((b) => b.count));
  const shapes: Record<string, unknown>[] = spec.markers.map((m) => ({
    type: "line", xref: "x", yref: "y", x0: m.x, x1: m.x, y0: 0, y1: ymax * 1.08, line: { color: color(t, m.color), width: 3 },
  }));
  if (spec.band) shapes.unshift({ type: "rect", xref: "x", yref: "paper", x0: spec.band[0], x1: spec.band[1], y0: 0, y1: 1, fillcolor: t.band, line: { width: 0 }, layer: "below" });
  return {
    data,
    layout: {
      ...base,
      bargap: 0,
      margin: { l: 52, r: 16, t: 28, b: 52 },
      xaxis: { ...base.xaxis, title: { text: spec.xTitle, font: { size: 12 } }, zeroline: true },
      yaxis: { ...base.yaxis, title: { text: spec.yTitle, font: { size: 12 } } },
      shapes,
      annotations: spec.markers.map((m, i) => ({
        x: m.x, y: ymax * (1.08 + i * 0.0), xref: "x", yref: "y", text: m.label, showarrow: false,
        xanchor: i % 2 === 0 ? "right" : "left", yanchor: "bottom", font: { size: 12, color: color(t, m.color) },
      })),
    },
  };
}

export default function Chart({ spec, height = 340, ariaLabel }: { spec: ChartSpec; height?: number; ariaLabel: string }) {
  const buildFn = useCallback((t: ChartTheme, w: number) => build(spec, t, w), [spec]);
  return <Plot build={buildFn} height={height} ariaLabel={ariaLabel} />;
}
