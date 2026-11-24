import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

type DataTableShellProps = ComponentProps<"div"> & {
  /** `false` drops the border and surface, for a table inside a dialog or a section that already frames it. A Card drops them on its own, and so does an empty, no-results or error state. */
  frame?: boolean;
};

const framedClassName = cn(
  "rounded-xl border border-border bg-card has-data-[slot=data-table-status]:border-0 has-data-[slot=data-table-status]:bg-transparent",
  "in-data-[slot=card]:-mx-(--card-padding) in-data-[slot=card]:rounded-none in-data-[slot=card]:border-0 in-data-[slot=card]:bg-transparent",
);

// The rows and the header strip run to the frame; the table's first and last cells carry the inset.
// Without a frame, or inside a Card, the shell bleeds by that inset so the cell text lines up with
// the content around it. An empty, no-results or error state drops the frame and the white surface
// (an empty box reads as a broken panel) and grows into the room its page leaves, so the message
// centres on the page there; its children never shrink, so rows still scroll.
export function DataTableShell({ className, frame = true, ...props }: DataTableShellProps) {
  return (
    <div
      data-slot="data-table-shell"
      data-frame={frame || undefined}
      className={cn(
        "flex min-h-0 min-w-0 flex-col overflow-auto text-card-foreground *:shrink-0 has-data-[slot=data-table-status]:grow",
        frame ? framedClassName : "-mx-(--item-padding-x)",
        className,
      )}
      {...props}
    />
  );
}
