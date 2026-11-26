import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../src/components/button";
import { DestructiveActionDialog } from "../../../src/components/destructive-action-dialog";
import { Field, FieldDescription, FieldLabel } from "../../../src/components/field";
import { PersonIdentity } from "../../../src/components/person-identity";
import { Textarea } from "../../../src/components/textarea";
import {
  BEN_RETURN,
  ben,
  formatDate,
  MY_REQUESTS,
  REQUEST_HOLDER,
  ROUND,
} from "../../lib/impact-and-recognition-fixtures";
import { CaseDetail, CaseDetailLoading, PanelActions, PanelNote } from "./case-detail";
import { IrShell } from "./parts";

const RECEIPT = [
  { label: "Due", value: formatDate(ROUND.submitBy) },
  { label: "Approvals", value: "0 of 2" },
  { label: "Submitted", value: formatDate(ben.submittedAt ?? "") },
  { label: "Requested by", value: <PersonIdentity name={ben.requester} /> },
  { label: "Effective if approved", value: formatDate(ROUND.effective) },
];

function WithdrawDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <DestructiveActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Withdraw request"
      description={`The increase for ${ben.person.name} stops where it is and moves to Closed.`}
      confirmLabel="Withdraw request"
      pendingLabel="Withdrawing…"
      confirmDisabled={reason.trim() === ""}
      onConfirm={() => onOpenChange(false)}
    >
      <Field>
        <FieldLabel htmlFor="withdraw-reason">Reason</FieldLabel>
        <Textarea
          id="withdraw-reason"
          rows={4}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          aria-describedby="withdraw-reason-hint"
        />
        <FieldDescription id="withdraw-reason-hint">The employee never sees this.</FieldDescription>
      </Field>
    </DestructiveActionDialog>
  );
}

function RequestDetail({ withdrawing = false }: { withdrawing?: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(withdrawing);
  return (
    <IrShell viewer="manager" active="My requests">
      <CaseDetail
        request={ben}
        back="My requests"
        position={2}
        total={MY_REQUESTS.filter((entry) => REQUEST_HOLDER[entry.status] !== "none").length}
        rows={RECEIPT}
        notice={<PanelNote author="Priya Shah">{BEN_RETURN}</PanelNote>}
        actions={
          <PanelActions>
            <Button size="lg">Edit and resubmit</Button>
            <Button size="lg" variant="outline" onClick={() => setDialogOpen(true)}>
              Withdraw
            </Button>
          </PanelActions>
        }
      />
      <WithdrawDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </IrShell>
  );
}

const meta = {
  title: "Screens/Impact and Recognition/Request detail",
  // I&R is the only app on the Fieldtrip colours (its globals.css imports fieldtrip.css).
  globals: { brand: "fieldtrip" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The requester's view of a request People sent back: the status receipt in the holder's colour, then the note leading the decision panel. */
export const Default: Story = { render: () => <RequestDetail /> };

export const Loading: Story = {
  render: () => (
    <IrShell viewer="manager" active="My requests">
      <CaseDetailLoading back="My requests" />
    </IrShell>
  ),
};

/** Withdrawing asks for a reason the employee never sees. */
export const Withdraw: Story = { render: () => <RequestDetail withdrawing /> };
