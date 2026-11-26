import { FolderKanbanIcon, MoreHorizontal } from "lucide-react";
import type { ComponentProps } from "react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import { CardLink } from "../../src/components/card";
import { DescriptionItem } from "../../src/components/description-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../src/components/dropdown-menu";
import { MemberAvatarStack } from "../../src/components/member-avatar-stack";
import {
  RecordCard,
  RecordCardFacts,
  RecordCardHeader,
  RecordCardMark,
} from "../../src/components/record-card";
import { StatusDot } from "../../src/components/status-dot";
import {
  type ClientProject,
  DISCOVERY_PRIORITY_LABELS,
  DISCOVERY_STATUS_LABELS,
  type DiscoveryPriority,
  type DiscoveryStatus,
  type OverallRating,
} from "./pool-fixtures";

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>["variant"]>;
type DotTone = NonNullable<ComponentProps<typeof StatusDot>["tone"]>;

// Rating tiers are Pool's own categories, so they take Pool's colours through `color`, not status tones.
// Hex here because Storybook does not load Pool's globals.css, where these are tokens.
const RATING_COLOR: Record<OverallRating, string | undefined> = {
  "top creator": "#7c3aed",
  standout: "#059669",
  good: "#0284c7",
  sufficient: "#71717a",
  problematic: "#ea580c",
  blacklisted: "#e11d48",
  untested: undefined,
};

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function RatingBadge({ rating }: { rating: OverallRating }) {
  return (
    <Badge
      variant={RATING_COLOR[rating] ? "secondary" : "outline"}
      color={RATING_COLOR[rating]}
      dot
    >
      {capitalize(rating)}
    </Badge>
  );
}

const DISCOVERY_STATUS_TONE: Record<DiscoveryStatus, DotTone> = {
  backlog: "neutral",
  todo: "warning",
  in_progress: "info",
  done: "success",
};

export function DiscoveryStatusDot({ status }: { status: DiscoveryStatus }) {
  return <StatusDot tone={DISCOVERY_STATUS_TONE[status]} label={DISCOVERY_STATUS_LABELS[status]} />;
}

const PRIORITY_VARIANT: Record<DiscoveryPriority, BadgeVariant> = {
  urgent: "destructive",
  high: "warning",
  medium: "outline",
  low: "secondary",
};

export function PriorityBadge({ priority }: { priority: DiscoveryPriority }) {
  return <Badge variant={PRIORITY_VARIANT[priority]}>{DISCOVERY_PRIORITY_LABELS[priority]}</Badge>;
}

const campaignHref = (clientId: string, project: ClientProject) =>
  `/clients/${clientId}/projects/${project.id}`;

/** A campaign on its client's page (Pool's project-list FolderCard): name, menu, team and created date. Most SOWs have no description, so the card leaves it out. */
export function CampaignCard({
  project,
  clientId,
  className,
}: {
  project: ClientProject;
  clientId: string;
  className?: string;
}) {
  return (
    <RecordCard className={className}>
      <RecordCardHeader
        media={
          <RecordCardMark>
            <FolderKanbanIcon />
          </RecordCardMark>
        }
        title={
          <CardLink
            href={campaignHref(clientId, project)}
            onClick={(event) => event.preventDefault()}
          >
            {project.name}
          </CardLink>
        }
        action={<EditDeleteMenu />}
      />
      <RecordCardFacts>
        <DescriptionItem label="Team">
          <MemberAvatarStack members={project.members} emptyLabel="No team" />
        </DescriptionItem>
        <DescriptionItem label="Created">{project.createdAt}</DescriptionItem>
      </RecordCardFacts>
    </RecordCard>
  );
}

/** An empty table cell. */
export const TablePlaceholder = () => <span className="text-subtle-foreground">—</span>;

/** Pool's dots menu on a client or a campaign: Edit, then Delete apart. */
export function EditDeleteMenu({
  editLabel = "Edit",
  deleteLabel = "Delete",
}: {
  editLabel?: string;
  deleteLabel?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dots" aria-label="Actions">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>{editLabel}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">{deleteLabel}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
