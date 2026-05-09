import { LabelMono, SectionHead, Bar, Tag, Money } from "@/components/ui";
import { transactions, bills, goals, budgets, wins, journalEntries, sportsLog, monthlyChart } from "@/lib/data";
import { fmtUsd0, relativeDue } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const monthIncome = 7620;
  const monthSpent = 3818;
  const net = monthIncome - monthSpent;
  const savingsRate = Math.round((net / monthIncome) * 100);
  const upcomingBills = bills.filter(b => b.status !== "paid").sort((a,b)=>a.due.localeCompare(b.due)).slice(0, 4);
  const totalSaved = goals.reduce((s,g)=>s+g.saved, 0);
  const totalGoal = goals.reduce((s,g)=>s+g.target, 0);
  const lastJournal = journalEntries[0];
  const pinnedWin = wins.find(w => w.pinned)!;

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      {/* Editorial header */}
      <header className="grid gap-10 mb-8" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div>
          <div className="font-mono uppercase text-ink-3 mb-3" style={{ fontSize: 10.5, letterSpacing: "0.18em" }}>
            Volume III · Issue 19 · Saturday
          </div>
          <h1 className="font-serif text-[88px] leading-[0.92] tracking-[-0.02em] text-ink">
            Saturday<br />
            <em className="text-[var(--accent)]">the ninth</em><br />
            of May
          </h1>
          <p className="font-serif text-[19px] leading-[1.55] text-ink-2 max-w-[460px] mt-7">
            A quiet morning. Books on the table, coffee made twice. Three bills due this week,
            the savings rate is holding, and the week's run total is already past last week's.
          </p>
        </div>
        <aside className="self-end pb-3">
          <div className="border-y border-rule-strong divide-y divide-rule-soft">
            {[
              ["Net · May",    <Money key="n" value={net} signed />],
              ["Cash on hand", `$${fmtUsd0(28640)}`],
              ["Savings rate", `${savingsRate}%`],
              ["Run streak",   "11 wks"],
              ["Mood (7-day)", <span key="m" className="text-[var(--accent)]">Good · 4.1</span>],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex items-baseline justify-between py-2.5">
                <span className="label-mono">{k}</span>
                <span className="font-mono text-[13px] text-ink tabular-nums">{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </header>

      {/* §01 — Money this month */}
      <SectionHead num="01" title="Money, this month" meta="May 1 — May 9" action={<Link href="/transactions" className="btn-ghost btn">Open ledger →</Link>} />
      <div className="grid gap-10" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div>
          {/* Tiny chart */}
          <div className="flex items-end gap-2.5 h-[140px] border-b border-rule pb-1 mb-2">
            {monthlyChart.map((m, i) => {
              const total = m.expenses.Bills + m.expenses.Groceries + m.expenses.Dining + m.expenses.Other;
              const max = 7800;
              const inH = (m.income / max) * 130;
              const exH = (total   / max) * 130;
              const isCurrent = i === monthlyChart.length - 1;
              return (
                <div key={m.m} className="flex-1 flex items-end gap-1">
                  <div className="flex-1" style={{ height: inH, background: isCurrent ? "var(--accent)" : "oklch(0.78 0.025 75)" }} />
                  <div className="flex-1 border border-rule" style={{ height: exH, background: isCurrent ? "oklch(0.46 0.16 28 / 0.18)" : "transparent" }} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between font-mono uppercase text-ink-4" style={{ fontSize: 9.5, letterSpacing: "0.14em" }}>
            {monthlyChart.map(m => <span key={m.m}>{m.m}</span>)}
          </div>
          <div className="flex gap-5 mt-4 font-mono uppercase text-ink-3" style={{ fontSize: 10.5, letterSpacing: "0.14em" }}>
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 inline-block" style={{ background: "var(--accent)" }} /> Income</span>
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 inline-block border border-rule" /> Expenses</span>
          </div>
        </div>
        <div className="border-l border-rule-soft pl-7">
          <LabelMono>Budget pace · 9 of 31 days</LabelMono>
          <div className="mt-3 space-y-3">
            {budgets.slice(0, 4).map(b => {
              const pct = Math.round((b.spent / b.limit) * 100);
              return (
                <div key={b.id}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-[14px] text-ink">{b.category}</span>
                    <span className="font-mono text-[11.5px] text-ink-3 tabular-nums">${b.spent} <span className="text-ink-4">/ ${b.limit}</span></span>
                  </div>
                  <Bar value={b.spent} max={b.limit} className="mt-1.5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* §02 — Coming due */}
      <SectionHead num="02" title="Coming due" meta="next 14 days" action={<Link href="/bills" className="btn-ghost btn">All bills →</Link>} />
      <div className="border-y border-rule-soft divide-y divide-rule-soft">
        {upcomingBills.map(b => {
          const overdue = b.status === "over";
          const due = b.status === "due";
          return (
            <div key={b.id} className="flex items-baseline gap-5 py-3">
              <span className="font-mono text-[11px] text-ink-3 tabular-nums w-14">{b.due.slice(5)}</span>
              <span className="font-serif text-[15px] text-ink flex-1">{b.name}</span>
              <span className={`font-mono uppercase ${overdue ? "text-neg" : due ? "text-warn" : "text-ink-3"}`} style={{ fontSize: 10, letterSpacing: "0.14em" }}>
                {relativeDue(b.due)}
              </span>
              <span className="font-mono text-[13px] text-ink tabular-nums w-20 text-right">${b.amount.toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      {/* §03 — In motion / Goals */}
      <SectionHead num="03" title="In motion" meta="savings · 3 active" action={<Link href="/goals" className="btn-ghost btn">All goals →</Link>} />
      <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {goals.map(g => {
          const pct = Math.round((g.saved / g.target) * 100);
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

      {/* §04 — Today, in life */}
      <SectionHead num="04" title="Today, in life" meta="journal · wins · sports" />
      <div className="grid gap-10" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <article className="bg-warm-surface border border-rule-soft p-7">
          <div className="flex items-baseline gap-3 mb-2">
            <LabelMono>Journal · {lastJournal.date}</LabelMono>
            <span className="font-mono text-[var(--accent)]" style={{ fontSize: 10.5, letterSpacing: "0.14em" }}>● ● ● ● ○</span>
          </div>
          <h4 className="font-serif text-[26px] text-ink leading-tight">{lastJournal.title}</h4>
          <p className="font-serif text-[15px] text-ink-2 leading-[1.6] mt-2 whitespace-pre-line">{lastJournal.body}</p>
          <Link href="/journal" className="btn-ghost btn mt-4">Continue writing →</Link>
        </article>
        <div className="space-y-7">
          <div>
            <LabelMono>Latest win · pinned</LabelMono>
            <h4 className="font-serif italic text-[20px] text-ink mt-1.5">{pinnedWin.title}</h4>
            <p className="font-serif text-[14px] text-ink-2 leading-[1.55] mt-1.5">{pinnedWin.body}</p>
            <div className="flex gap-1.5 mt-2">{pinnedWin.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
          </div>
          <div className="border-t border-rule-soft pt-5">
            <LabelMono>This week · sports</LabelMono>
            <ul className="mt-2 divide-y divide-rule-soft">
              {sportsLog.slice(0, 3).map(s => (
                <li key={s.id} className="flex items-baseline gap-3 py-2">
                  <span className="font-mono uppercase text-ink-4 w-16" style={{ fontSize: 9.5, letterSpacing: "0.14em" }}>{s.date}</span>
                  <span className="font-serif text-[14px] text-ink flex-1">{s.name}</span>
                  <span className="font-mono text-[11.5px] text-ink-3 tabular-nums">{s.metric}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer className="mt-16 pt-4 border-t border-rule flex items-baseline justify-between font-mono uppercase text-ink-3" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
        <span>LifeOS · A personal almanac</span>
        <span>Page 01 of 09</span>
      </footer>
    </div>
  );
}
