import { ProjectCard } from "@/components";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { getAllProjects } from "@/data/projects";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Abir Mahmud",
  description: "A complete list of projects built by Abir Mahmud.",
};

const ProjectsPage = () => {
  const projects = getAllProjects();

  return (
    <SectionWrapper className="section-bg-projects min-h-[70vh]">
      <SectionTitle title="All Projects" subtitle="// Everything I've built so far" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default ProjectsPage;
