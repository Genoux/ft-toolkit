import * as React from "react"

import { cn } from "../lib/utils"
import { controlSurfaceClassName, fieldReadOnlyClassName } from "../internal/control-styles"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        controlSurfaceClassName,
        fieldReadOnlyClassName,
        "flex field-sizing-content min-h-20 w-full resize-none rounded-lg px-4 py-2.5 text-base md:text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
