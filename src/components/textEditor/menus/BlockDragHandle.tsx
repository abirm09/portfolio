"use client";

import { DragHandle } from "@tiptap/extension-drag-handle-react";
import type { Editor } from "@tiptap/react";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

import type { FeatureSet } from "../config/presets";

/**
 * The grip that appears in the gutter next to the hovered block.
 *
 * `+` starts a new paragraph below (and opens the slash menu so the author can
 * pick a block type straight away); the grip itself drags, and its menu offers
 * duplicate and delete.
 */
export const BlockDragHandle = ({
  editor,
  isEnabled,
}: {
  editor: Editor;
  isEnabled: FeatureSet;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const current = useRef<{ node: ProseMirrorNode | null; pos: number }>({ node: null, pos: -1 });

  const insertBelow = () => {
    const { node, pos } = current.current;
    if (!node || pos < 0) return;

    const end = pos + node.nodeSize;
    editor
      .chain()
      .focus()
      .insertContentAt(end, { type: "paragraph" })
      .setTextSelection(end + 1)
      .run();

    // Opening the slash menu turns "add a block" into one gesture.
    if (isEnabled("slashCommand")) editor.chain().insertContent("/").run();
  };

  const duplicate = () => {
    const { node, pos } = current.current;
    if (!node || pos < 0) return;
    editor
      .chain()
      .focus()
      .insertContentAt(pos + node.nodeSize, node.toJSON())
      .run();
  };

  const remove = () => {
    const { node, pos } = current.current;
    if (!node || pos < 0) return;
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .run();
  };

  const buttonClass =
    "text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-6 items-center justify-center rounded transition-colors";

  return (
    <DragHandle
      editor={editor}
      nested
      onNodeChange={({ node, pos }) => {
        current.current = { node, pos };
      }}
      className={cn(
        "flex items-center gap-0.5 pr-1",
        // Keep the handle visible while its menu is open, otherwise the menu
        // closes the moment the pointer leaves the gutter.
        menuOpen && "opacity-100",
      )}
    >
      <button
        type="button"
        aria-label="Insert block below"
        onClick={insertBelow}
        className={buttonClass}
      >
        <Plus className="size-4" />
      </button>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          aria-label="Block actions"
          className={cn(buttonClass, "cursor-grab active:cursor-grabbing")}
        >
          <GripVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem onClick={duplicate}>
            <Copy /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={remove}>
            <Trash2 /> Delete block
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DragHandle>
  );
};
