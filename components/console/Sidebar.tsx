"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/console", label: "Dashboard" },
  { href: "/console/subjects", label: "Subjects" },
  { href: "/console/network", label: "Network" },
  { href: "/console/ingest", label: "Ingest" },
  { href: "/console/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-hairline bg-panel">
      <div className="border-b border-hairline px-4 py-5">
        <Link href="/console" className="font-mono text-sm tracking-widest text-accent">
          RELEVANT
        </Link>
        <p className="mt-1 font-mono text-[10px] text-dim">OPERATOR CONSOLE</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {nav.map((item) => {
          const active =
            item.href === "/console"
              ? pathname === "/console"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 font-mono text-xs uppercase tracking-wider transition ${
                active
                  ? "border-l-2 border-accent bg-accent/5 text-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-hairline p-4 font-mono text-[10px] text-dim">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
          Machine online
        </span>
      </div>
    </aside>
  );
}
