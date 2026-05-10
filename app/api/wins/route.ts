import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { insertWin } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const win = await req.json();
  insertWin({ ...win, user_id: session.user.id });
  return NextResponse.json({ ok: true });
}
