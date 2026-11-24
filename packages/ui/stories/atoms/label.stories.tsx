import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../../src/components/checkbox";
import { Input } from "../../src/components/input";
import { Label } from "../../src/components/label";

const meta = {
  title: "Atoms/Label",
  component: Label,
  args: { children: "Campaign name" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="label-campaign">Campaign name</Label>
        <Input id="label-campaign" defaultValue="Spring launch" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="label-terms" />
        <Label htmlFor="label-terms">Notify creators by email</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="label-disabled" disabled className="peer" />
        <Label htmlFor="label-disabled">Auto-approve drafts</Label>
      </div>
      <div data-disabled="true" className="group flex flex-col gap-2">
        <Label htmlFor="label-locked">Workspace slug</Label>
        <Input id="label-locked" defaultValue="inbeat" disabled />
      </div>
    </div>
  ),
};

export const Default: Story = {};
