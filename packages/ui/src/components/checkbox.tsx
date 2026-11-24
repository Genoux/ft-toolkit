"use client";

import * as React from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "../lib/utils";
import {
  choiceCardControlClassName,
  controlSurfaceClassName,
  toggleHitAreaClassName,
} from "../internal/control-styles";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        controlSurfaceClassName,
        toggleHitAreaClassName,
        choiceCardControlClassName,
        "peer group/checkbox size-4 shrink-0 rounded-sm disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground dark:data-[state=checked]:bg-primary dark:data-[state=indeterminate]:bg-primary",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current duration-(--duration-fast) ease-out-expo animate-in fade-in-0 zoom-in-75"
      >
        <CheckIcon strokeWidth={3} className="size-3 text-current group-data-[state=indeterminate]/checkbox:hidden" />
        <MinusIcon strokeWidth={3} className="hidden size-3 text-current group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
