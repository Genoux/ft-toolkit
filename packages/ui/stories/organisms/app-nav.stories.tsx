import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Bell,
  CreditCard,
  MoreHorizontal,
  Package,
  Pencil,
  Plug,
  Plus,
  Settings,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { AppNav } from "../../src/components/app-nav";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../src/components/dropdown-menu";
import { IconButton } from "../../src/components/icon-button";
import { Sidebar, SidebarContent, SidebarProvider } from "../../src/components/sidebar";
import { Spinner } from "../../src/components/spinner";
import { StatusDot } from "../../src/components/status-dot";
import { POOL_CLIENTS, POOL_NAV, useActiveTitle } from "../lib/app-fixtures";

function SidebarFrame({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-auto min-h-0 w-60 overflow-hidden rounded-xl border">
      <Sidebar collapsible="none" className="w-full">
        <SidebarContent>{children}</SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

const SETTINGS_ITEMS = [
  { title: "Profile", icon: UserRound },
  { title: "Notifications", icon: Bell, count: 3 },
  {
    title: "Clients",
    icon: Users,
    items: POOL_CLIENTS.map((client) => ({ title: client })),
  },
  { title: "Integrations", icon: Plug, items: [{ title: "Slack" }, { title: "Google Drive" }] },
  { title: "Billing", icon: CreditCard, disabled: true },
];

function PoolNav() {
  const { markActive, renderLink } = useActiveTitle("Collaborations");
  return (
    <SidebarFrame>
      <AppNav label="Pool" items={markActive(POOL_NAV)} renderLink={renderLink} />
    </SidebarFrame>
  );
}

function SettingsNav({ initialTitle }: { initialTitle: string }) {
  const { markActive, renderLink } = useActiveTitle(initialTitle);
  const items = markActive(SETTINGS_ITEMS).map((item) =>
    item.items ? { ...item, items: markActive(item.items) } : item,
  );
  return (
    <SidebarFrame>
      <AppNav label="Settings" items={items} renderLink={renderLink} />
    </SidebarFrame>
  );
}

type SessionStatus = "processing" | "complete" | "error" | "idle";

const MY_SESSIONS: { title: string; client: string; status: SessionStatus }[] = [
  { title: "Holiday UGC round 2", client: "OURA", status: "processing" },
  { title: "Gen3 statics for Meta", client: "OURA", status: "complete" },
  { title: "Spring launch captions", client: "ATHB", status: "idle" },
  { title: "Founders cut review", client: "LQDT", status: "error" },
];

const TEAM_SESSIONS: { title: string; client: string; status: SessionStatus }[] = [
  { title: "Glow serum whitelisting", client: "GLSR", status: "idle" },
  { title: "Q1 TikTok scripts", client: "NTMX", status: "idle" },
];

function SessionStatusIndicator({ status }: { status: SessionStatus }) {
  if (status === "processing") return <Spinner label="Batch processing" />;
  if (status === "complete")
    return <StatusDot tone="success" label={<span className="sr-only">Batch complete</span>} />;
  if (status === "error")
    return <StatusDot tone="destructive" label={<span className="sr-only">Batch errored</span>} />;
  return null;
}

function SessionActions({ title }: { title: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dots" aria-label={`Actions for ${title}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
  );
}

function SessionGroup({
  label,
  sessions,
  defaultOpen,
  markActive,
  renderLink,
}: {
  label: string;
  sessions: typeof MY_SESSIONS;
  defaultOpen?: boolean;
} & Pick<ReturnType<typeof useActiveTitle>, "markActive" | "renderLink">) {
  return (
    <AppNav
      label={label}
      collapsible
      defaultOpen={defaultOpen}
      items={markActive(
        sessions.map((session) => ({
          title: session.title,
          trailing: (
            <>
              <SessionStatusIndicator status={session.status} />
              <Badge variant="secondary" size="sm">
                {session.client}
              </Badge>
            </>
          ),
          actions: <SessionActions title={session.title} />,
        })),
      )}
      renderLink={renderLink}
    />
  );
}

function SessionsNav({ teamOpen = true }: { teamOpen?: boolean }) {
  const { markActive, renderLink } = useActiveTitle("Holiday UGC round 2");
  return (
    <SidebarFrame>
      <SessionGroup
        label="My sessions"
        sessions={MY_SESSIONS}
        markActive={markActive}
        renderLink={renderLink}
      />
      <SessionGroup
        label="Team sessions"
        sessions={TEAM_SESSIONS}
        defaultOpen={teamOpen}
        markActive={markActive}
        renderLink={renderLink}
      />
    </SidebarFrame>
  );
}

const PRODUCTS = ["Oura Ring 4", "Oura Ring Gen3", "Membership"];

function ProductsNav() {
  const { markActive, renderLink } = useActiveTitle("Never say");
  return (
    <SidebarFrame>
      <AppNav
        label="Products"
        action={
          <IconButton label="Add product" variant="ghost" size="icon-xs">
            <Plus />
          </IconButton>
        }
        items={PRODUCTS.map((product, index) => ({
          title: product,
          icon: Package,
          defaultOpen: index === 0,
          items: markActive(
            ["Claims", "Never say", "Disclaimers"].map((section) => ({
              title: index === 0 ? section : `${product} ${section}`,
            })),
          ),
        }))}
        renderLink={renderLink}
      />
    </SidebarFrame>
  );
}

const meta = {
  title: "Organisms/AppNav",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Active (raised, sub-items too), resting, counts, disabled, a parent opened by its active sub-item next to a closed one, trailing statuses with hover actions, folding groups (one folded) and a label action. Hover a session row to reveal its actions. */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <PoolNav />
      <SettingsNav initialTitle="Oura" />
      <SessionsNav teamOpen={false} />
      <ProductsNav />
    </div>
  ),
};

export const Default: Story = { render: () => <PoolNav /> };

/** Per-client settings: a row with `items` toggles a sub-menu instead of linking; it opens while a sub-item is active. */
export const NestedGroups: Story = { render: () => <SettingsNav initialTitle="Nutramax" /> };

/** One AppNav per group; `label` is the overline. */
export const Groups: Story = {
  render: () => {
    function GroupsPreview() {
      const { markActive, renderLink } = useActiveTitle("Collaborations");
      return (
        <SidebarFrame>
          <AppNav label="Pool" items={markActive(POOL_NAV)} renderLink={renderLink} />
          <AppNav
            label="Workspace"
            items={markActive([{ title: "Settings", icon: Settings }])}
            renderLink={renderLink}
          />
        </SidebarFrame>
      );
    }
    return <GroupsPreview />;
  },
};

/** `trailing` holds a status (Spinner, StatusDot, small Badge); `actions` holds a `dots` menu, revealed on hover and focus and always shown on touch. The trailing status makes way while the actions show. */
export const StatusAndActions: Story = { render: () => <SessionsNav /> };

/** `collapsible` lets the label fold the group away; `defaultOpen={false}` starts it folded. */
export const CollapsibleGroups: Story = { render: () => <SessionsNav teamOpen={false} /> };

/** `action` sits beside the label, such as "Add product". An active sub-item is raised like an active top-level row. */
export const LabelAction: Story = { render: () => <ProductsNav /> };
