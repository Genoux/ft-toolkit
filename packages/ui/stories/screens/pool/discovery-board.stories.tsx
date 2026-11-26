import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon } from "lucide-react";
import { Breadcrumb } from "../../../src/components/breadcrumb";
import { Card } from "../../../src/components/card";
import { EmptyState } from "../../../src/components/empty-state";
import { IconButton } from "../../../src/components/icon-button";
import { Inline, Stack } from "../../../src/components/layout";
import { MemberAvatarStack } from "../../../src/components/member-avatar-stack";
import { Page } from "../../../src/components/page";
import { Progress } from "../../../src/components/progress";
import { SectionSpinner } from "../../../src/components/spinner";
import { Tabs, TabsList } from "../../../src/components/tabs";
import { DiscoveryStatusDot, PriorityBadge } from "../../lib/pool-display";
import {
  DISCOVERY_REQUESTS,
  DISCOVERY_REQUESTS_OVERDUE,
  DISCOVERY_STATUS_LABELS,
  DISCOVERY_STATUSES,
  type DiscoveryRequest,
  type DiscoveryStatus,
} from "../../lib/pool-fixtures";
import { POOL_SCREEN_PARAMETERS, PoolShell } from "./pool-shell";

const DISCOVERY_VIEW_TABS = [
  { value: "list", label: "List" },
  { value: "board", label: "Board" },
];

function DueLabel({ request }: { request: DiscoveryRequest }) {
  if (!request.deadline)
    return <span className="truncate text-xs text-muted-foreground">No deadline</span>;
  return (
    <span
      className={
        request.overdue
          ? "truncate text-xs font-medium text-destructive-foreground"
          : "truncate text-xs text-muted-foreground"
      }
    >
      {request.overdue ? "Overdue · " : "Due "}
      <time>{request.deadline}</time>
    </span>
  );
}

// signature-surface: discovery request card (priority, deadline, assignees, sourcing progress).
function DiscoveryRequestCard({ request }: { request: DiscoveryRequest }) {
  const progress = Math.min(100, (request.profilesFound / request.profilesToSource) * 100);
  return (
    <Card asChild className="rounded-lg">
      <a href={`/discovery/${request.id}`} onClick={(event) => event.preventDefault()}>
        <Inline gap="sm" wrap={false}>
          {request.priority ? <PriorityBadge priority={request.priority} /> : null}
          <DueLabel request={request} />
          {request.assignees.length > 0 ? (
            <span className="ml-auto flex">
              <MemberAvatarStack members={request.assignees} />
            </span>
          ) : null}
        </Inline>
        <span className="line-clamp-2 text-sm font-medium">{request.clientName ?? "Proposal"}</span>
        <Inline gap="md" wrap={false}>
          <Progress value={progress} aria-label="Profiles sourced" />
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {request.profilesFound} / {request.profilesToSource}
          </span>
        </Inline>
      </a>
    </Card>
  );
}

// signature-surface: board column (status heading with count, a scrolling list of request cards).
function BoardColumn({
  status,
  requests,
}: {
  status: DiscoveryStatus;
  requests: DiscoveryRequest[];
}) {
  return (
    <section
      aria-label={DISCOVERY_STATUS_LABELS[status]}
      className="flex min-h-0 min-w-64 flex-1 flex-col gap-1 rounded-2xl bg-muted/60 p-1"
    >
      <h2 className="flex shrink-0 items-center gap-2 px-3 pt-3 pb-1.5 text-sm font-medium">
        <DiscoveryStatusDot status={status} />
        <span className="font-normal text-muted-foreground tabular-nums">{requests.length}</span>
      </h2>
      <Stack gap="sm" asChild>
        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-1">
          {requests.map((request) => (
            <li key={request.id}>
              <DiscoveryRequestCard request={request} />
            </li>
          ))}
        </ul>
      </Stack>
    </section>
  );
}

function DiscoveryBoard({
  requests = DISCOVERY_REQUESTS,
  loading = false,
}: {
  requests?: DiscoveryRequest[];
  loading?: boolean;
}) {
  return (
    <PoolShell
      active="Discovery"
      header={
        <>
          <Breadcrumb page="Discovery" />
          <IconButton label="New request" variant="ghost" size="icon-sm">
            <PlusIcon />
          </IconButton>
        </>
      }
    >
      <Page size="full" fill>
        <Stack gap="lg">
          <Tabs defaultValue="board">
            <TabsList tabs={DISCOVERY_VIEW_TABS} aria-label="View" />
          </Tabs>
          {loading ? (
            <SectionSpinner />
          ) : requests.length === 0 ? (
            <EmptyState
              title="No requests yet"
              description="Submit a discovery request so coordinators can start sourcing profiles."
              action={{ label: "New request", onClick: () => undefined }}
            />
          ) : (
            <div className="-mx-6 flex min-h-0 flex-1 gap-3 overflow-x-auto px-6 md:mx-0 md:px-0">
              {DISCOVERY_STATUSES.map((status) => (
                <BoardColumn
                  key={status}
                  status={status}
                  requests={requests.filter((request) => request.status === status)}
                />
              ))}
            </div>
          )}
        </Stack>
      </Page>
    </PoolShell>
  );
}

const meta = {
  title: "Screens/Pool/Discovery board",
  parameters: POOL_SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DiscoveryBoard /> };

/** A request turns overdue the day after its deadline (Toronto time) until it reaches Done. */
export const Overdue: Story = {
  render: () => <DiscoveryBoard requests={DISCOVERY_REQUESTS_OVERDUE} />,
};

export const Loading: Story = { render: () => <DiscoveryBoard loading /> };

export const Empty: Story = { render: () => <DiscoveryBoard requests={[]} /> };
