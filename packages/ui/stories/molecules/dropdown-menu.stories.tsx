import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontalIcon,
  Pencil,
  Settings,
  Trash2,
  UserRound,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "../../src/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../src/components/dropdown-menu";
import { IconButton } from "../../src/components/icon-button";
import { NavUserMenu } from "../../src/components/nav-user";
import { PersonAvatar } from "../../src/components/person-identity";
import { POOL_SORT_OPTIONS } from "../lib/overlay-fixtures";
import { CLIENT_PROJECTS, POOL_USER } from "../lib/pool-fixtures";
import { MY_SESSIONS } from "../lib/proof-agent-fixtures";

const meta = {
  title: "Molecules/DropdownMenu",
  component: DropdownMenu,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Keeps a showcase menu open while a neighbour takes focus, so several show at once. */
const stayOpen = (event: Event) => event.preventDefault();

function ShowcaseMenu({
  trigger,
  className,
  children,
}: {
  trigger: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <DropdownMenu defaultOpen modal={false}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={className}
        onFocusOutside={stayOpen}
        onInteractOutside={stayOpen}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Pool, features/creators/components/admin/creator-profile/creator-profile.tsx. */
function CreatorProfileItems() {
  return (
    <>
      <DropdownMenuItem>Edit profile</DropdownMenuItem>
      <DropdownMenuItem>Add to campaign</DropdownMenuItem>
      <DropdownMenuItem>Copy shareable link</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">Blacklist</DropdownMenuItem>
    </>
  );
}

/** Pool, features/creators/components/admin/creator-database.tsx. */
function SortItems() {
  const [sort, setSort] = useState(POOL_SORT_OPTIONS[0] ?? "");
  return (
    <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
      {POOL_SORT_OPTIONS.map((option) => (
        <DropdownMenuRadioItem key={option} value={option}>
          {option}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}

/** Pool, features/discovery/components/sourced-profiles-toolbar.tsx: every selected row is already Approved. */
function BulkStatusItems() {
  return (
    <>
      <DropdownMenuItem disabled>Approve</DropdownMenuItem>
      <DropdownMenuItem>Reject</DropdownMenuItem>
      <DropdownMenuItem>Pending</DropdownMenuItem>
    </>
  );
}

/** The account menu every app shares (NavUserMenu): who is signed in, then Account, Settings and Sign out. */
function AccountMenuItems() {
  return (
    <NavUserMenu {...POOL_USER} onSignOut={() => undefined}>
      <DropdownMenuItem>
        <UserRound />
        Account
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings />
        Settings
      </DropdownMenuItem>
    </NavUserMenu>
  );
}

export const AllStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Real menus side by side: Pool's creator profile actions (destructive item after a rule), Pool's bulk status menu (a disabled item), Pool's database sort (radio items) and the shared account menu (NavUserMenu: avatar, name and email, then account items and Sign out). Hover or arrow through them to see the highlighted state.",
      },
    },
  },
  render: () => (
    <div className="flex h-96 items-start gap-48">
      <ShowcaseMenu
        className="w-52"
        trigger={
          <IconButton label="Actions" variant="outline">
            <MoreHorizontalIcon />
          </IconButton>
        }
      >
        <CreatorProfileItems />
      </ShowcaseMenu>
      <ShowcaseMenu
        className="w-40"
        trigger={
          <Button variant="secondary" size="sm">
            Actions
            <ChevronDown />
          </Button>
        }
      >
        <BulkStatusItems />
      </ShowcaseMenu>
      <ShowcaseMenu
        className="w-52"
        trigger={
          <IconButton label="Sort" variant="outline">
            <ArrowUpDown />
          </IconButton>
        }
      >
        <SortItems />
      </ShowcaseMenu>
      <ShowcaseMenu
        className="w-64"
        trigger={
          <Button variant="ghost" aria-label={`Account menu for ${POOL_USER.name}`}>
            <PersonAvatar name={POOL_USER.name} imageUrl={POOL_USER.avatarUrl} decorative />
            {POOL_USER.name}
          </Button>
        }
      >
        <AccountMenuItems />
      </ShowcaseMenu>
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label="Actions" variant="outline">
          <MoreHorizontalIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <CreatorProfileItems />
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const RowActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pool's campaign card menu. The dots trigger stays hidden until its `data-row` ancestor is hovered.",
      },
    },
  },
  render: () => (
    <div
      data-row
      className="flex w-96 items-center justify-between rounded-md px-3 py-2 text-table hover:bg-muted/60"
    >
      {CLIENT_PROJECTS[0]?.name}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="dots" aria-label="Actions">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: "Proof's session row menu: opens to the right of the sidebar row.",
      },
    },
  },
  render: () => (
    <div data-row className="flex w-64 items-center justify-between rounded-lg px-3 py-2 text-sm">
      {MY_SESSIONS[0]?.title}
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="dots" aria-label="Open session menu">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-36">
          <DropdownMenuItem>
            <Pencil />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const RadioItems: Story = {
  render: () => (
    <div className="h-64">
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <IconButton label="Sort" variant="outline">
            <ArrowUpDown />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <SortItems />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
