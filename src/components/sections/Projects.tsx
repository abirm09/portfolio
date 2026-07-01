import { Button } from "@/components";
import { Badge } from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ExternalLink, FileText, Github, Star } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    title: "SkillOxgen",
    description:
      "A professional interview platform where experienced professionals can conduct mock interviews for fresh graduates and job seekers. Includes authentication, interview scheduling, online payments, feedback, secure dashboards, and a monetization system.",
    techStack: ["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Prisma"],
    liveUrl: "#",
    githubUrl: "#",
    caseStudyUrl: "#",
    featured: true,
  },
  {
    title: "E-Commerce Management System",
    description:
      "A complete e-commerce platform with inventory management and accounting features, including product management, sales, customer management, dashboards, and reports.",
    techStack: ["MERN", "PostgreSQL", "Prisma"],
    liveUrl: "#",
    githubUrl: "#",
    caseStudyUrl: "#",
    featured: false,
  },
  {
    title: "Fingerprint Authentication API",
    description:
      "A backend authentication system integrating Futronic fingerprint devices with FastAPI. Provides biometric verification, SDK integration, secure APIs, and template matching.",
    techStack: ["Python", "FastAPI"],
    liveUrl: "#",
    githubUrl: "#",
    caseStudyUrl: "#",
    featured: false,
  },
];

export const Projects = () => {
  return (
    <SectionWrapper id="projects" className="bg-secondary/30">
      <SectionTitle
        title="Featured Projects"
        subtitle="// A selection of projects I've worked on"
      />

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
                <div className="flex flex-wrap items-center gap-3">
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
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={project.caseStudyUrl} target="_blank">
                      <FileText className="w-4 h-4" />
                      Case Study
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
