"use client";

import { ChevronDown, ChevronsUpDown, LogOut, Monitor, Moon, Sun, SunMoon } from "lucide-react";
import type * as React from "react";
import { getInitials } from "../lib/initials";
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./sidebar";

type NavUserProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type NavUserMenuProps = {
  /** Account items, such as a link to the profile; they open the menu under the user's name. */
  children?: React.ReactNode;
  /** The current theme, `light`, `dark` or `system`; next-themes' `theme`. */
  theme?: string;
  /** Adds a Theme sub-menu; next-themes' `setTheme`. */
  onThemeChange?: (theme: string) => void;
  /** Adds Sign out as the last item. */
  onSignOut?: () => void;
};

type NavUserProps = NavUserProfile &
  NavUserMenuProps & {
    /** `sidebar` is a full row for the sidebar footer, avatar only when collapsed to icons; `avatar` is a round button for a top bar. */
    variant?: "sidebar" | "avatar";
    /** With `avatar`, adds the name and a chevron beside the avatar from md, for a top bar with room. */
    showName?: boolean;
  };

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function UserAvatar({ name, avatarUrl }: Pick<NavUserProfile, "name" | "avatarUrl">) {
  return (
    <Avatar className="size-control-sm">
      {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
      <AvatarFallback>{getInitials(name, "?")}</AvatarFallback>
    </Avatar>
  );
}

function UserSummary({ name, email, avatarUrl }: NavUserProfile) {
  return (
    <>
      <UserAvatar name={name} avatarUrl={avatarUrl} />
      <div className="grid min-w-0 flex-1 text-left">
        <span className="truncate text-sm font-medium text-foreground">{name}</span>
        <span className="truncate text-xs font-normal text-subtle-foreground">{email}</span>
      </div>
    </>
  );
}

/** The account menu's items: the user's avatar, name and email, the account items, Theme and Sign out.
 * NavUser renders it in its own menu; place it in a DropdownMenuContent to open it from another trigger. */
function NavUserMenu({
  children,
  theme,
  onThemeChange,
  onSignOut,
  ...profile
}: NavUserProfile & NavUserMenuProps) {
  const currentTheme = THEMES.find((option) => option.value === (theme ?? "system"));
  return (
    <>
      <DropdownMenuLabel className="flex items-center gap-3 px-2.5 py-2">
        <UserSummary {...profile} />
      </DropdownMenuLabel>
      {children || onThemeChange ? <DropdownMenuSeparator /> : null}
      {children ? <DropdownMenuGroup>{children}</DropdownMenuGroup> : null}
      {onThemeChange ? (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <SunMoon />
            Theme
            <span className="ml-auto text-xs text-subtle-foreground">{currentTheme?.label}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-36">
            <DropdownMenuRadioGroup value={currentTheme?.value} onValueChange={onThemeChange}>
              {THEMES.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <option.icon />
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      ) : null}
      {onSignOut ? (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onSignOut}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </>
      ) : null}
    </>
  );
}

function NavUserSidebar({ name, email, avatarUrl, ...menu }: Omit<NavUserProps, "variant">) {
  const { isMobile } = useSidebar();
  const profile = { name, email, avatarUrl };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              data-slot="nav-user"
              data-variant="sidebar"
              tooltip={name}
              className="h-14 gap-3 px-2.5 group-data-[collapsible=icon]:p-0! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserSummary {...profile} />
              <ChevronsUpDown className="ml-auto text-subtle-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <NavUserMenu {...profile} {...menu} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function NavUserAvatar({
  name,
  email,
  avatarUrl,
  showName = false,
  ...menu
}: Omit<NavUserProps, "variant">) {
  const profile = { name, email, avatarUrl };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-slot="nav-user"
        data-variant="avatar"
        data-show-name={showName || undefined}
        aria-label={`Account menu for ${name}`}
        className={cn(
          "flex shrink-0 items-center gap-2 rounded-full outline-none transition-[box-shadow,background-color] duration-(--duration-fast) ease-out-expo focus-visible:focus-ring",
          showName
            ? "md:h-11 md:py-1 md:pr-3 md:pl-1 md:hover:bg-muted md:data-[state=open]:bg-muted max-md:hover:ring-3 max-md:hover:ring-border max-md:data-[state=open]:ring-3 max-md:data-[state=open]:ring-border"
            : "hover:ring-3 hover:ring-border data-[state=open]:ring-3 data-[state=open]:ring-border",
        )}
      >
        <UserAvatar name={name} avatarUrl={avatarUrl} />
        {showName ? (
          <>
            <span className="hidden max-w-40 truncate text-sm font-medium md:block">{name}</span>
            <ChevronDown aria-hidden className="hidden size-4 text-subtle-foreground md:block" />
          </>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="end" sideOffset={6}>
        <NavUserMenu {...profile} {...menu} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavUser({ variant = "sidebar", ...props }: NavUserProps) {
  return variant === "avatar" ? <NavUserAvatar {...props} /> : <NavUserSidebar {...props} />;
}

export { NavUser, NavUserMenu };
