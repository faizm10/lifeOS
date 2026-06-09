import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}
