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

export default function AccountsClient({ initialAccounts }: { initialAccounts: Account[] }) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState("");
  const [form, setForm] = useState({ name: "", type: "Checking" as Account["type"], balance: "", note: "" });

  const assets      = accounts.filter(a => a.type !== "Credit").reduce((s, a) => s + a.balance, 0);
  const liabilities = accounts.filter(a => a.type === "Credit").reduce((s, a) => s + a.balance, 0);
  const netWorth    = assets - liabilities;

  function field(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const account: Account = {
      id: `ac-${Date.now()}`, user_id: "",
      name: form.name, type: form.type,
      balance: parseFloat(form.balance) || 0,
      note: form.note,
    };
    await fetch("/api/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(account) });
    setAccounts([...accounts, account]);
    setForm({ name: "", type: "Checking", balance: "", note: "" });
    setShowForm(false);
    setSaving(false);
  }

  async function handleUpdateBalance(id: string) {
    const balance = parseFloat(editBalance);
    if (isNaN(balance)) { setEditingId(null); return; }
    await fetch("/api/accounts/balance", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, balance }) });
    setAccounts(accounts.map(a => a.id === id ? { ...a, balance } : a));
    setEditingId(null);
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
            <div className="font-mono text-[26px] tabular-nums mt-1" style={{ color: netWorth >= 0 ? "var(--accent)" : "var(--neg, oklch(0.50 0.18 15))" }}>
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
        <form onSubmit={handleAdd} className="border border-rule-soft p-7 mt-6 grid gap-5" style={{ gridTemplateColumns: "2fr 1fr 1fr 2fr auto" }}>
          <div>
            <label className="label-mono block mb-2">Account name</label>
            <input value={form.name} onChange={field("name")} placeholder="e.g. Chase Checking" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Type</label>
            <select value={form.type} onChange={field("type")}
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)]">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label-mono block mb-2">Balance ($)</label>
            <input type="number" step="0.01" value={form.balance} onChange={field("balance")} placeholder="0.00" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Note</label>
            <input value={form.note} onChange={field("note")} placeholder="Optional note"
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
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
            {accounts.map(a => (
              <div key={a.id} className="grid items-center gap-5 py-4" style={{ gridTemplateColumns: "80px 1fr 120px 1fr auto" }}>
                <Tag>{a.type}</Tag>
                <div>
                  <div className="font-serif text-[17px] text-ink">{a.name}</div>
                  {a.note && <div className="label-mono mt-0.5">{a.note}</div>}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: TYPE_COLOR[a.type] }}>
                  {a.type === "Credit" ? "liability" : "asset"}
                </span>

                {editingId === a.id ? (
                  <div className="flex items-baseline gap-2">
                    <input
                      type="number" step="0.01" autoFocus
                      defaultValue={a.balance}
                      onChange={e => setEditBalance(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleUpdateBalance(a.id); if (e.key === "Escape") setEditingId(null); }}
                      className="w-32 bg-transparent border-b border-[var(--accent)] font-mono text-sm text-ink py-1 outline-none tabular-nums"
                    />
                    <button onClick={() => handleUpdateBalance(a.id)} className="btn-primary btn text-[10px]">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn text-[10px]">Cancel</button>
                  </div>
                ) : (
                  <span className="font-mono text-[18px] tabular-nums text-ink">
                    {a.balance < 0 ? "−" : ""}${Math.abs(a.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}

                {editingId !== a.id && (
                  <button onClick={() => { setEditingId(a.id); setEditBalance(String(a.balance)); }} className="btn text-[10px]">
                    Edit balance
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
