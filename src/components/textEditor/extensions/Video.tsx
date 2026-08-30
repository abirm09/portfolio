"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import {
  IFRAME_ALLOW,
  isEmbedProvider,
  parseVideoSource,
  type VideoProvider,
} from "../utils/videoSources";
import { type Align, alignMargin, MediaControls } from "./MediaControls";
import { ResizeHandles } from "./resizable";

const MIN_WIDTH = 160;
const DEFAULT_WIDTH = 560;

export type VideoAttributes = {
  src: string;
  provider: VideoProvider;
  width: number;
  align: Align;
  fullWidth: boolean;
  poster: string | null;
  controls: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
};

declare module "@tiptap/core" {
  // Interface required: this merges into Tiptap's own command map.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: Partial<VideoAttributes> & { src: string }) => ReturnType;
      updateVideo: (options: Partial<VideoAttributes>) => ReturnType;
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Node view                                 */
/* -------------------------------------------------------------------------- */

const VideoNodeView = ({ node, updateAttributes, selected, editor, getPos }: NodeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const attrs = node.attrs as VideoAttributes;
  const width = attrs.width ?? DEFAULT_WIDTH;
  const align: Align = attrs.align ?? "left";
  const fullWidth = !!attrs.fullWidth;
  const editable = editor.isEditable;
  const isEmbed = isEmbedProvider(attrs.provider);

  const selectNode = () => {
    const pos = typeof getPos === "function" ? getPos() : null;
    if (typeof pos === "number") editor.commands.setNodeSelection(pos);
  };

  return (
    <NodeViewWrapper className="tiptap-video" data-drag-handle style={{ textAlign: align }}>
      <div
        ref={containerRef}
        className={cn(
          "relative inline-block max-w-full text-left leading-none",
          selected && editable && "outline-primary rounded-md outline-2 outline-offset-2",
        )}
        style={{ width: fullWidth ? "100%" : `${width}px` }}
      >
        {editable && selected && (
          <MediaControls
            align={align}
            fullWidth={fullWidth}
            onAlign={(value) => updateAttributes({ align: value })}
            onToggleFullWidth={() => updateAttributes({ fullWidth: !fullWidth })}
          />
        )}

        <div
          className="bg-muted relative w-full overflow-hidden rounded-md"
          style={{ aspectRatio: "16 / 9" }}
        >
          {isEmbed ? (
            <iframe
              src={attrs.src}
              title="Embedded video"
              className="absolute inset-0 h-full w-full"
              allow={IFRAME_ALLOW}
              allowFullScreen
            />
          ) : (
            <video
              src={attrs.src}
              poster={attrs.poster ?? undefined}
              controls={attrs.controls}
              loop={attrs.loop}
              muted={attrs.muted}
              playsInline
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}

          {/* While unselected an invisible layer intercepts clicks so the node
              can be selected and resized instead of focus falling into the
              iframe or the native video controls. */}
          {editable && !selected && (
            <button
              type="button"
              aria-label="Select video"
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={selectNode}
            />
          )}
        </div>

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

/* -------------------------------------------------------------------------- */
/*                                  Extension                                 */
/* -------------------------------------------------------------------------- */

/**
 * A single video node covering every source the editor accepts: YouTube and
 * Vimeo render as provider iframes, anything else is treated as a direct file
 * path and rendered in a real `<video>` element.
 *
 * The saved HTML is self-contained and responsive (inline styles only) so it
 * renders correctly on any storefront without extra CSS, and legacy
 * `div[data-youtube-video]` markup written by the previous YouTube-only
 * extension still parses.
 */
export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "" },
      provider: { default: "file" as VideoProvider },
      width: { default: DEFAULT_WIDTH },
      align: { default: "left" as Align },
      fullWidth: { default: false },
      poster: { default: null },
      controls: { default: true },
      autoplay: { default: false },
      loop: { default: false },
      muted: { default: false },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video]",
        getAttrs: (element) => {
          const wrapper = element as HTMLElement;
          const media = wrapper.querySelector("iframe, video");
          const src = media?.getAttribute("src") ?? "";
          const parsed = parseVideoSource(wrapper.getAttribute("data-src") || src);

          return {
            src: parsed?.src ?? src,
            provider: (wrapper.getAttribute("data-provider") as VideoProvider) ?? "file",
            width: Number(wrapper.getAttribute("data-width")) || DEFAULT_WIDTH,
            align: (wrapper.getAttribute("data-align") as Align) ?? "left",
            fullWidth: wrapper.getAttribute("data-full-width") === "true",
            poster: media?.getAttribute("poster") ?? null,
            controls: media?.hasAttribute("controls") ?? true,
            loop: media?.hasAttribute("loop") ?? false,
            muted: media?.hasAttribute("muted") ?? false,
          };
        },
      },
      {
        // Content saved by the previous YouTube-only extension.
        tag: "div[data-youtube-video]",
        getAttrs: (element) => {
          const wrapper = element as HTMLElement;
          const iframe = wrapper.querySelector("iframe");
          const src = iframe?.getAttribute("src") ?? "";
          const parsed = parseVideoSource(src);

          return {
            src: parsed?.src ?? src,
            provider: parsed?.provider ?? "youtube",
            width: Number(wrapper.getAttribute("data-width")) || DEFAULT_WIDTH,
            align: (wrapper.getAttribute("data-align") as Align) ?? "left",
            fullWidth: wrapper.getAttribute("data-full-width") === "true",
          };
        },
      },
      {
        // A bare iframe pointing at a known provider, e.g. pasted embed code.
        tag: "iframe[src]",
        getAttrs: (element) => {
          const src = (element as HTMLElement).getAttribute("src") ?? "";
          const parsed = parseVideoSource(src);
          if (!parsed || parsed.provider === "file") return false;
          return { src: parsed.src, provider: parsed.provider };
        },
      },
      {
        tag: "video[src]",
        getAttrs: (element) => {
          const video = element as HTMLElement;
          return {
            src: video.getAttribute("src") ?? "",
            provider: "file" as VideoProvider,
            poster: video.getAttribute("poster"),
            controls: video.hasAttribute("controls"),
            loop: video.hasAttribute("loop"),
            muted: video.hasAttribute("muted"),
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const attrs = node.attrs as VideoAttributes;
    const width = attrs.width ?? DEFAULT_WIDTH;
    const align: Align = attrs.align ?? "left";
    const fullWidth = !!attrs.fullWidth;

    const wrapperStyle = [
      "width: 100%",
      fullWidth ? "max-width: 100%" : `max-width: ${width}px`,
      `margin: ${alignMargin(align)}`,
    ].join("; ");

    const wrapperAttrs = {
      "data-video": "",
      "data-provider": attrs.provider,
      "data-src": attrs.src,
      "data-width": String(width),
      "data-align": align,
      "data-full-width": fullWidth ? "true" : "false",
      style: wrapperStyle,
    };

    const mediaStyle =
      "display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; border: 0; border-radius: 8px";

    if (isEmbedProvider(attrs.provider)) {
      return [
        "div",
        wrapperAttrs,
        [
          "iframe",
          {
            src: attrs.src,
            style: mediaStyle,
            allow: IFRAME_ALLOW,
            allowfullscreen: "true",
            loading: "lazy",
          },
        ],
      ];
    }

    return [
      "div",
      wrapperAttrs,
      [
        "video",
        mergeAttributes(
          {
            src: attrs.src,
            style: `${mediaStyle}; object-fit: contain; background: #000`,
            preload: "metadata",
            playsinline: "true",
          },
          attrs.poster ? { poster: attrs.poster } : {},
          attrs.controls ? { controls: "true" } : {},
          attrs.autoplay ? { autoplay: "true" } : {},
          attrs.loop ? { loop: "true" } : {},
          attrs.muted ? { muted: "true" } : {},
        ),
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          const parsed = parseVideoSource(options.src);
          if (!parsed) return false;

          return commands.insertContent({
            type: this.name,
            attrs: { ...options, src: parsed.src, provider: parsed.provider },
          });
        },

      updateVideo:
        (options) =>
        ({ commands }) => {
          const next = { ...options };
          if (options.src) {
            const parsed = parseVideoSource(options.src);
            if (parsed) {
              next.src = parsed.src;
              next.provider = parsed.provider;
            }
          }
          return commands.updateAttributes(this.name, next);
        },
    };
  },
});
