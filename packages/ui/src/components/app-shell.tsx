"use client";

import { MenuIcon, MoreHorizontal, XIcon } from "lucide-react";
import { Slot } from "radix-ui";
import {
  type CSSProperties,
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";
import { IconButton } from "./icon-button";
import { type NavLinkItem, NavLinks, type NavLinksProps } from "./nav-links";
import { Separator } from "./separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar";

type AppShellSharedProps = {
  headerVariant?: keyof typeof HEADER_VARIANTS;
  children: ReactNode;
};

type AppShellSidebarSlots = {
  layout?: "sidebar";
  sidebarHeader: ReactNode;
  sidebar: ReactNode;
  sidebarFooter?: ReactNode;
  header?: ReactNode;
  variant?: ComponentProps<typeof Sidebar>["variant"];
  collapsible?: ComponentProps<typeof Sidebar>["collapsible"];
  sidebarWidth?: string;
  /** Whether the sidebar starts expanded; restore it from the `sidebar_state` cookie. */
  defaultOpen?: boolean;
};

type AppShellTopbarSlots = {
  layout: "topbar";
  /** `AppShellTitle`, at the start of the bar and atop the mobile menu. */
  topbarBrand: ReactNode;
  /** `AppShellNav`: inline in the bar from md, in a menu sheet below it. */
  topbarNav?: ReactNode;
  /** The end of the bar: search, notifications, `NavUser variant="avatar"`. */
  topbarActions?: ReactNode;
};

// Each layout forbids the other's props, so a stray `sidebar` on a top bar fails to compile.
type Forbidden<Slots> = { [Key in Exclude<keyof Slots, "layout">]?: never };

type AppShellSidebarProps = AppShellSharedProps & AppShellSidebarSlots & Forbidden<AppShellTopbarSlots>;
type AppShellTopbarProps = AppShellSharedProps & AppShellTopbarSlots & Forbidden<AppShellSidebarSlots>;

type AppShellProps = AppShellSidebarProps | AppShellTopbarProps;

const HEADER_VARIANTS = {
  bordered: { header: "h-(--header-height) border-b", bar: "px-4", separator: "mx-2.5" },
  plain: { header: "h-(--header-height)", bar: "px-4", separator: "mr-2.5" },
} as const;

const CONTENT_ID = "app-shell-content";

// Scroll padding keeps a focused row clear of a sticky `PageToolbar` (its offset, h-10 controls and backdrop).
const CONTENT_CLASS =
  "flex min-h-0 min-w-0 flex-1 scroll-pt-16 flex-col overflow-y-auto outline-none";

function AppShellSkipLink() {
  return (
    <a
      href={`#${CONTENT_ID}`}
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-card focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:shadow-elevated focus-visible:focus-ring"
    >
      Skip to content
    </a>
  );
}

type AppShellTitleProps = ComponentProps<"span"> & {
  /** Renders the child element, usually the router's Link to the home page. */
  asChild?: boolean;
};

/** The app's name at the top-left of the shell, in `sidebarHeader` or `topbarBrand`: the name only, no logo or version, the same in every app. */
function AppShellTitle({ asChild = false, className, ...props }: AppShellTitleProps) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp
      data-slot="app-shell-title"
      className={cn(
        "block truncate rounded-md text-base font-medium text-foreground outline-none focus-visible:focus-ring",
        "in-data-[sidebar=header]:px-2.5 group-data-[collapsible=icon]:invisible",
        className,
      )}
      {...props}
    />
  );
}

