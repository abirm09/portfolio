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

  const { data: files = [], isLoading, isRefetching, refetch, error: queryError } = useStorageFiles(folder);
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
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Storage Notice</p>
            <p className="mt-0.5">{activeError}</p>
          </div>
        </div>
      )}

      {/* Upload Drag & Drop Box */}
      <div className="p-8 rounded-3xl bg-card border border-dashed border-primary/40 text-center space-y-4 shadow-xs relative overflow-hidden group">
        <div className="size-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
          {uploadMutation.isPending ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : (
            <UploadCloud className="w-7 h-7" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-base text-foreground">
            {uploadMutation.isPending
              ? "Uploading files to Supabase..."
              : "Upload Assets to Supabase Bucket"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Upload images (PNG, JPG, WebP, SVG) directly to your Supabase storage bucket.
          </p>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer hover:bg-primary/90 shadow-md shadow-primary/20 transition-all">
            <ImageIcon className="w-4 h-4" /> Select Files to Upload
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
      <div className="p-6 rounded-2xl bg-card border border-border space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">Bucket Files</h2>
            <span className="text-xs text-muted-foreground">({files.length} items)</span>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search file name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 text-xs w-48 sm:w-64"
            />
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              title="Refresh files"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading || isRefetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            Loading files from Supabase Storage...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <HardDrive className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-semibold text-foreground">No files in bucket</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Upload images using the uploader above or when editing projects to store them in your Supabase bucket.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.path || file.name}
                className="group relative rounded-xl border border-border/80 bg-secondary/20 overflow-hidden flex flex-col justify-between"
              >
                {/* Thumbnail / Image */}
                <div className="aspect-video w-full bg-secondary/50 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a
                      href={file.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-card/80 text-foreground hover:text-primary transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-3 space-y-2">
                  <p className="text-xs font-semibold text-foreground truncate" title={file.name}>
                    {file.name}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => handleCopy(file.publicUrl, file.path)}
                      className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
                    >
                      {copiedPath === file.path ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy URL
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(file.path)}
                      disabled={deleteMutation.isPending}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supabase Bucket Setup Guide */}
      <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-primary" /> Supabase Storage Setup Reference
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ensure your Supabase project contains a bucket named{" "}
          <code className="px-1 py-0.5 rounded bg-secondary font-mono text-foreground font-semibold">
            {DEFAULT_BUCKET}
          </code>{" "}
          with public read access. You can configure this directly in the Supabase Dashboard under <strong>Storage → Buckets</strong>, or run the provided SQL script in the SQL Editor.
        </p>
      </div>
    </div>
  );
}
