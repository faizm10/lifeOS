import { NextRequest, NextResponse } from "next/server";
import { generateBriefing } from "@/lib/machine";
import { getSubject, listSignals, listTraits } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { subject_id } = await req.json();
    if (!subject_id) {
      return NextResponse.json({ error: "subject_id required" }, { status: 400 });
    }

    const subject = getSubject(userId, subject_id);
    if (!subject) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const signals = listSignals(userId, subject_id, 20);
    const traits = listTraits(userId, subject_id);

    const briefing = await generateBriefing(
      subject.display_name,
      signals.map((s) => s.content),
      traits.map((t) => `${t.dimension}: ${t.value}`)
    );

    return NextResponse.json(briefing);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
