"use client";

import { useState, useMemo } from "react";
import { LabelMono, Tag } from "@/components/ui";
import type { Win } from "@/lib/queries";
import { clsx } from "@/lib/utils";

const TYPES = ["All", "Shipped", "Skill", "PR", "Talk", "Project", "Promotion"];

export default function WinsClient({ initialWins }: { initialWins: Win[] }) {
  const [filter, setFilter] = useState("All");
  const filtered = useMemo(
    () => filter === "All" ? initialWins : initialWins.filter(w => w.type === filter),
    [filter, initialWins]
  );

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Life tracker · Wins</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            A record of <em className="text-[var(--accent)]">small triumphs</em>
          </h1>
        </div>
        <div className="ml-auto self-end text-right">
          <LabelMono>Total · {new Date().getFullYear()}</LabelMono>
          <div className="font-mono text-[26px] text-ink tabular-nums mt-1">{initialWins.length}</div>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      <div className="flex flex-wrap mt-5 mb-8">
        {TYPES.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={clsx("chip", filter === f && "chip-active")}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center">
          <p className="font-serif italic text-[17px] text-ink-3">
            {initialWins.length === 0 ? "No wins logged yet. Start recording your triumphs." : "No wins match this filter."}
          </p>
        </div>
      ) : (
        <div className="relative" style={{ marginLeft: 110 }}>
          <div className="absolute top-0 bottom-0 w-px bg-rule-soft" style={{ left: -1 }} />
          {filtered.map(w => (
            <article key={w.id} className="relative pl-8 pb-9">
              <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 border"
                style={{ background: w.pinned ? "var(--accent)" : "oklch(0.965 0.014 85)", borderColor: w.pinned ? "var(--accent)" : "oklch(0.66 0.025 70)" }} />
              <div className="absolute -left-[110px] top-0.5 w-[90px] text-right">
                <div className="label-mono">{w.date}</div>
                <div className="font-mono text-[10.5px] mt-0.5" style={{ color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{w.type}</div>
              </div>
              <h3 className="font-serif text-[22px] leading-tight text-ink">
                {w.pinned && <span className="font-mono text-[10px] text-[var(--accent)] mr-2 align-middle" style={{ letterSpacing: "0.14em" }}>PINNED</span>}
                {w.title}
              </h3>
              <p className="font-serif text-[15px] text-ink-2 leading-[1.55] mt-1.5">{w.body}</p>
              <div className="flex gap-1.5 mt-2.5">{w.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
