"use client";

import { useState } from "react";
import { LabelMono, Tag } from "@/components/ui";
import type { Account } from "@/lib/queries";

const TYPES = ["Checking", "Savings", "Investment", "Cash", "Credit"] as const;

const TYPE_COLOR: Record<Account["type"], string> = {
  Checking:   "oklch(0.50 0.12 230)",
  Savings:    "oklch(0.50 0.14 160)",
  Investment: "oklch(0.46 0.16 28)",
  Cash:       "oklch(0.52 0.10 90)",
  Credit:     "oklch(0.50 0.14 10)",
};

const INPUT = "w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4";

export default function AccountsClient({ initialAccounts }: { initialAccounts: Account[] }) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", type: "Checking" as Account["type"], balance: "", credit_limit: "", note: "" });
  const [form, setForm] = useState({ name: "", type: "Checking" as Account["type"], balance: "", credit_limit: "", note: "" });

  const assets      = accounts.filter(a => a.type !== "Credit").reduce((s, a) => s + a.balance, 0);
  const liabilities = accounts.filter(a => a.type === "Credit").reduce((s, a) => s + a.balance, 0);
  const netWorth    = assets - liabilities;

  function field(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }
  function ef(k: keyof typeof editForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setEditForm(f => ({ ...f, [k]: e.target.value }));
  }

  function startEdit(a: Account) {
    setEditingId(a.id);
    setEditForm({ name: a.name, type: a.type, balance: String(a.balance), credit_limit: a.credit_limit ? String(a.credit_limit) : "", note: a.note });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const account: Account = {
      id: `ac-${Date.now()}`, user_id: "",
      name: form.name, type: form.type,
      balance: parseFloat(form.balance) || 0,
      credit_limit: form.type === "Credit" && form.credit_limit ? parseFloat(form.credit_limit) : null,
      note: form.note,
    };
    await fetch("/api/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(account) });
    setAccounts([...accounts, account]);
    setForm({ name: "", type: "Checking", balance: "", credit_limit: "", note: "" });
    setShowForm(false);
    setSaving(false);
  }

  async function handleUpdate(id: string) {
    const data = {
      name: editForm.name,
      type: editForm.type,
      balance: parseFloat(editForm.balance) || 0,
      credit_limit: editForm.type === "Credit" && editForm.credit_limit ? parseFloat(editForm.credit_limit) : null,
      note: editForm.note,
    };
    await fetch(`/api/accounts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setAccounts(accounts.map(a => a.id === id ? { ...a, ...data } : a));
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    setAccounts(accounts.filter(a => a.id !== id));
  }

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Finance · Accounts</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            Where the <em className="text-[var(--accent)]">money lives</em>
          </h1>
        </div>
        <div className="ml-auto self-end flex items-baseline gap-5">
          <div className="text-right">
            <LabelMono>Net worth</LabelMono>
            <div className="font-mono text-[26px] tabular-nums mt-1" style={{ color: netWorth >= 0 ? "var(--accent)" : "oklch(0.50 0.18 15)" }}>
              {netWorth >= 0 ? "" : "−"}${Math.abs(netWorth).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="btn">
            {showForm ? "Cancel" : "+ Add account"}
          </button>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      {showForm && (
        <form onSubmit={handleAdd} className="border border-rule-soft p-7 mt-6 grid gap-5"
          style={{ gridTemplateColumns: form.type === "Credit" ? "2fr 1fr 1fr 1fr 2fr auto" : "2fr 1fr 1fr 2fr auto" }}>
          <div>
            <label className="label-mono block mb-2">Account name</label>
            <input value={form.name} onChange={field("name")} placeholder="e.g. Chase Sapphire" required className={INPUT} />
          </div>
          <div>
            <label className="label-mono block mb-2">Type</label>
            <select value={form.type} onChange={field("type")} className={INPUT}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label-mono block mb-2">{form.type === "Credit" ? "Current balance owed ($)" : "Balance ($)"}</label>
            <input type="number" step="0.01" min="0" value={form.balance} onChange={field("balance")} placeholder="0.00" required className={INPUT} />
          </div>
          {form.type === "Credit" && (
            <div>
              <label className="label-mono block mb-2">Credit limit ($)</label>
              <input type="number" step="0.01" min="0" value={form.credit_limit} onChange={field("credit_limit")} placeholder="e.g. 5000.00" className={INPUT} />
            </div>
          )}
          <div>
            <label className="label-mono block mb-2">Note</label>
            <input value={form.note} onChange={field("note")} placeholder="Optional note" className={INPUT} />
          </div>
          <div className="self-end">
            <button type="submit" disabled={saving} className="btn-primary btn disabled:opacity-50">
              {saving ? "Saving…" : "Add"}
            </button>
          </div>
        </form>
      )}

      {accounts.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-8">
          <p className="font-serif italic text-[17px] text-ink-3">No accounts added yet.</p>
        </div>
      ) : (
        <>
          {/* Summary strip */}
          <div className="grid grid-cols-3 gap-px bg-rule-soft border border-rule-soft mt-8">
            {[
              { label: "Total assets",      value: assets,      pos: true },
              { label: "Total liabilities", value: liabilities, pos: false },
              { label: "Net worth",         value: netWorth,    pos: netWorth >= 0 },
            ].map(s => (
              <div key={s.label} className="bg-paper px-6 py-4">
                <LabelMono>{s.label}</LabelMono>
                <div className="font-mono text-[20px] tabular-nums mt-1.5" style={{ color: s.pos ? "var(--accent)" : "oklch(0.50 0.18 15)" }}>
                  {s.value < 0 ? "−" : ""}${Math.abs(s.value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>

          {/* Account rows */}
          <div className="divide-y divide-rule-soft border-b border-rule-soft mt-8">
            {accounts.map(a => {
              if (editingId === a.id) {
                return (
                  <div key={a.id} className="border border-rule py-4 px-3 my-1 grid gap-3"
                    style={{ gridTemplateColumns: editForm.type === "Credit" ? "2fr 1fr 1fr 1fr 2fr auto" : "2fr 1fr 1fr 2fr auto" }}>
                    <input value={editForm.name} onChange={ef("name")} placeholder="Account name"
                      className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                    <select value={editForm.type} onChange={ef("type")}
                      className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]">
                      {TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <input type="number" step="0.01" value={editForm.balance} onChange={ef("balance")} placeholder="Balance"
                      className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                    {editForm.type === "Credit" && (
                      <input type="number" step="0.01" value={editForm.credit_limit} onChange={ef("credit_limit")} placeholder="Credit limit"
                        className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                    )}
                    <input value={editForm.note} onChange={ef("note")} placeholder="Note"
                      className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleUpdate(a.id)} className="btn-primary btn text-[10px]">Save</button>
                      <button onClick={() => setEditingId(null)} className="btn text-[10px]">Cancel</button>
                    </div>
                  </div>
                );
              }

              const util = a.type === "Credit" && a.credit_limit ? a.balance / a.credit_limit : null;
              const available = a.type === "Credit" && a.credit_limit ? a.credit_limit - a.balance : null;

              return (
                <div key={a.id} className="py-4">
                  <div className="grid items-center gap-5" style={{ gridTemplateColumns: "80px 1fr 120px 1fr auto" }}>
                    <Tag>{a.type}</Tag>
                    <div>
                      <div className="font-serif text-[17px] text-ink">{a.name}</div>
                      {a.note && <div className="label-mono mt-0.5">{a.note}</div>}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: TYPE_COLOR[a.type] }}>
                      {a.type === "Credit" ? "liability" : "asset"}
                    </span>
                    <div>
                      <span className="font-mono text-[18px] tabular-nums text-ink">
                        {a.balance < 0 ? "−" : ""}${Math.abs(a.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {a.credit_limit && (
                        <span className="label-mono ml-3">of ${a.credit_limit.toLocaleString("en-US", { minimumFractionDigits: 0 })} limit</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => startEdit(a)} className="btn text-[10px]">Edit</button>
                      <button onClick={() => handleDelete(a.id)} className="btn text-[10px] text-[var(--accent)]">Delete</button>
                    </div>
                  </div>

                  {/* Credit utilization bar */}
                  {util !== null && a.credit_limit && (
                    <div className="mt-2.5 ml-[calc(80px+1.25rem)]">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="label-mono">{Math.round(util * 100)}% utilized</span>
                        <span className="label-mono">${available!.toLocaleString("en-US", { minimumFractionDigits: 2 })} available</span>
                      </div>
                      <div className="h-1 bg-rule-soft w-full max-w-xs">
                        <div className="h-full transition-all" style={{
                          width: `${Math.min(util * 100, 100)}%`,
                          background: util > 0.8 ? "oklch(0.50 0.18 15)" : util > 0.5 ? "oklch(0.65 0.16 75)" : "var(--accent)"
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
