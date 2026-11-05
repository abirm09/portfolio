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

  const uniqueTechs = Array.from(new Set(projects.flatMap((p) => p.tech_stack || [])));

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-600 sm:flex-row sm:items-center dark:text-amber-400">
          <div className="flex items-start gap-3">
            <Database className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-bold">Supabase Environment Setup Required</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Add{" "}
                <code className="bg-background/50 rounded px-1 py-0.5 font-mono">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>{" "}
                and{" "}
                <code className="bg-background/50 rounded px-1 py-0.5 font-mono">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>{" "}
                to your <code className="font-mono">.env.local</code> to enable full Supabase cloud
                storage and live mutations. Currently using static fallback data.
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" asChild className="shrink-0 text-xs">
            <Link href="/dashboard/media">Storage Guide</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <div>
              <p className="text-xs font-bold">Supabase Connected</p>
              <p className="text-muted-foreground text-[11px]">
                Live database synchronization and storage bucket active.
              </p>
            </div>
          </div>
          <SeedDatabaseButton />
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects */}
        <div className="bg-card border-border flex items-center gap-4 rounded-2xl border p-5 shadow-xs">
          <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl">
            <FolderGit2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Total Projects</p>
            <h3 className="text-foreground mt-0.5 text-2xl font-black">{projects.length}</h3>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="bg-card border-border flex items-center gap-4 rounded-2xl border p-5 shadow-xs">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Star className="h-6 w-6 fill-amber-500/20" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Featured</p>
            <h3 className="text-foreground mt-0.5 text-2xl font-black">{featuredCount}</h3>
          </div>
        </div>

        {/* Unique Technologies */}
        <div className="bg-card border-border flex items-center gap-4 rounded-2xl border p-5 shadow-xs">
          <div className="bg-accent/10 text-accent flex size-12 shrink-0 items-center justify-center rounded-xl">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Technologies</p>
            <h3 className="text-foreground mt-0.5 text-2xl font-black">{uniqueTechs.length}</h3>
          </div>
        </div>

        {/* Storage */}
        <div className="bg-card border-border flex items-center gap-4 rounded-2xl border p-5 shadow-xs">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <HardDrive className="h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Storage Bucket</p>
            <h3 className="text-foreground mt-0.5 text-base font-bold">
              {process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "projects"}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="bg-card border-border space-y-4 rounded-2xl border p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground text-lg font-bold">Recent Projects</h2>
            <p className="text-muted-foreground text-xs">
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
              <tr className="border-border/80 text-muted-foreground border-b text-xs uppercase">
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Tech Stack</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/60 divide-y">
              {projects.slice(0, 5).map((proj) => (
                <tr key={proj.id} className="hover:bg-secondary/30 transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proj.thumb?.url || "/images/projects/project-placeholder.svg"}
                        alt={proj.title}
                        className="bg-secondary border-border h-10 w-10 shrink-0 rounded-lg border object-cover"
                      />
                      <div>
                        <Link
                          href={`/dashboard/projects/${proj.id}/edit`}
                          className="text-foreground hover:text-primary line-clamp-1 font-bold transition-colors"
                        >
                          {proj.title}
                        </Link>
                        <span className="text-muted-foreground line-clamp-1 max-w-xs text-xs">
                          {proj.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="text-muted-foreground px-4 py-3 font-mono text-xs">{proj.slug}</td>

                  {/* Tech stack */}
                  <td className="px-4 py-3">
                    <div className="flex max-w-xs flex-wrap gap-1">
                      {proj.tech_stack?.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="px-1.5 py-0 text-[10px]">
                          {tech}
                        </Badge>
                      ))}
                      {(proj.tech_stack?.length || 0) > 3 && (
                        <span className="text-muted-foreground text-[10px]">
                          +{(proj.tech_stack?.length || 0) - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Featured Status */}
                  <td className="px-4 py-3">
                    {proj.featured ? (
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
