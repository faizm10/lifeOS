import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBills } from "@/lib/queries";
import BillsClient from "./BillsClient";

export default async function BillsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const bills   = getBills(session!.user.id);
  return <BillsClient initialBills={bills} userId={session!.user.id} />;
}
