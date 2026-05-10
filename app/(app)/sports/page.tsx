import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSportsLog } from "@/lib/queries";
import SportsClient from "./SportsClient";

export default async function SportsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const log     = getSportsLog(session!.user.id);
  return <SportsClient initialLog={log} />;
}
