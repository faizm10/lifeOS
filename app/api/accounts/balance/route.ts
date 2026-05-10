import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateAccountBalance } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, balance } = await req.json();
  updateAccountBalance(id, session.user.id, balance);
  return NextResponse.json({ ok: true });
}
