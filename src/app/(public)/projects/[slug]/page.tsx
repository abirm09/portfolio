import { Button, ProjectImage, SectionTitle, SectionWrapper } from "@/components";
import { Badge } from "@/components/ui/Badge";
import { TECH_STACK_LABELS } from "@/data/projects";
import { getProjectBySlug, getProjects } from "@/lib/supabase/projects";
import { ArrowLeft, ExternalLink, FileText, Github, Star } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProjectDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = async () => {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({ params }: ProjectDetailsPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

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
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const liveUrl = project.live_url?.[0];
  const githubUrl = project.github_url?.[0];
  const caseStudyUrl = project.case_study_url?.[0];

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
          <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-brand-accent px-3 py-1 text-xs font-medium text-brand-accent-foreground shadow-sm">
            <Star className="w-3 h-3 fill-current" />
            Featured Project
          </div>
        )}

        <h1 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {project.title}
        </h1>

        <div
          className="mb-8 max-w-3xl text-muted-foreground leading-relaxed space-y-3 text-base [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2 [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:bg-secondary/70 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tech_stack?.map((tech) => (
            <Badge key={tech} variant="secondary">
              {TECH_STACK_LABELS[tech as keyof typeof TECH_STACK_LABELS] || tech}
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
      {project.thumb && (
        <ProjectImage
          image={project.thumb}
          className="mb-14 aspect-video w-full rounded-xl card-glass"
        />
      )}

      {/* Gallery */}
      {project.image_gallery && project.image_gallery.length > 0 && (
        <>
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
        </>
      )}
    </SectionWrapper>
  );
};

export default ProjectDetailsPage;
