import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../../src/components/card";
import { LabeledField } from "../../src/components/labeled-field";
import { Grid } from "../../src/components/layout";
import { StatusDot } from "../../src/components/status-dot";

const meta = {
  title: "Molecules/LabeledField",
  component: LabeledField,
  args: { label: "Contract value", value: "$12,400" },
} satisfies Meta<typeof LabeledField>;

export default meta;
type Story = StoryObj<typeof meta>;

const narrow: Story["decorators"] = [
  (Story) => (
    <div className="w-64">
      <Story />
    </div>
  ),
];

/** Text, a figure, zero, a rich value and a long value; an empty value renders nothing. */
export const AllStates: Story = {
  render: () => (
    <Grid min="sm" className="w-3xl">
      {[
        { label: "Client", value: "Glossier" },
        { label: "No. of profiles to source", value: 40 },
        { label: "Profiles sourced", value: 0 },
        { label: "Status", value: <StatusDot tone="info" label="In progress" /> },
        {
          label: "Deliverables",
          value: "Three 30-second TikToks and one Instagram Reel per creator, raw files included",
        },
      ].map((field) => (
        <Card key={field.label}>
          <LabeledField label={field.label} value={field.value} />
        </Card>
      ))}
    </Grid>
  ),
};

export const Default: Story = { decorators: narrow };

export const LongValue: Story = {
  decorators: narrow,
  args: {
    label: "Deliverables",
    value: "Three 30-second TikToks and one Instagram Reel per creator, raw files included",
  },
};
