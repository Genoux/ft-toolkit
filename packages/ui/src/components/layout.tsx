import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { growWithEmptyStateClassName } from "../internal/empty-state-fill";
import { cn } from "../lib/utils";

const GAP = {
  none: "gap-0",
  xs: "gap-(--gap-xs)",
  sm: "gap-(--gap-sm)",
  md: "gap-(--gap-md)",
  lg: "gap-(--gap-lg)",
  xl: "gap-(--gap-xl)",
} as const;

const ALIGN = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
} as const;

const JUSTIFY = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

/** `xs` a label and its hint, `sm` an icon and its text or a group of buttons, `md` items of a list, `lg` blocks inside a card or form, `xl` groups of blocks. */
type Gap = keyof typeof GAP;

type LayoutProps = ComponentProps<"div"> & {
  gap?: Gap;
  align?: keyof typeof ALIGN;
  /** Renders the child element instead of a div, for a `ul`, `form` or `section`. */
  asChild?: boolean;
};

/** Children one under the other. */
function Stack({ gap = "md", align = "stretch", asChild = false, className, ...props }: LayoutProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="stack"
      className={cn(
        "flex min-w-0 flex-col",
        growWithEmptyStateClassName,
        GAP[gap],
        ALIGN[align],
        className,
      )}
      {...props}
    />
  );
}

type InlineProps = LayoutProps & {
  justify?: keyof typeof JUSTIFY;
  /** Wraps to the next line when the row runs out of room; turn off only when children truncate. */
  wrap?: boolean;
};

/** Children side by side, centred on one line, wrapping on narrow screens. */
function Inline({
  gap = "sm",
  align = "center",
  justify = "start",
  wrap = true,
  asChild = false,
  className,
  ...props
}: InlineProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="inline"
      className={cn(
        "flex min-w-0",
        wrap ? "flex-wrap" : "flex-nowrap",
        GAP[gap],
        ALIGN[align],
        JUSTIFY[justify],
        className,
      )}
      {...props}
    />
  );
}

const MIN_COLUMN = {
  sm: "grid-cols-[repeat(auto-fill,minmax(min(12rem,100%),1fr))]",
  md: "grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))]",
  lg: "grid-cols-[repeat(auto-fill,minmax(min(22rem,100%),1fr))]",
} as const;

const MIN_COLUMN_STRETCH = {
  sm: "grid-cols-[repeat(auto-fit,minmax(min(12rem,100%),1fr))]",
  md: "grid-cols-[repeat(auto-fit,minmax(min(16rem,100%),1fr))]",
  lg: "grid-cols-[repeat(auto-fit,minmax(min(22rem,100%),1fr))]",
} as const;

const FIXED_COLUMNS = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

type GridProps = Omit<LayoutProps, "align"> & {
  /** Narrowest a column may get; the grid fits as many columns as the width allows, one on a phone. */
  min?: keyof typeof MIN_COLUMN;
  /** A fixed count on wide screens instead of `min`, for a set that must line up, such as a featured stat and three more; one column on a phone. */
  cols?: keyof typeof FIXED_COLUMNS;
  /** `2` keeps two columns on a phone instead of one, for filters and small tiles. */
  phoneCols?: 1 | 2;
  /** With `min`: a short set widens to fill the row instead of leaving empty columns, for a few info cards rather than a catalogue. */
  stretch?: boolean;
};

/** Equal columns that reflow with the width: cards, stats, tiles. */
function Grid({
  gap = "lg",
  min = "md",
  cols,
  phoneCols = 1,
  stretch = false,
  asChild = false,
  className,
  ...props
}: GridProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="grid"
      data-cols={cols}
      className={cn(
        "grid min-w-0",
        GAP[gap],
        cols ? FIXED_COLUMNS[cols] : (stretch ? MIN_COLUMN_STRETCH : MIN_COLUMN)[min],
        phoneCols === 2 && "max-sm:grid-cols-2",
        className,
      )}
      {...props}
    />
  );
}

export { Grid, Inline, Stack };
export type { Gap };
