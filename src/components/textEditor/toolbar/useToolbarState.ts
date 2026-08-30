"use client";

import { type Editor, useEditorState } from "@tiptap/react";

import type { CalloutVariant } from "../extensions/Callout";

export type ToolbarState = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  isCode: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isBulletList: boolean;
  isOrderedList: boolean;
  isTaskList: boolean;
  isBlockquote: boolean;
  isCodeBlock: boolean;
  isHighlight: boolean;
  isLink: boolean;
  isInTable: boolean;
  isCallout: boolean;
  calloutVariant: CalloutVariant | null;
  isDetails: boolean;
  textColor: string;
  backgroundColor: string;
  highlightColor: string;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  headingLevel: number;
  align: string;
  canUndo: boolean;
  canRedo: boolean;
};

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
const ALIGNMENTS = ["left", "center", "right", "justify"] as const;

/**
 * Single subscription that derives every flag the toolbar renders from.
 *
 * `useEditorState` only re-renders when the returned object actually changes,
 * so reading everything in one selector is cheaper than a hook per control.
 */
export function useToolbarState(editor: Editor | null): ToolbarState | null {
  return useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) return null;

      const textStyle = e.getAttributes("textStyle") as {
        color?: string;
        backgroundColor?: string;
        fontFamily?: string;
        fontSize?: string;
        lineHeight?: string;
      };

      const isCallout = e.isActive("callout");

      return {
        isBold: e.isActive("bold"),
        isItalic: e.isActive("italic"),
        isUnderline: e.isActive("underline"),
        isStrike: e.isActive("strike"),
        isCode: e.isActive("code"),
        isSubscript: e.isActive("subscript"),
        isSuperscript: e.isActive("superscript"),
        isBulletList: e.isActive("bulletList"),
        isOrderedList: e.isActive("orderedList"),
        isTaskList: e.isActive("taskList"),
        isBlockquote: e.isActive("blockquote"),
        isCodeBlock: e.isActive("codeBlock"),
        isHighlight: e.isActive("highlight"),
        isLink: e.isActive("link"),
        isInTable: e.isActive("table"),
        isCallout,
        calloutVariant: isCallout
          ? ((e.getAttributes("callout").variant as CalloutVariant) ?? "info")
          : null,
        isDetails: e.isActive("details"),
        textColor: textStyle.color ?? "",
        backgroundColor: textStyle.backgroundColor ?? "",
        highlightColor: (e.getAttributes("highlight").color as string) ?? "",
        fontFamily: textStyle.fontFamily ?? "",
        fontSize: textStyle.fontSize ?? "",
        lineHeight: textStyle.lineHeight ?? "",
        headingLevel: HEADING_LEVELS.find((level) => e.isActive("heading", { level })) ?? 0,
        align: ALIGNMENTS.find((value) => e.isActive({ textAlign: value })) ?? "left",
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
      } satisfies ToolbarState;
    },
  });
}
