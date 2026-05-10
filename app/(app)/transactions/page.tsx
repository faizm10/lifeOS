import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTransactions } from "@/lib/queries";
import { definePageMeta } from "@/lib/seo";
import TransactionsClient from "./TransactionsClient";

export const metadata: Metadata = definePageMeta({
  title: "Transactions",
  description: "Income and expense ledger in LifeOS — record flows, see totals, and understand your month.",
  path: "/transactions",
});

export default async function TransactionsPage() {
  const session      = await auth.api.getSession({ headers: headers() });
  const transactions = getTransactions(session!.user.id);
  return <TransactionsClient initialTransactions={transactions} />;
}
