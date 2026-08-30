"use client";

import type { Editor } from "@tiptap/react";
import { ImageOff, Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

import {
  IMAGE_ACCEPT_ATTRIBUTE,
  filterImageFiles,
  readImageFile,
  type ImageReadOptions,
} from "../utils/imageFile";

type ImageDialogProps = {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
} & ImageReadOptions;

const EMPTY = { src: "", alt: "", caption: "", href: "", width: "" };

/**
 * Insert dialog for images.
 *
 * Files never leave the browser: they are validated, optionally downscaled and
 * embedded as base64 so the resulting HTML is self-contained.
 */
export const ImageDialog = ({
  editor,
  open,
  onOpenChange,
  maxSizeMB,
  maxDimension,
}: ImageDialogProps) => {
  const [form, setForm] = useState(EMPTY);
  const [tab, setTab] = useState("url");
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setTab("url");
      setPreviewFailed(false);
    }
  }, [open]);

  const set = (patch: Partial<typeof EMPTY>) => setForm((current) => ({ ...current, ...patch }));

  const ingest = async (file?: File) => {
    if (!file) return;
    setReading(true);

    const result = await readImageFile(file, { maxSizeMB, maxDimension });
    setReading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setPreviewFailed(false);
    set({
      src: result.dataUrl,
      alt: form.alt || file.name.replace(/\.[^.]+$/, ""),
      width: result.width ? String(Math.min(result.width, 800)) : form.width,
    });
  };

  const insert = () => {
    if (!form.src) return;

    const width = parseInt(form.width, 10);

    editor
      .chain()
      .focus()
      .setImage({
        src: form.src,
        alt: form.alt || undefined,
        caption: form.caption || "",
        href: form.href || "",
        ...(Number.isFinite(width) && width > 0 ? { width } : {}),
      })
      .run();

    onOpenChange(false);
    toast.success("Image inserted");
  };

  const isDataUrl = form.src.startsWith("data:");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Insert image</DialogTitle>
          <DialogDescription>
            Link to an image or upload one from your device.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">From URL</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="mt-4 space-y-1.5">
            <Label className="text-sm">Image URL</Label>
            <Input
              autoFocus
              placeholder="https://example.com/photo.jpg or /images/photo.jpg"
              value={isDataUrl ? "" : form.src}
              onChange={(event) => {
                setPreviewFailed(false);
                set({ src: event.target.value });
              }}
            />
            <p className="text-muted-foreground text-xs">
              Best for large files — the URL is stored instead of the image data.
            </p>
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                void ingest(filterImageFiles(event.dataTransfer.files)[0]);
              }}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed px-3 py-8 text-sm transition-colors",
                dragging ? "border-primary bg-primary/5" : "border-input hover:bg-accent",
              )}
            >
              {reading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Upload className="size-5" />
              )}
              <span>
                {reading
                  ? "Processing…"
                  : isDataUrl
                    ? "Image ready — click to replace"
                    : "Drop an image here or click to browse"}
              </span>
              <span className="text-muted-foreground text-xs">
                PNG, JPEG, WebP, GIF, AVIF or SVG · up to {maxSizeMB ?? 2} MB
              </span>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept={IMAGE_ACCEPT_ATTRIBUTE}
              className="hidden"
              onChange={(event) => {
                void ingest(event.target.files?.[0]);
                event.target.value = "";
              }}
            />

            <p className="text-muted-foreground mt-2 text-xs">
              Uploaded files are embedded directly in the content, so large images make the saved
              record bigger. Oversized photos are downscaled automatically.
            </p>
          </TabsContent>
        </Tabs>

        {form.src && (
          <div className="bg-muted/30 flex min-h-24 items-center justify-center rounded-md border p-2">
            {previewFailed ? (
              <span className="text-muted-foreground flex items-center gap-2 text-sm">
                <ImageOff className="size-4" /> That image could not be loaded
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.src}
                alt="Preview"
                onError={() => setPreviewFailed(true)}
                className="max-h-40 w-auto max-w-full rounded object-contain"
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm">Alt text</Label>
            <Input
              placeholder="Describes the image"
              value={form.alt}
              onChange={(event) => set({ alt: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Width (px)</Label>
            <Input
              type="number"
              min={1}
              placeholder="Auto"
              value={form.width}
              onChange={(event) => set({ width: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Caption</Label>
            <Input
              placeholder="Optional"
              value={form.caption}
              onChange={(event) => set({ caption: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Links to</Label>
            <Input
              placeholder="Optional URL"
              value={form.href}
              onChange={(event) => set({ href: event.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={insert} disabled={!form.src || reading}>
            Insert image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
