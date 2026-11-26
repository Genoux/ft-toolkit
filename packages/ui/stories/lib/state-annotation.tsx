import { MousePointer2 } from "lucide-react";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../src/lib/utils";

// A simulated hover or press is marked with a pointer, not with in-canvas words such as "hover":
// those read as part of the UI being shown. Focus gets no marker: its ring already says it.

type AnnotatedState = "hover" | "pressed" | "focus-visible";

const ANNOTATED_STATE_BY_NAME: Record<string, AnnotatedState> = {
  hover: "hover",
  pressed: "pressed",
  focus: "focus-visible",
  "focus-visible": "focus-visible",
};

/** The interaction state a grid row or column names, when the canvas marks it with a glyph. */
export function getAnnotatedState(name: string): AnnotatedState | undefined {
  return ANNOTATED_STATE_BY_NAME[name];
}

/** A caption about the canvas rather than part of it; keep it outside the component area. */
export function AnnotationCaption({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      data-annotation
      className={cn("font-mono text-2xs tracking-wide text-subtle-foreground", className)}
    >
      {children}
    </span>
  );
}

/** The pointer's tip sits on the element's position; place it with `className`. */
function PointerGlyph({ pressed, className }: { pressed: boolean; className: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute z-10", className)}>
      {pressed ? (
        <span className="absolute size-5 -translate-1/2 rounded-full bg-foreground/15" />
      ) : null}
      <MousePointer2
        strokeWidth={1.5}
        className="absolute -top-0.5 -left-0.5 size-5 fill-foreground stroke-background drop-shadow-sm"
      />
    </span>
  );
}

/** Wraps one example and marks its simulated state: a pointer over hover and pressed. */
export function StateMarker({
  state,
  children,
  className,
}: {
  state?: AnnotatedState;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-fit max-w-full", className)}>
      {children}
      {state === "hover" || state === "pressed" ? (
        <PointerGlyph pressed={state === "pressed"} className="top-[55%] right-5" />
      ) : null}
    </div>
  );
}

type RowMarker = { state: AnnotatedState; center: number };

function measureRowMarkers(container: HTMLElement): RowMarker[] {
  const containerTop = container.getBoundingClientRect().top;
  const rows = container.querySelectorAll<HTMLElement>(
    "[data-annotated-state=hover], [data-annotated-state=pressed]",
  );
  return [...rows].map((row) => {
    const rowRect = row.getBoundingClientRect();
    return {
      state: row.dataset.annotatedState as AnnotatedState,
      center: rowRect.top - containerTop + rowRect.height / 2,
    };
  });
}

/**
 * Marks simulated row states in a gutter before the rows, outside the component, so no marker
 * covers a cell. Set `data-annotated-state` on each simulated row inside it.
 */
export function RowStateGutter({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<RowMarker[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => setMarkers(measureRowMarkers(container));
    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative ps-8">
      {children}
      {markers.map(({ state, center }) => (
        <span
          key={center}
          className="pointer-events-none absolute start-0 h-5 w-6 -translate-y-1/2"
          style={{ top: center }}
        >
          <PointerGlyph pressed={state === "pressed"} className="top-0.5 left-1" />
        </span>
      ))}
    </div>
  );
}
