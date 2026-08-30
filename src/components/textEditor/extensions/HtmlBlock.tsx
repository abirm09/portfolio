"use client";

import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { Code2, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { openEditorDialog } from "../utils/editorEvents";
import { sanitizeHtml } from "../utils/sanitizeHtml";

declare module "@tiptap/core" {
  // Interface required: this merges into Tiptap's own command map.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Commands<ReturnType> {
    htmlBlock: {
      setHtmlBlock: (html: string) => ReturnType;
      updateHtmlBlock: (html: string) => ReturnType;
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Node view                                 */
/* -------------------------------------------------------------------------- */

const HtmlBlockNodeView = ({ node, selected, editor, deleteNode, getPos }: NodeViewProps) => {
  const [showSource, setShowSource] = useState(false);
  const html = (node.attrs.html as string) ?? "";
  const editable = editor.isEditable;

  const requestEdit = () => {
    const pos = typeof getPos === "function" ? getPos() : null;
    if (typeof pos !== "number") return;
    editor.commands.setNodeSelection(pos);
    openEditorDialog(editor, "html", { html, mode: "edit" });
  };

  return (
    <NodeViewWrapper
      className={cn(
        "tiptap-html-block-shell group/html my-3 rounded-md border transition-colors",
        selected && editable ? "border-primary ring-primary/30 ring-1" : "border-border",
      )}
      data-drag-handle
    >
      {editable && (
        <div className="bg-muted/60 text-muted-foreground flex items-center gap-1 border-b px-2 py-1 text-xs">
          <Code2 className="size-3.5" />
          <span className="font-medium">Custom HTML</span>

          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              title={showSource ? "Show preview" : "Show source"}
              onClick={() => setShowSource((value) => !value)}
              className="hover:bg-accent hover:text-accent-foreground rounded p-1"
            >
              {showSource ? <Eye className="size-3.5" /> : <Code2 className="size-3.5" />}
            </button>
            <button
              type="button"
              title="Edit HTML"
              onClick={requestEdit}
              className="hover:bg-accent hover:text-accent-foreground rounded p-1"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              title="Delete block"
              onClick={deleteNode}
              className="hover:bg-destructive/10 hover:text-destructive rounded p-1"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {showSource ? (
        <pre className="bg-muted/30 max-h-72 overflow-auto p-3 text-xs whitespace-pre-wrap">
          <code>{html || "<!-- empty -->"}</code>
        </pre>
      ) : (
        <div
          className="tiptap-html-block p-3"
          // Sanitized above; scripts and event handlers are stripped before
          // anything reaches the DOM.
          dangerouslySetInnerHTML={{
            __html:
              sanitizeHtml(html) ||
              '<p style="opacity:.6;font-style:italic">Empty HTML block — click the pencil to add markup.</p>',
          }}
        />
      )}
    </NodeViewWrapper>
  );
};

/* -------------------------------------------------------------------------- */
/*                                  Extension                                 */
/* -------------------------------------------------------------------------- */

/**
 * Holds arbitrary author-supplied markup and gives it back verbatim on save.
 *
 * `renderHTML` returns a live DOM node rather than a spec array, which is the
 * only way to emit markup that Tiptap has no schema for — the serializer
 * walks the returned element as-is, so custom divs, iframes, embeds and inline
 * styles survive a save/reload round trip untouched.
 */
export const HtmlBlock = Node.create({
  name: "htmlBlock",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  isolating: true,

  addAttributes() {
    return {
      html: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-html-block]",
        getAttrs: (element) => ({ html: (element as HTMLElement).innerHTML }),
      },
    ];
  },

  renderHTML({ node }) {
    const dom = document.createElement("div");
    dom.setAttribute("data-html-block", "");
    dom.innerHTML = (node.attrs.html as string) ?? "";
    return { dom };
  },

  addNodeView() {
    return ReactNodeViewRenderer(HtmlBlockNodeView);
  },

  addCommands() {
    return {
      setHtmlBlock:
        (html) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { html } }),

      updateHtmlBlock:
        (html) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { html }),
    };
  },
});
