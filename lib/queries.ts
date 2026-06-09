import db from "./db";
import type {
  DossierSection,
  IngestBatch,
  IngestSuggestion,
  NetworkEdge,
  NetworkNode,
  Signal,
  Subject,
  SubjectRelationship,
  SubjectTrait,
  SubjectWithMeta,
} from "./types";
import { id, now } from "./utils";

// ─── Subjects ───────────────────────────────────────────────────────────────

export function listSubjects(userId: string, q?: string): SubjectWithMeta[] {
  const rows = db
    .prepare(
      `SELECT s.*,
        (SELECT COUNT(*) FROM signals sig WHERE sig.subject_id = s.id) AS signal_count,
        (SELECT MAX(sig.observed_at) FROM signals sig WHERE sig.subject_id = s.id) AS last_signal_at,
        (SELECT COUNT(*) FROM subject_traits t WHERE t.subject_id = s.id) AS trait_count
       FROM subjects s
       WHERE s.user_id = ?
       ORDER BY s.updated_at DESC`
    )
    .all(userId) as SubjectWithMeta[];

  if (!q?.trim()) return rows;
  const lower = q.toLowerCase();
  return rows.filter(
    (s) =>
      s.display_name.toLowerCase().includes(lower) ||
      s.aliases.toLowerCase().includes(lower) ||
      s.tags.toLowerCase().includes(lower) ||
      s.notes.toLowerCase().includes(lower)
  );
}

export function getSubject(userId: string, subjectId: string): Subject | null {
  return (
    (db
      .prepare("SELECT * FROM subjects WHERE id = ? AND user_id = ?")
      .get(subjectId, userId) as Subject | undefined) ?? null
  );
}

export function findSubjectByName(
  userId: string,
  name: string
): Subject | null {
  const lower = name.toLowerCase().trim();
  const subjects = db
    .prepare("SELECT * FROM subjects WHERE user_id = ?")
    .all(userId) as Subject[];
  return (
    subjects.find(
      (s) =>
        s.display_name.toLowerCase() === lower ||
        s.aliases
          .split(",")
          .some((a) => a.trim().toLowerCase() === lower)
    ) ?? null
  );
}

export function createSubject(
  userId: string,
  data: Partial<Subject> & { display_name: string }
): Subject {
  const ts = now();
  const subject: Subject = {
    id: id(),
    user_id: userId,
    display_name: data.display_name,
    aliases: data.aliases ?? "",
    photo_url: data.photo_url ?? "",
    status: data.status ?? "active",
    tags: data.tags ?? "",
    notes: data.notes ?? "",
    importance: data.importance ?? 0.5,
    created_at: ts,
    updated_at: ts,
  };
  db.prepare(
    `INSERT INTO subjects (id, user_id, display_name, aliases, photo_url, status, tags, notes, importance, created_at, updated_at)
     VALUES (@id, @user_id, @display_name, @aliases, @photo_url, @status, @tags, @notes, @importance, @created_at, @updated_at)`
  ).run(subject);
  return subject;
}

export function updateSubject(
  userId: string,
  subjectId: string,
  data: Partial<Subject>
): Subject | null {
  const existing = getSubject(userId, subjectId);
  if (!existing) return null;
  const updated = { ...existing, ...data, updated_at: now() };
  db.prepare(
    `UPDATE subjects SET display_name=@display_name, aliases=@aliases, photo_url=@photo_url,
     status=@status, tags=@tags, notes=@notes, importance=@importance, updated_at=@updated_at
     WHERE id=@id AND user_id=@user_id`
  ).run(updated);
  return updated;
}

export function deleteSubject(userId: string, subjectId: string): boolean {
  const r = db
    .prepare("DELETE FROM subjects WHERE id = ? AND user_id = ?")
    .run(subjectId, userId);
  return r.changes > 0;
}

// ─── Signals ────────────────────────────────────────────────────────────────

export function listSignals(
  userId: string,
  subjectId?: string,
  limit = 50
): Signal[] {
  if (subjectId) {
    return db
      .prepare(
        `SELECT * FROM signals WHERE user_id = ? AND subject_id = ? ORDER BY observed_at DESC LIMIT ?`
      )
      .all(userId, subjectId, limit) as Signal[];
  }
  return db
    .prepare(
      `SELECT * FROM signals WHERE user_id = ? ORDER BY observed_at DESC LIMIT ?`
    )
    .all(userId, limit) as Signal[];
}

export function createSignal(
  userId: string,
  data: {
    subject_id: string;
    type?: string;
    content: string;
    source?: string;
    observed_at?: string;
    confidence?: number;
  }
): Signal {
  const signal: Signal = {
    id: id(),
    user_id: userId,
    subject_id: data.subject_id,
    type: (data.type as Signal["type"]) ?? "observation",
    content: data.content,
    source: data.source ?? "manual",
    observed_at: data.observed_at ?? now(),
    confidence: data.confidence ?? 1,
    created_at: now(),
  };
  db.prepare(
    `INSERT INTO signals (id, user_id, subject_id, type, content, source, observed_at, confidence, created_at)
     VALUES (@id, @user_id, @subject_id, @type, @content, @source, @observed_at, @confidence, @created_at)`
  ).run(signal);
  db.prepare(
    "UPDATE subjects SET updated_at = ? WHERE id = ? AND user_id = ?"
  ).run(now(), data.subject_id, userId);
  return signal;
}

