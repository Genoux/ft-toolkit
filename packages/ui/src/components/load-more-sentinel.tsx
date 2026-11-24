import type { Ref } from "react";
import { cn } from "../lib/utils";
import { Spinner } from "./spinner";

export function LoadMoreSentinel({
  sentinelRef,
  isLoading = false,
  className,
}: {
  sentinelRef: Ref<HTMLDivElement>;
  /** Shows a spinner row above the sentinel while the next page is fetched. */
  isLoading?: boolean;
  className?: string;
}) {
  return (
    <>
      {isLoading ? (
        <div data-slot="load-more-status" className="flex justify-center py-3">
          <Spinner label="Loading more" />
        </div>
      ) : null}
      <div ref={sentinelRef} className={cn("h-px w-full shrink-0", className)} aria-hidden />
    </>
  );
}
