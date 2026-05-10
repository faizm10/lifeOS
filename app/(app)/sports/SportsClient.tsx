"use client";

import { useState } from "react";
import { LabelMono, SectionHead } from "@/components/ui";
import type { SportsEntry } from "@/lib/queries";

const TYPES = ["Run", "Strength", "Yoga", "Cycling", "Swim", "Other"];

export default function SportsClient({ initialLog }: { initialLog: SportsEntry[] }) {
  const [log, setLog]         = useState<SportsEntry[]>(initialLog);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ type: "Run", name: "", date: new Date().toISOString().slice(0, 10), metric: "" });

  function field(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const entry = { ...form, id: `s-${Date.now()}` };
    await fetch("/api/sports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry) });
    setLog([{ ...entry, user_id: "" } as SportsEntry, ...log]);
    setForm({ type: "Run", name: "", date: new Date().toISOString().slice(0, 10), metric: "" });
    setShowForm(false);
    setSaving(false);
  }

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6">
        <div>
          <LabelMono>Life tracker · Body</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            Sports & <em className="text-[var(--accent)]">fitness</em>
          </h1>
        </div>
        <div className="ml-auto self-end flex items-baseline gap-5">
          <div className="text-right">
            <LabelMono>Sessions logged</LabelMono>
            <div className="font-mono text-[26px] text-ink tabular-nums mt-1">{log.length}</div>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="btn">
            {showForm ? "Cancel" : "+ Log session"}
          </button>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      {/* Inline add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="border border-rule-soft p-7 mt-6 grid gap-5" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr auto" }}>
          <div>
            <label className="label-mono block mb-2">Type</label>
            <select value={form.type} onChange={field("type")}
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)]">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label-mono block mb-2">Name</label>
            <input value={form.name} onChange={field("name")} placeholder="e.g. Easy 10k" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Date</label>
            <input type="date" value={form.date} onChange={field("date")}
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="label-mono block mb-2">Metric</label>
            <input value={form.metric} onChange={field("metric")} placeholder={'e.g. 10.2 km · 52\'18"'}
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div className="self-end">
            <button type="submit" disabled={saving} className="btn-primary btn disabled:opacity-50">
              {saving ? "Saving…" : "Add"}
            </button>
          </div>
        </form>
      )}

      {log.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-6">
          <p className="font-serif italic text-[17px] text-ink-3">No activity logged yet. Hit "+ Log session" to start.</p>
        </div>
      ) : (
        <>
          <SectionHead num="01" title="Recent sessions" meta={`${log.length} entries`} />
          <div className="divide-y divide-rule-soft">
            {log.map(s => (
              <div key={s.id} className="grid items-baseline gap-5 py-3.5" style={{ gridTemplateColumns: "120px 80px 1fr 200px" }}>
                <span className="label-mono">{s.date}</span>
                <span className="font-mono uppercase text-ink-2" style={{ fontSize: 11, letterSpacing: "0.12em" }}>{s.type}</span>
                <span className="font-serif italic text-[18px] text-ink">{s.name}</span>
                <span className="font-mono text-[13px] text-ink-3 tabular-nums text-right">{s.metric}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
