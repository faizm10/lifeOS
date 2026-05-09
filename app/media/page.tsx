import { LabelMono, Tag } from "@/components/ui";
import { media } from "@/lib/data";

export default function MediaPage() {
  const groups = {
    "Now": media.filter(m => m.status === "reading" || m.status === "watching"),
    "Finished": media.filter(m => m.status === "done"),
  };
  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header>
        <LabelMono>Life tracker · Media</LabelMono>
        <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
          What I'm <em className="text-[var(--accent)]">reading & watching</em>
        </h1>
      </header>
      <div className="hairline-strong mt-6" />

      {Object.entries(groups).map(([label, items]) => (
        <section key={label} className="mt-9">
          <div className="section-head"><span className="num">§</span><h2>{label}</h2><span className="meta">{items.length}</span></div>
          <div className="divide-y divide-rule-soft">
            {items.map(m => (
              <div key={m.id} className="grid items-baseline gap-5 py-4" style={{ gridTemplateColumns: "70px 1fr 1fr 100px 80px" }}>
                <Tag>{m.type}</Tag>
                <span className="font-serif italic text-[18px] text-ink">{m.title}</span>
                <span className="font-serif text-[14px] text-ink-3">{m.author}</span>
                <span className="label-mono">{m.status}</span>
                <span className="font-mono text-[13px] text-right" style={{ color: m.rating ? "var(--accent)" : "oklch(0.68 0.020 72)" }}>
                  {m.rating ? "★".repeat(m.rating) : "—"}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
