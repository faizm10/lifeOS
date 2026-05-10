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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm]   = useState({ name: "", price: "", priority: "med" as WishlistItem["priority"], note: "" });

  const total   = items.reduce((s, w) => s + w.price, 0);
  const ordered = [...items].sort((a, b) => ({ high: 0, med: 1, low: 2 }[a.priority] - { high: 0, med: 1, low: 2 }[b.priority]));

  function field(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  function editField(k: keyof typeof editForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setEditForm(f => ({ ...f, [k]: e.target.value }));
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

  async function handleDelete(id: string) {
    await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
    setItems(items.filter(w => w.id !== id));
  }

  async function handleUpdate(id: string) {
    const updated = {
      name: editForm.name,
      price: parseFloat(editForm.price) || 0,
      priority: editForm.priority,
      note: editForm.note,
    };
    await fetch(`/api/wishlist/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    setItems(items.map(w => w.id === id ? { ...w, ...updated } : w));
    setEditingId(null);
  }

  function startEdit(w: WishlistItem) {
    setEditingId(w.id);
    setEditForm({ name: w.name, price: String(w.price), priority: w.priority, note: w.note ?? "" });
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
              editingId === w.id ? (
                <div key={w.id} className="border border-rule py-4 px-3 grid gap-3 my-1">
                  <div className="grid gap-3" style={{ gridTemplateColumns: "2fr 1fr 1fr 2fr" }}>
                    <input value={editForm.name} onChange={editField("name")} placeholder="Item name"
                      className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                    <input type="number" value={editForm.price} onChange={editField("price")} placeholder="Price"
                      className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                    <select value={editForm.priority} onChange={editField("priority")}
                      className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]">
                      {PRIORITIES.map(p => <option key={p} value={p}>{p === "high" ? "Soon" : p === "med" ? "Maybe" : "Later"}</option>)}
                    </select>
                    <input value={editForm.note} onChange={editField("note")} placeholder="Note"
                      className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleUpdate(w.id)} className="btn-primary btn text-[10px]">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn text-[10px]">Cancel</button>
                  </div>
                </div>
              ) : (
                <div key={w.id} className="grid items-baseline gap-5 py-4" style={{ gridTemplateColumns: "70px 1fr 100px 110px auto" }}>
                  <Tag>{w.priority === "high" ? "Soon" : w.priority === "med" ? "Maybe" : "Later"}</Tag>
                  <div>
                    <div className="font-serif text-[18px] text-ink">{w.name}</div>
                    {w.note && <div className="font-serif italic text-[14px] text-ink-3 mt-0.5">{w.note}</div>}
                  </div>
                  <span className="label-mono">{w.priority === "high" ? "Wanted" : "Saved"}</span>
                  <span className="font-mono text-[15px] text-ink tabular-nums text-right">${fmtUsd0(w.price)}</span>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button onClick={() => startEdit(w)} className="btn text-[10px]">Edit</button>
                    <button onClick={() => handleDelete(w.id)} className="btn text-[10px] text-[var(--accent)]">Delete</button>
                  </div>
                </div>
              )
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
