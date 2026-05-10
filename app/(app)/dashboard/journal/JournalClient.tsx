"use client";

import { useState } from "react";
import { LabelMono, Tag } from "@/components/ui";
import type { JournalEntry } from "@/lib/queries";
import { fmtDate, clsx } from "@/lib/utils";

const MOODS = ["·", "○", "◐", "●", "★"];
const MOOD_LABEL = ["Hard", "Low", "Okay", "Good", "Great"];

export default function JournalClient({ initialEntries, userId }: { initialEntries: JournalEntry[]; userId: string }) {
  const [entries, setEntries]   = useState<JournalEntry[]>(initialEntries as JournalEntry[]);
  const [selectedId, setSelectedId] = useState<string | null>(entries[0]?.id ?? null);
  const [draft, setDraft]       = useState(entries[0]?.body ?? "");
  const [mood, setMood]         = useState<number>(entries[0]?.mood ?? 3);
  const [saving, setSaving]     = useState(false);

  const entry = entries.find(e => e.id === selectedId);

  function selectEntry(e: JournalEntry) {
    setSelectedId(e.id);
    setDraft(e.body);
    setMood(e.mood);
  }

  async function newEntry() {
    const today = new Date().toISOString().slice(0, 10);
    const id    = `j-${Date.now()}`;
    const blank: JournalEntry = { id, user_id: userId, date: today, mood: 3, title: "Untitled", body: "", tags: [] };
    await fetch("/api/journal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blank) });
    setEntries([blank, ...entries]);
    selectEntry(blank);
  }

  async function save() {
    if (!entry) return;
    setSaving(true);
    const updated: JournalEntry = { ...entry, body: draft, mood: mood as JournalEntry["mood"] };
    await fetch("/api/journal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    setEntries(entries.map(e => e.id === updated.id ? updated : e));
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/journal/${id}`, { method: "DELETE" });
    const remaining = entries.filter(e => e.id !== id);
    setEntries(remaining);
    if (selectedId === id) {
      const next = remaining[0] ?? null;
      setSelectedId(next?.id ?? null);
      setDraft(next?.body ?? "");
      setMood(next?.mood ?? 3);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-60px)]" style={{ gridTemplateColumns: "260px 1fr", background: "oklch(0.955 0.022 75)" }}>
      <aside className="border-r border-rule-soft px-6 py-7 overflow-y-auto">
        <LabelMono>The journal · {new Date().getFullYear()}</LabelMono>
        <div className="font-serif italic text-[26px] text-ink mt-1.5 leading-tight">
          {new Date().toLocaleDateString("en-US", { month: "long" })}
        </div>
        <button onClick={newEntry} className="btn mt-4 w-full justify-center">+ New entry</button>
        {entries.length === 0 ? (
          <p className="font-serif italic text-[14px] text-ink-3 mt-6">No entries yet. Start writing.</p>
        ) : (
          <div className="mt-6 divide-y divide-rule-soft">
            {entries.map(e => (
              <div key={e.id} className="py-3">
                <button onClick={() => selectEntry(e)}
                  className={clsx("w-full text-left transition-colors", e.id === selectedId ? "" : "opacity-65 hover:opacity-100")}>
                  <div className="flex items-baseline justify-between">
                    <span className="label-mono">{fmtDate(e.date)}</span>
                    <span className="font-mono text-[13px]" style={{ color: "var(--accent)" }}>{MOODS[e.mood - 1]}</span>
                  </div>
                  <div className="font-serif text-[15px] text-ink leading-snug mt-1 line-clamp-2">{e.title || "Untitled"}</div>
                </button>
                <div className="flex justify-end mt-1">
                  <button onClick={() => handleDelete(e.id)} className="btn text-[10px] text-[var(--accent)]">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      <article className="px-16 py-12 max-w-[760px] w-full">
        {!entry ? (
          <p className="font-serif italic text-[18px] text-ink-3 mt-8">Select an entry or create a new one.</p>
        ) : (
          <>
            <LabelMono>{fmtDate(entry.date)} · {new Date(entry.date + "T00:00").toLocaleDateString("en-US", { weekday: "long" })}</LabelMono>
            <h1 className="font-serif text-[42px] leading-[1.1] tracking-tight text-ink mt-2 italic">{entry.title || "Untitled"}</h1>

            <div className="flex items-baseline gap-3 mt-5">
              <span className="label-mono">Mood</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setMood(n)}
                    className={clsx("w-9 h-9 font-serif text-[18px] border", mood === n ? "text-[var(--accent-fg)] border-transparent" : "text-ink-3 border-rule-soft hover:border-rule")}
                    style={mood === n ? { background: "var(--accent)" } : {}}>
                    {MOODS[n - 1]}
                  </button>
                ))}
              </div>
              <span className="label-mono">{MOOD_LABEL[mood - 1]}</span>
            </div>

            <div className="hairline mt-6 mb-6" />

            <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={16}
              className="w-full bg-transparent outline-none resize-none font-serif text-[18px] leading-[1.7] text-ink-2 placeholder:text-ink-4"
              style={{ backgroundImage: "linear-gradient(transparent calc(1.7em - 1px), oklch(0.85 0.022 75) 1px)", backgroundSize: "100% 1.7em", lineHeight: "1.7em" }}
              placeholder="Write the day…" />

            <div className="flex items-center gap-3 mt-4">
              <div className="flex gap-1.5">{entry.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
              <button onClick={save} disabled={saving} className="btn ml-auto disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
