import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAccounts } from "@/lib/queries";
import AccountsClient from "./AccountsClient";

export default async function AccountsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const accounts = getAccounts(session!.user.id);
  return <AccountsClient initialAccounts={accounts} />;
}
