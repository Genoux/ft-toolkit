"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Slot } from "radix-ui";
import { createContext, useContext, useId, useState } from "react";
import { EASING_FUNCTION } from "../lib/easing";
import { cn } from "../lib/utils";

type CollapsibleContextValue = {
  open: boolean;
  toggle: () => void;
  contentId: string;
  divider: boolean;
  chevron: "start" | "end";
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("CollapsibleTrigger/Content must be used within CollapsibleSection");
  }
  return context;
}

// Header and body read one padding, so the space around the title, around the body and,
// without a divider, between them stays equal.
const PAD = { sm: "[--collapsible-pad:--spacing(3.5)]", md: "[--collapsible-pad:--spacing(5)]" };

// `card` stands beside Cards, so it takes their radius and padding (after PAD, which it overrides)
// and its title the CardTitle size: a History card under titled cards lines up with them.
const SURFACE = {
  default: "rounded-lg",
  card: "rounded-xl [--collapsible-pad:var(--card-padding)]",
} as const;

// --duration-slow in seconds: motion/react takes a number, not a CSS variable.
const HEIGHT_DURATION_SECONDS = 0.32;

interface CollapsibleSectionProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** A line between header and body; without it the body loses its top padding. */
  divider?: boolean;
  chevron?: "start" | "end";
  size?: keyof typeof PAD;
  /** `card` takes a Card's radius, padding and title size, for a section standing on the page canvas beside cards; `size` then has no effect. */
  variant?: keyof typeof SURFACE;
  className?: string;
}

export function CollapsibleSection({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  divider = true,
  chevron = "end",
  size = "md",
  variant = "default",
  className,
}: CollapsibleSectionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const contentId = useId();
  const toggle = () => {
    setUncontrolledOpen(!open);
    onOpenChange?.(!open);
  };

  return (
    <CollapsibleContext.Provider value={{ open, toggle, contentId, divider, chevron }}>
      <div
        data-slot="collapsible-section"
        data-variant={variant}
        className={cn(
          "group/collapsible-section overflow-hidden border border-border bg-card text-card-foreground",
          PAD[size],
          SURFACE[variant],
          className,
        )}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

/** The bare toggle, for a header the app draws itself; CollapsibleHeader covers the usual one. */
export function CollapsibleTrigger({ children, asChild, className }: CollapsibleTriggerProps) {
  const { open, toggle, contentId } = useCollapsible();
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      onClick={toggle}
      className={className}
    >
      {children}
    </Comp>
  );
}

function CollapsibleChevron() {
  const { open, chevron } = useCollapsible();
  const Icon = chevron === "start" ? ChevronRight : ChevronDown;
  return (
    <Icon
      data-slot="collapsible-chevron"
      aria-hidden
      className={cn(
        "size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-base) ease-out-expo",
        open && (chevron === "start" ? "rotate-90" : "rotate-180"),
      )}
    />
  );
}

interface CollapsibleHeaderProps {
  children: React.ReactNode;
  /** Quiet text beside the title, such as a date or a count. */
  meta?: React.ReactNode;
  /** Controls outside the toggle, such as a download button. */
  actions?: React.ReactNode;
  className?: string;
}

// The trigger's ::after covers the header, so a click anywhere toggles while the actions, raised
// above it, keep their own clicks. Below a 24rem container, meta and actions drop under the
// title; from there up the title row dissolves (`contents`) and every part shares one line.
export function CollapsibleHeader({ children, meta, actions, className }: CollapsibleHeaderProps) {
  const { chevron } = useCollapsible();
  const hasSecondRow = Boolean(meta || actions);

  return (
    <div data-slot="collapsible-header" className="@container/collapsible-header">
      <div
        className={cn(
          "relative isolate flex flex-wrap items-center gap-x-2 gap-y-1.5 p-(--collapsible-pad) transition-colors duration-(--duration-fast) ease-out-expo hover:bg-accent/40",
          className,
        )}
      >
        <div className="flex min-w-0 basis-full items-center gap-2 @sm/collapsible-header:contents">
          {chevron === "start" && <CollapsibleChevron />}
          <CollapsibleTrigger className="min-w-0 flex-1 text-left text-sm font-medium outline-none group-data-[variant=card]/collapsible-section:text-base after:absolute after:inset-0 after:rounded-lg group-data-[variant=card]/collapsible-section:after:rounded-xl focus-visible:after:focus-ring-inset">
            <span className="block truncate">{children}</span>
          </CollapsibleTrigger>
          {chevron === "end" && (
            <span className="flex @sm/collapsible-header:order-2">
              <CollapsibleChevron />
            </span>
          )}
        </div>
        {hasSecondRow && (
          <div
            className={cn(
              "flex min-w-0 basis-full items-center gap-2 @sm/collapsible-header:contents",
              chevron === "start" && "pl-6",
            )}
          >
            {meta && (
              <span className="min-w-0 truncate text-xs text-muted-foreground @sm/collapsible-header:order-1 @sm/collapsible-header:shrink-0">
                {meta}
              </span>
            )}
            {actions && (
              <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1 @sm/collapsible-header:order-3">
                {actions}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

/** The animated, unpadded area; CollapsibleBody adds the section's padding. */
export function CollapsibleContent({ children, className }: CollapsibleContentProps) {
  const { open, contentId, divider } = useCollapsible();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={contentId}
          data-slot="collapsible-content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : HEIGHT_DURATION_SECONDS,
            ease: EASING_FUNCTION.exponential,
          }}
          className={cn("overflow-hidden", divider && "border-t border-border", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CollapsibleBody({ children, className }: CollapsibleContentProps) {
  const { divider } = useCollapsible();

  return (
    <CollapsibleContent>
      <div
        data-slot="collapsible-body"
        className={cn("p-(--collapsible-pad)", !divider && "pt-0", className)}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}

export { useCollapsible };
