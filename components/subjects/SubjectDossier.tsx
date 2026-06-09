"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Input,
  Panel,
  RelevantChip,
  SectionLabel,
  Select,
  TerminalLog,
  Textarea,
} from "@/components/ui";
import type {
  DossierSection,
  Signal,
  Subject,
  SubjectRelationship,
  SubjectTrait,
  SubjectWithMeta,
} from "@/lib/types";

type Tab = "overview" | "signals" | "traits" | "connections" | "notes";

export function SubjectDossier({
  subject,
  signals,
  traits,
  relationships,
  sections,
  allSubjects,
}: {
  subject: Subject;
  signals: Signal[];
  traits: SubjectTrait[];
  relationships: SubjectRelationship[];
  sections: DossierSection[];
  allSubjects: SubjectWithMeta[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [briefing, setBriefing] = useState<{
    summary: string[];
    watch_for: string[];
  } | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  const overview =
    sections.find((s) => s.section_key === "overview")?.content ?? "";
  const context =
    sections.find((s) => s.section_key === "context")?.content ?? "";

  async function saveSection(key: string, content: string) {
    await fetch("/api/dossier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject_id: subject.id,
        section_key: key,
        content,
      }),
    });
    router.refresh();
  }

  async function addSignal(content: string, type: string) {
    await fetch("/api/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: subject.id, content, type }),
    });
    router.refresh();
  }

  async function addTrait(dimension: string, value: string) {
    await fetch("/api/traits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: subject.id, dimension, value }),
    });
    router.refresh();
  }

  async function addRelationship(
    toId: string,
    relationship_type: string,
    strength: number
  ) {
    await fetch("/api/relationships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_subject_id: subject.id,
        to_subject_id: toId,
        relationship_type,
        strength,
      }),
    });
    router.refresh();
  }

  async function generateBriefing() {
    setLoadingBriefing(true);
    const res = await fetch("/api/briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: subject.id }),
    });
    setLoadingBriefing(false);
    if (res.ok) setBriefing(await res.json());
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "signals", label: "Signals" },
    { id: "traits", label: "Traits" },
    { id: "connections", label: "Connections" },
    { id: "notes", label: "Raw notes" },
  ];

  const nameMap = Object.fromEntries(
    allSubjects.map((s) => [s.id, s.display_name])
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionLabel>§ SUBJECT // DOSSIER</SectionLabel>
          <h1 className="mt-1 text-2xl font-semibold text-ink">
            {subject.display_name}
          </h1>
          {subject.aliases && (
            <p className="font-mono text-xs text-muted">
              aka {subject.aliases}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <RelevantChip
              variant={
                subject.status === "archived"
                  ? "archived"
                  : subject.status === "stale"
                    ? "stale"
                    : "relevant"
              }
            />
            {subject.tags &&
              subject.tags.split(",").map((t) => (
                <span
                  key={t}
                  className="border border-hairline px-2 py-0.5 font-mono text-[10px] text-link"
                >
                  {t.trim()}
                </span>
              ))}
          </div>
        </div>
        <Button variant="primary" onClick={generateBriefing} disabled={loadingBriefing}>
          {loadingBriefing ? "Analyzing…" : "Generate briefing"}
        </Button>
      </header>

      {briefing && (
        <Panel>
          <SectionLabel>§ MACHINE // BRIEFING</SectionLabel>
          <ul className="mt-3 space-y-1 font-mono text-sm text-ink">
            {briefing.summary.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
          {briefing.watch_for.length > 0 && (
            <>
              <p className="mt-4 font-mono text-[10px] uppercase text-accent">
                Watch for
              </p>
              <ul className="mt-1 space-y-1 font-mono text-xs text-muted">
                {briefing.watch_for.map((w) => (
                  <li key={w}>→ {w}</li>
                ))}
              </ul>
            </>
          )}
        </Panel>
      )}

      <nav className="flex flex-wrap gap-2 border-b border-hairline pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`font-mono text-xs uppercase tracking-wider px-3 py-1 ${
              tab === t.id
                ? "border-b-2 border-accent text-accent"
                : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <OverviewTab
          overview={overview}
          context={context}
          onSave={saveSection}
        />
      )}
      {tab === "signals" && (
        <SignalsTab signals={signals} onAdd={addSignal} />
      )}
      {tab === "traits" && (
        <TraitsTab traits={traits} onAdd={addTrait} />
      )}
      {tab === "connections" && (
        <ConnectionsTab
          subjectId={subject.id}
          relationships={relationships}
          allSubjects={allSubjects}
          nameMap={nameMap}
          onAdd={addRelationship}
        />
      )}
      {tab === "notes" && (
        <NotesTab notes={subject.notes} subjectId={subject.id} />
      )}
    </div>
  );
}

