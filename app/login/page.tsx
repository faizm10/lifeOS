"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await authClient.signIn.email({ email, password });

    if (err) {
      setError(err.message ?? "Invalid credentials.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-10">
          <p className="label-mono mb-3">Personal Almanac</p>
          <h1 className="font-serif text-3xl text-ink leading-tight">
            Sign in
          </h1>
          <div className="hairline-strong mt-4" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-mono block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink
                         py-2 outline-none focus:border-[var(--accent)] transition-colors
                         placeholder:text-ink-3"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="label-mono block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-rule font-mono text-sm text-ink
                         py-2 outline-none focus:border-[var(--accent)] transition-colors
                         placeholder:text-ink-3"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-[var(--accent)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn w-full justify-center mt-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Folio */}
        <div className="hairline mt-10" />
        <p className="label-mono mt-3 text-center">LifeOS — {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
