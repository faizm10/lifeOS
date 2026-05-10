import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getWishlist } from "@/lib/queries";
import WishlistClient from "./WishlistClient";

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const items   = getWishlist(session!.user.id);
  return <WishlistClient initialItems={items} />;
}
