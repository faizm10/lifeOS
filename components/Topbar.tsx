"use client";

import { usePathname } from "next/navigation";

const LABELS: Record<string, [string, string]> = {
  "/":             ["Almanac",      "Dashboard"],
  "/transactions": ["Finance",      "Transactions"],
  "/bills":        ["Finance",      "Recurring bills"],
  "/wishlist":     ["Finance",      "Wishlist"],
  "/goals":        ["Finance",      "Savings goals"],
  "/journal":      ["Life tracker", "Journal"],
  "/wins":         ["Life tracker", "Career wins"],
  "/sports":       ["Life tracker", "Sports & fitness"],
  "/media":        ["Life tracker", "Media log"],
};

const DAY_SHORT   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Topbar() {
  const pathname = usePathname();
  const [section, current] = LABELS[pathname] ?? ["Almanac", ""];

  const now   = new Date();
  const today = `${DAY_SHORT[now.getDay()]} ${MONTH_SHORT[now.getMonth()]} ${now.getDate()}`;

  return (
    <div className="flex items-baseline gap-4 px-11 pt-[18px] pb-3.5 border-b border-rule-soft bg-paper sticky top-0 z-10">
      <div className="flex items-baseline gap-2 font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: "0.14em" }}>
        <span>{section}</span>
        <span>·</span>
        <span className="text-ink">{current}</span>
      </div>
      <div className="ml-auto flex items-center gap-2 border-b border-rule pb-1 w-60 text-ink-3 text-[13px]">
        <input className="flex-1 bg-transparent outline-none placeholder:text-ink-4" placeholder="Search" />
        <kbd className="font-mono text-[10px] px-1.5 border border-rule">⌘K</kbd>
      </div>
      <span className="font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: "0.14em" }}>
        {today}
      </span>
    </div>
  );
}
