"use client";

import type { Editor } from "@tiptap/react";
import {
  AlertTriangle,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  Code2,
  Eraser,
  Eye,
  FileCode2,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  ImageIcon,
  Italic,
  Keyboard,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Maximize2,
  Minimize2,
  Minus,
  MoreHorizontal,
  PaintBucket,
  Pilcrow,
  Quote,
  Redo2,
  Search,
  Sigma,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Type,
  Underline as UnderlineIcon,
  Undo2,
  Video as VideoIcon,
  Pilcrow as PilcrowIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TooltipProvider,
} from "@/components/ui";
import { cn } from "@/lib/utils";

import { COLOR_SWATCHES, FONT_FAMILIES, FONT_SIZES, HIGHLIGHT_SWATCHES, LINE_HEIGHTS } from "../config/fonts";
import type { FeatureSet } from "../config/presets";
import { CALLOUT_LABEL, CALLOUT_VARIANTS } from "../extensions/Callout";
import { openEditorDialog } from "../utils/editorEvents";
import { ColorPicker } from "./ColorPicker";
import { TableMenu } from "./TableMenu";
import { toolbarBtnClass, ToolbarButton, ToolbarDivider, ToolbarTip } from "./primitives";
import type { ToolbarState } from "./useToolbarState";

const HEADINGS = [
  { level: 1, label: "Heading 1", Icon: Heading1 },
  { level: 2, label: "Heading 2", Icon: Heading2 },
  { level: 3, label: "Heading 3", Icon: Heading3 },
  { level: 4, label: "Heading 4", Icon: Heading4 },
  { level: 5, label: "Heading 5", Icon: Heading5 },
  { level: 6, label: "Heading 6", Icon: Heading6 },
] as const;

const ALIGNMENTS = [
  { value: "left", label: "Align left", Icon: AlignLeft, shortcut: "Mod+Shift+L" },
  { value: "center", label: "Align center", Icon: AlignCenter, shortcut: "Mod+Shift+E" },
  { value: "right", label: "Align right", Icon: AlignRight, shortcut: "Mod+Shift+R" },
  { value: "justify", label: "Justify", Icon: AlignJustify, shortcut: "Mod+Shift+J" },
] as const;

export type ToolbarProps = {
  editor: Editor;
  state: ToolbarState;
  isEnabled: FeatureSet;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isPreview: boolean;
  onTogglePreview: () => void;
  showInvisibles: boolean;
  onToggleInvisibles: () => void;
  onToggleFind: () => void;
};

