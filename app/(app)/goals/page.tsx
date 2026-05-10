import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getGoals } from "@/lib/queries";
import GoalsClient from "./GoalsClient";

export default async function GoalsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const goals   = getGoals(session!.user.id);
  return <GoalsClient initialGoals={goals} />;
}
