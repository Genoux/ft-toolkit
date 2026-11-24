import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { Button } from "../../src/components/button";
import {
  DestructiveActionDialog,
  type DestructiveActionDialogProps,
} from "../../src/components/destructive-action-dialog";
import { Field, FieldDescription, FieldLabel } from "../../src/components/field";
import { Textarea } from "../../src/components/textarea";

type Scenario = "deleteSession" | "deleteCampaign" | "withdrawRequest";

type ScenarioContent = {
  trigger: string;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  pendingLabel?: string;
  resourceName?: string;
  needsReason?: boolean;
};

const SCENARIOS: Record<Scenario, ScenarioContent> = {
  // Proof, features/sessions/components/_components/session-list-item.tsx
  deleteSession: {
    trigger: "Delete session",
    title: "Delete session?",
    description: "This will remove the session, uploaded assets, and all review results.",
  },
  // Pool, features/projects/components/project-list.tsx
  deleteCampaign: {
    trigger: "Delete campaign",
    title: "Delete campaign?",
    description: (
      <>
        This will permanently delete <b>Holiday gifting UGC</b> and all its collaborations,
        submissions, and assets. This action cannot be undone.
      </>
    ),
    resourceName: "Holiday gifting UGC",
  },
  // I&R, features/requests/components/withdraw-dialog.tsx
  withdrawRequest: {
    trigger: "Withdraw",
    title: "Withdraw request",
    description: "The increase for Aisha Grant stops where it is and moves to Closed.",
    confirmLabel: "Withdraw request",
    pendingLabel: "Withdrawing…",
    needsReason: true,
  },
};

type DemoArgs = { scenario: Scenario; isPending: boolean; startOpen?: boolean };

function DestructiveActionDialogDemo({ scenario, isPending, startOpen = false }: DemoArgs) {
  const content = SCENARIOS[scenario];
  const [open, setOpen] = useState(startOpen);
  const [reason, setReason] = useState("");
  const shared = {
    open,
    onOpenChange: (next: boolean) => {
      if (!next) setReason("");
      setOpen(next);
    },
    title: content.title,
    description: content.description,
    confirmLabel: content.confirmLabel,
    pendingLabel: content.pendingLabel,
    onConfirm: () => setOpen(false),
    isPending,
    confirmDisabled: content.needsReason && reason.trim() === "",
    children: content.needsReason ? (
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
    ) : null,
  } satisfies Partial<DestructiveActionDialogProps>;
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {content.trigger}
      </Button>
      {content.resourceName ? (
        <DestructiveActionDialog {...shared} variant="typed" resourceName={content.resourceName} />
      ) : (
        <DestructiveActionDialog {...shared} />
      )}
    </>
  );
}

const meta = {
  title: "Organisms/DestructiveActionDialog",
  args: { scenario: "deleteSession", isPending: false },
  argTypes: {
    scenario: { control: "inline-radio", options: Object.keys(SCENARIOS) },
  },
  render: (args) => <DestructiveActionDialogDemo {...args} />,
} satisfies Meta<DemoArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Proof's Delete session confirmation. */
export const AllStates: Story = { args: { startOpen: true } };

export const Closed: Story = {};

/** Pool's Delete campaign: the reader types the phrase before Delete turns on. */
export const Typed: Story = { args: { scenario: "deleteCampaign", startOpen: true } };

/** I&R's Withdraw request: the required reason goes in as children; confirmDisabled keeps confirm off until it is filled. */
export const WithReason: Story = { args: { scenario: "withdrawRequest", startOpen: true } };

/** Confirm never closes the dialog itself; while pending it stays open with the pending label. */
export const Pending: Story = {
  args: { scenario: "withdrawRequest", isPending: true, startOpen: true },
};
