import { project as staticProjects, TProject } from "@/data/projects";
import { createClient } from "@supabase/supabase-js";

export type ProjectInput = Omit<TProject, "id"> & {
  id?: number;
};

function getPublicSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Fetch all projects from Supabase, falling back to static data if not configured or query fails.
 */
export async function getProjects(): Promise<TProject[]> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return staticProjects;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("featured", { ascending: false })
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) {
      return staticProjects;
    }

    return data as TProject[];
  } catch {
    return staticProjects;
  }
}

const retiredPortfolioSlugs = new Set([
  "fingerprint-authentication-api",
  "ecommerce-management-system",
  "portfolio-website",
  "task-management-app",
  "blog-cms",
]);

/** Keep the public portfolio aligned with the curated local project work. */
export async function getPortfolioProjects(): Promise<TProject[]> {
  const storedProjects = await getProjects();
  const curatedSlugs = new Set(staticProjects.map((project) => project.slug));

  return [
    ...staticProjects,
    ...storedProjects.filter(
      (project) => !curatedSlugs.has(project.slug) && !retiredPortfolioSlugs.has(project.slug),
    ),
  ];
}

/**
 * Fetch featured projects.
 */
export async function getFeaturedProjects(limit = 3): Promise<TProject[]> {
  const allProjects = await getPortfolioProjects();
  const featured = allProjects.filter((p) => p.featured);
  const rest = allProjects.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, limit);
}

/**
 * Fetch a single project by slug.
 */
export async function getProjectBySlug(slug: string): Promise<TProject | undefined> {
  const curatedProject = staticProjects.find((project) => project.slug === slug);
  if (curatedProject) return curatedProject;
  if (retiredPortfolioSlugs.has(slug)) return undefined;

  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return staticProjects.find((p) => p.slug === slug);
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return staticProjects.find((p) => p.slug === slug);
    }

    return data as TProject;
  } catch {
    return staticProjects.find((p) => p.slug === slug);
  }
}

/**
 * Fetch a single project by ID.
 */
export async function getProjectById(id: number): Promise<TProject | undefined> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return staticProjects.find((p) => p.id === id);
    }

    const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      return staticProjects.find((p) => p.id === id);
    }

    return data as TProject;
  } catch {
    return staticProjects.find((p) => p.id === id);
  }
}
