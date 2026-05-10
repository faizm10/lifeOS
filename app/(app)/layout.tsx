import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSidebarCounts } from "@/lib/queries";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

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
