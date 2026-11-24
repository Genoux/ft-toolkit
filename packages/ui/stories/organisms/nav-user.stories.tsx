import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings, UserRound } from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";
import { DropdownMenuItem } from "../../src/components/dropdown-menu";
import { NavUser } from "../../src/components/nav-user";
import { Sidebar, SidebarFooter, SidebarProvider } from "../../src/components/sidebar";
import { POOL_USER } from "../lib/app-fixtures";

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

function FullNavUser(props: Partial<ComponentProps<typeof NavUser>>) {
  const [theme, setTheme] = useState("system");
  return (
    <NavUser
      {...POOL_USER}
      theme={theme}
      onThemeChange={setTheme}
      onSignOut={() => undefined}
      {...props}
    >
      <AccountItems />
    </NavUser>
  );
}

function SidebarFooterFrame({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-auto min-h-0 w-60 overflow-hidden rounded-xl border">
      <Sidebar collapsible="none" className="w-full">
        <SidebarFooter>{children}</SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}

const meta = {
  title: "Organisms/NavUser",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sidebar row with a photo, with initials, with a long name; the avatar button for a top bar, then with `showName`. */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-10">
      <div className="flex flex-col gap-3">
        <SidebarFooterFrame>
          <FullNavUser />
        </SidebarFooterFrame>
        <SidebarFooterFrame>
          <FullNavUser avatarUrl={undefined} />
        </SidebarFooterFrame>
        <SidebarFooterFrame>
          <FullNavUser
            name="Alexandra Montgomery-Whitfield"
            email="alexandra.montgomery-whitfield@inbeat.agency"
          />
        </SidebarFooterFrame>
      </div>
      <div className="flex items-center gap-4">
        <FullNavUser variant="avatar" />
        <FullNavUser variant="avatar" avatarUrl={undefined} />
        <FullNavUser variant="avatar" showName />
        <FullNavUser variant="avatar" showName avatarUrl={undefined} />
      </div>
    </div>
  ),
};

/** Account items as children, a Theme sub-menu from `theme` + `onThemeChange`, and Sign out from `onSignOut`. */
export const MenuOpen: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex h-96 items-end">
      <SidebarFooterFrame>
        <FullNavUser />
      </SidebarFooterFrame>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /Maya Thompson/ }));
  },
};

/** `variant="avatar"`: the top bar's round button; the menu opens below, aligned to the end. */
export const AvatarMenuOpen: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex h-96 items-start justify-end">
      <FullNavUser variant="avatar" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /Account menu/ }));
  },
};

/** `showName`: avatar, name and a chevron from md, for a top bar with room; a phone keeps the round avatar. */
export const AvatarWithNameMenuOpen: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex h-96 items-start justify-end">
      <FullNavUser variant="avatar" showName />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /Account menu/ }));
  },
};

/** Only `children`: no theme or sign out unless the app passes them. */
export const ChildrenOnly: Story = {
  render: () => (
    <SidebarFooterFrame>
      <NavUser {...POOL_USER}>
        <AccountItems />
      </NavUser>
    </SidebarFooterFrame>
  ),
};
