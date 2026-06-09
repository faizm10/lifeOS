import {
  createRelationship,
  createSignal,
  createSubject,
  createTrait,
  findSubjectByName,
  getIngestBatch,
  listIngestSuggestions,
  updateIngestBatchStatus,
  updateIngestSuggestion,
} from "./queries";
import type { IngestSuggestion, SuggestionType } from "./types";

export function applyIngestSuggestion(
  userId: string,
  suggestion: IngestSuggestion
): void {
  const payload = JSON.parse(suggestion.payload) as Record<string, unknown>;

  switch (suggestion.suggestion_type as SuggestionType) {
    case "new_subject": {
      const name = payload.name as string;
      if (!findSubjectByName(userId, name)) {
        createSubject(userId, {
          display_name: name,
          aliases: Array.isArray(payload.aliases)
            ? (payload.aliases as string[]).join(", ")
            : "",
        });
      }
      break;
    }
    case "signal": {
      const subjectName = payload.subject_name as string;
      let subject = findSubjectByName(userId, subjectName);
      if (!subject) {
        subject = createSubject(userId, { display_name: subjectName });
      }
      createSignal(userId, {
        subject_id: subject.id,
        type: payload.type as string,
        content: payload.content as string,
        source: "machine",
        observed_at: payload.observed_at as string | undefined,
        confidence: payload.confidence as number,
      });
      break;
    }
    case "trait": {
      const subjectName = payload.subject_name as string;
      let subject = findSubjectByName(userId, subjectName);
      if (!subject) {
        subject = createSubject(userId, { display_name: subjectName });
      }
      createTrait(userId, {
        subject_id: subject.id,
        dimension: payload.dimension as string,
        value: payload.value as string,
        source: "machine",
        confidence: payload.confidence as number,
      });
      break;
    }
    case "relationship": {
      const fromName = payload.from_name as string;
      const toName = payload.to_name as string;
      let from = findSubjectByName(userId, fromName);
      let to = findSubjectByName(userId, toName);
      if (!from) from = createSubject(userId, { display_name: fromName });
      if (!to) to = createSubject(userId, { display_name: toName });
      createRelationship(userId, {
        from_subject_id: from.id,
        to_subject_id: to.id,
        relationship_type: payload.relationship_type as string,
        strength: payload.strength as number,
        notes: (payload.notes as string) ?? "",
      });
      break;
    }
  }
}

export function processIngestReview(
  userId: string,
  batchId: string,
  decisions: Array<{ id: string; accepted: boolean }>
): void {
  const batch = getIngestBatch(userId, batchId);
  if (!batch) throw new Error("Batch not found");

  const suggestions = listIngestSuggestions(batchId);

  for (const decision of decisions) {
    updateIngestSuggestion(decision.id, decision.accepted);
    if (decision.accepted) {
      const suggestion = suggestions.find((s) => s.id === decision.id);
      if (suggestion) applyIngestSuggestion(userId, suggestion);
    }
  }

  const updated = listIngestSuggestions(batchId);
  const allReviewed = updated.every((s) => s.accepted !== null);
  if (allReviewed) {
    updateIngestBatchStatus(batchId, "applied");
  } else {
    updateIngestBatchStatus(batchId, "reviewed");
  }
}
