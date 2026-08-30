import { sanitizeSvg } from "./sanitizeHtml";

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];

export const IMAGE_ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(",");

export type ImageReadOptions = {
  /** Reject files larger than this, in megabytes. */
  maxSizeMB?: number;
  /** Longest edge to downscale to before encoding. 0 disables downscaling. */
  maxDimension?: number;
};

export type ImageReadResult =
  | { ok: true; dataUrl: string; width: number; height: number }
  | { ok: false; error: string };

const DEFAULTS: Required<ImageReadOptions> = { maxSizeMB: 2, maxDimension: 1600 };

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsText(file);
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("That file is not a readable image."));
    image.src = src;
  });
}

/**
 * Re-encodes an oversized bitmap through a canvas so the base64 string stored
 * in the document stays reasonable. Base64 inflates bytes by roughly a third
 * and the result is saved inline, so an unresized photo can add megabytes to a
 * single field. Animated GIFs are passed through untouched because a canvas
 * would flatten them to their first frame.
 */
async function downscale(
  dataUrl: string,
  type: string,
  maxDimension: number,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const image = await loadImage(dataUrl);
  const { naturalWidth: width, naturalHeight: height } = image;

  const longestEdge = Math.max(width, height);
  if (!maxDimension || longestEdge <= maxDimension || type === "image/gif") {
    return { dataUrl, width, height };
  }

  const scale = maxDimension / longestEdge;
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) return { dataUrl, width, height };

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  // PNGs keep their format so transparency survives; everything else is
  // re-encoded as JPEG, which is dramatically smaller for photographs.
  const outputType = type === "image/png" ? "image/png" : "image/jpeg";
  const encoded = canvas.toDataURL(outputType, 0.85);

  // A re-encode can occasionally come out larger than the original.
  if (encoded.length >= dataUrl.length) return { dataUrl, width, height };

  return { dataUrl: encoded, width: targetWidth, height: targetHeight };
}

/**
 * Validates and converts an image file into a base64 data URL.
 *
 * Shared by the insert dialog, drag-and-drop and clipboard paste so all three
 * enforce the same limits and produce identical output.
 */
export async function readImageFile(
  file: File,
  options: ImageReadOptions = {},
): Promise<ImageReadResult> {
  const { maxSizeMB, maxDimension } = { ...DEFAULTS, ...options };

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: `"${file.name}" is not a supported image format.` };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    const actual = (file.size / (1024 * 1024)).toFixed(1);
    return {
      ok: false,
      error: `"${file.name}" is ${actual} MB. The limit is ${maxSizeMB} MB — use the URL tab for larger files.`,
    };
  }

  try {
    // SVG is markup, so it is sanitized as text before being encoded rather
    // than trusted as an opaque binary.
    if (file.type === "image/svg+xml") {
      const safe = sanitizeSvg(await readAsText(file));
      const encoded = `data:image/svg+xml;base64,${window.btoa(
        new TextEncoder()
          .encode(safe)
          .reduce((acc, byte) => acc + String.fromCharCode(byte), ""),
      )}`;
      return { ok: true, dataUrl: encoded, width: 0, height: 0 };
    }

    const raw = await readAsDataUrl(file);
    const resized = await downscale(raw, file.type, maxDimension);
    return { ok: true, ...resized };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not read that image.",
    };
  }
}

/** Picks the image files out of an arbitrary file list. */
export function filterImageFiles(files: File[] | FileList): File[] {
  return Array.from(files).filter((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
}
