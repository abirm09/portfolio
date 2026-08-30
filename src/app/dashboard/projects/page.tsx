import { DashboardHeader } from "@/components/dashboard/Header";
import { ProjectsListClient } from "@/components/dashboard/ProjectsListClient";
import { getProjects } from "@/lib/supabase/projects";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Portfolio Projects"
        subtitle={`Total of ${projects.length} projects stored in database.`}
        action={{
          label: "New Project",
          href: "/dashboard/projects/new",
          icon: Plus,
        }}
      />

      <ProjectsListClient initialProjects={projects} />
    </div>
  );
}
