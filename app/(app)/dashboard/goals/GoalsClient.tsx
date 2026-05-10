"use client";

import { useState } from "react";
import { LabelMono, SectionHead, Bar } from "@/components/ui";
import type { Goal } from "@/lib/queries";
import { fmtUsd0 } from "@/lib/utils";

export default function GoalsClient({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals]     = useState<Goal[]>(initialGoals);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ name: "", target: "", saved: "", monthly: "" });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm]   = useState({ name: "", target: "", saved: "", monthly: "" });

  const totalSaved  = goals.reduce((s, g) => s + g.saved,  0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  function field(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  }

  function editField(k: keyof typeof editForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setEditForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const goal: Goal = {
      id: `g-${Date.now()}`, user_id: "",
      name: form.name,
      target:  parseFloat(form.target)  || 0,
      saved:   parseFloat(form.saved)   || 0,
      monthly: parseFloat(form.monthly) || 0,
    };
    await fetch("/api/goals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(goal) });
    setGoals([...goals, goal]);
    setForm({ name: "", target: "", saved: "", monthly: "" });
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
    setGoals(goals.filter(g => g.id !== id));
  }

  async function handleUpdate(id: string) {
    const updated = {
      name: editForm.name,
      target:  parseFloat(editForm.target)  || 0,
      saved:   parseFloat(editForm.saved)   || 0,
      monthly: parseFloat(editForm.monthly) || 0,
    };
    await fetch(`/api/goals/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    setGoals(goals.map(g => g.id === id ? { ...g, ...updated } : g));
    setEditingId(null);
  }

  function startEdit(g: Goal) {
    setEditingId(g.id);
    setEditForm({ name: g.name, target: String(g.target), saved: String(g.saved), monthly: String(g.monthly) });
  }

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Finance · Savings</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            What I'm <em className="text-[var(--accent)]">saving</em> for
          </h1>
        </div>
        <div className="ml-auto self-end flex items-baseline gap-5">
          <div className="text-right">
            <LabelMono>Total saved</LabelMono>
            <div className="font-mono text-[26px] text-ink tabular-nums mt-1">${fmtUsd0(totalSaved)}</div>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="btn">
            {showForm ? "Cancel" : "+ Add goal"}
          </button>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      {showForm && (
        <form onSubmit={handleAdd} className="border border-rule-soft p-7 mt-6 grid gap-5" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr auto" }}>
          <div>
            <label className="label-mono block mb-2">Goal name</label>
            <input value={form.name} onChange={field("name")} placeholder="e.g. Emergency fund" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Target ($)</label>
            <input type="number" min="0" step="0.01" value={form.target} onChange={field("target")} placeholder="10000" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Already saved ($)</label>
            <input type="number" min="0" step="0.01" value={form.saved} onChange={field("saved")} placeholder="0"
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Monthly ($)</label>
            <input type="number" min="0" step="0.01" value={form.monthly} onChange={field("monthly")} placeholder="500"
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div className="self-end">
            <button type="submit" disabled={saving} className="btn-primary btn disabled:opacity-50">
              {saving ? "Saving…" : "Add"}
            </button>
          </div>
        </form>
      )}

      {goals.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-8">
          <p className="font-serif italic text-[17px] text-ink-3">No savings goals yet. Hit "+ Add goal" to get started.</p>
        </div>
      ) : (
        <>
          <SectionHead num="01" title="In motion" meta={`${goals.length} active goals`} />
          <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {goals.map(g => {
              const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
              const monthsLeft = g.monthly > 0 ? Math.ceil((g.target - g.saved) / g.monthly) : null;
              return editingId === g.id ? (
                <div key={g.id} className="border border-rule py-4 px-3 grid gap-3">
                  <input value={editForm.name} onChange={editField("name")} placeholder="Goal name"
                    className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                  <input type="number" value={editForm.target} onChange={editField("target")} placeholder="Target ($)"
                    className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                  <input type="number" value={editForm.saved} onChange={editField("saved")} placeholder="Saved ($)"
                    className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                  <input type="number" value={editForm.monthly} onChange={editField("monthly")} placeholder="Monthly ($)"
                    className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleUpdate(g.id)} className="btn-primary btn text-[10px]">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn text-[10px]">Cancel</button>
                  </div>
                </div>
              ) : (
                <div key={g.id} className="border-l border-rule-strong pl-5">
                  <LabelMono>{pct}% complete</LabelMono>
                  <h3 className="font-serif italic text-[24px] text-ink mt-1.5">{g.name}</h3>
                  <div className="font-mono text-[13px] text-ink-2 tabular-nums mt-1">
                    ${fmtUsd0(g.saved)} <span className="text-ink-4">of</span> ${fmtUsd0(g.target)}
                  </div>
                  <Bar value={g.saved} max={g.target} className="mt-3" />
                  <div className="flex justify-between mt-2 label-mono">
                    {g.monthly > 0 && <span>${g.monthly}/mo</span>}
                    {monthsLeft != null && <span>~{monthsLeft} months</span>}
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto mt-2">
                    <button onClick={() => startEdit(g)} className="btn text-[10px]">Edit</button>
                    <button onClick={() => handleDelete(g.id)} className="btn text-[10px] text-[var(--accent)]">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>

          <SectionHead num="02" title="Overall progress" meta="across all goals" />
          <Bar value={totalSaved} max={totalTarget} className="max-w-lg" />
          <div className="flex items-baseline justify-between max-w-lg mt-2 font-mono text-[12px] text-ink-3 tabular-nums">
            <span>${fmtUsd0(totalSaved)} saved</span>
            <span>${fmtUsd0(totalTarget)} target</span>
          </div>
        </>
      )}
    </div>
  );
}