export function deleteSignal(userId: string, signalId: string): boolean {
  const r = db
    .prepare("DELETE FROM signals WHERE id = ? AND user_id = ?")
    .run(signalId, userId);
  return r.changes > 0;
}

// ─── Traits ─────────────────────────────────────────────────────────────────

export function listTraits(userId: string, subjectId: string): SubjectTrait[] {
  return db
    .prepare(
      "SELECT * FROM subject_traits WHERE user_id = ? AND subject_id = ? ORDER BY dimension"
    )
    .all(userId, subjectId) as SubjectTrait[];
}

export function createTrait(
  userId: string,
  data: {
    subject_id: string;
    dimension: string;
    value: string;
    source?: string;
    confidence?: number;
  }
): SubjectTrait {
  const trait: SubjectTrait = {
    id: id(),
    user_id: userId,
    subject_id: data.subject_id,
    dimension: data.dimension,
    value: data.value,
    source: data.source ?? "manual",
    confidence: data.confidence ?? 1,
    created_at: now(),
  };
  db.prepare(
    `INSERT INTO subject_traits (id, user_id, subject_id, dimension, value, source, confidence, created_at)
     VALUES (@id, @user_id, @subject_id, @dimension, @value, @source, @confidence, @created_at)`
  ).run(trait);
  return trait;
}

export function deleteTrait(userId: string, traitId: string): boolean {
  const r = db
    .prepare("DELETE FROM subject_traits WHERE id = ? AND user_id = ?")
    .run(traitId, userId);
  return r.changes > 0;
}

// ─── Relationships ──────────────────────────────────────────────────────────

export function listRelationships(
  userId: string,
  subjectId?: string
): SubjectRelationship[] {
  if (subjectId) {
    return db
      .prepare(
        `SELECT * FROM subject_relationships
         WHERE user_id = ? AND (from_subject_id = ? OR to_subject_id = ?)`
      )
      .all(userId, subjectId, subjectId) as SubjectRelationship[];
  }
  return db
    .prepare("SELECT * FROM subject_relationships WHERE user_id = ?")
    .all(userId) as SubjectRelationship[];
}

export function createRelationship(
  userId: string,
  data: {
    from_subject_id: string;
    to_subject_id: string;
    relationship_type: string;
    strength?: number;
    notes?: string;
  }
): SubjectRelationship {
  const rel: SubjectRelationship = {
    id: id(),
    user_id: userId,
    from_subject_id: data.from_subject_id,
    to_subject_id: data.to_subject_id,
    relationship_type: data.relationship_type as SubjectRelationship["relationship_type"],
    strength: data.strength ?? 0.5,
    notes: data.notes ?? "",
    created_at: now(),
  };
  db.prepare(
    `INSERT INTO subject_relationships (id, user_id, from_subject_id, to_subject_id, relationship_type, strength, notes, created_at)
     VALUES (@id, @user_id, @from_subject_id, @to_subject_id, @relationship_type, @strength, @notes, @created_at)`
  ).run(rel);
  return rel;
}

export function deleteRelationship(
  userId: string,
  relId: string
): boolean {
  const r = db
    .prepare("DELETE FROM subject_relationships WHERE id = ? AND user_id = ?")
    .run(relId, userId);
  return r.changes > 0;
}

// ─── Dossier sections ───────────────────────────────────────────────────────

export function getDossierSections(
  userId: string,
  subjectId: string
): DossierSection[] {
  return db
    .prepare(
      "SELECT * FROM dossier_sections WHERE user_id = ? AND subject_id = ?"
    )
    .all(userId, subjectId) as DossierSection[];
}

export function upsertDossierSection(
  userId: string,
  subjectId: string,
  sectionKey: string,
  content: string
): DossierSection {
  const existing = db
    .prepare(
      "SELECT * FROM dossier_sections WHERE user_id = ? AND subject_id = ? AND section_key = ?"
    )
    .get(userId, subjectId, sectionKey) as DossierSection | undefined;

  const ts = now();
  if (existing) {
    db.prepare(
      "UPDATE dossier_sections SET content = ?, updated_at = ? WHERE id = ?"
    ).run(content, ts, existing.id);
    return { ...existing, content, updated_at: ts };
  }

  const section: DossierSection = {
    id: id(),
    user_id: userId,
    subject_id: subjectId,
    section_key: sectionKey,
    content,
    updated_at: ts,
  };
  db.prepare(
    `INSERT INTO dossier_sections (id, user_id, subject_id, section_key, content, updated_at)
     VALUES (@id, @user_id, @subject_id, @section_key, @content, @updated_at)`
  ).run(section);
  return section;
}

