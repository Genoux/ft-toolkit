import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-hairline",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
