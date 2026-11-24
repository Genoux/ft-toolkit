"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "../lib/utils";

type DataTableSortableHeaderProps<TData, TValue> = {
  label: string;
  column: Column<TData, TValue>;
};

const SORT_ICON = { asc: ArrowUpIcon, desc: ArrowDownIcon, none: ChevronsUpDownIcon } as const;

// Not `Button size="xs"`: its fixed height and padding made sortable header rows 8px taller
// than plain-text ones and indented their labels. Padding cancelled by equal negative margins
// keeps the ghost hover pill while laying out exactly like a plain-text header.
export function DataTableSortableHeader<TData, TValue>({
  label,
  column,
}: DataTableSortableHeaderProps<TData, TValue>) {
  const direction = column.getIsSorted() || "none";
  const SortIcon = SORT_ICON[direction];

  return (
    <button
      type="button"
      data-sorted={direction}
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "group/sort -mx-2 -my-1 inline-flex align-middle cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 transition-colors duration-(--duration-fast) ease-out-expo outline-none",
        "hover:bg-muted hover:text-foreground focus-visible:focus-ring",
        "data-[sorted=asc]:text-foreground data-[sorted=desc]:text-foreground",
        column.columnDef.meta?.numeric && "flex-row-reverse",
      )}
    >
      {label}
      <SortIcon
        aria-hidden
        className="size-3 shrink-0 group-data-[sorted=none]/sort:opacity-50 group-data-[sorted=none]/sort:group-hover/sort:opacity-100"
      />
    </button>
  );
}