// ─── Ingest ─────────────────────────────────────────────────────────────────

export function createIngestBatch(
  userId: string,
  rawText: string
): IngestBatch {
  const batch: IngestBatch = {
    id: id(),
    user_id: userId,
    raw_text: rawText,
    status: "pending",
    created_at: now(),
  };
  db.prepare(
    `INSERT INTO ingest_batches (id, user_id, raw_text, status, created_at)
     VALUES (@id, @user_id, @raw_text, @status, @created_at)`
  ).run(batch);
  return batch;
}

export function createIngestSuggestion(
  batchId: string,
  suggestionType: string,
  payload: object
): IngestSuggestion {
  const suggestion: IngestSuggestion = {
    id: id(),
    batch_id: batchId,
    suggestion_type: suggestionType as IngestSuggestion["suggestion_type"],
    payload: JSON.stringify(payload),
    accepted: null,
    created_at: now(),
  };
  db.prepare(
    `INSERT INTO ingest_suggestions (id, batch_id, suggestion_type, payload, accepted, created_at)
     VALUES (@id, @batch_id, @suggestion_type, @payload, @accepted, @created_at)`
  ).run(suggestion);
  return suggestion;
}

export function listIngestBatches(userId: string): IngestBatch[] {
  return db
    .prepare(
      "SELECT * FROM ingest_batches WHERE user_id = ? ORDER BY created_at DESC LIMIT 20"
    )
    .all(userId) as IngestBatch[];
}

export function getIngestBatch(
  userId: string,
  batchId: string
): IngestBatch | null {
  return (
    (db
      .prepare(
        "SELECT * FROM ingest_batches WHERE id = ? AND user_id = ?"
      )
      .get(batchId, userId) as IngestBatch | undefined) ?? null
  );
}

export function listIngestSuggestions(batchId: string): IngestSuggestion[] {
  return db
    .prepare(
      "SELECT * FROM ingest_suggestions WHERE batch_id = ? ORDER BY created_at"
    )
    .all(batchId) as IngestSuggestion[];
}

export function updateIngestSuggestion(
  suggestionId: string,
  accepted: boolean
): void {
  db.prepare("UPDATE ingest_suggestions SET accepted = ? WHERE id = ?").run(
    accepted ? 1 : 0,
    suggestionId
  );
}

export function updateIngestBatchStatus(
  batchId: string,
  status: string
): void {
  db.prepare("UPDATE ingest_batches SET status = ? WHERE id = ?").run(
    status,
    batchId
  );
}

export function countPendingSuggestions(userId: string): number {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS c FROM ingest_suggestions sug
       JOIN ingest_batches b ON b.id = sug.batch_id
       WHERE b.user_id = ? AND sug.accepted IS NULL`
    )
    .get(userId) as { c: number };
  return row.c;
}

// ─── Network ────────────────────────────────────────────────────────────────

export function getNetworkData(userId: string): {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
} {
  const subjects = listSubjects(userId);
  const nodes: NetworkNode[] = subjects.map((s) => ({
    id: s.id,
    label: s.display_name,
    status: s.status,
    importance: s.importance,
    signal_count: s.signal_count,
  }));

  const rels = listRelationships(userId);
  const edges: NetworkEdge[] = rels.map((r) => ({
    id: r.id,
    from: r.from_subject_id,
    to: r.to_subject_id,
    relationship_type: r.relationship_type,
    strength: r.strength,
  }));

  return { nodes, edges };
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export function getDashboardStats(userId: string) {
  const subjects = listSubjects(userId);
  const recentSignals = listSignals(userId, undefined, 10);
  const staleThreshold = 30;
  const stale = subjects.filter((s) => {
    if (!s.last_signal_at) return true;
    const days =
      (Date.now() - new Date(s.last_signal_at).getTime()) /
      (1000 * 60 * 60 * 24);
    return days > staleThreshold;
  });
  const relevant = subjects.filter((s) => {
    if (!s.last_signal_at) return false;
    const days =
      (Date.now() - new Date(s.last_signal_at).getTime()) /
      (1000 * 60 * 60 * 24);
    return days <= 7;
  });

  return {
    subjectCount: subjects.length,
    signalCount: recentSignals.length,
    pendingSuggestions: countPendingSuggestions(userId),
    staleSubjects: stale.slice(0, 5),
    relevantSubjects: relevant.slice(0, 5),
    recentSignals,
    network: getNetworkData(userId),
  };
}

export function exportUserData(userId: string) {
  return {
    subjects: listSubjects(userId),
    signals: listSignals(userId, undefined, 10000),
    traits: db
      .prepare("SELECT * FROM subject_traits WHERE user_id = ?")
      .all(userId),
    relationships: listRelationships(userId),
    dossier_sections: db
      .prepare("SELECT * FROM dossier_sections WHERE user_id = ?")
      .all(userId),
    exported_at: now(),
  };
}
