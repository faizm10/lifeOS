import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteJournalEntry } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  deleteJournalEntry(params.id, session.user.id);
  return NextResponse.json({ ok: true });
}
