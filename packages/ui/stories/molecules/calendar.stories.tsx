import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "../../src/components/calendar";

const TODAY = new Date(2027, 3, 21);
const CYCLE_START = new Date(2027, 3, 1);
const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

const meta = {
  title: "Molecules/Calendar",
  component: Calendar,
  args: { mode: "single", captionLayout: "label" },
  argTypes: { captionLayout: { control: "inline-radio", options: ["label", "dropdown"] } },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <div className="flex items-start gap-6">
      <div className="flex flex-col gap-2">
        <code className="text-xs text-muted-foreground">single, today, disabled weekends</code>
        <Calendar
          mode="single"
          today={TODAY}
          defaultMonth={CYCLE_START}
          selected={new Date(2027, 3, 30)}
          disabled={isWeekend}
        />
      </div>
      <div className="flex flex-col gap-2">
        <code className="text-xs text-muted-foreground">range</code>
        <Calendar
          mode="range"
          today={TODAY}
          defaultMonth={CYCLE_START}
          selected={{ from: new Date(2027, 3, 12), to: new Date(2027, 3, 23) }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <code className="text-xs text-muted-foreground">month and year dropdowns</code>
        <Calendar
          mode="single"
          captionLayout="dropdown"
          today={TODAY}
          defaultMonth={CYCLE_START}
          startMonth={new Date(2025, 0)}
          endMonth={new Date(2028, 11)}
          selected={TODAY}
        />
      </div>
    </div>
  ),
};

export const Single: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date(2027, 3, 30));
    return (
      <Calendar
        {...args}
        mode="single"
        today={TODAY}
        defaultMonth={CYCLE_START}
        selected={date}
        onSelect={setDate}
      />
    );
  },
};

export const Dropdowns: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(TODAY);
    return (
      <Calendar
        mode="single"
        captionLayout="dropdown"
        today={TODAY}
        defaultMonth={CYCLE_START}
        startMonth={new Date(2025, 0)}
        endMonth={new Date(2028, 11)}
        selected={date}
        onSelect={setDate}
      />
    );
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2027, 3, 8),
      to: new Date(2027, 3, 14),
    });
    return (
      <Calendar
        mode="range"
        today={TODAY}
        defaultMonth={CYCLE_START}
        selected={range}
        onSelect={setRange}
      />
    );
  },
};

export const TwoMonths: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2027, 3, 26),
      to: new Date(2027, 4, 9),
    });
    return (
      <Calendar
        mode="range"
        numberOfMonths={2}
        today={TODAY}
        defaultMonth={CYCLE_START}
        selected={range}
        onSelect={setRange}
      />
    );
  },
};
