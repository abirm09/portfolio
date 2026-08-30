"use client";

import { TProject } from "@/data/projects";
import {
  deleteProjectAction,
  saveProjectAction,
  seedProjectsAction,
  toggleFeaturedAction,
} from "@/lib/supabase/actions";
import { getProjectById, getProjectBySlug, getProjects } from "@/lib/supabase/projects";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (slugOrId: string | number) => [...projectKeys.details(), slugOrId] as const,
};

/**
 * Hook to query all projects with caching and optional initial SSR data
 */
export function useProjects(initialData?: TProject[]) {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => await getProjects(),
    initialData,
  });
}

/**
 * Hook to query a single project by slug
 */
export function useProject(slug: string, initialData?: TProject) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: async () => {
      const p = await getProjectBySlug(slug);
      if (!p) throw new Error(`Project with slug "${slug}" not found`);
      return p;
    },
    initialData,
    enabled: Boolean(slug),
  });
}

/**
 * Hook to query a single project by ID
 */
export function useProjectById(id: number, initialData?: TProject) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const p = await getProjectById(id);
      if (!p) throw new Error(`Project with id "${id}" not found`);
      return p;
    },
    initialData,
    enabled: Boolean(id && !isNaN(id)),
  });
}

/**
 * Mutation to create or update a project
 */
export function useSaveProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: Partial<TProject>) => {
      const result = await saveProjectAction(projectData);
      if (!result.success) {
        throw new Error(result.error || "Failed to save project.");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

/**
 * Mutation to delete a project with optimistic UI support
 */
export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteProjectAction(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete project.");
      }
      return result;
    },
    onMutate: async (deletedId: number) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.lists() });
      const previousProjects = queryClient.getQueryData<TProject[]>(projectKeys.lists());

      if (previousProjects) {
        queryClient.setQueryData<TProject[]>(
          projectKeys.lists(),
          previousProjects.filter((p) => p.id !== deletedId),
        );
      }

      return { previousProjects };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(projectKeys.lists(), context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

/**
 * Mutation to toggle featured status with instant optimistic update
 */
export function useToggleFeaturedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const result = await toggleFeaturedAction(id, featured);
      if (!result.success) {
        throw new Error(result.error || "Failed to update featured status.");
      }
      return result;
    },
    onMutate: async ({ id, featured }) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.lists() });
      const previousProjects = queryClient.getQueryData<TProject[]>(projectKeys.lists());

      if (previousProjects) {
        queryClient.setQueryData<TProject[]>(
          projectKeys.lists(),
          previousProjects.map((p) => (p.id === id ? { ...p, featured } : p)),
        );
      }

      return { previousProjects };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(projectKeys.lists(), context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

/**
 * Mutation to seed initial project data into Supabase
 */
export function useSeedProjectsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await seedProjectsAction();
      if (!result.success) {
        throw new Error(result.error || "Failed to seed projects.");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
