import { LabelMono, Bar, SectionHead } from "@/components/ui";
import { goals, budgets } from "@/lib/data";
import { fmtUsd0 } from "@/lib/utils";

export default function GoalsPage() {
  const totalSaved = goals.reduce((s,g)=>s+g.saved, 0);
  const totalGoal  = goals.reduce((s,g)=>s+g.target, 0);
  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header>
        <LabelMono>Finance · Savings</LabelMono>
        <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
          What I'm <em className="text-[var(--accent)]">saving</em> for
        </h1>
      </header>
      <div className="hairline-strong mt-6" />

      <SectionHead num="01" title="In motion" meta={`${goals.length} active goals`} />
      <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {goals.map(g => {
          const pct = Math.round((g.saved / g.target) * 100);
          const monthsLeft = Math.ceil((g.target - g.saved) / g.monthly);
          return (
            <div key={g.id} className="border-l border-rule-strong pl-5">
              <LabelMono>{pct}% complete</LabelMono>
              <h3 className="font-serif italic text-[24px] text-ink mt-1.5">{g.name}</h3>
              <div className="font-mono text-[13px] text-ink-2 tabular-nums mt-1">
                ${fmtUsd0(g.saved)} <span className="text-ink-4">of</span> ${fmtUsd0(g.target)}
              </div>
              <Bar value={g.saved} max={g.target} className="mt-3" />
              <div className="flex justify-between mt-2 label-mono">
                <span>${g.monthly}/mo</span>
                <span>~{monthsLeft} months</span>
              </div>
            </div>
          );
        })}
      </div>

      <SectionHead num="02" title="Monthly budgets" meta="May · day 9" />
      <div className="divide-y divide-rule-soft">
        {budgets.map(b => {
          const pct = Math.round((b.spent / b.limit) * 100);
          const over = b.spent > b.limit;
          return (
            <div key={b.id} className="grid items-baseline gap-5 py-3.5" style={{ gridTemplateColumns: "180px 1fr 130px" }}>
              <span className="font-serif text-[16px] text-ink">{b.category}</span>
              <Bar value={b.spent} max={b.limit} />
              <span className={`font-mono text-[13px] tabular-nums text-right ${over ? "text-neg" : "text-ink-3"}`}>
                ${b.spent} / ${b.limit} · {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
