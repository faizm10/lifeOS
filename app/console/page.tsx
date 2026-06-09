import Link from "next/link";
import { MiniNetworkGraph } from "@/components/NetworkGraph";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import {
  LinkButton,
  Panel,
  RelevantChip,
  SectionLabel,
  StatusDot,
  TerminalLog,
} from "@/components/ui";
import { getDashboardStats } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export default async function DashboardPage() {
  const userId = await requireUserId();
  const stats = getDashboardStats(userId);

  return (
    <ConsoleShell title="MISSION DASHBOARD">
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <SectionLabel>§ SIGNAL // FEED</SectionLabel>
            <Link
              href="/console/ingest"
              className="font-mono text-xs text-link hover:underline"
            >
              Ingest →
            </Link>
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {stats.recentSignals.map((s) => (
              <TerminalLog
                key={s.id}
                timestamp={s.observed_at}
                content={s.content}
                type={s.type}
              />
            ))}
            {stats.recentSignals.length === 0 && (
              <p className="font-mono text-sm text-dim">No signals yet.</p>
            )}
          </div>
        </Panel>

        <Panel>
          <SectionLabel>§ MACHINE // STATUS</SectionLabel>
          <ul className="mt-4 space-y-3 font-mono text-xs">
            <li className="flex items-center gap-2">
              <StatusDot />
              <span className="text-ink">Online</span>
            </li>
            <li className="text-muted">
              Subjects tracked:{" "}
              <span className="text-link">{stats.subjectCount}</span>
            </li>
            <li className="text-muted">
              Pending suggestions:{" "}
              <span className="text-accent">{stats.pendingSuggestions}</span>
            </li>
          </ul>
          {stats.pendingSuggestions > 0 && (
            <LinkButton href="/console/ingest" variant="primary" className="mt-4">
              Review queue
            </LinkButton>
          )}
        </Panel>

        <Panel className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>§ NETWORK // SNAPSHOT</SectionLabel>
            <Link
              href="/console/network"
              className="font-mono text-xs text-link hover:underline"
            >
              Full graph →
            </Link>
          </div>
          <MiniNetworkGraph
            nodes={stats.network.nodes}
            edges={stats.network.edges}
          />
        </Panel>

        <Panel>
          <SectionLabel>§ RELEVANT TODAY</SectionLabel>
          <ul className="mt-3 space-y-2">
            {stats.relevantSubjects.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/console/subjects/${s.id}`}
                  className="flex items-center justify-between font-mono text-xs text-ink hover:text-accent"
                >
                  {s.display_name}
                  <RelevantChip variant="relevant" />
                </Link>
              </li>
            ))}
            {stats.relevantSubjects.length === 0 && (
              <p className="font-mono text-xs text-dim">No recent activity.</p>
            )}
          </ul>
        </Panel>

        <Panel className="lg:col-span-3">
          <SectionLabel>§ STALE DOSSIERS</SectionLabel>
          <p className="mt-1 mb-3 font-mono text-[10px] text-dim">
            No signal in 30+ days
          </p>
          <ul className="flex flex-wrap gap-3">
            {stats.staleSubjects.map((s) => (
              <Link
                key={s.id}
                href={`/console/subjects/${s.id}`}
                className="terminal-panel px-4 py-2 font-mono text-xs hover:border-accent/40"
              >
                {s.display_name}{" "}
                <RelevantChip variant="stale" />
              </Link>
            ))}
            {stats.staleSubjects.length === 0 && (
              <p className="font-mono text-xs text-dim">All dossiers current.</p>
            )}
          </ul>
        </Panel>
      </div>
    </ConsoleShell>
  );
}
