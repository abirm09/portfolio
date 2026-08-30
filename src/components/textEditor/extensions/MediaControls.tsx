"use client";

import { AlignCenter, AlignLeft, AlignRight, Maximize2, Minimize2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type Align = "left" | "center" | "right";
export const ALIGNS: Align[] = ["left", "center", "right"];

/** Horizontal margin that positions a block element for a given alignment. */
export function alignMargin(align: Align): string {
  if (align === "center") return "0 auto";
  if (align === "right") return "0 0 0 auto";
  return "0 auto 0 0";
}

/**
 * Floating toolbar shown above a selected media node (image / video) offering
 * alignment (left / center / right) and a full-width toggle.
 */
export const MediaControls = ({
  align,
  fullWidth,
  onAlign,
  onToggleFullWidth,
}: {
  align: Align;
  fullWidth: boolean;
  onAlign: (align: Align) => void;
  onToggleFullWidth: () => void;
}) => (
  <div
    className="bg-background absolute -top-2 left-1/2 z-30 flex -translate-x-1/2 -translate-y-full items-center gap-0.5 rounded-md border p-1 shadow-md"
    // Keep the node selected when interacting with the controls.
    onMouseDown={(e) => e.preventDefault()}
  >
    {ALIGNS.map((value) => {
      const Icon = value === "left" ? AlignLeft : value === "center" ? AlignCenter : AlignRight;
      return (
        <button
          key={value}
          type="button"
          aria-label={`Align ${value}`}
          onClick={() => onAlign(value)}
          className={cn("hover:bg-accent rounded p-1", align === value && "bg-accent text-primary")}
        >
          <Icon className="size-4" />
        </button>
      );
    })}
    <span className="bg-border mx-0.5 h-4 w-px" />
    <button
      type="button"
      aria-label={fullWidth ? "Fixed width" : "Full width"}
      onClick={onToggleFullWidth}
      className={cn("hover:bg-accent rounded p-1", fullWidth && "bg-accent text-primary")}
    >
      {fullWidth ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
    </button>
  </div>
);
