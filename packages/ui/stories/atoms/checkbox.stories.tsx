import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../../src/components/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../src/components/field";
import { CONTROL_STATES, stateProps } from "../lib/control-states";
import { VariantGrid } from "../lib/variant-grid";

const CHECKED_BY_COLUMN = {
  unchecked: false,
  checked: true,
  indeterminate: "indeterminate",
} as const;

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  args: { disabled: false, "aria-label": "Select row" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={CONTROL_STATES}
      columns={["unchecked", "checked", "indeterminate"] as const}
      renderCell={(state, column) => (
        <Checkbox
          {...stateProps(state)}
          aria-label={`${state} ${column}`}
          defaultChecked={CHECKED_BY_COLUMN[column]}
        />
      )}
    />
  ),
};

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

/** Proof's session products list and I&R's Windmill declaration, with its error and a disabled row. */
export const WithLabel: Story = {
  render: () => (
    <FieldGroup className="w-96">
      <Field orientation="horizontal">
        <Checkbox id="checkbox-product" defaultChecked />
        <FieldLabel htmlFor="checkbox-product" className="font-normal">
          Oura Ring 4
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="checkbox-declared" />
        <FieldContent>
          <FieldLabel htmlFor="checkbox-declared">Windmill reviews are complete</FieldLabel>
          <FieldDescription>
            Self-reflection, peer feedback and manager review, for this round.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="checkbox-declared-error" aria-invalid aria-describedby="checkbox-error" />
        <FieldContent>
          <FieldLabel htmlFor="checkbox-declared-error">Windmill reviews are complete</FieldLabel>
          <FieldError id="checkbox-error">Confirm the reviews are complete in Windmill.</FieldError>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" data-disabled>
        <Checkbox id="checkbox-locked" disabled defaultChecked />
        <FieldLabel htmlFor="checkbox-locked" className="font-normal">
          Oura Membership
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
};
