"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "../lib/utils";
import { toggleHitAreaClassName } from "../internal/control-styles";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & { size?: "sm" | "default" }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        toggleHitAreaClassName,
        "peer group/switch inline-flex shrink-0 items-center rounded-full border border-transparent p-px shadow-hairline outline-none",
        "transition-[background-color,border-color,box-shadow] duration-(--duration-base) ease-out-expo",
        "data-[size=default]:h-5.5 data-[size=default]:w-10 data-[size=sm]:h-4.5 data-[size=sm]:w-8",
        "data-[state=unchecked]:bg-input hover:data-[state=unchecked]:bg-ring/60 data-[state=checked]:bg-primary hover:data-[state=checked]:bg-primary/90 dark:data-[state=unchecked]:bg-input/80",
        "focus-visible:focus-ring",
        "aria-invalid:border-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-card shadow-raised ring-0 dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground",
          "transition-transform duration-(--duration-base) ease-out-expo",
          "group-data-[size=default]/switch:size-4.5 group-data-[size=sm]/switch:size-3.5",
          "data-[state=unchecked]:translate-x-0 group-data-[size=default]/switch:data-[state=checked]:translate-x-4.5 group-data-[size=sm]/switch:data-[state=checked]:translate-x-3.5",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
