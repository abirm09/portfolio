"use client";

import type { Editor } from "@tiptap/react";
import { Film, Link2, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  Switch,
} from "@/components/ui";

import { isSafeMediaUrl, parseVideoSource } from "../utils/videoSources";

type VideoDialogProps = {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PROVIDER_LABEL = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  file: "Direct file",
} as const;

const EMPTY = { url: "", poster: "", controls: true, loop: false, muted: false };

/**
 * Videos are referenced by URL only — nothing is uploaded and nothing is
 * embedded as data. YouTube and Vimeo links become provider embeds; anything
 * else is treated as a direct file path and played in a real `<video>`.
 */
export const VideoDialog = ({ editor, open, onOpenChange }: VideoDialogProps) => {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);

  const set = (patch: Partial<typeof EMPTY>) => setForm((current) => ({ ...current, ...patch }));

  const parsed = useMemo(() => (form.url.trim() ? parseVideoSource(form.url) : null), [form.url]);
  const isFile = parsed?.provider === "file";

  const insert = () => {
    if (!parsed) return;

    if (!isSafeMediaUrl(parsed.src)) {
      toast.error("That video address is not a valid http(s) URL or file path.");
      return;
    }

    editor
      .chain()
      .focus()
      .setVideo({
        src: parsed.input,
        poster: isFile && form.poster ? form.poster : null,
        controls: isFile ? form.controls : true,
        loop: isFile ? form.loop : false,
        muted: isFile ? form.muted : false,
      })
      .run();

    onOpenChange(false);
    toast.success(`${PROVIDER_LABEL[parsed.provider]} video inserted`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert video</DialogTitle>
          <DialogDescription>
            Paste a YouTube or Vimeo link, or the path to a video file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Video URL or path</Label>
            <Input
              autoFocus
              placeholder="https://vimeo.com/76979871"
              value={form.url}
              onChange={(event) => set({ url: event.target.value })}
              onKeyDown={(event) => event.key === "Enter" && insert()}
            />

            {parsed ? (
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                {isFile ? <Film className="size-3.5" /> : <Play className="size-3.5" />}
                Detected: <span className="font-medium">{PROVIDER_LABEL[parsed.provider]}</span>
              </p>
            ) : (
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Link2 className="size-3.5" />
                YouTube, Vimeo, or a path such as <code>/videos/promo.mp4</code>
              </p>
            )}
          </div>

          {/* Playback flags only exist on a real <video> element. */}
          {isFile && (
            <div className="space-y-3 rounded-md border p-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Poster image</Label>
                <Input
                  placeholder="Optional thumbnail URL"
                  value={form.poster}
                  onChange={(event) => set({ poster: event.target.value })}
                />
              </div>

              {(
                [
                  ["controls", "Show player controls"],
                  ["loop", "Loop playback"],
                  ["muted", "Start muted"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-sm font-normal">{label}</Label>
                  <Switch
                    checked={form[key]}
                    onCheckedChange={(checked) => set({ [key]: checked })}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={insert} disabled={!parsed}>
            Insert video
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
