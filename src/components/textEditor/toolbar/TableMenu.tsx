"use client";

import type { Editor } from "@tiptap/react";
import {
  ArrowDownToLine,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpToLine,
  ChevronDown,
  Columns3,
  Combine,
  Heading,
  Rows3,
  Split,
  Table2,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

import { toolbarBtnClass, ToolbarTip } from "./primitives";

const GRID_ROWS = 6;
const GRID_COLS = 8;

/** Hover-to-size grid, the fastest way to drop in a table of a known shape. */
const GridPicker = ({ onPick }: { onPick: (rows: number, cols: number) => void }) => {
  const [hover, setHover] = useState({ rows: 0, cols: 0 });

  return (
    <div className="px-2 pb-1" onMouseLeave={() => setHover({ rows: 0, cols: 0 })}>
      <div className="grid grid-cols-8 gap-0.5">
        {Array.from({ length: GRID_ROWS * GRID_COLS }, (_, index) => {
          const row = Math.floor(index / GRID_COLS) + 1;
          const col = (index % GRID_COLS) + 1;
          const isActive = row <= hover.rows && col <= hover.cols;

          return (
            <button
              key={index}
              type="button"
              aria-label={`${row} by ${col} table`}
              onMouseEnter={() => setHover({ rows: row, cols: col })}
              onClick={() => onPick(row, col)}
              className={cn(
                "size-4 rounded-[2px] border transition-colors",
                isActive ? "border-primary bg-primary/30" : "border-border bg-muted/40",
              )}
            />
          );
        })}
      </div>
      <p className="text-muted-foreground mt-1.5 text-center text-xs">
        {hover.rows ? `${hover.rows} x ${hover.cols}` : "Pick a size"}
      </p>
    </div>
  );
};

export const TableMenu = ({ editor, inTable }: { editor: Editor; inTable: boolean }) => (
  <DropdownMenu>
    <ToolbarTip label="Table">
      <DropdownMenuTrigger className={toolbarBtnClass(inTable)}>
        <Table2 />
        <ChevronDown className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>
    </ToolbarTip>

    <DropdownMenuContent align="start" className="w-56">
      <DropdownMenuLabel className="text-xs">Insert table</DropdownMenuLabel>
      <GridPicker
        onPick={(rows, cols) =>
          editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
        }
      />

      <DropdownMenuSeparator />

      <DropdownMenuItem
        disabled={!inTable}
        onClick={() => editor.chain().focus().addRowBefore().run()}
      >
        <ArrowUpToLine /> Row above
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!inTable}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <ArrowDownToLine /> Row below
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!inTable}
        onClick={() => editor.chain().focus().addColumnBefore().run()}
      >
        <ArrowLeftToLine /> Column left
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!inTable}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <ArrowRightToLine /> Column right
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        disabled={!inTable}
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      >
        <Heading /> Toggle header row
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!inTable}
        onClick={() => editor.chain().focus().mergeCells().run()}
      >
        <Combine /> Merge cells
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!inTable}
        onClick={() => editor.chain().focus().splitCell().run()}
      >
        <Split /> Split cell
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem disabled={!inTable} onClick={() => editor.chain().focus().deleteRow().run()}>
        <Rows3 /> Delete row
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!inTable}
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <Columns3 /> Delete column
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!inTable}
        variant="destructive"
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 /> Delete table
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
