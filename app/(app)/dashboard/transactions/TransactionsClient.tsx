"use client";

import { useState, useMemo } from "react";
import { LabelMono, Tag, Money } from "@/components/ui";
import type { Transaction, Category, Account } from "@/lib/queries";
import { fmtDate, clsx } from "@/lib/utils";

const FILTERS: ("All" | Category)[] = ["All", "Groceries", "Dining", "Transport", "Subscriptions", "Bills", "Income"];
const CATEGORIES: Category[] = ["Groceries", "Dining", "Transport", "Subscriptions", "Income", "Health", "Shopping", "Bills", "Entertainment", "Other"];

const INPUT = "w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)] placeholder:text-ink-4";

export default function TransactionsClient({ initialTransactions, accounts }: { initialTransactions: Transaction[]; accounts: Account[] }) {
  const defaultAccount = accounts.find(a => a.type === "Checking") ?? accounts[0] ?? null;

  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [accountBalances, setAccountBalances] = useState<Record<string, number>>(
    Object.fromEntries(accounts.map(a => [a.id, a.balance]))
  );
  const [filter, setFilter]   = useState<"All" | Category>("All");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ date: "", merchant: "", description: "", category: "Groceries" as Category, amount: "", account_id: "" });

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    merchant: "", description: "",
    category: "Groceries" as Category,
    amount: "",
    account_id: defaultAccount?.id ?? "",
  });

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

  function editField(k: keyof typeof editForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setEditForm(f => ({ ...f, [k]: e.target.value }));
  }

  function startEdit(t: Transaction) {
    setEditingId(t.id);
    setEditForm({
      date: t.date,
      merchant: t.merchant,
      description: t.description,
      category: t.category,
      amount: String(Math.abs(t.amount)),
      account_id: t.account_id ?? "",
    });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const isIncome = form.category === "Income";
    const amount   = isIncome ? Math.abs(parseFloat(form.amount) || 0) : -(Math.abs(parseFloat(form.amount) || 0));
    const tx: Transaction = {
      id: `t-${Date.now()}`, user_id: "",
      date: form.date, merchant: form.merchant,
      description: form.description, category: form.category,
      amount, account_id: form.account_id || undefined,
    };
    await fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tx) });
    setTransactions([tx, ...transactions]);
    if (form.account_id) {
      setAccountBalances(b => ({ ...b, [form.account_id]: (b[form.account_id] ?? 0) + amount }));
    }
    setForm(f => ({ ...f, merchant: "", description: "", amount: "" }));
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const tx = transactions.find(t => t.id === id);
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setTransactions(transactions.filter(t => t.id !== id));
    if (tx?.account_id) {
      setAccountBalances(b => ({ ...b, [tx.account_id!]: (b[tx.account_id!] ?? 0) - tx.amount }));
    }
  }

  async function handleUpdate(id: string) {
    const old = transactions.find(t => t.id === id);
    const isIncome = editForm.category === "Income";
    const amount   = isIncome ? Math.abs(parseFloat(editForm.amount) || 0) : -(Math.abs(parseFloat(editForm.amount) || 0));
    const data = { date: editForm.date, merchant: editForm.merchant, description: editForm.description, category: editForm.category, amount, account_id: editForm.account_id || undefined };
    await fetch(`/api/transactions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

    setTransactions(transactions.map(t => t.id === id ? { ...t, ...data } : t));

    // Adjust account balances optimistically
    if (old?.account_id) {
      setAccountBalances(b => ({ ...b, [old.account_id!]: (b[old.account_id!] ?? 0) - old.amount }));
    }
    if (data.account_id) {
      setAccountBalances(b => ({ ...b, [data.account_id!]: (b[data.account_id!] ?? 0) + amount }));
    }
    setEditingId(null);
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

      {accounts.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {accounts.map(a => (
            <div key={a.id} className="flex items-baseline gap-2 border border-rule-soft px-3 py-1.5">
              <span className="label-mono">{a.name}</span>
              <span className="font-mono text-[13px] tabular-nums text-ink">
                ${(accountBalances[a.id] ?? a.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="hairline-strong mt-5" />

      {showForm && (
        <form onSubmit={handleAdd} className="border border-rule-soft p-7 mt-5 grid gap-5" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr auto" }}>
          <div>
            <label className="label-mono block mb-2">Date</label>
            <input type="date" value={form.date} onChange={field("date")} className={INPUT} />
          </div>
          <div>
            <label className="label-mono block mb-2">Merchant</label>
            <input value={form.merchant} onChange={field("merchant")} placeholder="e.g. Whole Foods" required className={INPUT} />
          </div>
          <div>
            <label className="label-mono block mb-2">Description</label>
            <input value={form.description} onChange={field("description")} placeholder="Optional note" className={INPUT} />
          </div>
          <div>
            <label className="label-mono block mb-2">Category</label>
            <select value={form.category} onChange={field("category")} className={INPUT}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-mono block mb-2">Amount ($)</label>
            <input type="number" min="0" step="0.01" value={form.amount} onChange={field("amount")} placeholder="0.00" required className={INPUT} />
          </div>
          <div>
            <label className="label-mono block mb-2">Account</label>
            <select value={form.account_id} onChange={field("account_id")} className={INPUT}>
              <option value="">— none —</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
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
                {items.map(t => {
                  const acct = accounts.find(a => a.id === t.account_id);
                  if (editingId === t.id) {
                    return (
                      <div key={t.id} className="border border-rule py-4 px-3 my-1 grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr auto" }}>
                        <input type="date" value={editForm.date} onChange={editField("date")} className={INPUT} />
                        <input value={editForm.merchant} onChange={editField("merchant")} placeholder="Merchant" className={INPUT} />
                        <input value={editForm.description} onChange={editField("description")} placeholder="Description" className={INPUT} />
                        <select value={editForm.category} onChange={editField("category")} className={INPUT}>
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <input type="number" min="0" step="0.01" value={editForm.amount} onChange={editField("amount")} placeholder="0.00" className={INPUT} />
                        <select value={editForm.account_id} onChange={editField("account_id")} className={INPUT}>
                          <option value="">— none —</option>
                          {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleUpdate(t.id)} className="btn-primary btn text-[10px]">Save</button>
                          <button onClick={() => setEditingId(null)} className="btn text-[10px]">Cancel</button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={t.id} className="grid items-baseline gap-5 py-2.5" style={{ gridTemplateColumns: "100px 1fr 1.2fr 90px 110px auto" }}>
                      <Tag>{t.category}</Tag>
                      <span className="font-serif text-[15px] text-ink">{t.merchant}</span>
                      <span className="font-serif text-[14px] text-ink-3 italic">{t.description}</span>
                      <span className="label-mono truncate">{acct?.name ?? ""}</span>
                      <span className="text-right font-mono text-[14px] tabular-nums"><Money value={t.amount} signed /></span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => startEdit(t)} className="btn text-[10px]">Edit</button>
                        <button onClick={() => handleDelete(t.id)} className="btn text-[10px] text-[var(--accent)]">Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
