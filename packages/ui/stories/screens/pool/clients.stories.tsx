import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ColumnDef, getSortedRowModel, type SortingState } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../../src/components/badge";
import { Breadcrumb } from "../../../src/components/breadcrumb";
import { DataTable } from "../../../src/components/data-table";
import { DataTableShell } from "../../../src/components/data-table-shell";
import { DataTableSortableHeader } from "../../../src/components/data-table-sortable-header";
import { EmptyState } from "../../../src/components/empty-state";
import { IconButton } from "../../../src/components/icon-button";
import { MemberAvatarStack } from "../../../src/components/member-avatar-stack";
import { Page } from "../../../src/components/page";
import { RecordCardMark } from "../../../src/components/record-card";
import { SectionSpinner } from "../../../src/components/spinner";
import { STAFF, type StaffMember } from "./fixtures";
import { campaignCount } from "./pool-blocks";
import { POOL_SCREEN_PARAMETERS, PoolShell } from "./pool-shell";

// Pool's ClientListItem (src/features/clients/types); the list shows name, members and projectCount.
type ClientListItem = {
  id: string;
  name: string;
  projectCount: number;
  members: StaffMember[];
};

const CLIENTS: ClientListItem[] = [
  {
    id: "cl-glossier",
    name: "Glossier",
    projectCount: 4,
    members: [STAFF.camille, STAFF.lucas, STAFF.maya, STAFF.priya, STAFF.theo],
  },
  { id: "cl-oatly", name: "Oatly", projectCount: 3, members: [STAFF.maya, STAFF.theo] },
  { id: "cl-allbirds", name: "Allbirds", projectCount: 2, members: [STAFF.priya] },
  { id: "cl-cosequin", name: "Cosequin", projectCount: 1, members: [STAFF.camille, STAFF.lucas] },
  { id: "cl-liquid-death", name: "Liquid Death", projectCount: 1, members: [] },
  { id: "cl-ritual", name: "Ritual", projectCount: 0, members: [] },
  { id: "cl-oura", name: "Oura", projectCount: 2, members: [STAFF.theo, STAFF.priya] },
  { id: "cl-athletic-brewing", name: "Athletic Brewing", projectCount: 1, members: [STAFF.maya] },
  { id: "cl-nutramax", name: "Nutramax", projectCount: 3, members: [STAFF.lucas, STAFF.camille] },
];

// Pool's clients-list-columns. Three short columns: the client column is capped and Campaigns, last,
// takes the rest, so the free width sits at the row's end instead of between the name and the team.
const CLIENT_COLUMNS: ColumnDef<ClientListItem>[] = [
  {
    id: "client",
    accessorFn: (client) => client.name.toLocaleLowerCase(),
    header: ({ column }) => <DataTableSortableHeader label="Client" column={column} />,
    meta: { headerClassName: "w-2/5", cellClassName: "w-2/5" },
    cell: ({ row }) => (
      <span className="flex min-w-0 items-center gap-(--gap-md)">
        <RecordCardMark name={row.original.name} size="md" />
        <span className="truncate font-medium">{row.original.name}</span>
      </span>
    ),
  },
  {
    id: "team",
    header: "Team",
    meta: { headerClassName: "w-1/4", cellClassName: "w-1/4" },
    cell: ({ row }) => <MemberAvatarStack members={row.original.members} emptyLabel="No team" />,
  },
  {
    id: "campaigns",
    header: "Campaigns",
    cell: ({ row }) => (
      <Badge variant="secondary" className="tabular-nums">
        {campaignCount(row.original.projectCount)}
      </Badge>
    ),
  },
];

function ClientsTable({ clients }: { clients: ClientListItem[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "client", desc: false }]);
  return (
    <DataTableShell>
      <DataTable
        columns={CLIENT_COLUMNS}
        data={clients}
        emptyMessage="No clients match your search."
        tableClassName="table-fixed"
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

function Clients({
  clients = CLIENTS,
  loading = false,
}: {
  clients?: ClientListItem[];
  loading?: boolean;
}) {
  return (
    <PoolShell
      active="Clients"
      header={
        <>
          <Breadcrumb page="Clients" />
          <IconButton label="Add client" variant="ghost" size="icon-sm">
            <PlusIcon />
          </IconButton>
        </>
      }
    >
      <Page fill={loading || clients.length === 0}>
        {loading ? (
          <SectionSpinner />
        ) : clients.length > 0 ? (
          <ClientsTable clients={clients} />
        ) : (
          <EmptyState
            title="No clients yet"
            description="Create a client to start adding campaigns."
            action={{ label: "Create client", onClick: () => undefined }}
          />
        )}
      </Page>
    </PoolShell>
  );
}

const meta = {
  title: "Screens/Pool/Clients",
  parameters: POOL_SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every client in one sortable table: its initial and name, the team on it and its campaign count. */
export const Default: Story = { render: () => <Clients /> };

export const Empty: Story = { render: () => <Clients clients={[]} /> };

export const Loading: Story = { render: () => <Clients loading /> };
