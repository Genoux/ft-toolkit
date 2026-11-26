import {
  BadgeCheck,
  BellIcon,
  FolderIcon,
  type LucideIcon,
  SearchCheckIcon,
  UserPlus,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { AppNav } from "../../../src/components/app-nav";
import { AppShell, AppShellTitle } from "../../../src/components/app-shell";
import { IconButton } from "../../../src/components/icon-button";
import { NavUser } from "../../../src/components/nav-user";
import { POOL_USER } from "../../lib/pool-fixtures";

export type PoolSection = "Applicants" | "Database" | "Clients" | "Collaborations" | "Discovery";

type PoolNavItem = { title: PoolSection; url: string; icon: LucideIcon };

const NAV_ITEMS: PoolNavItem[] = [
  { title: "Applicants", url: "/applicants", icon: UserPlus },
  { title: "Database", url: "/database", icon: Users },
  { title: "Clients", url: "/clients", icon: FolderIcon },
  { title: "Collaborations", url: "/collaborations", icon: BadgeCheck },
  { title: "Discovery", url: "/discovery", icon: SearchCheckIcon },
];

export const storyLink = (href: string, content: ReactNode) => (
  <a href={href} onClick={(event) => event.preventDefault()}>
    {content}
  </a>
);

export const breadcrumbLink = (link: { href: string }, content: ReactNode) =>
  storyLink(link.href, content);

function NotificationsBell({ unseenCount = 3 }: { unseenCount?: number }) {
  return (
    <IconButton
      label={unseenCount > 0 ? `Notifications, ${unseenCount} unread` : "Notifications"}
      variant="ghost"
      size="icon-sm"
      indicator={unseenCount > 0}
    >
      <BellIcon />
    </IconButton>
  );
}

export function PoolShell({
  active,
  header,
  children,
}: {
  active: PoolSection;
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <AppShell
      sidebarHeader={
        <div className="flex items-center justify-between gap-2 pr-1.5">
          <AppShellTitle>Pool</AppShellTitle>
          <NotificationsBell />
        </div>
      }
      sidebar={
        <AppNav
          items={NAV_ITEMS.map((item) => ({ ...item, isActive: item.title === active }))}
          renderLink={(item, content) => storyLink(item.url, content)}
        />
      }
      sidebarFooter={<NavUser {...POOL_USER} onSignOut={() => undefined} />}
      header={header}
    >
      {children}
    </AppShell>
  );
}

export const POOL_SCREEN_PARAMETERS = { layout: "fullscreen" } as const;
