"use client";

import {
  DEFAULT_BUCKET,
  deleteProjectFile,
  listStorageFiles,
  uploadProjectFile,
} from "@/lib/supabase/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const storageKeys = {
  all: ["storage-files"] as const,
  folder: (folder: string = "", bucket: string = DEFAULT_BUCKET) =>
    [...storageKeys.all, bucket, folder] as const,
};

/**
 * Hook to query files in Supabase Storage bucket
 */
export function useStorageFiles(folder: string = "", bucket: string = DEFAULT_BUCKET) {
  return useQuery({
    queryKey: storageKeys.folder(folder, bucket),
    queryFn: async () => {
      const res = await listStorageFiles(folder, bucket);
      if (res.error) {
        throw new Error(res.error);
      }
      return res.files || [];
    },
  });
}

/**
 * Hook to upload a file to Supabase Storage bucket
 */
export function useUploadFileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      folder = "uploads",
      bucket = DEFAULT_BUCKET,
    }: {
      file: File;
      folder?: string;
      bucket?: string;
    }) => {
      const res = await uploadProjectFile(file, folder, bucket);
      if (res.error) {
        throw new Error(res.error);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storageKeys.all });
    },
  });
}

/**
 * Hook to delete a file from Supabase Storage bucket
 */
export function useDeleteFileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      filePath,
      bucket = DEFAULT_BUCKET,
    }: {
      filePath: string;
      bucket?: string;
    }) => {
      const res = await deleteProjectFile(filePath, bucket);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete file.");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storageKeys.all });
    },
  });
}
