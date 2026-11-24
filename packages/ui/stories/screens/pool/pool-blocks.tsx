import {
  BadgeCheck,
  Copy,
  Download,
  ExternalLink,
  FolderIcon,
  FolderKanbanIcon,
  MoreHorizontal,
} from "lucide-react";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../../src/components/alert";
import { Badge } from "../../../src/components/badge";
import { Button } from "../../../src/components/button";
import { CardLink } from "../../../src/components/card";
import {
  CollapsibleBody,
  CollapsibleHeader,
  CollapsibleSection,
} from "../../../src/components/collapsible-section";
import { DescriptionItem, DescriptionList } from "../../../src/components/description-list";
import { DetailLayout } from "../../../src/components/detail-layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../src/components/dropdown-menu";
import { EmptyState } from "../../../src/components/empty-state";
import { IconButton } from "../../../src/components/icon-button";
import { LabeledField } from "../../../src/components/labeled-field";
import { Grid, Inline, Stack } from "../../../src/components/layout";
import { MediaFrame, MediaFrameOverlay } from "../../../src/components/media-frame";
import { MemberAvatarStack } from "../../../src/components/member-avatar-stack";
import { Page, PageSection } from "../../../src/components/page";
import { PersonIdentity } from "../../../src/components/person-identity";
import {
  RecordCard,
  RecordCardFacts,
  RecordCardHeader,
  RecordCardMark,
} from "../../../src/components/record-card";
import { Separator } from "../../../src/components/separator";
import { StatusDot } from "../../../src/components/status-dot";
import { TextLink } from "../../../src/components/text-link";
import { Tooltip } from "../../../src/components/tooltip";
import { panelClassName } from "../../../src/lib/surface";
import { cn } from "../../../src/lib/utils";
import {
  type ClientProject,
  type ClosedCollaboration,
  CREATOR_PROFILE,
  DISCOVERY_PRIORITY_LABELS,
  DISCOVERY_STATUS_LABELS,
  type DiscoveryApprovalStatus,
  type DiscoveryPriority,
  type DiscoveryStatus,
  type OverallRating,
  photoUrl,
  STAFF,
} from "./fixtures";
import { PLATFORM_LOGOS, type Platform } from "./platform-logos";
import { storyLink } from "./pool-shell";

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

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

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

export const DISCOVERY_STATUS_TONE: Record<DiscoveryStatus, DotTone> = {
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

export const APPROVAL_TONE = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
} as const satisfies Record<DiscoveryApprovalStatus, BadgeVariant>;

export const formatMoney = (amount: number) =>
  `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

/** Pool's channel links: each platform's logo in a round chip, the platform named on hover. */
export function PlatformLinks({
  channels,
  size = "icon-xs",
}: {
  channels: Platform[];
  size?: ComponentProps<typeof IconButton>["size"];
}) {
  return (
    <Inline gap="xs">
      {channels.map((channel) => {
        const Logo = PLATFORM_LOGOS[channel];
        return (
          <IconButton key={channel} asChild label={channel} variant="outline" size={size}>
            <a href={`#${channel.toLowerCase()}`}>
              <Logo />
            </a>
          </IconButton>
        );
      })}
    </Inline>
  );
}

function TagGroup({ label, tags }: { label: string; tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <LabeledField
      label={label}
      value={
        <Inline gap="xs">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </Inline>
      }
    />
  );
}

// signature-surface: Pool's verified seal beside a top creator's name, in the top-creator violet.
export function VerifiedMark() {
  return (
    <Tooltip content="Top creator">
      <BadgeCheck
        aria-label="Top creator"
        className="size-5 shrink-0 text-white [&>path:first-child]:stroke-(--seal)"
        style={
          {
            fill: RATING_COLOR["top creator"],
            "--seal": RATING_COLOR["top creator"],
          } as CSSProperties
        }
      />
    </Tooltip>
  );
}

// toolkit-gap: Badge has no on-media tone; on a photo Pool's rating badge is frosted black with
// the tier's dot, which no variant gives (`color` sets a pastel tint and a dark tone text).
export function MediaRatingBadge({ rating }: { rating: OverallRating }) {
  return (
    <Badge variant="secondary" className="bg-black/40 text-white backdrop-blur-sm">
      <span
        aria-hidden
        className="size-1.5 shrink-0 rounded-full bg-white/60"
        style={{ backgroundColor: RATING_COLOR[rating] }}
      />
      {capitalize(rating)}
    </Badge>
  );
}

type CreatorProfile = typeof CREATOR_PROFILE;

