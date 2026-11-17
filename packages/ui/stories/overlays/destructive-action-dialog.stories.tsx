import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../src/components/button";
import { DestructiveActionDialog } from "../../src/components/destructive-action-dialog";
import { Field, FieldDescription, FieldLabel } from "../../src/components/field";
import { Textarea } from "../../src/components/textarea";

type DemoArgs = { typed: boolean; isPending: boolean; withReason: boolean; startOpen?: boolean };

function DestructiveActionDialogDemo({
  typed,
  isPending,
  withReason,
  startOpen = false,
}: DemoArgs) {
  const [open, setOpen] = useState(startOpen);
  const [reason, setReason] = useState("");
  const shared = {
    open,
    onOpenChange: (next: boolean) => {
      if (!next) setReason("");
      setOpen(next);
    },
    title: "Delete item?",
    description: "This cannot be undone.",
    onConfirm: () => setOpen(false),
    isPending,
    confirmDisabled: withReason && reason.trim() === "",
    children: withReason ? (
      <Field>
        <FieldLabel htmlFor="destructive-reason">Reason</FieldLabel>
        <Textarea
          id="destructive-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          aria-describedby="destructive-reason-hint"
        />
        <FieldDescription id="destructive-reason-hint">
          Required. Only your team sees it.
        </FieldDescription>
      </Field>
    ) : null,
  };
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      {typed ? (
        <DestructiveActionDialog {...shared} variant="typed" resourceName="Item A" />
      ) : (
        <DestructiveActionDialog {...shared} />
      )}
    </>
  );
}

const meta = {
  title: "Overlays/DestructiveActionDialog",
  args: { typed: false, isPending: false, withReason: false },
  render: (args) => <DestructiveActionDialogDemo {...args} />,
} satisfies Meta<DemoArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Typed: Story = { args: { typed: true } };

// Fields go in as children; confirmDisabled keeps confirm off until they are valid.
export const WithReason: Story = { args: { withReason: true, startOpen: true } };

// Confirm never closes the dialog itself; while pending it stays open with the pending label.
export const Pending: Story = { args: { isPending: true, startOpen: true } };
