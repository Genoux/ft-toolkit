import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "../../../src/components/button";
import { CardSection } from "../../../src/components/card";
import { Checkbox } from "../../../src/components/checkbox";
import { DataTableSelectionBar } from "../../../src/components/data-table-selection-bar";
import { DescriptionItem, DescriptionList } from "../../../src/components/description-list";
import { EmptyState } from "../../../src/components/empty-state";
import { Field, FieldDescription, FieldLabel } from "../../../src/components/field";
import { InfoHint } from "../../../src/components/info-hint";
import { Inline } from "../../../src/components/layout";
import { Page, PageHeader } from "../../../src/components/page";
import { PersonIdentity } from "../../../src/components/person-identity";
import { Textarea } from "../../../src/components/textarea";
import { ApprovalDialog } from "./approval-dialog";
import { CaseDetail, CaseDetailLoading, PanelActions, PanelNotice } from "./case-detail";
import {
  AISHA_BUDGET,
  aisha,
  annualCost,
  BLOCKER_LABEL,
  byDepartment,
  effectiveYearCost,
  FINANCE_APPROVED,
  FINANCE_QUEUE,
  type FinanceRow,
  formatDate,
  formatDays,
  formatIncrease,
  formatMoney,
  formatShortDate,
  type IrRequest,
  nadia,
  type Pay,
  ROUND,
} from "./fixtures";
import {
  allOf,
  type CaseColumn,
  CaseTable,
  type CaseTableGroup,
  CaseTableLoading,
  changeColumn,
  IrShell,
  KIND_FILTER,
  ListFilters,
  PanelSection,
  personColumn,
  requestColumn,
  requesterColumn,
  sized,
} from "./parts";

const ready = FINANCE_QUEUE.filter((row) => !row.blocker);

const rowsById = new Map(FINANCE_QUEUE.map((row) => [row.request.id, row]));

/** Approved, a blocker, a change since the last batch, or how long it has waited. */
function asideFor(request: IrRequest) {
  if (request.status === "approved") {
    return (
      <span className="text-sm text-muted-foreground">
        Approved {formatShortDate(request.closedOn ?? "")}
      </span>
    );
  }
  const row = rowsById.get(request.id);
  if (row?.blocker) {
    return (
      <span
        className={
          row.blocker === "over_budget"
            ? "text-sm text-warning-foreground"
            : "text-sm text-muted-foreground"
        }
      >
        {BLOCKER_LABEL[row.blocker]}
      </span>
    );
  }
  if (row?.changed) return <span className="text-sm text-info-foreground">Changed</span>;
  return (
    <span className="text-sm text-muted-foreground">{formatDays(request.waitingDays ?? 0)}</span>
  );
}

const waitingColumn: CaseColumn = {
  key: "waiting",
  label: "Waiting",
  hideBelow: "sm",
  cell: asideFor,
};

/** The bands are departments, so the rows leave Department out. */
const columnsWith = (select: CaseColumn) => [
  select,
  sized(personColumn, "w-[30%]"),
  sized(requestColumn, "w-[14%]"),
  sized(changeColumn, "w-[11%]"),
  sized(requesterColumn, "w-[24%]"),
  waitingColumn,
];

const SELECT_LABEL = <span className="sr-only">Select</span>;

const NO_SELECT: CaseColumn = {
  key: "select",
  label: SELECT_LABEL,
  className: "w-12",
  cell: () => null,
};

const readyIds = new Set(ready.map((row) => row.request.id));

const readyIdsOf = (requests: IrRequest[]) =>
  requests.map((request) => request.id).filter((id) => readyIds.has(id));

// The checkbox, not its cell, sits above the row link: a raised cell would cover the link's focus ring.
function selectColumn(selected: string[], onChange: (selected: string[]) => void): CaseColumn {
  const select = (ids: string[], checked: boolean) =>
    onChange(
      checked
        ? [...new Set([...selected, ...ids])]
        : selected.filter((entry) => !ids.includes(entry)),
    );
  return {
    ...NO_SELECT,
    label: (requests) => {
      const ids = readyIdsOf(requests);
      if (ids.length === 0) return SELECT_LABEL;
      const picked = ids.filter((id) => selected.includes(id)).length;
      return (
        <Checkbox
          checked={picked === ids.length ? true : picked > 0 ? "indeterminate" : false}
          onCheckedChange={(checked) => select(ids, checked === true)}
          aria-label="Select every ready request"
        />
      );
    },
    cell: (request) => {
      const row = rowsById.get(request.id);
      if (!row) return null;
      return (
        <Checkbox
          className="relative z-1"
          checked={selected.includes(request.id)}
          disabled={Boolean(row.blocker)}
          onCheckedChange={(checked) => select([request.id], checked === true)}
          aria-label={
            row.blocker
              ? `${request.person.name}: ${BLOCKER_LABEL[row.blocker]}`
              : `Select ${request.person.name}`
          }
        />
      );
    },
  };
}

const financeGroups = (rows: FinanceRow[]): CaseTableGroup[] =>
  byDepartment(rows).map(({ department, rows: departmentRows }) => ({
    key: department,
    title: department,
    yours: true,
    cases: departmentRows.map((row) => row.request),
  }));

