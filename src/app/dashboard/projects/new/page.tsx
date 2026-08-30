import { DashboardHeader } from "@/components/dashboard/Header";
import { ProjectForm } from "@/components/dashboard/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Add New Project"
        subtitle="Create a new showcase project with Supabase storage uploads."
      />

      <ProjectForm />
    </div>
  );
}
