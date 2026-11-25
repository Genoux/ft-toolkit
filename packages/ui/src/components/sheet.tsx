"use client";

import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { createContext, type ReactNode, useContext } from "react";
import { cn } from "../lib/utils";
import { overlayClassName, overlayPanelClassName } from "../internal/overlay-motion";

/** Swallow pointer-up + click that complete on the element under the removed overlay (Radix / modal ghost click). */
function swallowGhostPointerEvents(durationMs: number) {
  const until = performance.now() + durationMs;
  const swallow = (e: Event) => {
    if (performance.now() <= until) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  document.addEventListener("pointerup", swallow, true);
  document.addEventListener("click", swallow, true);
  window.setTimeout(() => {
    document.removeEventListener("pointerup", swallow, true);
    document.removeEventListener("click", swallow, true);
  }, durationMs);
}

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

/** Whether SheetContent asked for a close button, which SheetHeader then renders in its first row. */
const SheetCloseButtonContext = createContext(false);

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

const sheetSideClassName = {
  right:
    "inset-y-0 right-0 h-full w-3/4 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  left: "inset-y-0 left-0 h-full w-3/4 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  bottom:
    "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  top: "inset-x-0 top-0 max-h-[85dvh] rounded-b-2xl data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
} as const;

const sheetSizeClassName = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
} as const;

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        overlayClassName,
        "duration-(--duration-slow) ease-out-expo data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-(--duration-base)",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  size = "sm",
  showCloseButton = false,
  onOpenAutoFocus,
  onPointerDownOutside,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: keyof typeof sheetSideClassName;
  /** Width cap from the `sm` breakpoint, for `left` and `right` sheets. */
  size?: keyof typeof sheetSizeClassName;
  /** A close button in the SheetHeader, centred on its first row at the header's padding. */
  showCloseButton?: boolean;
}) {
  const isVertical = side === "left" || side === "right";
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        data-size={size}
        className={cn(
          overlayPanelClassName,
          "group/sheet fixed z-50 flex flex-col text-sm outline-none",
          "duration-(--duration-slow) ease-out-expo data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-(--duration-base)",
          sheetSideClassName[side],
          isVertical && sheetSizeClassName[size],
          className,
        )}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event);
          if (event.defaultPrevented) return;
          // A sheet is read before it is acted on: Radix would focus the close button and ring it.
          event.preventDefault();
          (event.currentTarget as HTMLElement).focus();
        }}
        onPointerDownOutside={(event) => {
          onPointerDownOutside?.(event);
          if (!event.defaultPrevented) swallowGhostPointerEvents(100);
        }}
        {...props}
      >
        <SheetCloseButtonContext.Provider value={showCloseButton}>
          {children}
        </SheetCloseButtonContext.Provider>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

/** The pinned top of a sheet, ruled off from the body, with the same 24px padding. With
 * `showCloseButton` it is a two-column grid: the content in the first column, the close button
 * centred on the first row (a title line, or an avatar row) and inset by the padding. */
function SheetHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  const showCloseButton = useContext(SheetCloseButtonContext);
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex shrink-0 flex-col gap-1.5 border-b p-6",
        showCloseButton &&
          "grid grid-cols-[minmax(0,1fr)_auto] gap-x-(--gap-md) *:col-start-1",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        // The -my-1 lets the 32px button centre on a 24px title line without making the row taller.
        <SheetPrimitive.Close
          data-slot="sheet-close"
          className="col-start-2! row-start-1 -my-1 flex size-8 items-center justify-center self-center rounded-full text-muted-foreground outline-none transition-colors duration-(--duration-fast) ease-out-expo hover:bg-muted hover:text-foreground focus-visible:focus-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      ) : null}
    </div>
  );
}

/** The scrolling middle of a sheet, between a header and a footer that stay put. */
function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-(--gap-xl) overflow-y-auto overscroll-contain p-6 *:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

type SheetSectionProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: ReactNode;
  /** At the end of the heading row in muted text: when the facts hold, or how many there are. */
  aside?: ReactNode;
};

/** One titled part of a sheet's body: a heading row, then its facts or rows 16px under it. Spacing,
 * not rules or boxes, separates sections; SheetBody puts 32px between them. */
function SheetSection({ title, aside, className, children, ...props }: SheetSectionProps) {
  return (
    <section
      data-slot="sheet-section"
      className={cn("flex min-w-0 flex-col gap-(--gap-md)", className)}
      {...props}
    >
      <div className="flex min-h-6 items-center justify-between gap-(--gap-md)">
        <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">{title}</h3>
        {aside ? <span className="shrink-0 text-xs text-muted-foreground">{aside}</span> : null}
      </div>
      {children}
    </section>
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "sticky bottom-0 mt-auto flex shrink-0 flex-col-reverse gap-2 border-t bg-popover px-6 py-4 group-data-[side=bottom]/sheet:pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-heading text-foreground", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetSection,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
