"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

import { formatShortcut } from "../toolbar/primitives";

const GROUPS: { title: string; items: [string, string][] }[] = [
  {
    title: "Text",
    items: [
      ["Bold", "Mod+B"],
      ["Italic", "Mod+I"],
      ["Underline", "Mod+U"],
      ["Strikethrough", "Mod+Shift+S"],
      ["Inline code", "Mod+E"],
      ["Clear formatting", "Mod+\\"],
      ["Add link", "Mod+K"],
    ],
  },
  {
    title: "Blocks",
    items: [
      ["Paragraph", "Mod+Alt+0"],
      ["Heading 1-6", "Mod+Alt+1…6"],
      ["Bullet list", "Mod+Shift+8"],
      ["Numbered list", "Mod+Shift+7"],
      ["Task list", "Mod+Shift+9"],
      ["Quote", "Mod+Shift+B"],
      ["Code block", "Mod+Alt+C"],
    ],
  },
  {
    title: "Editing",
    items: [
      ["Undo", "Mod+Z"],
      ["Redo", "Mod+Shift+Z"],
      ["Find & replace", "Mod+F"],
      ["Select all", "Mod+A"],
      ["Insert block menu", "/"],
      ["Emoji", ":"],
    ],
  },
  {
    title: "Alignment",
    items: [
      ["Align left", "Mod+Shift+L"],
      ["Align center", "Mod+Shift+E"],
      ["Align right", "Mod+Shift+R"],
      ["Justify", "Mod+Shift+J"],
    ],
  },
];

export const ShortcutsDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Keyboard shortcuts</DialogTitle>
        <DialogDescription>Everything the editor responds to.</DialogDescription>
      </DialogHeader>

      <div className="grid max-h-[60vh] gap-6 overflow-y-auto sm:grid-cols-2">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              {group.title}
            </p>
            <dl className="space-y-1.5">
              {group.items.map(([label, keys]) => (
                <div key={label} className="flex items-center justify-between gap-4 text-sm">
                  <dt>{label}</dt>
                  <dd>
                    <kbd className="bg-muted text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-xs">
                      {formatShortcut(keys)}
                    </kbd>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);
