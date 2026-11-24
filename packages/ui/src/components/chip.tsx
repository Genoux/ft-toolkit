import { XIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  chipClassName,
  chipRemoveClassName,
  controlHeightClassName,
} from "../internal/control-styles";
import { cn } from "../lib/utils";
import { IconButton } from "./icon-button";

type ChipProps = Omit<ComponentProps<"span">, "children"> & {
  children: ReactNode;
  /** A lucide icon or a PersonAvatar before the label. */
  icon?: ReactNode;
  /** Shows the remove button; without it the chip is a plain pill. */
  onRemove?: () => void;
  /** The remove button's name; defaults to "Remove <label>" for a text label. */
  removeLabel?: string;
  /** `sm` (h-9) in a compact row; `default` (h-10) beside default buttons and in the page toolbar. */
  size?: "sm" | "default";
  disabled?: boolean;
};

const SIZE_CLASS_NAME = {
  sm: cn(
    controlHeightClassName.sm,
    "gap-1.5 pl-3 pr-3.5 text-sm has-[>[data-slot=chip-icon]>[data-slot=avatar]]:pl-1 has-data-[slot=chip-remove]:pr-0.5",
  ),
  default: cn(
    controlHeightClassName.default,
    "gap-1.5 pl-3.5 pr-4 text-sm has-[>[data-slot=chip-icon]>[data-slot=avatar]]:pl-1.5 has-data-[slot=chip-remove]:pr-1",
  ),
} as const;

/** A removable pill for a picked value: a staged file, an applied filter, an invited person. */
function Chip({
  children,
  icon,
  onRemove,
  removeLabel,
  size = "default",
  disabled = false,
  className,
  ...props
}: ChipProps) {
  const removeName = removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove");
  return (
    <span
      data-slot="chip"
      data-size={size}
      data-disabled={disabled || undefined}
      className={cn(
        chipClassName,
        "max-w-full data-disabled:opacity-50",
        SIZE_CLASS_NAME[size],
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          data-slot="chip-icon"
          className="flex shrink-0 items-center [&>svg]:size-4 [&>svg]:text-muted-foreground"
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 truncate">{children}</span>
      {onRemove ? (
        <IconButton
          data-slot="chip-remove"
          label={removeName}
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          onClick={onRemove}
          className={chipRemoveClassName}
        >
          <XIcon />
        </IconButton>
      ) : null}
    </span>
  );
}

export { Chip };
