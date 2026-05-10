import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteMediaItem, updateMediaItem } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  deleteMediaItem(params.id, session.user.id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  updateMediaItem(params.id, session.user.id, data);
  return NextResponse.json({ ok: true });
}
