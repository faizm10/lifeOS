import { NextRequest, NextResponse } from "next/server";
import {
  createRelationship,
  deleteRelationship,
  listRelationships,
} from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const subjectId = req.nextUrl.searchParams.get("subject_id") ?? undefined;
    return NextResponse.json(listRelationships(userId, subjectId));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    if (!body.from_subject_id || !body.to_subject_id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const rel = createRelationship(userId, body);
    return NextResponse.json(rel, { status: 201 });
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
    deleteRelationship(userId, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
