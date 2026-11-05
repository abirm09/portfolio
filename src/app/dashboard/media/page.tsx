"use client";

import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  useDeleteFileMutation,
  useStorageFiles,
  useUploadFileMutation,
} from "@/hooks/useStorageQuery";
import { DEFAULT_BUCKET } from "@/lib/supabase/storage";
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  HardDrive,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";

export default function MediaManagerPage() {
  const [folder] = useState("");
  const [search, setSearch] = useState("");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: files = [],
    isLoading,
    isRefetching,
    refetch,
    error: queryError,
  } = useStorageFiles(folder);
  const uploadMutation = useUploadFileMutation();
  const deleteMutation = useDeleteFileMutation();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setErrorMessage(null);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await uploadMutation.mutateAsync({ file, folder: folder || "uploads" });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Upload failed.");
    }
  };

  const handleDelete = async (filePath: string) => {
    if (!confirm(`Are you sure you want to delete "${filePath}" from Supabase bucket?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({ filePath });
    } catch (err: any) {
      alert(err.message || "Failed to delete file.");
    }
  };

  const handleCopy = (url: string, path: string) => {
    navigator.clipboard.writeText(url);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  const filteredFiles = files.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const activeError = errorMessage || (queryError ? queryError.message : null);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Supabase Storage & Media"
        subtitle={`Manage files and assets in the "${DEFAULT_BUCKET}" bucket.`}
      />

      {/* Error Alert */}
      {activeError && (
        <div className="bg-destructive/10 border-destructive/30 text-destructive flex items-start gap-3 rounded-2xl border p-4 text-xs">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Storage Notice</p>
            <p className="mt-0.5">{activeError}</p>
          </div>
        </div>
      )}

      {/* Upload Drag & Drop Box */}
      <div className="bg-card border-primary/40 group relative space-y-4 overflow-hidden rounded-3xl border border-dashed p-8 text-center shadow-xs">
        <div className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
          {uploadMutation.isPending ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <UploadCloud className="h-7 w-7" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-foreground text-base font-bold">
            {uploadMutation.isPending
              ? "Uploading files to Supabase..."
              : "Upload Assets to Supabase Bucket"}
          </h3>
          <p className="text-muted-foreground mx-auto max-w-md text-xs">
            Upload images (PNG, JPG, WebP, SVG) directly to your Supabase storage bucket.
          </p>
        </div>

        <div>
          <label className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-md transition-all">
            <ImageIcon className="h-4 w-4" /> Select Files to Upload
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploadMutation.isPending}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Files List & Toolbar */}
      <div className="bg-card border-border space-y-6 rounded-2xl border p-6 shadow-xs">
        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-foreground text-lg font-bold">Bucket Files</h2>
            <span className="text-muted-foreground text-xs">({files.length} items)</span>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search file name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-48 text-xs sm:w-64"
            />
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              title="Refresh files"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || isRefetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-16 text-center text-xs">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
            Loading files from Supabase Storage...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="space-y-3 py-16 text-center">
            <HardDrive className="text-muted-foreground mx-auto h-8 w-8" />
            <p className="text-foreground text-sm font-semibold">No files in bucket</p>
            <p className="text-muted-foreground mx-auto max-w-sm text-xs">
              Upload images using the uploader above or when editing projects to store them in your
              Supabase bucket.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredFiles.map((file) => (
              <div
                key={file.path || file.name}
                className="group border-border/80 bg-secondary/20 relative flex flex-col justify-between overflow-hidden rounded-xl border"
              >
                {/* Thumbnail / Image */}
                <div className="bg-secondary/50 relative aspect-video w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <a
                      href={file.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card/80 text-foreground hover:text-primary rounded-lg p-2 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="space-y-2 p-3">
                  <p className="text-foreground truncate text-xs font-semibold" title={file.name}>
                    {file.name}
                  </p>

                  <div className="border-border/50 flex items-center justify-between border-t pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(file.publicUrl, file.path)}
                      className="text-primary flex cursor-pointer items-center gap-1 text-[11px] font-medium hover:underline"
                    >
                      {copiedPath === file.path ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy URL
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(file.path)}
                      disabled={deleteMutation.isPending}
                      className="text-muted-foreground hover:text-destructive rounded-md p-1 transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supabase Bucket Setup Guide */}
      <div className="bg-card border-border space-y-3 rounded-2xl border p-6">
        <h3 className="text-foreground flex items-center gap-2 text-sm font-bold">
          <HardDrive className="text-primary h-4 w-4" /> Supabase Storage Setup Reference
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Ensure your Supabase project contains a bucket named{" "}
          <code className="bg-secondary text-foreground rounded px-1 py-0.5 font-mono font-semibold">
            {DEFAULT_BUCKET}
          </code>{" "}
          with public read access. You can configure this directly in the Supabase Dashboard under{" "}
          <strong>Storage → Buckets</strong>, or run the provided SQL script in the SQL Editor.
        </p>
      </div>
    </div>
  );
}
