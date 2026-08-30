"use server";

import { project as staticProjects, TProject } from "@/data/projects";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
};

/**
 * Admin Login action
 */
export async function loginAction(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      error:
        "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect(redirectTo);
}

/**
 * Logout action
 */
export async function logoutAction() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/dashboard/login");
}

/**
 * Create or Update project
 */
export async function saveProjectAction(
  projectData: Partial<TProject>,
): Promise<ActionResponse> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      success: false,
      error:
        "Supabase is not configured. Set environment variables to enable saving to database.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized: You must be logged in to manage projects.",
    };
  }

  if (!projectData.title || !projectData.slug) {
    return {
      success: false,
      error: "Title and slug are required fields.",
    };
  }

  const payload = {
    title: projectData.title,
    slug: projectData.slug,
    description: projectData.description || "",
    tech_stack: projectData.tech_stack || [],
    thumb: projectData.thumb || {
      id: 1,
      url: "/images/projects/project-placeholder.svg",
      title: projectData.title,
    },
    image_gallery: projectData.image_gallery || [],
    live_url: projectData.live_url || [],
    github_url: projectData.github_url || [],
    case_study_url: projectData.case_study_url || [],
    featured: Boolean(projectData.featured),
    updated_at: new Date().toISOString(),
  };

  try {
    if (projectData.id) {
      // Update existing project
      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", projectData.id)
        .select()
        .single();

      if (error) throw error;

      revalidatePath("/");
      revalidatePath("/projects");
      revalidatePath(`/projects/${payload.slug}`);
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/projects");

      return {
        success: true,
        message: "Project updated successfully!",
        data,
      };
    } else {
      // Insert new project
      const { data, error } = await supabase
        .from("projects")
        .insert({
          ...payload,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      revalidatePath("/");
      revalidatePath("/projects");
      revalidatePath(`/projects/${payload.slug}`);
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/projects");

      return {
        success: true,
        message: "Project created successfully!",
        data,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to save project.",
    };
  }
}

/**
 * Delete project action
 */
export async function deleteProjectAction(id: number): Promise<ActionResponse> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      success: false,
      error: "Supabase client not configured.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized: You must be logged in to delete projects.",
    };
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");

  return { success: true, message: "Project deleted successfully." };
}

/**
 * Toggle featured status
 */
export async function toggleFeaturedAction(
  id: number,
  featured: boolean,
): Promise<ActionResponse> {
  const supabase = await createClient();

  if (!supabase) {
    return { success: false, error: "Supabase not configured." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("projects")
    .update({ featured, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");

  return { success: true };
}

/**
 * Seed initial projects from static data into Supabase
 */
export async function seedProjectsAction(): Promise<ActionResponse> {
  const supabase = await createClient();

  if (!supabase) {
    return { success: false, error: "Supabase client not configured." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const formatted = staticProjects.map((p) => ({
      title: p.title,
      slug: p.slug,
      description: p.description,
      tech_stack: p.tech_stack,
      thumb: p.thumb,
      image_gallery: p.image_gallery,
      live_url: p.live_url,
      github_url: p.github_url,
      case_study_url: p.case_study_url,
      featured: p.featured,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("projects")
      .upsert(formatted, { onConflict: "slug" })
      .select();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");

    return {
      success: true,
      message: `Successfully seeded ${data.length} projects into Supabase!`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to seed projects.",
    };
  }
}
