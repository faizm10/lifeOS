import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="mb-8 font-mono text-sm tracking-[0.3em] text-accent"
      >
        RELEVANT
      </Link>
      <AuthForm mode="signup" />
      <p className="mt-6 font-mono text-xs text-dim">
        Already registered?{" "}
        <Link href="/login" className="text-link hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
