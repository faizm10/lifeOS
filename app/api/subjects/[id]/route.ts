import { NextRequest, NextResponse } from "next/server";
import {
  deleteSubject,
  getSubject,
  updateSubject,
} from "@/lib/queries";
import { requireUserId } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const subject = getSubject(userId, id);
    if (!subject) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(subject);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const body = await req.json();
    const subject = updateSubject(userId, id, body);
    if (!subject) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(subject);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const userId = await requireUserId();
    const { id } = await params;
    const ok = deleteSubject(userId, id);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