/** The order a request page steps through: department by department, as the queue reads. */
const QUEUE_ORDER = financeGroups(FINANCE_QUEUE).flatMap((group) =>
  group.cases.map((request) => request.id),
);

/** Floats in once a row is selected: how many, Approve, Clear. The money waits for the dialog. */
function BatchBar({
  selected,
  onClear,
  onApprove,
}: {
  selected: string[];
  onClear: () => void;
  onApprove: () => void;
}) {
  return (
    <DataTableSelectionBar selectedCount={selected.length} onClear={onClear}>
      <Button size="sm" onClick={onApprove}>
        Approve
      </Button>
    </DataTableSelectionBar>
  );
}

function ApprovalsHeader({ count }: { count: number }) {
  return (
    <PageHeader
      title="Approvals"
      description={
        count > 0
          ? `${count} requests People verified for the ${ROUND.name}, by department.`
          : `Nothing waiting in the ${ROUND.name}.`
      }
    />
  );
}

const DEPARTMENTS = [...new Set(FINANCE_QUEUE.map((row) => row.request.person.department))];

/** No search: the queue is short and grouped by department, so Finance narrows it by department and kind. */
const QUEUE_FILTERS = [
  { label: "Department", options: allOf("All departments", DEPARTMENTS) },
  KIND_FILTER,
];

function ApprovalsQueue({
  initialSelection = [],
  dialogOpen = false,
}: {
  initialSelection?: string[];
  dialogOpen?: boolean;
}) {
  const [selected, setSelected] = useState(initialSelection);
  const [open, setOpen] = useState(dialogOpen);
  return (
    <IrShell viewer="finance" active="Approvals">
      <Page>
        <ApprovalsHeader count={FINANCE_QUEUE.length} />
        <ListFilters filters={QUEUE_FILTERS} />
        <CaseTable
          columns={columnsWith(selectColumn(selected, setSelected))}
          groups={financeGroups(FINANCE_QUEUE)}
          closed={FINANCE_APPROVED}
          closedTitle="Approved"
          selected={selected}
        />
      </Page>
      <BatchBar
        selected={selected}
        onClear={() => setSelected([])}
        onApprove={() => setOpen(true)}
      />
      <ApprovalDialog
        open={open}
        onOpenChange={setOpen}
        requests={ready
          .filter((row) => selected.includes(row.request.id))
          .map((row) => row.request)}
      />
    </IrShell>
  );
}

function LoadingQueue() {
  return (
    <IrShell viewer="finance" active="Approvals">
      <Page aria-busy>
        <ApprovalsHeader count={FINANCE_QUEUE.length} />
        <ListFilters filters={QUEUE_FILTERS} />
        <CaseTableLoading columns={columnsWith(NO_SELECT)} />
      </Page>
    </IrShell>
  );
}

const BUDGETS: Record<string, { yearly: Pay; leftNow: Pay }> = {
  [aisha.id]: AISHA_BUDGET,
  [nadia.id]: {
    yearly: { amount: 60_000, currency: "CAD", frequency: "annual" },
    leftNow: { amount: 4_200, currency: "CAD", frequency: "annual" },
  },
};

const budgetRows = (request: IrRequest) => {
  const cost = annualCost(request);
  const firstYear = effectiveYearCost(cost, ROUND.effective);
  const budget = BUDGETS[request.id] ?? AISHA_BUDGET;
  const after = budget.leftNow.amount - cost.amount;
  return [
    { key: "Cost a year", label: "Cost a year", value: formatIncrease(cost) },
    {
      key: "Cost this year",
      label: (
        <Inline gap="xs" wrap={false}>
          Cost in 2027 if approved
          <InfoHint label="What this year's cost counts">
            Counted from the proposed effective date, {formatShortDate(ROUND.effective)}, to the end
            of the year.
          </InfoHint>
        </Inline>
      ),
      value: formatIncrease(firstYear),
    },
    { key: "Yearly budget", label: "Yearly budget", value: formatMoney(budget.yearly) },
    { key: "Left now", label: "Left now", value: formatMoney(budget.leftNow) },
    {
      key: "Left if approved",
      label: "Left if approved",
      value: (
        <span className={after < 0 ? "text-warning-foreground" : undefined}>
          {formatMoney({ ...budget.leftNow, amount: after })}
        </span>
      ),
    },
  ];
};

const receiptRows = (request: IrRequest) => [
  { label: "Waiting", value: formatDays(request.waitingDays ?? 0) },
  { label: "Approvals", value: "1 of 2" },
  { label: "Submitted", value: formatDate(request.submittedAt ?? "2027-04-02") },
  { label: "Requested by", value: <PersonIdentity name={request.requester} /> },
  { label: "Effective if approved", value: formatDate(ROUND.effective) },
];

