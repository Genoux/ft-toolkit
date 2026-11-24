import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inbox, Plus } from "lucide-react";
import { Button } from "../../../src/components/button";
import { EmptyState } from "../../../src/components/empty-state";
import { Page, PageHeader } from "../../../src/components/page";
import {
  closedCases,
  formatDate,
  formatShortDate,
  type IrRequest,
  MY_REQUESTS,
  noor,
  PAST_ROUND_REQUESTS,
  ROUND,
  requesterAside,
  requesterGroups,
} from "./fixtures";
import {
  type CaseColumn,
  CaseTable,
  CaseTableLoading,
  changeColumn,
  departmentColumn,
  IrShell,
  isLate,
  ListFilters,
  personColumn,
  requestColumn,
  sized,
  WaitAside,
} from "./parts";

const DESCRIPTION = `Your requests in the ${ROUND.name}, by whose turn it is. Requests close ${formatDate(ROUND.submitBy)}.`;

const NEW_REQUEST = (
  <Button>
    <Plus />
    New request
  </Button>
);

function Filters({ count }: { count: number }) {
  return (
    <ListFilters
      searchLabel="Search people"
      action={NEW_REQUEST}
      filters={[
        {
          label: "Round",
          options: [
            { value: "round", label: `This round (${count})` },
            { value: "all", label: `All rounds (${count + PAST_ROUND_REQUESTS})` },
          ],
        },
      ]}
    />
  );
}

/** On the requester's turn the deadline or the wait, otherwise who holds it, or when it closed. */
const waitingColumn: CaseColumn = {
  key: "waiting",
  label: "Waiting",
  hideBelow: "sm",
  cell: (entry: IrRequest, yours: boolean) => (
    <WaitAside late={isLate(entry, yours)}>{requesterAside(entry)}</WaitAside>
  ),
};

/** The viewer's own list: every request is theirs, so there is no Requested by column (as in I&R). */
const COLUMNS = [
  sized(personColumn, "w-[32%]"),
  sized(departmentColumn, "w-[18%]"),
  sized(requestColumn, "w-[15%]"),
  sized(changeColumn, "w-[12%]"),
  waitingColumn,
];

function RequestsInbox({ cases }: { cases: IrRequest[] }) {
  return (
    <IrShell viewer="manager" active="My requests">
      <Page>
        <PageHeader title="My requests" description={DESCRIPTION} />
        <Filters count={cases.length} />
        <CaseTable columns={COLUMNS} groups={requesterGroups(cases)} closed={closedCases(cases)} />
      </Page>
    </IrShell>
  );
}

function LoadingInbox() {
  return (
    <IrShell viewer="manager" active="My requests">
      <Page aria-busy>
        <PageHeader title="My requests" description={DESCRIPTION} />
        <Filters count={0} />
        <CaseTableLoading columns={COLUMNS} />
      </Page>
    </IrShell>
  );
}

function EmptyInbox() {
  return (
    <IrShell viewer="manager" active="My requests">
      <Page>
        <PageHeader title="My requests" description={DESCRIPTION} />
        <EmptyState
          icon={Inbox}
          title="No requests yet"
          description={`Request an increase or a promotion for someone on your team. This round takes requests until ${formatShortDate(ROUND.submitBy)}.`}
          action={{ label: "New request", icon: Plus, variant: "default", href: "#new" }}
        />
      </Page>
    </IrShell>
  );
}

const meta = {
  title: "Screens/Impact and Recognition/Requests inbox",
  // I&R is the only app on the Fieldtrip colours (its globals.css imports fieldtrip.css).
  globals: { brand: "fieldtrip" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A Manager's requests in one table, a band per turn (theirs first), then the closed ones folded. */
export const Default: Story = { render: () => <RequestsInbox cases={MY_REQUESTS} /> };

export const Loading: Story = { render: () => <LoadingInbox /> };

/** Nothing in an open round: the empty state carries the action. */
export const Empty: Story = { render: () => <EmptyInbox /> };

/** A request on the requester's own turn for a week or more is flagged on its wait. */
export const Overdue: Story = {
  render: () => (
    <RequestsInbox
      cases={MY_REQUESTS.map((entry) =>
        entry.id === noor.id ? { ...entry, waitingDays: 9 } : entry,
      )}
    />
  ),
};
