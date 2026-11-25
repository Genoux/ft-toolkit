"use client";

import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/utils";
import {
  controlSurfaceClassName,
  listboxIndicatorClassName,
  listboxItemClassName,
  listboxLabelClassName,
  controlHeightBySizeAttributeClassName,
  fieldRadiusClassName,
  listboxPanelClassName,
  listboxPanelPaddingClassName,
  listboxSeparatorClassName,
  radixPanelMotionClassName,
} from "../internal/control-styles";
import {
  toneColorClassName,
  toneTextClassName,
  toneTintClassName,
} from "../internal/tone-styles";
import { usePortalContainer } from "./portal-container";

// Sentinel used internally so Radix never sees two items with the same value/key.
// Consumers never deal with this — Select and SelectContent handle it transparently.
const CLEAR_SENTINEL = "__clear__";

type SelectClearableContext = { clearable: boolean; noneSelected: boolean; clearLabel: string };
const ClearableCtx = React.createContext<SelectClearableContext>({
  clearable: false,
  noneSelected: false,
  clearLabel: "Select",
});

function Select({
  clearable = false,
  clearLabel = "Select",
  value,
  onValueChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> & {
  clearable?: boolean;
  /** With `clearable`: the option that clears the value, also shown in the trigger while empty. */
  clearLabel?: string;
}) {
  const effectiveValue = clearable ? value || CLEAR_SENTINEL : value;
  const noneSelected = clearable && !value;
  const handleChange = React.useCallback(
    (v: string) => onValueChange?.(clearable && v === CLEAR_SENTINEL ? "" : v),
    [clearable, onValueChange],
  );

  return (
    <ClearableCtx.Provider value={{ clearable, noneSelected, clearLabel }}>
      <SelectPrimitive.Root
        data-slot="select"
        value={effectiveValue}
        onValueChange={handleChange}
        {...props}
      />
    </ClearableCtx.Provider>
  );
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

type SelectTriggerVariant = "default" | "ghost" | "badge";

type SelectTriggerTone = "neutral" | "success" | "warning" | "info" | "destructive";

const BADGE_TONED = cn(
  toneTintClassName,
  "hover:bg-tone-tint-hover data-[state=open]:bg-tone-tint-hover",
  toneTextClassName,
);

// The same tint and text as a toned Badge, so a status picker reads as the status pill beside it.
const badgeToneClassName: Record<SelectTriggerTone, string> = {
  neutral: "bg-muted text-foreground hover:bg-accent data-[state=open]:bg-accent",
  success: cn(BADGE_TONED, toneColorClassName.success),
  warning: cn(BADGE_TONED, toneColorClassName.warning),
  info: cn(BADGE_TONED, toneColorClassName.info),
  destructive: cn(BADGE_TONED, toneColorClassName.destructive),
};

const selectTriggerVariantClassName: Record<SelectTriggerVariant, string> = {
  default: cn(
    controlSurfaceClassName,
    fieldRadiusClassName,
    controlHeightBySizeAttributeClassName,
    "justify-between pr-3.5 pl-4 data-[size=sm]:pr-3 data-[size=sm]:pl-3.5 data-[state=open]:border-ring dark:hover:bg-input/50",
  ),
  ghost: cn(
    fieldRadiusClassName,
    controlHeightBySizeAttributeClassName,
    "justify-between px-3 text-foreground hover:bg-muted data-[state=open]:bg-muted focus-visible:focus-ring aria-invalid:ring-1 aria-invalid:ring-destructive",
  ),
  badge: cn(
    "gap-1 px-2.5 text-xs font-medium data-[size=default]:h-6 focus-visible:focus-ring disabled:cursor-default disabled:opacity-100 [&>svg:last-child]:size-3 [&>svg:last-child]:text-current [&>svg:last-child]:opacity-60 disabled:[&>svg:last-child]:hidden",
    "data-[size=lg]:h-9 data-[size=lg]:gap-1.5 data-[size=lg]:px-3.5 data-[size=lg]:text-sm data-[size=lg]:[&>svg:last-child]:size-3.5",
  ),
};

function selectTriggerClassName({
  className,
  noneSelected,
  variant = "default",
  tone = "neutral",
}: {
  className?: string;
  noneSelected?: boolean;
  variant?: SelectTriggerVariant;
  /** The badge variant's tint, for a status picker that reads as the status pill. */
  tone?: SelectTriggerTone;
} = {}) {
  return cn(
    "flex w-fit items-center gap-1.5 rounded-full text-sm whitespace-nowrap outline-none transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-out-expo data-placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
    "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-subtle-foreground",
    "[&>svg:last-child]:transition-transform [&>svg:last-child]:duration-(--duration-base) [&>svg:last-child]:ease-out-expo data-[state=open]:[&>svg:last-child]:rotate-180",
    selectTriggerVariantClassName[variant],
    variant === "badge" && badgeToneClassName[tone],
    noneSelected && "text-muted-foreground",
    className,
  );
}

type SelectTriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger> &
  (
    | { variant?: "default" | "ghost"; size?: "sm" | "default"; tone?: never }
    | {
        variant: "badge";
        /** `default` matches Badge's `md` in a table row; `lg` matches the `icon-sm` buttons beside a page or section header's status. */
        size?: "default" | "lg";
        /** Tints the pill with a status tone. */
        tone?: SelectTriggerTone;
      }
  );

/** The badge variant keeps its own height. */
function SelectTrigger({
  className,
  size = "default",
  variant = "default",
  tone,
  children,
  ...props
}: SelectTriggerProps) {
  const { noneSelected } = React.useContext(ClearableCtx);

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-variant={variant}
      data-tone={variant === "badge" ? (tone ?? "neutral") : undefined}
      className={selectTriggerClassName({ className, noneSelected, variant, tone })}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 text-subtle-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const { clearable, clearLabel } = React.useContext(ClearableCtx);
  const portalContainer = usePortalContainer();
  const isItemAligned = position === "item-aligned";

  return (
    <SelectPrimitive.Portal container={portalContainer ?? undefined}>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={isItemAligned}
        className={cn(
          listboxPanelClassName,
          radixPanelMotionClassName,
          "data-[align-trigger=true]:animate-none",
          "relative z-60 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto",
          position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            listboxPanelPaddingClassName,
            position === "popper" &&
            "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1.5",
          )}
        >
          {clearable && (
            <SelectPrimitive.Item
              value={CLEAR_SENTINEL}
              className={cn(listboxItemClassName, "pr-9 text-muted-foreground focus:bg-muted")}
            >
              <SelectPrimitive.ItemText>{clearLabel}</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
          )}
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(listboxLabelClassName, className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        listboxItemClassName,
        "pr-9 focus:bg-muted focus:text-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2.5",
        className,
      )}
      {...props}
    >
      <span data-slot="select-item-indicator" className={listboxIndicatorClassName}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(listboxSeparatorClassName, className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex items-center justify-center py-1 text-subtle-foreground", className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex items-center justify-center py-1 text-subtle-foreground", className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectTriggerClassName,
};
