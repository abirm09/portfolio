import { Node, mergeAttributes } from "@tiptap/core";

export const CALLOUT_VARIANTS = ["info", "success", "warning", "danger", "note"] as const;

export type CalloutVariant = (typeof CALLOUT_VARIANTS)[number];

/**
 * Colour and glyph for each variant, inlined into the saved HTML so the block
 * looks right on the storefront without shipping any editor CSS.
 */
const VARIANT_STYLE: Record<CalloutVariant, { border: string; background: string; icon: string }> =
  {
    info: { border: "#3b82f6", background: "#eff6ff", icon: "ℹ" },
    success: { border: "#22c55e", background: "#f0fdf4", icon: "✓" },
    warning: { border: "#f59e0b", background: "#fffbeb", icon: "⚠" },
    danger: { border: "#ef4444", background: "#fef2f2", icon: "✕" },
    note: { border: "#6b7280", background: "#f9fafb", icon: "✎" },
  };

export const CALLOUT_LABEL: Record<CalloutVariant, string> = {
  info: "Info",
  success: "Success",
  warning: "Warning",
  danger: "Danger",
  note: "Note",
};

declare module "@tiptap/core" {
  // Interface required: this merges into Tiptap's own command map.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Commands<ReturnType> {
    callout: {
      setCallout: (variant?: CalloutVariant) => ReturnType;
      toggleCallout: (variant?: CalloutVariant) => ReturnType;
      unsetCallout: () => ReturnType;
    };
  }
}

/** A highlighted advisory block, like the admonitions in documentation sites. */
export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: "info" as CalloutVariant,
        parseHTML: (element) => element.getAttribute("data-variant") ?? "info",
        renderHTML: (attributes) => ({ "data-variant": attributes.variant }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-callout]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const variant = (node.attrs.variant as CalloutVariant) ?? "info";
    const theme = VARIANT_STYLE[variant] ?? VARIANT_STYLE.info;

    const style = [
      "display: flex",
      "gap: 12px",
      "padding: 12px 16px",
      "margin: 16px 0",
      "border-radius: 8px",
      `border-left: 4px solid ${theme.border}`,
      `background: ${theme.background}`,
    ].join("; ");

    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-callout": "", style }),
      ["span", { "aria-hidden": "true", style: `color: ${theme.border}; font-weight: 700` }, theme.icon],
      ["div", { style: "flex: 1; min-width: 0" }, 0],
    ];
  },

  addCommands() {
    return {
      setCallout:
        (variant = "info") =>
        ({ commands }) =>
          commands.wrapIn(this.name, { variant }),

      toggleCallout:
        (variant = "info") =>
        ({ commands, editor }) => {
          if (editor.isActive(this.name)) {
            const current = editor.getAttributes(this.name).variant;
            // Selecting a different variant re-colours rather than unwraps.
            if (current !== variant) return commands.updateAttributes(this.name, { variant });
            return commands.lift(this.name);
          }
          return commands.wrapIn(this.name, { variant });
        },

      unsetCallout:
        () =>
        ({ commands }) =>
          commands.lift(this.name),
    };
  },
});
