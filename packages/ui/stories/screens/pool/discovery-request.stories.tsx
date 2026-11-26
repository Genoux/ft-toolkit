import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ChevronDown, InfoIcon, MoreHorizontal, PlusIcon, UsersIcon } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Breadcrumb } from "../../../src/components/breadcrumb";
import { Button } from "../../../src/components/button";
import { DataTable, getSelectionColumn } from "../../../src/components/data-table";
import { DataTableShell } from "../../../src/components/data-table-shell";
import { DescriptionItem, DescriptionList } from "../../../src/components/description-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../src/components/dropdown-menu";
import { EmptyState } from "../../../src/components/empty-state";
import { IconButton } from "../../../src/components/icon-button";
import { Inline } from "../../../src/components/layout";
import { MemberAvatarStack } from "../../../src/components/member-avatar-stack";
import { Page, PageSection } from "../../../src/components/page";
import { PersonAvatar, PersonIdentity } from "../../../src/components/person-identity";
import { Progress } from "../../../src/components/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../src/components/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetSection,
  SheetTitle,
  SheetTrigger,
} from "../../../src/components/sheet";
import { SectionSpinner } from "../../../src/components/spinner";
import { Tooltip } from "../../../src/components/tooltip";
import {
  DISCOVERY_STATUS_TONE,
  DiscoveryStatusDot,
  PriorityBadge,
  TablePlaceholder,
} from "../../lib/pool-display";
import {
  DISCOVERY_APPROVAL_STATUS_LABELS,
  DISCOVERY_REQUEST_DETAIL,
  DISCOVERY_STATUS_LABELS,
  DISCOVERY_STATUSES,
  type DiscoveryApprovalStatus,
  type DiscoveryStatus,
  SOURCED_PROFILES,
  type SourcedProfile,
} from "../../lib/pool-fixtures";
import { APPROVAL_TONE, LinkText, PlatformLinks } from "./pool-blocks";
import { breadcrumbLink, POOL_SCREEN_PARAMETERS, PoolShell } from "./pool-shell";

type Request = typeof DISCOVERY_REQUEST_DETAIL;

const requestTitle = (request: Request) =>
  `${request.clientName ?? "Proposal"} · ${request.deadline ?? "No deadline"}`;

const textCell = (value: string | null) =>
  value ? <span className="block max-w-48 truncate">{value}</span> : <TablePlaceholder />;

function RowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dots" aria-label="Actions">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const SOURCED_PROFILE_COLUMNS: ColumnDef<SourcedProfile>[] = [
  getSelectionColumn<SourcedProfile>({
    getRowLabel: (row) => `Select ${row.original.fullName ?? row.original.email ?? "profile"}`,
  }),
  {
    id: "name",
    header: "First name",
    size: 160,
    meta: { sticky: "start" },
    cell: ({ row }) =>
      row.original.fullName ? (
        <span className="block max-w-56 truncate font-medium">{row.original.fullName}</span>
      ) : (
        <TablePlaceholder />
      ),
  },
  { id: "email", header: "Email", cell: ({ row }) => textCell(row.original.email) },
  {
    id: "profiles",
    header: "Profiles",
    cell: ({ row }) =>
      row.original.channels.length > 0 ? (
        <PlatformLinks channels={row.original.channels} />
      ) : (
        <TablePlaceholder />
      ),
  },
  {
    id: "portfolio",
    header: "Portfolio",
    cell: ({ row }) => <LinkText url={row.original.portfolioUrl} />,
  },
  {
    id: "speakingContent",
    header: "Speaking content",
    cell: ({ row }) => <LinkText url={row.original.sampleContentUrl} />,
  },
  { id: "location", header: "Location", cell: ({ row }) => textCell(row.original.location) },
  { id: "source", header: "Source", cell: ({ row }) => textCell(row.original.source) },
  {
    id: "discoveredBy",
    header: "Discovered by",
    cell: ({ row }) =>
      row.original.discoveredBy ? (
        <Tooltip content={row.original.discoveredBy.name}>
          <span className="inline-flex">
            <PersonAvatar
              name={row.original.discoveredBy.name}
              imageUrl={row.original.discoveredBy.imageUrl}
            />
          </span>
        </Tooltip>
      ) : (
        <TablePlaceholder />
      ),
  },
  {
    id: "createdAt",
    header: "Date added",
    cell: ({ row }) => <span className="tabular-nums">{row.original.createdAt}</span>,
  },
  {
    id: "approval",
    header: "Approval",
    cell: ({ row }) => (
      <ApprovalSelect
        status={row.original.approvalStatus}
        name={row.original.fullName ?? row.original.email ?? "this profile"}
      />
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    size: 48,
    meta: { sticky: "end" },
    cell: () => <RowActions />,
  },
];

