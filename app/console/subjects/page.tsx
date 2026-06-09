import Link from "next/link";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import {
  LinkButton,
  Panel,
  RelevantChip,
  SectionLabel,
} from "@/components/ui";
import { listSubjects } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const userId = await requireUserId();
  const q = searchParams.q ?? "";
  const subjects = listSubjects(userId, q);

  return (
    <ConsoleShell title="SUBJECT INDEX">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <form className="flex gap-2" action="/console/subjects" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search subjects…"
            className="terminal-input w-64"
          />
          <button type="submit" className="terminal-btn">
            Search
          </button>
        </form>
        <LinkButton href="/console/subjects/new" variant="primary">
          New subject
        </LinkButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((s) => {
          const chipVariant =
            s.status === "archived"
              ? "archived"
              : s.status === "stale"
                ? "stale"
                : "relevant";
          return (
            <Link
              key={s.id}
              href={`/console/subjects/${s.id}`}
              className="terminal-panel block p-4 transition hover:border-accent/30"
            >
              <SectionLabel>§ ASSET FILE</SectionLabel>
              <h2 className="mt-2 font-medium text-ink">{s.display_name}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <RelevantChip variant={chipVariant} />
                <span className="font-mono text-[10px] text-dim">
                  {s.signal_count} signals
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <Panel className="mt-8 text-center">
          <p className="font-mono text-sm text-muted">
            No subjects found. Create your first asset file.
          </p>
        </Panel>
      )}
    </ConsoleShell>
  );
}
