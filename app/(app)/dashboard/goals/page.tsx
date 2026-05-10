import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getGoals } from "@/lib/queries";
import { definePageMeta } from "@/lib/seo";
import GoalsClient from "./GoalsClient";

export const metadata: Metadata = definePageMeta({
  title: "Goals",
  description: "Savings goals in LifeOS — set targets, track progress, and keep momentum on what matters.",
  path: "/goals",
});

export default async function GoalsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const goals   = getGoals(session!.user.id);
  return <GoalsClient initialGoals={goals} />;
}
