import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { insertWishlistItem } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const item = await req.json();
  insertWishlistItem({ ...item, user_id: session.user.id });
  return NextResponse.json({ ok: true });
}
