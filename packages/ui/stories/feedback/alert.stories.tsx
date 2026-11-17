import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertDescription, AlertTitle } from "../../src/components/alert";

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  args: { variant: "default" },
  argTypes: { variant: { control: "inline-radio", options: ["default", "destructive"] } },
  render: (args) => (
    <Alert {...args} className="w-md">
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>Supporting description.</AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = { args: { variant: "destructive" } };

// Titles carry dates and names, so they wrap instead of being cut.
export const LongTitle: Story = {
  render: (args) => (
    <Alert {...args} className="w-80">
      <AlertTitle>Withdrawn by Alex Morgan on Apr 30, 2027 after the review closed</AlertTitle>
      <AlertDescription>Supporting description.</AlertDescription>
    </Alert>
  ),
};
