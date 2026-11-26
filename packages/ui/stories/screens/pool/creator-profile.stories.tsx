import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, PanelLeft } from "lucide-react";
import { useState } from "react";
import { Breadcrumb } from "../../../src/components/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../src/components/dropdown-menu";
import { IconButton } from "../../../src/components/icon-button";
import { Inline } from "../../../src/components/layout";
import { SectionSpinner } from "../../../src/components/spinner";
import { type ClosedCollaboration, CREATOR_PROFILE } from "../../lib/pool-fixtures";
import { CreatorProfileView } from "./pool-blocks";
import { breadcrumbLink, POOL_SCREEN_PARAMETERS, PoolShell } from "./pool-shell";

type Creator = typeof CREATOR_PROFILE;

function ProfileActions({ blacklisted }: { blacklisted: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label="Actions" variant="ghost">
          <MoreHorizontal />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Edit profile</DropdownMenuItem>
        <DropdownMenuItem>Add to campaign</DropdownMenuItem>
        {blacklisted ? null : <DropdownMenuItem>Copy shareable link</DropdownMenuItem>}
        <DropdownMenuSeparator />
        {blacklisted ? (
          <DropdownMenuItem>Remove from blacklist</DropdownMenuItem>
        ) : (
          <DropdownMenuItem variant="destructive">Blacklist</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CreatorProfile({
  creator = CREATOR_PROFILE,
  loading = false,
  blacklisted = false,
  collaborations = CREATOR_PROFILE.closedCollaborations,
}: {
  creator?: Creator;
  loading?: boolean;
  blacklisted?: boolean;
  collaborations?: ClosedCollaboration[];
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  return (
    <PoolShell
      active="Database"
      header={
        <>
          <Breadcrumb
            links={loading ? [] : [{ label: "Database", href: "/database" }]}
            page={loading ? "Database" : creator.fullName}
            renderLink={breadcrumbLink}
          />
          <Inline gap="xs" wrap={false}>
            <IconButton
              label="Show info"
              pressedLabel="Hide info"
              pressed={infoOpen}
              className="sm:hidden"
              onClick={() => setInfoOpen(!infoOpen)}
            >
              <PanelLeft />
            </IconButton>
            {loading ? null : <ProfileActions blacklisted={blacklisted} />}
          </Inline>
        </>
      }
    >
      {loading ? (
        <SectionSpinner />
      ) : (
        <CreatorProfileView
          creator={creator}
          collaborations={collaborations}
          blacklisted={blacklisted}
          infoOpen={infoOpen}
        />
      )}
    </PoolShell>
  );
}

const meta = {
  title: "Screens/Pool/Creator profile",
  parameters: POOL_SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <CreatorProfile /> };

export const Loading: Story = { render: () => <CreatorProfile loading /> };

/** No closed collaboration yet: the rating stays untested until one is logged. */
export const Empty: Story = {
  render: () => (
    <CreatorProfile
      creator={{ ...CREATOR_PROFILE, overallRating: "untested" }}
      collaborations={[]}
    />
  ),
};

export const Blacklisted: Story = { render: () => <CreatorProfile blacklisted /> };
