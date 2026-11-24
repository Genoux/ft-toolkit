"use client";

import {
  type Column,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type Row,
  type RowData,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import type { ComponentProps, CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from "react";

import { Checkbox } from "./checkbox";
import { Skeleton } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableHideBelow,
  type TableStickySide,
} from "./table";
import { cn } from "../lib/utils";

// Declared here rather than in a sibling .d.ts: consumers type-check this source from node_modules
// and never load the .d.ts, so `meta.headerClassName` would not exist for them.
declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: parameters must match the library declaration
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    /** Right-aligned with tabular figures, for money and amounts; counts and rates stay left like text. */
    numeric?: boolean;
    /** Frozen while the table scrolls sideways. Every frozen column but the edge one keeps its `size` as a fixed width. */
    sticky?: TableStickySide;
    /** Dropped on screens narrower than the breakpoint, for detail a phone can live without. */
    hideBelow?: TableHideBelow;
  }
}

const interactiveRowClassName = "cursor-pointer";

const INTERACTIVE_DESCENDANT = "a, button, input, select, textarea, label, [role=checkbox], [role=menuitem]";

const SELECTION_COLUMN_ID = "select";

export type DataTableProps<TData, TValue = unknown> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  /** Replaces `emptyMessage`, for an EmptyState with a "Clear filters" action. Replaces the table, header included, and sits frameless where it stood. */
  empty?: ReactNode;
  /** Shown instead of the rows when loading failed, with a way to retry. */
  error?: ReactNode;
  /** Shows skeleton rows under the header in place of the data. */
  isLoading?: boolean;
  loadingRowCount?: number;
  stickyHeader?: boolean;
  /** Makes each row a target: click, Enter or Space opens it, clicks on controls inside the row do not. */
  onRowClick?: (row: Row<TData>) => void;
  hideHeader?: boolean;
  tableOptions?: Omit<Partial<TableOptions<TData>>, "data" | "columns" | "getCoreRowModel">;
  wrapperClassName?: string;
  tableClassName?: string;
  tableHeaderClassName?: string;
  tableHeaderRowClassName?: string;
  headerCellClassName?: string;
  bodyCellClassName?: string;
  getRowProps?: (row: Row<TData>) => Omit<ComponentProps<"tr">, "children">;
};

type StickyPlacement = { side: TableStickySide; style: CSSProperties };

function placeStickyColumns<TData>(
  columns: Column<TData, unknown>[],
  side: TableStickySide,
): [string, StickyPlacement][] {
  const frozen = columns.filter((column) => column.columnDef.meta?.sticky === side);
  return frozen.map((column, index) => {
    const offset = frozen.slice(0, index).reduce((total, previous) => total + previous.getSize(), 0);
    const isEdge = index === frozen.length - 1;
    const width = isEdge ? undefined : column.getSize();
    return [
      column.id,
      {
        side,
        style: {
          ...(offset > 0 ? { "--table-sticky-offset": `${offset}px` } : {}),
          ...(width === undefined ? {} : { width, minWidth: width, maxWidth: width }),
        } as CSSProperties,
      },
    ];
  });
}

function getStickyPlacements<TData>(columns: Column<TData, unknown>[]) {
  return new Map([
    ...placeStickyColumns(columns, "start"),
    ...placeStickyColumns([...columns].reverse(), "end"),
  ]);
}

function getAriaSort<TData>(column: Column<TData, unknown>) {
  const direction = column.getIsSorted();
  if (direction === "asc") return "ascending";
  if (direction === "desc") return "descending";
  return undefined;
}

function isFromInteractiveDescendant(event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) {
  const target = event.target as HTMLElement;
  return target !== event.currentTarget && target.closest(INTERACTIVE_DESCENDANT) !== null;
}

function getRowClickProps<TData>(
  row: Row<TData>,
  onRowClick: (row: Row<TData>) => void,
): Omit<ComponentProps<"tr">, "children"> {
  return {
    tabIndex: 0,
    onClick: (event) => {
      if (!isFromInteractiveDescendant(event)) onRowClick(row);
    },
    onKeyDown: (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      onRowClick(row);
    },
  };
}

// An icon-only column (row actions) is too narrow for a text bar; a bar there reads as a clipped sliver.
function isNarrowColumn<TData>(column: Column<TData, unknown>) {
  return column.columnDef.size !== undefined && column.getSize() <= 48;
}

