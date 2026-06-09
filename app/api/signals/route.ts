import { NextRequest, NextResponse } from "next/server";
import { createSignal, deleteSignal, listSignals } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const subjectId = req.nextUrl.searchParams.get("subject_id") ?? undefined;
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 50);
    return NextResponse.json(listSignals(userId, subjectId, limit));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    if (!body.subject_id || !body.content?.trim()) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const signal = createSignal(userId, body);
    return NextResponse.json(signal, { status: 201 });
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
    deleteSignal(userId, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
