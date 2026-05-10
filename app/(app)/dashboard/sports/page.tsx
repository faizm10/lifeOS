import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSportsLog } from "@/lib/queries";
import { definePageMeta } from "@/lib/seo";
import SportsClient from "./SportsClient";

export const metadata: Metadata = definePageMeta({
  title: "Sports",
  description: "Sports and activity log in LifeOS — dates, sessions, and metrics in one place.",
  path: "/sports",
});

export default async function SportsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const log     = getSportsLog(session!.user.id);
  return <SportsClient initialLog={log} />;
}
