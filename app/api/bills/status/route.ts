import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateBillStatus } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  updateBillStatus(id, session.user.id, status);
  return NextResponse.json({ ok: true });
}
