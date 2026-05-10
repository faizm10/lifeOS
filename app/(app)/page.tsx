import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LabelMono, SectionHead } from "@/components/ui";
import Link from "next/link";

const DAY_NAMES   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const ORDINALS    = ["first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth","eleventh","twelfth","thirteenth","fourteenth","fifteenth","sixteenth","seventeenth","eighteenth","nineteenth","twentieth","twenty-first","twenty-second","twenty-third","twenty-fourth","twenty-fifth","twenty-sixth","twenty-seventh","twenty-eighth","twenty-ninth","thirtieth","thirty-first"];

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const userName = session?.user?.name ?? "there";
  const firstName = userName.split(" ")[0];

  const now     = new Date();
  const dayName = DAY_NAMES[now.getDay()];
  const ordinal = ORDINALS[now.getDate() - 1];
  const month   = MONTH_NAMES[now.getMonth()];
  const year    = now.getFullYear();
  const week    = getWeekNumber(now);

  return (
    <div className="px-11 py-8 max-w-[1180px]">

      {/* Editorial header */}
      <header className="grid gap-10 mb-8" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div>
          <div className="font-mono uppercase text-ink-3 mb-3" style={{ fontSize: 10.5, letterSpacing: "0.18em" }}>
            {year} · Week {week} · {dayName}
          </div>
          <h1 className="font-serif text-[88px] leading-[0.92] tracking-[-0.02em] text-ink">
            {dayName}<br />
            <em className="text-[var(--accent)]">the {ordinal}</em><br />
            of {month}
          </h1>
          <p className="font-serif text-[19px] leading-[1.55] text-ink-2 max-w-[460px] mt-7">
            Welcome back, {firstName}. Your almanac is ready — start filling it in.
          </p>
        </div>
        <aside className="self-end pb-3">
          <div className="border-y border-rule-strong divide-y divide-rule-soft">
            {([
              ["Net · this month",  "—"],
              ["Cash on hand",      "—"],
              ["Savings rate",      "—"],
              ["Active goals",      "0"],
              ["Journal streak",    "0 days"],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between py-2.5">
                <span className="label-mono">{k}</span>
                <span className="font-mono text-[13px] text-ink-3 tabular-nums">{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </header>

      {/* §01 — Money this month */}
      <SectionHead num="01" title="Money, this month" meta={`${month} so far`} action={<Link href="/transactions" className="btn-ghost btn">Open ledger →</Link>} />
      <div className="border border-rule-soft p-8 text-center">
        <p className="font-serif italic text-[17px] text-ink-3">No transactions recorded yet.</p>
        <Link href="/transactions" className="btn mt-4 inline-flex">Add first transaction →</Link>
      </div>

      {/* §02 — Coming due */}
      <SectionHead num="02" title="Coming due" meta="next 14 days" action={<Link href="/bills" className="btn-ghost btn">All bills →</Link>} />
      <div className="border border-rule-soft p-8 text-center">
        <p className="font-serif italic text-[17px] text-ink-3">No recurring bills set up yet.</p>
        <Link href="/bills" className="btn mt-4 inline-flex">Add first bill →</Link>
      </div>

      {/* §03 — In motion / Goals */}
      <SectionHead num="03" title="In motion" meta="savings goals" action={<Link href="/goals" className="btn-ghost btn">All goals →</Link>} />
      <div className="border border-rule-soft p-8 text-center">
        <p className="font-serif italic text-[17px] text-ink-3">No savings goals yet.</p>
        <Link href="/goals" className="btn mt-4 inline-flex">Set first goal →</Link>
      </div>

      {/* §04 — Today, in life */}
      <SectionHead num="04" title="Today, in life" meta="journal · wins · sports" />
      <div className="grid gap-10" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <div className="bg-warm-surface border border-rule-soft p-7 flex flex-col items-start">
          <LabelMono>Journal</LabelMono>
          <p className="font-serif italic text-[17px] text-ink-3 mt-4">Nothing written yet today.</p>
          <Link href="/journal" className="btn-ghost btn mt-4">Start writing →</Link>
        </div>
        <div className="space-y-7">
          <div>
            <LabelMono>Latest win</LabelMono>
            <p className="font-serif italic text-[15px] text-ink-3 mt-2">No wins logged yet.</p>
            <Link href="/wins" className="btn-ghost btn mt-3">Log a win →</Link>
          </div>
          <div className="border-t border-rule-soft pt-5">
            <LabelMono>This week · sports</LabelMono>
            <p className="font-serif italic text-[15px] text-ink-3 mt-2">No activity logged yet.</p>
            <Link href="/sports" className="btn-ghost btn mt-3">Log activity →</Link>
          </div>
        </div>
      </div>

      <footer className="mt-16 pt-4 border-t border-rule flex items-baseline justify-between font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
        <span>LifeOS · A personal almanac</span>
        <span>{year}</span>
      </footer>
    </div>
  );
}
