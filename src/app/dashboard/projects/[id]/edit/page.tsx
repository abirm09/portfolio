import { DashboardHeader } from "@/components/dashboard/Header";
import { ProjectForm } from "@/components/dashboard/ProjectForm";
import { getProjectById } from "@/lib/supabase/projects";
import { notFound } from "next/navigation";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    notFound();
  }

  const project = await getProjectById(numId);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={`Edit "${project.title}"`}
        subtitle="Update project details, links, tech stack, and media gallery."
      />

      <ProjectForm initialData={project} />
    </div>
  );
}
