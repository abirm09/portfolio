/**
 * Font/colour option lists shared by the toolbar dropdowns.
 *
 * Font stacks are written out in full because the editor's HTML output is
 * self-contained: the storefront rendering it will not have the dashboard's
 * font variables available.
 */

export type FontOption = { label: string; value: string };

export const FONT_FAMILIES: FontOption[] = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "Outfit", value: "Outfit, system-ui, sans-serif" },
  { label: "System UI", value: "system-ui, sans-serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Garamond", value: "Garamond, Georgia, serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
  { label: "Monospace", value: "ui-monospace, 'Cascadia Code', Menlo, monospace" },
];

export const FONT_SIZES: FontOption[] = [
  { label: "Default", value: "" },
  { label: "10", value: "10px" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
  { label: "30", value: "30px" },
  { label: "36", value: "36px" },
  { label: "48", value: "48px" },
  { label: "60", value: "60px" },
  { label: "72", value: "72px" },
];

export const LINE_HEIGHTS: FontOption[] = [
  { label: "Default", value: "" },
  { label: "Tight (1)", value: "1" },
  { label: "Snug (1.15)", value: "1.15" },
  { label: "Normal (1.5)", value: "1.5" },
  { label: "Relaxed (1.75)", value: "1.75" },
  { label: "Loose (2)", value: "2" },
];

/** Swatch palette shared by the text colour and background colour pickers. */
export const COLOR_SWATCHES: string[] = [
  "#000000",
  "#374151",
  "#6b7280",
  "#9ca3af",
  "#d1d5db",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#78350f",
  "#1e293b",
];

export const HIGHLIGHT_SWATCHES: string[] = [
  "#fef08a",
  "#fde68a",
  "#fed7aa",
  "#fecaca",
  "#bbf7d0",
  "#a7f3d0",
  "#bae6fd",
  "#c7d2fe",
  "#ddd6fe",
  "#fbcfe8",
  "#e5e7eb",
  "#d9f99d",
];
