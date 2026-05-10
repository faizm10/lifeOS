import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getWishlist } from "@/lib/queries";
import { definePageMeta } from "@/lib/seo";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = definePageMeta({
  title: "Wishlist",
  description: "Wishlist in LifeOS — items you want, notes, and priorities without losing the list.",
  path: "/wishlist",
});

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const items   = getWishlist(session!.user.id);
  return <WishlistClient initialItems={items} />;
}
