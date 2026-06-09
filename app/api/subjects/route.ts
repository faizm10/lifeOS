import { NextRequest, NextResponse } from "next/server";
import { createSubject, listSubjects } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const q = req.nextUrl.searchParams.get("q") ?? undefined;
    return NextResponse.json(listSubjects(userId, q));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    if (!body.display_name?.trim()) {
      return NextResponse.json(
        { error: "display_name required" },
        { status: 400 }
      );
    }
    const subject = createSubject(userId, body);
    return NextResponse.json(subject, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
