import { NetworkExplorer } from "@/components/NetworkExplorer";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { Panel, SectionLabel } from "@/components/ui";
import { getNetworkData } from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export default async function NetworkPage() {
  const userId = await requireUserId();
  const { nodes, edges } = getNetworkData(userId);

  return (
    <ConsoleShell title="NETWORK GRAPH">
      <Panel className="mb-4">
        <SectionLabel>§ TOPOLOGY // RELATIONSHIPS</SectionLabel>
        <p className="mt-2 font-mono text-xs text-muted">
          {nodes.length} nodes · {edges.length} edges — click a node for dossier
          preview
        </p>
      </Panel>
      <NetworkExplorer nodes={nodes} edges={edges} />
    </ConsoleShell>
  );
}
