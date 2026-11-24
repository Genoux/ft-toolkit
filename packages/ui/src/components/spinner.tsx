import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * Decorative by default (inside a button or a toast that already says what is loading).
 * Pass `label` when the spinner is the only sign of loading: it becomes a polite status.
 */
export function Spinner({ className, label }: { className?: string; label?: string }) {
  const icon = (
    <Loader2
      aria-hidden
      data-slot="spinner"
      className={cn(
        "size-4 animate-spin text-muted-foreground motion-reduce:animate-none",
        className,
      )}
    />
  );
  if (!label) return icon;
  return (
    <span role="status" data-slot="spinner-status" className="inline-flex">
      {icon}
      <span className="sr-only">{label}</span>
    </span>
  );
}

// Appearing after 200ms keeps a fast load from flashing a spinner (Vercel's guidelines: a 150–300ms
// show-delay); fill-mode backwards holds it hidden through the delay.
/** A panel or tab whose layout is not known yet, inside page chrome that is already on screen: the spinner alone on the surface, never in a box, centred in the room its flex parent leaves. A known layout (a table, a list, cards) takes skeletons instead. */
export function SectionSpinner({ className }: { className?: string }) {
  return (
    <div
      data-slot="section-spinner"
      className={cn(
        "flex min-h-50 grow items-center justify-center animate-in fade-in-0 fill-mode-backwards duration-(--duration-base) [animation-delay:200ms]",
        className,
      )}
    >
      <Spinner label="Loading…" />
    </div>
  );
}
