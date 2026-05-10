"use client";

import { usePathname } from "next/navigation";

const LABELS: Record<string, [string, string]> = {
  "/dashboard":              ["Almanac",      "Dashboard"],
  "/dashboard/accounts":     ["Finance",      "Accounts"],
  "/dashboard/transactions": ["Finance",      "Transactions"],
  "/dashboard/bills":        ["Finance",      "Recurring bills"],
  "/dashboard/wishlist":     ["Finance",      "Wishlist"],
  "/dashboard/goals":        ["Finance",      "Savings goals"],
  "/dashboard/journal":      ["Life tracker", "Journal"],
  "/dashboard/wins":         ["Life tracker", "Career wins"],
  "/dashboard/sports":       ["Life tracker", "Sports & fitness"],
  "/dashboard/media":        ["Life tracker", "Media log"],
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
      <span className="ml-auto font-mono uppercase text-ink-3" style={{ fontSize: 11, letterSpacing: "0.14em" }}>
        {today}
      </span>
    </div>
  );
}
