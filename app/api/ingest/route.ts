import { NextRequest, NextResponse } from "next/server";
import { processIngestReview } from "@/lib/ingest-apply";
import { extractFromText } from "@/lib/machine";
import {
  createIngestBatch,
  createIngestSuggestion,
  listIngestBatches,
  listSubjects,
} from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export async function GET() {
  try {
    const userId = await requireUserId();
    return NextResponse.json(listIngestBatches(userId));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();

    if (body.action === "review") {
      processIngestReview(userId, body.batch_id, body.decisions);
      return NextResponse.json({ ok: true });
    }

    const rawText = body.raw_text?.trim();
    if (!rawText) {
      return NextResponse.json({ error: "raw_text required" }, { status: 400 });
    }

    const subjects = listSubjects(userId);
    const existingNames = subjects.map((s) => s.display_name);
    const extraction = await extractFromText(rawText, existingNames);

    const batch = createIngestBatch(userId, rawText);
    const suggestions = [];

    for (const s of extraction.subjects.filter((x) => x.is_new)) {
      suggestions.push(
        createIngestSuggestion(batch.id, "new_subject", {
          name: s.name,
          aliases: s.aliases,
        })
      );
    }
    for (const sig of extraction.signals) {
      suggestions.push(
        createIngestSuggestion(batch.id, "signal", sig)
      );
    }
    for (const t of extraction.traits) {
      suggestions.push(createIngestSuggestion(batch.id, "trait", t));
    }
    for (const r of extraction.relationships) {
      suggestions.push(
        createIngestSuggestion(batch.id, "relationship", r)
      );
    }

    return NextResponse.json({ batch, suggestions }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
