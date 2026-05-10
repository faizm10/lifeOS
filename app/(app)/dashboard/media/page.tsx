import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMedia } from "@/lib/queries";
import { definePageMeta } from "@/lib/seo";
import MediaClient from "./MediaClient";

export const metadata: Metadata = definePageMeta({
  title: "Media",
  description: "Books, films, and media in LifeOS — track what you consume and what is next.",
  path: "/media",
});

export default async function MediaPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const media   = getMedia(session!.user.id);
  return <MediaClient initialMedia={media} />;
}
