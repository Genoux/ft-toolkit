import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import {
  toneColorClassName,
  toneTextClassName,
  toneTintClassName,
} from "../internal/tone-styles";
import { cn } from "../lib/utils";

// A toned alert reads in one colour family, like Radix Themes' soft Callout: the frame takes the tone's
// tint, the icon, title and description its text colour (AA on the tint, checked in theme.test.ts), and
// a secondary Button in AlertAction a step deeper tint instead of the neutral grey fill.
const TONED = [
  toneTintClassName,
  toneTextClassName,
  "*:data-[slot=alert-description]:text-current",
  "[&_[data-slot=alert-action]_[data-variant=secondary]]:bg-tone-tint-hover [&_[data-slot=alert-action]_[data-variant=secondary]]:text-current",
  "[&_[data-slot=alert-action]_[data-variant=secondary]:hover]:bg-tone-tint-strong",
].join(" ");

const alertVariants = cva(
  [
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-xl border px-5 py-4 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:text-current",
    // The icon centres on the first text line: the title's, or the smaller description's when there
    // is no title (the icon takes that text size so 1lh is that line).
    "[&>svg]:mt-[calc(0.5lh-0.5rem)] not-has-[>[data-slot=alert-title]]:[&>svg]:text-xs",
    "has-[>[data-slot=alert-description]]:*:data-[slot=alert-action]:row-[1/span_2]",
    "has-[>[data-slot=alert-action]]:not-has-[>[data-slot=alert-description]]:items-center has-[>[data-slot=alert-action]]:not-has-[>[data-slot=alert-description]]:[&>svg]:mt-0",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground [&>svg]:text-muted-foreground",
        info: cn(
          TONED,
          "border-(--tone)/25",
          toneColorClassName.info,
        ),
        success: cn(
          TONED,
          "border-(--tone)/25",
          toneColorClassName.success,
        ),
        warning: cn(
          TONED,
          "border-(--tone)/35",
          toneColorClassName.warning,
        ),
        destructive: cn(
          TONED,
          "border-(--tone)/25",
          toneColorClassName.destructive,
        ),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Only problems interrupt the reader: an assertive alert inserted after data loads cuts off what
// the screen reader was saying, which a static info or success banner has no reason to do.
const ALERT_ROLE: Record<NonNullable<VariantProps<typeof alertVariants>["variant"]>, string | undefined> = {
  default: undefined,
  info: "status",
  success: "status",
  warning: "alert",
  destructive: "alert",
};

/** An inline message. Lead with a lucide icon as the first child. A toned variant tints the frame and sets the icon, title and description in the tone's text colour; the neutral default keeps a muted icon and description. An action is a `secondary` Button, tinted to match the tone. Pass `role` to override the live-region role the variant picks. */
function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role={ALERT_ROLE[variant ?? "default"]}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 min-h-4 text-sm font-medium text-pretty", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-xs text-muted-foreground [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

/** A button or link at the end of the alert, centred against the title and description. */
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "col-start-3 row-start-1 ml-(--gap-md) flex items-center gap-(--gap-sm) self-center",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
