/**
 * Seed demo subjects for the first registered user.
 * Usage: npm run seed [userId]
 */
import db from "../lib/db";
import {
  createRelationship,
  createSignal,
  createSubject,
  createTrait,
  upsertDossierSection,
} from "../lib/queries";

const userId =
  process.argv[2] ??
  (db.prepare("SELECT id FROM user LIMIT 1").get() as { id: string } | undefined)
    ?.id;

if (!userId) {
  console.error("No user found. Create an account first, then run: npm run seed");
  process.exit(1);
}

const existing = db
  .prepare("SELECT COUNT(*) AS c FROM subjects WHERE user_id = ?")
  .get(userId) as { c: number };

if (existing.c > 0) {
  console.log("Subjects already exist for user — skipping seed.");
  process.exit(0);
}

const operator = createSubject(userId, {
  display_name: "You (Operator)",
  aliases: "me",
  tags: "self",
  notes: "Primary operator node in the network.",
  importance: 1,
});

const alex = createSubject(userId, {
  display_name: "Alex Chen",
  aliases: "AC",
  tags: "close,work",
  notes: "College friend, now at a startup.",
  importance: 0.9,
});

const sam = createSubject(userId, {
  display_name: "Sam Rivera",
  aliases: "",
  tags: "family",
  notes: "Cousin — monthly check-ins.",
  importance: 0.7,
});

const jordan = createSubject(userId, {
  display_name: "Jordan Lee",
  aliases: "JL",
  tags: "colleague",
  notes: "Met through Alex. Sharp analyst.",
  importance: 0.6,
});

upsertDossierSection(userId, alex.id, "overview",
  "Long-time friend. Values direct communication. Recently stressed about a product launch."
);
upsertDossierSection(userId, alex.id, "context",
  "Known since university. Shared apartment 2019–2021."
);

createSignal(userId, {
  subject_id: alex.id,
  type: "interaction",
  content: "Coffee catch-up — discussed new role and burnout risk.",
  source: "manual",
  observed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
});

createSignal(userId, {
  subject_id: sam.id,
  type: "observation",
  content: "Called to congratulate on new job. Warm, upbeat tone.",
  source: "manual",
  observed_at: new Date(Date.now() - 5 * 86400000).toISOString(),
});

createSignal(userId, {
  subject_id: jordan.id,
  type: "topic",
  content: "Interested in ML ops; asked for reading list.",
  source: "manual",
  observed_at: new Date(Date.now() - 10 * 86400000).toISOString(),
});

createTrait(userId, {
  subject_id: alex.id,
  dimension: "communication",
  value: "direct",
  source: "manual",
  confidence: 0.9,
});

createTrait(userId, {
  subject_id: sam.id,
  dimension: "temperament",
  value: "warm",
  source: "manual",
  confidence: 0.85,
});

createRelationship(userId, {
  from_subject_id: operator.id,
  to_subject_id: alex.id,
  relationship_type: "close_friend",
  strength: 0.95,
  notes: "",
});

createRelationship(userId, {
  from_subject_id: operator.id,
  to_subject_id: sam.id,
  relationship_type: "family",
  strength: 0.8,
  notes: "",
});

createRelationship(userId, {
  from_subject_id: alex.id,
  to_subject_id: jordan.id,
  relationship_type: "colleague",
  strength: 0.6,
  notes: "Same company",
});

createRelationship(userId, {
  from_subject_id: operator.id,
  to_subject_id: jordan.id,
  relationship_type: "friend",
  strength: 0.5,
  notes: "Met through Alex",
});

console.log("Seeded 4 demo subjects for user", userId);
