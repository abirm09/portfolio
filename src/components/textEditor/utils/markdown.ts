/** Structures that are unambiguous enough to treat pasted text as Markdown. */
const MARKDOWN_SIGNALS = [
  /^#{1,6}\s+\S/m, // headings
  /^\s*[-*+]\s+\S/m, // bullet list
  /^\s*\d+\.\s+\S/m, // ordered list
  /^\s*>\s+\S/m, // blockquote
  /^\s*```/m, // fenced code
  /^\s*\|.+\|\s*$/m, // table row
  /^\s*[-*_]{3,}\s*$/m, // thematic break
  /\[[^\]]+\]\([^)]+\)/, // link
  /!\[[^\]]*\]\([^)]+\)/, // image
  /(\*\*|__)\S[\s\S]*?\1/, // bold
];

/**
 * Heuristic for the paste handler.
 *
 * Two independent signals are required so ordinary prose containing a stray
 * asterisk or a hyphenated list is not mangled into Markdown.
 */
export function looksLikeMarkdown(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 3) return false;

  const matches = MARKDOWN_SIGNALS.filter((pattern) => pattern.test(trimmed)).length;

  // A heading or fenced code block on its own is already conclusive.
  if (/^#{1,6}\s+\S/m.test(trimmed) || /^\s*```/m.test(trimmed)) return true;

  return matches >= 2;
}
