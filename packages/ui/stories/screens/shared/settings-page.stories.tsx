import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarRange, MoreHorizontal, Plus, Settings, Users } from "lucide-react";
import { type ReactNode, useState } from "react";
import { AppShell, AppShellNav, AppShellTitle } from "../../../src/components/app-shell";
import { Badge } from "../../../src/components/badge";
import { Button } from "../../../src/components/button";
import { DataTable } from "../../../src/components/data-table";
import { DataTableShell } from "../../../src/components/data-table-shell";
import { DestructiveActionDialog } from "../../../src/components/destructive-action-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../src/components/dropdown-menu";
import { EmptyState } from "../../../src/components/empty-state";
import { IconButton } from "../../../src/components/icon-button";
import { NavUser } from "../../../src/components/nav-user";
import { Page, PageHeader } from "../../../src/components/page";
import { PersonIdentity } from "../../../src/components/person-identity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../src/components/select";
import { SettingsLayout } from "../../../src/components/settings-layout";
import { Tabs, TabsContent, TabsList } from "../../../src/components/tabs";
import { useActiveTitle } from "../../lib/app-fixtures";
import {
  ACCESS_MEMBERS,
  ACCESS_USER,
  ACCESS_VIEWER_ID,
  type AccessMember,
  type AccessRole,
  ROLE_LABEL,
} from "./fixtures";

const APP_NAV = [
  { title: "Home", href: "/" },
  { title: "Control Room", href: "/control-room" },
];

const SETTINGS_GROUPS = [
  {
    label: "Settings",
    items: [
      { title: "Cycles", icon: CalendarRange, href: "/settings/cycles" },
      { title: "Access", icon: Users, href: "/settings/access", isActive: true },
    ],
  },
];

const renderSettingsLink = (item: { href?: string }, content: ReactNode) => (
  <a href={item.href}>{content}</a>
);

const isYou = (member: AccessMember) => member.id === ACCESS_VIEWER_ID;

function RoleSelect({ member }: { member: AccessMember }) {
  const label = member.joinedOn ? member.name : member.email;
  return (
    <Select defaultValue={member.role}>
      <SelectTrigger size="sm" aria-label={`Role for ${label}`} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(ROLE_LABEL) as AccessRole[]).map((role) => (
          <SelectItem key={role} value={role}>
            {ROLE_LABEL[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MemberMenu({ member, onRemove }: { member: AccessMember; onRemove: () => void }) {
  if (isYou(member)) return null;
  const label = member.joinedOn ? member.name : member.email;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dots" aria-label={`More for ${label}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem variant="destructive" onSelect={onRemove}>
          {member.joinedOn ? "Remove access" : "Revoke invite"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const roleColumn: ColumnDef<AccessMember> = {
  id: "role",
  header: "Role",
  size: 160,
  cell: ({ row }) =>
    isYou(row.original) ? ROLE_LABEL[row.original.role] : <RoleSelect member={row.original} />,
};

function memberColumns(onRemove: (member: AccessMember) => void): ColumnDef<AccessMember>[] {
  return [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <PersonIdentity
          name={row.original.name}
          imageUrl={row.original.imageUrl}
          description={row.original.email}
          badge={isYou(row.original) ? <Badge variant="secondary">You</Badge> : undefined}
        />
      ),
    },
    {
      id: "lastActive",
      header: "Last active",
      cell: ({ row }) =>
        row.original.lastActiveOn ?? <span className="text-muted-foreground">Not yet</span>,
    },
    { accessorKey: "joinedOn", header: "Joined" },
    roleColumn,
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <MemberMenu member={row.original} onRemove={() => onRemove(row.original)} />
      ),
    },
  ];
}

function invitationColumns(onRemove: (member: AccessMember) => void): ColumnDef<AccessMember>[] {
  return [
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate">{row.original.email}</span>
          <Badge variant="secondary">Pending</Badge>
        </span>
      ),
    },
    { accessorKey: "invitedBy", header: "Invited by" },
    { accessorKey: "invitedOn", header: "Invited" },
    roleColumn,
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <MemberMenu member={row.original} onRemove={() => onRemove(row.original)} />
      ),
    },
  ];
}

