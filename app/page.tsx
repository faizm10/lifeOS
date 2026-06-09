import Link from "next/link";
import { LinkButton, SectionLabel, StatusDot } from "@/components/ui";

export default function LandingPage() {
  return (
    <div className="scanline min-h-screen">
      <header className="border-b border-hairline bg-panel/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-mono text-sm tracking-[0.3em] text-accent">
            RELEVANT
          </span>
          <div className="flex gap-3">
            <LinkButton href="/login">Sign in</LinkButton>
            <LinkButton href="/signup" variant="primary">
              Enter console
            </LinkButton>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-6 flex items-center gap-2 font-mono text-xs text-dim">
          <StatusDot />
          <span>Machine idle — awaiting operator</span>
        </div>

        <h1 className="text-5xl font-semibold tracking-tight text-ink md:text-7xl">
          Relevant<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Private relationship intelligence — dossiers, behavioral signals, and
          your network graph. Local-first. You control every observation.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <LinkButton href="/signup" variant="primary">
            Request access
          </LinkButton>
          <Link
            href="#modules"
            className="terminal-btn inline-flex items-center text-muted hover:text-ink"
          >
            Explore modules
          </Link>
        </div>

        <section id="modules" className="mt-24 grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Dossiers",
              code: "SUBJECT",
              body: "Structured intel on people you care about — bio, context, open questions.",
            },
            {
              title: "Signals",
              code: "EVENT",
              body: "Timestamped observations. Irrelevant noise filtered; relevant moments kept.",
            },
            {
              title: "Network",
              code: "GRAPH",
              body: "Relationship topology — who connects to whom, and how strongly.",
            },
            {
              title: "The Machine",
              code: "AI",
              body: "Paste conversations; review AI suggestions before anything is written.",
            },
          ].map((m) => (
            <article key={m.title} className="terminal-panel p-6">
              <SectionLabel>§ {m.code}</SectionLabel>
              <h2 className="mt-2 text-xl font-medium text-ink">{m.title}</h2>
              <p className="mt-2 text-sm text-muted">{m.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 terminal-panel border-accent/20 p-8">
          <SectionLabel>§ TRUST // PRIVACY</SectionLabel>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Single-user, private database. No telemetry on subject content. For
            personal reflection and remembering people you know — not for
            stalking or non-consensual profiling. Every AI output is suggested;
            nothing is written without your confirmation.
          </p>
        </section>
      </main>

      <footer className="border-t border-hairline py-8 text-center font-mono text-[10px] text-dim">
        Operator console v0.1 — ethical personal intelligence
      </footer>
    </div>
  );
}
