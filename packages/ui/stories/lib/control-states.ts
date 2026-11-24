// Static stand-ins for :hover and :focus-visible, so one canvas shows every state; they mirror
// controlSurfaceClassName in src/internal/control-styles.ts. The focus ring is important: Tailwind
// orders the bare `focus-ring` before the controls' own `outline-none`, which would hide it.
export const SIMULATED_STATE_CLASS = {
  hover: "border-ring/60",
  focus: "focus-ring!",
} as const;

export const CONTROL_STATES = ["default", "hover", "focus-visible", "disabled", "invalid"] as const;

export type ControlState = (typeof CONTROL_STATES)[number];

export function stateProps(state: ControlState) {
  return {
    className:
      state === "hover"
        ? SIMULATED_STATE_CLASS.hover
        : state === "focus-visible"
          ? SIMULATED_STATE_CLASS.focus
          : undefined,
    disabled: state === "disabled",
    "aria-invalid": state === "invalid" || undefined,
  };
}
