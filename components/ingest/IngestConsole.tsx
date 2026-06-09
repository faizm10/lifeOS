"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Panel,
  SectionLabel,
  Textarea,
} from "@/components/ui";
import type { IngestBatch, IngestSuggestion } from "@/lib/types";

export function IngestConsole({
  batches,
}: {
  batches: (IngestBatch & { suggestions?: IngestSuggestion[] })[];
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<{
    batch: IngestBatch;
    suggestions: IngestSuggestion[];
  } | null>(null);
  const [decisions, setDecisions] = useState<
    Record<string, boolean | undefined>
  >({});

  async function runExtraction() {
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw_text: text }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setPending(data);
      setDecisions({});
      setText("");
    }
  }

  async function submitReview() {
    if (!pending) return;
    const list = pending.suggestions
      .filter((s) => decisions[s.id] !== undefined)
      .map((s) => ({ id: s.id, accepted: decisions[s.id]! }));

    await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "review",
        batch_id: pending.batch.id,
        decisions: list,
      }),
    });
    setPending(null);
    router.refresh();
  }

  function suggestionLabel(s: IngestSuggestion) {
    const p = JSON.parse(s.payload);
    switch (s.suggestion_type) {
      case "new_subject":
        return `New subject: ${p.name}`;
      case "signal":
        return `Signal (${p.subject_name}): ${p.content}`;
      case "trait":
        return `Trait (${p.subject_name}): ${p.dimension} = ${p.value}`;
      case "relationship":
        return `Link: ${p.from_name} → ${p.to_name} (${p.relationship_type})`;
      default:
        return s.suggestion_type;
    }
  }

  return (
    <div className="space-y-6">
      <Panel>
        <SectionLabel>§ MACHINE // INGEST</SectionLabel>
        <p className="mt-2 mb-4 font-mono text-xs text-muted">
          Paste chat logs, meeting notes, or observations. The Machine will
          extract suggestions — nothing is written until you accept.
        </p>
        <Textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text here…"
        />
        <Button
          className="mt-3"
          variant="primary"
          onClick={runExtraction}
          disabled={loading}
        >
          {loading ? "Processing…" : "Run extraction"}
        </Button>
      </Panel>

      {pending && (
        <Panel>
          <SectionLabel>Review queue</SectionLabel>
          <ul className="mt-4 space-y-3">
            {pending.suggestions.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-hairline p-3"
              >
                <span className="font-mono text-xs text-ink">
                  [{s.suggestion_type}] {suggestionLabel(s)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant={
                      decisions[s.id] === true ? "primary" : "default"
                    }
                    onClick={() =>
                      setDecisions({ ...decisions, [s.id]: true })
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    variant={
                      decisions[s.id] === false ? "danger" : "default"
                    }
                    onClick={() =>
                      setDecisions({ ...decisions, [s.id]: false })
                    }
                  >
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <Button
            className="mt-4"
            variant="primary"
            onClick={submitReview}
            disabled={
              pending.suggestions.some((s) => decisions[s.id] === undefined)
            }
          >
            Apply decisions
          </Button>
        </Panel>
      )}

      {batches.length > 0 && (
        <Panel>
          <SectionLabel>Recent batches</SectionLabel>
          <ul className="mt-3 space-y-2 font-mono text-xs text-muted">
            {batches.map((b) => (
              <li key={b.id}>
                {new Date(b.created_at).toLocaleString()} — {b.status}
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
