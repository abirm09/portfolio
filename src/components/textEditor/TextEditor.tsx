"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

import type { TextEditorProps } from "./types";

/**
 * The editor pulls in ProseMirror, KaTeX, syntax highlighting and the emoji
 * dataset. Loading it dynamically keeps all of that out of the initial bundle
 * of every form page that merely renders a description field.
 */
const EditorCore = dynamic(() => import("./EditorCore").then((mod) => mod.EditorCore), {
  ssr: false,
  loading: () => (
    <div
      className="border-input bg-muted/20 h-[356px] animate-pulse rounded-md border"
      aria-label="Loading editor"
    />
  ),
});

const TextEditor = ({ className, ...props }: TextEditorProps) => (
  <EditorCore className={cn(className)} {...props} />
);

export default TextEditor;