function AccessSettings({
  members,
  initialTab = "members",
  removeFor,
}: {
  members: AccessMember[];
  initialTab?: "members" | "invitations";
  removeFor?: string;
}) {
  const [tab, setTab] = useState<string>(initialTab);
  const [removeTarget, setRemoveTarget] = useState(() =>
    members.find((member) => member.id === removeFor),
  );
  const [removing, setRemoving] = useState(Boolean(removeFor));
  const joined = members.filter((member) => member.joinedOn);
  const invited = members.filter((member) => !member.joinedOn);
  const askRemove = (member: AccessMember) => {
    setRemoveTarget(member);
    setRemoving(true);
  };

  return (
    <>
      <PageHeader
        title="Access"
        actions={
          <Button variant="outline">
            <Plus />
            Invite
          </Button>
        }
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList
          variant="line"
          aria-label="Access"
          tabs={[
            { value: "members", label: "Members" },
            { value: "invitations", label: "Invitations" },
          ]}
        />
        <TabsContent value="members">
          <DataTableShell>
            <DataTable columns={memberColumns(askRemove)} data={joined} />
          </DataTableShell>
        </TabsContent>
        <TabsContent value="invitations">
          {invited.length > 0 ? (
            <DataTableShell>
              <DataTable columns={invitationColumns(askRemove)} data={invited} />
            </DataTableShell>
          ) : (
            <EmptyState
              title="No pending invitations"
              description="Everyone invited has signed in. Invite someone to add them here."
            />
          )}
        </TabsContent>
      </Tabs>
      {removeTarget ? (
        <DestructiveActionDialog
          open={removing}
          onOpenChange={setRemoving}
          title={
            removeTarget.joinedOn
              ? `Remove ${removeTarget.name}'s access`
              : `Revoke the invite for ${removeTarget.email}`
          }
          description={
            removeTarget.joinedOn
              ? `${removeTarget.name} loses the ${ROLE_LABEL[removeTarget.role]} role and can't sign in from now on. Their invite and this change stay in the audit log.`
              : `${removeTarget.email} can't sign in from now on. The invite and this change stay in the audit log.`
          }
          confirmLabel={removeTarget.joinedOn ? "Remove access" : "Revoke invite"}
          onConfirm={() => setRemoving(false)}
        />
      ) : null}
    </>
  );
}

function SettingsPage(props: Parameters<typeof AccessSettings>[0]) {
  const appNav = useActiveTitle("");
  return (
    <AppShell
      layout="topbar"
      topbarBrand={<AppShellTitle>Impact & Recognition</AppShellTitle>}
      topbarNav={<AppShellNav items={appNav.markActive(APP_NAV)} renderLink={appNav.renderLink} />}
      topbarActions={
        <>
          <IconButton label="Settings" variant="ghost" size="icon-sm">
            <Settings />
          </IconButton>
          <NavUser {...ACCESS_USER} variant="avatar" onSignOut={() => undefined} />
        </>
      }
    >
      <Page size="medium">
        <SettingsLayout groups={SETTINGS_GROUPS} renderLink={renderSettingsLink}>
          <AccessSettings {...props} />
        </SettingsLayout>
      </Page>
    </AppShell>
  );
}

const meta = {
  title: "Screens/Shared/Settings page",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Impact & Recognition's Settings → Access, the one settings page in the apps with a section menu: members with their one role, saved on change; you cannot change your own. */
export const Default: Story = { render: () => <SettingsPage members={ACCESS_MEMBERS} /> };

/** People invited who have not signed in yet: who sent the invite, when, and the role waiting for them. */
export const Invitations: Story = {
  render: () => <SettingsPage members={ACCESS_MEMBERS} initialTab="invitations" />,
};

/** Everyone invited has signed in. */
export const NoInvitations: Story = {
  render: () => (
    <SettingsPage
      members={ACCESS_MEMBERS.filter((member) => member.joinedOn)}
      initialTab="invitations"
    />
  ),
};

/** Removing someone's access asks first and says what stays in the audit log. */
export const RemoveAccess: Story = {
  render: () => <SettingsPage members={ACCESS_MEMBERS} removeFor="p4" />,
};
