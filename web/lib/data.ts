/**
 * Typed access to the build-time data bundle.
 *
 * `public/data.json` is written by `scripts/export_web.py` from the notebook
 * outputs in `data/processed`. Everything here runs in server components at
 * build time, so pages ship only the numbers they render.
 */
import bundle from "@/public/data.json";

type Num = number | null;
type Row = Record<string, string | number | boolean | null>;

export type Line = {
  label: string; note: string; g: number; gs: number; ip: number; ip_display: string;
  era: number; ra9: number; whip: number; k_pct: number; bb_pct: number; saves: number;
};
export type Appearance = {
  game_pk: number; date: string; season: number; role: "start" | "relief"; game_type: string;
  ff_velo: Num; fo_velo: Num; fs_velo: Num; xwoba: Num; runs: Num; fs_era: boolean;
};
export type LedgerEntry = {
  id: string; title: string; file: string; prediction: string; locked_commit: string;
  locked_at: string; status: string; parts: string[]; grader: string;
};

export const generatedAt = bundle.generated_at as string;
export const commit = bundle.commit as string;
export const dataThrough = bundle.data_through as string;
export const puzzle = bundle.puzzle as Line[];
export const appearances = bundle.appearances as Appearance[];
export const h1 = bundle.h1 as unknown as { groups: Row[]; contrasts: Row[]; link_e: Row[]; starts: Row[] };
export const s1 = bundle.s1 as unknown as { velo_ctx: Row[]; splitters: Row[]; contrasts: Row[]; movement: Row[]; yam_movement: Row[] };
export const s3 = bundle.s3 as unknown as { tto: Row[]; decay: Row[]; rest: Row[]; trend: Row[]; season_starts: Row[] };
export const velocity = bundle.velocity as unknown as { all: Row[]; fs_era: Row[]; terciles: Row[]; model: Row[] };
export const league = bundle.league as unknown as {
  bins: { x0: number; x1: number; count: number }[]; pitchers: Row[]; noise_band: [number, number]; benchmark: Row[];
};
export const rigor = bundle.rigor as unknown as { mc_summary: Row[]; mc: Row[]; robustness: Row[]; zone: Row[] };
export const ledger = bundle.ledger as LedgerEntry[];

export const REPO = "https://github.com/KylanHuynh7/MonsterAdjustment";
export const SASAKI = 808963;
export const YAMAMOTO = 808967;

export const num = (v: unknown): number => (typeof v === "number" ? v : NaN);
export const str = (v: unknown): string => (v === null || v === undefined ? "" : String(v));

/** Parse "−.031 [−.048, −.017]"-style strings the notebooks wrote into [est, lo, hi]. */
export function parseCI(v: unknown): [number, number, number] {
  const m = String(v).match(/(-?[\d.]+)\s*\[\s*(-?[\d.]+),\s*(-?[\d.]+)\]/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [NaN, NaN, NaN];
}

/** Simple least-squares line through (x, y). */
export function fitLine(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  xs.forEach((x, i) => {
    sxy += (x - mx) * (ys[i] - my);
    sxx += (x - mx) ** 2;
  });
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx, x0: Math.min(...xs), x1: Math.max(...xs) };
}
