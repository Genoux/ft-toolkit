import type { Meta, StoryObj } from "@storybook/react-vite";
import { Meter } from "../../src/components/meter";

const meta = {
  title: "Atoms/Meter",
  component: Meter,
  args: { value: 64, label: "64%" },
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {[0, 12, 50, 88, 100].map((value) => (
        <Meter key={value} value={value} label={`${value}%`} />
      ))}
      <Meter value={40} />
    </div>
  ),
};

export const Fill: Story = {
  render: () => (
    <div className="flex w-60 flex-col gap-2 rounded-xl border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">Seats</span>
        <span className="text-xs text-muted-foreground tabular-nums">14 of 20</span>
      </div>
      <Meter value={70} fill />
      <Meter value={70} fill label="70%" />
    </div>
  ),
};

export const InTableCell: Story = {
  render: () => (
    <div className="flex items-center gap-6 text-table">
      <span>Budget spent</span>
      <Meter value={64} label="$6,400" />
    </div>
  ),
};

export const Default: Story = {};
