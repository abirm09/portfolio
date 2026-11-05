"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { TECH_STACK_LABELS, TProject } from "@/data/projects";
import { useProjects } from "@/hooks/useProjectsQuery";
import { Plus, Search, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProjectRowActions } from "./ProjectRowActions";

type ProjectsListClientProps = {
  initialProjects: TProject[];
};

export const ProjectsListClient = ({ initialProjects }: ProjectsListClientProps) => {
  const { data: projects = initialProjects } = useProjects(initialProjects);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "featured" | "standard">("all");

  const filteredProjects = projects.filter((project) => {
    // Search query matching
    const query = search.toLowerCase().trim();
    const matchesQuery =
      !query ||
      project.title.toLowerCase().includes(query) ||
      project.slug.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.tech_stack?.some((t) => t.toLowerCase().includes(query));

    // Status filter matching
    if (!matchesQuery) return false;
    if (filter === "featured") return project.featured;
    if (filter === "standard") return !project.featured;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search projects, technologies, slugs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="bg-secondary/50 border-border/60 flex items-center gap-1.5 self-start rounded-xl border p-1 sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("featured")}
            className={`flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              filter === "featured"
                ? "bg-card text-amber-500 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="h-3 w-3 fill-amber-500" /> Featured (
            {projects.filter((p) => p.featured).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("standard")}
            className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              filter === "standard"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Standard ({projects.filter((p) => !p.featured).length})
          </button>
        </div>
      </div>

      {/* Projects Table Card */}
      <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-xs">
        {filteredProjects.length === 0 ? (
          <div className="space-y-3 py-16 text-center">
            <p className="text-foreground text-sm font-semibold">No projects found</p>
            <p className="text-muted-foreground mx-auto max-w-sm text-xs">
              {search
                ? `No projects matching "${search}". Try adjusting your search query.`
                : "Get started by adding your first portfolio project."}
            </p>
            <Button asChild variant="default" size="sm" className="mt-2">
              <Link href="/dashboard/projects/new">
                <Plus className="h-4 w-4" /> Create New Project
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border/80 bg-secondary/20 text-muted-foreground border-b text-xs uppercase">
                  <th className="px-4 py-3.5 font-semibold">Project & Description</th>
                  <th className="px-4 py-3.5 font-semibold">Slug</th>
                  <th className="px-4 py-3.5 font-semibold">Tech Stack</th>
                  <th className="px-4 py-3.5 font-semibold">Featured</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-secondary/30 group transition-colors">
                    {/* Project preview and info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.thumb?.url || "/images/projects/project-placeholder.svg"}
                          alt={project.title}
                          className="bg-secondary border-border h-12 w-12 shrink-0 rounded-xl border object-cover"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/projects/${project.id}/edit`}
                            className="text-foreground hover:text-primary line-clamp-1 font-bold transition-colors"
                          >
                            {project.title}
                          </Link>
                          <p className="text-muted-foreground line-clamp-1 max-w-sm text-xs">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                      {project.slug}
                    </td>

                    {/* Tech Stack */}
                    <td className="px-4 py-3">
                      <div className="flex max-w-xs flex-wrap gap-1">
                        {project.tech_stack?.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="px-1.5 py-0 text-[10px]">
                            {TECH_STACK_LABELS[tech as keyof typeof TECH_STACK_LABELS] || tech}
                          </Badge>
                        ))}
                        {(project.tech_stack?.length || 0) > 3 && (
                          <span className="text-muted-foreground self-center text-[10px]">
                            +{(project.tech_stack?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Featured */}
                    <td className="px-4 py-3">
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                          <Star className="h-3 w-3 fill-amber-500" /> Featured
                        </span>
                      ) : (
                        <span className="text-muted-foreground bg-secondary inline-flex items-center rounded-full px-2 py-0.5 text-xs">
                          Standard
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <ProjectRowActions project={project} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
