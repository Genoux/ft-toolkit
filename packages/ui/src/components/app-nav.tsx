"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactElement, type ReactNode, useId, useState } from "react";
import { navLinkActivationProps } from "../internal/nav-link-props";
import { EASING_FUNCTION } from "../lib/easing";
import { cn } from "../lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "./sidebar";

type AppNavSubItem = {
  title: string;
  isActive?: boolean;
  disabled?: boolean;
  count?: number;
  /** A status after the title, before `count`: a `Spinner`, a `StatusDot` or a small `Badge`. */
  trailing?: ReactNode;
  /** Row actions, usually a `dots` DropdownMenu: revealed on hover and focus, always shown on touch. */
  actions?: ReactNode;
};

type AppNavItem = AppNavSubItem & { icon?: LucideIcon };

type AppNavParent<Item, SubItem> = Item & {
  /** Renders a collapsible sub-menu under the row; the row then toggles it instead of linking. */
  items?: SubItem[];
  /** Defaults to open while one of `items` is active. */
  defaultOpen?: boolean;
};

// NoInfer: the item types come from `items` alone. A pre-typed renderLink such as
// `(item: { title: string }) => …` would otherwise narrow Item and reject `icon`, or widen SubItem.
type RenderAppNavLink<Item, SubItem> = (
  item: NoInfer<Item> | NoInfer<SubItem>,
  content: ReactNode,
) => ReactElement;

type AppNavProps<Item extends AppNavItem, SubItem extends AppNavSubItem> = {
  items: AppNavParent<Item, SubItem>[];
  renderLink: RenderAppNavLink<Item, SubItem>;
  /** The group's overline. Render one AppNav per group. */
  label?: ReactNode;
  /** Lets the label fold the group away. Needs `label`. */
  collapsible?: boolean;
  /** Whether a `collapsible` group starts open. */
  defaultOpen?: boolean;
  /** A control beside the label, such as an "Add product" `IconButton size="icon-xs"`. */
  action?: ReactNode;
};

const SLOW_SECONDS = 0.32;

const ROW_GROUP_CLASS = "group/app-nav-row";

// The actions sit over the end of the row on fine pointers, so the trailing content makes way while
// they show; touch screens have no hover, so there the row keeps room for them instead.
const ROW_WITH_ACTIONS_CLASS = "pointer-coarse:pe-8";

const TRAILING_MAKES_WAY_CLASS =
  "pointer-fine:min-w-5 pointer-fine:group-hover/app-nav-row:opacity-0 pointer-fine:group-focus-within/app-nav-row:opacity-0 pointer-fine:group-has-data-[state=open]/app-nav-row:opacity-0";

function AppNavCount({ count }: { count?: number }) {
  if (count == null) return null;
  return (
    <span data-slot="app-nav-count" className="text-xs text-subtle-foreground tabular-nums">
      {count}
    </span>
  );
}

function AppNavTrailing({
  item,
  children,
}: {
  item: AppNavSubItem;
  children?: ReactNode;
}) {
  const hasActions = item.actions != null;
  if (item.trailing == null && item.count == null && children == null && !hasActions) return null;
  return (
    <span
      data-slot="app-nav-trailing"
      className={cn(
        "flex shrink-0 items-center justify-end gap-1.5 transition-opacity duration-(--duration-fast) ease-out-expo group-data-[collapsible=icon]:hidden",
        hasActions && TRAILING_MAKES_WAY_CLASS,
      )}
    >
      {item.trailing}
      <AppNavCount count={item.count} />
      {children}
    </span>
  );
}

// The `dots` Button hides itself in any row on hover alone, so inside this wrapper its visibility
// is handed to the wrapper. An open menu keeps the actions visible while the pointer is on the menu.
function AppNavActions({ children }: { children: ReactNode }) {
  return (
    <div
      data-slot="app-nav-actions"
      className={cn(
        "absolute inset-y-0 end-1 flex items-center gap-0.5 transition-opacity duration-(--duration-fast) ease-out-expo [&_[data-variant=dots]]:opacity-100",
        "pointer-fine:opacity-0 pointer-fine:group-hover/app-nav-row:opacity-100 pointer-fine:group-focus-within/app-nav-row:opacity-100 pointer-fine:has-data-[state=open]:opacity-100",
        "group-data-[collapsible=icon]:hidden",
      )}
    >
      {children}
    </div>
  );
}

