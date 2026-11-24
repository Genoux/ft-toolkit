import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Progress } from "../../src/components/progress";

const meta = {
  title: "Atoms/Progress",
  component: Progress,
  args: { value: 62 },
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[0, 24, 62, 100].map((value) => (
        <div key={value} className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Uploading assets</span>
            <span className="tabular-nums">{value}%</span>
          </div>
          <Progress value={value} aria-label="Uploading assets" />
        </div>
      ))}
    </div>
  ),
};

function UploadProgress() {
  const [value, setValue] = useState(8);
  useEffect(() => {
    const interval = setInterval(
      () => setValue((current) => (current >= 100 ? 8 : Math.min(100, current + 23))),
      900,
    );
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Rendering 4 videos</span>
        <span className="tabular-nums">{value}%</span>
      </div>
      <Progress value={value} aria-label="Rendering videos" />
    </div>
  );
}

export const Animated: Story = {
  render: () => <UploadProgress />,
};

export const Default: Story = {};
