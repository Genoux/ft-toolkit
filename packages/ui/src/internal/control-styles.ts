// A .ts file under components is outside the package's `./components/*` (.tsx) export: these
// strings are shared by the form controls without becoming public API.

/** `default` (h-10) for forms and the page toolbar; `sm` (h-9) for a compact row inside a card or panel. */
export type ControlSize = "sm" | "default";

/** One height scale for every single-line control, so mixed rows line up. */
export const controlHeightClassName = {
  xs: "h-8",
  sm: "h-9",
  default: "h-10",
  lg: "h-11",
} as const;

export const controlSquareClassName = {
  "2xs": "size-7",
  xs: "size-8",
  sm: "size-9",
  default: "size-10",
  lg: "size-11",
} as const;

/** The same scale for controls that read their size from `data-size`. */
export const controlHeightBySizeAttributeClassName = "data-[size=sm]:h-9 data-[size=default]:h-10";

/** Fields are rounded-lg in forms and dialogs; in the page toolbar (search and filters on the shell) they are pills like the buttons beside them. */
export const fieldRadiusClassName = "rounded-lg in-data-[slot=page-toolbar]:rounded-full";

export const controlSurfaceClassName = [
  "border border-input bg-card shadow-hairline outline-none dark:bg-input/30",
  "transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) ease-out-expo",
  "hover:border-ring/60",
  "focus-visible:focus-ring",
  "aria-invalid:border-destructive",
].join(" ");

/** A read-only field keeps its value at full contrast on a muted surface; `:read-only` also matches
 * buttons and disabled fields, so only text fields use it. */
export const fieldReadOnlyClassName =
  "read-only:not-disabled:bg-muted/60 read-only:not-disabled:shadow-none read-only:not-disabled:hover:border-input";

/** Grows a small toggle's pointer target to at least 32px without moving the layout. */
export const toggleHitAreaClassName = "relative after:absolute after:-inset-x-3 after:-inset-y-2";

/** Inside a choice card, the card draws the focus ring; the control's own ring would double it. */
export const choiceCardControlClassName =
  "in-[[data-slot=field-label]:has(>[data-slot=field])]:focus-visible:outline-none";

/** A picked-value pill (Chip, ComboboxChip): one look, the height comes from the caller. */
export const chipClassName =
  "inline-flex min-w-0 shrink-0 items-center rounded-full bg-muted font-medium whitespace-nowrap text-foreground";

/** The remove button inside a chip: ghost on the muted pill, so its hover darkens the pill tone. */
export const chipRemoveClassName =
  "text-muted-foreground hover:bg-foreground/8 hover:text-foreground";

export const listboxPanelClassName =
  "rounded-xl bg-popover text-popover-foreground shadow-elevated ring-1 ring-foreground/5";

// Panel rounded-xl (16px) with p-1 (4px) leaves 12px for the items, so they are rounded-lg (12px).
export const listboxPanelPaddingClassName = "p-1";

export const listboxItemClassName = [
  "relative flex min-h-9 w-full cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-hidden select-none focus-visible:focus-ring-inset pointer-coarse:min-h-10",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
].join(" ");

export const listboxIndicatorClassName =
  "pointer-events-none absolute right-2.5 flex size-4 items-center justify-center text-foreground";

export const listboxLabelClassName = "px-2.5 pt-2 pb-1 text-xs text-subtle-foreground";

export const listboxSeparatorClassName = "pointer-events-none -mx-1 my-1 h-px bg-border";

const panelSlide =
  "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1";

export const radixPanelMotionClassName = [
  "duration-(--duration-base) ease-out-expo",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-97",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-97 data-[state=closed]:duration-(--duration-fast)",
  panelSlide,
].join(" ");

export const baseUiPanelMotionClassName = [
  "duration-(--duration-base) ease-out-expo",
  "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-97",
  "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-97 data-closed:duration-(--duration-fast)",
  panelSlide,
].join(" ");
