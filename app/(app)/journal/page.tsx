import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getJournalEntries } from "@/lib/queries";
import { definePageMeta } from "@/lib/seo";
import JournalClient from "./JournalClient";

export const metadata: Metadata = definePageMeta({
  title: "Journal",
  description: "Daily journal in LifeOS — capture thoughts, titles, and entries in your personal almanac.",
  path: "/journal",
});

export default async function JournalPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const entries = getJournalEntries(session!.user.id);
  return <JournalClient initialEntries={entries} userId={session!.user.id} />;
}
