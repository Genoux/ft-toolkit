import type { MouseEvent } from "react";

/** A disabled link leaves the tab order and cancels its click, so neither pointer nor Enter navigates. */
export function navLinkActivationProps(disabled: boolean | undefined, onNavigate?: () => void) {
  return {
    "aria-disabled": disabled || undefined,
    tabIndex: disabled ? -1 : undefined,
    onClick: (event: MouseEvent) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onNavigate?.();
    },
  };
}
