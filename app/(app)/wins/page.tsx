import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getWins } from "@/lib/queries";
import WinsClient from "./WinsClient";

export default async function WinsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const wins    = getWins(session!.user.id);
  return <WinsClient initialWins={wins} />;
}
