import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDashboardSummary } from "@/lib/queries";
import { definePageMeta } from "@/lib/seo";
import { LabelMono, SectionHead, Bar, Tag, Money } from "@/components/ui";
import { fmtUsd0, relativeDue } from "@/lib/utils";
import Link from "next/link";

const DAY_NAMES   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const ORDINALS    = ["first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth","eleventh","twelfth","thirteenth","fourteenth","fifteenth","sixteenth","seventeenth","eighteenth","nineteenth","twentieth","twenty-first","twenty-second","twenty-third","twenty-fourth","twenty-fifth","twenty-sixth","twenty-seventh","twenty-eighth","twenty-ninth","thirtieth","thirty-first"];

export const metadata: Metadata = definePageMeta({
  title: "Dashboard",
  description:
    "Your LifeOS home — month-to-date money, upcoming bills, savings goals, journal, wins, and sports at a glance.",
  path: "/",
});

function weekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export default async function DashboardPage() {
  const session   = await auth.api.getSession({ headers: headers() });
  const userId    = session!.user.id;
  const firstName = (session!.user.name ?? "there").split(" ")[0];

  const { income, expense, upcomingBills, goals, lastJournal, pinnedWin, recentSports } = getDashboardSummary(userId);

  const net         = income + expense;
  const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;
  const totalSaved  = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  const now     = new Date();
  const dayName = DAY_NAMES[now.getDay()];
  const ordinal = ORDINALS[now.getDate() - 1];
  const month   = MONTH_NAMES[now.getMonth()];
  const year    = now.getFullYear();
  const week    = weekNumber(now);

  const isEmpty = income === 0 && expense === 0 && upcomingBills.length === 0 && goals.length === 0;

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
            {isEmpty
              ? `Welcome, ${firstName}. Your almanac is ready — start filling it in.`
              : `Good to have you back, ${firstName}. Here is where things stand.`}
          </p>
        </div>
        <aside className="self-end pb-3">
          <div className="border-y border-rule-strong divide-y divide-rule-soft">
            {([
              ["Net · this month",  net      !== 0 ? <Money key="n" value={net} signed /> : "—"],
              ["Total saved",       totalSaved > 0  ? `$${fmtUsd0(totalSaved)} of $${fmtUsd0(totalTarget)}` : "—"],
              ["Savings rate",      income > 0      ? `${savingsRate}%` : "—"],
              ["Active goals",      goals.length > 0 ? String(goals.length) : "0"],
              ["Journal entries",   lastJournal     ? "Written today" : "—"],
            ] as [string, React.ReactNode][]).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between py-2.5">
                <span className="label-mono">{k}</span>
                <span className="font-mono text-[13px] text-ink tabular-nums">{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </header>

      {/* §01 — Money this month */}
      <SectionHead num="01" title="Money, this month" meta={`${month} so far`} action={<Link href="/transactions" className="btn-ghost btn">Open ledger →</Link>} />
      {income === 0 && expense === 0 ? (
        <div className="border border-rule-soft p-8 text-center">
          <p className="font-serif italic text-[17px] text-ink-3">No transactions recorded yet.</p>
          <Link href="/transactions" className="btn mt-4 inline-flex">Add first transaction →</Link>
        </div>
      ) : (
        <div className="border-y border-rule-soft divide-y divide-rule-soft">
          {([["Income", income], ["Expenses", Math.abs(expense)], ["Net", net]] as [string, number][]).map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between py-2.5">
              <span className="label-mono">{k}</span>
              <span className="font-mono text-[15px] tabular-nums" style={{ color: k === "Net" ? "var(--accent)" : undefined }}>
                {k === "Net" ? <Money value={net} signed /> : `$${fmtUsd0(v)}`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* §02 — Coming due */}
      <SectionHead num="02" title="Coming due" meta="next 14 days" action={<Link href="/bills" className="btn-ghost btn">All bills →</Link>} />
      {upcomingBills.length === 0 ? (
        <div className="border border-rule-soft p-8 text-center">
          <p className="font-serif italic text-[17px] text-ink-3">No upcoming bills.</p>
          <Link href="/bills" className="btn mt-4 inline-flex">Add a bill →</Link>
        </div>
      ) : (
        <div className="border-y border-rule-soft divide-y divide-rule-soft">
          {upcomingBills.map(b => (
            <div key={b.id} className="flex items-baseline gap-5 py-3">
              <span className="font-mono text-[11px] text-ink-3 tabular-nums w-14">{b.due.slice(5)}</span>
              <span className="font-serif text-[15px] text-ink flex-1">{b.name}</span>
              <span className={`font-mono uppercase text-[10px]`} style={{ letterSpacing: "0.14em", color: b.status === "over" ? "var(--neg)" : b.status === "due" ? "var(--warn)" : undefined }}>
                {relativeDue(b.due)}
              </span>
              <span className="font-mono text-[13px] text-ink tabular-nums w-20 text-right">${b.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* §03 — In motion / Goals */}
      <SectionHead num="03" title="In motion" meta={`savings · ${goals.length} active`} action={<Link href="/goals" className="btn-ghost btn">All goals →</Link>} />
      {goals.length === 0 ? (
        <div className="border border-rule-soft p-8 text-center">
          <p className="font-serif italic text-[17px] text-ink-3">No savings goals yet.</p>
          <Link href="/goals" className="btn mt-4 inline-flex">Set first goal →</Link>
        </div>
      ) : (
        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {goals.map(g => {
            const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
            return (
              <div key={g.id} className="border-l border-rule-strong pl-4">
                <LabelMono>{pct}% saved</LabelMono>
                <h4 className="font-serif italic text-[20px] text-ink mt-1.5">{g.name}</h4>
                <Bar value={g.saved} max={g.target} className="mt-2.5" />
                <div className="flex items-baseline justify-between mt-2 font-mono text-[11.5px] text-ink-3 tabular-nums">
                  <span>${fmtUsd0(g.saved)}</span><span>of ${fmtUsd0(g.target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* §04 — Today, in life */}
      <SectionHead num="04" title="Today, in life" meta="journal · wins · sports" />
      <div className="grid gap-10" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <div className="bg-warm-surface border border-rule-soft p-7 flex flex-col items-start">
          <LabelMono>Journal</LabelMono>
          {lastJournal ? (
            <>
              <h4 className="font-serif text-[26px] text-ink leading-tight mt-3">{lastJournal.title}</h4>
              <p className="font-serif text-[15px] text-ink-2 leading-[1.6] mt-2 line-clamp-3">{lastJournal.body}</p>
            </>
          ) : (
            <p className="font-serif italic text-[17px] text-ink-3 mt-4">Nothing written yet today.</p>
          )}
          <Link href="/journal" className="btn-ghost btn mt-4">
            {lastJournal ? "Continue writing →" : "Start writing →"}
          </Link>
        </div>
        <div className="space-y-7">
          <div>
            <LabelMono>Latest win</LabelMono>
            {pinnedWin ? (
              <>
                <h4 className="font-serif italic text-[20px] text-ink mt-1.5">{pinnedWin.title}</h4>
                <p className="font-serif text-[14px] text-ink-2 leading-[1.55] mt-1.5">{pinnedWin.body}</p>
                <div className="flex gap-1.5 mt-2">{pinnedWin.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
              </>
            ) : (
              <>
                <p className="font-serif italic text-[15px] text-ink-3 mt-2">No wins logged yet.</p>
                <Link href="/wins" className="btn-ghost btn mt-3">Log a win →</Link>
              </>
            )}
          </div>
          <div className="border-t border-rule-soft pt-5">
            <LabelMono>This week · sports</LabelMono>
            {recentSports.length > 0 ? (
              <ul className="mt-2 divide-y divide-rule-soft">
                {recentSports.map(s => (
                  <li key={s.id} className="flex items-baseline gap-3 py-2">
                    <span className="font-mono uppercase text-ink-4 w-16" style={{ fontSize: 9.5, letterSpacing: "0.14em" }}>{s.date}</span>
                    <span className="font-serif text-[14px] text-ink flex-1">{s.name}</span>
                    <span className="font-mono text-[11.5px] text-ink-3 tabular-nums">{s.metric}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="font-serif italic text-[15px] text-ink-3 mt-2">No activity logged yet.</p>
                <Link href="/sports" className="btn-ghost btn mt-3">Log activity →</Link>
              </>
            )}
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
