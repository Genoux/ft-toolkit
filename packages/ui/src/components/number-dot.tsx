import { cn } from "../lib/utils";

interface NumberDotProps {
  count: number;
  className?: string;
}

export function NumberDot({ count, className }: NumberDotProps) {
  if (count <= 0) return null;

  return (
    <span
      data-slot="number-dot"
      className={cn(
        "ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted-foreground/10 px-1 text-2xs font-medium text-muted-foreground tabular-nums",
        className,
      )}
    >
      {count}
    </span>
  );
}
