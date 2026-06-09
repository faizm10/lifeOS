import { NextRequest, NextResponse } from "next/server";
import { getDossierSections, upsertDossierSection } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const subjectId = req.nextUrl.searchParams.get("subject_id");
    if (!subjectId) {
      return NextResponse.json({ error: "subject_id required" }, { status: 400 });
    }
    return NextResponse.json(getDossierSections(userId, subjectId));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const { subject_id, section_key, content } = await req.json();
    if (!subject_id || !section_key) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const section = upsertDossierSection(
      userId,
      subject_id,
      section_key,
      content ?? ""
    );
    return NextResponse.json(section);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
