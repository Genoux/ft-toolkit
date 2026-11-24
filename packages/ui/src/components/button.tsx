import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "../lib/utils"
import { controlHeightClassName, controlSquareClassName } from "../internal/control-styles"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,opacity,scale] duration-(--duration-fast) ease-out-expo outline-none select-none active:not-aria-[haspopup]:scale-98 focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50 aria-busy:disabled:opacity-100 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90! data-popup-open:bg-primary/90 data-[state=open]:bg-primary/90",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-(--destructive-hover) disabled:opacity-60 data-popup-open:bg-(--destructive-hover) data-[state=open]:bg-(--destructive-hover) [--destructive-hover:color-mix(in_oklab,var(--color-destructive),var(--color-foreground)_15%)]",
        outline:
          "border border-input bg-card text-foreground shadow-hairline hover:bg-muted data-popup-open:bg-muted data-[state=open]:bg-muted dark:bg-input/30 dark:hover:bg-input/50 dark:data-popup-open:bg-input/50 dark:data-[state=open]:bg-input/50",
        secondary:
          "bg-muted text-secondary-foreground hover:bg-accent data-popup-open:bg-accent data-[state=open]:bg-accent",
        ghost:
          "hover:bg-muted hover:text-foreground data-popup-open:bg-muted data-popup-open:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
        dots: "self-center border-0 text-muted-foreground hover:bg-muted hover:text-foreground pointer-fine:in-data-row:opacity-0 [[data-row]:hover_&]:opacity-100 [[data-row]:focus-within_&]:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 data-[state=open]:bg-muted data-[state=open]:text-foreground [&_svg:not([class*='size-'])]:size-3.5",
      },
      size: {
        default: cn(
          controlHeightClassName.default,
          "gap-2 px-4 has-[>svg:not([data-icon=inline-end])]:pl-3.5 has-data-[icon=inline-end]:pr-3.5",
        ),
        xs: cn(
          controlHeightClassName.xs,
          "gap-1.5 px-3 has-[>svg:not([data-icon=inline-end])]:pl-2.5 has-data-[icon=inline-end]:pr-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        ),
        sm: cn(
          controlHeightClassName.sm,
          "gap-1.5 px-3.5 has-[>svg:not([data-icon=inline-end])]:pl-3 has-data-[icon=inline-end]:pr-3",
        ),
        lg: cn(
          controlHeightClassName.lg,
          "gap-2 px-6 has-[>svg:not([data-icon=inline-end])]:pl-5 has-data-[icon=inline-end]:pr-5",
        ),
        icon: controlSquareClassName.default,
        "icon-2xs": cn(controlSquareClassName["2xs"], "[&_svg:not([class*='size-'])]:size-3.5"),
        "icon-xs": cn(controlSquareClassName.xs, "[&_svg:not([class*='size-'])]:size-3.5"),
        "icon-sm": controlSquareClassName.sm,
        "icon-lg": cn(controlSquareClassName.lg, "[&_svg:not([class*='size-'])]:size-5"),
      },
    },
    compoundVariants: [
      {
        variant: "dots",
        size: ["default", "xs", "sm", "lg"],
        class:
          "size-7 p-0 has-[>svg:not([data-icon=inline-end])]:pl-0 has-data-[icon=inline-end]:pr-0",
      },
      // A dots menu beside a page header's buttons takes their icon size, so the row keeps one height.
      {
        variant: "dots",
        size: ["icon-sm", "icon", "icon-lg"],
        class: "[&_svg:not([class*='size-'])]:size-4",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function isIcon(node: React.ReactNode): node is React.ReactElement<{ "data-icon"?: string }> {
  if (!React.isValidElement(node) || node.type === React.Fragment) return false
  return typeof node.type !== "string" || node.type === "svg"
}

function ButtonSpinner({ end = false }: { end?: boolean }) {
  return (
    <Loader2
      aria-hidden
      data-slot="button-spinner"
      data-icon={end ? "inline-end" : "inline-start"}
      className="animate-spin motion-reduce:animate-none"
    />
  )
}

// The button keeps its width and its label: the spinner takes the leading icon's slot, else the
// trailing icon's. A text-only button has no slot to give, and adding one would widen it, so the
// spinner sits over the label, which stays in the accessible name (opacity, not visibility).
function LoadingContent({ children }: { children: React.ReactNode }) {
  const nodes = React.Children.toArray(children)
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  if (isIcon(first) && first.props["data-icon"] !== "inline-end") {
    return (
      <>
        <ButtonSpinner />
        {nodes.slice(1)}
      </>
    )
  }
  if (nodes.length > 1 && isIcon(last) && last.props["data-icon"] === "inline-end") {
    return (
      <>
        {nodes.slice(0, -1)}
        <ButtonSpinner end />
      </>
    )
  }
  return (
    <span className="grid place-items-center *:col-start-1 *:row-start-1">
      <ButtonSpinner />
      <span className="opacity-0">{children}</span>
    </span>
  )
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Shows a spinner in place of the leading icon, else the trailing icon, else over the label, so the width never changes; disables the button; ignored with asChild. */
    loading?: boolean
  }) {
  const isLoading = loading && !asChild
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {isLoading ? <LoadingContent>{children}</LoadingContent> : children}
    </Comp>
  )
}

export { Button, buttonVariants }
