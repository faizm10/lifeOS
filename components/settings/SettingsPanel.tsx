"use client";

import { useState } from "react";
import { Button, Panel, SectionLabel } from "@/components/ui";

export function SettingsPanel() {
  const [exporting, setExporting] = useState(false);

  async function downloadExport() {
    setExporting(true);
    const res = await fetch("/api/export");
    setExporting(false);
    if (!res.ok) return;
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relevant-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Panel>
        <SectionLabel>§ CONFIG // API</SectionLabel>
        <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
          Set <code className="text-link">OPENAI_API_KEY</code> in your
          environment for full Machine extraction and briefings. Without it,
          heuristic fallback is used.
        </p>
      </Panel>

      <Panel>
        <SectionLabel>§ DATA // EXPORT</SectionLabel>
        <p className="mt-3 mb-4 font-mono text-xs text-muted">
          Download all subjects, signals, traits, and relationships as JSON.
        </p>
        <Button variant="primary" onClick={downloadExport} disabled={exporting}>
          {exporting ? "Exporting…" : "Export data"}
        </Button>
      </Panel>

      <Panel className="border-danger/20">
        <SectionLabel>§ ETHICS // DISCLAIMER</SectionLabel>
        <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
          This console is for personal reflection and remembering people you
          know. Do not use it for stalking, harassment, or non-consensual
          profiling. You alone are responsible for how you use this data.
        </p>
      </Panel>
    </div>
  );
}
