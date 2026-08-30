import { createClient as createBrowserClient } from "@/lib/supabase/client";

export const DEFAULT_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "projects";

/**
 * Convert any raster image (PNG, JPEG, JPG, BMP, etc.) to optimized WebP format on the client.
 */
export async function convertImageToWebP(
  file: File,
  quality: number = 0.85,
  maxDimension: number = 2400,
): Promise<File> {
  // If not an image or is SVG, return file as-is
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  // If already a webp file and under max dimension, return as is or recompress
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Downscale if larger than maxDimension while preserving aspect ratio
        if (maxDimension > 0 && (width > maxDimension || height > maxDimension)) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file); // fallback to original file
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }

            // Replace original extension with .webp
            const originalBaseName = file.name.replace(/\.[^/.]+$/, "");
            const webpFileName = `${originalBaseName}.webp`;

            const webpFile = new File([blob], webpFileName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            resolve(webpFile);
          },
          "image/webp",
          quality,
        );
      };

      img.onerror = () => resolve(file); // fallback
      img.src = event.target?.result as string;
    };

    reader.onerror = () => resolve(file); // fallback
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a file from client to Supabase Storage bucket.
 * Automatically converts raster images (PNG, JPEG, etc.) to optimized .webp before uploading.
 */
export async function uploadProjectFile(
  file: File,
  folder: string = "uploads",
  bucket: string = DEFAULT_BUCKET,
  options?: { convertToWebp?: boolean; quality?: number; maxDimension?: number },
): Promise<{ url: string; path: string; error?: string }> {
  const supabase = createBrowserClient();

  if (!supabase) {
    return {
      url: "",
      path: "",
      error:
        "Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  // Convert to WebP if enabled (default: true for all raster images)
  let fileToUpload = file;
  const shouldConvert = options?.convertToWebp ?? true;
  if (
    shouldConvert &&
    typeof window !== "undefined" &&
    file.type.startsWith("image/")
  ) {
    try {
      fileToUpload = await convertImageToWebP(
        file,
        options?.quality ?? 0.85,
        options?.maxDimension ?? 2400,
      );
    } catch {
      fileToUpload = file;
    }
  }

  // Create clean, unique file path
  const sanitizedName = fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const timestamp = Date.now();
  const filePath = `${folder}/${timestamp}-${sanitizedName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileToUpload, {
      cacheControl: "3600",
      upsert: true,
      contentType: fileToUpload.type,
    });

  if (uploadError) {
    return { url: "", path: "", error: uploadError.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
}

/**
 * Delete a file from Supabase Storage bucket
 */
export async function deleteProjectFile(
  path: string,
  bucket: string = DEFAULT_BUCKET,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createBrowserClient();

  if (!supabase) {
    return { success: false, error: "Supabase client is not configured." };
  }

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * List files in Supabase Storage bucket
 */
export async function listStorageFiles(
  folder: string = "",
  bucket: string = DEFAULT_BUCKET,
) {
  const supabase = createBrowserClient();

  if (!supabase) {
    return { files: [], error: "Supabase client is not configured." };
  }

  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit: 100,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    return { files: [], error: error.message };
  }

  const filesWithUrls = (data || []).map((file) => {
    const fullPath = folder ? `${folder}/${file.name}` : file.name;
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath);
    return {
      ...file,
      path: fullPath,
      publicUrl: urlData.publicUrl,
    };
  });

  return { files: filesWithUrls, error: null };
}