function OverviewTab({
  overview,
  context,
  onSave,
}: {
  overview: string;
  context: string;
  onSave: (key: string, content: string) => void;
}) {
  const [bio, setBio] = useState(overview);
  const [ctx, setCtx] = useState(context);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel>
        <SectionLabel>Bio</SectionLabel>
        <Textarea
          className="mt-2"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <Button
          className="mt-2"
          onClick={() => onSave("overview", bio)}
        >
          Save bio
        </Button>
      </Panel>
      <Panel>
        <SectionLabel>Context</SectionLabel>
        <Textarea
          className="mt-2"
          value={ctx}
          onChange={(e) => setCtx(e.target.value)}
        />
        <Button
          className="mt-2"
          onClick={() => onSave("context", ctx)}
        >
          Save context
        </Button>
      </Panel>
    </div>
  );
}

function SignalsTab({
  signals,
  onAdd,
}: {
  signals: Signal[];
  onAdd: (content: string, type: string) => void;
}) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("observation");

  return (
    <div className="space-y-4">
      <Panel>
        <SectionLabel>Quick log signal</SectionLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-auto"
          >
            <option value="observation">observation</option>
            <option value="interaction">interaction</option>
            <option value="mood">mood</option>
            <option value="topic">topic</option>
            <option value="other">other</option>
          </Select>
          <Input
            className="flex-1 min-w-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What happened?"
          />
          <Button
            variant="primary"
            onClick={() => {
              if (content.trim()) {
                onAdd(content.trim(), type);
                setContent("");
              }
            }}
          >
            Log
          </Button>
        </div>
      </Panel>
      <div className="space-y-2">
        {signals.map((s) => (
          <TerminalLog
            key={s.id}
            timestamp={s.observed_at}
            content={s.content}
            type={s.type}
          />
        ))}
        {signals.length === 0 && (
          <p className="font-mono text-sm text-dim">No signals recorded.</p>
        )}
      </div>
    </div>
  );
}

function TraitsTab({
  traits,
  onAdd,
}: {
  traits: SubjectTrait[];
  onAdd: (dimension: string, value: string) => void;
}) {
  const [dimension, setDimension] = useState("");
  const [value, setValue] = useState("");

  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="dimension"
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
          />
          <Input
            placeholder="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={() => {
              if (dimension && value) {
                onAdd(dimension, value);
                setDimension("");
                setValue("");
              }
            }}
          >
            Add trait
          </Button>
        </div>
      </Panel>
      <div className="grid gap-2 sm:grid-cols-2">
        {traits.map((t) => (
          <div
            key={t.id}
            className="terminal-panel flex justify-between p-3 font-mono text-xs"
          >
            <span className="text-muted">{t.dimension}</span>
            <span className="text-link">{t.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConnectionsTab({
  subjectId,
  relationships,
  allSubjects,
  nameMap,
  onAdd,
}: {
  subjectId: string;
  relationships: SubjectRelationship[];
  allSubjects: SubjectWithMeta[];
  nameMap: Record<string, string>;
  onAdd: (toId: string, type: string, strength: number) => void;
}) {
  const [toId, setToId] = useState("");
  const [relType, setRelType] = useState("friend");
  const [strength, setStrength] = useState(0.5);

  const others = allSubjects.filter((s) => s.id !== subjectId);

  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex flex-wrap gap-2">
          <Select value={toId} onChange={(e) => setToId(e.target.value)}>
            <option value="">Select subject…</option>
            {others.map((s) => (
              <option key={s.id} value={s.id}>
                {s.display_name}
              </option>
            ))}
          </Select>
          <Select value={relType} onChange={(e) => setRelType(e.target.value)}>
            <option value="friend">friend</option>
            <option value="close_friend">close_friend</option>
            <option value="family">family</option>
            <option value="colleague">colleague</option>
            <option value="partner">partner</option>
            <option value="met_through">met_through</option>
            <option value="tension">tension</option>
            <option value="unknown">unknown</option>
          </Select>
          <Input
            type="number"
            min={0}
            max={1}
            step={0.1}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="w-20"
          />
          <Button
            variant="primary"
            onClick={() => {
              if (toId) {
                onAdd(toId, relType, strength);
                setToId("");
              }
            }}
          >
            Add link
          </Button>
        </div>
      </Panel>
      <ul className="space-y-2 font-mono text-sm">
        {relationships.map((r) => {
          const otherId =
            r.from_subject_id === subjectId
              ? r.to_subject_id
              : r.from_subject_id;
          return (
            <li key={r.id} className="terminal-panel p-3">
              <span className="text-link">{nameMap[otherId] ?? otherId}</span>
              <span className="text-dim"> — {r.relationship_type}</span>
              <span className="text-muted"> ({r.strength.toFixed(1)})</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NotesTab({
  notes,
  subjectId,
}: {
  notes: string;
  subjectId: string;
}) {
  const router = useRouter();
  const [text, setText] = useState(notes);

  async function save() {
    await fetch(`/api/subjects/${subjectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: text }),
    });
    router.refresh();
  }

  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} />
      <Button className="mt-2" variant="primary" onClick={save}>
        Save notes
      </Button>
    </Panel>
  );
}
