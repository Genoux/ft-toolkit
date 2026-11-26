import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../src/components/button";
import { Card } from "../../src/components/card";
import { DataTable, getSelectionColumn } from "../../src/components/data-table";
import { DataTableSelectionBar } from "../../src/components/data-table-selection-bar";
import { DataTableShell } from "../../src/components/data-table-shell";
import { DataTableSortableHeader } from "../../src/components/data-table-sortable-header";
import { LoadMoreSentinel } from "../../src/components/load-more-sentinel";
import { Pagination } from "../../src/components/pagination";
import { SearchInput } from "../../src/components/search-input";
import {
  CreatorEngagement,
  CreatorTags,
  formatCompact,
  formatShortDate,
  formatUsd,
} from "../lib/creator-cells";
import { CREATORS, type Creator } from "../lib/creator-fixtures";
import {
  actionsColumn,
  COMPACT_CREATOR_COLUMNS,
  CreatorsNoResults,
  followersColumn,
  identityColumn,
  LoadError,
  statusColumn,
} from "../lib/creator-table";
import { AnnotationCaption } from "../lib/state-annotation";

const meta = {
  title: "Organisms/DataTable",
  component: DataTable,
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const PAGE_SIZE = 25;
const LOAD_MORE_PAGE_SIZE = 10;
const LOAD_MORE_DELAY_MS = 700;

const selectionColumn = getSelectionColumn<Creator>({
  getRowLabel: (row) => `Select ${row.original.name}`,
});

const CREATOR_COLUMNS: ColumnDef<Creator>[] = [
  selectionColumn,
  identityColumn,
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.platform}</span>,
    meta: { hideBelow: "md" },
  },
  followersColumn,
  {
    accessorKey: "engagementRate",
    header: ({ column }) => <DataTableSortableHeader label="Engagement" column={column} />,
    cell: ({ row }) => <CreatorEngagement rate={row.original.engagementRate} />,
  },
  {
    accessorKey: "averageViews",
    header: "Avg. views",
    cell: ({ row }) => formatCompact(row.original.averageViews),
  },
  {
    accessorKey: "rateUsd",
    header: ({ column }) => <DataTableSortableHeader label="Rate" column={column} />,
    cell: ({ row }) => formatUsd(row.original.rateUsd),
    meta: { numeric: true },
  },
  statusColumn,
  {
    id: "tags",
    header: "Tags",
    cell: ({ row }) => <CreatorTags tags={row.original.tags} />,
    meta: { hideBelow: "md" },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.location}</span>,
    meta: { hideBelow: "md" },
  },
  {
    accessorKey: "lastActivity",
    header: ({ column }) => <DataTableSortableHeader label="Last activity" column={column} />,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatShortDate(row.original.lastActivity)}</span>
    ),
  },
  actionsColumn,
];

function StateFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <AnnotationCaption>{label}</AnnotationCaption>
      <DataTableShell className="h-80">{children}</DataTableShell>
    </div>
  );
}

function SortedSelectedTable() {
  const [sorting, setSorting] = useState<SortingState>([{ id: "followers", desc: true }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({ "creator-2": true });
  return (
    <DataTable
      columns={[selectionColumn, ...COMPACT_CREATOR_COLUMNS]}
      data={CREATORS.slice(0, 4)}
      tableOptions={{
        getRowId: (creator) => creator.id,
        state: { sorting, rowSelection },
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getSortedRowModel: getSortedRowModel(),
      }}
    />
  );
}

export const AllStates: Story = {
  render: () => (
    <div className="grid max-w-6xl gap-6 md:grid-cols-2">
      <StateFrame label="loaded · sorted by followers, one row selected">
        <SortedSelectedTable />
      </StateFrame>
      <StateFrame label="loading">
        <DataTable columns={COMPACT_CREATOR_COLUMNS} data={[]} isLoading loadingRowCount={5} />
      </StateFrame>
      <StateFrame label="no results">
        <DataTable
          columns={COMPACT_CREATOR_COLUMNS}
          data={[]}
          empty={<CreatorsNoResults onClear={() => {}} />}
        />
      </StateFrame>
      <StateFrame label="error">
        <DataTable
          columns={COMPACT_CREATOR_COLUMNS}
          data={[]}
          error={<LoadError onRetry={() => {}} />}
        />
      </StateFrame>
    </div>
  ),
};

function CreatorsDatabasePreview() {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [openedCreator, setOpenedCreator] = useState<string | null>(null);

  const creators = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CREATORS.filter((creator) =>
      [creator.name, creator.email, creator.location, ...creator.tags].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [search]);

  const selectedCount = Object.keys(rowSelection).length;

  const changeSearch = (value: string) => {
    setSearch(value);
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  return (
    <div className="flex h-[44rem] max-w-6xl flex-col gap-3">
      <div className="flex items-center gap-2">
        <SearchInput value={search} onChange={changeSearch} placeholder="Search creators…" />
        <p className="ml-auto text-sm text-muted-foreground tabular-nums">
          {openedCreator ? `Opened ${openedCreator} · ` : null}
          {creators.length} creators
        </p>
      </div>
      <DataTableShell className="min-h-0 flex-1">
        <DataTable
          columns={CREATOR_COLUMNS}
          data={creators}
          stickyHeader
          onRowClick={(row) => setOpenedCreator(row.original.name)}
          empty={<CreatorsNoResults onClear={() => changeSearch("")} />}
          tableOptions={{
            getRowId: (creator) => creator.id,
            state: { sorting, rowSelection, pagination },
            onSortingChange: setSorting,
            onRowSelectionChange: setRowSelection,
            onPaginationChange: setPagination,
            getSortedRowModel: getSortedRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
          }}
        />
      </DataTableShell>
      <Pagination
        page={pagination.pageIndex + 1}
        pageSize={PAGE_SIZE}
        total={creators.length}
        onPageChange={(page) => setPagination((current) => ({ ...current, pageIndex: page - 1 }))}
      />
      <DataTableSelectionBar selectedCount={selectedCount} onClear={() => setRowSelection({})}>
        <Button variant="ghost" size="sm">
          <DownloadIcon />
          Export
        </Button>
      </DataTableSelectionBar>
    </div>
  );
}

export const CreatorsDatabase: Story = {
  render: () => <CreatorsDatabasePreview />,
};

function SelectionPreview() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    "creator-1": true,
    "creator-3": true,
    "creator-4": true,
  });
  return (
    <div className="max-w-3xl">
      <DataTableShell>
        <DataTable
          columns={[selectionColumn, ...COMPACT_CREATOR_COLUMNS]}
          data={CREATORS.slice(0, 6)}
          tableOptions={{
            getRowId: (creator) => creator.id,
            state: { rowSelection },
            onRowSelectionChange: setRowSelection,
          }}
        />
      </DataTableShell>
      <DataTableSelectionBar
        selectedCount={Object.keys(rowSelection).length}
        onClear={() => setRowSelection({})}
      >
        <Button variant="ghost" size="sm">
          <DownloadIcon />
          Export
        </Button>
      </DataTableSelectionBar>
    </div>
  );
}

export const Selection: Story = { render: () => <SelectionPreview /> };

const INLINE_CREATORS = CREATORS.slice(0, 5);

const rowSelectionColumn = {
  ...selectionColumn,
  header: () => <span className="sr-only">Selected</span>,
} as ColumnDef<Creator>;

const formatRates = (creators: Creator[]) =>
  formatUsd(creators.reduce((total, creator) => total + creator.rateUsd, 0));

function InlineSelectionBar({ selected }: { selected: Creator[] }) {
  return (
    <DataTableSelectionBar
      variant="inline"
      selectedCount={selected.length}
      totalCount={INLINE_CREATORS.length}
      onSelectAll={() => undefined}
      onClear={() => undefined}
      summary={
        selected.length > 0
          ? `${formatRates(selected)} in rates`
          : `${INLINE_CREATORS.length} can be invited together`
      }
    >
      <Button disabled={selected.length === 0}>Invite selected</Button>
    </DataTableSelectionBar>
  );
}

