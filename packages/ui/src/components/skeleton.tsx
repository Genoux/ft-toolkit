import { cn } from "../lib/utils";

// A pulse rather than a sweeping shimmer: every bar fades in step, where a shimmer runs at each bar's
// own width and reads as restless across a table of uneven bars (shadcn and Radix Themes pulse too).
// The clamp in theme.css stops it under reduced motion; the bar then rests at full tone.
/** A placeholder bar at the size of what is loading. Set a height and width; `rounded-full` only for avatars and pills. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("rounded-md bg-muted animate-pulse motion-reduce:animate-none", className)}
      {...props}
    />
  );
}

export { Skeleton };
