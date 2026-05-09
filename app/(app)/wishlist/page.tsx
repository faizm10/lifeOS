import { LabelMono, Bar, Tag } from "@/components/ui";
import { wishlist } from "@/lib/data";
import { fmtUsd0 } from "@/lib/utils";

export default function WishlistPage() {
  const total = wishlist.reduce((s, w) => s + w.price, 0);
  const ordered = [...wishlist].sort((a,b) => ({high:0,med:1,low:2}[a.priority] - {high:0,med:1,low:2}[b.priority]));
  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Finance · Wishlist</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            Things I'm <em className="text-[var(--accent)]">considering</em>
          </h1>
        </div>
        <div className="ml-auto self-end text-right">
          <LabelMono>If bought today</LabelMono>
          <div className="font-mono text-[26px] text-ink tabular-nums mt-1">${fmtUsd0(total)}</div>
        </div>
      </header>
      <div className="hairline-strong mt-6 mb-2" />

      <div className="divide-y divide-rule-soft">
        {ordered.map(w => (
          <div key={w.id} className="grid items-baseline gap-5 py-4" style={{ gridTemplateColumns: "70px 1fr 100px 110px" }}>
            <Tag>{w.priority === "high" ? "Soon" : w.priority === "med" ? "Maybe" : "Later"}</Tag>
            <div>
              <div className="font-serif text-[18px] text-ink">{w.name}</div>
              {w.note && <div className="font-serif italic text-[14px] text-ink-3 mt-0.5">{w.note}</div>}
            </div>
            <span className="label-mono">{w.priority === "high" ? "Wanted" : "Saved"}</span>
            <span className="font-mono text-[15px] text-ink tabular-nums text-right">${fmtUsd0(w.price)}</span>
          </div>
        ))}
      </div>

      <p className="font-serif italic text-[14px] text-ink-3 mt-8 max-w-md">
        Items sit here for at least 30 days before I'll buy them. Most don't make it.
      </p>
    </div>
  );
}
