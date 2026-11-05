import { staticBlogs, TBlogPost } from "@/data/blogs";
import { createClient } from "@supabase/supabase-js";

export type BlogInput = Omit<TBlogPost, "id"> & {
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
 * Fetch blog posts with optional filters, falling back to static data if not configured or query fails.
 */
export async function getBlogPosts(options?: {
  publishedOnly?: boolean;
  category?: string;
  tag?: string;
  limit?: number;
}): Promise<TBlogPost[]> {
  const publishedOnly = options?.publishedOnly ?? true;
  const category = options?.category;
  const tag = options?.tag;
  const limit = options?.limit;

  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      let filtered = publishedOnly ? staticBlogs.filter((b) => b.published) : [...staticBlogs];
      if (category && category !== "All") {
        filtered = filtered.filter((b) => b.category.toLowerCase() === category.toLowerCase());
      }
      if (tag) {
        filtered = filtered.filter((b) =>
          b.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
        );
      }
      return limit ? filtered.slice(0, limit) : filtered;
    }

    let query = supabase
      .from("blogs")
      .select("*")
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false });

    if (publishedOnly) {
      query = query.eq("published", true);
    }
    if (category && category !== "All") {
      query = query.eq("category", category);
    }
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      let filtered = publishedOnly ? staticBlogs.filter((b) => b.published) : [...staticBlogs];
      if (category && category !== "All") {
        filtered = filtered.filter((b) => b.category.toLowerCase() === category.toLowerCase());
      }
      if (tag) {
        filtered = filtered.filter((b) =>
          b.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
        );
      }
      return limit ? filtered.slice(0, limit) : filtered;
    }

    let posts = data as TBlogPost[];
    if (tag) {
      posts = posts.filter((b) => b.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()));
    }

    return posts;
  } catch {
    let filtered = publishedOnly ? staticBlogs.filter((b) => b.published) : [...staticBlogs];
    if (category && category !== "All") {
      filtered = filtered.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }
    if (tag) {
      filtered = filtered.filter((b) => b.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
    }
    return limit ? filtered.slice(0, limit) : filtered;
  }
}

/**
 * Fetch featured blog posts
 */
export async function getFeaturedBlogPosts(limit = 3): Promise<TBlogPost[]> {
  const posts = await getBlogPosts({ publishedOnly: true });
  const featured = posts.filter((p) => p.featured);
  const remaining = posts.filter((p) => !p.featured);
  return [...featured, ...remaining].slice(0, limit);
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<TBlogPost | undefined> {
  const staticMatch = staticBlogs.find((post) => post.slug === slug);

  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return staticMatch;
    }

    const { data, error } = await supabase.from("blogs").select("*").eq("slug", slug).maybeSingle();

    if (error || !data) {
      return staticMatch;
    }

    return data as TBlogPost;
  } catch {
    return staticMatch;
  }
}

/**
 * Fetch a single blog post by ID
 */
export async function getBlogPostById(id: number): Promise<TBlogPost | undefined> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return staticBlogs.find((b) => b.id === id);
    }

    const { data, error } = await supabase.from("blogs").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      return staticBlogs.find((b) => b.id === id);
    }

    return data as TBlogPost;
  } catch {
    return staticBlogs.find((b) => b.id === id);
  }
}

/**
 * Fetch related blog posts by category
 */
export async function getRelatedBlogPosts(
  currentSlug: string,
  category: string,
  limit = 2,
): Promise<TBlogPost[]> {
  const allPosts = await getBlogPosts({ publishedOnly: true });
  const related = allPosts.filter(
    (post) => post.slug !== currentSlug && post.category.toLowerCase() === category.toLowerCase(),
  );

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  // Fill up with other posts if category matches are insufficient
  const fillers = allPosts.filter(
    (post) => post.slug !== currentSlug && !related.some((r) => r.slug === post.slug),
  );

  return [...related, ...fillers].slice(0, limit);
}

/**
 * Increment blog post view count safely
 */
export async function incrementBlogViews(slug: string): Promise<void> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return;

    await supabase.rpc("increment_blog_views", { target_slug: slug });
  } catch {
    // Fail silently on view count increments
  }
}
