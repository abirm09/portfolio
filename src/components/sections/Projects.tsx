import { Button, ProjectImage } from "@/components";
import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { getFeaturedProjects, TECH_STACK_LABELS } from "@/data/projects";
import { ArrowRight, ExternalLink, FileText, Github, Star } from "lucide-react";
import Link from "next/link";

const projects = getFeaturedProjects(3);

export const Projects = () => {
  return (
    <SectionWrapper id="projects" className="section-bg-projects">
      <SectionTitle
        title="Featured Projects"
        subtitle="// A selection of projects I've worked on"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => {
          const liveUrl = project.live_url[0];
          const githubUrl = project.github_url[0];
          const caseStudyUrl = project.case_study_url[0];

          return (
            <div
              key={project.id}
              className={`group relative p-6 rounded-xl card-glass transition-all duration-300 hover:-translate-y-1 ${
                project.featured ? "md:col-span-2" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute -top-3 left-6 flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                  <Star className="w-3 h-3" />
                  Featured Project
                </div>
              )}

              <div className={project.featured ? "md:flex md:gap-8" : ""}>
                {/* Project preview */}
                <Link
                  href={`/projects/${project.slug}`}
                  className={`block rounded-lg mb-4 overflow-hidden ${
                    project.featured ? "md:w-1/2 md:mb-0 h-48 md:h-64" : "h-40"
                  }`}
                >
                  <ProjectImage image={project.thumb} className="h-full w-full" />
                </Link>

                {/* Content */}
                <div
                  className={
                    project.featured ? "md:w-1/2 md:flex md:flex-col md:justify-center" : ""
                  }
                >
                  <Link href={`/projects/${project.slug}`}>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {TECH_STACK_LABELS[tech]}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap items-center gap-3">
                    {liveUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={liveUrl.url} target="_blank">
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                    {githubUrl && (
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={githubUrl.url} target="_blank">
                          <Github className="w-4 h-4" />
                          Code
                        </Link>
                      </Button>
                    )}
                    {caseStudyUrl && (
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={caseStudyUrl.url} target="_blank">
                          <FileText className="w-4 h-4" />
                          Case Study
                        </Link>
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/projects/${project.slug}`}>
                        Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
