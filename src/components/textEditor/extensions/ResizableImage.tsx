"use client";

import type { DOMOutputSpec } from "@tiptap/pm/model";
import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import { type Align, alignMargin, MediaControls } from "./MediaControls";
import { ResizeHandles } from "./resizable";

declare module "@tiptap/extension-image" {
  // Interface required: this merges into the extension's own options type.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface SetImageOptions {
    width?: number;
    align?: Align;
    fullWidth?: boolean;
    caption?: string;
    href?: string;
  }
}

const MIN_WIDTH = 48;

const ImageNodeView = ({ node, updateAttributes, selected, editor }: NodeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const width: number | null = node.attrs.width ?? null;
  const align: Align = (node.attrs.align as Align) ?? "left";
  const fullWidth: boolean = !!node.attrs.fullWidth;
  const caption: string = node.attrs.caption ?? "";
  const href: string = node.attrs.href ?? "";
  const editable = editor.isEditable;

  return (
    <NodeViewWrapper className="tiptap-image" data-drag-handle style={{ textAlign: align }}>
      <div
        ref={containerRef}
        className={cn(
          "relative inline-block max-w-full text-left leading-none",
          selected && editable && "outline-primary rounded-md outline-2 outline-offset-2",
        )}
        style={{ width: fullWidth ? "100%" : width ? `${width}px` : "auto" }}
      >
        {editable && selected && (
          <MediaControls
            align={align}
            fullWidth={fullWidth}
            onAlign={(value) => updateAttributes({ align: value })}
            onToggleFullWidth={() => updateAttributes({ fullWidth: !fullWidth })}
          />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={node.attrs.src}
          alt={node.attrs.alt ?? ""}
          title={node.attrs.title ?? ""}
          className="block h-auto w-full max-w-full rounded-md"
          draggable={false}
        />

        {href && (
          <span className="text-muted-foreground mt-1 block truncate text-[11px] leading-none">
            links to {href}
          </span>
        )}

        {caption && (
          <span className="text-muted-foreground mt-1.5 block text-center text-xs italic">
            {caption}
          </span>
        )}

        {/* Resize grips are hidden in full-width mode, where width is fluid. */}
        {editable && selected && !fullWidth && (
          <ResizeHandles
            containerRef={containerRef}
            minWidth={MIN_WIDTH}
            onResize={(next) => updateAttributes({ width: next })}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};

/**
 * Image extension with an interactive resize / align / full-width node view,
 * plus optional caption and link wrapper.
 *
 * The saved HTML is self-contained and responsive (inline styles only): the
 * image's `max-width` is the chosen width but it fluidly shrinks to the
 * available space on smaller screens (`width: 100%`), never overflowing or
 * cropping. This renders correctly on any storefront without extra CSS.
 */
export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        // New markup stores the chosen width on `data-width`; fall back to the
        // legacy `width` attribute for content saved before this change.
        parseHTML: (element) => {
          const value = element.getAttribute("data-width") ?? element.getAttribute("width");
          return value ? parseInt(value, 10) : null;
        },
        renderHTML: () => ({}),
      },
      align: {
        default: "left",
        parseHTML: (element) => (element.getAttribute("data-align") as Align) ?? "left",
        renderHTML: () => ({}),
      },
      fullWidth: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-full-width") === "true",
        renderHTML: () => ({}),
      },
      caption: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-caption") ?? "",
        renderHTML: () => ({}),
      },
      href: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-href") ??
          element.parentElement?.closest("a")?.getAttribute("href") ??
          "",
        renderHTML: () => ({}),
      },
    };
  },

  renderHTML({ node, HTMLAttributes }): DOMOutputSpec {
    // width/align/fullWidth/caption/href are omitted from HTMLAttributes (their
    // attribute renderHTML returns {}), so read them from node.attrs.
    // HTMLAttributes still carries src/alt/title for passthrough.
    const width: number | null = node.attrs.width ?? null;
    const align: Align = (node.attrs.align as Align) ?? "left";
    const isFull: boolean = !!node.attrs.fullWidth;
    const caption: string = node.attrs.caption ?? "";
    const href: string = node.attrs.href ?? "";

    const imageStyle = [
      "display: block",
      "height: auto",
      // Full width or a chosen width fill the available space up to a cap and
      // shrink on smaller screens; no width keeps the natural size.
      isFull
        ? "width: 100%; max-width: 100%"
        : width
          ? `width: 100%; max-width: ${width}px`
          : "width: auto; max-width: 100%",
      caption ? "margin: 0 auto" : `margin: ${alignMargin(align)}`,
      "border-radius: 8px",
    ].join("; ");

    const img: DOMOutputSpec = [
      "img",
      {
        ...HTMLAttributes,
        ...(width ? { "data-width": String(width) } : {}),
        "data-align": align,
        "data-full-width": isFull ? "true" : "false",
        ...(caption ? { "data-caption": caption } : {}),
        ...(href ? { "data-href": href } : {}),
        style: imageStyle,
      },
    ];

    const media: DOMOutputSpec = href
      ? ["a", { href, rel: "noopener noreferrer", target: "_blank" }, img]
      : img;

    // A caption needs a wrapping figure, which also takes over the alignment
    // so the text stays centred beneath the image.
    if (caption) {
      const figureStyle = [
        "display: block",
        isFull ? "max-width: 100%" : width ? `max-width: ${width}px` : "max-width: 100%",
        `margin: ${alignMargin(align)}`,
      ].join("; ");

      return [
        "figure",
        { style: figureStyle },
        media,
        [
          "figcaption",
          { style: "margin-top: 6px; font-size: 12px; font-style: italic; text-align: center" },
          caption,
        ],
      ];
    }

    return media;
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
