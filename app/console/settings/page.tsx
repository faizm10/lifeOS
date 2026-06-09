import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { ConsoleShell } from "@/components/console/ConsoleShell";

export default function SettingsPage() {
  return (
    <ConsoleShell title="SETTINGS">
      <SettingsPanel />
    </ConsoleShell>
  );
}
