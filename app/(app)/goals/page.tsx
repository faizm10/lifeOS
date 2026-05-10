import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getGoals } from "@/lib/queries";
import { LabelMono, SectionHead, Bar } from "@/components/ui";
import { fmtUsd0 } from "@/lib/utils";

export default async function GoalsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const goals   = getGoals(session!.user.id);
  const totalSaved  = goals.reduce((s, g) => s + g.saved,  0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Finance · Savings</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            What I'm <em className="text-[var(--accent)]">saving</em> for
          </h1>
        </div>
        <div className="ml-auto self-end text-right">
          <LabelMono>Total saved</LabelMono>
          <div className="font-mono text-[26px] text-ink tabular-nums mt-1">${fmtUsd0(totalSaved)}</div>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      {goals.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-8">
          <p className="font-serif italic text-[17px] text-ink-3">No savings goals yet. Add one to get started.</p>
        </div>
      ) : (
        <>
          <SectionHead num="01" title="In motion" meta={`${goals.length} active goals`} />
          <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {goals.map(g => {
              const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
              const monthsLeft = g.monthly > 0 ? Math.ceil((g.target - g.saved) / g.monthly) : null;
              return (
                <div key={g.id} className="border-l border-rule-strong pl-5">
                  <LabelMono>{pct}% complete</LabelMono>
                  <h3 className="font-serif italic text-[24px] text-ink mt-1.5">{g.name}</h3>
                  <div className="font-mono text-[13px] text-ink-2 tabular-nums mt-1">
                    ${fmtUsd0(g.saved)} <span className="text-ink-4">of</span> ${fmtUsd0(g.target)}
                  </div>
                  <Bar value={g.saved} max={g.target} className="mt-3" />
                  <div className="flex justify-between mt-2 label-mono">
                    {g.monthly > 0 && <span>${g.monthly}/mo</span>}
                    {monthsLeft != null && <span>~{monthsLeft} months</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <SectionHead num="02" title="Overall progress" meta="across all goals" />
          <Bar value={totalSaved} max={totalTarget} className="max-w-lg" />
          <div className="flex items-baseline justify-between max-w-lg mt-2 font-mono text-[12px] text-ink-3 tabular-nums">
            <span>${fmtUsd0(totalSaved)} saved</span>
            <span>${fmtUsd0(totalTarget)} target</span>
          </div>
        </>
      )}
    </div>
  );
}
