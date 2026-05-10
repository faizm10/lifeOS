import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMedia } from "@/lib/queries";
import MediaClient from "./MediaClient";

export default async function MediaPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const media   = getMedia(session!.user.id);
  return <MediaClient initialMedia={media} />;
}
