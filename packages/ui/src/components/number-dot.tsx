interface NumberDotProps {
  count: number;
}

export function NumberDot({ count }: NumberDotProps) {
  if (count <= 0) return null;

  return (
    <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted-foreground/10 px-1 text-xs font-medium text-muted-foreground tabular-nums">
      {count}
    </span>
  );
}
