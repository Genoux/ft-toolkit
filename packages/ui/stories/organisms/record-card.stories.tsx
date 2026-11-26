import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderKanbanIcon } from "lucide-react";
import { CardLink } from "../../src/components/card";
import { DataTableShell } from "../../src/components/data-table-shell";
import { DescriptionItem } from "../../src/components/description-list";
import { Grid, Inline, Stack } from "../../src/components/layout";
import { MemberAvatarStack } from "../../src/components/member-avatar-stack";
import {
  RecordCard,
  RecordCardFacts,
  RecordCardHeader,
  RecordCardMark,
  RecordCardMeter,
  RecordCardSkeleton,
  RecordCardTags,
} from "../../src/components/record-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowActions,
} from "../../src/components/table";
import { Tabs, TabsContent, TabsList } from "../../src/components/tabs";
import { SIMULATED_STATE_CLASS } from "../lib/control-states";
import {
  CampaignCard,
  DiscoveryStatusDot,
  EditDeleteMenu,
  PriorityBadge,
} from "../lib/pool-display";
import {
  CLIENT,
  CLIENT_PROJECTS,
  campaignCount,
  DISCOVERY_REQUESTS,
  type DiscoveryRequest,
} from "../lib/pool-fixtures";
import { AnnotationCaption, getAnnotatedState, StateMarker } from "../lib/state-annotation";

const [holidayGifting, futuredew, perfumeSeeding] = CLIENT_PROJECTS;

const requestTitle = (request: DiscoveryRequest) => request.clientName ?? "Proposal";

/**
 * A request on Pool's discovery board: the one record in our apps with a progress value, profiles
 * sourced out of those asked for.
 */
function DiscoveryRequestCard({
  request,
  className,
}: {
  request: DiscoveryRequest;
  className?: string;
}) {
  const title = requestTitle(request);
  return (
    <RecordCard className={className}>
      <RecordCardHeader
        media={<RecordCardMark name={title} />}
        title={
          <CardLink href={`/discovery/${request.id}`} onClick={(event) => event.preventDefault()}>
            {title}
          </CardLink>
        }
        description={request.deadline ? `Due ${request.deadline}` : "No deadline"}
      />
      <RecordCardTags>
        {request.priority ? <PriorityBadge priority={request.priority} /> : null}
        <DiscoveryStatusDot status={request.status} />
      </RecordCardTags>
      <RecordCardFacts>
        <DescriptionItem label="Assignees">
          <MemberAvatarStack members={request.assignees} emptyLabel="Unassigned" />
        </DescriptionItem>
      </RecordCardFacts>
      <RecordCardMeter
        label="Profiles sourced"
        value={Math.min(100, (request.profilesFound / request.profilesToSource) * 100)}
        valueLabel={`${request.profilesFound} / ${request.profilesToSource}`}
      />
    </RecordCard>
  );
}

const sourcing = DISCOVERY_REQUESTS.filter((request) => request.status === "in_progress");

