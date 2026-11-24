import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

type SlotProps = ComponentProps<"div"> & {
  /** Renders the child element instead of a div: a `ul`/`li` for a list, a link or button for a clickable row. */
  asChild?: boolean;
};

type ItemGroupProps = SlotProps & {
  /** `false` drops the border and dividers: rows separated by spacing, each row's edges lined up with
   * the content around the group (a search field above it), for a list inside a dialog or sheet. */
  frame?: boolean;
};

type ItemProps = SlotProps & {
  /** Marks the row as the chosen one (a picked plan, the open record). Add the matching aria (`aria-selected`, `aria-current`) for the row's role. */
  selected?: boolean;
  /** Greys the row out and takes it out of hover and clicks: an option that cannot be picked, such as
   * someone already added. Disable its control too, and keep a badge that says why. */
  disabled?: boolean;
};

/** Rows one under the other with a divider, framed in one border: a list of people, files or settings. */
function ItemGroup({ asChild = false, frame = true, className, ...props }: ItemGroupProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="item-group"
      data-frame={frame}
      className={cn(
        "flex min-w-0 flex-col",
        frame
          ? "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card"
          : // A tint that bled past the content edge read as misaligned next to a search field above
            // the list, so the row box, not its text, lines up with the surrounding content.
            "[--item-padding-y:var(--gap-sm)] *:data-[slot=item]:rounded-lg",
        className,
      )}
      {...props}
    />
  );
}

// A row with an ItemColumn turns into a grid below md so the columns drop under the content while
// the actions stay top-right. Each part owns a track (control, media, content, actions); a missing
// part leaves an empty auto track, so the spacing comes from margins instead of a column gap.
const STACKED_ROW =
  "max-md:has-data-[slot=item-column]:grid max-md:has-data-[slot=item-column]:grid-cols-[auto_auto_minmax(0,1fr)_auto] max-md:has-data-[slot=item-column]:items-start max-md:has-data-[slot=item-column]:gap-x-0 max-md:has-data-[slot=item-column]:gap-y-(--gap-xs)";

/** One row: an optional control and media, content that takes the room, columns, then actions. Its padding comes from the theme; a link, button or label row (around a radio or checkbox), or a row with an ItemLink, gets hover and focus. */
function Item({
  asChild = false,
  selected = false,
  disabled = false,
  className,
  ...props
}: ItemProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="item"
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "group/item flex min-w-0 items-center gap-(--gap-md) px-(--item-padding-x) py-(--item-padding-y) text-sm",
        "outline-none transition-[background-color] duration-(--duration-fast) ease-out-expo",
        "focus-visible:bg-muted/60 focus-visible:focus-ring-inset",
        "has-[>input:focus-visible]:bg-muted/60 has-[>input:focus-visible]:focus-ring-inset [&>input]:focus-visible:outline-none",
        "[a&,button&,label&]:w-full [a&,button&,label&]:text-left [a&,button&,label&]:hover:bg-muted/60",
        "has-data-[slot=item-link]:relative has-[[data-slot=item-link]:hover]:bg-muted/60",
        "has-[[data-slot=item-link]:focus-visible]:bg-muted/60 has-[[data-slot=item-link]:focus-visible]:focus-ring-inset",
        "data-selected:bg-muted aria-[current=page]:bg-muted",
        "data-disabled:pointer-events-none data-disabled:text-muted-foreground data-disabled:*:data-[slot=item-media]:opacity-50",
        // The neutral badge shares the muted fill of the hover and selected tints, so only rows that
        // take those tints (links, buttons, checkable or selected rows) turn it into an outlined pill.
        "[&:is(a,button,label,[data-selected],:has([data-slot=item-link],>input))_[data-slot=badge][data-variant=secondary]]:border-border [&:is(a,button,label,[data-selected],:has([data-slot=item-link],>input))_[data-slot=badge][data-variant=secondary]]:bg-card",
        STACKED_ROW,
        className,
      )}
      {...props}
    />
  );
}