// signature-surface: Pool's hero photo, the name and rating laid on it over a scrim.
function CreatorHeroPhoto({ creator }: { creator: CreatorProfile }) {
  return (
    <MediaFrame
      src={photoUrl(creator.photoSeed, 640)}
      alt={creator.fullName}
      radius="xl"
      scrim="bottom"
      priority
    >
      <MediaFrameOverlay
        placement="top"
        className="justify-end opacity-0 transition-opacity duration-(--duration-fast) ease-out-expo group-hover/media-frame:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100"
      >
        <IconButton label="Download photo" variant="ghost" size="icon-sm">
          <Download />
        </IconButton>
      </MediaFrameOverlay>
      <MediaFrameOverlay>
        <MediaRatingBadge rating={creator.overallRating} />
        <Inline gap="sm" wrap={false}>
          <Tooltip content={creator.fullName}>
            <h3 className="truncate text-xl font-semibold">{creator.fullName}</h3>
          </Tooltip>
          {creator.overallRating === "top creator" ? <VerifiedMark /> : null}
        </Inline>
      </MediaFrameOverlay>
    </MediaFrame>
  );
}

/** Pool's creator profile column, shared by the profile page's sidebar and the preview sheet. */
export function CreatorProfileInfo({ creator }: { creator: CreatorProfile }) {
  return (
    <Stack gap="md">
      <CreatorHeroPhoto creator={creator} />
      <Button variant="outline" size="sm" disabled={!creator.email}>
        <Copy />
        Copy email
      </Button>
      <Separator />
      <DescriptionList layout="stacked">
        <DescriptionItem label="Country">{creator.country}</DescriptionItem>
        <DescriptionItem label="Languages">{creator.languages.join(", ")}</DescriptionItem>
        <DescriptionItem label="Age">
          <Tooltip content={creator.dateOfBirth}>
            <span>{creator.age} years old</span>
          </Tooltip>
        </DescriptionItem>
        <DescriptionItem label="Gender">{creator.genderIdentity}</DescriptionItem>
        <DescriptionItem label="Ethnicity">{creator.ethnicity.join(", ")}</DescriptionItem>
      </DescriptionList>
      <Separator />
      <Stack gap="md">
        <TagGroup label="UGC Categories" tags={creator.ugcCategories} />
        <TagGroup label="Content Formats" tags={creator.contentFormats} />
        <TagGroup label="Brand Interests" tags={creator.brandInterests} />
        <TagGroup label="Brand Types" tags={creator.brandTypes} />
        <TagGroup label="Worked on" tags={creator.workedOn} />
      </Stack>
      <Separator />
      <Inline gap="sm">
        <PlatformLinks channels={creator.socialChannels} size="icon-lg" />
        <IconButton asChild label="Portfolio" variant="outline" size="icon-lg">
          <a href={creator.portfolioUrl}>
            <ExternalLink />
          </a>
        </IconButton>
      </Inline>
      <Separator />
      <DescriptionList layout="stacked">
        <DescriptionItem label="Rate">
          <Stack gap="none">
            <span>
              {formatMoney(creator.rateRange.min)}–{creator.rateRange.max}
            </span>
            {creator.rateEstimated ? (
              <span className="text-xs text-muted-foreground">
                Estimated from past collaborations
              </span>
            ) : null}
          </Stack>
        </DescriptionItem>
        <DescriptionItem label="Internal">
          <Tooltip content="Estimated per piece from past collaborations">
            <span>
              {formatMoney(creator.internalRange.min)}–{formatMoney(creator.internalRange.max)}
            </span>
          </Tooltip>
        </DescriptionItem>
      </DescriptionList>
    </Stack>
  );
}

// signature-surface: Pool's summary tiles for a closed collaboration's figures, on the toolkit's panel.
function SummaryTile({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col justify-center gap-2 px-5 py-3", panelClassName, className)}>
      {children}
    </div>
  );
}

function CollaborationSummary({ collab }: { collab: ClosedCollaboration }) {
  const perPiece =
    collab.totalPaid && collab.piecesOfContent ? collab.totalPaid / collab.piecesOfContent : null;
  return (
    <Stack gap="xs">
      <div className="flex flex-wrap gap-1">
        {collab.totalPaid ? (
          <SummaryTile className="min-w-36 flex-2">
            <LabeledField
              label="Total paid"
              value={<span className="text-stat">{formatMoney(collab.totalPaid)}</span>}
            />
            {perPiece ? (
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatMoney(perPiece)} / piece
              </span>
            ) : null}
          </SummaryTile>
        ) : null}
        {collab.piecesOfContent ? (
          <SummaryTile className="min-w-24 flex-1">
            <LabeledField
              label="Pieces of content"
              value={<span className="text-stat">{collab.piecesOfContent}</span>}
            />
          </SummaryTile>
        ) : null}
        <SummaryTile className="min-w-44 flex-2">
          <LabeledField
            label="Logged by"
            value={
              collab.closedBy ? (
                <PersonIdentity
                  size="md"
                  name={collab.closedBy.name}
                  imageUrl={collab.closedBy.imageUrl}
                  description={collab.closedAt}
                />
              ) : (
                <span className="font-normal text-muted-foreground">{collab.closedAt}</span>
              )
            }
          />
        </SummaryTile>
        {collab.reviewNotes ? (
          <SummaryTile className="min-w-52 flex-3 justify-between">
            <span className="text-xs font-medium text-muted-foreground">Review notes</span>
            <span className="text-xs">{collab.reviewNotes}</span>
            {collab.reviewNotesBy ? (
              <PersonIdentity
                name={collab.reviewNotesBy.name}
                imageUrl={collab.reviewNotesBy.imageUrl}
              />
            ) : null}
          </SummaryTile>
        ) : null}
      </div>
      {collab.ratings ? (
        <Grid cols={3} gap="xs">
          <SummaryTile>
            <LabeledField label="Visual" value={<RatingBadge rating={collab.ratings.visual} />} />
          </SummaryTile>
          <SummaryTile>
            <LabeledField label="Acting" value={<RatingBadge rating={collab.ratings.acting} />} />
          </SummaryTile>
          <SummaryTile>
            <LabeledField
              label="Reliability"
              value={<RatingBadge rating={collab.ratings.reliability} />}
            />
          </SummaryTile>
        </Grid>
      ) : null}
    </Stack>
  );
}

