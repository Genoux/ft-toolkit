import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePicker } from "../../src/components/date-picker";
import { Field, FieldLabel } from "../../src/components/field";

function DatePickerDemo({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  return (
    <Field className="w-64">
      <FieldLabel htmlFor="date-picker">Due date</FieldLabel>
      <DatePicker id="date-picker" value={value} onChange={setValue} />
      <code className="text-xs text-muted-foreground">value: {JSON.stringify(value)}</code>
    </Field>
  );
}

const meta = {
  title: "Forms/DatePicker",
  args: { initialValue: "2027-04-30" },
  render: (args) => <DatePickerDemo {...args} />,
} satisfies Meta<{ initialValue: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { initialValue: "" } };
