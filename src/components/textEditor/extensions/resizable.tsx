"use client";

import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

import { cn } from "@/lib/utils";

/** Corner handles — each resizes width while the element keeps its ratio. */
const HANDLES = [
  { key: "tl", dir: -1, className: "top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize" },
  { key: "tr", dir: 1, className: "top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize" },
  { key: "bl", dir: -1, className: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize" },
  { key: "br", dir: 1, className: "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize" },
] as const;

type ResizeHandlesProps = {
  containerRef: RefObject<HTMLElement | null>;
  minWidth: number;
  onResize: (width: number) => void;
};

/**
 * Renders the four corner grips for a media node view.
 *
 * Pointer capture keeps events flowing to the grip even when the cursor
 * travels over other elements — notably an iframe, which would otherwise
 * swallow the drag.
 */
export const ResizeHandles = ({ containerRef, minWidth, onResize }: ResizeHandlesProps) => {
  const startResize = (event: ReactPointerEvent, dir: number) => {
    event.preventDefault();
    event.stopPropagation();

    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startWidth = containerRef.current?.offsetWidth ?? minWidth;
    const maxWidth = containerRef.current?.parentElement?.offsetWidth ?? 9999;

    const onMove = (e: PointerEvent) => {
      const next = Math.min(
        maxWidth,
        Math.max(minWidth, Math.round(startWidth + dir * (e.clientX - startX))),
      );
      onResize(next);
    };

    const onUp = () => {
      handle.releasePointerCapture(event.pointerId);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  };

  return (
    <>
      {HANDLES.map((handle) => (
        <span
          key={handle.key}
          onPointerDown={(event) => startResize(event, handle.dir)}
          className={cn(
            "border-primary bg-background absolute z-20 h-3 w-3 rounded-full border-2 shadow-sm",
            handle.className,
          )}
        />
      ))}
    </>
  );
};
