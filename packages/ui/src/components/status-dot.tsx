import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";

const DOT_TONE = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
  neutral: "bg-subtle-foreground",
} as const;

type StatusDotProps = Omit<ComponentProps<"span">, "children"> & {
  label: ReactNode;
  tone?: keyof typeof DOT_TONE;
  /** A slow halo for live or processing states; static under reduced motion. */
  pulse?: boolean;
  /** A CSS colour for an app's own category (`var(--color-turn-people)`); it replaces the tone's dot colour. */
  color?: string;
  /** `lg` is a headline status (a card's "Finance approval"): a 10px dot, and the label keeps the size around it. */
  size?: "default" | "lg";
  /** A line under the label ("Draft, effective Jul 1"). It starts under the label, not under the dot, so never
   * put a separate paragraph under a StatusDot. */
  description?: ReactNode;
};

// In em, not px: the dot and its gap follow the label's size, so a 13px table cell and a 16px
// headline status keep the same proportions (Polaris and Spark use 8 to 10px beside 13 to 14px text).
const DOT_SIZE = { default: "size-[0.5em]", lg: "size-[0.75em]" } as const;
const DOT_GAP = "gap-x-[0.75em]";

function StatusDot({
  label,
  tone = "neutral",
  pulse = false,
  color,
  size = "default",
  description,
  className,
  ...props
}: StatusDotProps) {
  const dotClassName = color ? undefined : DOT_TONE[tone];
  const dotStyle = color ? { backgroundColor: color } : undefined;
  return (
    <span
      data-slot="status-dot"
      data-tone={tone}
      data-pulse={pulse || undefined}
      data-size={size}
      className={cn(
        description
          ? "inline-grid grid-cols-[auto_minmax(0,1fr)] items-center"
          : "inline-flex items-center whitespace-nowrap",
        DOT_GAP,
        size === "default" && "text-table",
        tone === "neutral" && !color ? "text-muted-foreground" : "text-foreground",
        className,
      )}
      {...props}
    >
      <span aria-hidden className={cn("relative inline-flex shrink-0", DOT_SIZE[size])}>
        {pulse ? (
          <span
            className={cn(
              "absolute inset-0 animate-dot-pulse rounded-full motion-reduce:hidden",
              dotClassName,
            )}
            style={dotStyle}
          />
        ) : null}
        <span className={cn("relative rounded-full", DOT_SIZE[size], dotClassName)} style={dotStyle} />
      </span>
      {description ? (
        <>
          <span className="min-w-0">{label}</span>
          <span
            data-slot="status-dot-description"
            className="col-start-2 min-w-0 text-xs font-normal text-muted-foreground"
          >
            {description}
          </span>
        </>
      ) : (
        label
      )}
    </span>
  );
}

export { StatusDot };