// Clips only while the height animates, so focus rings and raised rows are not cut off at rest.
function AppNavCollapse({
  open,
  id,
  slot,
  children,
}: {
  open: boolean;
  id: string;
  slot: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          id={id}
          data-slot={slot}
          initial={{ height: 0, opacity: 0, overflow: "hidden" }}
          animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
          exit={{ height: 0, opacity: 0, overflow: "hidden" }}
          transition={{ duration: reduceMotion ? 0 : SLOW_SECONDS, ease: EASING_FUNCTION.exponential }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function useCloseMobileSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  return () => {
    if (isMobile) setOpenMobile(false);
  };
}

function AppNavLinkRow<Item extends AppNavItem, SubItem extends AppNavSubItem>({
  item,
  renderLink,
}: {
  item: Item;
  renderLink: RenderAppNavLink<Item, SubItem>;
}) {
  const closeMobileSidebar = useCloseMobileSidebar();
  return (
    <>
      <SidebarMenuButton
        asChild
        isActive={item.isActive}
        aria-current={item.isActive ? "page" : undefined}
        {...navLinkActivationProps(item.disabled, closeMobileSidebar)}
        tooltip={item.title}
        className={cn(item.actions != null && ROW_WITH_ACTIONS_CLASS)}
      >
        {renderLink(
          item,
          <>
            {item.icon ? <item.icon /> : null}
            <span className="min-w-0 flex-1 truncate">{item.title}</span>
            <AppNavTrailing item={item} />
          </>,
        )}
      </SidebarMenuButton>
      {item.actions != null ? <AppNavActions>{item.actions}</AppNavActions> : null}
    </>
  );
}

function AppNavSubRow<Item extends AppNavItem, SubItem extends AppNavSubItem>({
  sub,
  renderLink,
}: {
  sub: SubItem;
  renderLink: RenderAppNavLink<Item, SubItem>;
}) {
  const closeMobileSidebar = useCloseMobileSidebar();
  return (
    <SidebarMenuSubItem className={ROW_GROUP_CLASS}>
      <SidebarMenuSubButton
        asChild
        isActive={sub.isActive}
        aria-current={sub.isActive ? "page" : undefined}
        {...navLinkActivationProps(sub.disabled, closeMobileSidebar)}
        className={cn(sub.actions != null && ROW_WITH_ACTIONS_CLASS)}
      >
        {renderLink(
          sub,
          <>
            <span className="min-w-0 flex-1 truncate">{sub.title}</span>
            <AppNavTrailing item={sub} />
          </>,
        )}
      </SidebarMenuSubButton>
      {sub.actions != null ? <AppNavActions>{sub.actions}</AppNavActions> : null}
    </SidebarMenuSubItem>
  );
}

function AppNavParentRow<Item extends AppNavItem, SubItem extends AppNavSubItem>({
  item,
  subItems,
  renderLink,
}: {
  item: AppNavParent<Item, SubItem>;
  subItems: SubItem[];
  renderLink: RenderAppNavLink<Item, SubItem>;
}) {
  const { state, isMobile, setOpen: setSidebarOpen } = useSidebar();
  const hasActiveSubItem = subItems.some((sub) => sub.isActive);
  const [open, setOpen] = useState(item.defaultOpen ?? hasActiveSubItem);
  const contentId = useId();
  const collapsedToIcons = state === "collapsed" && !isMobile;

  const toggle = () => {
    if (collapsedToIcons) {
      setSidebarOpen(true);
      setOpen(true);
      return;
    }
    setOpen(!open);
  };

  return (
    <>
      <SidebarMenuButton
        data-slot="app-nav-parent"
        isActive={collapsedToIcons && hasActiveSubItem}
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        disabled={item.disabled}
        tooltip={item.title}
        onClick={toggle}
        className={cn(item.actions != null && ROW_WITH_ACTIONS_CLASS)}
      >
        {item.icon ? <item.icon /> : null}
        <span className="min-w-0 flex-1 truncate">{item.title}</span>
        <AppNavTrailing item={item}>
          <ChevronRight
            data-slot="app-nav-chevron"
            aria-hidden
            className={cn(
              "size-3.5! transition-transform duration-(--duration-base) ease-out-expo",
              open && "rotate-90",
            )}
          />
        </AppNavTrailing>
      </SidebarMenuButton>
      {item.actions != null ? <AppNavActions>{item.actions}</AppNavActions> : null}
      <AppNavCollapse open={open} id={contentId} slot="app-nav-sub">
        <SidebarMenuSub className="mt-0.5">
          {subItems.map((sub) => (
            <AppNavSubRow key={sub.title} sub={sub} renderLink={renderLink} />
          ))}
        </SidebarMenuSub>
      </AppNavCollapse>
    </>
  );
}

function AppNavGroupLabel({
  label,
  action,
  fold,
}: {
  label: ReactNode;
  action?: ReactNode;
  fold?: { open: boolean; contentId: string; toggle: () => void };
}) {
  // The header row takes the label's bottom margin, so the action centres on the label, not on the
  // label plus its margin.
  const besideAction = action != null && "mb-0 min-w-0 flex-1";
  const labelElement = fold ? (
    <SidebarGroupLabel
      asChild
      className={cn("gap-1 transition-[color,margin,opacity] hover:text-muted-foreground", besideAction)}
    >
      <button
        type="button"
        aria-expanded={fold.open}
        aria-controls={fold.open ? fold.contentId : undefined}
        onClick={fold.toggle}
      >
        <span className="truncate">{label}</span>
        <ChevronRight
          data-slot="app-nav-group-chevron"
          aria-hidden
          className={cn(
            "size-3! transition-transform duration-(--duration-base) ease-out-expo",
            fold.open && "rotate-90",
          )}
        />
      </button>
    </SidebarGroupLabel>
  ) : (
    <SidebarGroupLabel className={cn(besideAction)}>{label}</SidebarGroupLabel>
  );

  if (action == null) return labelElement;
  return (
    <div data-slot="app-nav-group-header" className="mb-1 flex items-center gap-1">
      {labelElement}
      <div
        data-slot="app-nav-group-action"
        className="flex shrink-0 items-center pe-1 group-data-[collapsible=icon]:hidden"
      >
        {action}
      </div>
    </div>
  );
}

function AppNavMenu<Item extends AppNavItem, SubItem extends AppNavSubItem>({
  items,
  renderLink,
}: Pick<AppNavProps<Item, SubItem>, "items" | "renderLink">) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title} className={ROW_GROUP_CLASS}>
          {item.items?.length ? (
            <AppNavParentRow item={item} subItems={item.items} renderLink={renderLink} />
          ) : (
            <AppNavLinkRow item={item} renderLink={renderLink} />
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

// Only foldable groups subscribe to the sidebar state, so a sidebar toggle does not re-render every group.
function AppNavFoldableGroup<Item extends AppNavItem, SubItem extends AppNavSubItem>({
  label,
  action,
  defaultOpen,
  items,
  renderLink,
}: AppNavProps<Item, SubItem>) {
  const { state, isMobile } = useSidebar();
  const [open, setOpen] = useState(defaultOpen ?? true);
  const contentId = useId();
  const collapsedToIcons = state === "collapsed" && !isMobile;
  return (
    <SidebarGroup>
      <AppNavGroupLabel
        label={label}
        action={action}
        fold={{ open, contentId, toggle: () => setOpen(!open) }}
      />
      <AppNavCollapse open={open || collapsedToIcons} id={contentId} slot="app-nav-group-content">
        <SidebarGroupContent>
          <AppNavMenu items={items} renderLink={renderLink} />
        </SidebarGroupContent>
      </AppNavCollapse>
    </SidebarGroup>
  );
}

function AppNav<Item extends AppNavItem, SubItem extends AppNavSubItem = never>(
  props: AppNavProps<Item, SubItem>,
) {
  const { items, renderLink, label, collapsible = false, action } = props;
  if (collapsible && label != null) return <AppNavFoldableGroup {...props} />;
  return (
    <SidebarGroup>
      {label != null ? <AppNavGroupLabel label={label} action={action} /> : null}
      <SidebarGroupContent>
        <AppNavMenu items={items} renderLink={renderLink} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { AppNav };
export type { AppNavItem, AppNavSubItem };
