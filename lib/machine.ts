import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import type { ExtractionResult } from "./types";

const extractionSchema = z.object({
  subjects: z.array(
    z.object({
      name: z.string(),
      aliases: z.array(z.string()).optional(),
      is_new: z.boolean(),
    })
  ),
  signals: z.array(
    z.object({
      subject_name: z.string(),
      type: z.enum([
        "observation",
        "interaction",
        "mood",
        "topic",
        "other",
      ]),
      content: z.string(),
      observed_at: z.string().optional(),
      confidence: z.number().min(0).max(1),
    })
  ),
  traits: z.array(
    z.object({
      subject_name: z.string(),
      dimension: z.string(),
      value: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ),
  relationships: z.array(
    z.object({
      from_name: z.string(),
      to_name: z.string(),
      relationship_type: z.enum([
        "friend",
        "close_friend",
        "family",
        "colleague",
        "partner",
        "met_through",
        "tension",
        "unknown",
      ]),
      strength: z.number().min(0).max(1),
      notes: z.string().optional(),
    })
  ),
});

const briefingSchema = z.object({
  summary: z.array(z.string()),
  watch_for: z.array(z.string()),
});

export async function extractFromText(
  rawText: string,
  existingNames: string[]
): Promise<ExtractionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return heuristicExtract(rawText, existingNames);
  }

  const openai = createOpenAI({ apiKey });
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: extractionSchema,
    system: `You are The Machine — a neutral intelligence analyst. Extract people, observations, personality traits, and relationships from pasted text. Use calm, analytical language. Existing known subjects: ${existingNames.join(", ") || "none"}. Mark is_new true for people not in the existing list.`,
    prompt: rawText,
  });
  return object;
}

export async function generateBriefing(
  subjectName: string,
  signals: string[],
  traits: string[]
): Promise<{ summary: string[]; watch_for: string[] }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      summary: [
        `Subject ${subjectName}: ${signals.length} recent signals on record.`,
        traits.length
          ? `Traits: ${traits.slice(0, 3).join("; ")}`
          : "No trait data yet.",
      ],
      watch_for: ["Add OPENAI_API_KEY for AI-generated briefings."],
    };
  }

  const openai = createOpenAI({ apiKey });
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: briefingSchema,
    system:
      "You are The Machine. Write neutral third-person intelligence briefings. No judgment. 3-5 summary bullets and 2-3 watch-for patterns.",
    prompt: `Subject: ${subjectName}\n\nRecent signals:\n${signals.join("\n")}\n\nTraits:\n${traits.join("\n")}`,
  });
  return object;
}

function heuristicExtract(
  rawText: string,
  existingNames: string[]
): ExtractionResult {
  const lines = rawText.split("\n").filter((l) => l.trim());
  const existingLower = existingNames.map((n) => n.toLowerCase());

  return {
    subjects: [],
    signals: lines.slice(0, 5).map((line) => ({
      subject_name: existingNames[0] ?? "Unknown",
      type: "observation" as const,
      content: line.trim(),
      confidence: 0.5,
    })),
    traits: [],
    relationships: [],
  };
}
