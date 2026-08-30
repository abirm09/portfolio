"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Switch,
} from "@/components/ui";

type LinkDialogProps = {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const LinkDialog = ({ editor, open, onOpenChange }: LinkDialogProps) => {
  const [href, setHref] = useState("");
  const [text, setText] = useState("");
  const [newTab, setNewTab] = useState(true);

  const isEditing = editor.isActive("link");

  useEffect(() => {
    if (!open) return;

    const attrs = editor.getAttributes("link");
    setHref(attrs.href ?? "");
    setNewTab(attrs.target !== "_self");

    const { from, to } = editor.state.selection;
    setText(editor.state.doc.textBetween(from, to, " "));
  }, [open, editor]);

  const apply = () => {
    const url = href.trim();
    if (!url) return;

    const chain = editor.chain().focus().extendMarkRange("link");
    const attrs = {
      href: url,
      target: newTab ? "_blank" : "_self",
      rel: newTab ? "noopener noreferrer nofollow" : null,
    };

    // With nothing selected there is no text to carry the mark, so insert the
    // label (or the URL itself) as the link text.
    if (editor.state.selection.empty && !isEditing) {
      chain.insertContent({
        type: "text",
        text: text.trim() || url,
        marks: [{ type: "link", attrs }],
      });
    } else {
      chain.setLink(attrs);
    }

    chain.run();
    onOpenChange(false);
  };

  const remove = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit link" : "Add link"}</DialogTitle>
          <DialogDescription>
            Enter the destination. Relative paths like <code>/shop</code> work too.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">URL</Label>
            <Input
              autoFocus
              placeholder="https://example.com"
              value={href}
              onChange={(event) => setHref(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && apply()}
            />
          </div>

          {editor.state.selection.empty && !isEditing && (
            <div className="space-y-1.5">
              <Label className="text-sm">Link text</Label>
              <Input
                placeholder="Defaults to the URL"
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && apply()}
              />
            </div>
          )}

          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="space-y-0.5">
              <Label className="text-sm">Open in a new tab</Label>
              <p className="text-muted-foreground text-xs">
                Adds <code>rel=&quot;noopener noreferrer nofollow&quot;</code>
              </p>
            </div>
            <Switch checked={newTab} onCheckedChange={setNewTab} />
          </div>
        </div>

        <DialogFooter>
          {isEditing && (
            <Button variant="outline" className="mr-auto" onClick={remove}>
              Remove link
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={apply} disabled={!href.trim()}>
            {isEditing ? "Update" : "Add link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
