"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";

/** Shared class so buttons, dropdown triggers and popovers look identical. */
export const toolbarBtnClass = (active?: boolean) =>
  cn(
    "text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-1.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&>svg]:h-4 [&>svg]:w-4",
    active && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
  );

/** Renders `Mod` as the platform's modifier so hints read correctly on macOS. */
export function formatShortcut(shortcut: string): string {
  if (typeof navigator === "undefined") return shortcut.replace("Mod", "Ctrl");
  const isApple = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  return shortcut.replace("Mod", isApple ? "⌘" : "Ctrl").replace("Shift", isApple ? "⇧" : "Shift");
}

type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
  shortcut?: string;
  children: ReactNode;
};

export const ToolbarButton = ({
  label,
  active,
  shortcut,
  className,
  children,
  ...props
}: ToolbarButtonProps) => {
  const button = (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      className={cn(toolbarBtnClass(active), className)}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        {label}
        {shortcut && <span className="ml-2 opacity-70">{formatShortcut(shortcut)}</span>}
      </TooltipContent>
    </Tooltip>
  );
};

export const ToolbarDivider = () => (
  <span aria-hidden className="bg-border mx-1 h-5 w-px shrink-0" />
);

/** Wraps a dropdown/popover trigger so it carries a tooltip like a button. */
export const ToolbarTip = ({
  label,
  shortcut,
  children,
}: {
  label: string;
  shortcut?: string;
  children: ReactNode;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side="bottom" sideOffset={6}>
      {label}
      {shortcut && <span className="ml-2 opacity-70">{formatShortcut(shortcut)}</span>}
    </TooltipContent>
  </Tooltip>
);
