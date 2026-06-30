import { Button } from "@/components";
import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ExternalLink, Github, Star } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    title: "SkillOxygen",
    description:
      "A comprehensive platform for professional interview simulations with integrated payment processing and intelligent scheduling system.",
    techStack: ["Next.js", "Node.js", "MongoDB", "Stripe", "WebRTC"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    title: "E-Commerce Platform",
    description:
      "Full-featured online store with inventory management, order tracking, and real-time analytics dashboard.",
    techStack: ["React", "Express", "PostgreSQL", "Prisma", "Redis"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    title: "Task Management App",
    description:
      "Collaborative project management tool with real-time updates, drag-and-drop interface, and team workspaces.",
    techStack: ["Next.js", "tRPC", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    title: "Blog Platform",
    description:
      "Modern blogging platform with markdown support, SEO optimization, and comprehensive content management system.",
    techStack: ["Next.js", "MongoDB", "Cloudinary", "MDX"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

export const Projects = () => {
  return (
    <SectionWrapper id="projects" className="bg-secondary/30">
      <SectionTitle title="Featured Projects" subtitle="A selection of projects I've worked on" />

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className={`group relative p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl ${
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
              {/* Project preview placeholder */}
              <div
                className={`bg-linear-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center ${
                  project.featured ? "md:w-1/2 md:mb-0 h-48 md:h-64" : "h-40"
                }`}
              >
                <span className="text-muted-foreground text-sm">Project Preview</span>
              </div>

              {/* Content */}
              <div
                className={project.featured ? "md:w-1/2 md:flex md:flex-col md:justify-center" : ""}
              >
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={project.liveUrl} target="_blank">
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={project.githubUrl} target="_blank">
                      <Github className="w-4 h-4" />
                      Code
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};
