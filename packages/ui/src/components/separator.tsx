"use client"

import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "../lib/utils"

type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  /** `sm` is a 16px vertical rule centred in its row, between items of a header or a floating bar; `full` spans the row. */
  size?: "full" | "sm"
}

// A fixed height cancels `self-stretch` and leaves the rule at the top of its row, so the short
// rule centres itself instead of leaving that to each caller.
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  size = "full",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
        size === "sm"
          ? "data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
          : "data-[orientation=vertical]:h-full data-[orientation=vertical]:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
