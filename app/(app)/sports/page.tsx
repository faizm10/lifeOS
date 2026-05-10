import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSportsLog } from "@/lib/queries";
import { LabelMono, SectionHead } from "@/components/ui";

export default async function SportsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const log     = getSportsLog(session!.user.id);

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6">
        <div>
          <LabelMono>Life tracker · Body</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            Sports & <em className="text-[var(--accent)]">fitness</em>
          </h1>
        </div>
        <div className="ml-auto self-end text-right">
          <LabelMono>Sessions logged</LabelMono>
          <div className="font-mono text-[26px] text-ink tabular-nums mt-1">{log.length}</div>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      {log.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-8">
          <p className="font-serif italic text-[17px] text-ink-3">No activity logged yet. Start tracking your sessions.</p>
        </div>
      ) : (
        <>
          <SectionHead num="01" title="Recent sessions" meta={`${log.length} entries`} />
          <div className="divide-y divide-rule-soft">
            {log.map(s => (
              <div key={s.id} className="grid items-baseline gap-5 py-3.5" style={{ gridTemplateColumns: "100px 80px 1fr 200px" }}>
                <span className="label-mono">{s.date}</span>
                <span className="font-mono uppercase text-ink-2" style={{ fontSize: 11, letterSpacing: "0.12em" }}>{s.type}</span>
                <span className="font-serif italic text-[18px] text-ink">{s.name}</span>
                <span className="font-mono text-[13px] text-ink-3 tabular-nums text-right">{s.metric}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
