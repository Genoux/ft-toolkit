// A toned surface takes its tint, text, dot and solid fill from one colour, `--tone`, through the
// tone colours in theme.css, so they stay one hue family whatever a brand layer swaps in.
export const toneTextClassName = "text-tone-ink";

export const toneTintClassName = "bg-tone-tint";

export const toneSolidClassName = "bg-tone-solid text-background";

export const toneColorClassName = {
  success: "[--tone:var(--color-success)]",
  warning: "[--tone:var(--color-warning)]",
  info: "[--tone:var(--color-info)]",
  destructive: "[--tone:var(--color-destructive)]",
} as const;
