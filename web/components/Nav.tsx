"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/", label: "The puzzle" },
  { href: "/command", label: "Command" },
  { href: "/stuff", label: "Stuff" },
  { href: "/role", label: "Role" },
  { href: "/velocity", label: "Velocity" },
  { href: "/predictions", label: "Predictions" },
  { href: "/rigor", label: "Rigor" },
];

export default function Nav() {
  const pathname = usePathname();
  const current = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const navRef = useRef<HTMLElement>(null);

  // On a phone the links scroll sideways; keep the current page's link in view.
  useEffect(() => {
    navRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [current]);

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <Link href="/" className="wordmark">
          The Monster&rsquo;s <em>Adjustment</em>
        </Link>
        <nav aria-label="Sections" ref={navRef}>
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} aria-current={current === p.href ? "page" : undefined}>
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
