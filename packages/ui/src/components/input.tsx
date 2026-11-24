import * as React from "react"

import { cn } from "../lib/utils"
import {
  type ControlSize,
  controlHeightBySizeAttributeClassName,
  controlSurfaceClassName,
  fieldRadiusClassName,
  fieldReadOnlyClassName,
} from "../internal/control-styles"

// `size` replaces the native character-width attribute: width comes from CSS here, and a shared
// sm/default scale keeps an input level with Select and Button in the same row.
function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & { size?: ControlSize }) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        controlSurfaceClassName,
        fieldRadiusClassName,
        controlHeightBySizeAttributeClassName,
        fieldReadOnlyClassName,
        "w-full min-w-0 px-4 text-base data-[size=sm]:px-3.5 md:text-sm selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
