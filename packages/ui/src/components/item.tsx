import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

type ItemProps = ComponentProps<"div"> & {
  /** Renders the child element instead of a div: a `ul`/`li` for a list, a link or button for a clickable row. */
  asChild?: boolean;
};

/** Rows one under the other with a divider, framed in one border: a list of people, files or settings. */
function ItemGroup({ asChild = false, className, ...props }: ItemProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="item-group"
      className={cn(
        "flex min-w-0 flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
      {...props}
    />
  );
}

/** One row: optional media, content that takes the room, then actions. Its padding comes from the theme. */
function Item({ asChild = false, className, ...props }: ItemProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="item"
      className={cn(
        "flex min-w-0 items-center gap-(--gap-md) px-(--item-padding-x) py-(--item-padding-y) text-sm",
        "outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:hover:bg-muted/50 [button]:hover:bg-muted/50",
        className,
      )}
      {...props}
    />
  );
}

/** An avatar, icon or thumbnail at the start of the row. */
function ItemMedia({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="item-media" className={cn("flex shrink-0 items-center", className)} {...props} />;
}

function ItemContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-(--gap-xs)", className)}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="item-title" className={cn("truncate font-medium", className)} {...props} />;
}

function ItemDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p data-slot="item-description" className={cn("line-clamp-2 text-muted-foreground", className)} {...props} />
  );
}

/** Buttons, a badge or a menu at the end of the row. */
function ItemActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex shrink-0 items-center gap-(--gap-sm)", className)}
      {...props}
    />
  );
}

export { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle };
