import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ColumnDef, getSortedRowModel, type SortingState } from "@tanstack/react-table";
import { Folder, MoreHorizontal, Search, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { Breadcrumb } from "../../../src/components/breadcrumb";
import { Button } from "../../../src/components/button";
import { DataTable } from "../../../src/components/data-table";
import { DataTableShell } from "../../../src/components/data-table-shell";
import { DataTableSortableHeader } from "../../../src/components/data-table-sortable-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../src/components/dropdown-menu";
import { EmptyState } from "../../../src/components/empty-state";
import { Inline } from "../../../src/components/layout";
import { MultiSelectPopover } from "../../../src/components/multi-select-popover";
import { Page, PageToolbar } from "../../../src/components/page";
import { PersonIdentity } from "../../../src/components/person-identity";
import { SearchInput } from "../../../src/components/search-input";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../../src/components/sheet";
import { SectionSpinner } from "../../../src/components/spinner";
import { Tooltip } from "../../../src/components/tooltip";
import { cn } from "../../../src/lib/utils";
import { RatingBadge, TablePlaceholder } from "../../lib/pool-display";
import {
  COLLABORATION_FILTER_OPTIONS,
  COLLABORATION_TOTAL,
  COLLABORATIONS,
  type CollaborationListItem,
  CREATOR_PROFILE,
  formatMoney,
  photoUrl,
} from "../../lib/pool-fixtures";
import { CreatorProfileInfo } from "./pool-blocks";
import { POOL_SCREEN_PARAMETERS, PoolShell, storyLink } from "./pool-shell";

type CollaborationsState = "default" | "loading" | "empty" | "noResults";

const RATING_ORDER = ["top creator", "standout", "good", "sufficient", "problematic"];

function CreatorNameCell({
  creator,
  onOpen,
}: {
  creator: CollaborationListItem["creator"];
  onOpen: () => void;
}) {
  const identity = (
    <PersonIdentity
      size="md"
      name={creator.fullName}
      imageUrl={creator.photoSeed ? photoUrl(creator.photoSeed, 80) : null}
    />
  );
  if (!creator.profileCompleted) {
    return (
      <Inline gap="xs" wrap={false}>
        {identity}
        <Tooltip content="Invitation sent. Waiting for sign-up.">
          <TriangleAlert
            aria-label="Profile incomplete"
            className="size-3.5 shrink-0 text-warning"
          />
        </Tooltip>
      </Inline>
    );
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex rounded-full text-left outline-none hover:underline underline-offset-4 focus-visible:focus-ring"
    >
      {identity}
    </button>
  );
}

const linkClassName = "truncate underline-offset-4 hover:underline";

function getColumns(onOpenCreator: (row: CollaborationListItem) => void) {
  const columns: ColumnDef<CollaborationListItem>[] = [
    {
      id: "creator",
      accessorFn: (row) => row.creator.fullName.toLocaleLowerCase(),
      header: ({ column }) => <DataTableSortableHeader label="Creator" column={column} />,
      cell: ({ row }) => (
        <CreatorNameCell
          creator={row.original.creator}
          onOpen={() => onOpenCreator(row.original)}
        />
      ),
    },
    {
      id: "client",
      accessorFn: (row) => row.clientName.toLocaleLowerCase(),
      header: ({ column }) => <DataTableSortableHeader label="Client" column={column} />,
      cell: ({ row }) =>
        storyLink(
          "/clients",
          <span className={`${linkClassName} font-medium`}>{row.original.clientName}</span>,
        ),
    },
    {
      id: "project",
      accessorFn: (row) => row.projectName.toLocaleLowerCase(),
      header: ({ column }) => <DataTableSortableHeader label="Campaign" column={column} />,
      cell: ({ row }) =>
        storyLink(
          "/clients",
          <span className={cn(linkClassName, "block max-w-40 truncate")}>
            {row.original.projectName}
          </span>,
        ),
    },
    {
      id: "overallRating",
      accessorFn: (row) => RATING_ORDER.indexOf(row.overallRating),
      header: ({ column }) => <DataTableSortableHeader label="Average grading" column={column} />,
      cell: ({ row }) => <RatingBadge rating={row.original.overallRating} />,
    },
    {
      id: "totalPaid",
      header: "Total paid",
      meta: { numeric: true },
      cell: ({ row }) =>
        row.original.totalPaid ? formatMoney(row.original.totalPaid) : <TablePlaceholder />,
    },
    {
      id: "pieces",
      header: "Pieces",
      cell: ({ row }) => row.original.piecesOfContent ?? <TablePlaceholder />,
    },
    {
      id: "closedAt",
      accessorFn: (row) => (row.closedAt ? Date.parse(row.closedAt) : 0),
      header: ({ column }) => <DataTableSortableHeader label="Closed" column={column} />,
      cell: ({ row }) => row.original.closedAt ?? <TablePlaceholder />,
    },
    {
      id: "closedBy",
      header: "Closed by",
      cell: ({ row }) =>
        row.original.closedBy ? (
          <PersonIdentity
            name={row.original.closedBy.name}
            imageUrl={row.original.closedBy.imageUrl}
          />
        ) : (
          <TablePlaceholder />
        ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      size: 48,
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="dots" aria-label="Actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return columns;
}

function CreatorPreviewSheet({
  creatorName,
  open,
  onOpenChange,
}: {
  creatorName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size="lg" showCloseButton>
        <SheetHeader>
          <SheetTitle>{creatorName}</SheetTitle>
          <SheetDescription className="sr-only">Creator profile preview</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <CreatorProfileInfo creator={CREATOR_PROFILE} />
        </SheetBody>
        <SheetFooter>
          <Button asChild className="w-full">
            <a href={`/database/${CREATOR_PROFILE.id}`}>View full profile</a>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Filters({ active }: { active: boolean }) {
  const [clientIds, setClientIds] = useState<string[]>(active ? ["Oura"] : []);
  const [campaignIds, setCampaignIds] = useState<string[]>([]);
  const [closedByIds, setClosedByIds] = useState<string[]>([]);
  const hasActiveFilters = clientIds.length + campaignIds.length + closedByIds.length > 0;
  return (
    <Inline gap="sm" wrap={false}>
      <MultiSelectPopover
        placeholder="Client"
        options={COLLABORATION_FILTER_OPTIONS.clients}
        selectedValues={clientIds}
        onChange={setClientIds}
        idPrefix="collaboration-client-filter"
      />
      <MultiSelectPopover
        placeholder="Campaign"
        options={COLLABORATION_FILTER_OPTIONS.campaigns}
        selectedValues={campaignIds}
        onChange={setCampaignIds}
        idPrefix="collaboration-project-filter"
      />
      <MultiSelectPopover
        placeholder="Closed by"
        options={COLLABORATION_FILTER_OPTIONS.closedBy}
        selectedValues={closedByIds}
        onChange={setClosedByIds}
        idPrefix="collaboration-closed-by-filter"
      />
      {hasActiveFilters ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setClientIds([]);
            setCampaignIds([]);
            setClosedByIds([]);
          }}
        >
          Clear
        </Button>
      ) : null}
    </Inline>
  );
}

function CollaborationsToolbar({
  query,
  onQueryChange,
  filtered,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  filtered: boolean;
}) {
  return (
    <PageToolbar>
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Search creator, client, campaign…"
        aria-label="Search closed collaborations"
        className="w-full sm:w-80"
      />
      <div className="sm:ml-auto">
        <Filters active={filtered} />
      </div>
    </PageToolbar>
  );
}

function CollaborationsBody({
  state,
  onOpenCreator,
}: {
  state: CollaborationsState;
  onOpenCreator: (name: string) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo(
    () => getColumns((row) => onOpenCreator(row.creator.fullName)),
    [onOpenCreator],
  );
  if (state === "empty" || state === "noResults") {
    const filtered = state === "noResults";
    return (
      <EmptyState
        icon={filtered ? Search : Folder}
        title={filtered ? "No matching closed collaborations" : "No closed collaborations yet"}
        description={
          filtered
            ? "Try adjusting your filters or search terms."
            : "Completed collaborations appear here once delivery work is closed and logged."
        }
      />
    );
  }
  return (
    <DataTableShell>
      <DataTable
        columns={columns}
        data={COLLABORATIONS}
        onRowClick={() => undefined}
        tableOptions={{
          state: { sorting },
          onSortingChange: setSorting,
          getSortedRowModel: getSortedRowModel(),
        }}
      />
    </DataTableShell>
  );
}

function Collaborations({
  state = "default",
  initialQuery = "",
  previewCreator = null,
}: {
  state?: CollaborationsState;
  initialQuery?: string;
  previewCreator?: string | null;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [openCreator, setOpenCreator] = useState<string | null>(previewCreator);

  return (
    <PoolShell
      active="Collaborations"
      header={
        <>
          <Breadcrumb page="Collaborations" />
          {state === "default" ? (
            <span className="text-sm text-muted-foreground tabular-nums">
              {COLLABORATION_TOTAL} closed collaborations
            </span>
          ) : null}
        </>
      }
    >
      <Page size="full">
        {state === "loading" ? (
          <SectionSpinner />
        ) : (
          <>
            <CollaborationsToolbar
              query={query}
              onQueryChange={setQuery}
              filtered={state === "noResults"}
            />
            <CollaborationsBody state={state} onOpenCreator={setOpenCreator} />
          </>
        )}
      </Page>
      <CreatorPreviewSheet
        creatorName={openCreator ?? ""}
        open={openCreator !== null}
        onOpenChange={(open) => !open && setOpenCreator(null)}
      />
    </PoolShell>
  );
}

const meta = {
  title: "Screens/Pool/Collaborations",
  parameters: POOL_SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Collaborations /> };

export const Loading: Story = { render: () => <Collaborations state="loading" /> };

export const Empty: Story = { render: () => <Collaborations state="empty" /> };

export const NoResults: Story = {
  render: () => <Collaborations state="noResults" initialQuery="sleep score" />,
};

/** Clicking a creator's name opens their profile preview without leaving the list. */
export const CreatorSheetOpen: Story = {
  render: () => <Collaborations previewCreator="Jade Rivera" />,
};
