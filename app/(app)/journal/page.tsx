import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getJournalEntries } from "@/lib/queries";
import JournalClient from "./JournalClient";

export default async function JournalPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const entries = getJournalEntries(session!.user.id);
  return <JournalClient initialEntries={entries} userId={session!.user.id} />;
}
