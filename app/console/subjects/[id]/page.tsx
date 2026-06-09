import { notFound } from "next/navigation";
import { ConsoleShell } from "@/components/console/ConsoleShell";
import { SubjectDossier } from "@/components/subjects/SubjectDossier";
import {
  getDossierSections,
  getSubject,
  listRelationships,
  listSignals,
  listSubjects,
  listTraits,
} from "@/lib/queries";
import { requireUserId } from "@/lib/session";

export default async function SubjectPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = await requireUserId();
  const subject = getSubject(userId, params.id);
  if (!subject) notFound();

  const signals = listSignals(userId, params.id);
  const traits = listTraits(userId, params.id);
  const relationships = listRelationships(userId, params.id);
  const sections = getDossierSections(userId, params.id);
  const allSubjects = listSubjects(userId);

  return (
    <ConsoleShell title="SUBJECT DOSSIER">
      <SubjectDossier
        subject={subject}
        signals={signals}
        traits={traits}
        relationships={relationships}
        sections={sections}
        allSubjects={allSubjects}
      />
    </ConsoleShell>
  );
}
