"use client";

import type { Editor } from "@tiptap/react";
import { Copy, Download, FileUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/components/ui";

type MarkdownDialogProps = {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Bridges the stored HTML to and from Markdown.
 *
 * Import replaces the document; export serializes the current document so it
 * can be copied or downloaded. The saved value stays HTML either way.
 */
export const MarkdownDialog = ({ editor, open, onOpenChange }: MarkdownDialogProps) => {
  const [tab, setTab] = useState("import");
  const [importText, setImportText] = useState("");
  const [exportText, setExportText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    setImportText("");
    try {
      setExportText(editor.getMarkdown());
    } catch {
      setExportText("");
      toast.error("Could not convert this document to Markdown.");
    }
  }, [open, editor]);

  const runImport = () => {
    const markdown = importText.trim();
    if (!markdown) return;

    try {
      editor.commands.setContent(markdown, { contentType: "markdown" });
      toast.success("Markdown imported");
      onOpenChange(false);
    } catch {
      toast.error("That Markdown could not be parsed.");
    }
  };

  const readFile = async (file?: File) => {
    if (!file) return;
    try {
      setImportText(await file.text());
    } catch {
      toast.error("Could not read that file.");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      toast.success("Markdown copied to clipboard");
    } catch {
      toast.error("Clipboard access was blocked by the browser.");
    }
  };

  const download = () => {
    const blob = new Blob([exportText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "content.md";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Markdown</DialogTitle>
          <DialogDescription>
            Move content between Markdown and the editor. Content is still saved as HTML.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="mt-4 space-y-3">
            <Textarea
              spellCheck={false}
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder={"# Heading\n\nSome **bold** text and a [link](https://example.com)."}
              className="h-64 resize-none font-mono text-xs"
            />

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <FileUp className="size-4" /> Load .md file
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".md,.markdown,text/markdown,text/plain"
                className="hidden"
                onChange={(event) => {
                  void readFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <p className="text-muted-foreground text-xs">
                Importing replaces the entire document.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="export" className="mt-4 space-y-3">
            <Textarea
              readOnly
              spellCheck={false}
              value={exportText}
              className="h-64 resize-none font-mono text-xs"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copy} disabled={!exportText}>
                <Copy className="size-4" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={download} disabled={!exportText}>
                <Download className="size-4" /> Download .md
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {tab === "import" && (
            <Button onClick={runImport} disabled={!importText.trim()}>
              Replace content
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
