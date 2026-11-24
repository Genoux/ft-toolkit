import { type ReactNode, useId } from "react";
import { cn } from "../lib/utils";
import { Progress } from "./progress";

type MeterProps = {
  /** Percent used, 0 to 100. */
  value: number;
  label?: ReactNode;
  /** Names the meter for screen readers ("Seats used"); without it the visible `label` names it. */
  "aria-label"?: string;
  /** Stretches the track to the container width, e.g. a usage card in a sidebar. */
  fill?: boolean;
  className?: string;
};

// A usage level, not task progress: role="meter" overrides the Radix progressbar role.
function Meter({ value, label, "aria-label": ariaLabel, fill = false, className }: MeterProps) {
  const labelId = useId();
  const percent = Math.min(100, Math.max(0, value));
  const hasLabel = label !== undefined;
  return (
    <div
      data-slot="meter"
      data-fill={fill || undefined}
      className={cn(
        "items-center gap-(--gap-sm)",
        fill ? "flex w-full" : "inline-flex align-middle",
        className,
      )}
    >
      <Progress
        role="meter"
        value={percent}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel || !hasLabel ? undefined : labelId}
        className={cn("h-1 shrink-0", fill ? "flex-1" : "w-16")}
      />
      {hasLabel ? (
        <span id={labelId} className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export { Meter };
