import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderKanbanIcon, PlusIcon } from "lucide-react";
import { Breadcrumb } from "../../../src/components/breadcrumb";
import { EmptyState } from "../../../src/components/empty-state";
import { IconButton } from "../../../src/components/icon-button";
import { Grid, Inline, Stack } from "../../../src/components/layout";
import { Page } from "../../../src/components/page";
import { SectionSpinner } from "../../../src/components/spinner";
import { CLIENT, CLIENT_PROJECTS, type ClientProject } from "./fixtures";
import { CampaignCard, campaignCount, EditDeleteMenu } from "./pool-blocks";
import { breadcrumbLink, POOL_SCREEN_PARAMETERS, PoolShell } from "./pool-shell";

function ClientOverview({
  projects = CLIENT_PROJECTS,
  loading = false,
}: {
  projects?: ClientProject[];
  loading?: boolean;
}) {
  return (
    <PoolShell
      active="Clients"
      header={
        <>
          <Breadcrumb
            links={loading ? [] : [{ label: "Clients", href: "/clients" }]}
            page={loading ? "Clients" : CLIENT.name}
            renderLink={breadcrumbLink}
          />
          {loading ? null : (
            <Inline gap="xs" wrap={false}>
              <IconButton label="New campaign" variant="ghost" size="icon-sm">
                <PlusIcon />
              </IconButton>
              <EditDeleteMenu editLabel="Edit client" deleteLabel="Delete client" />
            </Inline>
          )}
        </>
      }
    >
      <Page size="full" fill={loading || projects.length === 0}>
        {loading ? (
          <SectionSpinner />
        ) : projects.length > 0 ? (
          <Stack gap="md">
            <span className="text-xs text-muted-foreground tabular-nums">
              {campaignCount(projects.length)}
            </span>
            <Grid cols={3} gap="md">
              {projects.map((project) => (
                <CampaignCard key={project.id} project={project} clientId={CLIENT.id} />
              ))}
            </Grid>
          </Stack>
        ) : (
          <EmptyState
            icon={FolderKanbanIcon}
            title="No campaigns yet"
            description="Create a campaign to invite creators and track their delivery."
            action={{ label: "Create campaign", onClick: () => undefined }}
          />
        )}
      </Page>
    </PoolShell>
  );
}

const meta = {
  title: "Screens/Pool/Client overview",
  parameters: POOL_SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <ClientOverview /> };

export const Loading: Story = { render: () => <ClientOverview loading /> };

/** A new client: no campaign yet, so no figures to show. */
export const Empty: Story = { render: () => <ClientOverview projects={[]} /> };
