"use client";

import { CalendarDays } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  type ControlSize,
  controlSurfaceClassName,
  fieldRadiusClassName,
} from "../internal/control-styles";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DatePickerProps = Pick<
  ComponentProps<"button">,
  "id" | "disabled" | "aria-describedby" | "aria-invalid"
> & {
  /** ISO calendar date such as "2027-04-30", or "" when empty. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: ControlSize;
  /** BCP 47 locale for the shown date. Fixed by default so server and browser render the same text. */
  locale?: string;
  /** Merged into the trigger; the default width is `w-full`. */
  className?: string;
};

// A calendar date has no time zone: `new Date("2027-04-30")` is UTC midnight, the day before west
// of UTC, so both directions go through local year, month and day.
function fromIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  size = "default",
  locale = "en-US",
  className,
  ...triggerProps
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? fromIsoDate(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={cn(
            controlSurfaceClassName,
            fieldRadiusClassName,
            "w-full justify-start gap-2 px-4 font-normal tabular-nums hover:bg-card has-[>svg]:pl-3.5 data-[state=open]:border-ring data-[state=open]:bg-card",
            !selected && "text-muted-foreground",
            className,
          )}
          {...triggerProps}
        >
          <CalendarDays className="text-subtle-foreground" />
          {selected
            ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(selected)
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border-0 p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(day) => {
            if (!day) return;
            onChange(toIsoDate(day));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
