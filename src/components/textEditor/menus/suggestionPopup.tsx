"use client";

import type { SuggestionKeyDownProps, SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import type { ComponentType } from "react";

/** Imperative handle every suggestion list exposes for keyboard navigation. */
export type SuggestionListHandle = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

/**
 * Wires a React list component into Tiptap's suggestion plugin.
 *
 * Tiptap 3 positions the popup itself: handing the rendered element to
 * `props.mount` appends it to the container and keeps it anchored to the
 * caret through Floating UI, including on scroll and resize.
 */
export function createSuggestionRenderer<TItem>(
  Component: ComponentType<SuggestionProps<TItem>>,
): SuggestionOptions<TItem>["render"] {
  return () => {
    let renderer: ReactRenderer<SuggestionListHandle, SuggestionProps<TItem>> | null = null;
    let unmount: (() => void) | null = null;

    return {
      onStart: (props) => {
        renderer = new ReactRenderer(Component, { props, editor: props.editor });
        unmount = props.mount?.(renderer.element as HTMLElement) ?? null;
      },

      onUpdate: (props) => {
        renderer?.updateProps(props);
      },

      onKeyDown: (props) => {
        if (props.event.key === "Escape") {
          unmount?.();
          unmount = null;
          return true;
        }
        return renderer?.ref?.onKeyDown(props) ?? false;
      },

      onExit: () => {
        unmount?.();
        unmount = null;
        renderer?.destroy();
        renderer = null;
      },
    };
  };
}

/** Shared shell so the slash and emoji popups look identical. */
export const suggestionPanelClass =
  "bg-popover text-popover-foreground z-50 max-h-80 w-72 overflow-y-auto rounded-md border p-1 shadow-md";
