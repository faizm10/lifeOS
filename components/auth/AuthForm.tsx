"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup") {
      const { error: err } = await authClient.signUp.email({
        email,
        password,
        name: name || email.split("@")[0],
      });
      setLoading(false);
      if (err) {
        setError(err.message ?? "Sign up failed");
        return;
      }
    } else {
      const { error: err } = await authClient.signIn.email({
        email,
        password,
      });
      setLoading(false);
      if (err) {
        setError(err.message ?? "Sign in failed");
        return;
      }
    }

    router.push("/console");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="terminal-panel mx-auto max-w-md space-y-4 p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
        § {mode === "login" ? "AUTH // SIGN IN" : "AUTH // REGISTER"}
      </p>
      {mode === "signup" && (
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <Input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        required
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <p className="font-mono text-xs text-danger">{error}</p>
      )}
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? "…" : mode === "login" ? "Enter console" : "Create account"}
      </Button>
    </form>
  );
}
