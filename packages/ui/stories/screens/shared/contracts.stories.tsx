import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { Clock, Download, MoreHorizontal, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, AppShellNav, AppShellTitle } from "../../../src/components/app-shell";
import { Badge } from "../../../src/components/badge";
import { Button } from "../../../src/components/button";
import { DataTable } from "../../../src/components/data-table";
import { DataTableShell } from "../../../src/components/data-table-shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../src/components/dropdown-menu";
import { EmptyState } from "../../../src/components/empty-state";
import { Stack } from "../../../src/components/layout";
import { NavUser } from "../../../src/components/nav-user";
import { Page, PageHeader, PageToolbar } from "../../../src/components/page";
import { SearchInput } from "../../../src/components/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../src/components/select";
import { Spinner } from "../../../src/components/spinner";
import { StatusDot } from "../../../src/components/status-dot";
import { useActiveTitle } from "../../lib/app-fixtures";
import {
  CONTRACTS,
  CONTRACTS_ACCESS,
  CONTRACTS_USER,
  type Contract,
  type ContractStatus,
  type Entity,
} from "./fixtures";

const NAV = [
  { title: "Contracts", href: "/" },
  { title: "Escalations", href: "/escalations" },
  { title: "Templates", href: "/templates" },
  { title: "Parameters", href: "/parameters" },
];

const ENTITIES: Entity[] = ["inBeat", "Creative Milkshake", "Content Allies", "AAG"];

const STATUS_BADGE: Record<
  ContractStatus,
  { label: string; variant: "secondary" | "info" | "warning" | "success" | "outline" }
> = {
  draft: { label: "Draft", variant: "outline" },
  in_review: { label: "In review", variant: "info" },
  escalated: { label: "Escalated", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  signed: { label: "Signed", variant: "secondary" },
};

function ReviewCell({ contract }: { contract: Contract }) {
  if (contract.review === "within") return <StatusDot tone="success" label="Within parameters" />;
  if (contract.review === "outside")
    return <StatusDot tone="destructive" label="Outside parameters" />;
  return <StatusDot label="Claude reviewing" pulse />;
}

function EscalationClock({ hoursLeft }: { hoursLeft?: number }) {
  if (hoursLeft === undefined) return <span className="text-subtle-foreground">—</span>;
  if (hoursLeft < 0) return <StatusDot tone="destructive" label={`${-hoursLeft}h over 48h`} />;
  return <StatusDot tone={hoursLeft <= 12 ? "warning" : "neutral"} label={`${hoursLeft}h left`} />;
}

const COLUMNS: ColumnDef<Contract>[] = [
  {
    id: "contract",
    header: "Contract",
    cell: ({ row }) => (
      <Stack gap="none">
        <span className="font-medium">{row.original.counterparty}</span>
        <span className="text-xs text-subtle-foreground tabular-nums">
          {row.original.id} · {row.original.template}
        </span>
      </Stack>
    ),
  },
  { accessorKey: "entity", header: "Entity" },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const badge = STATUS_BADGE[row.original.status];
      return <Badge variant={badge.variant}>{badge.label}</Badge>;
    },
  },
  {
    id: "review",
    header: "Claude review",
    cell: ({ row }) => <ReviewCell contract={row.original} />,
  },
  {
    id: "clock",
    header: "Escalation",
    cell: ({ row }) => <EscalationClock hoursLeft={row.original.escalationHoursLeft} />,
  },
  { accessorKey: "updated", header: "Updated" },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="dots" aria-label={`Actions for ${row.original.id}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Download />
            Download .docx
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function ProposedContractsList() {
  const { markActive, renderLink } = useActiveTitle("Contracts");
  const [query, setQuery] = useState("");
  const [entity, setEntity] = useState("all");
  const visibleContracts = useMemo(
    () =>
      CONTRACTS.filter(
        (contract) =>
          (entity === "all" || contract.entity === entity) &&
          `${contract.counterparty} ${contract.id}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, entity],
  );

  return (
    <AppShell
      layout="topbar"
      topbarBrand={<AppShellTitle>Contracts</AppShellTitle>}
      topbarNav={<AppShellNav items={markActive(NAV)} renderLink={renderLink} />}
      topbarActions={<NavUser {...CONTRACTS_USER} variant="avatar" onSignOut={() => undefined} />}
    >
      <Page>
        <PageHeader title="Contracts" />
        <Stack gap="md">
          <PageToolbar>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search counterparty or ID"
              aria-label="Search contracts"
            />
            <Select value={entity} onValueChange={setEntity}>
              <SelectTrigger aria-label="Entity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All entities</SelectItem>
                {ENTITIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PageToolbar>
          <DataTableShell>
            <DataTable
              columns={COLUMNS}
              data={visibleContracts}
              onRowClick={() => undefined}
              empty={
                <EmptyState
                  icon={SearchX}
                  title="No contracts match"
                  description="Try another counterparty, or clear the filters."
                />
              }
            />
          </DataTableShell>
        </Stack>
      </Page>
    </AppShell>
  );
}

const meta = {
  title: "Screens/Shared/Contracts",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** What Fieldtrip Contracts' home page renders today: a stub with the app name, the signed-in role and entity, and Clerk's user button. */
export const Default: Story = {
  render: () => (
    <Page asChild size="centered">
      <main>
        <h1 className="text-title font-semibold">Fieldtrip Contracts</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {CONTRACTS_ACCESS.role} · {CONTRACTS_ACCESS.entity}
        </p>
        <NavUser {...CONTRACTS_USER} variant="avatar" onSignOut={() => undefined} />
      </main>
    </Page>
  ),
};

/** The app's loading.tsx: one spinner in the middle of the page. */
export const Loading: Story = {
  render: () => (
    <Page asChild size="centered">
      <main>
        <Spinner label="Loading" />
      </main>
    </Page>
  ),
};

/** Signed in without a role (or a non-admin without an entity): the proxy sends the user here and nowhere else. */
export const Waiting: Story = {
  render: () => (
    <Page asChild size="centered">
      <main>
        <EmptyState
          icon={Clock}
          title="Waiting for access"
          description="An admin needs to give you a role before you can use Fieldtrip Contracts."
        />
        <Button variant="outline">Sign out</Button>
      </main>
    </Page>
  ),
};

/**
 * PROPOSAL, not built: the app has no contracts list yet. Only what the app's AGENTS.md
 * describes is here: the four group entities (admins read across them), contracts made from
 * templates, Claude's first pass against the parameters, the 48-hour escalation clock for
 * anything outside them, and Word downloads. The top bar, columns, filters and every value are
 * invented to show the toolkit on this domain.
 */
export const ProposedList: Story = {
  name: "Proposed list (not built)",
  render: () => <ProposedContractsList />,
};
