import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../lib/utils";

const kbdVariants = cva(
  "pointer-events-none inline-flex w-fit items-center align-middle justify-center gap-1 rounded-md border border-border bg-muted font-sans font-medium text-muted-foreground tabular-nums select-none in-data-[slot=tooltip-content]:border-primary-foreground/20 in-data-[slot=tooltip-content]:bg-primary-foreground/15 in-data-[slot=tooltip-content]:text-primary-foreground [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      size: {
        sm: "h-5 min-w-5 rounded-sm px-1 text-2xs",
        default: "h-6 min-w-6 px-1.5 text-xs",
      },
    },
    defaultVariants: { size: "default" },
  },
);

function Kbd({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
  return (
    <kbd
      data-slot="kbd"
      data-size={size}
      className={cn(kbdVariants({ size }), className)}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1 align-middle", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup, kbdVariants };
