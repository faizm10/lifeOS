import { NextRequest, NextResponse } from "next/server";
import { createTrait, deleteTrait, listTraits } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const subjectId = req.nextUrl.searchParams.get("subject_id");
    if (!subjectId) {
      return NextResponse.json({ error: "subject_id required" }, { status: 400 });
    }
    return NextResponse.json(listTraits(userId, subjectId));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    if (!body.subject_id || !body.dimension || !body.value) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const trait = createTrait(userId, body);
    return NextResponse.json(trait, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    deleteTrait(userId, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
