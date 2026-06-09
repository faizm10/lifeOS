import { NextResponse } from "next/server";
import { getNetworkData } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export async function GET() {
  try {
    const userId = await requireUserId();
    return NextResponse.json(getNetworkData(userId));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
