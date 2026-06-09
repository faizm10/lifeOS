import { IngestConsole } from "@/components/ingest/IngestConsole";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { listIngestBatches } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export default async function IngestPage() {
  const userId = await requireUserId();
  const batches = listIngestBatches(userId);

  return (
    <ConsoleShell title="INGEST">
      <IngestConsole batches={batches} />
    </ConsoleShell>
  );
}