export const Toolbar = ({
  editor,
  state,
  isEnabled,
  isFullscreen,
  onToggleFullscreen,
  isPreview,
  onTogglePreview,
  showInvisibles,
  onToggleInvisibles,
  onToggleFind,
}: ToolbarProps) => {
  const activeAlign = ALIGNMENTS.find((a) => a.value === state.align) ?? ALIGNMENTS[0];
  const blockLabel = state.headingLevel ? `Heading ${state.headingLevel}` : "Paragraph";
  const activeFont = FONT_FAMILIES.find((f) => f.value === state.fontFamily);
  const activeSize = FONT_SIZES.find((s) => s.value === state.fontSize);

  return (
    <TooltipProvider delayDuration={400}>
      <div
        role="toolbar"
        aria-label="Formatting"
        className="border-border bg-muted/40 sticky top-0 z-20 flex flex-wrap items-center gap-0.5 border-b p-1.5"
      >
        {/* ------------------------------ History ------------------------------ */}
        <ToolbarButton
          label="Undo"
          shortcut="Mod+Z"
          disabled={!state.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          shortcut="Mod+Shift+Z"
          disabled={!state.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 />
        </ToolbarButton>

        <ToolbarDivider />

        {/* ----------------------------- Block type ---------------------------- */}
        {isEnabled("blockType") && (
          <DropdownMenu>
            <ToolbarTip label="Paragraph style">
              <DropdownMenuTrigger
                className={cn(toolbarBtnClass(state.headingLevel > 0), "w-28 justify-between px-2")}
              >
                <span className="truncate">{blockLabel}</span>
                <ChevronDown className="size-3.5 shrink-0 opacity-60" />
              </DropdownMenuTrigger>
            </ToolbarTip>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
                <Pilcrow /> Paragraph
                {state.headingLevel === 0 && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {HEADINGS.map(({ level, label, Icon }) => (
                <DropdownMenuItem
                  key={level}
                  onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                >
                  <Icon /> {label}
                  {state.headingLevel === level && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* ------------------------------- Fonts ------------------------------- */}
        {isEnabled("fontFamily") && (
          <DropdownMenu>
            <ToolbarTip label="Font">
              <DropdownMenuTrigger
                className={cn(toolbarBtnClass(!!state.fontFamily), "w-24 justify-between px-2")}
              >
                <span className="truncate" style={{ fontFamily: state.fontFamily || undefined }}>
                  {activeFont?.label ?? "Font"}
                </span>
                <ChevronDown className="size-3.5 shrink-0 opacity-60" />
              </DropdownMenuTrigger>
            </ToolbarTip>
            <DropdownMenuContent align="start" className="max-h-80 w-52 overflow-y-auto">
              {FONT_FAMILIES.map(({ label, value }) => (
                <DropdownMenuItem
                  key={label}
                  style={{ fontFamily: value || undefined }}
                  onClick={() =>
                    value
                      ? editor.chain().focus().setFontFamily(value).run()
                      : editor.chain().focus().unsetFontFamily().run()
                  }
                >
                  {label}
                  {state.fontFamily === value && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {isEnabled("fontSize") && (
          <DropdownMenu>
            <ToolbarTip label="Font size">
              <DropdownMenuTrigger
                className={cn(toolbarBtnClass(!!state.fontSize), "w-16 justify-between px-2")}
              >
                <span className="truncate">{activeSize?.label ?? "Size"}</span>
                <ChevronDown className="size-3.5 shrink-0 opacity-60" />
              </DropdownMenuTrigger>
            </ToolbarTip>
            <DropdownMenuContent align="start" className="max-h-80 w-32 overflow-y-auto">
              {FONT_SIZES.map(({ label, value }) => (
                <DropdownMenuItem
                  key={label}
                  onClick={() =>
                    value
                      ? editor.chain().focus().setFontSize(value).run()
                      : editor.chain().focus().unsetFontSize().run()
                  }
                >
                  {label}
                  {state.fontSize === value && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <ToolbarDivider />

        {/* --------------------------- Inline marks ---------------------------- */}
        <ToolbarButton
          label="Bold"
          shortcut="Mod+B"
          active={state.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          shortcut="Mod+I"
          active={state.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          shortcut="Mod+U"
          active={state.isUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          shortcut="Mod+Shift+S"
          active={state.isStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough />
        </ToolbarButton>
        <ToolbarButton
          label="Inline code"
          shortcut="Mod+E"
          active={state.isCode}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code />
        </ToolbarButton>

        {isEnabled("script") && (
          <>
            <ToolbarButton
              label="Subscript"
              active={state.isSubscript}
              onClick={() => editor.chain().focus().toggleSubscript().run()}
            >
              <SubscriptIcon />
            </ToolbarButton>
            <ToolbarButton
              label="Superscript"
              active={state.isSuperscript}
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
            >
              <SuperscriptIcon />
            </ToolbarButton>
          </>
        )}

        <ToolbarDivider />

        {/* ------------------------------ Colours ------------------------------ */}
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
        {isEnabled("backgroundColor") && (
          <ColorPicker
            label="Text background"
            icon={<PaintBucket />}
            swatches={COLOR_SWATCHES}
            value={state.backgroundColor}
            active={!!state.backgroundColor}
            onSelect={(color) => editor.chain().focus().setBackgroundColor(color).run()}
            onReset={() => editor.chain().focus().unsetBackgroundColor().run()}
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

        {isEnabled("clearFormat") && (
          <ToolbarButton
            label="Clear formatting"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            <Eraser />
          </ToolbarButton>
        )}

        <ToolbarDivider />

        {/* ----------------------------- Alignment ----------------------------- */}
        {isEnabled("align") && (
          <DropdownMenu>
            <ToolbarTip label="Text alignment">
              <DropdownMenuTrigger className={cn(toolbarBtnClass(), "px-1.5")}>
                <activeAlign.Icon />
                <ChevronDown className="size-3.5 opacity-60" />
              </DropdownMenuTrigger>
            </ToolbarTip>
            <DropdownMenuContent align="start">
              {ALIGNMENTS.map(({ value, label, Icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => editor.chain().focus().setTextAlign(value).run()}
                >
                  <Icon /> {label}
                  {state.align === value && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {isEnabled("lineHeight") && (
          <DropdownMenu>
            <ToolbarTip label="Line height">
              <DropdownMenuTrigger className={cn(toolbarBtnClass(!!state.lineHeight), "px-1.5")}>
                <PilcrowIcon />
                <ChevronDown className="size-3.5 opacity-60" />
              </DropdownMenuTrigger>
            </ToolbarTip>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel className="text-xs">Line height</DropdownMenuLabel>
              {LINE_HEIGHTS.map(({ label, value }) => (
                <DropdownMenuItem
                  key={label}
                  onClick={() =>
                    value
                      ? editor.chain().focus().setLineHeight(value).run()
                      : editor.chain().focus().unsetLineHeight().run()
                  }
                >
                  {label}
                  {state.lineHeight === value && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <ToolbarDivider />

        {/* ------------------------------- Blocks ------------------------------ */}
        {isEnabled("lists") && (
          <>
            <ToolbarButton
              label="Bullet list"
              shortcut="Mod+Shift+8"
              active={state.isBulletList}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List />
            </ToolbarButton>
            <ToolbarButton
              label="Numbered list"
              shortcut="Mod+Shift+7"
              active={state.isOrderedList}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered />
            </ToolbarButton>
          </>
        )}
        {isEnabled("taskList") && (
          <ToolbarButton
            label="Task list"
            shortcut="Mod+Shift+9"
            active={state.isTaskList}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListChecks />
          </ToolbarButton>
        )}
        {isEnabled("blockquote") && (
          <ToolbarButton
            label="Quote"
            shortcut="Mod+Shift+B"
            active={state.isBlockquote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote />
          </ToolbarButton>
        )}
        {isEnabled("codeBlock") && (
          <ToolbarButton
            label="Code block"
            shortcut="Mod+Alt+C"
            active={state.isCodeBlock}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code2 />
          </ToolbarButton>
        )}
        {isEnabled("hr") && (
          <ToolbarButton
            label="Divider"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus />
          </ToolbarButton>
        )}

        <ToolbarDivider />

        {/* ------------------------------ Inserts ------------------------------ */}
        {isEnabled("link") && (
          <ToolbarButton
            label="Link"
            shortcut="Mod+K"
            active={state.isLink}
            onClick={() => openEditorDialog(editor, "link")}
          >
            <Link2 />
          </ToolbarButton>
        )}
        {isEnabled("image") && (
          <ToolbarButton label="Insert image" onClick={() => openEditorDialog(editor, "image")}>
            <ImageIcon />
          </ToolbarButton>
        )}
        {isEnabled("video") && (
          <ToolbarButton label="Insert video" onClick={() => openEditorDialog(editor, "video")}>
            <VideoIcon />
          </ToolbarButton>
        )}
        {isEnabled("htmlBlock") && (
          <ToolbarButton
            label="Custom HTML"
            onClick={() => openEditorDialog(editor, "html", { mode: "create" })}
          >
            <FileCode2 />
          </ToolbarButton>
        )}
        {isEnabled("table") && <TableMenu editor={editor} inTable={state.isInTable} />}

        <ToolbarDivider />

        {/* -------------------------- Utility cluster -------------------------- */}
        {isEnabled("findReplace") && (
          <ToolbarButton label="Find & replace" shortcut="Mod+F" onClick={onToggleFind}>
            <Search />
          </ToolbarButton>
        )}
        {isEnabled("preview") && (
          <ToolbarButton label="Preview" active={isPreview} onClick={onTogglePreview}>
            <Eye />
          </ToolbarButton>
        )}
        {isEnabled("fullscreen") && (
          <ToolbarButton
            label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            active={isFullscreen}
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </ToolbarButton>
        )}

        {/* ------------------------------- More -------------------------------- */}
        <MoreMenu
          editor={editor}
          state={state}
          isEnabled={isEnabled}
          showInvisibles={showInvisibles}
          onToggleInvisibles={onToggleInvisibles}
        />
      </div>
    </TooltipProvider>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 More menu                                  */
/* -------------------------------------------------------------------------- */

/**
 * Secondary tools live here permanently rather than being measured into an
 * overflow bucket — a stable position is easier to learn than one that moves
 * with the viewport, and it keeps the primary row short on narrow screens.
 */
const MoreMenu = ({
  editor,
  state,
  isEnabled,
  showInvisibles,
  onToggleInvisibles,
}: {
  editor: Editor;
  state: ToolbarState;
  isEnabled: FeatureSet;
  showInvisibles: boolean;
  onToggleInvisibles: () => void;
}) => {
  const hasCallout = isEnabled("callout");
  const hasDetails = isEnabled("details");
  const hasMath = isEnabled("math");
  const hasMarkdown = isEnabled("markdown");
  const hasInvisibles = isEnabled("invisibles");
  const hasShortcuts = isEnabled("shortcuts");

  if (!hasCallout && !hasDetails && !hasMath && !hasMarkdown && !hasInvisibles && !hasShortcuts) {
    return null;
  }

  return (
    <DropdownMenu>
      <ToolbarTip label="More">
        <DropdownMenuTrigger className={cn(toolbarBtnClass(), "ml-auto px-1.5")}>
          <MoreHorizontal />
        </DropdownMenuTrigger>
      </ToolbarTip>

      <DropdownMenuContent align="end" className="w-56">
        {hasCallout && (
          <>
            <DropdownMenuLabel className="text-xs">Callout</DropdownMenuLabel>
            {CALLOUT_VARIANTS.map((variant) => (
              <DropdownMenuItem
                key={variant}
                onClick={() => editor.chain().focus().toggleCallout(variant).run()}
              >
                <AlertTriangle /> {CALLOUT_LABEL[variant]}
                {state.calloutVariant === variant && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        {hasDetails && (
          <DropdownMenuItem
            onClick={() =>
              state.isDetails
                ? editor.chain().focus().unsetDetails().run()
                : editor.chain().focus().setDetails().run()
            }
          >
            <ChevronRight /> {state.isDetails ? "Remove toggle" : "Toggle section"}
          </DropdownMenuItem>
        )}

        {hasMath && (
          <>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertContent({ type: "inlineMath", attrs: { latex: "" } })
                  .run()
              }
            >
              <Sigma /> Inline formula
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertContent({ type: "blockMath", attrs: { latex: "" } })
                  .run()
              }
            >
              <Sigma /> Formula block
            </DropdownMenuItem>
          </>
        )}

        {(hasDetails || hasMath) && (hasMarkdown || hasInvisibles || hasShortcuts) && (
          <DropdownMenuSeparator />
        )}

        {hasMarkdown && (
          <DropdownMenuItem onClick={() => openEditorDialog(editor, "markdown")}>
            <FileText /> Markdown import / export
          </DropdownMenuItem>
        )}

        {hasInvisibles && (
          <DropdownMenuItem onClick={onToggleInvisibles}>
            <Type /> Invisible characters
            {showInvisibles && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        )}

        {hasShortcuts && (
          <DropdownMenuItem onClick={() => openEditorDialog(editor, "shortcuts")}>
            <Keyboard /> Keyboard shortcuts
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
