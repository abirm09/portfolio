import { Button, ProjectImage, SectionTitle, SectionWrapper } from "@/components";
import { Badge } from "@/components/ui/Badge";
import { getAllProjects, getProjectBySlug, TECH_STACK_LABELS } from "@/data/projects";
import { ArrowLeft, ExternalLink, FileText, Github, Star } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProjectDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = () => {
  return getAllProjects().map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({ params }: ProjectDetailsPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found — Abir Mahmud" };
  }

  return {
    title: `${project.title} — Abir Mahmud`,
    description: project.description,
  };
};

const ProjectDetailsPage = async ({ params }: ProjectDetailsPageProps) => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const liveUrl = project.live_url[0];
  const githubUrl = project.github_url[0];
  const caseStudyUrl = project.case_study_url[0];

  return (
    <SectionWrapper className="section-bg-projects">
      <Button variant="ghost" size="sm" asChild className="mb-8">
        <Link href="/projects">
          <ArrowLeft className="w-4 h-4" />
          Back to all projects
        </Link>
      </Button>

      <div className="mb-10">
        {project.featured && (
          <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Star className="w-3 h-3" />
            Featured Project
          </div>
        )}

        <h1 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {project.title}
        </h1>

        <p className="mb-6 max-w-3xl text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {TECH_STACK_LABELS[tech]}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {liveUrl && (
            <Button asChild>
              <Link href={liveUrl.url} target="_blank">
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </Link>
            </Button>
          )}
          {githubUrl && (
            <Button variant="outline" asChild>
              <Link href={githubUrl.url} target="_blank">
                <Github className="w-4 h-4" />
                Code
              </Link>
            </Button>
          )}
          {caseStudyUrl && (
            <Button variant="ghost" asChild>
              <Link href={caseStudyUrl.url} target="_blank">
                <FileText className="w-4 h-4" />
                Case Study
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Hero image */}
      <ProjectImage
        image={project.thumb}
        className="mb-14 aspect-video w-full rounded-xl card-glass"
      />

      {/* Gallery */}
      <SectionTitle
        title="Gallery"
        subtitle="// A closer look at the interface"
        align="left"
        className="mb-8"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {project.image_gallery.map((image) => (
          <ProjectImage
            key={image.id}
            image={image}
            showCaption
            className="aspect-video w-full rounded-xl"
          />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default ProjectDetailsPage;
