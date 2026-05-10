"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LabelMono, SectionHead } from "@/components/ui";
import type { Bill } from "@/lib/queries";
import { relativeDue } from "@/lib/utils";

export default function BillsClient({ initialBills, userId }: { initialBills: Bill[]; userId: string }) {
  const router = useRouter();
  const [bills, setBills]     = useState<Bill[]>(initialBills);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ name: "", description: "", logo: "", amount: "", due: "", recurring: "monthly" as Bill["recurring"] });

  async function togglePaid(id: string) {
    const bill = bills.find(b => b.id === id)!;
    const next = bill.status === "paid" ? "scheduled" : "paid";
    await fetch("/api/bills/status", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: next }) });
    setBills(bills.map(b => b.id === id ? { ...b, status: next } : b));
  }

  function field(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const bill: Bill = {
      id: `b-${Date.now()}`, user_id: userId,
      name: form.name, description: form.description,
      logo: form.logo || form.name.slice(0, 2).toUpperCase(),
      amount: parseFloat(form.amount) || 0,
      due: form.due, status: "scheduled", recurring: form.recurring,
    };
    await fetch("/api/bills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bill) });
    setBills([...bills, bill].sort((a, b) => a.due.localeCompare(b.due)));
    setForm({ name: "", description: "", logo: "", amount: "", due: "", recurring: "monthly" });
    setShowForm(false);
    setSaving(false);
  }

  const due      = bills.filter(b => b.status === "due" || b.status === "over");
  const scheduled = bills.filter(b => b.status === "scheduled");
  const paid     = bills.filter(b => b.status === "paid");
  const monthly  = bills.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Finance · Recurring</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            What renews <em className="text-[var(--accent)]">on its own</em>
          </h1>
        </div>
        <div className="ml-auto self-end flex items-baseline gap-5">
          <div className="text-right">
            <LabelMono>Monthly load</LabelMono>
            <div className="font-mono text-[26px] text-ink tabular-nums mt-1">${monthly.toFixed(2)}</div>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="btn">
            {showForm ? "Cancel" : "+ Add bill"}
          </button>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      {showForm && (
        <form onSubmit={handleAdd} className="border border-rule-soft p-7 mt-6 grid gap-5" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto" }}>
          <div>
            <label className="label-mono block mb-2">Name</label>
            <input value={form.name} onChange={field("name")} placeholder="e.g. Netflix" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Description</label>
            <input value={form.description} onChange={field("description")} placeholder="Streaming"
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Amount ($)</label>
            <input type="number" min="0" step="0.01" value={form.amount} onChange={field("amount")} placeholder="0.00" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Due date</label>
            <input type="date" value={form.due} onChange={field("due")} required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="label-mono block mb-2">Recurring</label>
            <select value={form.recurring} onChange={field("recurring")}
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)]">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="self-end">
            <button type="submit" disabled={saving} className="btn-primary btn disabled:opacity-50">
              {saving ? "Saving…" : "Add"}
            </button>
          </div>
        </form>
      )}

      {bills.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-8">
          <p className="font-serif italic text-[17px] text-ink-3">No recurring bills added yet.</p>
        </div>
      ) : (
        <>
          <Group title="Due now"         num="01" items={due}       togglePaid={togglePaid} accent />
          <Group title="Scheduled"       num="02" items={scheduled} togglePaid={togglePaid} />
          <Group title="Paid this month" num="03" items={paid}      togglePaid={togglePaid} muted />
        </>
      )}
    </div>
  );
}

function Group({ title, num, items, togglePaid, accent, muted }: {
  title: string; num: string; items: Bill[];
  togglePaid: (id: string) => void; accent?: boolean; muted?: boolean;
}) {
  if (!items.length) return null;
  return (
    <>
      <SectionHead num={num} title={title} meta={`${items.length} bills`} />
      <div className="border-y border-rule-soft divide-y divide-rule-soft">
        {items.map(b => (
          <div key={b.id} className={`grid items-baseline gap-5 py-3.5 ${muted ? "opacity-55" : ""}`}
               style={{ gridTemplateColumns: "auto 1fr auto auto auto" }}>
            <span className="font-mono uppercase text-ink-4 w-9 text-center"
                  style={{ fontSize: 11, letterSpacing: "0.10em", border: "1px solid currentColor", padding: "3px 0" }}>
              {b.logo || b.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <div className="font-serif text-[16px] text-ink">{b.name}</div>
              <div className="label-mono mt-0.5">{b.description} · {b.recurring}</div>
            </div>
            <span className="font-mono uppercase" style={{ fontSize: 10.5, letterSpacing: "0.14em", color: b.status === "over" ? "var(--neg)" : b.status === "due" ? "var(--warn)" : undefined }}>
              {muted ? "Paid" : relativeDue(b.due)}
            </span>
            <span className="font-mono text-[15px] text-ink tabular-nums w-24 text-right">${b.amount.toFixed(2)}</span>
            <button onClick={() => togglePaid(b.id)} className="btn">{b.status === "paid" ? "Undo" : "Mark paid"}</button>
          </div>
        ))}
      </div>
    </>
  );
}
