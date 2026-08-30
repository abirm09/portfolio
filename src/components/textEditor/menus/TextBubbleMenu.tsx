"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Baseline,
  Bold,
  Check,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

import { COLOR_SWATCHES, HIGHLIGHT_SWATCHES } from "../config/fonts";
import type { FeatureSet } from "../config/presets";
import { ColorPicker } from "../toolbar/ColorPicker";
import { toolbarBtnClass } from "../toolbar/primitives";
import type { ToolbarState } from "../toolbar/useToolbarState";
import { openEditorDialog } from "../utils/editorEvents";

const TURN_INTO = [
  { label: "Text", Icon: Pilcrow, run: (e: Editor) => e.chain().focus().setParagraph().run() },
  {
    label: "Heading 1",
    Icon: Heading1,
    run: (e: Editor) => e.chain().focus().setNode("heading", { level: 1 }).run(),
  },
  {
    label: "Heading 2",
    Icon: Heading2,
    run: (e: Editor) => e.chain().focus().setNode("heading", { level: 2 }).run(),
  },
  {
    label: "Heading 3",
    Icon: Heading3,
    run: (e: Editor) => e.chain().focus().setNode("heading", { level: 3 }).run(),
  },
  {
    label: "Bullet list",
    Icon: List,
    run: (e: Editor) => e.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Numbered list",
    Icon: ListOrdered,
    run: (e: Editor) => e.chain().focus().toggleOrderedList().run(),
  },
  { label: "Quote", Icon: Quote, run: (e: Editor) => e.chain().focus().toggleBlockquote().run() },
] as const;

const panelClass =
  "bg-popover text-popover-foreground z-40 flex items-center gap-0.5 rounded-md border p-1 shadow-md";

/**
 * Formatting bar that follows a text selection.
 *
 * Hidden inside code blocks, on node selections (images, video, HTML blocks
 * have their own controls) and while the selection is empty.
 */
export const TextBubbleMenu = ({
  editor,
  state,
  isEnabled,
}: {
  editor: Editor;
  state: ToolbarState;
  isEnabled: FeatureSet;
}) => {
  const blockLabel = state.headingLevel ? `H${state.headingLevel}` : "Text";

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="textBubbleMenu"
      updateDelay={120}
      options={{ placement: "top", offset: 8 }}
      shouldShow={({ editor: e, from, to }) => {
        if (!e.isEditable) return false;
        if (from === to) return false;
        if (e.isActive("codeBlock") || e.isActive("htmlBlock")) return false;
        if (e.isActive("image") || e.isActive("video")) return false;
        return true;
      }}
      className={panelClass}
    >
      {isEnabled("blockType") && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(toolbarBtnClass(), "px-2")}>
              <span className="text-xs font-medium">{blockLabel}</span>
              <ChevronDown className="size-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {TURN_INTO.map(({ label, Icon, run }) => (
                <DropdownMenuItem key={label} onClick={() => run(editor)}>
                  <Icon /> {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span aria-hidden className="bg-border mx-0.5 h-5 w-px" />
        </>
      )}

      <button
        type="button"
        aria-label="Bold"
        className={toolbarBtnClass(state.isBold)}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </button>
      <button
        type="button"
        aria-label="Italic"
        className={toolbarBtnClass(state.isItalic)}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </button>
      <button
        type="button"
        aria-label="Underline"
        className={toolbarBtnClass(state.isUnderline)}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </button>
      <button
        type="button"
        aria-label="Strikethrough"
        className={toolbarBtnClass(state.isStrike)}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough />
      </button>
      <button
        type="button"
        aria-label="Inline code"
        className={toolbarBtnClass(state.isCode)}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code />
      </button>

      <span aria-hidden className="bg-border mx-0.5 h-5 w-px" />

      {isEnabled("color") && (
        <ColorPicker
          label="Text colour"
          icon={<Baseline />}
          swatches={COLOR_SWATCHES}
          value={state.textColor}
          active={!!state.textColor}
          onSelect={(color) => editor.chain().focus().setColor(color).run()}
          onReset={() => editor.chain().focus().unsetColor().run()}
        />
      )}
      {isEnabled("highlight") && (
        <ColorPicker
          label="Highlight"
          icon={<Highlighter />}
          swatches={HIGHLIGHT_SWATCHES}
          value={state.highlightColor}
          active={state.isHighlight}
          onSelect={(color) => editor.chain().focus().setHighlight({ color }).run()}
          onReset={() => editor.chain().focus().unsetHighlight().run()}
        />
      )}

      {isEnabled("link") && (
        <button
          type="button"
          aria-label="Link"
          className={toolbarBtnClass(state.isLink)}
          onClick={() => openEditorDialog(editor, "link")}
        >
          {state.isLink ? <Check /> : <Link2 />}
        </button>
      )}
    </BubbleMenu>
  );
};
