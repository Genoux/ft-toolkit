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
};

const DOT_SIZE = { default: "size-1.5", lg: "size-2.5" } as const;

function StatusDot({
  label,
  tone = "neutral",
  pulse = false,
  color,
  size = "default",
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
        "inline-flex items-center gap-(--gap-sm) whitespace-nowrap",
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
      {label}
    </span>
  );
}

export { StatusDot };