// I&R opens Request changes in place of the decision buttons, never in a dialog: Finance never rejects.
function RequestChangesForm({ onCancel }: { onCancel: () => void }) {
  const [note, setNote] = useState("");
  return (
    <CardSection asChild>
      <form onSubmit={(event) => event.preventDefault()}>
        <Field>
          <FieldLabel htmlFor="change-note">What needs to change</FieldLabel>
          <Textarea
            id="change-note"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            aria-describedby="change-note-hint"
          />
          <FieldDescription id="change-note-hint">
            Maya Bennett and People Strategy see this note. Aisha never does. Nothing is rejected.
          </FieldDescription>
        </Field>
        <Inline gap="sm" wrap={false}>
          <Button type="submit" size="lg" disabled={!note.trim()} className="flex-1">
            Send back to Maya
          </Button>
          <Button type="button" size="lg" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </Inline>
      </form>
    </CardSection>
  );
}

type DecisionMode = "default" | "approve" | "changes";

function ApprovalDecision({
  request = aisha,
  mode = "default",
  exception = false,
  notice,
}: {
  request?: IrRequest;
  mode?: DecisionMode;
  exception?: boolean;
  notice?: ReactNode;
}) {
  const [approving, setApproving] = useState(mode === "approve");
  const [changing, setChanging] = useState(mode === "changes");
  return (
    <IrShell viewer="finance" active="Approvals">
      <CaseDetail
        request={request}
        back="Approvals"
        position={QUEUE_ORDER.indexOf(request.id) + 1}
        total={QUEUE_ORDER.length}
        rows={receiptRows(request)}
        notice={notice}
        review={
          <PanelSection
            title="Budget impact"
            aside={`${request.person.department}, ${request.proposed.currency}`}
          >
            <DescriptionList align="end" frame divided>
              {budgetRows(request).map((row) => (
                <DescriptionItem
                  key={row.key}
                  label={row.label}
                  total={row.key === "Left if approved"}
                >
                  {row.value}
                </DescriptionItem>
              ))}
            </DescriptionList>
          </PanelSection>
        }
        actions={
          changing ? (
            <RequestChangesForm onCancel={() => setChanging(false)} />
          ) : (
            <PanelActions
              caption={
                exception ? undefined : "Approving makes it final. People releases it to share."
              }
            >
              <Button size="lg" onClick={() => setApproving(true)}>
                {exception ? "Approve as exception" : "Approve"}
              </Button>
              <Button size="lg" variant="outline" onClick={() => setChanging(true)}>
                Request changes
              </Button>
            </PanelActions>
          )
        }
      />
      <ApprovalDialog
        requests={[request]}
        open={approving}
        onOpenChange={setApproving}
        exception={exception}
      />
    </IrShell>
  );
}

function OverBudgetNotice() {
  return (
    <PanelNotice title="Over the Client Services budget">
      Approving it needs a reason, saved as a documented exception.
    </PanelNotice>
  );
}

const meta = {
  title: "Screens/Impact and Recognition/Approvals",
  // I&R is the only app on the Fieldtrip colours (its globals.css imports fieldtrip.css).
  globals: { brand: "fieldtrip" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Finance's queue in one table, a band per department; blocked requests cannot join a batch, and the batch bar shows only once a row is selected. */
export const Default: Story = { render: () => <ApprovalsQueue /> };

export const Loading: Story = { render: () => <LoadingQueue /> };

/** Every request approved: nothing waits, and this round's approvals stay under Approved. */
export const Empty: Story = {
  render: () => (
    <IrShell viewer="finance" active="Approvals">
      <Page>
        <ApprovalsHeader count={0} />
        <EmptyState
          icon={CircleCheck}
          title="Nothing to approve"
          description="Requests arrive here once People Strategy verifies them, grouped by department."
        />
        <CaseTable
          columns={columnsWith(NO_SELECT)}
          groups={[]}
          closed={[
            ...FINANCE_QUEUE.map((row) => ({
              ...row.request,
              status: "approved" as const,
              closedOn: "2027-04-12",
            })),
            ...FINANCE_APPROVED,
          ]}
          closedTitle="Approved"
        />
      </Page>
    </IrShell>
  ),
};

/** Two requests selected: the floating bar counts them, with Approve and Clear. */
export const BatchSelected: Story = {
  render: () => <ApprovalsQueue initialSelection={[aisha.id, "ir-107"]} />,
};

/** Confirming the batch: how many, Cancel or Approve. */
export const BatchApproveDialog: Story = {
  render: () => <ApprovalsQueue initialSelection={[aisha.id, "ir-107", "ir-103"]} dialogOpen />,
};

/** One request from the queue: the evidence, then Finance's decision with the budget impact. */
export const Decision: Story = { render: () => <ApprovalDecision /> };

export const DecisionLoading: Story = {
  render: () => (
    <IrShell viewer="finance" active="Approvals">
      <CaseDetailLoading back="Approvals" />
    </IrShell>
  ),
};

/** Request changes opens in the panel: a note to the requester and People, never a rejection. */
export const RequestChanges: Story = { render: () => <ApprovalDecision mode="changes" /> };

/** Over the department budget: approving needs a reason, saved as a documented exception. */
export const ApproveAsException: Story = {
  render: () => (
    <ApprovalDecision request={nadia} mode="approve" exception notice={<OverBudgetNotice />} />
  ),
};
