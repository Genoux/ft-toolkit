"use client";

import { type ComponentProps, createContext, type ReactNode, useContext } from "react";
import { panelClassName } from "../lib/surface";
import { cn } from "../lib/utils";

type DescriptionLayout = "inline" | "stacked" | "tiles";
type DescriptionAlign = "start" | "end";

type ListContext = { layout: DescriptionLayout; align: DescriptionAlign; divided: boolean };

const ListContext = createContext<ListContext>({ layout: "inline", align: "start", divided: false });

type DescriptionListProps = ComponentProps<"dl"> & {
  /** `inline` a properties list: muted labels in one column, each value beside its label, for a
   * panel or a sheet; `stacked` the label over the value in a grid of as many columns as fit, for a
   * record's details; `tiles` a few short facts side by side as muted tiles, label over a figure. */
  layout?: DescriptionLayout;
  /** `end` pushes inline values to the right edge, a receipt of amounts that line up on their last digit. */
  align?: DescriptionAlign;
  /** Sets the list on a quiet near-white panel with a faint edge, one per section of a sheet or a
   * card. Tiles are their own surfaces and ignore it. */
  frame?: boolean;
  /** Faint rules between the rows of a framed inline list: a contained panel of label and value
   * pairs whose values sit far from their labels, a receipt. Ignored without `frame` or `inline`. */
  divided?: boolean;
};

const INLINE_COLUMNS = "grid-cols-[auto_minmax(0,1fr)] gap-x-4";

// A divided list's rows share the panel edge's faint line. The panel's 2px plus a row's 8px puts the
// first label's cap height about 15px under the edge, level with the 16px sides.
const DIVIDED_ROWS = "gap-y-0 px-4 py-0.5 divide-y divide-foreground/7";

// Divided rows take the toolkit's 36px row, a menu item's h-9 (owner, 2026-11-24): a 20px line with 8px
// above and below. The rule above a row is part of its 36px, so a ruled row gives 1px of its top.
const DIVIDED_ROW = "py-2 not-first:pt-1.75";

const LIST_LAYOUT: Record<DescriptionLayout, string> = {
  inline: cn("grid gap-y-3", INLINE_COLUMNS),
  stacked: "grid grid-cols-[repeat(auto-fill,minmax(min(100%,8rem),1fr))] gap-x-6 gap-y-4",
  tiles: "flex flex-wrap gap-(--gap-sm)",
};

/** Facts about one record as label and value pairs, separated by spacing; rules only in a divided panel. */
function DescriptionList({
  layout = "inline",
  align = "start",
  frame = false,
  divided = false,
  className,
  ...props
}: DescriptionListProps) {
  const framed = frame && layout !== "tiles";
  const ruled = divided && framed && layout === "inline";
  return (
    <ListContext.Provider value={{ layout, align, divided: ruled }}>
      <dl
        data-slot="description-list"
        data-layout={layout}
        data-frame={framed || undefined}
        data-divided={ruled || undefined}
        className={cn(
          "min-w-0",
          LIST_LAYOUT[layout],
          framed && panelClassName,
          framed && (ruled ? DIVIDED_ROWS : "p-4"),
          className,
        )}
        {...props}
      />
    </ListContext.Provider>
  );
}

type DescriptionItemProps = Omit<ComponentProps<"div">, "children"> & {
  label: ReactNode;
  /** The value; a row whose value is empty (null, false, "") is left out. */
  children?: ReactNode;
  /** Overrides the list's layout for this row: a long note stacked across an inline list. */
  layout?: DescriptionLayout;
  /** Takes the whole row of a stacked grid: a note or a set of tags among short facts. */
  wide?: boolean;
  /** The figure the rows above lead to, last in an inline list: set apart and in medium weight. */
  total?: boolean;
};

// Side by side, label and value share a 24px first line, the height of a Badge or an avatar stack: the
// value is one box the dd centres on that line, its first text line is 24px (the rest stay 20px).
// Baselines would not do: a value led by an avatar has no text baseline, and the label sank below it.
// A divided panel keeps the 36px row's 20px line instead; a value taller than that grows its row.
function itemClasses(layout: DescriptionLayout, list: ListContext, wide: boolean, total: boolean) {
  if (layout === "inline")
    return {
      row: cn(
        "col-span-full grid items-start",
        list.layout === "inline" ? "grid-cols-subgrid" : INLINE_COLUMNS,
        list.divided ? DIVIDED_ROW : total && "pt-1",
      ),
      label: cn(
        "max-w-60 min-w-32 text-sm leading-6",
        total ? "text-foreground" : "text-muted-foreground",
        list.divided && "leading-5",
      ),
      value: cn(
        "flex min-h-6 flex-col justify-center text-pretty *:first-line:leading-6",
        list.align === "end" && "items-end text-right",
        total && "text-base font-medium",
        list.divided && "min-h-5 *:first-line:leading-5",
      ),
      content: "",
    };
  if (layout === "stacked")
    return {
      row: cn(
        "flex flex-col gap-1",
        (wide || list.layout !== "stacked") && "col-span-full",
        list.divided && DIVIDED_ROW,
      ),
      label: "text-xs leading-5 text-muted-foreground",
      value: "whitespace-pre-line",
      content: "",
    };
  return {
    row: cn("flex max-w-full min-w-28 flex-[1_1_auto] flex-col gap-1 px-3 py-2.5", panelClassName),
    label: "truncate text-xs leading-5 text-muted-foreground",
    value: "text-base font-medium",
    content: "truncate",
  };
}

function DescriptionItem({
  label,
  children,
  layout,
  wide = false,
  total = false,
  className,
  ...props
}: DescriptionItemProps) {
  const list = useContext(ListContext);
  if (children === null || children === undefined || children === false || children === "")
    return null;
  const itemLayout = layout ?? list.layout;
  const classes = itemClasses(itemLayout, list, wide, total);

  return (
    <div
      data-slot="description-item"
      data-layout={itemLayout}
      className={cn("min-w-0", classes.row, className)}
      {...props}
    >
      <dt className={classes.label}>{label}</dt>
      <dd
        className={cn(
          "min-w-0 text-sm break-words text-foreground tabular-nums",
          classes.value,
        )}
      >
        <div className={cn("min-w-0 *:align-top", classes.content)}>{children}</div>
      </dd>
    </div>
  );
}

export { DescriptionItem, DescriptionList };
