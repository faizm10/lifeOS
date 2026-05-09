"use client";

import { useState } from "react";
import { LabelMono, SectionHead, Tag } from "@/components/ui";
import { bills as seedBills, type Bill } from "@/lib/data";
import { relativeDue } from "@/lib/utils";

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>(seedBills);

  const togglePaid = (id: string) =>
    setBills(bills.map(b => b.id === id ? { ...b, status: b.status === "paid" ? "scheduled" : "paid" } : b));

  const due       = bills.filter(b => b.status === "due" || b.status === "over");
  const scheduled = bills.filter(b => b.status === "scheduled");
  const paid      = bills.filter(b => b.status === "paid");
  const monthly   = bills.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Finance · Recurring</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            What renews <em className="text-[var(--accent)]">on its own</em>
          </h1>
        </div>
        <div className="ml-auto self-end text-right">
          <LabelMono>Monthly load</LabelMono>
          <div className="font-mono text-[26px] text-ink tabular-nums mt-1">${monthly.toFixed(2)}</div>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      <Group title="Due now" num="01" items={due} togglePaid={togglePaid} accent />
      <Group title="Scheduled" num="02" items={scheduled} togglePaid={togglePaid} />
      <Group title="Paid this month" num="03" items={paid} togglePaid={togglePaid} muted />
    </div>
  );
}

function Group({ title, num, items, togglePaid, accent, muted }: {
  title: string; num: string; items: Bill[];
  togglePaid: (id: string) => void; accent?: boolean; muted?: boolean;
}) {
  if (!items.length) return null;
  return (
    <>
      <SectionHead num={num} title={title} meta={`${items.length} bills`} />
      <div className="border-y border-rule-soft divide-y divide-rule-soft">
        {items.map(b => {
          const overdue = b.status === "over";
          const dueNow = b.status === "due";
          return (
            <div key={b.id} className={`grid items-baseline gap-5 py-3.5 ${muted ? "opacity-55" : ""}`}
                 style={{ gridTemplateColumns: "auto 1fr auto auto auto" }}>
              <span className="font-mono uppercase text-ink-4 w-9 text-center"
                    style={{ fontSize: 11, letterSpacing: "0.10em", border: "1px solid currentColor", padding: "3px 0" }}>
                {b.logo}
              </span>
              <div>
                <div className="font-serif text-[16px] text-ink">{b.name}</div>
                <div className="label-mono mt-0.5">{b.desc} · {b.recurring}</div>
              </div>
              <span className={`font-mono uppercase ${overdue ? "text-neg" : dueNow ? "text-warn" : muted ? "text-ink-4" : "text-ink-3"}`}
                    style={{ fontSize: 10.5, letterSpacing: "0.14em" }}>
                {muted ? "Paid" : relativeDue(b.due)}
              </span>
              <span className="font-mono text-[15px] text-ink tabular-nums w-24 text-right">${b.amount.toFixed(2)}</span>
              <button onClick={() => togglePaid(b.id)} className="btn">
                {b.status === "paid" ? "Undo" : "Mark paid"}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
