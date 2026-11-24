import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Card } from "../../src/components/card";
import { Checkbox } from "../../src/components/checkbox";
import { DataTableShell } from "../../src/components/data-table-shell";
import {
  Table,
  TableBody,
  TableCell,
  TableGroupRow,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/table";
import { cn } from "../../src/lib/utils";
import {
  CreatorEngagement,
  CreatorIdentity,
  CreatorRowActions,
  CreatorStatus,
  CreatorTags,
  formatCompact,
  formatShortDate,
  formatUsd,
} from "../lib/creator-cells";
import { CREATORS, type Creator, type CreatorStatus as Status } from "../lib/creator-fixtures";
import { AnnotationCaption, getAnnotatedState, RowStateGutter } from "../lib/state-annotation";

const meta = {
  title: "Organisms/Table",
  component: Table,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

type RowState = "default" | "hover" | "focus-visible" | "selected";

// A frozen row-actions cell turns transparent on a row that is not really hovered or focused, so the
// simulated rows force its band, edge shadow and focus ring back, as a real hover or focus shows them.
const SIMULATED_ACTIVE_ROW_CLASS_NAME =
  "bg-(--table-row-hover) [&>td]:bg-(--table-row-hover)! group-data-overflow-end/table:[&>td[data-sticky=end]]:before:opacity-100! [&_[data-slot=table-row-actions]]:opacity-100";

const ROW_STATE_CLASS_NAME: Record<RowState, string | undefined> = {
  default: undefined,
  hover: SIMULATED_ACTIVE_ROW_CLASS_NAME,
  "focus-visible": cn(
    SIMULATED_ACTIVE_ROW_CLASS_NAME,
    "[&>td:last-child]:after:focus-ring-inset [&>td:last-child]:after:opacity-100!",
  ),
  selected: undefined,
};

const ROW_STATES: RowState[] = ["default", "hover", "focus-visible", "selected"];

function Annotated({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <RowStateGutter>
      <div className="flex flex-col gap-2">
        <AnnotationCaption>{caption}</AnnotationCaption>
        {children}
      </div>
    </RowStateGutter>
  );
}

function CompactCreatorsTable({
  creators,
  rowStates,
}: {
  creators: Creator[];
  rowStates?: RowState[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox aria-label="Select all rows" checked="indeterminate" />
          </TableHead>
          <TableHead className="w-1/3">Creator</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Followers</TableHead>
          <TableHead>Engagement</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {creators.map((creator, index) => {
          const rowState = rowStates?.[index] ?? "default";
          const isSelected = rowState === "selected";
          return (
            <TableRow
              key={creator.id}
              data-state={isSelected ? "selected" : undefined}
              data-annotated-state={getAnnotatedState(rowState)}
              className={ROW_STATE_CLASS_NAME[rowState]}
            >
              <TableCell>
                <Checkbox aria-label={`Select ${creator.name}`} checked={isSelected} />
              </TableCell>
              <TableCell>
                <CreatorIdentity creator={creator} />
              </TableCell>
              <TableCell>
                <CreatorStatus status={creator.status} />
              </TableCell>
              <TableCell>{formatCompact(creator.followers)}</TableCell>
              <TableCell>
                <CreatorEngagement rate={creator.engagementRate} />
              </TableCell>
              <TableCell>
                <CreatorRowActions creator={creator} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function WideCreatorRow({
  creator,
  rowState = "default",
}: {
  creator: Creator;
  rowState?: RowState;
}) {
  return (
    <TableRow
      data-state={rowState === "selected" ? "selected" : undefined}
      data-annotated-state={getAnnotatedState(rowState)}
      className={ROW_STATE_CLASS_NAME[rowState]}
    >
      <TableCell sticky="start">
        <CreatorIdentity creator={creator} />
      </TableCell>
      <TableCell className="text-muted-foreground">{creator.platform}</TableCell>
      <TableCell>{formatCompact(creator.followers)}</TableCell>
      <TableCell>
        <CreatorEngagement rate={creator.engagementRate} />
      </TableCell>
      <TableCell>{formatCompact(creator.averageViews)}</TableCell>
      <TableCell numeric>{formatUsd(creator.rateUsd)}</TableCell>
      <TableCell>
        <CreatorStatus status={creator.status} />
      </TableCell>
      <TableCell>
        <CreatorTags tags={creator.tags} />
      </TableCell>
      <TableCell className="text-muted-foreground">{creator.location}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatShortDate(creator.lastActivity)}
      </TableCell>
      <TableCell sticky="end">
        <CreatorRowActions creator={creator} />
      </TableCell>
    </TableRow>
  );
}

const WIDE_COLUMN_COUNT = 11;

function WideCreatorsTable({
  creators,
  stickyHeader,
  grouped,
  rowStates,
}: {
  creators: Creator[];
  stickyHeader?: boolean;
  rowStates?: RowState[];
  /** A `TableGroupRow` per status over the rows. */
  grouped?: boolean;
}) {
  return (
    <Table stickyHeader={stickyHeader}>
      <TableHeader>
        <TableRow>
          <TableHead sticky="start">Creator</TableHead>
          <TableHead>Platform</TableHead>
          <TableHead>Followers</TableHead>
          <TableHead>Engagement</TableHead>
          <TableHead>Avg. views</TableHead>
          <TableHead numeric>Rate</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Last activity</TableHead>
          <TableHead sticky="end">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      {grouped ? (
        GROUPS.map((group) => {
          const groupCreators = creators.filter((creator) => creator.status === group.status);
          return (
            <TableBody key={group.status}>
              <TableGroupRow colSpan={WIDE_COLUMN_COUNT} count={groupCreators.length}>
                {group.title}
              </TableGroupRow>
              {groupCreators.map((creator) => (
                <WideCreatorRow key={creator.id} creator={creator} />
              ))}
            </TableBody>
          );
        })
      ) : (
        <TableBody>
          {creators.map((creator, index) => (
            <WideCreatorRow key={creator.id} creator={creator} rowState={rowStates?.[index]} />
          ))}
        </TableBody>
      )}
    </Table>
  );
}

const GROUPS: { status: Status; title: string }[] = [
  { status: "negotiating", title: "Negotiating" },
  { status: "contacted", title: "Contacted" },
  { status: "active", title: "Active" },
];

/** One header, a `TableBody` per group led by `TableGroupRow`; Platform and Location drop below md. */
function GroupedCreatorsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">Creator</TableHead>
          <TableHead hideBelow="md">Platform</TableHead>
          <TableHead hideBelow="md">Location</TableHead>
          <TableHead>Followers</TableHead>
        </TableRow>
      </TableHeader>
      {GROUPS.map((group) => {
        const creators = CREATORS.filter((creator) => creator.status === group.status).slice(0, 3);
        return (
          <TableBody key={group.status}>
            <TableGroupRow colSpan={4} count={creators.length}>
              {group.title}
            </TableGroupRow>
            {creators.map((creator) => (
              <TableRow key={creator.id}>
                <TableCell>
                  <CreatorIdentity creator={creator} />
                </TableCell>
                <TableCell hideBelow="md" className="text-muted-foreground">
                  {creator.platform}
                </TableCell>
                <TableCell hideBelow="md" className="text-muted-foreground">
                  {creator.location}
                </TableCell>
                <TableCell>{formatCompact(creator.followers)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        );
      })}
    </Table>
  );
}

export const AllStates: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-10">
      <Annotated caption="rows: rest · hover · focus-visible · selected">
        <DataTableShell>
          <CompactCreatorsTable creators={CREATORS.slice(0, 4)} rowStates={ROW_STATES} />
        </DataTableShell>
      </Annotated>
      <Annotated caption="TableGroupRow">
        <DataTableShell>
          <GroupedCreatorsTable />
        </DataTableShell>
      </Annotated>
      <Annotated caption="frozen first column and row menu, scrolled sideways: rest · hover · selected · focus-visible">
        <DataTableShell
          className="max-w-2xl"
          ref={(node) => {
            if (node) node.scrollLeft = 160;
          }}
        >
          <WideCreatorsTable
            creators={CREATORS.slice(0, 4)}
            rowStates={["default", "hover", "selected", "focus-visible"]}
          />
        </DataTableShell>
      </Annotated>
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <DataTableShell className="max-w-3xl">
      <CompactCreatorsTable creators={CREATORS.slice(0, 6)} />
    </DataTableShell>
  ),
};

export const FrozenFirstColumn: Story = {
  render: () => (
    <DataTableShell className="max-w-3xl">
      <WideCreatorsTable creators={CREATORS.slice(0, 8)} />
    </DataTableShell>
  ),
};

export const StickyHeader: Story = {
  render: () => (
    <DataTableShell className="h-96 max-w-3xl">
      <WideCreatorsTable creators={CREATORS} stickyHeader />
    </DataTableShell>
  ),
};

export const InsideCard: Story = {
  render: () => (
    <Card className="max-w-3xl">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-medium">Top creators this month</h2>
        <span className="text-xs text-muted-foreground">By engagement</span>
      </div>
      <DataTableShell>
        <CompactCreatorsTable creators={CREATORS.slice(0, 5)} />
      </DataTableShell>
    </Card>
  ),
};

export const WithoutFrame: Story = {
  render: () => (
    <section className="flex max-w-3xl flex-col gap-3">
      <h2 className="text-base font-medium">Assigned creators</h2>
      <DataTableShell frame={false}>
        <CompactCreatorsTable creators={CREATORS.slice(0, 4)} />
      </DataTableShell>
    </section>
  ),
};

export const WithoutShell: Story = {
  render: () => (
    <div className="max-w-3xl">
      <CompactCreatorsTable creators={CREATORS.slice(0, 4)} />
    </div>
  ),
};

/** A group row per status under one header; Platform and Location use `hideBelow="md"`. */
export const GroupedRows: Story = {
  render: () => (
    <DataTableShell className="max-w-3xl">
      <GroupedCreatorsTable />
    </DataTableShell>
  ),
};

/** Group rows over a frozen first column, scrolled sideways: the group title, the header and the frozen cells keep one left edge, and the band runs to the frame. */
export const GroupedRowsWithFrozenColumn: Story = {
  render: () => (
    <DataTableShell
      className="max-w-3xl"
      ref={(node) => {
        if (node) node.scrollLeft = 160;
      }}
    >
      <WideCreatorsTable creators={CREATORS} grouped />
    </DataTableShell>
  ),
};

/** The same table on a phone: the hidden columns drop out and the group rows still span the row. */
export const GroupedRowsOnPhone: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  render: () => (
    <DataTableShell>
      <GroupedCreatorsTable />
    </DataTableShell>
  ),
};
