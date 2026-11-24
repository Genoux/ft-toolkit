import { Slot } from "radix-ui";
import type * as React from "react";
import {
  toneColorClassName,
  toneTextClassName,
  toneTintClassName,
} from "../internal/tone-styles";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Tooltip } from "./tooltip";

type ToggleProps =
  | { pressed?: undefined; pressedLabel?: undefined }
  | { pressed: boolean; pressedLabel: string };

type IconButtonProps = Omit<React.ComponentProps<typeof Button>, "aria-label" | "aria-pressed"> &
  ToggleProps & {
    label: string;
    /** A longer explanation than the label, shown on hover and focus; the label stays the accessible name. */
    tooltip?: React.ReactNode;
    tooltipSide?: React.ComponentProps<typeof Tooltip>["side"];
    /** A dot in the corner for something unseen, such as unread notifications; say so in the label too. */
    indicator?: boolean;
    /** `warning` tints the button to flag that its action is due, such as a rerun after the rules changed. */
    tone?: "default" | "warning";
  };

const warningToneClassName = cn(
  "border-transparent shadow-none hover:bg-tone-tint-hover data-[state=open]:bg-tone-tint-hover data-popup-open:bg-tone-tint-hover",
  toneTintClassName,
  toneColorClassName.warning,
  toneTextClassName,
);

// Toggles name the next action ("Show filters" / "Hide filters") instead of setting aria-pressed:
// a label that already states the result would be read as "Hide filters, pressed".
function IconButton({
  label,
  pressed,
  pressedLabel,
  tooltip,
  tooltipSide,
  indicator = false,
  tone = "default",
  variant = "secondary",
  size = "icon",
  asChild,
  type,
  className,
  children,
  ...props
}: IconButtonProps) {
  const currentLabel = pressed ? pressedLabel : label;
  const toggleVariant = pressed ? "default" : "secondary";
  const currentVariant = pressed === undefined ? (variant ?? "secondary") : toggleVariant;
  return (
    <Tooltip content={tooltip ?? currentLabel} side={tooltipSide}>
      <Button
        aria-label={currentLabel}
        variant={currentVariant}
        size={size}
        asChild={asChild}
        type={asChild ? type : (type ?? "button")}
        data-tone={tone === "default" ? undefined : tone}
        className={cn(
          tone === "warning" && warningToneClassName,
          indicator && "relative",
          className,
        )}
        {...props}
      >
        <Slot.Slottable>{children}</Slot.Slottable>
        {indicator ? (
          <span
            aria-hidden
            data-slot="icon-button-indicator"
            className="pointer-events-none absolute top-0.5 right-0.5 size-2 rounded-full bg-info ring-2 ring-background"
          />
        ) : null}
      </Button>
    </Tooltip>
  );
}

export { IconButton };
