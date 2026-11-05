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
        subtitle="Commerce platforms, affiliate tools, and products built for real workflows"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button className="rounded-full px-6" asChild>
          <Link href="/projects">
            Show All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  );
};
