import type { ColumnDef } from "@tanstack/react-table";
import { RotateCwIcon, SearchXIcon, TriangleAlertIcon } from "lucide-react";
import { DataTableSortableHeader } from "../../src/components/data-table-sortable-header";
import { EmptyState } from "../../src/components/empty-state";
import { CreatorIdentity, CreatorRowActions, CreatorStatus, formatCompact } from "./creator-cells";
import type { Creator } from "./creator-fixtures";

export const identityColumn: ColumnDef<Creator> = {
  id: "creator",
  accessorKey: "name",
  header: ({ column }) => <DataTableSortableHeader label="Creator" column={column} />,
  cell: ({ row }) => <CreatorIdentity creator={row.original} />,
  meta: { sticky: "start" },
};

export const statusColumn: ColumnDef<Creator> = {
  id: "status",
  header: "Status",
  cell: ({ row }) => <CreatorStatus status={row.original.status} />,
};

export const followersColumn: ColumnDef<Creator> = {
  accessorKey: "followers",
  header: ({ column }) => <DataTableSortableHeader label="Followers" column={column} />,
  cell: ({ row }) => formatCompact(row.original.followers),
};

export const actionsColumn: ColumnDef<Creator> = {
  id: "actions",
  size: 48,
  header: () => <span className="sr-only">Actions</span>,
  cell: ({ row }) => <CreatorRowActions creator={row.original} />,
  meta: { sticky: "end" },
};

export const COMPACT_CREATOR_COLUMNS: ColumnDef<Creator>[] = [
  identityColumn,
  statusColumn,
  followersColumn,
  actionsColumn,
];

/** A search or filter that matches nothing: clear it, never create something. */
export function CreatorsNoResults({ onClear }: { onClear: () => void }) {
  return (
    <EmptyState
      icon={SearchXIcon}
      title="No creators found"
      description="Try adjusting your filters or search query."
      action={{ label: "Clear filters", variant: "outline", onClick: onClear }}
    />
  );
}

/** A failed load, with a way to retry. */
export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      tone="destructive"
      icon={TriangleAlertIcon}
      title="Creators didn't load"
      description="Check your connection, then try again."
      action={{ label: "Try again", icon: RotateCwIcon, onClick: onRetry }}
    />
  );
}
