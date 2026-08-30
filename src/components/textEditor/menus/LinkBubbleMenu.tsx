"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Copy, ExternalLink, Pencil, Unlink } from "lucide-react";
import { toast } from "sonner";

import { toolbarBtnClass } from "../toolbar/primitives";
import { openEditorDialog } from "../utils/editorEvents";

/** Appears when the caret sits inside a link, offering the usual four actions. */
export const LinkBubbleMenu = ({ editor }: { editor: Editor }) => {
  const href = (editor.getAttributes("link").href as string) ?? "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      toast.success("Link copied");
    } catch {
      toast.error("Clipboard access was blocked by the browser.");
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="linkBubbleMenu"
      updateDelay={120}
      options={{ placement: "bottom", offset: 8 }}
      shouldShow={({ editor: e, from, to }) =>
        e.isEditable && from === to && e.isActive("link")
      }
      className="bg-popover text-popover-foreground z-40 flex max-w-sm items-center gap-1 rounded-md border p-1 shadow-md"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary max-w-56 truncate px-2 text-xs hover:underline"
        title={href}
      >
        {href}
      </a>

      <span aria-hidden className="bg-border mx-0.5 h-5 w-px" />

      <button
        type="button"
        aria-label="Open link"
        className={toolbarBtnClass()}
        onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
      >
        <ExternalLink />
      </button>
      <button type="button" aria-label="Copy link" className={toolbarBtnClass()} onClick={copy}>
        <Copy />
      </button>
      <button
        type="button"
        aria-label="Edit link"
        className={toolbarBtnClass()}
        onClick={() => openEditorDialog(editor, "link")}
      >
        <Pencil />
      </button>
      <button
        type="button"
        aria-label="Remove link"
        className={toolbarBtnClass()}
        onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
      >
        <Unlink />
      </button>
    </BubbleMenu>
  );
};
