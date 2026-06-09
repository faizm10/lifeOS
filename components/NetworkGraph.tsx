"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  Controls,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { NetworkEdge, NetworkNode } from "@/lib/types";

function toFlowNodes(nodes: NetworkNode[]): Node[] {
  return nodes.map((n, i) => ({
    id: n.id,
    position: {
      x: (i % 4) * 180 + 40,
      y: Math.floor(i / 4) * 120 + 40,
    },
    data: { label: n.label },
    style: {
      background: "#111820",
      border: "1px solid #30363d",
      color: "#c9d1d9",
      fontSize: 11,
      fontFamily: "JetBrains Mono, monospace",
      padding: 8,
      borderRadius: 2,
      minWidth: 100,
    },
  }));
}

function toFlowEdges(edges: NetworkEdge[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.from,
    target: e.to,
    label: e.relationship_type.replace("_", " "),
    style: { stroke: "#39c5cf", strokeWidth: 1 + e.strength },
    labelStyle: { fill: "#8b949e", fontSize: 9, fontFamily: "monospace" },
  }));
}

export function NetworkGraph({
  nodes,
  edges,
  height = 520,
  onNodeClick,
}: {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  height?: number;
  onNodeClick?: (id: string) => void;
}) {
  const flowNodes = useMemo(() => toFlowNodes(nodes), [nodes]);
  const flowEdges = useMemo(() => toFlowEdges(edges), [edges]);

  if (nodes.length === 0) {
    return (
      <div
        className="terminal-panel flex items-center justify-center font-mono text-sm text-muted"
        style={{ height }}
      >
        No subjects in network. Add subjects and relationships first.
      </div>
    );
  }

  return (
    <div className="terminal-panel overflow-hidden" style={{ height }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        nodesDraggable
        nodesConnectable={false}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
      >
        <Background color="#21262d" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export function MiniNetworkGraph({
  nodes,
  edges,
}: {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}) {
  const flowNodes = useMemo(() => toFlowNodes(nodes), [nodes]);
  const flowEdges = useMemo(() => toFlowEdges(edges), [edges]);

  return (
    <div className="terminal-panel h-48 overflow-hidden">
      {nodes.length === 0 ? (
        <div className="flex h-full items-center justify-center font-mono text-xs text-dim">
          Empty network
        </div>
      ) : (
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          fitView
          nodesDraggable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#21262d" gap={16} />
        </ReactFlow>
      )}
    </div>
  );
}

export function NetworkSidePanel({
  subjectId,
  label,
  onClose,
}: {
  subjectId: string;
  label: string;
  onClose: () => void;
}) {
  return (
    <div className="terminal-panel w-72 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs text-accent">[ PREVIEW ]</span>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-xs text-dim hover:text-ink"
        >
          ×
        </button>
      </div>
      <p className="mb-4 font-mono text-sm text-ink">{label}</p>
      <Link
        href={`/console/subjects/${subjectId}`}
        className="terminal-btn terminal-btn-primary inline-flex text-xs"
      >
        Open dossier →
      </Link>
    </div>
  );
}
