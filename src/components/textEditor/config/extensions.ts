import type { AnyExtension } from "@tiptap/core";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Details, DetailsContent, DetailsSummary } from "@tiptap/extension-details";
import { Emoji, gitHubEmojis } from "@tiptap/extension-emoji";
import { FileHandler } from "@tiptap/extension-file-handler";
import { FindAndReplace } from "@tiptap/extension-find-and-replace";
import { Highlight } from "@tiptap/extension-highlight";
import { InvisibleCharacters } from "@tiptap/extension-invisible-characters";
import { Link } from "@tiptap/extension-link";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Mathematics } from "@tiptap/extension-mathematics";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableKit } from "@tiptap/extension-table";
import { TableOfContents, getHierarchicalIndexes } from "@tiptap/extension-table-of-contents";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style/text-style-kit";
import { Typography } from "@tiptap/extension-typography";
import { UniqueID } from "@tiptap/extension-unique-id";
import { CharacterCount, Focus, Placeholder, Selection } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";

import { Callout } from "../extensions/Callout";
import { HtmlBlock } from "../extensions/HtmlBlock";
import { ResizableImage } from "../extensions/ResizableImage";
import { Video } from "../extensions/Video";
import { EmojiList } from "../menus/EmojiList";
import { SlashCommand } from "../menus/SlashCommand";
import { createSuggestionRenderer } from "../menus/suggestionPopup";
import type { FeatureSet } from "./presets";

const lowlight = createLowlight(common);

export type BuildExtensionsOptions = {
  isEnabled: FeatureSet;
  placeholder: string;
  maxCharacters?: number;
  /** Handles files arriving by drag-drop or clipboard paste. */
  onFiles?: (files: File[]) => void;
};

/**
 * Assembles the extension list for one editor instance.
 *
 * Extensions that only cost bytes when used are gated behind the feature set
 * so a `minimal` editor does not pay for KaTeX, syntax highlighting or the
 * emoji dataset.
 */
export function buildExtensions({
  isEnabled,
  placeholder,
  maxCharacters,
  onFiles,
}: BuildExtensionsOptions): AnyExtension[] {
  const extensions: AnyExtension[] = [
    StarterKit.configure({
      // Replaced below by the syntax-highlighting variant.
      codeBlock: isEnabled("codeBlock") ? false : undefined,
      // Configured separately so the protocol allowlist and rel are ours.
      link: false,
      heading: { levels: [1, 2, 3, 4, 5, 6] },
    }),

    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === "heading") return "Heading";
        if (node.type.name === "detailsSummary") return "Toggle title";
        return placeholder;
      },
    }),

    // Highlights the active node so drag handles and block menus have an anchor.
    Focus.configure({ className: "has-focus", mode: "shallowest" }),
    Selection,

    TextStyleKit.configure({
      backgroundColor: isEnabled("backgroundColor") ? {} : false,
      color: isEnabled("color") ? {} : false,
      fontFamily: isEnabled("fontFamily") ? {} : false,
      fontSize: isEnabled("fontSize") ? {} : false,
      lineHeight: isEnabled("lineHeight") ? {} : false,
      textStyle: {},
    }),

    CharacterCount.configure({ limit: maxCharacters ?? null }),
  ];

  if (isEnabled("link")) {
    extensions.push(
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        protocols: ["http", "https", "mailto", "tel"],
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
    );
  }

  if (isEnabled("highlight")) {
    extensions.push(Highlight.configure({ multicolor: true }));
  }

  if (isEnabled("script")) {
    extensions.push(Subscript, Superscript);
  }

  if (isEnabled("align")) {
    extensions.push(
      TextAlign.configure({ types: ["heading", "paragraph", "blockquote", "callout"] }),
    );
  }

  if (isEnabled("codeBlock")) {
    extensions.push(CodeBlockLowlight.configure({ lowlight, defaultLanguage: null }));
  }

  if (isEnabled("taskList")) {
    extensions.push(TaskList, TaskItem.configure({ nested: true }));
  }

  if (isEnabled("table")) {
    extensions.push(TableKit.configure({ table: { resizable: true, allowTableNodeSelection: true } }));
  }

  if (isEnabled("details")) {
    extensions.push(
      Details.configure({ persist: true, HTMLAttributes: { class: "tiptap-details" } }),
      DetailsSummary,
      DetailsContent,
    );
  }

  if (isEnabled("callout")) {
    extensions.push(Callout);
  }

  if (isEnabled("image")) {
    extensions.push(ResizableImage.configure({ inline: false, allowBase64: true }));
  }

  if (isEnabled("video")) {
    extensions.push(Video);
  }

  if (isEnabled("htmlBlock")) {
    extensions.push(HtmlBlock);
  }

  if (isEnabled("math")) {
    extensions.push(Mathematics.configure({ blockOptions: {}, inlineOptions: {} }));
  }

  if (isEnabled("emoji")) {
    extensions.push(
      Emoji.configure({
        emojis: gitHubEmojis,
        enableEmoticons: true,
        suggestion: { render: createSuggestionRenderer(EmojiList) },
      }),
    );
  }

  if (isEnabled("typography")) {
    extensions.push(Typography);
  }

  if (isEnabled("findReplace")) {
    extensions.push(FindAndReplace);
  }

  if (isEnabled("invisibles")) {
    // Off until the author toggles it from the toolbar.
    extensions.push(InvisibleCharacters.configure({ visible: false }));
  }

  if (isEnabled("toc")) {
    // Stable heading ids are what make the table of contents clickable.
    extensions.push(
      UniqueID.configure({ types: ["heading"] }),
      TableOfContents.configure({ getIndex: getHierarchicalIndexes }),
    );
  }

  if (isEnabled("slashCommand")) {
    extensions.push(SlashCommand.configure({ isEnabled }));
  }

  if (isEnabled("image") && onFiles) {
    extensions.push(
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/gif",
          "image/avif",
          "image/svg+xml",
        ],
        onDrop: (_editor, files) => onFiles(files),
        onPaste: (_editor, files) => onFiles(files),
      }),
    );
  }

  if (isEnabled("markdown")) {
    // GFM covers the tables and task lists the editor can already produce.
    extensions.push(Markdown.configure({ markedOptions: { gfm: true } }));
  }

  return extensions;
}
