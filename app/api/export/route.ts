import { NextResponse } from "next/server";
import { exportUserData } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export async function GET() {
  try {
    const userId = await requireUserId();
    const data = exportUserData(userId);
    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="relevant-export.json"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
