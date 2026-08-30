"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import "katex/dist/katex.min.css";

import "./editor.css";

import { buildExtensions } from "./config/extensions";
import { resolveFeatures } from "./config/presets";
import { HtmlDialog } from "./dialogs/HtmlDialog";
import { ImageDialog } from "./dialogs/ImageDialog";
import { LinkDialog } from "./dialogs/LinkDialog";
import { MarkdownDialog } from "./dialogs/MarkdownDialog";
import { ShortcutsDialog } from "./dialogs/ShortcutsDialog";
import { VideoDialog } from "./dialogs/VideoDialog";
import { BlockDragHandle } from "./menus/BlockDragHandle";
import { LinkBubbleMenu } from "./menus/LinkBubbleMenu";
import { TextBubbleMenu } from "./menus/TextBubbleMenu";
import { FindReplacePanel } from "./panels/FindReplacePanel";
import { StatusBar } from "./panels/StatusBar";
import { Toolbar } from "./toolbar/Toolbar";
import { useToolbarState } from "./toolbar/useToolbarState";
import type { TextEditorProps } from "./types";
import {
  EDITOR_DIALOG_EVENT,
  type EditorDialogDetail,
  type EditorDialogName,
} from "./utils/editorEvents";
import { readImageFile } from "./utils/imageFile";
import { looksLikeMarkdown } from "./utils/markdown";

type DialogState = { name: EditorDialogName | null; payload: Record<string, unknown> };

const NO_DIALOG: DialogState = { name: null, payload: {} };

