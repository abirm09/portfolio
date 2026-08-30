/**
 * Every optional capability the editor can expose. Presets are expressed as
 * sets of these so a call site can ask for a lighter editor without any of the
 * toolbar/menu components needing to know about presets themselves.
 */
export type EditorFeature =
  // text
  | "history"
  | "blockType"
  | "fontFamily"
  | "fontSize"
  | "lineHeight"
  | "inline"
  | "script"
  | "color"
  | "highlight"
  | "backgroundColor"
  | "clearFormat"
  | "align"
  // blocks
  | "lists"
  | "taskList"
  | "blockquote"
  | "codeBlock"
  | "hr"
  | "details"
  | "callout"
  // inserts
  | "link"
  | "image"
  | "video"
  | "htmlBlock"
  | "table"
  | "math"
  | "emoji"
  // tooling
  | "markdown"
  | "findReplace"
  | "toc"
  | "invisibles"
  | "typography"
  | "slashCommand"
  | "dragHandle"
  | "bubbleMenu"
  | "fullscreen"
  | "preview"
  | "shortcuts"
  | "counter";

export type EditorPreset = "full" | "standard" | "minimal";

export type TextEditorProps = {
  /** Stored HTML. Pass `undefined` or `""` for an empty document. */
  content?: string;
  /** Receives HTML, or `""` when the document is empty. */
  onChange: (value: string) => void;

  /** Which capabilities to enable. Defaults to `"full"`. */
  preset?: EditorPreset;
  /** Explicit feature overrides applied on top of the preset. */
  features?: Partial<Record<EditorFeature, boolean>>;

  placeholder?: string;
  disabled?: boolean;
  /** Minimum height of the writing surface in pixels. Defaults to 260. */
  minHeight?: number;
  /** Soft character limit surfaced in the status bar. */
  maxCharacters?: number;
  className?: string;

  /** Max accepted image file size in MB for device uploads. Defaults to 2. */
  maxImageSizeMB?: number;
  /**
   * Longest edge, in pixels, that an uploaded image is downscaled to before it
   * is base64-encoded. Defaults to 1600. Pass 0 to disable downscaling.
   */
  maxImageDimension?: number;
};
