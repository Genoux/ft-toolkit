"use client";

import { EllipsisIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";
import { growWithEmptyStateClassName } from "../internal/empty-state-fill";
import { usePriorityOverflow } from "../internal/priority-overflow";
import { EASING_FUNCTION } from "../lib/easing";
import { cn } from "../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

export type TabDefinition = {
  value: string;
  label: string;
  /** @deprecated Not rendered: tabs never carry counts. Put the count in the section heading or description. */
  count?: number;
  disabled?: boolean;
};

type TabsVariant = "default" | "line";
type TabsSize = "default" | "sm";

// Gap equals the track padding, so the space between two pills matches the space at either end.
// The line baseline is an inset shadow, not a border, so it adds no height to the row.
const listClassName: Record<TabsVariant, string> = {
  default: "w-fit gap-1 rounded-full bg-muted p-1",
  line: "w-full gap-6 shadow-[inset_0_-1px_0_var(--color-border)]",
};

const triggerBaseClassName =
  "relative isolate inline-flex flex-none items-center justify-center text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors duration-(--duration-fast) ease-out-expo hover:text-foreground focus-visible:focus-ring-inset disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=open]:text-foreground";

const triggerClassName: Record<TabsVariant, string> = {
  default:
    "rounded-full data-[size=default]:h-8 data-[size=default]:px-3.5 data-[size=sm]:h-7 data-[size=sm]:px-3",
  line: "rounded-md px-1 data-[size=default]:h-10 data-[size=sm]:h-9",
};

// A positioned pill paints over its trigger's outline; -z-10 inside the isolated trigger keeps the
// focus ring on top. The line indicator stays above it so the active underline still shows.
const indicatorClassName: Record<TabsVariant, string> = {
  default: "absolute inset-0 -z-10 bg-card shadow-raised",
  line: "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-foreground",
};

// Set inline, not as a class, so motion corrects the radius while the layout animation scales the pill.
const pillRadiusStyle = { borderRadius: 9999 };

type TabsSelection = { activeValue: string | undefined; selectTab: (value: string) => void };

const TabsSelectionContext = React.createContext<TabsSelection>({
  activeValue: undefined,
  selectTab: () => {},
});

function Tabs({
  className,
  value: controlledValue,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const activeValue = controlledValue ?? uncontrolledValue;

  const selectTab = (next: string) => {
    setUncontrolledValue(next);
    onValueChange?.(next);
  };

  return (
    <TabsSelectionContext.Provider value={{ activeValue, selectTab }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        value={activeValue}
        onValueChange={selectTab}
        className={cn(
          "flex max-w-full min-w-0 flex-col gap-(--gap-md)",
          growWithEmptyStateClassName,
          className,
        )}
        {...props}
      />
    </TabsSelectionContext.Provider>
  );
}

function TabLabel({ label }: { label: string }) {
  return <span className="relative inline-flex items-center">{label}</span>;
}

/**
 * Works without `TabsContent` too, as a filter bar driven by `value`/`onValueChange` on `Tabs`. Tabs that
 * do not fit collapse into a trailing More menu (the active tab always stays in the row); `wrap` puts
 * them on more rows instead.
 */
function TabsList({
  tabs,
  variant = "default",
  size = "default",
  fullWidth = false,
  wrap = false,
  className,
  ...props
}: Omit<React.ComponentProps<typeof TabsPrimitive.List>, "children"> & {
  tabs: TabDefinition[];
  variant?: TabsVariant;
  size?: TabsSize;
  /** Stretches the list to its container and shares the width between the tabs. */
  fullWidth?: boolean;
  /** Wraps tabs onto more rows instead of collapsing them into a More menu: for a long set of tabs in a narrow card. */
  wrap?: boolean;
}) {
  const { activeValue, selectTab } = React.useContext(TabsSelectionContext);
  const indicatorLayoutId = React.useId();
  const reduceMotion = useReducedMotion();
  const indicatorTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: EASING_FUNCTION.exponential };
  const trackRef = React.useRef<HTMLDivElement>(null);
  const focusActiveTabOnCloseRef = React.useRef(false);
  const { frameRef, measureRef, visibleIndices } = usePriorityOverflow({
    pinnedIndex: tabs.findIndex((tab) => tab.value === activeValue),
    enabled: !wrap,
  });
  const isVisible = (index: number) => visibleIndices?.includes(index) ?? true;
  const visibleTabs = tabs.filter((_, index) => isVisible(index));
  const hiddenTabs = tabs.filter((_, index) => !isVisible(index));
  const trackClassName = cn(listClassName[variant], className);
  const moreTriggerClassName = cn(triggerBaseClassName, triggerClassName[variant], "[&_svg]:size-4");

  return (
    <div
      ref={frameRef}
      data-slot="tabs-list-frame"
      className={cn(
        "flex max-w-full min-w-0 flex-col items-start",
        !wrap && visibleIndices === null && "overflow-hidden",
        fullWidth && "w-full",
      )}
    >
      <div
        ref={trackRef}
        data-slot="tabs-list"
        data-variant={variant}
        data-size={size}
        data-wrap={wrap || undefined}
        className={cn(
          "inline-flex max-w-full min-w-0 shrink-0 items-center",
          wrap && "gap-y-1",
          trackClassName,
          wrap && variant === "default" && "rounded-2xl",
          fullWidth && "w-full",
        )}
      >
        <TabsPrimitive.List
          className={cn(
            "flex min-w-0 items-center gap-[inherit]",
            wrap && "flex-wrap",
            fullWidth && "flex-1",
          )}
          {...props}
        >
          {visibleTabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              data-slot="tabs-trigger"
              data-size={size}
              className={cn(triggerBaseClassName, triggerClassName[variant], fullWidth && "flex-1")}
            >
              {tab.value === activeValue ? (
                <motion.span
                  aria-hidden
                  layoutId={indicatorLayoutId}
                  transition={indicatorTransition}
                  style={variant === "default" ? pillRadiusStyle : undefined}
                  className={indicatorClassName[variant]}
                />
              ) : null}
              <TabLabel label={tab.label} />
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
        {hiddenTabs.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              data-slot="tabs-more"
              data-size={size}
              aria-label="More tabs"
              className={moreTriggerClassName}
            >
              <EllipsisIcon aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(event) => {
                if (!focusActiveTabOnCloseRef.current) return;
                focusActiveTabOnCloseRef.current = false;
                event.preventDefault();
                trackRef.current
                  ?.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
                  ?.focus();
              }}
            >
              {hiddenTabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  disabled={tab.disabled}
                  onSelect={() => {
                    focusActiveTabOnCloseRef.current = true;
                    selectTab(tab.value);
                  }}
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      {wrap ? null : (
        <div aria-hidden className="invisible h-0 max-w-full overflow-hidden">
          <div ref={measureRef} className={cn("relative flex items-center", trackClassName, "w-max")}>
            {tabs.map((tab) => (
              <span
                key={tab.value}
                data-size={size}
                className={cn(triggerBaseClassName, triggerClassName[variant])}
              >
                <TabLabel label={tab.label} />
              </span>
            ))}
            <span data-size={size} className={cn(moreTriggerClassName, "absolute")}>
              <EllipsisIcon />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-0 flex min-h-0 flex-1 flex-col rounded-lg text-sm outline-none focus-visible:focus-ring",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList };
