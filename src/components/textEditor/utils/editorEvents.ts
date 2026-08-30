import type { Editor } from "@tiptap/core";

export type EditorDialogName =
  | "link"
  | "image"
  | "video"
  | "html"
  | "table"
  | "markdown"
  | "shortcuts";

export type EditorDialogDetail = {
  dialog: EditorDialogName;
  /** Optional seed data, e.g. the markup of the HTML block being edited. */
  payload?: Record<string, unknown>;
};

export const EDITOR_DIALOG_EVENT = "tiptap:open-dialog";

/**
 * Node views and the slash menu live outside the React tree that owns the
 * dialogs, so they ask for one over an event instead.
 *
 * The event is dispatched on the editor's own DOM node rather than `window`,
 * which scopes it to a single instance — the product form renders two editors
 * side by side and a global event would open both dialogs at once.
 */
export function openEditorDialog(
  editor: Editor,
  dialog: EditorDialogName,
  payload?: Record<string, unknown>,
): void {
  editor.view.dom.dispatchEvent(
    new CustomEvent<EditorDialogDetail>(EDITOR_DIALOG_EVENT, {
      detail: { dialog, payload },
      bubbles: false,
    }),
  );
}
