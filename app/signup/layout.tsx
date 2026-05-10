import type { Metadata } from "next";
import { definePageMeta } from "@/lib/seo";

export const metadata: Metadata = definePageMeta({
  title: "Create account",
  description: "Create a LifeOS account — start tracking money, goals, journal, wins, and more.",
  path: "/signup",
});

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
