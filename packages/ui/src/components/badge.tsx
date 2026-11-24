import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { controlHeightClassName } from "../internal/control-styles";
import {
  toneColorClassName,
  toneSolidClassName,
  toneTextClassName,
  toneTintClassName,
} from "../internal/tone-styles";
import { cn } from "../lib/utils";

const TONED = cn(toneTintClassName, "[a&]:hover:bg-tone-tint-hover", toneTextClassName);
const SOLID = cn(toneSolidClassName, "[a&]:hover:opacity-90");
const TONE_VARIANTS: Array<"success" | "warning" | "info" | "destructive"> = [
  "success",
  "warning",
  "info",
  "destructive",
];

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent align-middle font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:focus-ring aria-invalid:border-destructive transition-[color,background-color,box-shadow,opacity] duration-(--duration-fast) ease-out-expo overflow-hidden outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "bg-muted text-foreground [a&]:hover:bg-accent",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success: toneColorClassName.success,
        warning: toneColorClassName.warning,
        info: toneColorClassName.info,
        destructive: toneColorClassName.destructive,
      },
      size: {
        sm: "h-5 gap-1 px-2 text-2xs [&>svg]:size-3",
        md: "h-6 gap-1.5 px-2.5 text-xs [&>svg]:size-3.5",
        lg: cn(controlHeightClassName.sm, "gap-1.5 px-3.5 text-sm [&>svg]:size-4"),
      },
      solid: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { variant: TONE_VARIANTS, solid: false, class: TONED },
      { variant: TONE_VARIANTS, solid: true, class: SOLID },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      solid: false,
    },
  },
);

const NEUTRAL_DOT: Partial<Record<NonNullable<BadgeProps["variant"]>, string>> = {
  default: "bg-primary-foreground",
  secondary: "bg-subtle-foreground",
  outline: "bg-subtle-foreground",
};

type BadgeProps = React.ComponentProps<"span"> &
  Omit<VariantProps<typeof badgeVariants>, "solid"> & {
    asChild?: boolean;
    /** With a status tone or `color`: a filled pill for the one item that stands out, such as the current cycle's "Now". */
    solid?: boolean;
    dot?: boolean;
    /** A CSS colour for an app's own category (`var(--color-turn-people)`): it sets the tint, the text and the dot, in place of the variant's. */
    color?: string;
  };

function Badge({
  className,
  variant = "default",
  size = "md",
  solid = false,
  dot = false,
  asChild = false,
  color,
  style,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      className={cn(
        badgeVariants({ variant: color ? null : variant, size, solid }),
        color && (solid ? SOLID : TONED),
        className,
      )}
      style={color ? ({ "--tone": color, ...style } as React.CSSProperties) : style}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden
          data-slot="badge-dot"
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            (!color && NEUTRAL_DOT[variant ?? "default"]) || (solid ? "bg-current" : "bg-(--tone)"),
          )}
        />
      ) : null}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  );
}

export { Badge, badgeVariants };
