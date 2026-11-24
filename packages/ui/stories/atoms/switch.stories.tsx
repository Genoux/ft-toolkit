import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../../src/components/field";
import { Switch } from "../../src/components/switch";
import {
  CONTROL_STATES,
  type ControlState,
  SIMULATED_STATE_CLASS,
  stateProps,
} from "../lib/control-states";
import { VariantGrid } from "../lib/variant-grid";

const COLUMNS = ["sm off", "sm on", "default off", "default on"] as const;

const SIMULATED_SWITCH_STATE_CLASS: Partial<Record<ControlState, string>> = {
  hover: "data-[state=unchecked]:bg-ring/60 data-[state=checked]:bg-primary/90",
  "focus-visible": SIMULATED_STATE_CLASS.focus,
};

const meta = {
  title: "Atoms/Switch",
  component: Switch,
  args: { size: "default", disabled: false, "aria-label": "Auto-approve" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "default"] } },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={CONTROL_STATES}
      columns={COLUMNS}
      renderCell={(state, column) => {
        const [size, value] = column.split(" ") as ["sm" | "default", "off" | "on"];
        const { disabled, "aria-invalid": ariaInvalid } = stateProps(state);
        return (
          <Switch
            disabled={disabled}
            aria-invalid={ariaInvalid}
            className={SIMULATED_SWITCH_STATE_CLASS[state]}
            size={size}
            defaultChecked={value === "on"}
            aria-label={`${state} ${column}`}
          />
        );
      }}
    />
  ),
};

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Small: Story = { args: { size: "sm", defaultChecked: true } };

export const Settings: Story = {
  render: () => (
    <FieldGroup className="w-96 gap-5">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="switch-slack">Slack updates</FieldLabel>
          <FieldDescription>A message in #ugc-briefs at each step.</FieldDescription>
        </FieldContent>
        <Switch id="switch-slack" defaultChecked />
      </Field>
      <FieldSeparator />
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="switch-approve">Auto-approve trusted creators</FieldLabel>
          <FieldDescription>Skips review for creators with five approved videos.</FieldDescription>
        </FieldContent>
        <Switch id="switch-approve" />
      </Field>
      <FieldSeparator />
      <Field orientation="horizontal" data-disabled>
        <FieldContent>
          <FieldLabel htmlFor="switch-whitelist">Whitelisting</FieldLabel>
          <FieldDescription>Managed by the client in Meta Business Manager.</FieldDescription>
        </FieldContent>
        <Switch id="switch-whitelist" disabled defaultChecked />
      </Field>
    </FieldGroup>
  ),
};
