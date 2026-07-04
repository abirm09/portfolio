import { Badge } from "@/components/ui/Badge";
import { TECH_STACK_LABELS, TProject } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import { ProjectImage } from "./ProjectImage";

type ProjectCardProps = {
  project: TProject;
  className?: string;
};

export const ProjectCard = ({ project, className }: ProjectCardProps) => {
  const visibleTech = project.tech_stack.slice(0, 4);
  const remainingTech = project.tech_stack.length - visibleTech.length;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl card-glass transition-all duration-300 hover:-translate-y-1",
        className,
      )}
    >
      {project.featured && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Star className="w-3 h-3" />
          Featured
        </div>
      )}

      <ProjectImage image={project.thumb} className="h-48 w-full" />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
          {project.title}
        </h3>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {visibleTech.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {TECH_STACK_LABELS[tech]}
            </Badge>
          ))}
          {remainingTech > 0 && (
            <Badge variant="outline" className="text-xs">
              +{remainingTech}
            </Badge>
          )}
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          View Details
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
};
