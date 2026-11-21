import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex min-w-0 flex-col gap-(--gap-lg) rounded-xl border border-border bg-card p-(--card-padding) text-card-foreground shadow-hairline",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
