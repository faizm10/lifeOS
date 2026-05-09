import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: "220px 1fr" }}>
      <Sidebar />
      <main className="min-w-0 flex flex-col">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
