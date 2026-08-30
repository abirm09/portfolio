import type { EditorFeature, EditorPreset } from "../types";

const FULL: EditorFeature[] = [
  "history",
  "blockType",
  "fontFamily",
  "fontSize",
  "lineHeight",
  "inline",
  "script",
  "color",
  "highlight",
  "backgroundColor",
  "clearFormat",
  "align",
  "lists",
  "taskList",
  "blockquote",
  "codeBlock",
  "hr",
  "details",
  "callout",
  "link",
  "image",
  "video",
  "htmlBlock",
  "table",
  "math",
  "emoji",
  "markdown",
  "findReplace",
  "toc",
  "invisibles",
  "typography",
  "slashCommand",
  "dragHandle",
  "bubbleMenu",
  "fullscreen",
  "preview",
  "shortcuts",
  "counter",
];

const STANDARD: EditorFeature[] = [
  "history",
  "blockType",
  "fontFamily",
  "fontSize",
  "inline",
  "color",
  "highlight",
  "backgroundColor",
  "clearFormat",
  "align",
  "lists",
  "taskList",
  "blockquote",
  "codeBlock",
  "hr",
  "link",
  "image",
  "video",
  "table",
  "typography",
  "slashCommand",
  "bubbleMenu",
  "fullscreen",
  "counter",
];

const MINIMAL: EditorFeature[] = [
  "history",
  "blockType",
  "inline",
  "color",
  "lists",
  "link",
  "clearFormat",
  "bubbleMenu",
  "counter",
];

const PRESETS: Record<EditorPreset, EditorFeature[]> = {
  full: FULL,
  standard: STANDARD,
  minimal: MINIMAL,
};

export type FeatureSet = (feature: EditorFeature) => boolean;

/**
 * Resolves a preset plus per-call overrides into a lookup used by every
 * toolbar group, menu and dialog to decide whether to render itself.
 */
export function resolveFeatures(
  preset: EditorPreset = "full",
  overrides?: Partial<Record<EditorFeature, boolean>>,
): FeatureSet {
  const enabled = new Set<EditorFeature>(PRESETS[preset] ?? PRESETS.full);

  if (overrides) {
    for (const [feature, value] of Object.entries(overrides) as [EditorFeature, boolean][]) {
      if (value) enabled.add(feature);
      else enabled.delete(feature);
    }
  }

  return (feature: EditorFeature) => enabled.has(feature);
}
