import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";

// Parts for a figure, not a card: the page picks the container (a Card, a cycle header, a donut's
// centre) and lays it out for its own content. Tremor's KPI is Card + Text + Metric and shadcn's
// dashboard cards are plain Card parts; neither ships a stat card, so neither do we.

// A Skeleton placed inside a figure or meta line sits on that line at the text's height, so nothing
// moves when the number lands. The page gives it a width.
const SKELETON_ON_LINE =
  "*:data-[slot=skeleton]:inline-block *:data-[slot=skeleton]:h-[0.8em] *:data-[slot=skeleton]:align-middle";

/** A figure with its label and context, stacked with a tight gap. It sets no padding or surface. */
function Stat({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="stat"
      className={cn("flex min-w-0 flex-col gap-(--gap-xs)", className)}
      {...props}
    />
  );
}

/** What the figure counts: "Total paid". An InfoHint may follow the words. */
function StatLabel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-label"
      className={cn(
        "flex min-w-0 items-center gap-(--gap-xs) text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

// Each role carries its weight: stat-sm is semibold because a 20px figure in medium reads lighter
// than the CardTitle above it; stat and display carry themselves at medium.
const VALUE_SIZE = {
  sm: "text-stat-sm",
  default: "text-stat",
  lg: "text-display",
} as const;

const VALUE_TONE = {
  default: undefined,
  success: "text-success-foreground",
  warning: "text-warning-foreground",
  destructive: "text-destructive-foreground",
} as const;

type StatValueProps = ComponentProps<"div"> & {
  /** `sm` a secondary figure (several in one card, a step's date), `default` a card figure, `lg` the one hero figure on a page. */
  size?: keyof typeof VALUE_SIZE;
  /** Colours the figure when it is the signal: a change above guidance, a pay past its band. Say why in a StatMeta; colour alone is not read out. */
  tone?: keyof typeof VALUE_TONE;
};

/** The figure, in tabular numerals. While it loads, put a `Skeleton` with a width inside. */
function StatValue({ size = "default", tone = "default", className, ...props }: StatValueProps) {
  return (
    <div
      data-slot="stat-value"
      data-size={size}
      data-tone={tone}
      className={cn(
        "tabular-nums",
        VALUE_SIZE[size],
        VALUE_TONE[tone],
        SKELETON_ON_LINE,
        className,
      )}
      {...props}
    />
  );
}

/** A context line under the figure: "of 40 profiles for Nutramax". Lead it with a StatDelta to colour a change. */
function StatMeta({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-meta"
      className={cn("text-xs text-subtle-foreground tabular-nums", SKELETON_ON_LINE, className)}
      {...props}
    />
  );
}

const DELTA_ICON = { up: ArrowUpRight, down: ArrowDownRight, flat: ArrowRight } as const;

const DELTA_TONE = {
  positive: "text-success-foreground",
  negative: "text-destructive-foreground",
  neutral: "text-muted-foreground",
} as const;

type StatDeltaProps = Omit<ComponentProps<"span">, "children"> & {
  /** The change as the reader should see it: "+8.2%", "-14". */
  value: ReactNode;
  direction: keyof typeof DELTA_ICON;
  /** Whether the change is good news. Defaults to up positive, down negative; pass it when lower is better (churn, cost). */
  tone?: keyof typeof DELTA_TONE;
};

/** A coloured change figure with its arrow, for the start of a StatMeta line. */
function StatDelta({ value, direction, tone, className, ...props }: StatDeltaProps) {
  const Icon = DELTA_ICON[direction];
  const resolvedTone =
    tone ?? (direction === "up" ? "positive" : direction === "down" ? "negative" : "neutral");
  return (
    <span
      data-slot="stat-delta"
      data-tone={resolvedTone}
      className={cn(
        "inline-flex items-baseline gap-1 font-medium tabular-nums",
        DELTA_TONE[resolvedTone],
        className,
      )}
      {...props}
    >
      <Icon aria-hidden className="size-3.5 shrink-0 self-center" />
      {value}
    </span>
  );
}

export { Stat, StatDelta, StatLabel, StatMeta, StatValue };