function InlineSelectionPreview() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    "creator-1": true,
    "creator-3": true,
  });
  const selected = INLINE_CREATORS.filter((creator) => rowSelection[creator.id]);
  return (
    <div className="flex max-w-3xl flex-col gap-3">
      <DataTableSelectionBar
        variant="inline"
        selectedCount={selected.length}
        totalCount={INLINE_CREATORS.length}
        onSelectAll={() =>
          setRowSelection(Object.fromEntries(INLINE_CREATORS.map((creator) => [creator.id, true])))
        }
        onClear={() => setRowSelection({})}
        summary={
          selected.length > 0
            ? `${formatRates(selected)} in rates`
            : `${INLINE_CREATORS.length} can be invited together`
        }
      >
        <Button disabled={selected.length === 0}>Invite selected</Button>
      </DataTableSelectionBar>
      <DataTableShell>
        <DataTable
          columns={[rowSelectionColumn, ...COMPACT_CREATOR_COLUMNS]}
          data={INLINE_CREATORS}
          tableOptions={{
            getRowId: (creator) => creator.id,
            state: { rowSelection },
            onRowSelectionChange: setRowSelection,
          }}
        />
      </DataTableShell>
    </div>
  );
}

/** `variant="inline"` above the list, which then carries select-all instead of the header: select-all, "2 of 5 selected", a summary, and the batch action. */
export const InlineSelection: Story = { render: () => <InlineSelectionPreview /> };

/** The inline bar with none, some and all selected. */
export const InlineSelectionStates: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-3">
      <InlineSelectionBar selected={[]} />
      <InlineSelectionBar selected={INLINE_CREATORS.slice(0, 2)} />
      <InlineSelectionBar selected={INLINE_CREATORS} />
    </div>
  ),
};

function SortablePreview() {
  const [sorting, setSorting] = useState<SortingState>([{ id: "followers", desc: true }]);
  return (
    <DataTableShell className="max-w-3xl">
      <DataTable
        columns={COMPACT_CREATOR_COLUMNS}
        data={CREATORS.slice(0, 6)}
        tableOptions={{
          state: { sorting },
          onSortingChange: setSorting,
          getSortedRowModel: getSortedRowModel(),
        }}
      />
    </DataTableShell>
  );
}

export const Sortable: Story = { render: () => <SortablePreview /> };

export const Loading: Story = {
  render: () => (
    <DataTableShell className="max-w-3xl">
      <DataTable columns={[selectionColumn, ...COMPACT_CREATOR_COLUMNS]} data={[]} isLoading />
    </DataTableShell>
  ),
};

export const NoResultsState: Story = {
  name: "No results",
  render: () => (
    <DataTableShell className="max-w-3xl">
      <DataTable
        columns={COMPACT_CREATOR_COLUMNS}
        data={[]}
        empty={<CreatorsNoResults onClear={() => {}} />}
      />
    </DataTableShell>
  ),
};

export const ErrorState: Story = {
  name: "Error",
  render: () => (
    <DataTableShell className="max-w-3xl">
      <DataTable
        columns={COMPACT_CREATOR_COLUMNS}
        data={[]}
        error={<LoadError onRetry={() => {}} />}
      />
    </DataTableShell>
  ),
};

function LoadMorePreview() {
  const [loadedCount, setLoadedCount] = useState(LOAD_MORE_PAGE_SIZE);
  const [isFetching, setIsFetching] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = loadedCount < CREATORS.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isFetching) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsFetching(true);
        setTimeout(() => {
          setLoadedCount((count) => count + LOAD_MORE_PAGE_SIZE);
          setIsFetching(false);
        }, LOAD_MORE_DELAY_MS);
      },
      { root: shellRef.current, rootMargin: "0px 0px 120px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  return (
    <DataTableShell ref={shellRef} className="h-96 max-w-3xl">
      <DataTable
        columns={COMPACT_CREATOR_COLUMNS}
        data={CREATORS.slice(0, loadedCount)}
        stickyHeader
      />
      {hasMore ? <LoadMoreSentinel sentinelRef={sentinelRef} isLoading={isFetching} /> : null}
    </DataTableShell>
  );
}

export const LoadMore: Story = { render: () => <LoadMorePreview /> };

export const InsideCard: Story = {
  render: () => (
    <Card className="max-w-3xl">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-medium">Top creators this month</h2>
        <span className="text-xs text-muted-foreground">By engagement</span>
      </div>
      <DataTableShell>
        <DataTable columns={COMPACT_CREATOR_COLUMNS} data={CREATORS.slice(0, 5)} />
      </DataTableShell>
    </Card>
  ),
};
