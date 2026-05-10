"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LabelMono, Tag, Money } from "@/components/ui";
import type { Transaction, Category } from "@/lib/queries";
import { fmtDate, clsx } from "@/lib/utils";

const FILTERS: ("All" | Category)[] = ["All", "Groceries", "Dining", "Transport", "Subscriptions", "Bills", "Income"];
const CATEGORIES: Category[] = ["Groceries", "Dining", "Transport", "Subscriptions", "Income", "Health", "Shopping", "Bills", "Entertainment", "Other"];

export default function TransactionsClient({ initialTransactions }: { initialTransactions: Transaction[] }) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filter, setFilter]   = useState<"All" | Category>("All");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ date: new Date().toISOString().slice(0, 10), merchant: "", description: "", category: "Groceries" as Category, amount: "" });

  const rows = useMemo(
    () => filter === "All" ? transactions : transactions.filter(t => t.category === filter),
    [filter, transactions]
  );
  const income  = rows.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = rows.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const byDate  = useMemo(() => {
    const m = new Map<string, Transaction[]>();
    rows.forEach(r => { if (!m.has(r.date)) m.set(r.date, []); m.get(r.date)!.push(r); });
    return Array.from(m.entries());
  }, [rows]);

  function field(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const isIncome = form.category === "Income";
    const tx: Transaction = {
      id: `t-${Date.now()}`, user_id: "",
      date: form.date, merchant: form.merchant,
      description: form.description, category: form.category,
      amount: isIncome ? Math.abs(parseFloat(form.amount) || 0) : -(Math.abs(parseFloat(form.amount) || 0)),
    };
    await fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tx) });
    setTransactions([tx, ...transactions]);
    setForm({ date: new Date().toISOString().slice(0, 10), merchant: "", description: "", category: "Groceries", amount: "" });
    setShowForm(false);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Finance · Ledger</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            The <em className="text-[var(--accent)]">ledger</em>
          </h1>
        </div>
        <div className="ml-auto flex items-baseline gap-5 self-end">
          <div className="text-right"><LabelMono>In</LabelMono><div className="font-mono text-[20px] tabular-nums mt-1" style={{ color: "var(--pos)" }}>+${income.toFixed(2)}</div></div>
          <div className="text-right"><LabelMono>Out</LabelMono><div className="font-mono text-[20px] text-ink tabular-nums mt-1">−${Math.abs(expense).toFixed(2)}</div></div>
          <div className="text-right"><LabelMono>Net</LabelMono><div className="font-mono text-[20px] tabular-nums mt-1" style={{ color: "var(--accent)" }}>{(income + expense) >= 0 ? "+" : "−"}${Math.abs(income + expense).toFixed(2)}</div></div>
          <button onClick={() => setShowForm(v => !v)} className="btn self-end">
            {showForm ? "Cancel" : "+ Add"}
          </button>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      {showForm && (
        <form onSubmit={handleAdd} className="border border-rule-soft p-7 mt-5 grid gap-5" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto" }}>
          <div>
            <label className="label-mono block mb-2">Date</label>
            <input type="date" value={form.date} onChange={field("date")}
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="label-mono block mb-2">Merchant</label>
            <input value={form.merchant} onChange={field("merchant")} placeholder="e.g. Whole Foods" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Description</label>
            <input value={form.description} onChange={field("description")} placeholder="Optional note"
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Category</label>
            <select value={form.category} onChange={field("category")}
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)]">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-mono block mb-2">Amount ($)</label>
            <input type="number" min="0" step="0.01" value={form.amount} onChange={field("amount")} placeholder="0.00" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div className="self-end">
            <button type="submit" disabled={saving} className="btn-primary btn disabled:opacity-50">
              {saving ? "Saving…" : "Add"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap mt-5 mb-2">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={clsx("chip", filter === f && "chip-active")}>{f}</button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-6">
          <p className="font-serif italic text-[17px] text-ink-3">No transactions yet.</p>
        </div>
      ) : (
        <div className="mt-6">
          {byDate.map(([date, items]) => (
            <section key={date} className="mb-6">
              <div className="flex items-baseline gap-3 pb-2 border-b border-rule">
                <span className="font-serif italic text-[20px] text-ink">{fmtDate(date)}</span>
                <span className="label-mono">{new Date(date + "T00:00").toLocaleDateString("en-US", { weekday: "long" })}</span>
                <span className="ml-auto label-mono">{items.length} entries</span>
              </div>
              <div className="divide-y divide-rule-soft">
                {items.map(t => (
                  <div key={t.id} className="grid items-baseline gap-5 py-2.5" style={{ gridTemplateColumns: "100px 1fr 1.2fr 110px" }}>
                    <Tag>{t.category}</Tag>
                    <span className="font-serif text-[15px] text-ink">{t.merchant}</span>
                    <span className="font-serif text-[14px] text-ink-3 italic">{t.description}</span>
                    <span className="text-right font-mono text-[14px] tabular-nums"><Money value={t.amount} signed /></span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