// An empty, no-results or error state replaces the table, header strip included: column names over
// no rows only frame the message, which sits on the page like any other empty state.
function DataTableStatus({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      data-slot="data-table-status"
      className={cn(
        "flex min-h-24 min-w-0 grow flex-col items-center justify-center px-4 py-8 text-center [&>[data-slot=empty-state]]:py-6",
        className,
      )}
    >
      {typeof children === "string" ? (
        <p className="text-sm text-muted-foreground">{children}</p>
      ) : (
        children
      )}
    </div>
  );
}

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  emptyMessage = "No results.",
  empty,
  error,
  isLoading = false,
  loadingRowCount = 8,
  stickyHeader,
  onRowClick,
  hideHeader = false,
  tableOptions,
  wrapperClassName,
  tableClassName,
  tableHeaderClassName,
  tableHeaderRowClassName,
  headerCellClassName,
  bodyCellClassName,
  getRowProps,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    ...tableOptions,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const visibleColumns = table.getVisibleLeafColumns();
  const stickyPlacements = getStickyPlacements(visibleColumns);
  const rowModel = table.getRowModel().rows;
  const hasError = Boolean(error);
  const showsRows = !isLoading && !hasError;
  const isEmpty = showsRows && rowModel.length === 0;
  const status = hasError ? error : isEmpty ? (empty ?? emptyMessage) : null;
  const isInteractive = Boolean(onRowClick);

  if (status !== null) {
    return <DataTableStatus className={wrapperClassName}>{status}</DataTableStatus>;
  }

  const tableInner = (
    <Table
      className={tableClassName}
      stickyHeader={stickyHeader}
      aria-busy={isLoading || undefined}
    >
      {!hideHeader ? (
        <TableHeader className={tableHeaderClassName}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={tableHeaderRowClassName}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta;
                const placement = stickyPlacements.get(header.column.id);
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={getAriaSort(header.column)}
                    numeric={meta?.numeric}
                    hideBelow={meta?.hideBelow}
                    sticky={placement?.side}
                    style={placement?.style}
                    className={cn(headerCellClassName, meta?.headerClassName)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
      ) : null}
      <TableBody>
        {isLoading
          ? Array.from({ length: loadingRowCount }, (_, rowIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholder rows have no identity
              <TableRow key={rowIndex} data-placeholder aria-hidden>
                {visibleColumns.map((column) => {
                  const placement = stickyPlacements.get(column.id);
                  const meta = column.columnDef.meta;
                  return (
                    <TableCell
                      key={column.id}
                      numeric={meta?.numeric}
                      hideBelow={meta?.hideBelow}
                      sticky={placement?.side}
                      style={placement?.style}
                      className={cn(bodyCellClassName, meta?.cellClassName)}
                    >
                      {column.id === SELECTION_COLUMN_ID ? (
                        <Skeleton className="size-4 rounded-sm" />
                      ) : isNarrowColumn(column) ? null : (
                        <Skeleton className="h-3 w-full" />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          : null}
        {showsRows
          ? rowModel.map((row) => {
              const extra = getRowProps?.(row);
              const { className: rowClassName, ...restExtra } = extra ?? {};
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  {...(onRowClick ? getRowClickProps(row, onRowClick) : {})}
                  {...restExtra}
                  className={cn(isInteractive ? interactiveRowClassName : undefined, rowClassName)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    const placement = stickyPlacements.get(cell.column.id);
                    return (
                      <TableCell
                        key={cell.id}
                        numeric={meta?.numeric}
                        hideBelow={meta?.hideBelow}
                        sticky={placement?.side}
                        style={placement?.style}
                        className={cn(bodyCellClassName, meta?.cellClassName)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          : null}
      </TableBody>
    </Table>
  );

  return wrapperClassName ? (
    <div className={cn("min-w-0", wrapperClassName)}>{tableInner}</div>
  ) : (
    tableInner
  );
}

type SelectionColumnOptions<TData> = {
  /** Names the row for screen readers, e.g. `Select ${row.original.name}`. */
  getRowLabel?: (row: Row<TData>) => string;
};

// The label fills the cell, so the whole cell selects: a near miss in a clickable row would open the
// record instead. A label is an interactive descendant, so the row ignores the click. As the first
// column the checkbox starts at the table's inset, in line with the group titles.
const selectionHitAreaClassName =
  "absolute inset-0 flex cursor-pointer items-center justify-center has-disabled:cursor-not-allowed [:first-child>&]:justify-start [:first-child>&]:ps-(--table-inset)";

/** A frozen checkbox column: the header checkbox selects the current page and shows a partial selection. */
export function getSelectionColumn<TData>({
  getRowLabel = () => "Select row",
}: SelectionColumnOptions<TData> = {}): ColumnDef<TData> {
  return {
    id: SELECTION_COLUMN_ID,
    size: 48,
    enableSorting: false,
    enableHiding: false,
    meta: { sticky: "start", headerClassName: "w-12", cellClassName: "w-12" },
    header: ({ table }) => (
      <label className={selectionHitAreaClassName}>
        <Checkbox
          aria-label="Select all rows"
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
        />
      </label>
    ),
    cell: ({ row }) => (
      <label className={selectionHitAreaClassName}>
        <Checkbox
          aria-label={getRowLabel(row)}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        />
      </label>
    ),
  };
}