export const EditorCore = ({
  content,
  onChange,
  preset = "full",
  features,
  placeholder = "Start typing, or press / for blocks…",
  disabled = false,
  minHeight = 260,
  maxCharacters,
  className,
  maxImageSizeMB = 2,
  maxImageDimension = 1600,
}: TextEditorProps) => {
  const [dialog, setDialog] = useState<DialogState>(NO_DIALOG);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showInvisibles, setShowInvisibles] = useState(false);
  const [findOpen, setFindOpen] = useState(false);

  // Keyed on the serialized overrides rather than the object identity: call
  // sites naturally pass an inline literal, which would otherwise rebuild the
  // extension list — and therefore the whole editor — on every render.
  const featureKey = features ? JSON.stringify(features) : "";
  const isEnabled = useMemo(
    () => resolveFeatures(preset, featureKey ? (JSON.parse(featureKey) as typeof features) : undefined),
    [preset, featureKey],
  );

  // Read inside callbacks that must not re-create the editor when the parent
  // re-renders with a new function identity.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const imageLimitsRef = useRef({ maxImageSizeMB, maxImageDimension });
  imageLimitsRef.current = { maxImageSizeMB, maxImageDimension };

  const editorRef = useRef<ReturnType<typeof useEditor> | null>(null);

  /** Shared by the insert dialog, drag-drop and clipboard paste. */
  const insertImageFiles = useCallback(async (files: File[]) => {
    const editor = editorRef.current;
    if (!editor || !files.length) return;

    const { maxImageSizeMB: maxSizeMB, maxImageDimension: maxDimension } = imageLimitsRef.current;

    for (const file of files) {
      const result = await readImageFile(file, { maxSizeMB, maxDimension });

      if (!result.ok) {
        toast.error(result.error);
        continue;
      }

      editor
        .chain()
        .focus()
        .setImage({
          src: result.dataUrl,
          alt: file.name.replace(/\.[^.]+$/, ""),
          ...(result.width ? { width: Math.min(result.width, 800) } : {}),
        })
        .run();
    }
  }, []);

  const extensions = useMemo(
    () =>
      buildExtensions({
        isEnabled,
        placeholder,
        maxCharacters,
        onFiles: (files) => void insertImageFiles(files),
      }),
    [isEnabled, placeholder, maxCharacters, insertImageFiles],
  );

  const editor = useEditor(
    {
      extensions,
      content: content ?? "",
      editable: !disabled && !isPreview,
      // The public component is loaded through next/dynamic with ssr disabled,
      // so there is no server render to hydrate against.
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: "tiptap-content focus:outline-none",
          style: `min-height:${minHeight}px`,
        },
        handlePaste: (view, event) => {
          if (!isEnabled("markdown")) return false;

          const text = event.clipboardData?.getData("text/plain") ?? "";
          const html = event.clipboardData?.getData("text/html") ?? "";

          // Rich HTML on the clipboard is always the better source; only plain
          // text that reads as Markdown is worth reinterpreting.
          if (html || !text || !looksLikeMarkdown(text)) return false;

          event.preventDefault();
          editorRef.current?.commands.insertContent(text, { contentType: "markdown" });
          return true;
        },
      },
      onUpdate: ({ editor: instance }) => {
        // Normalise the empty document ("<p></p>") to an empty string so
        // required-field validation on the consuming forms still works.
        onChangeRef.current(instance.isEmpty ? "" : instance.getHTML());
      },
    },
    [extensions],
  );

  editorRef.current = editor;

  /* ------------------------------ Side effects ----------------------------- */

  // Adopt content supplied from outside (async form loads, resets), but never
  // while the author is mid-edit, which would move their caret.
  useEffect(() => {
    if (!editor) return;

    const incoming = content ?? "";
    if (editor.isFocused) return;
    if (incoming === (editor.isEmpty ? "" : editor.getHTML())) return;

    editor.commands.setContent(incoming, { emitUpdate: false });
  }, [content, editor]);

  useEffect(() => {
    editor?.setEditable(!disabled && !isPreview);
  }, [editor, disabled, isPreview]);

  useEffect(() => {
    if (!editor || !isEnabled("invisibles")) return;
    if (showInvisibles) editor.commands.showInvisibleCharacters();
    else editor.commands.hideInvisibleCharacters();
  }, [editor, showInvisibles, isEnabled]);

  // Dialog requests arrive as events on the editor's own DOM node so that two
  // editors on the same page never open each other's dialogs.
  useEffect(() => {
    if (!editor) return;

    const dom = editor.view.dom;
    const handle = (event: Event) => {
      const { dialog: name, payload } = (event as CustomEvent<EditorDialogDetail>).detail;
      setDialog({ name, payload: payload ?? {} });
    };

    dom.addEventListener(EDITOR_DIALOG_EVENT, handle);
    return () => dom.removeEventListener(EDITOR_DIALOG_EVENT, handle);
  }, [editor]);

  // Ctrl/Cmd+F is scoped to the editor so it does not hijack the browser's
  // find when the author is working elsewhere on the page.
  useEffect(() => {
    if (!editor || !isEnabled("findReplace")) return;

    const dom = editor.view.dom;
    const handle = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setFindOpen(true);
      }
    };

    dom.addEventListener("keydown", handle);
    return () => dom.removeEventListener("keydown", handle);
  }, [editor, isEnabled]);

  // Escape leaves fullscreen, matching the browser's own behaviour.
  useEffect(() => {
    if (!isFullscreen) return;

    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFullscreen(false);
    };

    document.addEventListener("keydown", handle);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handle);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const toolbarState = useToolbarState(editor);

  if (!editor || !toolbarState) {
    return (
      <div
        className={cn("border-input bg-muted/20 animate-pulse rounded-md border", className)}
        style={{ minHeight: minHeight + 96 }}
      />
    );
  }

  const closeDialog = (open: boolean) => {
    if (!open) setDialog(NO_DIALOG);
  };

  return (
    <div
      className={cn(
        "border-input bg-background flex flex-col overflow-hidden rounded-md border",
        isFullscreen && "fixed inset-0 z-50 rounded-none border-0",
        disabled && "opacity-70",
        className,
      )}
    >
      {!disabled && (
        <Toolbar
          editor={editor}
          state={toolbarState}
          isEnabled={isEnabled}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((value) => !value)}
          isPreview={isPreview}
          onTogglePreview={() => setIsPreview((value) => !value)}
          showInvisibles={showInvisibles}
          onToggleInvisibles={() => setShowInvisibles((value) => !value)}
          onToggleFind={() => setFindOpen((value) => !value)}
        />
      )}

      {findOpen && isEnabled("findReplace") && (
        <FindReplacePanel editor={editor} onClose={() => setFindOpen(false)} />
      )}

      <div className={cn("relative flex-1 overflow-y-auto", isFullscreen && "min-h-0")}>
        <EditorContent editor={editor} className="px-4 py-3" />

        {!disabled && !isPreview && (
          <>
            {isEnabled("bubbleMenu") && (
              <>
                <TextBubbleMenu editor={editor} state={toolbarState} isEnabled={isEnabled} />
                {isEnabled("link") && <LinkBubbleMenu editor={editor} />}
              </>
            )}
            {isEnabled("dragHandle") && <BlockDragHandle editor={editor} isEnabled={isEnabled} />}
          </>
        )}
      </div>

      {isEnabled("counter") && (
        <StatusBar editor={editor} isEnabled={isEnabled} maxCharacters={maxCharacters} />
      )}

      {/* Dialogs are mounted only while open so their state resets each time. */}
      {dialog.name === "link" && (
        <LinkDialog editor={editor} open onOpenChange={closeDialog} />
      )}
      {dialog.name === "image" && (
        <ImageDialog
          editor={editor}
          open
          onOpenChange={closeDialog}
          maxSizeMB={maxImageSizeMB}
          maxDimension={maxImageDimension}
        />
      )}
      {dialog.name === "video" && (
        <VideoDialog editor={editor} open onOpenChange={closeDialog} />
      )}
      {dialog.name === "html" && (
        <HtmlDialog
          editor={editor}
          open
          onOpenChange={closeDialog}
          mode={dialog.payload.mode === "edit" ? "edit" : "create"}
          initialHtml={typeof dialog.payload.html === "string" ? dialog.payload.html : ""}
        />
      )}
      {dialog.name === "markdown" && (
        <MarkdownDialog editor={editor} open onOpenChange={closeDialog} />
      )}
      {dialog.name === "shortcuts" && <ShortcutsDialog open onOpenChange={closeDialog} />}
    </div>
  );
};

export default EditorCore;