function StatusSelect({ status }: { status: DiscoveryStatus }) {
  const [value, setValue] = useState<DiscoveryStatus>(status);
  return (
    <Select value={value} onValueChange={(next) => setValue(next as DiscoveryStatus)}>
      <SelectTrigger
        variant="badge"
        size="lg"
        tone={DISCOVERY_STATUS_TONE[value]}
        aria-label="Status"
      >
        <SelectValue>{DISCOVERY_STATUS_LABELS[value]}</SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {DISCOVERY_STATUSES.map((option) => (
          <SelectItem key={option} value={option}>
            <DiscoveryStatusDot status={option} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const APPROVAL_STATUSES = Object.keys(
  DISCOVERY_APPROVAL_STATUS_LABELS,
) as DiscoveryApprovalStatus[];

function ApprovalSelect({ status, name }: { status: DiscoveryApprovalStatus; name: string }) {
  const [value, setValue] = useState<DiscoveryApprovalStatus>(status);
  return (
    <Select value={value} onValueChange={(next) => setValue(next as DiscoveryApprovalStatus)}>
      <SelectTrigger
        variant="badge"
        tone={APPROVAL_TONE[value]}
        aria-label={`Approval for ${name}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {APPROVAL_STATUSES.map((option) => (
          <SelectItem key={option} value={option}>
            {DISCOVERY_APPROVAL_STATUS_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// The sheet reads as titled sections, one framed list each; Pool's untitled boxes and the loose
// history rows after them are an app-layout change at migration.
function RequestFacts({ request }: { request: Request }) {
  return (
    <>
      <SheetSection title="Request">
        <DescriptionList align="end" frame divided>
          <DescriptionItem label="Priority">
            {request.priority && <PriorityBadge priority={request.priority} />}
          </DescriptionItem>
          <DescriptionItem label={request.assignees.length === 1 ? "Assignee" : "Assignees"}>
            <MemberAvatarStack members={request.assignees} showNames emptyLabel="Unassigned" />
          </DescriptionItem>
          <DescriptionItem label="Request date">{request.createdAt}</DescriptionItem>
          <DescriptionItem label="Deadline">{request.deadline}</DescriptionItem>
          <DescriptionItem label="Requested by">
            {request.author && (
              <PersonIdentity name={request.author.name} imageUrl={request.author.imageUrl} />
            )}
          </DescriptionItem>
          <DescriptionItem label="Completed">{request.completedAt}</DescriptionItem>
        </DescriptionList>
      </SheetSection>
      <SheetSection title="Scope">
        <DescriptionList align="end" frame divided>
          <DescriptionItem label="Platforms">{request.platforms.join(", ")}</DescriptionItem>
          <DescriptionItem label="Tier">{request.tiers.join(", ")}</DescriptionItem>
          <DescriptionItem label="Contact details">
            {request.contactDetails.join(", ")}
          </DescriptionItem>
          <DescriptionItem label="Personas / Topics">{request.personasTopics}</DescriptionItem>
          <DescriptionItem label="Deliverables">{request.deliverables}</DescriptionItem>
        </DescriptionList>
      </SheetSection>
      <SheetSection title="Context">
        <DescriptionList align="end" frame divided>
          <DescriptionItem label="Discovery brief">
            {request.briefUrl && <LinkText url={request.briefUrl} />}
          </DescriptionItem>
          <DescriptionItem label="Notes / Context" layout="stacked">
            {request.notes}
          </DescriptionItem>
          <DescriptionItem label="Blacklist / No-go content" layout="stacked">
            {request.blacklist}
          </DescriptionItem>
          <DescriptionItem label="References" layout="stacked">
            {request.references}
          </DescriptionItem>
        </DescriptionList>
      </SheetSection>
    </>
  );
}

function RequestDetailsSheet({ request, defaultOpen }: { request: Request; defaultOpen: boolean }) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>
        <IconButton label="Request details" variant="secondary" size="icon-sm">
          <InfoIcon />
        </IconButton>
      </SheetTrigger>
      <SheetContent side="right" size="md" showCloseButton>
        <SheetHeader>
          <SheetTitle>{request.clientName ?? "Proposal"}</SheetTitle>
          <SheetDescription className="sr-only">Request details</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <SheetSection
            title="Progress"
            aside={`${request.profilesFound} / ${request.profilesToSource} profiles`}
          >
            <Progress
              value={Math.min(100, (request.profilesFound / request.profilesToSource) * 100)}
              aria-label="Profiles sourced"
            />
          </SheetSection>
          <RequestFacts request={request} />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

// toolkit-gap: PageSection has no slot for a bulk-action bar that takes the title's place while rows
// are selected (Pool's sourced profiles); the swapped row borrows the section header's slot and rhythm.
function SourcedProfilesSection({
  count,
  selection,
  actions,
  children,
}: {
  count: number;
  selection: ReactNode;
  actions: ReactNode;
  children: ReactNode;
}) {
  if (!selection) {
    return (
      <PageSection
        title="Sourced profiles"
        meta={`${count} ${count === 1 ? "profile" : "profiles"}`}
        actions={actions}
      >
        {children}
      </PageSection>
    );
  }
  return (
    <PageSection aria-label="Sourced profiles">
      <Inline data-slot="page-section-header" justify="between" gap="md" wrap={false}>
        {selection}
        <Inline gap="sm" wrap={false}>
          {actions}
        </Inline>
      </Inline>
      {children}
    </PageSection>
  );
}

function RequestHeaderMenu({ canExport }: { canExport: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dots" aria-label="Actions">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled={!canExport}>Export</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SelectionToolbar({ count, onClear }: { count: number; onClear: () => void }) {
  return (
    <Inline gap="sm">
      <span className="pr-1 text-sm font-medium tabular-nums">{count} selected</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            Actions
            <ChevronDown data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Approve</DropdownMenuItem>
          <DropdownMenuItem>Reject</DropdownMenuItem>
          <DropdownMenuItem>Pending</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="secondary" size="sm">
        Export
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear
      </Button>
    </Inline>
  );
}

function DiscoveryRequest({
  profiles = SOURCED_PROFILES,
  loading = false,
  initialSelection = {},
  detailsOpen = false,
}: {
  profiles?: SourcedProfile[];
  loading?: boolean;
  initialSelection?: RowSelectionState;
  detailsOpen?: boolean;
}) {
  const request = DISCOVERY_REQUEST_DETAIL;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialSelection);
  const selectedCount = Object.values(rowSelection).filter(Boolean).length;
  const tableOptions = useMemo(
    () => ({
      getRowId: (profile: SourcedProfile) => profile.id,
      state: { rowSelection },
      onRowSelectionChange: setRowSelection,
    }),
    [rowSelection],
  );

  return (
    <PoolShell
      active="Discovery"
      header={
        <>
          <Breadcrumb
            links={loading ? [] : [{ label: "Discovery", href: "/discovery" }]}
            page={loading ? "Discovery" : requestTitle(request)}
            renderLink={breadcrumbLink}
          />
          {loading ? null : <RequestHeaderMenu canExport={profiles.length > 0} />}
        </>
      }
    >
      <Page size="full">
        {loading ? (
          <SectionSpinner />
        ) : (
          <SourcedProfilesSection
            count={profiles.length}
            selection={
              selectedCount > 0 ? (
                <SelectionToolbar count={selectedCount} onClear={() => setRowSelection({})} />
              ) : null
            }
            actions={
              <>
                <StatusSelect status={request.status} />
                <RequestDetailsSheet request={request} defaultOpen={detailsOpen} />
                <IconButton label="Add profile" size="icon-sm">
                  <PlusIcon />
                </IconButton>
              </>
            }
          >
            {profiles.length === 0 ? (
              <EmptyState
                icon={UsersIcon}
                title="No sourced profiles yet"
                description="Add the creators you sourced for this request, or paste them from your sheet."
                action={{ label: "Add profiles", onClick: () => undefined }}
              />
            ) : (
              <DataTableShell>
                <DataTable
                  columns={SOURCED_PROFILE_COLUMNS}
                  data={profiles}
                  tableOptions={tableOptions}
                />
              </DataTableShell>
            )}
          </SourcedProfilesSection>
        )}
      </Page>
    </PoolShell>
  );
}

const meta = {
  title: "Screens/Pool/Discovery request",
  parameters: POOL_SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DiscoveryRequest /> };

export const Loading: Story = { render: () => <DiscoveryRequest loading /> };

export const Empty: Story = { render: () => <DiscoveryRequest profiles={[]} /> };

/** Selecting profiles swaps the heading for the bulk actions: set their approval in one go, or export them. */
export const Selection: Story = {
  render: () => (
    <DiscoveryRequest initialSelection={{ "sp-02": true, "sp-03": true, "sp-06": true }} />
  ),
};

/** The request's brief opens in a right-side sheet so the table keeps the full width. */
export const DetailsOpen: Story = { render: () => <DiscoveryRequest detailsOpen /> };
