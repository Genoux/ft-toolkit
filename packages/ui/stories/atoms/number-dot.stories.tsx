import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberDot } from "../../src/components/number-dot";

const meta = {
  title: "Atoms/NumberDot",
  component: NumberDot,
  args: { count: 12 },
} satisfies Meta<typeof NumberDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {[1, 9, 12, 128].map((count) => (
          <NumberDot key={count} count={count} />
        ))}
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="inline-flex items-center">
          Pending review
          <NumberDot count={4} />
        </span>
        <span className="inline-flex items-center text-muted-foreground">
          Zero renders nothing
          <NumberDot count={0} />
        </span>
      </div>
    </div>
  ),
};

export const Default: Story = {};