/** @deprecated The shell shows the app's name only: use `AppShellTitle`. */
function AppShellLogo({ children }: { children: ReactNode }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="px-2.5 py-1.5">{children}</div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

type AppShellWorkspaceProps = {
  /** A square mark: an icon, an initial or an `img`, shown on a size-9 tile. */
  logo: ReactNode;
  name: ReactNode;
  description?: ReactNode;
};

/** @deprecated The shell shows the app's name only, without a logo tile: use `AppShellTitle`. */
function AppShellWorkspace({ logo, name, description }: AppShellWorkspaceProps) {
  return (
    <div
      data-slot="app-shell-workspace"
      className="flex min-w-0 items-center gap-3 px-2.5 py-1 group-data-[collapsible=icon]:p-0"
    >
      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary text-sm font-medium text-primary-foreground [&_svg]:size-4 [&>img]:size-full [&>img]:object-cover">
        {logo}
      </div>
      <div className="grid min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
        <span className="truncate text-sm font-medium text-foreground">{name}</span>
        {description ? (
          <span className="truncate text-xs text-subtle-foreground">{description}</span>
        ) : null}
      </div>
    </div>
  );
}

type AppShellNavPlacement = { placement: "bar" | "sheet"; closeMenu: () => void };

const AppShellNavContext = createContext<AppShellNavPlacement | null>(null);

/** The top bar's links; becomes a vertical list with icons inside the mobile menu, which it closes on navigation. */
function AppShellNav<Item extends NavLinkItem>(
  props: Omit<NavLinksProps<Item>, "orientation" | "onNavigate">,
) {
  const navPlacement = useContext(AppShellNavContext);
  const inMenu = navPlacement?.placement === "sheet";
  return (
    <NavLinks
      {...props}
      orientation={inMenu ? "vertical" : "horizontal"}
      onNavigate={inMenu ? navPlacement.closeMenu : undefined}
    />
  );
}

function AppShellTopbar({
  topbarBrand,
  topbarNav,
  topbarActions,
  headerVariant = "bordered",
  children,
}: AppShellTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div data-slot="app-shell" data-layout="topbar" className="flex h-svh flex-col overflow-hidden bg-background [--header-height:calc(var(--spacing)*14)]">
      <AppShellSkipLink />
      <header
        data-slot="app-shell-topbar"
        className={cn(
          "flex h-(--header-height) shrink-0 items-center gap-1 px-3 md:gap-6 md:px-6",
          headerVariant === "bordered" && "border-b",
        )}
      >
        {topbarNav ? (
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground md:hidden">
                <MenuIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="gap-0 bg-sidebar p-0 data-[side=left]:w-72">
              <SheetHeader className="flex-row items-center justify-between gap-2 border-b border-sidebar-border px-3 py-2.5">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation</SheetDescription>
                <div className="min-w-0">{topbarBrand}</div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground">
                    <XIcon />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto p-3">
                <AppShellNavContext.Provider value={{ placement: "sheet", closeMenu }}>
                  {topbarNav}
                </AppShellNavContext.Provider>
              </nav>
            </SheetContent>
          </Sheet>
        ) : null}
        <div className="flex min-w-0 shrink-0 items-center">{topbarBrand}</div>
        {topbarNav ? (
          <nav aria-label="Main" className="hidden min-w-0 self-stretch md:flex">
            {topbarNav}
          </nav>
        ) : null}
        {topbarActions ? (
          <div className="ml-auto flex shrink-0 items-center gap-2">{topbarActions}</div>
        ) : null}
      </header>
      <main id={CONTENT_ID} tabIndex={-1} data-slot="app-shell-content" className={CONTENT_CLASS}>
        {children}
      </main>
    </div>
  );
}

type AppShellHeaderActionsProps = {
  /** The controls shown inline in the header from md. */
  children: ReactNode;
  /** The same actions as `DropdownMenuItem`s (submenus for choices), behind a "…" button below md. */
  menu: ReactNode;
  /** The "…" button's accessible name and tooltip. */
  label?: string;
};

/** Header controls that fold into a "…" menu on phones; keep the one action a phone always needs outside it. */
function AppShellHeaderActions({ children, menu, label = "More actions" }: AppShellHeaderActionsProps) {
  return (
    <div data-slot="app-shell-header-actions" className="flex shrink-0 items-center gap-(--gap-sm)">
      <div className="hidden items-center gap-(--gap-sm) md:flex">{children}</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton label={label} size="icon-sm" className="md:hidden">
            <MoreHorizontal />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function AppShell(props: AppShellProps) {
  return props.layout === "topbar" ? <AppShellTopbar {...props} /> : <AppShellSidebar {...props} />;
}

function AppShellSidebar({
  sidebarHeader,
  sidebar,
  sidebarFooter,
  header,
  children,
  variant = "sidebar",
  collapsible = "offcanvas",
  sidebarWidth = "240px",
  headerVariant = "bordered",
  defaultOpen = true,
}: AppShellSidebarProps) {
  const headerStyle = HEADER_VARIANTS[headerVariant];
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="h-svh overflow-hidden"
      style={
        {
          "--sidebar-width": sidebarWidth,
          "--header-height": "calc(var(--spacing) * 14)",
        } as CSSProperties
      }
    >
      <AppShellSkipLink />
      <Sidebar variant={variant} collapsible={collapsible}>
        <SidebarHeader>{sidebarHeader}</SidebarHeader>
        <SidebarContent>{sidebar}</SidebarContent>
        {sidebarFooter ? <SidebarFooter>{sidebarFooter}</SidebarFooter> : null}
      </Sidebar>
      <SidebarInset
        className={cn(
          "max-h-svh min-h-0 overflow-hidden",
          variant === "inset" && "md:max-h-[calc(100svh-var(--app-shell-inset))] md:[--app-shell-inset:1rem]",
        )}
      >
        <header className={cn("flex shrink-0 items-center gap-2", headerStyle.header)}>
          <div className={cn("flex w-full items-center gap-1", headerStyle.bar)}>
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" size="sm" className={headerStyle.separator} />
            {header ? <div className="flex w-full min-w-0 items-center justify-between">{header}</div> : null}
          </div>
        </header>
        <div id={CONTENT_ID} tabIndex={-1} data-slot="app-shell-content" className={CONTENT_CLASS}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { AppShell, AppShellHeaderActions, AppShellLogo, AppShellNav, AppShellTitle, AppShellWorkspace };
