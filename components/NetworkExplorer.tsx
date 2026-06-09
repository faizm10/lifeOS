"use client";

import { useState } from "react";
import { NetworkGraph, NetworkSidePanel } from "@/components/NetworkGraph";
import type { NetworkEdge, NetworkNode } from "@/lib/types";

export function NetworkExplorer({
  nodes,
  edges,
}: {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}) {
  const [selected, setSelected] = useState<{
    id: string;
    label: string;
  } | null>(null);

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="flex-1">
        <NetworkGraph
          nodes={nodes}
          edges={edges}
          height={560}
          onNodeClick={(id) => {
            const node = nodes.find((n) => n.id === id);
            if (node) setSelected({ id: node.id, label: node.label });
          }}
        />
      </div>
      {selected && (
        <NetworkSidePanel
          subjectId={selected.id}
          label={selected.label}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
