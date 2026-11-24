import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../src/components/button";
import { Separator } from "../../src/components/separator";

const meta = {
  title: "Atoms/Separator",
  component: Separator,
  args: { orientation: "horizontal", size: "full" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    size: { control: "inline-radio", options: ["full", "sm"] },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InContext: Story = {
  render: () => (
    <div className="w-80 rounded-xl border bg-card p-(--card-padding)">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Spring launch</span>
        <span className="text-xs text-muted-foreground">12 creators · 48 assets</span>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-3 text-xs text-muted-foreground">
        <span>Brief</span>
        <Separator orientation="vertical" />
        <span>Assets</span>
        <Separator orientation="vertical" />
        <span>Reporting</span>
      </div>
    </div>
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <div className="flex h-16 w-64 items-center justify-center">
      <Separator {...args} />
    </div>
  ),
};

export const Vertical: Story = { ...Horizontal, args: { orientation: "vertical" } };

/** `size="sm"`: a 16px vertical rule centred in a row of taller controls, as in a floating selection bar. */
export const Small: Story = {
  render: () => (
    <div className="flex w-fit items-center gap-3 rounded-full border bg-card py-1 ps-4 pe-1 shadow-elevated">
      <span className="text-sm font-medium tabular-nums">2 selected</span>
      <Separator orientation="vertical" size="sm" />
      <Button size="sm">Approve</Button>
      <Separator orientation="vertical" size="sm" />
      <Button size="sm" variant="ghost">
        Clear
      </Button>
    </div>
  ),
};
