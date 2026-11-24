import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldError } from "../../src/components/field";
import { Textarea } from "../../src/components/textarea";
import { CONTROL_STATES, stateProps } from "../lib/control-states";
import { VariantGrid } from "../lib/variant-grid";

const REASON =
  "Sofia took over the TikTok creator program in March and doubled the approved-video rate.";

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
  args: {
    placeholder: "What changed in their work and its impact",
    disabled: false,
    "aria-invalid": false,
  },
  render: (args) => (
    <div className="w-96">
      <Textarea {...args} />
    </div>
  ),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={CONTROL_STATES}
      columns={["placeholder", "filled"] as const}
      renderCell={(state, content) => (
        <div className="flex w-72 flex-col gap-1.5">
          <Textarea
            {...stateProps(state)}
            aria-label={`${state} ${content}`}
            placeholder="What changed in their work and its impact"
            defaultValue={content === "filled" ? REASON : undefined}
          />
          {state === "invalid" && <FieldError>Add a reason.</FieldError>}
        </div>
      )}
    />
  ),
};

export const Default: Story = {};

export const Filled: Story = { args: { defaultValue: REASON } };

export const Disabled: Story = { args: { disabled: true, defaultValue: REASON } };

export const Invalid: Story = { args: { "aria-invalid": true } };
