import DOMPurify from "dompurify";

/**
 * Tags a custom HTML block is allowed to keep on top of DOMPurify's defaults.
 * Embeds are permitted because pasting a third-party widget is the main reason
 * an author reaches for a raw HTML block at all.
 */
const EXTRA_TAGS = ["iframe", "video", "audio", "source", "track", "style"];

const EXTRA_ATTRS = [
  "allow",
  "allowfullscreen",
  "frameborder",
  "scrolling",
  "loading",
  "target",
  "controls",
  "autoplay",
  "muted",
  "loop",
  "playsinline",
  "poster",
  "srcset",
  "sizes",
];

/**
 * Strips scripts and event handlers while preserving the markup, inline styles
 * and embeds authors expect to survive. Used for the in-editor preview and as
 * the default filter for saved output.
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return html;

  return DOMPurify.sanitize(html, {
    ADD_TAGS: EXTRA_TAGS,
    ADD_ATTR: EXTRA_ATTRS,
    FORBID_TAGS: ["script", "noscript", "object", "embed", "base", "meta", "link"],
    ALLOW_DATA_ATTR: true,
  });
}

/** Sanitizes an SVG file's source before it is embedded as a data URL. */
export function sanitizeSvg(svg: string): string {
  if (typeof window === "undefined") return svg;

  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ["script", "foreignObject"],
    FORBID_ATTR: ["onload", "onerror"],
  });
}

/** True when the markup contains something that would execute on render. */
export function containsExecutableMarkup(html: string): boolean {
  return /<\s*script|\son[a-z]+\s*=|javascript:/i.test(html);
}
