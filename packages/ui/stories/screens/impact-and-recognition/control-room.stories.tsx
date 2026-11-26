import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchX } from "lucide-react";
import { type ReactNode, useState } from "react";
import { DataTableShell } from "../../../src/components/data-table-shell";
import { EmptyState } from "../../../src/components/empty-state";
import { Inline, Stack } from "../../../src/components/layout";
import { Page, PageHeader, PageToolbar } from "../../../src/components/page";
import { PersonIdentity } from "../../../src/components/person-identity";
import { SearchInput } from "../../../src/components/search-input";
import { Skeleton } from "../../../src/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableGroupRow,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../src/components/table";
import { Tabs, TabsContent, TabsList } from "../../../src/components/tabs";
import { cn } from "../../../src/lib/utils";
import { HolderStatus } from "../../lib/impact-and-recognition-display";
import {
  ELIGIBILITY_GROUPS,
  type EligibilityResult,
  formatDate,
  formatDays,
  type Holder,
  LONG_WAIT_DAYS,
  PEOPLE_IN_SCOPE,
  PEOPLE_QUEUE,
  type PersonInScope,
  type QueueRow,
  ROUND,
} from "../../lib/impact-and-recognition-fixtures";
import {
  allOf,
  FilterSelect,
  GroupLabel,
  IrShell,
  KIND_FILTER,
  placeholderKeys,
  WaitAside,
} from "./parts";

type View = "open" | "eligible" | "history";

const DEPARTMENTS = ["Client Services", "Creative", "Production", "Strategy"];

/** The views over the round: the tab list, then the chosen view's filters and its tables. */
function ViewTabs({ view, children }: { view: View; children: ReactNode }) {
  const [value, setValue] = useState<string>(view);
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList
        variant="line"
        aria-label="Control Room views"
        tabs={[
          { value: "open", label: "Active" },
          { value: "eligible", label: "Eligibility" },
          { value: "history", label: "History" },
        ]}
      />
      <TabsContent value={value}>{children}</TabsContent>
    </Tabs>
  );
}

/** Search on the left, filters on the right; the Active view filters by step too. */
function Filters({ view }: { view: View }) {
  const [query, setQuery] = useState("");
  const searchLabel =
    view === "eligible" ? "Search people or managers" : "Search people or requesters";
  return (
    <PageToolbar>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={searchLabel}
        aria-label={searchLabel}
        className="w-full sm:w-auto sm:min-w-56 sm:flex-1 lg:max-w-80"
      />
      <div className="grid w-full grid-cols-2 gap-(--gap-sm) sm:ml-auto sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
        {view === "eligible" ? (
          <>
            <FilterSelect label="Department" options={allOf("All departments", DEPARTMENTS)} />
            <FilterSelect
              label="Request"
              options={[
                { value: "all", label: "Any request" },
                { value: "none", label: "No request" },
                { value: "some", label: "With a request" },
              ]}
            />
          </>
        ) : (
          <>
            <FilterSelect
              label="Step"
              options={[
                { value: "all", label: "All steps" },
                ...PEOPLE_QUEUE.map((group) => ({ value: group.key, label: group.title })),
              ]}
            />
            <FilterSelect label="Department" options={allOf("All departments", DEPARTMENTS)} />
            <FilterSelect label={KIND_FILTER.label} options={KIND_FILTER.options} />
            <FilterSelect
              label="Sort"
              options={[
                { value: "oldest", label: "Oldest first" },
                { value: "newest", label: "Newest first" },
              ]}
            />
          </>
        )}
      </div>
    </PageToolbar>
  );
}

/** Every column reads from the left, so a row never splits into a left and a right cluster. */
type Column = { key: string; label: string; width?: string };

type SheetGroup = { key: string; title: string; holder?: Holder; count: number; rows: ReactNode };

function ColumnWidths({ columns }: { columns: Column[] }) {
  return (
    <colgroup>
      {columns.map((column) => (
        <col key={column.key} style={{ width: column.width }} />
      ))}
    </colgroup>
  );
}

function SheetTable({ columns, children }: { columns: Column[]; children: ReactNode }) {
  return (
    <DataTableShell>
      <Table className="table-fixed">
        <ColumnWidths columns={columns} />
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        {children}
      </Table>
    </DataTableShell>
  );
}

/** One table under one header, a band per group. */
function SheetGroups({ columns, groups }: { columns: Column[]; groups: SheetGroup[] }) {
  return (
    <SheetTable columns={columns}>
      {groups.map((group) => (
        <TableBody key={group.key}>
          <TableGroupRow colSpan={columns.length} count={group.count}>
            <GroupLabel holder={group.holder} title={group.title} />
          </TableGroupRow>
          {group.rows}
        </TableBody>
      ))}
    </SheetTable>
  );
}

/** The person on one line; the name's link covers the row, which opens the details. */
function PersonCell({ name }: { name: string }) {
  return (
    <TableCell>
      <a
        href="#request"
        className="block min-w-0 outline-none after:absolute after:inset-0 focus-visible:after:focus-ring-inset"
      >
        <PersonIdentity name={name} size="md" className="max-sm:[&>[data-slot=avatar]]:hidden" />
      </a>
    </TableCell>
  );
}

// I&R's queue-table OPEN_COLUMNS, with its widths.
const OPEN_COLUMNS: Column[] = [
  { key: "person", label: "Person", width: "26%" },
  { key: "department", label: "Department", width: "16%" },
  { key: "request", label: "Request", width: "13%" },
  { key: "change", label: "Change", width: "11%" },
  { key: "requester", label: "Requested by", width: "21%" },
  { key: "age", label: "Waiting", width: "13%" },
];

