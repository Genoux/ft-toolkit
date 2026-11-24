import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePicker } from "../../src/components/date-picker";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../src/components/field";
import { cn } from "../../src/lib/utils";
import { CONTROL_STATES, type ControlState, stateProps } from "../lib/control-states";
import { VariantGrid } from "../lib/variant-grid";

const SIMULATED_TRIGGER_STATE_CLASS: Partial<Record<ControlState, string>> = {
  hover: "[&_button]:border-ring/60",
  "focus-visible": "[&_button]:focus-ring!",
};

function DatePickerDemo({
  initialValue,
  state = "default",
}: {
  initialValue: string;
  state?: (typeof CONTROL_STATES)[number];
}) {
  const [value, setValue] = useState(initialValue);
  const { disabled, "aria-invalid": ariaInvalid } = stateProps(state);
  return (
    <div className={cn("flex w-56 flex-col gap-1.5", SIMULATED_TRIGGER_STATE_CLASS[state])}>
      <DatePicker
        value={value}
        onChange={setValue}
        aria-label={`${state} new pay effective`}
        disabled={disabled}
        aria-invalid={ariaInvalid}
      />
      {state === "invalid" && <FieldError>Must come after released to share</FieldError>}
    </div>
  );
}

const meta = {
  title: "Molecules/DatePicker",
  args: { initialValue: "2027-07-01" },
  render: ({ initialValue }) => {
    const [value, setValue] = useState(initialValue);
    return (
      <Field className="w-64">
        <FieldLabel htmlFor="date-picker">Effective date</FieldLabel>
        <DatePicker
          id="date-picker"
          value={value}
          onChange={setValue}
          aria-describedby="date-picker-hint"
        />
        <FieldDescription id="date-picker-hint">Approved from Jul 1, 2027.</FieldDescription>
      </Field>
    );
  },
} satisfies Meta<{ initialValue: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={CONTROL_STATES}
      columns={["placeholder", "filled"] as const}
      renderCell={(state, column) => (
        <DatePickerDemo state={state} initialValue={column === "filled" ? "2027-07-01" : ""} />
      )}
    />
  ),
};

export const Default: Story = {};

/** Pool's discovery request Deadline, empty: opening it shows today. */
export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Field className="w-64">
        <FieldLabel htmlFor="deadline">Deadline</FieldLabel>
        <DatePicker id="deadline" value={value} onChange={setValue} placeholder="Pick a date" />
      </Field>
    );
  },
};

function SizedDatePicker({ size, initialValue }: { size: "sm" | "default"; initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="w-56">
      <DatePicker
        size={size}
        value={value}
        onChange={setValue}
        aria-label={`${size} new pay effective`}
      />
    </div>
  );
}

export const Sizes: Story = {
  render: () => (
    <VariantGrid
      rows={["sm", "default"] as const}
      columns={["placeholder", "filled"] as const}
      renderCell={(size, column) => (
        <SizedDatePicker size={size} initialValue={column === "filled" ? "2027-07-01" : ""} />
      )}
    />
  ),
};
