import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBills } from "@/lib/queries";
import { definePageMeta } from "@/lib/seo";
import BillsClient from "./BillsClient";

export const metadata: Metadata = definePageMeta({
  title: "Bills",
  description: "Track recurring bills and due dates in LifeOS — know what is coming and stay ahead of payments.",
  path: "/bills",
});

export default async function BillsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const bills   = getBills(session!.user.id);
  return <BillsClient initialBills={bills} userId={session!.user.id} />;
}
