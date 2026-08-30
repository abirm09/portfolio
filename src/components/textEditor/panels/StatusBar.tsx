"use client";

import { type Editor, useEditorState } from "@tiptap/react";
import { ListTree } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";

import type { FeatureSet } from "../config/presets";

/** Average adult silent-reading speed, used for the reading-time estimate. */
const WORDS_PER_MINUTE = 200;

export const StatusBar = ({
  editor,
  isEnabled,
  maxCharacters,
}: {
  editor: Editor;
  isEnabled: FeatureSet;
  maxCharacters?: number;
}) => {
  const stats = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const counter = e?.storage.characterCount;
      const words = counter?.words() ?? 0;

      return {
        words,
        characters: counter?.characters() ?? 0,
        minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
        headings: (e?.storage.tableOfContents?.content ?? []) as {
          id: string;
          level: number;
          textContent: string;
        }[],
      };
    },
  });

  const overLimit = !!maxCharacters && stats.characters > maxCharacters;
  const nearLimit = !!maxCharacters && !overLimit && stats.characters > maxCharacters * 0.9;

  const scrollToHeading = (id: string) => {
    const target = editor.view.dom.querySelector(`[data-toc-id="${id}"], #${CSS.escape(id)}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="border-border text-muted-foreground bg-muted/30 flex items-center gap-3 border-t px-3 py-1.5 text-xs">
      <span>
        {stats.words} {stats.words === 1 ? "word" : "words"}
      </span>

      <span
        className={cn(
          overLimit && "text-destructive font-medium",
          nearLimit && "text-amber-600 dark:text-amber-500",
        )}
      >
        {stats.characters.toLocaleString()}
        {maxCharacters ? ` / ${maxCharacters.toLocaleString()}` : ""} characters
      </span>

      {stats.words > 0 && <span>{stats.minutes} min read</span>}

      {maxCharacters && (
        <span className="bg-border hidden h-1 w-20 overflow-hidden rounded-full sm:block">
          <span
            className={cn(
              "block h-full rounded-full transition-all",
              overLimit ? "bg-destructive" : nearLimit ? "bg-amber-500" : "bg-primary",
            )}
            style={{ width: `${Math.min(100, (stats.characters / maxCharacters) * 100)}%` }}
          />
        </span>
      )}

      {isEnabled("toc") && stats.headings.length > 0 && (
        <Popover>
          <PopoverTrigger className="hover:text-foreground ml-auto inline-flex items-center gap-1 transition-colors">
            <ListTree className="size-3.5" />
            Outline
          </PopoverTrigger>
          <PopoverContent align="end" className="max-h-72 w-64 overflow-y-auto p-1">
            {stats.headings.map((heading) => (
              <button
                key={heading.id}
                type="button"
                onClick={() => scrollToHeading(heading.id)}
                style={{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }}
                className="hover:bg-accent block w-full truncate rounded-sm py-1 pr-2 text-left text-sm"
              >
                {heading.textContent || "Untitled"}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
