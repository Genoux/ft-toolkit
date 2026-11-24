"use client";

import * as React from "react";

import { cn } from "../lib/utils";

type TableStickySide = "start" | "end";
type TableHideBelow = "sm" | "md";

const HIDE_BELOW: Record<TableHideBelow, string> = {
  sm: "max-sm:hidden",
  md: "max-md:hidden",
};

function findScrollContainer(element: HTMLElement) {
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    const { overflowX } = getComputedStyle(node);
    if (overflowX === "auto" || overflowX === "scroll") return node;
  }
  return null;
}

// Marks the table with the edges that have content scrolled out of view, so frozen columns, the
// frame's scrolling edges and a sticky header show their shadow only while something is hidden there. Inside a
// DataTableShell the shell is the scroll container, so it is looked up rather than assumed.
// It also publishes the visible window, so a row's focus ring spans what is on screen rather than
// the full scroll width, where its ends would sit off screen and cut across the frame's corners.
// The ring hangs off the row's last cell, so the window is measured back from the table's end.
function useScrollEdges(
  containerRef: React.RefObject<HTMLDivElement | null>,
  tableRef: React.RefObject<HTMLTableElement | null>,
) {
  React.useEffect(() => {
    const container = containerRef.current;
    const table = tableRef.current;
    const scrollContainer = container ? findScrollContainer(container) : null;
    if (!table || !scrollContainer) return;

    const update = () => {
      const scrollLeft = Math.abs(scrollContainer.scrollLeft);
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      table.toggleAttribute("data-overflow-start", scrollLeft > 0);
      table.toggleAttribute("data-overflow-end", scrollLeft < maxScrollLeft - 1);
      table.toggleAttribute("data-overflow-top", scrollContainer.scrollTop > 0);
      table.style.setProperty("--table-hidden-start", `${scrollLeft}px`);
      const hiddenEnd = table.offsetWidth - scrollLeft - scrollContainer.clientWidth;
      table.style.setProperty("--table-hidden-end", `${Math.max(0, hiddenEnd)}px`);
      table.style.setProperty("--table-visible-width", `${scrollContainer.clientWidth}px`);
    };

    update();
    scrollContainer.addEventListener("scroll", update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(scrollContainer);
    resizeObserver.observe(table);
    return () => {
      scrollContainer.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, [containerRef, tableRef]);
}

type TableProps = React.ComponentProps<"table"> & {
  /** Keeps the header row visible while rows scroll; needs a height-constrained scroll container. */
  stickyHeader?: boolean;
  containerClassName?: string;
};

function Table({
  className,
  stickyHeader = false,
  containerClassName,
  ref,
  ...props
}: TableProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tableRef = React.useRef<HTMLTableElement>(null);
  useScrollEdges(containerRef, tableRef);

  const setTableRef = React.useCallback(
    (node: HTMLTableElement | null) => {
      tableRef.current = node;
      if (typeof ref === "function") return ref(node);
      if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      className={cn(
        "relative w-full min-h-0 overflow-x-auto in-data-[slot=data-table-shell]:overflow-visible",
        containerClassName,
      )}
    >
      <table
        ref={setTableRef}
        data-slot="table"
        data-sticky-header={stickyHeader || undefined}
        className={cn(
          "group/table w-full border-separate border-spacing-0 text-table",
          "[--table-inset:var(--item-padding-x)] in-data-[slot=card]:[--table-inset:var(--card-padding)] [--table-actions-width:calc(--spacing(10)+var(--table-inset))]",
          // Without a frame the header strip floats on the page: its ends round off and it needs no rule.
          "[--table-head-radius:var(--radius-lg)] [--table-head-rule:transparent] in-data-frame:[--table-head-radius:0px] in-data-frame:[--table-head-rule:color-mix(in_oklab,var(--color-border)_60%,transparent)]",
          "[--table-surface:var(--color-background)] in-data-[slot=dialog-content]:[--table-surface:var(--color-popover)] in-data-[slot=sheet-content]:[--table-surface:var(--color-popover)] in-data-[slot=card]:[--table-surface:var(--color-card)] in-data-frame:[--table-surface:var(--color-card)]",
          // Mixed into the surface rather than translucent tints: frozen cells and a sticky header
          // must stay opaque, or the cells scrolled under them would show through.
          "[--table-head:color-mix(in_oklab,var(--color-muted)_60%,var(--table-surface))] [--table-group:color-mix(in_oklab,var(--color-muted)_35%,var(--table-surface))]",
          // Concentric with DataTableShell's rounded-xl frame: its 1px border plus the ring's 2px inset.
          "[--table-ring-radius:var(--radius-lg)] in-data-frame:[--table-ring-radius:calc(var(--radius-xl)-3px)]",
          "[--table-row-hover:color-mix(in_oklab,var(--color-foreground)_2.5%,var(--table-surface))] [--table-row-selected:color-mix(in_oklab,var(--color-foreground)_4.5%,var(--table-surface))]",
          // Frozen columns need every column at its natural width: a full-width table that
          // overflows squeezes fixed-width columns and opens a gap the scrolled cells show through.
          "has-data-sticky:w-max has-data-sticky:min-w-full",
          // The last row of each body has no rule: the frame, a footer or the next group's band ends it.
          "[&_tbody>tr:not(:last-child)>td]:border-b [&_tbody>tr:not(:last-child)>td]:border-border/60",
          "[&_tbody_tr>td]:transition-[background-color,color] [&_tbody_tr>td]:duration-(--duration-fast) [&_tbody_tr>td]:ease-out-expo",
          // The row carries the tint too, under an idle frozen actions cell that turns transparent.
          "[&_tbody_tr:not([data-state=selected],[data-placeholder]):is(:hover,:focus-within)]:bg-(--table-row-hover) [&_tbody_tr:not([data-state=selected],[data-placeholder]):is(:hover,:focus-within)>td]:bg-(--table-row-hover)",
          "[&_tbody_tr[data-state=selected]]:bg-(--table-row-selected) [&_tbody_tr[data-state=selected]>td]:bg-(--table-row-selected)",
          "[&_tbody_tr:is([data-state=selected],:hover)_[data-slot=badge][data-variant=secondary]]:bg-card",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:cursor-default", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      data-row
      className={cn("group outline-none", className)}
      {...props}
    />
  );
}

type TableCellOptions = {
  /** Right-aligns the column and sets tabular figures, for money and amounts; counts stay left like text. Use it on header and cells alike. */
  numeric?: boolean;
  /** Freezes the column at the start or end edge while the table scrolls sideways. */
  sticky?: TableStickySide;
  /** Drops the column on screens narrower than the breakpoint, for detail a phone can live without; use it on header and cells alike. */
  hideBelow?: TableHideBelow;
};

// The first and last cells pad by `--table-inset`, so rows and the header strip run to the frame
// while their content lines up with the page or card around the table.
const edgeInsetClassName = "first:ps-(--table-inset) last:pe-(--table-inset)";

// The edge shadow takes the pseudo-element on the inner side: `after` for a start column, `before`
// for an end column. `relative` anchors it on cells that are not frozen.
const stickyCellClassName = cn(
  "relative data-sticky:sticky data-sticky:z-1 data-sticky:bg-(--table-surface)",
  "data-[sticky=start]:start-(--table-sticky-offset,0px) data-[sticky=end]:end-(--table-sticky-offset,0px)",
  "data-[sticky=start]:after:pointer-events-none data-[sticky=start]:after:absolute data-[sticky=start]:after:inset-y-0 data-[sticky=start]:after:-end-4 data-[sticky=start]:after:w-4 data-[sticky=start]:after:bg-linear-to-r data-[sticky=start]:after:from-foreground/5 data-[sticky=start]:after:to-transparent data-[sticky=start]:after:opacity-0 data-[sticky=start]:after:transition-opacity data-[sticky=start]:after:duration-(--duration-base) data-[sticky=start]:after:ease-out-expo",
  "data-[sticky=end]:before:pointer-events-none data-[sticky=end]:before:absolute data-[sticky=end]:before:inset-y-0 data-[sticky=end]:before:-start-4 data-[sticky=end]:before:w-4 data-[sticky=end]:before:bg-linear-to-l data-[sticky=end]:before:from-foreground/5 data-[sticky=end]:before:to-transparent data-[sticky=end]:before:opacity-0 data-[sticky=end]:before:transition-opacity data-[sticky=end]:before:duration-(--duration-base) data-[sticky=end]:before:ease-out-expo",
  "group-data-overflow-start/table:data-[sticky=start]:after:opacity-100 group-data-overflow-end/table:data-[sticky=end]:before:opacity-100",
  "data-[sticky=start]:[&:has(+[data-sticky=start])]:after:hidden [[data-sticky=end]+&]:before:hidden",
);

// A table scrolled sideways shades the frame's edge while more columns sit past it, with the frozen
// column's gradient, so a cell cut at the edge reads as "more this way". The scroll container is the
// shell, not the table, so each row's first and last cells draw it at the visible edge
// (`--table-hidden-start|end`); a frozen cell already covers its edge and has its own shadow.
const scrollEdgeClassName = cn(
  "first:not-data-sticky:after:pointer-events-none first:not-data-sticky:after:absolute first:not-data-sticky:after:inset-y-0 first:not-data-sticky:after:z-1 first:not-data-sticky:after:start-(--table-hidden-start,0px) first:not-data-sticky:after:w-6 first:not-data-sticky:after:bg-linear-to-r first:not-data-sticky:after:from-foreground/5 first:not-data-sticky:after:to-transparent first:not-data-sticky:after:opacity-0 first:not-data-sticky:after:transition-opacity first:not-data-sticky:after:duration-(--duration-base) first:not-data-sticky:after:ease-out-expo",
  "last:not-data-sticky:before:pointer-events-none last:not-data-sticky:before:absolute last:not-data-sticky:before:inset-y-0 last:not-data-sticky:before:z-1 last:not-data-sticky:before:end-(--table-hidden-end,0px) last:not-data-sticky:before:w-6 last:not-data-sticky:before:bg-linear-to-l last:not-data-sticky:before:from-foreground/5 last:not-data-sticky:before:to-transparent last:not-data-sticky:before:opacity-0 last:not-data-sticky:before:transition-opacity last:not-data-sticky:before:duration-(--duration-base) last:not-data-sticky:before:ease-out-expo",
  "group-data-overflow-start/table:first:not-data-sticky:after:opacity-100 group-data-overflow-end/table:last:not-data-sticky:before:opacity-100",
);

// A frozen column that holds only hover-revealed row actions would otherwise cover the scrolled
// cells with an empty band on every resting row; it takes a surface only while its actions show.
// A selected row counts as resting: its band would hide the figure scrolled under it.
// Touch screens always show the actions, so there the band stays. While the cell is see-through its
// edge shadow moves to the frame's edge, where the scrolled cells are cut.
const idleActionsCellClassName = cn(
  "pointer-fine:[tr:not(:hover,:focus-within)>&[data-sticky]:has(>[data-variant=dots],>[data-slot=table-row-actions]):not(:has([data-state=open]))]:bg-transparent",
  "pointer-fine:[tr:not(:hover,:focus-within)>&[data-sticky=end]:has(>[data-variant=dots],>[data-slot=table-row-actions]):not(:has([data-state=open]))]:before:start-auto",
  "pointer-fine:[tr:not(:hover,:focus-within)>&[data-sticky=end]:has(>[data-variant=dots],>[data-slot=table-row-actions]):not(:has([data-state=open]))]:before:end-0",
  "pointer-fine:[tr:not(:hover,:focus-within)>&[data-sticky=end]:has(>[data-variant=dots],>[data-slot=table-row-actions]):not(:has([data-state=open]))]:before:w-6",
  "pointer-fine:[tr:not(:hover,:focus-within)>&[data-sticky]:has(>[data-variant=dots],>[data-slot=table-row-actions]):not(:has([data-state=open]))]:after:opacity-0",
);

// A focused row's ring is drawn from its last cell: a pseudo-element on the <tr> joins a fixed-layout
// table as an extra column, and the last cell, frozen or not, paints above the row's other cells.
// It stands 2px inside the visible part of the row with rounded corners, so on the last row it
// follows the frame's curve instead of cutting across it.
const rowFocusRingClassName = cn(
  "last:after:pointer-events-none last:after:absolute last:after:inset-y-0.5 last:after:z-1 last:after:rounded-(--table-ring-radius)",
  "last:after:end-[calc(var(--table-hidden-end,0px)+--spacing(0.5))] data-[sticky=end]:last:after:end-0.5 last:after:w-[calc(var(--table-visible-width,0px)-(--spacing(1)))]",
  "[tr:focus-visible>&]:last:after:focus-ring-inset",
);

// An actions column is one dots button wide plus the cell padding, set on the header too so the
// column keeps its width while rows load or none match. The button lands on the end inset.
const actionsCellClassName =
  "[&:has(>[data-slot=table-row-actions],>[data-variant=dots])]:w-(--table-actions-width) [&:has(>[data-variant=dots])]:text-end";

// The header of an actions column carries only a screen-reader label. Where its idle cells are
// see-through it is too while columns sit past the edge (the scrolled headers carry the strip's tint
// under it), so the header is cut at the frame's edge like the rows, under the same edge shadow.
const labelOnlyHeadClassName = cn(
  "[&:is(:empty,:has(>.sr-only:only-child))]:w-(--table-actions-width)",
  "pointer-fine:group-data-overflow-end/table:[&[data-sticky=end]:is(:empty,:has(>.sr-only:only-child))]:bg-transparent",
  "pointer-fine:[&[data-sticky=end]:is(:empty,:has(>.sr-only:only-child))]:before:start-auto pointer-fine:[&[data-sticky=end]:is(:empty,:has(>.sr-only:only-child))]:before:end-0 pointer-fine:[&[data-sticky=end]:is(:empty,:has(>.sr-only:only-child))]:before:w-6",
  "[&[data-sticky=start]:is(:empty,:has(>.sr-only:only-child))]:after:opacity-0",
);

const headStripClassName =
  "h-10 border-b border-(--table-head-rule) bg-(--table-head) data-sticky:bg-(--table-head) first:rounded-s-(--table-head-radius) last:rounded-e-(--table-head-radius)";

function TableHead({
  className,
  numeric = false,
  sticky,
  hideBelow,
  ...props
}: React.ComponentProps<"th"> & TableCellOptions) {
  return (
    <th
      data-slot="table-head"
      data-numeric={numeric || undefined}
      data-sticky={sticky}
      className={cn(
        "px-3 py-0 text-left align-middle text-xs font-normal whitespace-nowrap text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5",
        edgeInsetClassName,
        stickyCellClassName,
        scrollEdgeClassName,
        headStripClassName,
        labelOnlyHeadClassName,
        "group-data-sticky-header/table:sticky group-data-sticky-header/table:top-0 group-data-sticky-header/table:z-2 group-data-sticky-header/table:data-sticky:z-3",
        numeric && "text-right tabular-nums",
        hideBelow && HIDE_BELOW[hideBelow],
        className,
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  numeric = false,
  sticky,
  hideBelow,
  ...props
}: React.ComponentProps<"td"> & TableCellOptions) {
  return (
    <td
      data-slot="table-cell"
      data-numeric={numeric || undefined}
      data-sticky={sticky}
      className={cn(
        "h-12 px-3 py-2.75 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5",
        edgeInsetClassName,
        stickyCellClassName,
        scrollEdgeClassName,
        idleActionsCellClassName,
        actionsCellClassName,
        rowFocusRingClassName,
        numeric && "text-right tabular-nums",
        hideBelow && HIDE_BELOW[hideBelow],
        className,
      )}
      {...props}
    />
  );
}

/** Totals under the rows; its cells take the same `numeric` alignment as the body. */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("font-medium [&_td]:border-t [&_td]:border-border", className)}
      {...props}
    />
  );
}

/** Names the table for screen readers; add `sr-only` when a heading above already says it. */
function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 caption-bottom text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

type TableGroupRowProps = React.ComponentProps<"tr"> & {
  /** The number of columns, so the band spans the full row. */
  colSpan: number;
  /** How many rows the group holds, in subtle text after the title. */
  count?: React.ReactNode;
};

// The title is sticky so it stays over a frozen first column while the rows scroll sideways.
/** A titled band over a group of rows under the one header, such as a department of a queue. Start each group's `TableBody` with it. */
function TableGroupRow({ colSpan, count, className, children, ...props }: TableGroupRowProps) {
  return (
    <tr data-slot="table-group-row" className={className} {...props}>
      <th
        scope="rowgroup"
        colSpan={colSpan}
        className={cn(
          "relative h-10 rounded-(--table-head-radius) bg-(--table-group) px-(--table-inset) py-0 text-left align-middle text-sm font-medium whitespace-nowrap text-foreground",
          scrollEdgeClassName,
        )}
      >
        <span className="sticky start-(--table-inset) inline-flex items-center gap-2">
          {children}
          {count != null ? (
            <span className="font-normal text-subtle-foreground tabular-nums">{count}</span>
          ) : null}
        </span>
      </th>
    </tr>
  );
}

// Hidden only for fine pointers: touch screens have no hover to reveal them. An open menu keeps
// them visible while the pointer is over the menu instead of the row. The `dots` Button hides
// itself in any row on hover alone, so inside this wrapper its visibility is handed to the wrapper.
function TableRowActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-row-actions"
      className={cn(
        "flex items-center justify-end gap-0.5 transition-opacity duration-(--duration-fast) ease-out-expo [&_[data-variant=dots]]:opacity-100",
        "pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100 pointer-fine:has-data-[state=open]:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableCaption,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableGroupRow,
  TableRowActions,
};
export type { TableHideBelow, TableStickySide };
