import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../src/components/button";
import { Card } from "../../src/components/card";
import { LabeledField } from "../../src/components/labeled-field";

const meta = {
  title: "Display/Card",
  component: Card,
  render: () => (
    <Card className="w-sm">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium">Monthly budget</div>
        <p className="text-xs text-muted-foreground">Updated 2 hours ago</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <LabeledField label="Spent" value="$12,400" />
        <LabeledField label="Remaining" value="$7,600" />
      </div>
      <Button variant="secondary" size="sm" className="self-start">
        View report
      </Button>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