const countOf = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

function PortfolioSection({ creator }: { creator: CreatorProfile }) {
  return (
    <PageSection title="Portfolio" meta={countOf(creator.portfolio.length, "file", "files")}>
      <div className="flex gap-1 overflow-x-auto">
        {creator.portfolio.map((asset) => (
          <MediaFrame
            key={asset.id}
            src={photoUrl(asset.seed, 360)}
            alt={asset.filename}
            aspect="9/16"
            scrim="top"
            className="w-52"
          >
            <MediaFrameOverlay placement="top" className="items-center p-1 pl-3">
              <span className="truncate text-xs">{asset.filename}</span>
              <IconButton label="Download" variant="ghost" size="icon-sm">
                <Download />
              </IconButton>
            </MediaFrameOverlay>
          </MediaFrame>
        ))}
      </div>
    </PageSection>
  );
}

function CollaborationsSection({ collaborations }: { collaborations: ClosedCollaboration[] }) {
  return (
    <PageSection
      title="Collaborations"
      meta={countOf(collaborations.length, "collaboration", "collaborations")}
      className="flex-1"
    >
      {collaborations.length > 0 ? (
        <Stack gap="sm">
          {collaborations.map((collab, index) => (
            <CollapsibleSection key={collab.id} defaultOpen={index === 0} chevron="start">
              <CollapsibleHeader>
                {storyLink(
                  "/clients",
                  <span className="underline-offset-4 hover:underline">{collab.projectName}</span>,
                )}
              </CollapsibleHeader>
              <CollapsibleBody>
                <CollaborationSummary collab={collab} />
              </CollapsibleBody>
            </CollapsibleSection>
          ))}
        </Stack>
      ) : (
        <EmptyState
          icon={FolderIcon}
          title="No collaborations"
          description="Collaborations appear here once they are closed on a campaign."
        />
      )}
    </PageSection>
  );
}

/** Pool's creator profile under the shell header, as the app lays it out: the info column ruled off
 * on the left (`DetailLayout variant="ruled" asidePosition="start"`), then the portfolio and the
 * closed collaborations. The column slides over the content on a phone, opened from the header's
 * "Show info". */
export function CreatorProfileView({
  creator = CREATOR_PROFILE,
  collaborations = CREATOR_PROFILE.closedCollaborations,
  blacklisted = false,
  infoOpen = false,
}: {
  creator?: CreatorProfile;
  collaborations?: ClosedCollaboration[];
  blacklisted?: boolean;
  infoOpen?: boolean;
}) {
  const profile = blacklisted ? { ...creator, overallRating: "blacklisted" as const } : creator;
  return (
    <DetailLayout
      variant="ruled"
      asidePosition="start"
      asideOpen={infoOpen}
      aside={
        <aside aria-label="Creator info">
          <CreatorProfileInfo creator={profile} />
        </aside>
      }
    >
      <Page size="full" className="flex-1">
        {blacklisted ? (
          <Alert variant="destructive">
            <AlertTitle>Blacklisted</AlertTitle>
            <AlertDescription>
              <p>{creator.blacklistReason}</p>
              <PersonIdentity name={STAFF.priya.name} imageUrl={STAFF.priya.imageUrl} />
            </AlertDescription>
          </Alert>
        ) : null}
        {creator.portfolio.length > 0 ? <PortfolioSection creator={creator} /> : null}
        <CollaborationsSection collaborations={collaborations} />
      </Page>
    </DetailLayout>
  );
}

/** A link shown as its own address, truncated, the full URL on hover; a dash when there is none. */
export function LinkText({ url }: { url: string | null }) {
  if (!url) return <TablePlaceholder />;
  return (
    <Tooltip content={url}>
      <TextLink href={url} className="block max-w-40 truncate">
        {url.replace(/^https?:\/\/(www\.)?/i, "")}
      </TextLink>
    </Tooltip>
  );
}

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

export const campaignHref = (clientId: string, project: ClientProject) =>
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

export const campaignCount = (count: number) =>
  `${count} ${count === 1 ? "campaign" : "campaigns"}`;
