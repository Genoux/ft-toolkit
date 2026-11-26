"use client"

import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlert } from "lucide-react"

import { cn } from "../lib/utils"
import { Label } from "./label"
import { Separator } from "./separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:mb-2 data-[variant=label]:text-sm",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-6 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-(--gap-lg)",
        className
      )}
      {...props}
    />
  )
}

/** Two fields side by side from the sm breakpoint, stacked below it. The column gap is the one the
 * choice-card RadioGroup and `Grid gap="md"` use, so cards and the fields under them share columns. */
function FieldRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-row"
      className={cn(
        "grid grid-cols-1 gap-x-(--gap-md) gap-y-6 sm:grid-cols-2",
        className
      )}
      {...props}
    />
  )
}

// Beside a label and description, a control centres on the label's first 20px line: the 16px
// checkbox and radio move down 2px, the 22px switch up 1px and the 18px small switch down 1px.
const fieldVariants = cva(
  "group/field flex w-full gap-(--gap-sm)",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox]]:mt-0.5 has-[>[data-slot=field-content]]:[&>[role=radio]]:mt-0.5",
          "has-[>[data-slot=field-content]]:[&>[data-slot=switch][data-size=default]]:-mt-px has-[>[data-slot=field-content]]:[&>[data-slot=switch][data-size=sm]]:mt-px",
        ],
        responsive: [
          "flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox]]:mt-0.5 @md/field-group:has-[>[data-slot=field-content]]:[&>[role=radio]]:mt-0.5",
          "@md/field-group:has-[>[data-slot=field-content]]:[&>[data-slot=switch][data-size=default]]:-mt-px @md/field-group:has-[>[data-slot=field-content]]:[&>[data-slot=switch][data-size=sm]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  required,
  optional,
  children,
  ...props
}: React.ComponentProps<typeof Label> & {
  /** Shows the marker and tells screen readers; still set `required` on the control itself. */
  required?: boolean
  /** A muted "(optional)" after the label. Mark whichever kind is rarer in the form, not both. */
  optional?: boolean
}) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-input has-[>[data-slot=field]]:bg-card has-[>[data-slot=field]]:shadow-hairline [&>*]:data-[slot=field]:px-4 [&>*]:data-[slot=field]:py-3",
        "has-[>[data-slot=field]]:transition-[background-color,border-color,box-shadow] has-[>[data-slot=field]]:duration-(--duration-fast) has-[>[data-slot=field]]:ease-out-expo has-[>[data-slot=field]]:hover:border-ring/60",
        "has-[>[data-slot=field]]:has-focus-visible:focus-ring",
        "has-[>[data-slot=field]]:has-data-[state=checked]:border-primary has-[>[data-slot=field]]:has-data-[state=checked]:bg-muted/60",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <>
          <span data-slot="field-required" aria-hidden className="-ml-1.5 text-destructive">
            *
          </span>
          <span className="sr-only">(required)</span>
        </>
      )}
      {optional && (
        <span data-slot="field-optional" className="-ml-1 font-normal text-muted-foreground">
          (optional)
        </span>
      )}
    </Label>
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-xs font-normal text-muted-foreground group-has-[[data-orientation=horizontal]]/field:text-balance group-data-[disabled=true]/field:opacity-50",
        "-mt-0.5 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-xs group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-subtle-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "-mt-0.5 flex items-start gap-1.5 text-xs font-normal text-destructive",
        className
      )}
      {...props}
    >
      <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      <div className="min-w-0">{content}</div>
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldRow,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
