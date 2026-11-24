import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Languages, MoreHorizontal, Search, Settings, Share2, UserRound } from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";
import { AppNav } from "../../src/components/app-nav";
import {
  AppShell,
  AppShellHeaderActions,
  AppShellNav,
  AppShellTitle,
} from "../../src/components/app-shell";
import { Breadcrumb } from "../../src/components/breadcrumb";
import { Button } from "../../src/components/button";
import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../../src/components/dropdown-menu";
import { IconButton } from "../../src/components/icon-button";
import { NavUser } from "../../src/components/nav-user";
import { Page, PageHeader } from "../../src/components/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../src/components/select";
import {
  COLLABORATION_TOTAL,
  COLLABORATIONS,
  CollaborationsTable,
  CollaborationsToolbar,
  POOL_NAV,
  POOL_USER,
  useActiveTitle,
} from "../lib/app-fixtures";

/** The page every shell story frames: Pool's Collaborations, the closed collaborations with search and filters. */
function PoolPage() {
  return (
    <Page>
      <PageHeader
        title="Collaborations"
        description={`${COLLABORATION_TOTAL} closed collaborations`}
      />
      <CollaborationsToolbar sticky />
      <CollaborationsTable rows={COLLABORATIONS} />
    </Page>
  );
}

function AccountItems() {
  return (
    <>
      <DropdownMenuItem>
        <UserRound />
        Account
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings />
        Settings
      </DropdownMenuItem>
    </>
  );
}

function PoolNavUser({ variant }: { variant?: "sidebar" | "avatar" }) {
  const [theme, setTheme] = useState("system");
  return (
    <NavUser
      {...POOL_USER}
      variant={variant}
      theme={theme}
      onThemeChange={setTheme}
      onSignOut={() => undefined}
    >
      <AccountItems />
    </NavUser>
  );
}

const APP_TITLE = <AppShellTitle>Pool</AppShellTitle>;

type SidebarArgs = Partial<
  Pick<ComponentProps<typeof AppShell>, "variant" | "headerVariant" | "collapsible" | "defaultOpen">
>;

function SidebarApp({
  sidebarHeader = APP_TITLE,
  header,
  ...shellProps
}: SidebarArgs & { sidebarHeader?: ReactNode; header?: (activeTitle: string) => ReactNode }) {
  const { activeTitle, markActive, renderLink } = useActiveTitle("Collaborations");
  return (
    <AppShell
      {...shellProps}
      sidebarHeader={sidebarHeader}
      sidebar={<AppNav items={markActive(POOL_NAV)} renderLink={renderLink} />}
      sidebarFooter={<PoolNavUser />}
      header={
        header?.(activeTitle) ?? (
          <>
            <Breadcrumb links={[{ label: "Pool", href: "#pool" }]} page={activeTitle} />
            <IconButton label="Notifications" variant="ghost" size="icon-sm">
              <Bell />
            </IconButton>
          </>
        )
      }
    >
      <PoolPage />
    </AppShell>
  );
}

function TopbarApp({ variant }: { variant?: "pill" | "underline" }) {
  const { markActive, renderLink } = useActiveTitle("Collaborations");
  return (
    <AppShell
      layout="topbar"
      topbarBrand={APP_TITLE}
      topbarNav={
        <AppShellNav items={markActive(POOL_NAV)} renderLink={renderLink} variant={variant} />
      }
      topbarActions={
        <>
          <IconButton label="Search" variant="ghost" size="icon-sm">
            <Search />
          </IconButton>
          <IconButton label="Notifications" variant="ghost" size="icon-sm">
            <Bell />
          </IconButton>
          <PoolNavUser variant="avatar" />
        </>
      }
    >
      <PoolPage />
    </AppShell>
  );
}

const REPORT_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

function CampaignHeader({ activeTitle }: { activeTitle: string }) {
  const [language, setLanguage] = useState("en");
  return (
    <>
      <Breadcrumb links={[{ label: "Pool", href: "#pool" }]} page={activeTitle} />
      <AppShellHeaderActions
        menu={
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Languages />
                Report language
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                  {REPORT_LANGUAGES.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Share2 />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </>
        }
      >
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger size="sm" aria-label="Report language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {REPORT_LANGUAGES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <IconButton label="Share" size="icon-sm">
          <Share2 />
        </IconButton>
        <IconButton label="Notifications" size="icon-sm">
          <Bell />
        </IconButton>
      </AppShellHeaderActions>
    </>
  );
}

const DESKTOP = { viewport: { value: "desktop", isRotated: false } };
const MOBILE = { viewport: { value: "mobile2", isRotated: false } };

const meta = {
  title: "Organisms/AppShell",
  parameters: { layout: "fullscreen" },
  globals: DESKTOP,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sidebar: Story = { render: () => <SidebarApp /> };

/** `collapsible="icon"` keeps a rail of icons with tooltips; `defaultOpen={false}` starts collapsed (restore it from the `sidebar_state` cookie). */
export const SidebarIconCollapsed: Story = {
  render: () => <SidebarApp collapsible="icon" defaultOpen={false} />,
};

/** Below md the sidebar becomes a sheet opened from the header; choosing a link closes it. */
export const SidebarMobile: Story = { globals: MOBILE, render: () => <SidebarApp /> };

export const SidebarInset: Story = { render: () => <SidebarApp variant="inset" /> };

export const SidebarFloating: Story = {
  render: () => <SidebarApp variant="floating" headerVariant="plain" />,
};

/** `AppShellTitle asChild` makes the app's name the link home; still the name only, never a logo or version. */
export const SidebarTitleLink: Story = {
  render: () => (
    <SidebarApp
      sidebarHeader={
        <AppShellTitle asChild>
          <a href="#home">Pool</a>
        </AppShellTitle>
      }
    />
  ),
};

export const SidebarLongBreadcrumb: Story = {
  render: () => (
    <SidebarApp
      header={() => (
        <>
          <Breadcrumb
            links={[
              { label: "Clients", href: "#clients" },
              { label: "Nutramax", href: "#nutramax" },
              {
                label: "NMAX - UGC brief - D1 - Nutramax BAU UGC Ads - Concept 3 - Wellness",
                href: "#campaign",
              },
              { label: "Jade Rivera", href: "#creator" },
            ]}
            page="Brief - Concept 3 - Wellness hooks and raw footage"
          />
          <Button variant="dots" aria-label="Actions">
            <MoreHorizontal />
          </Button>
        </>
      )}
    />
  ),
};

/** `layout="topbar"`: no sidebar; brand, `AppShellNav` links and actions in one bar. */
export const Topbar: Story = { render: () => <TopbarApp /> };

export const TopbarUnderline: Story = { render: () => <TopbarApp variant="underline" /> };

/** Below md the links move into a menu sheet with their icons; choosing one closes it. */
export const TopbarMobile: Story = { globals: MOBILE, render: () => <TopbarApp /> };

/** `AppShellHeaderActions`: header controls inline from md… */
export const HeaderActions: Story = {
  render: () => (
    <SidebarApp header={(activeTitle) => <CampaignHeader activeTitle={activeTitle} />} />
  ),
};

/** …folded into a "…" menu below md, where choices become submenus. */
export const HeaderActionsMobile: Story = {
  globals: MOBILE,
  render: () => (
    <SidebarApp header={(activeTitle) => <CampaignHeader activeTitle={activeTitle} />} />
  ),
};
