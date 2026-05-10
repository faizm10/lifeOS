import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSidebarCounts } from "@/lib/queries";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";

/** Logged-in app is private; keep rich previews but avoid indexing personal data. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
  },
  twitter: { card: "summary_large_image", description: SITE_DESCRIPTION },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) redirect("/login");

  const counts   = getSidebarCounts(session.user.id);
  const userName = session.user.name ?? "";

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: "220px 1fr" }}>
      <Sidebar userName={userName} counts={counts} />
      <main className="min-w-0 flex flex-col">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
