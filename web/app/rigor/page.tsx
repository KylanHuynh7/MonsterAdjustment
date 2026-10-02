import type { Metadata } from "next";
import { Callout, DataTable, PageHeader, Rule } from "@/components/ui";
import Verdict from "@/components/Verdict";
import { fmt } from "@/lib/charts";
import { REPO, num, rigor, str } from "@/lib/data";

export const metadata: Metadata = { title: "Rigor — how far to trust it" };

const SPECS = [
  { name: "H1 · the walk chain", file: "h1_design_spec.md" },
  { name: "Section 1 · stuff (H3, H4)", file: "s1_design_spec.md" },
  { name: "Section 3 · role (H2, H5)", file: "s3_design_spec.md" },
  { name: "League benchmark", file: "s8_design_spec.md" },
];

export default function RigorPage() {
  const variants = ["baseline", "k50", "tertiles", "no_tokyo"];
  const tests = Array.from(new Set(rigor.robustness.filter((r) => r.verdict).map((r) => str(r.test))));
  const zoneBands = ["heart", "shadow", "chase", "waste"];
  const zoneRows = Array.from(new Set(rigor.zone.map((z) => `${z.pitcher} ${z.season}`)));

  return (
    <>
      <PageHeader
        kicker="Methods"
        title="How far to trust it"
        dek="Small samples make it easy to fool yourself. These are the guardrails, and what they found."
      />

      <h2>Decided before the data</h2>
      <p>
        Every analysis section began as a written design spec (hypothesis, metric definitions, filters, method,
        thresholds and what would falsify it), committed before its code ran. Analyses designed after seeing
        results are labelled <strong>exploratory</strong> wherever they appear. Every design choice and its reasoning is
        in the <a href={`${REPO}/blob/main/decisions.md`} target="_blank" rel="noreferrer">decision log</a>.
      </p>
      <ul>
        {SPECS.map((s) => (
          <li key={s.file}><a href={`${REPO}/blob/main/${s.file}`} target="_blank" rel="noreferrer">{s.name}</a></li>
        ))}
      </ul>

      <h2>Multiple comparisons</h2>
      <p>
        Pre-registered verdicts use uncorrected 95% intervals, so with many tests some &ldquo;meaningful&rdquo; results are
        expected by chance. A Holm correction within each section shows which claimed effects survive.
      </p>
      <DataTable
        columns={[{ key: "f", header: "Section" }, { key: "t", header: "Tests", numeric: true }, { key: "c", header: "Claimed effects", numeric: true }, { key: "s", header: "Survive Holm", numeric: true }, { key: "e", header: "False positives expected at .05", numeric: true }]}
        rows={rigor.mc_summary.map((r) => ({ f: <strong>{str(r.family)}</strong>, t: str(r.tests), c: str(r.claimed), s: str(r.surviving), e: fmt(num(r.expected_fp), 1) }))}
        caption="Several surviving Section 1 effects involve 2026 relief, only three games, whose intervals are unreliable regardless."
      />

      <h2>Robustness: the alternatives rejected during design</h2>
      <p>
        H1 was re-run under three choices that were considered and rejected: a lighter hitter-quality adjustment
        (K = 50), three hitter tiers instead of two, and dropping his two Tokyo starts. <strong>No verdict changes.</strong>
      </p>
      <DataTable
        columns={[{ key: "t", header: "Test" }, ...variants.map((v) => ({ key: v, header: v === "no_tokyo" ? "No Tokyo starts" : v === "k50" ? "K = 50" : v === "tertiles" ? "3 tiers" : "Baseline" }))]}
        rows={tests.map((t) => {
          const row: Record<string, React.ReactNode> = { t };
          variants.forEach((v) => {
            const r = rigor.robustness.find((x) => x.test === t && x.variant === v);
            row[v] = r ? <Verdict text={str(r.verdict).replace("Stuff not shown to decline", "No decline").replace("No stuff signal", "No signal")} /> : "—";
          });
          return row;
        })}
        caption="K = 50 matches baseline exactly: it moves only four batters across the tier line, and Sasaki faced none of them."
      />

      <h2>Validating the attack zones</h2>
      <p>
        The heart / shadow / chase / waste bands were computed from pitch location rather than taken from Savant. As a
        check, run value summed by band was compared with Savant&rsquo;s published figures (runs, pitcher&rsquo;s perspective).
      </p>
      <DataTable
        columns={[{ key: "p", header: "Pitcher-season" }, ...zoneBands.map((b) => ({ key: b, header: `${b} (ours − Savant)`, numeric: true }))]}
        rows={zoneRows.map((k) => {
          const row: Record<string, React.ReactNode> = { p: k.replace(/^./, (c) => c.toUpperCase()) };
          zoneBands.forEach((b) => {
            const z = rigor.zone.find((x) => `${x.pitcher} ${x.season}` === k && x.band === b);
            row[b] = z ? fmt(num(z.diff), 2) : "—";
          });
          return row;
        })}
        caption="Chase and waste, the boundary H1's link (c) depends on, agree within 0.25 runs. Heart and shadow differ by up to 0.91, from pitches on that line."
      />

      <Rule />

      <h2>What this can&rsquo;t claim</h2>
      <Callout kind="caveat" label="Limitations">
        <ul>
          <li><strong>No tracked NPB data.</strong> Every comparison to Japan is against a reported velocity band.</li>
          <li><strong>Small samples.</strong> 14 relief appearances and 31 starts. Intervals are wide by necessity.</li>
          <li><strong>One control.</strong> Yamamoto buys a clean comparison (same staff, same system) at the cost of generalizing to &ldquo;Japanese pitchers in MLB&rdquo;.</li>
          <li><strong>Velocity travels with other changes.</strong> His fastest starts are all from 2026, alongside a new splitter, slider and arm angle. The new-splitter-only check holds the splitter fixed but not the rest.</li>
          <li><strong>2025&rsquo;s velocity slide ends in a shoulder IL stint</strong> and can&rsquo;t be separated from the injury.</li>
          <li><strong>Role is a package.</strong> Relief differs from starting in effort, leverage, adrenaline and warm-up routine, not just velocity.</li>
        </ul>
        <p>The full list is in <a href={`${REPO}/blob/main/LIMITATIONS.md`} target="_blank" rel="noreferrer">LIMITATIONS.md</a>.</p>
      </Callout>
    </>
  );
}
