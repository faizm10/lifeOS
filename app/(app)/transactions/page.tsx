import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTransactions } from "@/lib/queries";
import TransactionsClient from "./TransactionsClient";

export default async function TransactionsPage() {
  const session      = await auth.api.getSession({ headers: headers() });
  const transactions = getTransactions(session!.user.id);
  return <TransactionsClient initialTransactions={transactions} />;
}
