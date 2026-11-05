"use client";

import { TBlogPost } from "@/data/blogs";
import {
  deleteBlogAction,
  saveBlogAction,
  seedBlogsAction,
  toggleFeaturedBlogAction,
  togglePublishBlogAction,
} from "@/lib/supabase/actions";
import { getBlogPostById, getBlogPostBySlug, getBlogPosts } from "@/lib/supabase/blogs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (filters: { publishedOnly?: boolean; category?: string; tag?: string }) =>
    [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (slugOrId: string | number) => [...blogKeys.details(), slugOrId] as const,
};

/**
 * Hook to query blogs with caching and optional initial SSR data
 */
export function useBlogs(
  filters?: { publishedOnly?: boolean; category?: string; tag?: string },
  initialData?: TBlogPost[],
) {
  return useQuery({
    queryKey: blogKeys.list(filters || {}),
    queryFn: async () => await getBlogPosts(filters),
    initialData,
  });
}

/**
 * Hook to query a single blog post by slug
 */
export function useBlog(slug: string, initialData?: TBlogPost) {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: async () => {
      const b = await getBlogPostBySlug(slug);
      if (!b) throw new Error(`Blog post with slug "${slug}" not found`);
      return b;
    },
    initialData,
    enabled: Boolean(slug),
  });
}

/**
 * Hook to query a single blog post by ID
 */
export function useBlogById(id: number, initialData?: TBlogPost) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: async () => {
      const b = await getBlogPostById(id);
      if (!b) throw new Error(`Blog post with id "${id}" not found`);
      return b;
    },
    initialData,
    enabled: Boolean(id && !isNaN(id)),
  });
}

/**
 * Mutation hook to save (create or update) a blog post
 */
export function useSaveBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogData: Partial<TBlogPost>) => {
      const result = await saveBlogAction(blogData);
      if (!result.success) {
        throw new Error(result.error || "Failed to save blog post");
      }
      return result.data;
    },
    onSuccess: (savedPost) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      if (savedPost?.slug) {
        queryClient.invalidateQueries({ queryKey: blogKeys.detail(savedPost.slug) });
      }
      if (savedPost?.id) {
        queryClient.invalidateQueries({ queryKey: blogKeys.detail(savedPost.id) });
      }
    },
  });
}

/**
 * Mutation hook to delete a blog post
 */
export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteBlogAction(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete blog post");
      }
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueriesData({ queryKey: blogKeys.lists() }, (old: TBlogPost[] | undefined) => {
        if (!old) return [];
        return old.filter((post) => post.id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

/**
 * Mutation hook to toggle publish status
 */
export function useTogglePublishBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      const result = await togglePublishBlogAction(id, published);
      if (!result.success) {
        throw new Error(result.error || "Failed to update publish status");
      }
      return { id, published };
    },
    onMutate: async ({ id, published }) => {
      await queryClient.cancelQueries({ queryKey: blogKeys.all });
      queryClient.setQueriesData({ queryKey: blogKeys.lists() }, (old: TBlogPost[] | undefined) => {
        if (!old) return [];
        return old.map((post) => (post.id === id ? { ...post, published } : post));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

/**
 * Mutation hook to toggle featured status
 */
export function useToggleFeaturedBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const result = await toggleFeaturedBlogAction(id, featured);
      if (!result.success) {
        throw new Error(result.error || "Failed to update featured status");
      }
      return { id, featured };
    },
    onMutate: async ({ id, featured }) => {
      await queryClient.cancelQueries({ queryKey: blogKeys.all });
      queryClient.setQueriesData({ queryKey: blogKeys.lists() }, (old: TBlogPost[] | undefined) => {
        if (!old) return [];
        return old.map((post) => (post.id === id ? { ...post, featured } : post));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

/**
 * Mutation hook to seed initial blog posts
 */
export function useSeedBlogsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await seedBlogsAction();
      if (!result.success) {
        throw new Error(result.error || "Failed to seed blog posts");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}
