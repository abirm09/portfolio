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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects, technologies, slugs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/50 border border-border/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              filter === "featured"
                ? "bg-card text-amber-500 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="w-3 h-3 fill-amber-500" /> Featured (
            {projects.filter((p) => p.featured).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("standard")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-semibold text-foreground">No projects found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {search
                ? `No projects matching "${search}". Try adjusting your search query.`
                : "Get started by adding your first portfolio project."}
            </p>
            <Button asChild variant="gradient" size="sm" className="mt-2">
              <Link href="/dashboard/projects/new">
                <Plus className="w-4 h-4" /> Create New Project
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/20 text-muted-foreground text-xs uppercase">
                  <th className="py-3.5 px-4 font-semibold">Project & Description</th>
                  <th className="py-3.5 px-4 font-semibold">Slug</th>
                  <th className="py-3.5 px-4 font-semibold">Tech Stack</th>
                  <th className="py-3.5 px-4 font-semibold">Featured</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-secondary/30 transition-colors group"
                  >
                    {/* Project preview and info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            project.thumb?.url ||
                            "/images/projects/project-placeholder.svg"
                          }
                          alt={project.title}
                          className="w-12 h-12 rounded-xl object-cover bg-secondary border border-border shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/projects/${project.id}/edit`}
                            className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {project.title}
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-sm">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                      {project.slug}
                    </td>

                    {/* Tech Stack */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.tech_stack?.slice(0, 3).map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {TECH_STACK_LABELS[
                              tech as keyof typeof TECH_STACK_LABELS
                            ] || tech}
                          </Badge>
                        ))}
                        {(project.tech_stack?.length || 0) > 3 && (
                          <span className="text-[10px] text-muted-foreground self-center">
                            +{(project.tech_stack?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4">
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Star className="w-3 h-3 fill-amber-500" /> Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-muted-foreground bg-secondary">
                          Standard
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
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
