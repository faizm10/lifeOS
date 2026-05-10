"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const NAV = [
  { href: "/",             label: "Dashboard",        num: "00" },
  { kind: "sec" as const,  label: "Finance" },
  { href: "/transactions", label: "Transactions",     num: "01" },
  { href: "/bills",        label: "Recurring bills",  num: "02" },
  { href: "/wishlist",     label: "Wishlist",          num: "03" },
  { href: "/goals",        label: "Savings goals",    num: "04" },
  { kind: "sec" as const,  label: "Life tracker" },
  { href: "/journal",      label: "Journal",          num: "05" },
  { href: "/wins",         label: "Career wins",      num: "06" },
  { href: "/sports",       label: "Sports & fitness", num: "07" },
  { href: "/media",        label: "Media log",        num: "08" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { data: session } = authClient.useSession();

  const displayName = session?.user?.name ?? "—";
  const year = new Date().getFullYear();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="bg-paper-2 border-r border-rule-strong px-[22px] pt-7 pb-5 flex flex-col gap-0.5 sticky top-0 h-screen overflow-y-auto">
      <div className="pb-6 mb-3.5 border-b border-rule-soft">
        <div className="font-serif italic text-[28px] leading-none tracking-tight text-ink">
          LifeOS<span className="text-[var(--accent)] not-italic">·</span>
        </div>
        <div className="font-mono uppercase text-ink-3 mt-1" style={{ fontSize: 9.5, letterSpacing: "0.18em" }}>
          Almanac · {year}
        </div>
      </div>

      {NAV.map((n, i) => {
        if ("kind" in n) {
          return (
            <div key={i} className="flex items-center gap-2 pt-4 pb-1.5 font-mono uppercase text-ink-4 font-medium" style={{ fontSize: 9.5, letterSpacing: "0.16em" }}>
              <span>{n.label}</span>
              <span className="flex-1 h-px bg-rule-soft" />
            </div>
          );
        }
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`relative flex items-baseline gap-2.5 py-1 font-serif text-[14px] tracking-tight transition-colors ${
              active ? "text-ink" : "text-ink-2 hover:text-ink"
            }`}
          >
            {active && (
              <span className="absolute left-[-22px] top-1/2 -translate-y-1/2 w-3.5 h-px" style={{ background: "var(--accent)" }} />
            )}
            <span className="font-mono not-italic text-ink-4 font-medium w-5" style={{ fontSize: 9.5, letterSpacing: "0.04em" }}>{n.num}</span>
            <span className={`flex-1 ${active ? "italic" : ""}`}>{n.label}</span>
          </Link>
        );
      })}

      <div className="mt-auto pt-3.5 border-t border-rule-soft">
        <div className="flex items-baseline justify-between font-mono uppercase text-ink-3 mb-2" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
          <span className="text-ink-2 truncate max-w-[120px]">{displayName}</span>
          <span>Vol. I</span>
        </div>
        <button
          onClick={handleSignOut}
          className="btn-ghost btn w-full text-left"
          style={{ fontSize: 10 }}
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
