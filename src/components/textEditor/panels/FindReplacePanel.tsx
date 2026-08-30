"use client";

import { type Editor, useEditorState } from "@tiptap/react";
import { CaseSensitive, ChevronDown, ChevronUp, Regex, WholeWord, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

import { toolbarBtnClass } from "../toolbar/primitives";

/** Search bar docked below the toolbar, opened with Ctrl/Cmd+F. */
export const FindReplacePanel = ({ editor, onClose }: { editor: Editor; onClose: () => void }) => {
  const [find, setFind] = useState("");
  const [replaceWith, setReplaceWith] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const storage = e?.storage.findAndReplace;
      return {
        total: storage?.results.length ?? 0,
        current: storage?.currentIndex ?? null,
        caseSensitive: storage?.caseSensitive ?? false,
        wholeWord: storage?.wholeWord ?? false,
        useRegex: storage?.useRegex ?? false,
      };
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  // Clearing the highlights on unmount keeps stale matches out of the saved
  // document view when the panel is dismissed.
  useEffect(() => () => void editor.commands.clearSearch(), [editor]);

  useEffect(() => {
    editor.commands.setSearchTerm(find);
  }, [find, editor]);

  useEffect(() => {
    editor.commands.setReplaceTerm(replaceWith);
  }, [replaceWith, editor]);

  const close = () => {
    editor.commands.clearSearch();
    onClose();
  };

  const counter =
    search.total === 0
      ? find
        ? "No results"
        : ""
      : `${(search.current ?? 0) + 1} of ${search.total}`;

  return (
    <div className="border-border bg-muted/30 flex flex-wrap items-center gap-2 border-b px-2 py-1.5">
      <div className="flex min-w-56 flex-1 items-center gap-1">
        <Input
          ref={inputRef}
          value={find}
          onChange={(event) => setFind(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (event.shiftKey) editor.commands.goToPreviousResult();
              else editor.commands.goToNextResult();
            }
            if (event.key === "Escape") close();
          }}
          placeholder="Find"
          className="h-8"
        />

        <span className="text-muted-foreground w-20 shrink-0 text-center text-xs">{counter}</span>

        <button
          type="button"
          aria-label="Previous match"
          disabled={!search.total}
          className={toolbarBtnClass()}
          onClick={() => editor.commands.goToPreviousResult()}
        >
          <ChevronUp />
        </button>
        <button
          type="button"
          aria-label="Next match"
          disabled={!search.total}
          className={toolbarBtnClass()}
          onClick={() => editor.commands.goToNextResult()}
        >
          <ChevronDown />
        </button>

        <button
          type="button"
          aria-label="Match case"
          className={toolbarBtnClass(search.caseSensitive)}
          onClick={() => editor.commands.setCaseSensitive(!search.caseSensitive)}
        >
          <CaseSensitive />
        </button>
        <button
          type="button"
          aria-label="Whole word"
          className={toolbarBtnClass(search.wholeWord)}
          onClick={() => editor.commands.setWholeWord(!search.wholeWord)}
        >
          <WholeWord />
        </button>
        <button
          type="button"
          aria-label="Regular expression"
          className={toolbarBtnClass(search.useRegex)}
          onClick={() => editor.commands.setUseRegex(!search.useRegex)}
        >
          <Regex />
        </button>
      </div>

      <div className={cn("flex items-center gap-1", !showReplace && "hidden sm:flex")}>
        {showReplace ? (
          <>
            <Input
              value={replaceWith}
              onChange={(event) => setReplaceWith(event.target.value)}
              placeholder="Replace with"
              className="h-8 w-40"
            />
            <Button
              variant="outline"
              size="sm"
              disabled={!search.total}
              onClick={() => editor.commands.replace()}
            >
              Replace
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!search.total}
              onClick={() => editor.commands.replaceAll()}
            >
              All
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setShowReplace(true)}>
            Replace…
          </Button>
        )}
      </div>

      <button type="button" aria-label="Close search" className={toolbarBtnClass()} onClick={close}>
        <X />
      </button>
    </div>
  );
};
