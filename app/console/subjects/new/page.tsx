import { ConsoleShell } from "@/components/console/ConsoleShell";
import { NewSubjectForm } from "@/components/subjects/NewSubjectForm";
import { SectionLabel } from "@/components/ui";

export default function NewSubjectPage() {
  return (
    <ConsoleShell title="NEW SUBJECT">
      <div className="mx-auto max-w-lg">
        <SectionLabel>§ SUBJECT // CREATE</SectionLabel>
        <div className="mt-4">
          <NewSubjectForm />
        </div>
      </div>
    </ConsoleShell>
  );
}
