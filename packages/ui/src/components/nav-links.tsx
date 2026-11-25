"use client";

import { EllipsisIcon, type LucideIcon } from "lucide-react";
import { LayoutGroup, MotionConfig, motion } from "motion/react";
import { Slot } from "radix-ui";
import { type ReactElement, type ReactNode, useId } from "react";
import { navLinkActivationProps } from "../internal/nav-link-props";
import { usePriorityOverflow } from "../internal/priority-overflow";
import { EASING_FUNCTION } from "../lib/easing";
import { cn } from "../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

type NavLinkItem = {
  title: string;
  icon?: LucideIcon;
  isActive?: boolean;
  disabled?: boolean;
  /** Shown in the vertical list only: a horizontal row reads as tabs, which never carry counts. */
  count?: number;
};

const LOOKS = {
  pill: {
    list: "-mx-1 flex items-center gap-1 px-1 py-1.5",
    link: "h-control-sm rounded-full px-3.5 font-medium hover:bg-muted dark:hover:bg-muted/50",
    indicator: "inset-0 rounded-full bg-card shadow-raised dark:bg-muted",
  },
  underline: {
    list: "flex items-stretch gap-6",
    link: "h-full min-h-10 rounded-sm font-medium focus-visible:focus-ring-inset",
    indicator: "inset-x-0 bottom-0 h-0.5 rounded-full bg-foreground",
  },
  vertical: {
    list: "flex flex-col gap-1",
    link: "h-9 w-full rounded-lg px-3 hover:bg-muted aria-[current=page]:font-medium dark:hover:bg-muted/50",
    indicator: "inset-0 rounded-lg bg-card shadow-raised dark:bg-muted",
  },
} as const;

const linkBaseClassName = cn(
  "relative flex shrink-0 items-center gap-2 text-sm whitespace-nowrap text-muted-foreground outline-none",
  "transition-[color,background-color] duration-(--duration-fast) ease-out-expo",
  "hover:text-foreground focus-visible:focus-ring aria-[current=page]:text-foreground data-[state=open]:text-foreground",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50",
);

const INDICATOR_TRANSITION = { duration: 0.2, ease: EASING_FUNCTION.exponential };

type NavLinksProps<Item extends NavLinkItem> = {
  items: Item[];
  /** Must return an element that forwards props and ref, which `next/link` does. */
  renderLink: (item: Item, content: ReactNode) => ReactElement;
  /** `vertical` shows item icons and counts; a horizontal row stays text only. */
  orientation?: "horizontal" | "vertical";
  /** Horizontal only: a raised pill or an underline under the active link. Links that do not fit collapse into a trailing More menu; the active one always stays in the row. */
  variant?: "pill" | "underline";
  onNavigate?: (item: Item) => void;
  className?: string;
};

function NavLinks<Item extends NavLinkItem>({
  items,
  renderLink,
  orientation = "horizontal",
  variant = "pill",
  onNavigate,
  className,
}: NavLinksProps<Item>) {
  const isVertical = orientation === "vertical";
  const look = isVertical ? "vertical" : variant;
  const { list, link, indicator } = LOOKS[look];
  const layoutGroupId = useId();
  const { frameRef, measureRef, visibleIndices } = usePriorityOverflow({
    pinnedIndex: items.findIndex((item) => item.isActive),
    enabled: !isVertical,
  });
  const isVisible = (index: number) => visibleIndices?.includes(index) ?? true;
  const hiddenItems = items.filter((_, index) => !isVisible(index));
  const listClassName = cn("min-w-0", list, className);

  const linkList = (
    <ul
      data-slot="nav-links"
      data-orientation={orientation}
      data-variant={variant}
      className={cn(listClassName, !isVertical && "flex-1")}
    >
      {items
        .filter((_, index) => isVisible(index))
        .map((item) => (
          <li key={item.title} className="flex">
            <Slot.Root
              data-slot="nav-link"
              data-active={item.isActive ?? false}
              aria-current={item.isActive ? "page" : undefined}
              {...navLinkActivationProps(item.disabled, () => onNavigate?.(item))}
              className={cn(linkBaseClassName, link)}
            >
              {renderLink(
                item,
                <>
                  {item.isActive ? (
                    <motion.span
                      layoutId="nav-links-indicator"
                      data-slot="nav-links-indicator"
                      aria-hidden
                      transition={INDICATOR_TRANSITION}
                      className={cn("absolute", indicator)}
                    />
                  ) : null}
                  <span className="relative flex min-w-0 flex-1 items-center gap-2.5">
                    {isVertical && item.icon ? (
                      <item.icon
                        aria-hidden
                        className={cn(
                          "size-4 shrink-0",
                          item.isActive ? "text-foreground" : "text-muted-foreground",
                        )}
                      />
                    ) : null}
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    {isVertical && item.count != null ? (
                      <span
                        data-slot="nav-links-count"
                        className="shrink-0 text-xs font-normal text-subtle-foreground tabular-nums"
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </span>
                </>,
              )}
            </Slot.Root>
          </li>
        ))}
      {hiddenItems.length > 0 ? (
        <li className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger
              data-slot="nav-links-more"
              aria-label="More links"
              className={cn(linkBaseClassName, link, "[&_svg]:size-4")}
            >
              <EllipsisIcon aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {hiddenItems.map((item) => (
                <DropdownMenuItem
                  key={item.title}
                  asChild
                  disabled={item.disabled}
                  onSelect={() => onNavigate?.(item)}
                >
                  {renderLink(item, item.title)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      ) : null}
    </ul>
  );

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={layoutGroupId}>
        {isVertical ? (
          linkList
        ) : (
          <div
            ref={frameRef}
            data-slot="nav-links-frame"
            className={cn("flex max-w-full min-w-0 flex-col", visibleIndices === null && "overflow-hidden")}
          >
            {linkList}
            <div aria-hidden className="invisible h-0 max-w-full overflow-hidden">
              <div ref={measureRef} className={cn("relative", listClassName, "w-max")}>
                {items.map((item) => (
                  <span key={item.title} className={cn(linkBaseClassName, link)}>
                    {item.title}
                  </span>
                ))}
                <span className={cn(linkBaseClassName, link, "absolute [&_svg]:size-4")}>
                  <EllipsisIcon />
                </span>
              </div>
            </div>
          </div>
        )}
      </LayoutGroup>
    </MotionConfig>
  );
}

export { NavLinks };
export type { NavLinkItem, NavLinksProps };
