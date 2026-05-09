import { LabelMono, SectionHead } from "@/components/ui";
import { sportsLog } from "@/lib/data";

export default function SportsPage() {
  const weeklyKm = 15.3;
  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6">
        <div>
          <LabelMono>Life tracker · Body</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            Sports & <em className="text-[var(--accent)]">fitness</em>
          </h1>
        </div>
        <div className="ml-auto self-end flex items-baseline gap-8">
          <div className="text-right"><LabelMono>This week</LabelMono><div className="font-mono text-[22px] text-ink tabular-nums mt-1">{weeklyKm} km</div></div>
          <div className="text-right"><LabelMono>Streak</LabelMono><div className="font-mono text-[22px] text-ink tabular-nums mt-1">11 wks</div></div>
          <div className="text-right"><LabelMono>5k PR</LabelMono><div className="font-mono text-[22px] text-ink tabular-nums mt-1" style={{ color: "var(--accent)" }}>21:47</div></div>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      <SectionHead num="01" title="Recent sessions" meta={`${sportsLog.length} entries`} />
      <div className="divide-y divide-rule-soft">
        {sportsLog.map(s => (
          <div key={s.id} className="grid items-baseline gap-5 py-3.5" style={{ gridTemplateColumns: "100px 80px 1fr 200px" }}>
            <span className="label-mono">{s.date}</span>
            <span className="font-mono uppercase text-ink-2" style={{ fontSize: 11, letterSpacing: "0.12em" }}>{s.type}</span>
            <span className="font-serif italic text-[18px] text-ink">{s.name}</span>
            <span className="font-mono text-[13px] text-ink-3 tabular-nums text-right">{s.metric}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
