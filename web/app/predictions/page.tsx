import type { Metadata } from "next";
import { Callout, PageHeader } from "@/components/ui";
import Verdict from "@/components/Verdict";
import { REPO, ledger } from "@/lib/data";

export const metadata: Metadata = { title: "Prediction ledger" };

/** How each prediction is graded. Mirrors the operationalized criteria in predictions/*.md. */
const CRITERIA: Record<string, { label: string; rule: string }[]> = {
  "2026-postseason": [
    { label: "Minimum sample", rule: "At least 4 relief appearances and 15 batters faced, otherwise “insufficient sample”." },
    { label: "Role", rule: "At least half his appearances begin in the 7th inning or later with the Dodgers tied or up 1–3." },
    { label: "Performance", rule: "Runs allowed per 9 innings ≤ 2.50 (2025 postseason: 0.84)." },
  ],
  "2027-season": [
    { label: "Role", rule: "Through June 30, 2027: at least 10 starts, and at least 80% of appearances are starts." },
    { label: "Numbers", rule: "First 10 starts: runs allowed per 9 ≤ 3.75 (2026 post-break starts: 3.29)." },
    { label: "Velocity (H3)", rule: "In those starts, the ones averaging 98.0+ mph allow a lower xwOBA than the ones below 98.0." },
  ],
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" }) + " PT";

export default function PredictionsPage() {
  return (
    <>
      <PageHeader
        kicker="Graded against reality"
        title="The prediction ledger"
        dek="Most analytics write-ups never grade themselves. These forecasts were committed to git before the games they predict, so the timestamp proves they came first."
      />

      <div className="ledger">
        {ledger.map((p) => (
          <article key={p.id} className="ledger-card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "baseline" }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem" }}>{p.title}</h2>
              <Verdict text={p.status === "pending" ? "Pending" : p.parts.join(" · ")} />
            </div>
            <blockquote>&ldquo;{p.prediction}&rdquo;</blockquote>
            <ul>
              {(CRITERIA[p.id] ?? []).map((c) => (
                <li key={c.label}><strong>{c.label}.</strong> {c.rule}</li>
              ))}
            </ul>
            {p.parts.length ? (
              <p><strong>Grade:</strong> {p.parts.map((g, i) => <span key={i} style={{ marginRight: "0.5rem" }}><Verdict text={g} /></span>)}</p>
            ) : null}
            <div className="ledger-meta">
              <span>Locked {when(p.locked_at)}</span>
              <span>Commit <a href={`${REPO}/commit/${p.locked_commit}`} target="_blank" rel="noreferrer"><code>{p.locked_commit.slice(0, 7)}</code></a></span>
              <span><a href={`${REPO}/blob/main/${p.file}`} target="_blank" rel="noreferrer">Full criteria</a></span>
              <span>Graded by <code>{p.grader}</code></span>
            </div>
          </article>
        ))}
      </div>

      <Callout kind="note" label="How grading works">
        Each prediction has a grading script that re-reads the pulled data and applies the locked criteria mechanically.
        After a data refresh, <code>scripts/export_ledger.py</code> re-runs them and this page rebuilds with the result.
      </Callout>
    </>
  );
}
