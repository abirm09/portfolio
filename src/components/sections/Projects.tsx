import { Button, ProjectCard } from "@/components";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { getFeaturedProjects } from "@/lib/supabase/projects";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Projects = async () => {
  const projects = await getFeaturedProjects(3);

  return (
    <SectionWrapper id="projects" className="section-bg-projects">
      <SectionTitle
        title="Featured Projects"
        subtitle="// A selection of projects I've worked on"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="gradient" asChild>
          <Link href="/projects">
            Show All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  );
};
