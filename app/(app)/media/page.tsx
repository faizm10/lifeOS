import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMedia } from "@/lib/queries";
import { LabelMono, Tag } from "@/components/ui";

export default async function MediaPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const media   = getMedia(session!.user.id);
  const now     = media.filter(m => m.status === "reading" || m.status === "watching");
  const done    = media.filter(m => m.status === "done");

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Life tracker · Media</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            What I'm <em className="text-[var(--accent)]">reading & watching</em>
          </h1>
        </div>
        <div className="ml-auto self-end text-right">
          <LabelMono>Total logged</LabelMono>
          <div className="font-mono text-[26px] text-ink tabular-nums mt-1">{media.length}</div>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      {media.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-8">
          <p className="font-serif italic text-[17px] text-ink-3">No media logged yet. Start tracking what you read and watch.</p>
        </div>
      ) : (
        <>
          {now.length > 0 && (
            <section className="mt-9">
              <div className="label-mono mb-4">Now — {now.length} item{now.length !== 1 ? "s" : ""}</div>
              <div className="divide-y divide-rule-soft">
                {now.map(m => <MediaRow key={m.id} m={m} />)}
              </div>
            </section>
          )}
          {done.length > 0 && (
            <section className="mt-9">
              <div className="label-mono mb-4">Finished — {done.length} item{done.length !== 1 ? "s" : ""}</div>
              <div className="divide-y divide-rule-soft">
                {done.map(m => <MediaRow key={m.id} m={m} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function MediaRow({ m }: { m: ReturnType<typeof getMedia>[number] }) {
  return (
    <div className="grid items-baseline gap-5 py-4" style={{ gridTemplateColumns: "70px 1fr 1fr 100px 80px" }}>
      <Tag>{m.type}</Tag>
      <span className="font-serif italic text-[18px] text-ink">{m.title}</span>
      <span className="font-serif text-[14px] text-ink-3">{m.author}</span>
      <span className="label-mono">{m.status}</span>
      <span className="font-mono text-[13px] text-right" style={{ color: m.rating ? "var(--accent)" : "oklch(0.68 0.020 72)" }}>
        {m.rating ? "★".repeat(m.rating) : "—"}
      </span>
    </div>
  );
}
