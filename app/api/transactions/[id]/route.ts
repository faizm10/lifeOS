import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteTransaction, updateTransaction } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  deleteTransaction(params.id, session.user.id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  updateTransaction(params.id, session.user.id, data);
  return NextResponse.json({ ok: true });
}
