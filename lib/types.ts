export type SubjectStatus = "active" | "stale" | "archived";

export type SignalType =
  | "observation"
  | "interaction"
  | "mood"
  | "topic"
  | "other";

export type RelationshipType =
  | "friend"
  | "close_friend"
  | "family"
  | "colleague"
  | "partner"
  | "met_through"
  | "tension"
  | "unknown";

export type IngestStatus = "pending" | "reviewed" | "applied";

export type SuggestionType =
  | "new_subject"
  | "signal"
  | "trait"
  | "relationship";

export interface Subject {
  id: string;
  user_id: string;
  display_name: string;
  aliases: string;
  photo_url: string;
  status: SubjectStatus;
  tags: string;
  notes: string;
  importance: number;
  created_at: string;
  updated_at: string;
}

export interface Signal {
  id: string;
  user_id: string;
  subject_id: string;
  type: SignalType;
  content: string;
  source: string;
  observed_at: string;
  confidence: number;
  created_at: string;
}

export interface SubjectTrait {
  id: string;
  user_id: string;
  subject_id: string;
  dimension: string;
  value: string;
  source: string;
  confidence: number;
  created_at: string;
}

export interface SubjectRelationship {
  id: string;
  user_id: string;
  from_subject_id: string;
  to_subject_id: string;
  relationship_type: RelationshipType;
  strength: number;
  notes: string;
  created_at: string;
}

export interface DossierSection {
  id: string;
  user_id: string;
  subject_id: string;
  section_key: string;
  content: string;
  updated_at: string;
}

export interface IngestBatch {
  id: string;
  user_id: string;
  raw_text: string;
  status: IngestStatus;
  created_at: string;
}

export interface IngestSuggestion {
  id: string;
  batch_id: string;
  suggestion_type: SuggestionType;
  payload: string;
  accepted: number | null;
  created_at: string;
}

export interface SubjectWithMeta extends Subject {
  signal_count: number;
  last_signal_at: string | null;
  trait_count: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  status: SubjectStatus;
  importance: number;
  signal_count: number;
}

export interface NetworkEdge {
  id: string;
  from: string;
  to: string;
  relationship_type: RelationshipType;
  strength: number;
}

export interface ExtractionResult {
  subjects: Array<{ name: string; aliases?: string[]; is_new: boolean; existing_id?: string }>;
  signals: Array<{ subject_name: string; type: SignalType; content: string; observed_at?: string; confidence: number }>;
  traits: Array<{ subject_name: string; dimension: string; value: string; confidence: number }>;
  relationships: Array<{ from_name: string; to_name: string; relationship_type: RelationshipType; strength: number; notes?: string }>;
}
