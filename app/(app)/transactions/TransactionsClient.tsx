"use client";

import { useState, useMemo } from "react";
import { LabelMono, SectionHead, Tag, Money } from "@/components/ui";
import type { Transaction, Category } from "@/lib/queries";
import { fmtDate, clsx } from "@/lib/utils";

const FILTERS: ("All" | Category)[] = ["All", "Groceries", "Dining", "Transport", "Subscriptions", "Bills", "Income"];

export default function TransactionsClient({ initialTransactions }: { initialTransactions: Transaction[] }) {
  const [filter, setFilter] = useState<"All" | Category>("All");

  const rows = useMemo(
    () => filter === "All" ? initialTransactions : initialTransactions.filter(t => t.category === filter),
    [filter, initialTransactions]
  );

  const income  = rows.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = rows.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);

  const byDate = useMemo(() => {
    const m = new Map<string, Transaction[]>();
    rows.forEach(r => {
      if (!m.has(r.date)) m.set(r.date, []);
      m.get(r.date)!.push(r);
    });
    return Array.from(m.entries());
  }, [rows]);

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Finance · Ledger</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            The <em className="text-[var(--accent)]">ledger</em>
          </h1>
        </div>
        <div className="ml-auto flex items-baseline gap-7 self-end">
          <div className="text-right">
            <LabelMono>In</LabelMono>
            <div className="font-mono text-[20px] text-pos tabular-nums mt-1">+${income.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <LabelMono>Out</LabelMono>
            <div className="font-mono text-[20px] text-ink tabular-nums mt-1">−${Math.abs(expense).toFixed(2)}</div>
          </div>
          <div className="text-right">
            <LabelMono>Net</LabelMono>
            <div className="font-mono text-[20px] tabular-nums mt-1" style={{ color: "var(--accent)" }}>
              {(income + expense) >= 0 ? "+" : "−"}${Math.abs(income + expense).toFixed(2)}
            </div>
          </div>
        </div>
      </header>

      <div className="hairline-strong mt-6" />

      <div className="flex flex-wrap mt-5 mb-2">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={clsx("chip", filter === f && "chip-active")}>{f}</button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-6">
          <p className="font-serif italic text-[17px] text-ink-3">No transactions yet.</p>
        </div>
      ) : (
        <div className="mt-6">
          {byDate.map(([date, items]) => (
            <section key={date} className="mb-6">
              <div className="flex items-baseline gap-3 pb-2 border-b border-rule">
                <span className="font-serif italic text-[20px] text-ink">{fmtDate(date)}</span>
                <span className="label-mono">{new Date(date + "T00:00").toLocaleDateString("en-US", { weekday: "long" })}</span>
                <span className="ml-auto label-mono">{items.length} entries</span>
              </div>
              <div className="divide-y divide-rule-soft">
                {items.map(t => (
                  <div key={t.id} className="grid items-baseline gap-5 py-2.5" style={{ gridTemplateColumns: "100px 1fr 1.2fr 110px" }}>
                    <Tag>{t.category}</Tag>
                    <span className="font-serif text-[15px] text-ink">{t.merchant}</span>
                    <span className="font-serif text-[14px] text-ink-3 italic">{t.description}</span>
                    <span className="text-right font-mono text-[14px] tabular-nums">
                      <Money value={t.amount} signed />
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
