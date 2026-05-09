"use client";

import { useState } from "react";
import { LabelMono, Tag } from "@/components/ui";
import { journalEntries } from "@/lib/data";
import { fmtDate, clsx } from "@/lib/utils";

const MOODS = ["✕", "·", "○", "◐", "●"];
const MOOD_LABEL = ["Hard", "Low", "Okay", "Good", "Great"];

export default function JournalPage() {
  const [selected, setSelected] = useState(journalEntries[0].id);
  const [draft, setDraft] = useState(journalEntries[0].body);
  const [mood, setMood] = useState<number>(journalEntries[0].mood);
  const entry = journalEntries.find(e => e.id === selected)!;

  return (
    <div className="grid min-h-[calc(100vh-60px)]" style={{ gridTemplateColumns: "260px 1fr", background: "oklch(0.955 0.022 75)" }}>
      {/* Entry list */}
      <aside className="border-r border-rule-soft px-6 py-7 overflow-y-auto">
        <LabelMono>The journal · 2026</LabelMono>
        <div className="font-serif italic text-[26px] text-ink mt-1.5 leading-tight">May</div>
        <button className="btn mt-4 w-full justify-center">＋ New entry</button>
        <div className="mt-6 divide-y divide-rule-soft">
          {journalEntries.map(e => (
            <button
              key={e.id}
              onClick={() => { setSelected(e.id); setDraft(e.body); setMood(e.mood); }}
              className={clsx("w-full text-left py-3 transition-colors", e.id === selected ? "" : "opacity-65 hover:opacity-100")}
            >
              <div className="flex items-baseline justify-between">
                <span className="label-mono">{fmtDate(e.date)}</span>
                <span className="font-mono text-[13px]" style={{ color: "var(--accent)" }}>{MOODS[e.mood - 1]}</span>
              </div>
              <div className="font-serif text-[15px] text-ink leading-snug mt-1 line-clamp-2">{e.title}</div>
            </button>
          ))}
        </div>
      </aside>

      {/* Notebook */}
      <article className="px-16 py-12 max-w-[760px] w-full">
        <LabelMono>{fmtDate(entry.date)} · {new Date(entry.date+"T00:00").toLocaleDateString("en-US",{ weekday:"long" })}</LabelMono>
        <h1 className="font-serif text-[42px] leading-[1.1] tracking-tight text-ink mt-2 italic">{entry.title}</h1>

        <div className="flex items-baseline gap-3 mt-5">
          <span className="label-mono">Mood</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setMood(n)}
                className={clsx("w-9 h-9 font-serif text-[18px] border", mood === n ? "text-[var(--accent-fg)] border-transparent" : "text-ink-3 border-rule-soft hover:border-rule")}
                style={mood === n ? { background: "var(--accent)" } : {}}>
                {MOODS[n-1]}
              </button>
            ))}
          </div>
          <span className="label-mono">{MOOD_LABEL[mood-1]}</span>
        </div>

        <div className="hairline mt-6 mb-6" />

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={16}
          className="w-full bg-transparent outline-none resize-none font-serif text-[18px] leading-[1.7] text-ink-2 placeholder:text-ink-4"
          style={{ backgroundImage: "linear-gradient(transparent calc(1.7em - 1px), oklch(0.85 0.022 75) 1px)", backgroundSize: "100% 1.7em", lineHeight: "1.7em" }}
          placeholder="Write the day…"
        />

        <div className="flex items-center gap-2 mt-4">
          <span className="label-mono">Tags</span>
          {entry.tags.map(t => <Tag key={t}>{t}</Tag>)}
          <button className="btn-ghost btn">＋ add</button>
        </div>
      </article>
    </div>
  );
}
