"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "../lib/utils";
import {
  choiceCardControlClassName,
  controlSurfaceClassName,
  toggleHitAreaClassName,
} from "../internal/control-styles";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-3 has-[>[data-slot=field-label]]:gap-(--gap-md)", className)}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        controlSurfaceClassName,
        toggleHitAreaClassName,
        choiceCardControlClassName,
        "group/radio flex aspect-square size-4 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="size-2 rounded-full bg-primary-foreground duration-(--duration-fast) ease-out-expo animate-in fade-in-0 zoom-in-50"
      />
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
