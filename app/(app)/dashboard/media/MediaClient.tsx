"use client";

import { useState } from "react";
import { LabelMono, Tag } from "@/components/ui";
import type { MediaItem } from "@/lib/queries";

const TYPES    = ["Book", "Show", "Film"] as const;
const STATUSES = ["reading", "watching", "done"] as const;

export default function MediaClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [media, setMedia]     = useState<MediaItem[]>(initialMedia);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({ type: "Book" as MediaItem["type"], title: "", author: "", status: "reading" as MediaItem["status"], rating: "" });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm]   = useState({ type: "Book" as MediaItem["type"], title: "", author: "", status: "reading" as MediaItem["status"], rating: "" });

  const now  = media.filter(m => m.status === "reading" || m.status === "watching");
  const done = media.filter(m => m.status === "done");

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
    const item: MediaItem = {
      id: `m-${Date.now()}`, user_id: "",
      type: form.type, title: form.title, author: form.author,
      status: form.status, rating: form.rating ? parseInt(form.rating) : null,
    };
    await fetch("/api/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    setMedia([item, ...media]);
    setForm({ type: "Book", title: "", author: "", status: "reading", rating: "" });
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    setMedia(media.filter(m => m.id !== id));
  }

  async function handleUpdate(id: string) {
    const updated = {
      type: editForm.type,
      title: editForm.title,
      author: editForm.author,
      status: editForm.status,
      rating: editForm.rating ? parseInt(editForm.rating) : null,
    };
    await fetch(`/api/media/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    setMedia(media.map(m => m.id === id ? { ...m, ...updated } : m));
    setEditingId(null);
  }

  function startEdit(m: MediaItem) {
    setEditingId(m.id);
    setEditForm({ type: m.type, title: m.title, author: m.author ?? "", status: m.status, rating: m.rating ? String(m.rating) : "" });
  }

  function renderRow(m: MediaItem) {
    if (editingId === m.id) {
      return (
        <div key={m.id} className="border border-rule py-4 px-3 grid gap-3 my-1">
          <div className="grid gap-3" style={{ gridTemplateColumns: "70px 1fr 1fr 100px 80px" }}>
            <select value={editForm.type} onChange={editField("type")}
              className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <input value={editForm.title} onChange={editField("title")} placeholder="Title"
              className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
            <input value={editForm.author} onChange={editField("author")} placeholder="Author / Source"
              className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
            <select value={editForm.status} onChange={editField("status")}
              className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <input type="number" min="1" max="5" value={editForm.rating} onChange={editField("rating")} placeholder="Rating"
              className="bg-transparent border-b border-rule font-mono text-sm text-ink py-1 outline-none focus:border-[var(--accent)]" />
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => handleUpdate(m.id)} className="btn-primary btn text-[10px]">Save</button>
            <button onClick={() => setEditingId(null)} className="btn text-[10px]">Cancel</button>
          </div>
        </div>
      );
    }
    return (
      <div key={m.id} className="grid items-baseline gap-5 py-4" style={{ gridTemplateColumns: "70px 1fr 1fr 100px 80px auto" }}>
        <Tag>{m.type}</Tag>
        <span className="font-serif italic text-[18px] text-ink">{m.title}</span>
        <span className="font-serif text-[14px] text-ink-3">{m.author}</span>
        <span className="label-mono">{m.status}</span>
        <span className="font-mono text-[13px] text-right" style={{ color: m.rating ? "var(--accent)" : "oklch(0.68 0.020 72)" }}>
          {m.rating ? "★".repeat(m.rating) : "—"}
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={() => startEdit(m)} className="btn text-[10px]">Edit</button>
          <button onClick={() => handleDelete(m.id)} className="btn text-[10px] text-[var(--accent)]">Delete</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-11 py-8 max-w-[1180px]">
      <header className="flex items-baseline gap-6 mb-2">
        <div>
          <LabelMono>Life tracker · Media</LabelMono>
          <h1 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-ink mt-2">
            What I'm <em className="text-[var(--accent)]">reading & watching</em>
          </h1>
        </div>
        <div className="ml-auto self-end flex items-baseline gap-5">
          <div className="text-right">
            <LabelMono>Total logged</LabelMono>
            <div className="font-mono text-[26px] text-ink tabular-nums mt-1">{media.length}</div>
          </div>
          <button onClick={() => setShowForm(v => !v)} className="btn">
            {showForm ? "Cancel" : "+ Add item"}
          </button>
        </div>
      </header>
      <div className="hairline-strong mt-6" />

      {showForm && (
        <form onSubmit={handleAdd} className="border border-rule-soft p-7 mt-6 grid gap-5" style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr auto" }}>
          <div>
            <label className="label-mono block mb-2">Type</label>
            <select value={form.type} onChange={field("type")}
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)]">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label-mono block mb-2">Title</label>
            <input value={form.title} onChange={field("title")} placeholder="e.g. Slouching Towards Bethlehem" required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Author / Source</label>
            <input value={form.author} onChange={field("author")} placeholder="Joan Didion"
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div>
            <label className="label-mono block mb-2">Status</label>
            <select value={form.status} onChange={field("status")}
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)]">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label-mono block mb-2">Rating (1–5)</label>
            <input type="number" min="1" max="5" value={form.rating} onChange={field("rating")} placeholder="—"
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink py-2 outline-none focus:border-[var(--accent)] placeholder:text-ink-4" />
          </div>
          <div className="self-end">
            <button type="submit" disabled={saving} className="btn-primary btn disabled:opacity-50">
              {saving ? "Saving…" : "Add"}
            </button>
          </div>
        </form>
      )}

      {media.length === 0 ? (
        <div className="border border-rule-soft p-12 text-center mt-8">
          <p className="font-serif italic text-[17px] text-ink-3">No media logged yet.</p>
        </div>
      ) : (
        <>
          {now.length > 0 && (
            <section className="mt-9">
              <div className="label-mono mb-4">Now — {now.length} item{now.length !== 1 ? "s" : ""}</div>
              <div className="divide-y divide-rule-soft">
                {now.map(m => renderRow(m))}
              </div>
            </section>
          )}
          {done.length > 0 && (
            <section className="mt-9">
              <div className="label-mono mb-4">Finished — {done.length} item{done.length !== 1 ? "s" : ""}</div>
              <div className="divide-y divide-rule-soft">
                {done.map(m => renderRow(m))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
