"use client";

import { type ReactElement, type ReactNode, useEffect, useId, useRef } from "react";
import { growWithEmptyStateClassName } from "../internal/empty-state-fill";
import { cn } from "../lib/utils";
import { type NavLinkItem, NavLinks } from "./nav-links";

type SettingsNavGroup<Item extends NavLinkItem> = {
  label?: string;
  items: Item[];
};

type RenderSettingsLink<Item extends NavLinkItem> = (item: Item, content: ReactNode) => ReactElement;

type SettingsLayoutProps<Item extends NavLinkItem> = {
  /** The section nav: one group per topic, such as Account, Workspace, or one per client. */
  groups: SettingsNavGroup<Item>[];
  /** Must return an element that forwards props and ref, which `next/link` does. */
  renderLink: RenderSettingsLink<Item>;
  /** Names the section nav for screen readers. */
  navLabel?: string;
  /** The active section's `PageSection`s. */
  children: ReactNode;
  className?: string;
};

function SettingsNavGroupList<Item extends NavLinkItem>({
  group,
  renderLink,
}: {
  group: SettingsNavGroup<Item>;
  renderLink: RenderSettingsLink<Item>;
}) {
  const labelId = useId();
  return (
    <div
      role="group"
      aria-labelledby={group.label ? labelId : undefined}
      className="flex flex-col gap-(--gap-xs)"
    >
      {group.label ? (
        <div id={labelId} className="px-3 text-xs font-medium text-subtle-foreground">
          {group.label}
        </div>
      ) : null}
      <NavLinks items={group.items} renderLink={renderLink} orientation="vertical" />
    </div>
  );
}

/** The settings frame inside `Page`: a grouped section nav beside the content, a scrolling pill row on a phone.
 * Stacked fields in the content stop at 28rem, so a name or a code never stretches across the page. */
function SettingsLayout<Item extends NavLinkItem>({
  groups,
  renderLink,
  navLabel = "Settings",
  children,
  className,
}: SettingsLayoutProps<Item>) {
  const items = groups.flatMap((group) => group.items);
  const activeTitle = items.find((item) => item.isActive)?.title;
  const pillRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pillRow = pillRowRef.current?.querySelector<HTMLElement>('[data-slot="nav-links"]');
    const activeLink = pillRow?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!pillRow || !activeLink || activeTitle === undefined) return;
    pillRow.scrollLeft = activeLink.offsetLeft - (pillRow.clientWidth - activeLink.offsetWidth) / 2;
  }, [activeTitle]);

  return (
    <div
      data-slot="settings-layout"
      className={cn(
        "flex min-w-0 flex-col gap-(--gap-xl) md:grid md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]",
        growWithEmptyStateClassName,
        className,
      )}
    >
      <nav aria-label={navLabel} data-slot="settings-nav" className="min-w-0 md:sticky md:top-8 md:self-start">
        <div ref={pillRowRef} className="md:hidden">
          <NavLinks items={items} renderLink={renderLink} className="-mx-6 px-6" />
        </div>
        <div className="hidden flex-col gap-(--gap-lg) md:flex">
          {groups.map((group) => (
            <SettingsNavGroupList
              key={group.label ?? group.items[0]?.title}
              group={group}
              renderLink={renderLink}
            />
          ))}
        </div>
      </nav>
      <div
        data-slot="settings-content"
        className="flex min-w-0 max-w-3xl flex-col gap-10 [&_[data-slot=field][data-orientation=vertical]]:max-w-md"
      >
        {children}
      </div>
    </div>
  );
}

export { SettingsLayout };
export type { SettingsNavGroup };
