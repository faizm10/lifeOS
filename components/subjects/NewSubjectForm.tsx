"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea } from "@/components/ui";

export function NewSubjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    aliases: "",
    tags: "",
    notes: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      const subject = await res.json();
      router.push(`/console/subjects/${subject.id}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
          Display name
        </label>
        <Input
          required
          value={form.display_name}
          onChange={(e) =>
            setForm({ ...form, display_name: e.target.value })
          }
          placeholder="Subject name"
        />
      </div>
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
          Aliases
        </label>
        <Input
          value={form.aliases}
          onChange={(e) => setForm({ ...form, aliases: e.target.value })}
          placeholder="comma-separated"
        />
      </div>
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
          Tags
        </label>
        <Input
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="work, college"
        />
      </div>
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase text-muted">
          Notes
        </label>
        <Textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Creating…" : "Create subject"}
      </Button>
    </form>
  );
}
