import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "LifeOS",
  description: "Personal almanac — finance & life tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="grid min-h-screen" style={{ gridTemplateColumns: "220px 1fr" }}>
          <Sidebar />
          <main className="min-w-0 flex flex-col">
            <Topbar />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
