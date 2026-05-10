import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

const ROUTES = [
  "/",
  "/login",
  "/signup",
  "/bills",
  "/transactions",
  "/goals",
  "/journal",
  "/wins",
  "/sports",
  "/wishlist",
  "/media",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  return ROUTES.map((path, i) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
    priority: path === "/" ? 1 : 0.7 - i * 0.03,
  }));
}
