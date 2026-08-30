"use client";

import type { EmojiItem } from "@tiptap/extension-emoji";
import type { SuggestionProps } from "@tiptap/suggestion";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { cn } from "@/lib/utils";

import { suggestionPanelClass, type SuggestionListHandle } from "./suggestionPopup";

/** Grid of emoji matches shown while typing `:shortcode`. */
export const EmojiList = forwardRef<SuggestionListHandle, SuggestionProps<EmojiItem>>(
  ({ items, command }, ref) => {
    const [selected, setSelected] = useState(0);

    useEffect(() => setSelected(0), [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        const columns = 8;

        if (event.key === "ArrowLeft") {
          setSelected((index) => (index + items.length - 1) % items.length);
          return true;
        }
        if (event.key === "ArrowRight") {
          setSelected((index) => (index + 1) % items.length);
          return true;
        }
        if (event.key === "ArrowUp") {
          setSelected((index) => (index + items.length - columns) % items.length);
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelected((index) => (index + columns) % items.length);
          return true;
        }
        if (event.key === "Enter" || event.key === "Tab") {
          const item = items[selected];
          if (item) command({ name: item.name });
          return true;
        }
        return false;
      },
    }));

    if (!items.length) {
      return (
        <div className={cn(suggestionPanelClass, "w-64")}>
          <p className="text-muted-foreground px-2 py-3 text-center text-sm">No emoji found</p>
        </div>
      );
    }

    return (
      <div className={cn(suggestionPanelClass, "w-72")}>
        <div className="grid grid-cols-8 gap-0.5">
          {items.map((item, index) => (
            <button
              key={item.name}
              type="button"
              title={`:${item.name}:`}
              onMouseEnter={() => setSelected(index)}
              onClick={() => command({ name: item.name })}
              className={cn(
                "flex size-8 items-center justify-center rounded text-lg transition-colors",
                index === selected ? "bg-accent" : "hover:bg-accent/50",
              )}
            >
              {item.emoji ?? item.fallbackImage ?? `:${item.name}:`}
            </button>
          ))}
        </div>
        <p className="text-muted-foreground border-t px-2 pt-1.5 text-[11px]">
          :{items[selected]?.name ?? ""}:
        </p>
      </div>
    );
  },
);

EmojiList.displayName = "EmojiList";
