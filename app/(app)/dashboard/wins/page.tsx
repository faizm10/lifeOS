import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getWins } from "@/lib/queries";
import { definePageMeta } from "@/lib/seo";
import WinsClient from "./WinsClient";

export const metadata: Metadata = definePageMeta({
  title: "Wins",
  description: "Log wins and milestones in LifeOS — celebrate progress with tags and notes.",
  path: "/wins",
});

export default async function WinsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const wins    = getWins(session!.user.id);
  return <WinsClient initialWins={wins} />;
}
