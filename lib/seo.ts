import type { Metadata } from "next";

export const SITE_NAME = "LifeOS";

export const SITE_DESCRIPTION =
  "Personal almanac — finance, goals, bills, journal, wins, sports, wishlist, and media in one calm dashboard.";

/** Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://yoursite.com) for correct canonical and OG URLs. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export type PageMetaInput = {
  title: string;
  description?: string;
  path: string;
};

/**
 * Per-route metadata: title, description, canonical, Open Graph, Twitter.
 * Use with a parent layout `robots` policy for private areas, or pass `private: true`.
 */
export function definePageMeta({
  title,
  description = SITE_DESCRIPTION,
  path,
  private: isPrivate,
}: PageMetaInput & { private?: boolean }): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} · ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(isPrivate
      ? {
          robots: {
            index: false,
            follow: false,
            googleBot: { index: false, follow: false },
          } satisfies Metadata["robots"],
        }
      : {}),
  };
}