function QueueTableRow({ row, late }: { row: QueueRow; late: boolean }) {
  return (
    <TableRow className="relative">
      <PersonCell name={row.name} />
      <TableCell className="truncate">{row.department}</TableCell>
      <TableCell>{row.kind}</TableCell>
      <TableCell className="font-medium tabular-nums">{row.change}</TableCell>
      <TableCell>
        <PersonIdentity name={row.requester} />
      </TableCell>
      <TableCell>
        <WaitAside late={late}>{formatDays(row.waitingDays)}</WaitAside>
      </TableCell>
    </TableRow>
  );
}

function QueueTable() {
  return (
    <SheetGroups
      columns={OPEN_COLUMNS}
      groups={PEOPLE_QUEUE.map((group) => ({
        key: group.key,
        title: group.title,
        holder: group.holder,
        count: group.rows.length,
        rows: group.rows.map((row) => (
          <QueueTableRow
            key={row.id}
            row={row}
            late={group.yours && row.waitingDays >= LONG_WAIT_DAYS}
          />
        )),
      }))}
    />
  );
}

const ELIGIBILITY_LABEL: Record<EligibilityResult, string> = {
  met: "Eligible",
  exception: "Eligible",
  needs_verification: "Needs verification",
  not_met: "Not eligible",
};

// I&R's eligible-people COLUMNS, with its widths.
const ELIGIBLE_COLUMNS: Column[] = [
  { key: "person", label: "Person", width: "27%" },
  { key: "department", label: "Department", width: "17%" },
  { key: "manager", label: "Manager", width: "22%" },
  { key: "eligibility", label: "Eligibility", width: "16%" },
  { key: "request", label: "Request", width: "18%" },
];

function EligibleRow({ entry }: { entry: PersonInScope }) {
  return (
    <TableRow className="relative">
      <PersonCell name={entry.name} />
      <TableCell className="truncate">{entry.department}</TableCell>
      <TableCell>
        <PersonIdentity name={entry.manager} />
      </TableCell>
      <TableCell
        className={cn("truncate", entry.eligibility === "needs_verification" && "font-medium")}
      >
        {ELIGIBILITY_LABEL[entry.eligibility]}
      </TableCell>
      <TableCell>
        {entry.request ? (
          <HolderStatus status={entry.request} />
        ) : (
          <span className="text-muted-foreground">No request</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function EligibleTable() {
  const byName = (first: PersonInScope, second: PersonInScope) =>
    first.name.localeCompare(second.name);
  return (
    <SheetGroups
      columns={ELIGIBLE_COLUMNS}
      groups={ELIGIBILITY_GROUPS.map((group) => {
        const people = PEOPLE_IN_SCOPE.filter((entry) =>
          group.states.includes(entry.eligibility),
        ).toSorted(byName);
        return {
          key: group.key,
          title: group.title,
          count: people.length,
          rows: people.map((entry) => <EligibleRow key={entry.name} entry={entry} />),
        };
      })}
    />
  );
}

function ControlRoom({
  view,
  children,
  loading,
}: {
  view: View;
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <IrShell viewer="people" active="Control Room">
      <Page aria-busy={loading || undefined}>
        <PageHeader
          title="Control Room"
          description={
            view === "eligible"
              ? `Everyone in scope for the ${ROUND.name}, checked against the rules at ${formatDate(ROUND.effective)}.`
              : `Every request in the ${ROUND.name}, from verification to Deel.`
          }
        />
        <ViewTabs view={view}>
          <Stack gap="md">
            <Filters view={view} />
            {children}
          </Stack>
        </ViewTabs>
      </Page>
    </IrShell>
  );
}

const meta = {
  title: "Screens/Impact and Recognition/Control Room",
  // I&R is the only app on the Fieldtrip colours (its globals.css imports fieldtrip.css).
  globals: { brand: "fieldtrip" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** People's queue in one table, a band per step in order; a long wait on People's own step is flagged. */
export const Default: Story = {
  render: () => (
    <ControlRoom view="open">
      <QueueTable />
    </ControlRoom>
  ),
};

/** The Eligibility view: everyone in scope, needing verification first, with any request they have. */
export const Eligibility: Story = {
  render: () => (
    <ControlRoom view="eligible">
      <EligibleTable />
    </ControlRoom>
  ),
};

export const Loading: Story = {
  render: () => (
    <ControlRoom view="open" loading>
      <SheetTable columns={OPEN_COLUMNS}>
        <TableBody>
          {placeholderKeys(6).map((key) => (
            <TableRow key={key} data-placeholder>
              {OPEN_COLUMNS.map((column) => (
                <TableCell key={column.key}>
                  {column.key === "person" ? (
                    <Inline gap="sm" wrap={false}>
                      <Skeleton className="size-8 rounded-full" />
                      <Skeleton className="h-3.5 w-32" />
                    </Inline>
                  ) : (
                    <Skeleton className="h-3.5 w-20" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </SheetTable>
    </ControlRoom>
  ),
};

export const Empty: Story = {
  render: () => (
    <ControlRoom view="open">
      <EmptyState
        title="No open requests"
        description={`Nothing is waiting in the ${ROUND.name}.`}
      />
    </ControlRoom>
  ),
};

/** Filters that match nothing offer to clear them. */
export const NoMatch: Story = {
  render: () => (
    <ControlRoom view="open">
      <EmptyState
        icon={SearchX}
        title="No requests match"
        description="Try another search or clear the filters."
        action={{ label: "Clear filters", variant: "outline", href: "#clear" }}
      />
    </ControlRoom>
  ),
};
