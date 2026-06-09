import { NextResponse } from "next/server";
import { requireUserId } from "./session";

export async function withAuth<T>(
  handler: (userId: string) => Promise<T>
): Promise<NextResponse> {
  try {
    const userId = await requireUserId();
    const result = await handler(userId);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
