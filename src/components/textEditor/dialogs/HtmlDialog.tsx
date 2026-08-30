"use client";

import type { Editor } from "@tiptap/react";
import { ShieldAlert } from "lucide-react";
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
  Label,
  Textarea,
} from "@/components/ui";

import { containsExecutableMarkup, sanitizeHtml } from "../utils/sanitizeHtml";

type HtmlDialogProps = {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `edit` updates the selected block, `create` inserts a new one. */
  mode: "create" | "edit";
  initialHtml: string;
};

const PLACEHOLDER = `<div class="promo">
  <h3>Free shipping this week</h3>
  <p>On every order over $50.</p>
</div>`;

/**
 * Editor for a raw HTML block, with the markup on the left and a live
 * sanitized preview of what will render on the right.
 */
export const HtmlDialog = ({
  editor,
  open,
  onOpenChange,
  mode,
  initialHtml,
}: HtmlDialogProps) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (open) setHtml(initialHtml);
  }, [open, initialHtml]);

  const hasExecutable = useMemo(() => containsExecutableMarkup(html), [html]);
  const preview = useMemo(() => sanitizeHtml(html), [html]);

  const save = () => {
    const markup = html.trim();

    if (mode === "edit") {
      editor.chain().focus().updateHtmlBlock(markup).run();
      toast.success("HTML block updated");
    } else {
      editor.chain().focus().setHtmlBlock(markup).run();
      toast.success("HTML block inserted");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit custom HTML" : "Insert custom HTML"}</DialogTitle>
          <DialogDescription>
            Markup is stored exactly as written and rendered as-is on the storefront.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-sm">HTML</Label>
            <Textarea
              autoFocus
              spellCheck={false}
              value={html}
              onChange={(event) => setHtml(event.target.value)}
              placeholder={PLACEHOLDER}
              className="h-72 resize-none font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">Preview</Label>
            <div className="bg-muted/20 h-72 overflow-auto rounded-md border p-3">
              {html.trim() ? (
                <div
                  className="tiptap-html-block"
                  // Sanitized above — scripts and inline handlers are removed
                  // before this reaches the DOM.
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              ) : (
                <p className="text-muted-foreground text-sm">Nothing to preview yet.</p>
              )}
            </div>
          </div>
        </div>

        {hasExecutable && (
          <p className="text-destructive bg-destructive/10 flex items-start gap-2 rounded-md p-2.5 text-xs">
            <ShieldAlert className="mt-px size-4 shrink-0" />
            <span>
              This markup contains a script or inline event handler. It is stripped from the
              preview and will not run inside the editor.
            </span>
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{mode === "edit" ? "Save changes" : "Insert block"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
