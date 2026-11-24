import { useReducedMotion } from "motion/react";
import { EASING_FUNCTION } from "../lib/easing";

const DURATION_BASE_SECONDS = 0.2;
const DURATION_FAST_SECONDS = 0.12;

export const overlayClassName = "fixed inset-0 z-50 bg-black/20";

export const overlayPanelClassName =
  "bg-popover text-popover-foreground shadow-elevated ring-1 ring-foreground/5";

// One width scale for Dialog, AlertDialog and DestructiveActionDialog. 28rem is the floor: narrower,
// a sentence of copy and a two-button footer wrap into a cramped column (shadcn's dialogs are 32rem).
export const dialogWidthClassName = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
} as const;

export function useOverlayMotion() {
  const reduceMotion = useReducedMotion();
  const hiddenScale = reduceMotion ? 1 : 0.98;
  const enter = { duration: DURATION_BASE_SECONDS, ease: EASING_FUNCTION.exponential };
  const exit = { duration: DURATION_FAST_SECONDS, ease: EASING_FUNCTION.exponential };

  return {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: enter },
      exit: { opacity: 0, transition: exit },
    },
    panel: {
      initial: { opacity: 0, scale: hiddenScale },
      animate: { opacity: 1, scale: 1, transition: enter },
      exit: { opacity: 0, scale: hiddenScale, transition: exit },
    },
  };
}