const meta = {
  title: "Organisms/RecordCard",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SIMULATED_CARD_STATE = {
  default: undefined,
  hover: "border-input",
  "focus-visible": SIMULATED_STATE_CLASS.focus,
} as const;

/** At rest, hovered and focused (the whole card is the link, the menu its own target), then without a description, with a meter, and loading. */
export const AllStates: Story = {
  render: () => (
    <Stack gap="xl" className="w-5xl">
      <Stack gap="sm">
        <AnnotationCaption>rest · hover · focus-visible</AnnotationCaption>
        <Grid cols={3} gap="md">
          {(["default", "hover", "focus-visible"] as const).map((state) => (
            <StateMarker key={state} state={getAnnotatedState(state)} className="w-full">
              <CampaignCard
                project={holidayGifting}
                clientId={CLIENT.id}
                className={SIMULATED_CARD_STATE[state]}
              />
            </StateMarker>
          ))}
        </Grid>
      </Stack>
      <Stack gap="sm">
        <AnnotationCaption>without description · with a meter · loading</AnnotationCaption>
        <Grid cols={3} gap="md">
          <CampaignCard project={perfumeSeeding} clientId={CLIENT.id} />
          {sourcing[0] ? <DiscoveryRequestCard request={sourcing[0]} /> : null}
          <RecordCardSkeleton />
        </Grid>
      </Stack>
    </Stack>
  ),
};

/** A Pool campaign on its client's page: an icon tile, name and description, the menu, then team and created date ruled off at the bottom. */
export const Default: Story = {
  render: () => <CampaignCard project={futuredew} clientId={CLIENT.id} className="w-sm" />,
};

/** A campaign with no description keeps its name at the top, in line with its neighbours. */
export const WithoutDescription: Story = {
  render: () => (
    <Grid cols={2} gap="md" className="w-3xl">
      <CampaignCard project={futuredew} clientId={CLIENT.id} />
      <CampaignCard project={perfumeSeeding} clientId={CLIENT.id} />
    </Grid>
  ),
};

/** A discovery request: the client's initial (one letter for a brand; people get two), priority and status, then how many profiles are sourced. */
export const WithMeter: Story = {
  render: () => (
    <Grid cols={2} gap="md" className="w-3xl">
      {sourcing.map((request) => (
        <DiscoveryRequestCard key={request.id} request={request} />
      ))}
    </Grid>
  ),
};

export const Loading: Story = {
  render: () => (
    <Grid cols={3} gap="md" className="w-5xl" aria-busy="true" aria-label="Loading campaigns">
      {["first", "second", "third"].map((key) => (
        <RecordCardSkeleton key={key} />
      ))}
    </Grid>
  ),
};

/** A client's campaigns as on Pool's client page: the count above, two across, three from xl; facts line up whatever the header holds. */
export const InAGrid: Story = {
  render: () => (
    <Stack gap="md" className="w-5xl">
      <span className="text-xs text-muted-foreground tabular-nums">
        {campaignCount(CLIENT_PROJECTS.length)}
      </span>
      <Grid cols={2} gap="md" className="xl:grid-cols-3">
        {CLIENT_PROJECTS.map((project) => (
          <CampaignCard key={project.id} project={project} clientId={CLIENT.id} />
        ))}
      </Grid>
    </Stack>
  ),
};

function CampaignsTable() {
  return (
    <DataTableShell>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/5">Campaign</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-16">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {CLIENT_PROJECTS.map((project) => (
            <TableRow key={project.id} data-row>
              <TableCell>
                <Inline gap="md" wrap={false}>
                  <RecordCardMark size="md">
                    <FolderKanbanIcon />
                  </RecordCardMark>
                  <Stack gap="none" className="min-w-0">
                    <span className="truncate font-medium">{project.name}</span>
                    {project.description ? (
                      <span className="truncate text-xs text-subtle-foreground">
                        {project.description}
                      </span>
                    ) : null}
                  </Stack>
                </Inline>
              </TableCell>
              <TableCell>
                <MemberAvatarStack members={project.members} emptyLabel="No team" />
              </TableCell>
              <TableCell>{project.createdAt}</TableCell>
              <TableCell>
                <TableRowActions>
                  <EditDeleteMenu />
                </TableRowActions>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableShell>
  );
}

/** A client's campaigns as a table, to compare them column by column, or as cards, to scan and open them, behind a segmented toggle. */
export const ViewSwitch: Story = {
  render: () => (
    <Tabs defaultValue="cards" className="w-5xl">
      <Stack gap="md">
        <Inline justify="between">
          <span className="text-xs text-muted-foreground tabular-nums">
            {campaignCount(CLIENT_PROJECTS.length)}
          </span>
          <TabsList
            size="sm"
            tabs={[
              { value: "table", label: "Table" },
              { value: "cards", label: "Cards" },
            ]}
          />
        </Inline>
        <TabsContent value="table">
          <CampaignsTable />
        </TabsContent>
        <TabsContent value="cards">
          <Grid cols={2} gap="md" className="xl:grid-cols-3">
            {CLIENT_PROJECTS.map((project) => (
              <CampaignCard key={project.id} project={project} clientId={CLIENT.id} />
            ))}
          </Grid>
        </TabsContent>
      </Stack>
    </Tabs>
  ),
};