type ItemLinkProps = ComponentProps<"a"> & {
  /** Renders the child element, such as a router Link, instead of an anchor. */
  asChild?: boolean;
};

/** The row's title as a link whose hit area covers the whole row, so a row can open a record and
 * still hold its own controls (ItemControl, ItemActions), which sit above the link. */
function ItemLink({ asChild = false, className, ...props }: ItemLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="item-link"
      className={cn("outline-none after:absolute after:inset-0", className)}
      {...props}
    />
  );
}

/** A checkbox or radio at the very start of the row, beside an ItemLink: the batch select of a queue. */
function ItemControl({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-control"
      className={cn(
        "relative z-10 col-start-1 row-start-1 flex shrink-0 items-center",
        "max-md:group-has-data-[slot=item-column]/item:mt-0.5 max-md:group-has-data-[slot=item-column]/item:mr-(--gap-md)",
        className,
      )}
      {...props}
    />
  );
}

/** An avatar, icon or thumbnail at the start of the row. */
function ItemMedia({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-media"
      className={cn(
        // A bare icon keeps the avatar-wide column but pulls back by half its inset: a thin glyph at the
        // exact row padding reads as jammed against the edge next to an outlined button at the other
        // end, so it sits 4px further in to balance optically (owner call, 2026-11-24).
        "col-start-2 row-span-2 row-start-1 flex min-w-8 shrink-0 items-center justify-center has-[>svg]:-ms-1 [&>svg:not([class*='size-'])]:size-4 [&>svg:not([class*='text-'])]:text-muted-foreground",
        "max-md:group-has-data-[slot=item-column]/item:mr-(--gap-md)",
        className,
      )}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("col-start-3 row-start-1 flex min-w-0 flex-1 flex-col gap-1", className)}
      {...props}
    />
  );
}

const COLUMN_WIDTH = { sm: "md:w-28", md: "md:w-44", lg: "md:w-72" } as const;

type ItemColumnProps = ComponentProps<"div"> & {
  /** The column's width from md up; the same width on every row lines the column up across the group. */
  width?: keyof typeof COLUMN_WIDTH;
  align?: "start" | "end";
};

/** A fixed-width cell between the content and the actions: a figure or a change that lines up
 * across rows from md up, and drops under the content on a phone. */
function ItemColumn({ width = "md", align = "start", className, ...props }: ItemColumnProps) {
  return (
    <div
      data-slot="item-column"
      data-width={width}
      className={cn(
        "col-start-3 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm tabular-nums md:shrink-0 [&>svg]:shrink-0",
        COLUMN_WIDTH[width],
        align === "end" && "md:justify-end md:text-right",
        className,
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        // Inline, a badge sits on the text line's middle, a few pixels below the letters' visual centre;
        // a title holding one becomes a centred row. Plain titles stay inline so they truncate with "…".
        // A default-size badge outweighs the 14px title, so one in a title takes Badge's sm size.
        "truncate text-item font-medium has-[>[data-slot=badge]]:flex has-[>[data-slot=badge]]:items-center has-[>[data-slot=badge]]:gap-(--gap-sm)",
        "[&>[data-slot=badge][data-size=md]]:h-5 [&>[data-slot=badge][data-size=md]]:px-2 [&>[data-slot=badge][data-size=md]]:text-2xs",
        className,
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("line-clamp-2 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Buttons, a badge or a menu at the end of the row. */
function ItemActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn(
        "relative z-10 col-start-4 row-start-1 flex shrink-0 items-center gap-(--gap-sm)",
        "max-md:group-has-data-[slot=item-column]/item:ml-(--gap-md)",
        className,
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemActions,
  ItemColumn,
  ItemContent,
  ItemControl,
  ItemDescription,
  ItemGroup,
  ItemLink,
  ItemMedia,
  ItemTitle,
};
