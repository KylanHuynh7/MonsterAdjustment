/**
 * Chart theme + figure builders.
 *
 * Plotly can't read CSS custom properties, so `readChartTheme()` resolves the
 * palette off :root at render time and every builder takes the resolved theme.
 * Plot.tsx re-runs this when the color scheme changes, which is what makes dark
 * mode work.
 *
 * Palette: Los Angeles Dodgers. Sasaki = Dodger blue, Yamamoto = Dodgers red,
 * the league / reference marks = Dodgers silver. Relief appearances take a
 * lighter Dodger blue so starter-vs-reliever reads as one family at two
 * intensities. Identity is never carried by color alone: every series is
 * also labelled in text.
 */

export const COMPACT_WIDTH = 520;

export type ChartTheme = {
  sasaki: string;
  relief: string;
  yamamoto: string;
  neutral: string;
  band: string;
  grid: string;
  axis: string;
  ink: string;
  inkMuted: string;
  surface: string;
};

/** Mirrors the light values on :root in globals.css. */
const FALLBACK: ChartTheme = {
  sasaki: "#005a9c",
  relief: "#5fa8dc",
  yamamoto: "#ef3e42",
  neutral: "#a5acaf",
  band: "rgba(165,172,175,0.22)",
  grid: "#e3e8ee",
  axis: "#b8c2cc",
  ink: "#0a2240",
  inkMuted: "#55657a",
  surface: "#ffffff",
};

const VAR_NAMES: Record<keyof ChartTheme, string> = {
  sasaki: "--c-sasaki",
  relief: "--c-relief",
  yamamoto: "--c-yamamoto",
  neutral: "--c-neutral",
  band: "--c-band",
  grid: "--c-grid",
  axis: "--c-axis",
  ink: "--c-ink",
  inkMuted: "--c-ink-muted",
  surface: "--c-surface",
};

export function readChartTheme(): ChartTheme {
  if (typeof window === "undefined") return FALLBACK;
  const styles = getComputedStyle(document.documentElement);
  const out = {} as ChartTheme;
  for (const key of Object.keys(VAR_NAMES) as (keyof ChartTheme)[]) {
    out[key] = styles.getPropertyValue(VAR_NAMES[key]).trim() || FALLBACK[key];
  }
  return out;
}

const FONT_STACK = 'var(--font-sans), system-ui, -apple-system, "Segoe UI", sans-serif';

export function baseLayout(t: ChartTheme, width = 640) {
  const compact = width < COMPACT_WIDTH;
  const tick = compact ? 10.5 : 12;
  return {
    font: { family: FONT_STACK, size: compact ? 11.5 : 12.5, color: t.inkMuted },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    showlegend: false,
    hoverlabel: {
      bgcolor: t.surface,
      bordercolor: t.axis,
      font: { family: FONT_STACK, size: 12.5, color: t.ink },
    },
    xaxis: {
      gridcolor: t.grid,
      linecolor: t.axis,
      zerolinecolor: t.axis,
      tickfont: { size: tick, color: t.inkMuted },
      automargin: false,
    },
    yaxis: {
      gridcolor: t.grid,
      linecolor: t.axis,
      zerolinecolor: t.axis,
      tickfont: { size: tick, color: t.inkMuted },
      automargin: true,
    },
  };
}

/** Color slots a chart spec can name; resolved against the live theme. */
export type ColorKey = "sasaki" | "relief" | "yamamoto" | "neutral" | "ink";

export const fmt = (v: number | null | undefined, digits = 2) =>
  v === null || v === undefined || Number.isNaN(v) ? "—" : v.toFixed(digits);

/** Signed, with a true minus sign; a value that rounds to zero carries no sign. */
export const fmtSigned = (v: number | null | undefined, digits = 2) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  const r = Number(v.toFixed(digits));
  if (r === 0) return (0).toFixed(digits);
  return (r > 0 ? "+" : "−") + Math.abs(r).toFixed(digits);
};

/** 1st, 2nd, 3rd, 22nd ... */
export const ordinal = (v: number) => {
  const n = Math.round(v);
  const s = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${s}`;
};

/** xwOBA style: .301, −.031 */
export const fmtRate = (v: number | null | undefined, digits = 3, signed = false) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  const s = signed ? fmtSigned(v, digits) : v.toFixed(digits);
  return s.replace(/^([+−-]?)0\./, "$1.");
};
