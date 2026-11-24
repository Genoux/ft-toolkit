import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldError } from "../../src/components/field";
import { Input } from "../../src/components/input";
import { CONTROL_STATES, stateProps } from "../lib/control-states";
import { VariantGrid } from "../lib/variant-grid";

const meta = {
  title: "Atoms/Input",
  component: Input,
  args: { placeholder: "maya@inbeat.agency", disabled: false, "aria-invalid": false },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={CONTROL_STATES}
      columns={["placeholder", "filled"] as const}
      renderCell={(state, content) => (
        <div className="flex w-60 flex-col gap-1.5">
          <Input
            {...stateProps(state)}
            aria-label={`${state} ${content}`}
            placeholder="name@inbeat.agency"
            defaultValue={content === "filled" ? "sofia.reyes@inbeat.agency" : undefined}
          />
          {state === "invalid" && (
            <FieldError>An application with this email already exists.</FieldError>
          )}
        </div>
      )}
    />
  ),
};

export const Default: Story = {};

export const Types: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input type="email" aria-label="Email" placeholder="name@inbeat.agency" />
      <Input type="password" aria-label="Password" defaultValue="correct-horse" />
      <Input
        type="number"
        aria-label="Budget"
        className="tabular-nums"
        defaultValue={12500}
        min={0}
        step={500}
      />
      <Input type="url" aria-label="Brief link" placeholder="https://" />
      <Input type="file" aria-label="Contract" />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, defaultValue: "Synced from Deel" } };

export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "maya@" } };

/** Read-only keeps the value at full contrast on a muted surface; disabled fades it. */
export const ReadOnlyAndDisabled: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Input aria-label="Current pay" readOnly defaultValue="CAD 78,000 per year" />
      <Input aria-label="Current pay, disabled" disabled defaultValue="CAD 78,000 per year" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VariantGrid
      rows={["sm", "default"] as const}
      columns={["placeholder", "filled"] as const}
      renderCell={(size, content) => (
        <Input
          size={size}
          className="w-60"
          aria-label={`${size} ${content}`}
          placeholder="name@inbeat.agency"
          defaultValue={content === "filled" ? "sofia.reyes@inbeat.agency" : undefined}
        />
      )}
    />
  ),
};
