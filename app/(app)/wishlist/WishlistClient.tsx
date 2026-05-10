"use client";

import { useState } from "react";
import { LabelMono, Tag } from "@/components/ui";
import type { WishlistItem } from "@/lib/queries";
import { fmtUsd0 } from "@/lib/utils";

const PRIORITIES = ["high", "med", "low"] as const;

export default function WishlistClient({ initialItems }: { initialItems: WishlistItem[] }) {
  const [items, setItems]     = useState<WishlistItem[]>(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ name: "", price: "", priority: "med" as WishlistItem["priority"], note: "" });

  const total   = items.reduce((s, w) => s + w.price, 0);
  const ordered = [...items].sort((a, b) => ({ high: 0, med: 1, low: 2 }[a.priority] - { high: 0, med: 1, low: 2 }[b.priority]));

  function field(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const item: WishlistItem = {
      id: `w-${Date.now()}`, user_id: "",
      name: form.name, price: parseFloat(form.price) || 0,
      priority: form.priority, note: form.note,
    };
    await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    setItems([item, ...items]);
    setForm({ name: "", price: "", priority: "med", note: "" });
    setShowForm(false);
    setSaving(false);
  }

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Finance · Wishlist</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            Things I'm <em className="text-[var(--accent)]">considering</em>
          </h1>
        </div>
        <div className="ml-auto self-end flex items-baseline gap-5">
          <div className="text-right">
            <LabelMono>If bought today</LabelMono>
            <div className="font-mono text-[26px] text-ink tabular-nums mt-1">${fmtUsd0(total)}</div>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="btn">
            {showForm ? "Cancel" : "+ Add item"}
          </button>
        </div>
      </header>
      <div className="hairline-strong mt-6 mb-2" />

      {showForm && (
        <form onSubmit={handleAdd} className="border border-rule-soft p-7 mt-4 mb-2 grid gap-5" style={{ gridTemplateColumns: "2fr 1fr 1fr 2fr auto" }}>
          <div>
            <label className="label-mono block mb-2">Item name</label>
            <input value={form.name} onChange={field("name")} placeholder="e.g. Sony WH-1000XM6" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Price ($)</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={field("price")} placeholder="0" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Priority</label>
            <select value={form.priority} onChange={field("priority")}
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)]">
              {PRIORITIES.map(p => <option key={p} value={p}>{p === "high" ? "Soon" : p === "med" ? "Maybe" : "Later"}</option>)}
            </select>
          </div>
          <div>
            <label className="label-mono block mb-2">Note</label>
            <input value={form.note} onChange={field("note")} placeholder="Why do you want this?"
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div className="self-end">
            <button type="submit" disabled={saving} className="btn-primary btn disabled:opacity-50">
              {saving ? "Saving…" : "Add"}
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-8">
          <p className="font-serif italic text-[17px] text-ink-3">Nothing on the wishlist yet.</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-rule-soft">
            {ordered.map(w => (
              <div key={w.id} className="grid items-baseline gap-5 py-4" style={{ gridTemplateColumns: "70px 1fr 100px 110px" }}>
                <Tag>{w.priority === "high" ? "Soon" : w.priority === "med" ? "Maybe" : "Later"}</Tag>
                <div>
                  <div className="font-serif text-[18px] text-ink">{w.name}</div>
                  {w.note && <div className="font-serif italic text-[14px] text-ink-3 mt-0.5">{w.note}</div>}
                </div>
                <span className="label-mono">{w.priority === "high" ? "Wanted" : "Saved"}</span>
                <span className="font-mono text-[15px] text-ink tabular-nums text-right">${fmtUsd0(w.price)}</span>
              </div>
            ))}
          </div>
          <p className="font-serif italic text-[14px] text-ink-3 mt-8 max-w-md">
            Items sit here for at least 30 days before I'll buy them. Most don't make it.
          </p>
        </>
      )}
    </div>
  );
}
