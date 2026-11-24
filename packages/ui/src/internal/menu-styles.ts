import { cn } from "../lib/utils";
import {
  listboxIndicatorClassName,
  listboxItemClassName,
  listboxLabelClassName,
  listboxPanelClassName,
  listboxPanelPaddingClassName,
  listboxSeparatorClassName,
  radixPanelMotionClassName,
} from "./control-styles";

export const menuContentClassName = cn(
  listboxPanelClassName,
  radixPanelMotionClassName,
  listboxPanelPaddingClassName,
  "z-50 min-w-36 overflow-x-hidden overflow-y-auto",
);

export const menuItemClassName = cn(
  listboxItemClassName,
  "cursor-pointer transition-colors duration-(--duration-fast) ease-out-expo",
  "focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8.5",
  "data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive-foreground data-[variant=destructive]:[&_svg]:text-destructive!",
);

export const menuCheckableItemClassName = cn(menuItemClassName, "pr-9");

export const menuSubTriggerClassName = cn(
  menuItemClassName,
  "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
);

export const menuIndicatorClassName = listboxIndicatorClassName;

export const menuLabelClassName = cn(listboxLabelClassName, "data-[inset]:pl-8.5");

export const menuSeparatorClassName = listboxSeparatorClassName;

// The extra `kbd` keeps this selector more specific than the item's `[&_svg]:size-4`.
export const menuShortcutClassName =
  "ml-auto inline-flex items-center gap-0.5 ps-4 text-xs tracking-wide text-subtle-foreground tabular-nums [&_kbd_svg:not([class*='size-'])]:size-3";
