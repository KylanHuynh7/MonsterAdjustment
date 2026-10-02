import type { Metadata, Viewport } from "next";
import { Newsreader, Inter, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import { REPO, commit, dataThrough, generatedAt } from "@/lib/data";
import "./globals.css";

const serif = Newsreader({ subsets: ["latin"], display: "swap", variable: "--font-serif", axes: ["opsz"] });
const sans = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], display: "swap", weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "The Monster's Adjustment — Roki Sasaki, NPB to MLB",
    template: "%s — The Monster's Adjustment",
  },
  description:
    "A pre-registered data-science investigation of Roki Sasaki's transition from NPB phenom to MLB starter, " +
    "with Yoshinobu Yamamoto as a matched control.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Nav />
        <main className="page">
          {children}
          <footer className="colophon">
            <div>
              <strong>About</strong>
              A notebook-driven, pre-registered investigation. Source, design specs, the decision log and the full
              limitations document are on{" "}
              <a href={REPO} target="_blank" rel="noreferrer">GitHub</a>.
            </div>
            <div>
              <strong>Data</strong>
              Baseball Savant (Statcast), MLB Stats API, Baseball Reference. Regular season through {dataThrough}.
              Bundle built {generatedAt} from commit{" "}
              <a href={`${REPO}/commit/${commit}`} target="_blank" rel="noreferrer"><code>{commit.slice(0, 7)}</code></a>.
            </div>
            <div>
              <strong>Method</strong>
              Every number is computed at build time from the notebooks&rsquo; output tables. The site makes no API
              calls and runs no model at page load.
            </div>
          </footer>
        </main>
      </body>
    </html>
  );
}
