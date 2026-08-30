"use client";

import { Extension, type Editor, type Range } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { Suggestion, type SuggestionProps } from "@tiptap/suggestion";
import {
  AlertTriangle,
  ChevronRight,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Sigma,
  Table2,
  Video,
} from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { FeatureSet } from "../config/presets";
import type { EditorFeature } from "../types";
import { openEditorDialog } from "../utils/editorEvents";
import {
  createSuggestionRenderer,
  suggestionPanelClass,
  type SuggestionListHandle,
} from "./suggestionPopup";

type SlashItem = {
  title: string;
  description: string;
  icon: ReactNode;
  keywords: string[];
  group: string;
  /** Feature that must be enabled for the item to appear. */
  feature: EditorFeature;
  run: (editor: Editor, range: Range) => void;
};

/* -------------------------------------------------------------------------- */
/*                                   Items                                    */
/* -------------------------------------------------------------------------- */

const ITEMS: SlashItem[] = [
  {
    title: "Text",
    description: "Plain paragraph",
    icon: <Pilcrow />,
    keywords: ["paragraph", "body", "plain"],
    group: "Basic blocks",
    feature: "blockType",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 />,
    keywords: ["h1", "title", "big"],
    group: "Basic blocks",
    feature: "blockType",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 />,
    keywords: ["h2", "subtitle"],
    group: "Basic blocks",
    feature: "blockType",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: <Heading3 />,
    keywords: ["h3"],
    group: "Basic blocks",
    feature: "blockType",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run(),
  },
  {
    title: "Bullet list",
    description: "Simple unordered list",
    icon: <List />,
    keywords: ["ul", "unordered", "bullet"],
    group: "Lists",
    feature: "lists",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    description: "Ordered step-by-step list",
    icon: <ListOrdered />,
    keywords: ["ol", "ordered", "number"],
    group: "Lists",
    feature: "lists",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Task list",
    description: "Checklist with checkboxes",
    icon: <ListChecks />,
    keywords: ["todo", "checkbox", "check"],
    group: "Lists",
    feature: "taskList",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Quote",
    description: "Call out a citation",
    icon: <Quote />,
    keywords: ["blockquote", "citation"],
    group: "Basic blocks",
    feature: "blockquote",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code block",
    description: "Syntax-highlighted code",
    icon: <Code2 />,
    keywords: ["pre", "snippet", "syntax"],
    group: "Basic blocks",
    feature: "codeBlock",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "Horizontal rule",
    icon: <Minus />,
    keywords: ["hr", "separator", "line"],
    group: "Basic blocks",
    feature: "hr",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Callout",
    description: "Highlighted note box",
    icon: <AlertTriangle />,
    keywords: ["note", "warning", "admonition", "info"],
    group: "Basic blocks",
    feature: "callout",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setCallout("info").run(),
  },
  {
    title: "Toggle",
    description: "Collapsible details section",
    icon: <ChevronRight />,
    keywords: ["details", "accordion", "collapse", "expand"],
    group: "Basic blocks",
    feature: "details",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setDetails().run(),
  },
  {
    title: "Table",
    description: "Insert a 3 x 3 table",
    icon: <Table2 />,
    keywords: ["grid", "rows", "columns"],
    group: "Insert",
    feature: "table",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    title: "Image",
    description: "From a URL or your device",
    icon: <ImageIcon />,
    keywords: ["picture", "photo", "upload", "img"],
    group: "Insert",
    feature: "image",
    run: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      openEditorDialog(editor, "image");
    },
  },
  {
    title: "Video",
    description: "YouTube, Vimeo or a file path",
    icon: <Video />,
    keywords: ["youtube", "vimeo", "mp4", "embed", "movie"],
    group: "Insert",
    feature: "video",
    run: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      openEditorDialog(editor, "video");
    },
  },
  {
    title: "Custom HTML",
    description: "Paste raw markup or an embed",
    icon: <Code2 />,
    keywords: ["html", "embed", "iframe", "script", "raw"],
    group: "Insert",
    feature: "htmlBlock",
    run: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      openEditorDialog(editor, "html", { mode: "create" });
    },
  },
  {
    title: "Link",
    description: "Add a hyperlink",
    icon: <Link2 />,
    keywords: ["url", "anchor", "href"],
    group: "Insert",
    feature: "link",
    run: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      openEditorDialog(editor, "link");
    },
  },
  {
    title: "Math block",
    description: "Display a LaTeX formula",
    icon: <Sigma />,
    keywords: ["latex", "katex", "equation", "formula"],
    group: "Insert",
    feature: "math",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: "blockMath", attrs: { latex: "" } })
        .run(),
  },
];

/* -------------------------------------------------------------------------- */
/*                                    List                                    */
/* -------------------------------------------------------------------------- */

const SlashList = forwardRef<SuggestionListHandle, SuggestionProps<SlashItem>>((props, ref) => {
  const [selected, setSelected] = useState(0);
  const { items, command } = props;

  useEffect(() => setSelected(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        setSelected((index) => (index + items.length - 1) % items.length);
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelected((index) => (index + 1) % items.length);
        return true;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        const item = items[selected];
        if (item) command(item);
        return true;
      }
      return false;
    },
  }));

  if (!items.length) {
    return (
      <div className={suggestionPanelClass}>
        <p className="text-muted-foreground px-2 py-3 text-center text-sm">No matching blocks</p>
      </div>
    );
  }

  let lastGroup = "";

  return (
    <div className={suggestionPanelClass}>
      {items.map((item, index) => {
        const showGroup = item.group !== lastGroup;
        lastGroup = item.group;

        return (
          <div key={item.title}>
            {showGroup && (
              <p className="text-muted-foreground px-2 pt-2 pb-1 text-xs font-medium">
                {item.group}
              </p>
            )}
            <button
              type="button"
              onMouseEnter={() => setSelected(index)}
              onClick={() => command(item)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                index === selected
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50 text-foreground",
              )}
            >
              <span className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded border [&>svg]:size-4">
                {item.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{item.title}</span>
                <span className="text-muted-foreground block truncate text-xs">
                  {item.description}
                </span>
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
});

SlashList.displayName = "SlashList";

/* -------------------------------------------------------------------------- */
/*                                 Extension                                  */
/* -------------------------------------------------------------------------- */

export type SlashCommandOptions = { isEnabled: FeatureSet };

const SLASH_PLUGIN_KEY = new PluginKey("slashCommand");

/** The `/` menu. Items are filtered by the active preset before matching. */
export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: "slashCommand",

  addOptions() {
    return { isEnabled: () => true };
  },

  addProseMirrorPlugins() {
    const { isEnabled } = this.options;

    return [
      Suggestion<SlashItem>({
        editor: this.editor,
        char: "/",
        startOfLine: false,
        allowSpaces: false,
        pluginKey: SLASH_PLUGIN_KEY,

        items: ({ query }) => {
          const term = query.toLowerCase().trim();
          return ITEMS.filter((item) => {
            if (!isEnabled(item.feature)) return false;
            if (!term) return true;
            return (
              item.title.toLowerCase().includes(term) ||
              item.keywords.some((keyword) => keyword.includes(term))
            );
          }).slice(0, 12);
        },

        command: ({ editor, range, props }) => props.run(editor, range),

        render: createSuggestionRenderer(SlashList),
      }),
    ];
  },
});
