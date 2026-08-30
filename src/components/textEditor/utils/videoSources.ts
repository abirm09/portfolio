export type VideoProvider = "youtube" | "vimeo" | "file";

export type VideoSource = {
  provider: VideoProvider;
  /** URL to feed an <iframe src> or a <video src>, already normalized. */
  src: string;
  /** The value as the author typed it, kept so editing round-trips cleanly. */
  input: string;
};

const YOUTUBE_PATTERN =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/;

const VIMEO_PATTERN =
  /vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d+)(?:\/([\w]+))?/;

const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i;

/**
 * Classifies a user-supplied video reference.
 *
 * Anything that is not a recognised YouTube or Vimeo URL is treated as a direct
 * file path, which covers absolute URLs, root-relative paths like
 * `/videos/promo.mp4`, and CDN links without an extension.
 */
export function parseVideoSource(input: string): VideoSource | null {
  const value = input.trim();
  if (!value) return null;

  const youtube = value.match(YOUTUBE_PATTERN);
  if (youtube?.[1]) {
    return {
      provider: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${youtube[1]}`,
      input: value,
    };
  }

  const vimeo = value.match(VIMEO_PATTERN);
  if (vimeo?.[1]) {
    // Unlisted videos carry a privacy hash as a second path segment, which the
    // player expects as an `h` query parameter instead.
    const hash = vimeo[2] ? `?h=${vimeo[2]}` : "";
    return {
      provider: "vimeo",
      src: `https://player.vimeo.com/video/${vimeo[1]}${hash}`,
      input: value,
    };
  }

  return { provider: "file", src: value, input: value };
}

/** True when the reference points at a media file we can play in <video>. */
export function looksLikeVideoFile(input: string): boolean {
  return VIDEO_FILE_PATTERN.test(input.trim());
}

/** True for the provider types rendered through an iframe embed. */
export function isEmbedProvider(provider: VideoProvider): boolean {
  return provider === "youtube" || provider === "vimeo";
}

export const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";

/**
 * Guards against `javascript:` and other executable URLs reaching a src
 * attribute. Relative paths are always allowed.
 */
export function isSafeMediaUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^(\/|\.{1,2}\/)/.test(trimmed)) return true;
  if (trimmed.startsWith("data:video/")) return true;

  try {
    const { protocol } = new URL(trimmed);
    return protocol === "http:" || protocol === "https:";
  } catch {
    // Bare paths such as `videos/clip.mp4` fail URL parsing but are safe.
    return !/^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  }
}
