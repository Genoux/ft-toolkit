import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardSection,
  CardTitle,
} from "../../src/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../src/components/dropdown-menu";
import { IconButton } from "../../src/components/icon-button";
import { LabeledField } from "../../src/components/labeled-field";
import { Grid } from "../../src/components/layout";
import { MemberAvatarStack } from "../../src/components/member-avatar-stack";
import { StatusDot } from "../../src/components/status-dot";
import { SIMULATED_STATE_CLASS } from "../lib/control-states";
import { PEOPLE } from "../lib/fixtures";
import { AnnotationCaption, getAnnotatedState, StateMarker } from "../lib/state-annotation";

const meta = {
  title: "Molecules/Card",
  component: Card,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const CAMPAIGNS = [
  { name: "Spring UGC push", client: "Oatly", status: "Live", tone: "success", creators: 5 },
  { name: "Back to school", client: "Glossier", status: "In review", tone: "warning", creators: 3 },
  { name: "Holiday gifting", client: "Allbirds", status: "Draft", tone: "neutral", creators: 2 },
] as const;

/** Plain, composed with header and footer, as a link, and split into ruled sections: the ways a card is used. */
export const AllStates: Story = {
  render: () => (
    <Grid min="md" className="w-4xl">
      <Card>
        <div className="text-sm font-medium">Plain card</div>
        <p className="text-sm text-muted-foreground">
          Padding, gap and a faint border built in; no shadow.
        </p>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly budget</CardTitle>
          <CardDescription>Updated 2 hours ago</CardDescription>
          <CardAction>
            <IconButton label="More actions" variant="ghost" size="icon-sm">
              <MoreHorizontal />
            </IconButton>
          </CardAction>
        </CardHeader>
        <div className="grid grid-cols-2 gap-4">
          <LabeledField label="Spent" value="$12,400" />
          <LabeledField label="Remaining" value="$7,600" />
        </div>
        <CardFooter>
          <Button variant="secondary" size="sm">
            View report
          </Button>
        </CardFooter>
      </Card>
      <Card asChild>
        <a href="#campaign">
          <CardHeader>
            <CardTitle>Spring UGC push</CardTitle>
            <CardDescription>Oatly · 5 creators</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4 text-subtle-foreground" />
            </CardAction>
          </CardHeader>
          <StatusDot tone="success" label="Live" />
        </a>
      </Card>
      <Card>
        <CardSection>
          <CardTitle>Ruled sections</CardTitle>
          <p className="text-sm text-muted-foreground">
            Spacing separates sections; `divided` adds a rule only where two sections would read as
            one.
          </p>
        </CardSection>
        <CardSection divided>
          <LabeledField label="Spent" value="$12,400" />
        </CardSection>
      </Card>
    </Grid>
  ),
};

const CHECKS = [
  { label: "Time at company", tone: "success", detail: "4 yrs 1 mo" },
  { label: "Last raise", tone: "success", detail: "Jul 2025" },
  { label: "Rating", tone: "info", detail: "Needs verification" },
] as const;

/** One decision panel split by full-width rules: the note that changes what happens next, the checks, the budget, then the actions. A header first, then `CardSection`s. */
export const RuledSections: Story = {
  render: () => (
    <Card className="w-sm" aria-label="Decision" asChild>
      <aside>
        <CardHeader>
          <CardTitle>Priya Shah's note</CardTitle>
          <CardDescription>People review · Apr 12</CardDescription>
        </CardHeader>
        <p className="text-sm text-pretty">
          Above guidance, but the level change carries it. Approve as an exception.
        </p>
        <CardSection>
          <CardHeader>
            <CardTitle>Policy</CardTitle>
            <CardAction className="text-xs text-muted-foreground">2 of 3 met</CardAction>
          </CardHeader>
          {CHECKS.map((check) => (
            <div key={check.label} className="flex items-center justify-between gap-4">
              <StatusDot tone={check.tone} label={check.label} />
              <span className="text-sm text-muted-foreground tabular-nums">{check.detail}</span>
            </div>
          ))}
        </CardSection>
        <CardSection>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4">
            <LabeledField label="This request" value="+$7,700" />
            <LabeledField label="Left in Design" value="$41,300" />
          </div>
        </CardSection>
        <CardSection>
          <Button>Approve</Button>
          <Button variant="secondary">Request changes</Button>
        </CardSection>
      </aside>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card className="w-md">
      <CardHeader>
        <CardTitle>Payout details</CardTitle>
        <CardDescription>Where we send creator payments each month.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Verified</Badge>
        </CardAction>
      </CardHeader>
      <div className="grid grid-cols-2 gap-4">
        <LabeledField label="Bank" value="RBC Royal Bank" />
        <LabeledField label="Account" value="•••• 4821" />
      </div>
      <CardFooter>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save changes</Button>
      </CardFooter>
    </Card>
  ),
};

const LINK_STATES = ["default", "hover", "focus-visible"] as const;

const SIMULATED_LINK_STATE: Record<(typeof LINK_STATES)[number], string | undefined> = {
  default: undefined,
  hover: "border-input shadow-subtle",
  "focus-visible": SIMULATED_STATE_CLASS.focus,
};

function CampaignMenu({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label={`Actions for ${name}`} variant="ghost" size="icon-sm">
          <MoreHorizontal />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** A linked card at rest, hovered (raised: stronger edge and a soft shadow) and focused, on the canvas and on a muted surface. */
export const LinkStates: Story = {
  render: () => (
    <div className="flex w-4xl flex-col gap-4">
      {(["canvas", "muted surface"] as const).map((surface) => (
        <div key={surface} className="flex flex-col gap-2">
          <AnnotationCaption>{surface}: rest · hover · focus-visible</AnnotationCaption>
          <div className={surface === "muted surface" ? "rounded-xl bg-muted/60 p-2" : undefined}>
            <Grid cols={3}>
              {LINK_STATES.map((state) => (
                <StateMarker key={state} state={getAnnotatedState(state)} className="w-full">
                  <Card asChild className={SIMULATED_LINK_STATE[state]}>
                    <a href={`#${state}`}>
                      <CardHeader>
                        <CardTitle>Spring UGC push</CardTitle>
                        <CardDescription>12 creators · ends Apr 30</CardDescription>
                      </CardHeader>
                      <StatusDot tone="success" label="Live" />
                    </a>
                  </Card>
                </StateMarker>
              ))}
            </Grid>
          </div>
        </div>
      ))}
    </div>
  ),
};

/** `CardLink` makes the whole card open the record while the menu in CardAction stays its own target. */
export const LinkWithMenu: Story = {
  render: () => (
    <Grid min="md" className="w-4xl">
      {CAMPAIGNS.map((campaign) => (
        <Card key={campaign.name}>
          <CardHeader>
            <CardTitle>
              <CardLink href={`#${campaign.name}`}>{campaign.name}</CardLink>
            </CardTitle>
            <CardDescription>{campaign.client}</CardDescription>
            <CardAction>
              <CampaignMenu name={campaign.name} />
            </CardAction>
          </CardHeader>
          <div className="flex items-center justify-between gap-3">
            <StatusDot tone={campaign.tone} label={campaign.status} />
            <MemberAvatarStack members={PEOPLE.slice(0, campaign.creators)} />
          </div>
        </Card>
      ))}
    </Grid>
  ),
};

/** `asChild` with a link: the whole card is the target; hover raises it and focus shows the shared ring. */
export const LinkGrid: Story = {
  render: () => (
    <Grid min="md" className="w-4xl">
      {CAMPAIGNS.map((campaign) => (
        <Card key={campaign.name} asChild>
          <a href={`#${campaign.name}`}>
            <CardHeader>
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>{campaign.client}</CardDescription>
              <CardAction>
                <ArrowUpRight className="size-4 text-subtle-foreground" />
              </CardAction>
            </CardHeader>
            <div className="flex items-center justify-between gap-3">
              <StatusDot tone={campaign.tone} label={campaign.status} />
              <MemberAvatarStack members={PEOPLE.slice(0, campaign.creators)} />
            </div>
          </a>
        </Card>
      ))}
    </Grid>
  ),
};
