import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { getProjects } from "@/lib/supabase/projects";
import {
  Code2,
  Database,
  ExternalLink,
  FolderGit2,
  HardDrive,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/Header";
import { ProjectRowActions } from "@/components/dashboard/ProjectRowActions";
import { SeedDatabaseButton } from "@/components/dashboard/SeedDatabaseButton";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const projects = await getProjects();
  const featuredCount = projects.filter((p) => p.featured).length;

  const uniqueTechs = Array.from(
    new Set(projects.flatMap((p) => p.tech_stack || [])),
  );

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Manage portfolio content, database projects, and Supabase storage."
        action={{
          label: "New Project",
          href: "/dashboard/projects/new",
          icon: Plus,
        }}
      />

      {/* Supabase Status Banner */}
      {!isSupabaseConfigured ? (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
            <div>
              <p className="font-bold text-sm">Supabase Environment Setup Required</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add <code className="px-1 py-0.5 rounded bg-background/50 font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="px-1 py-0.5 rounded bg-background/50 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your{" "}
                <code className="font-mono">.env.local</code> to enable full Supabase cloud storage and live mutations. Currently using static fallback data.
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" asChild className="shrink-0 text-xs">
            <Link href="/dashboard/media">Storage Guide</Link>
          </Button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <p className="font-bold text-xs">Supabase Connected</p>
              <p className="text-[11px] text-muted-foreground">
                Live database synchronization and storage bucket active.
              </p>
            </div>
          </div>
          <SeedDatabaseButton />
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 shadow-xs">
          <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Projects</p>
            <h3 className="text-2xl font-black text-foreground mt-0.5">{projects.length}</h3>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 shadow-xs">
          <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-500/20" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Featured</p>
            <h3 className="text-2xl font-black text-foreground mt-0.5">{featuredCount}</h3>
          </div>
        </div>

        {/* Unique Technologies */}
        <div className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 shadow-xs">
          <div className="size-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Technologies</p>
            <h3 className="text-2xl font-black text-foreground mt-0.5">{uniqueTechs.length}</h3>
          </div>
        </div>

        {/* Storage */}
        <div className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 shadow-xs">
          <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Storage Bucket</p>
            <h3 className="text-base font-bold text-foreground mt-0.5">
              {process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "projects"}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Projects</h2>
            <p className="text-xs text-muted-foreground">
              Overview of all projects managed in database.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/projects">View All Projects ({projects.length})</Link>
          </Button>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground text-xs uppercase">
                <th className="py-3 px-4 font-semibold">Project</th>
                <th className="py-3 px-4 font-semibold">Slug</th>
                <th className="py-3 px-4 font-semibold">Tech Stack</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {projects.slice(0, 5).map((proj) => (
                <tr key={proj.id} className="hover:bg-secondary/30 transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proj.thumb?.url || "/images/projects/project-placeholder.svg"}
                        alt={proj.title}
                        className="w-10 h-10 rounded-lg object-cover bg-secondary shrink-0 border border-border"
                      />
                      <div>
                        <Link
                          href={`/dashboard/projects/${proj.id}/edit`}
                          className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {proj.title}
                        </Link>
                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                          {proj.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                    {proj.slug}
                  </td>

                  {/* Tech stack */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {proj.tech_stack?.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {tech}
                        </Badge>
                      ))}
                      {(proj.tech_stack?.length || 0) > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{(proj.tech_stack?.length || 0) - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Featured Status */}
                  <td className="py-3 px-4">
                    {proj.featured ? (
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
                    <ProjectRowActions project={proj} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
