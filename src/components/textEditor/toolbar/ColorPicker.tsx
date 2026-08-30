"use client";

import { Check, Pipette } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";

import { toolbarBtnClass, ToolbarTip } from "./primitives";

const RECENTS_KEY = "tiptap:recent-colors";
const MAX_RECENTS = 8;

function readRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function pushRecent(color: string): string[] {
  const next = [color, ...readRecents().filter((c) => c !== color)].slice(0, MAX_RECENTS);
  try {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // Private-mode storage failures are not worth surfacing.
  }
  return next;
}

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

type ColorPickerProps = {
  label: string;
  icon: ReactNode;
  swatches: string[];
  /** Currently applied colour, used for the indicator bar and the tick. */
  value?: string;
  active?: boolean;
  onSelect: (color: string) => void;
  onReset: () => void;
};

/**
 * One popover shared by text colour, background colour and highlight.
 *
 * Beyond the preset swatches it keeps a short list of recently used colours in
 * localStorage, accepts a typed hex value, and falls back to the native colour
 * input for anything else.
 */
export const ColorPicker = ({
  label,
  icon,
  swatches,
  value,
  active,
  onSelect,
  onReset,
}: ColorPickerProps) => {
  const [open, setOpen] = useState(false);
  const [recents, setRecents] = useState<string[]>([]);
  const [hex, setHex] = useState("");

  useEffect(() => {
    if (open) {
      setRecents(readRecents());
      setHex(value ?? "");
    }
  }, [open, value]);

  const apply = useCallback(
    (color: string) => {
      onSelect(color);
      setRecents(pushRecent(color));
    },
    [onSelect],
  );

  const applyHex = () => {
    const candidate = hex.trim().startsWith("#") ? hex.trim() : `#${hex.trim()}`;
    if (HEX_PATTERN.test(candidate)) apply(candidate);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <ToolbarTip label={label}>
        <PopoverTrigger
          className={cn(toolbarBtnClass(active), "relative")}
          aria-label={label}
          type="button"
        >
          {icon}
          {value && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-1.5 bottom-1 h-[3px] rounded-full"
              style={{ backgroundColor: value }}
            />
          )}
        </PopoverTrigger>
      </ToolbarTip>

      <PopoverContent align="start" className="w-56 p-2">
        <p className="text-muted-foreground mb-1.5 text-xs font-medium">{label}</p>

        <div className="grid grid-cols-6 gap-1">
          {swatches.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              aria-label={color}
              onClick={() => apply(color)}
              style={{ backgroundColor: color }}
              className="relative size-6 rounded border border-black/10 transition-transform hover:scale-110"
            >
              {value?.toLowerCase() === color.toLowerCase() && (
                <Check className="absolute inset-0 m-auto size-3.5 text-white mix-blend-difference" />
              )}
            </button>
          ))}
        </div>

        {recents.length > 0 && (
          <>
            <p className="text-muted-foreground mt-3 mb-1.5 text-xs font-medium">Recent</p>
            <div className="grid grid-cols-8 gap-1">
              {recents.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={color}
                  aria-label={color}
                  onClick={() => apply(color)}
                  style={{ backgroundColor: color }}
                  className="size-5 rounded border border-black/10 transition-transform hover:scale-110"
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-3 flex items-center gap-1.5">
          <label className="border-input hover:bg-accent flex size-8 cursor-pointer items-center justify-center rounded-md border">
            <Pipette className="size-4" />
            <input
              type="color"
              className="sr-only"
              value={HEX_PATTERN.test(value ?? "") ? value : "#000000"}
              onChange={(event) => apply(event.target.value)}
            />
          </label>

          <input
            value={hex}
            onChange={(event) => setHex(event.target.value)}
            onBlur={applyHex}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyHex();
              }
            }}
            placeholder="#000000"
            aria-label="Hex colour"
            className="border-input focus-visible:ring-ring h-8 w-full min-w-0 rounded-md border px-2 font-mono text-xs outline-none focus-visible:ring-1"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            onReset();
            setOpen(false);
          }}
          className="text-muted-foreground hover:bg-accent mt-2 w-full rounded-md border py-1 text-xs"
        >
          Remove colour
        </button>
      </PopoverContent>
    </Popover>
  );
};
