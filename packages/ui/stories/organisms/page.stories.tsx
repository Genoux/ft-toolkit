import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { AppShellTitle } from "../../src/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "../../src/components/avatar";
import { Button } from "../../src/components/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../../src/components/card";
import { EmptyState } from "../../src/components/empty-state";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../../src/components/field";
import { Input } from "../../src/components/input";
import { Grid, Inline } from "../../src/components/layout";
import {
  Page,
  PageBackLink,
  PageHeader,
  PagePager,
  PageSection,
  PageToolbar,
} from "../../src/components/page";
import { SearchInput } from "../../src/components/search-input";
import { Separator } from "../../src/components/separator";
import { Stat, StatLabel, StatMeta, StatValue } from "../../src/components/stat";
import { Textarea } from "../../src/components/textarea";
import {
  COLLABORATION_TOTAL,
  COLLABORATIONS,
  CollaborationsTable,
  CollaborationsToolbar,
  collaborationRows,
} from "../lib/app-fixtures";
import { CREATOR_PROFILE, CREATOR_TOTAL, photoUrl } from "../screens/pool/fixtures";
import { CreatorProfileView, RatingBadge } from "../screens/pool/pool-blocks";

// The page patterns of the ib-ui skill, one story each. Apps copy the composition, not the data.

const meta = {
  title: "Organisms/Page",
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "desktop", isRotated: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const creator = CREATOR_PROFILE;
const DESCRIPTION = `${creator.country} · ${creator.languages.join(", ")}`;
const BACK = <PageBackLink href="#database">Database</PageBackLink>;
const META = (
  <>
    <RatingBadge rating={creator.overallRating} />
    <span className="text-xs text-subtle-foreground">
      {creator.closedCollaborations.length} collaborations
    </span>
  </>
);
const MEDIA = (
  <Avatar size="xl">
    <AvatarImage src={photoUrl(creator.photoSeed, 160)} alt="" />
    <AvatarFallback>JR</AvatarFallback>
  </Avatar>
);

function Pager({ start = 2 }: { start?: number }) {
  const [position, setPosition] = useState(start);
  return (
    <PagePager
      aria-label="Database"
      position={position}
      total={CREATOR_TOTAL}
      previousLabel="Previous creator"
      nextLabel="Next creator"
      onPrevious={() => setPosition((current) => current - 1)}
      onNext={() => setPosition((current) => current + 1)}
    />
  );
}

const ACTIONS = (
  <Button variant="outline" size="sm">
    <Plus />
    Add to campaign
  </Button>
);

/** Every PageHeader slot, one added per row (title, description, actions, back, meta, pager, media), then PageSection and PageToolbar. */
export const AllStates: Story = {
  render: () => (
    <Page>
      <PageHeader title={creator.fullName} />
      <Separator />
      <PageHeader title={creator.fullName} description={DESCRIPTION} />
      <Separator />
      <PageHeader title={creator.fullName} description={DESCRIPTION} actions={ACTIONS} />
      <Separator />
      <PageHeader
        back={BACK}
        title={creator.fullName}
        description={DESCRIPTION}
        actions={ACTIONS}
      />
      <Separator />
      <PageHeader
        back={BACK}
        title={creator.fullName}
        description={DESCRIPTION}
        meta={META}
        actions={ACTIONS}
      />
      <Separator />
      <PageHeader
        back={BACK}
        pager={<Pager />}
        title={creator.fullName}
        description={DESCRIPTION}
        actions={ACTIONS}
      />
      <Separator />
      <PageHeader
        back={BACK}
        pager={<Pager start={1} />}
        media={MEDIA}
        title={creator.fullName}
        description={DESCRIPTION}
        actions={ACTIONS}
      />
      <Separator />
      <PageSection title="Collaborations" />
      <PageSection title="Collaborations" description="Closed on a campaign." />
      <PageSection
        title="Collaborations"
        description="Closed on a campaign."
        actions={
          <Button variant="outline" size="sm">
            <Plus />
            Add
          </Button>
        }
      >
        <PageToolbar>
          <SearchInput
            value=""
            onChange={() => undefined}
            placeholder="Search collaborations"
            className="w-full sm:max-w-64"
          />
          <Button variant="outline" className="ml-auto">
            <Download />
            Export
          </Button>
        </PageToolbar>
      </PageSection>
    </Page>
  ),
};

/** A long list: the toolbar sticks to the top of the scrolling area so search and filters stay in reach. */
export const ListPage: Story = {
  render: () => (
    <div className="h-svh overflow-y-auto">
      <Page>
        <PageHeader
          title="Collaborations"
          description={`${COLLABORATION_TOTAL} closed collaborations`}
        />
        <CollaborationsToolbar sticky />
        <CollaborationsTable rows={collaborationRows(3)} />
      </Page>
    </div>
  ),
};

/** A list with nothing in it yet: the page grows to the shell's height and the empty state fills the
 * room under the header, frameless on the page background, the message centred in it.
 * Shown in a full-height frame standing in for the shell content. */
export const EmptyListPage: Story = {
  render: () => (
    <div className="flex h-svh flex-col">
      <Page>
        <PageHeader title="Clients" />
        <EmptyState
          title="No clients yet"
          description="Create a client to start adding campaigns."
          action={{
            label: "Create client",
            icon: Plus,
            variant: "default",
            onClick: () => undefined,
          }}
        />
      </Page>
    </div>
  ),
};

/** Pool's creator profile as the app lays it out under the shell header (Breadcrumb and the "…" menu,
 * see Screens/Pool/Creator profile): `DetailLayout variant="ruled" asidePosition="start"`, a 320px
 * info column ruled off on the left with the photo, the name and rating, then the details as
 * `DescriptionList layout="stacked"`, a grid of short facts rather than one per line. Beside it a
 * `Page size="full"` holds a `PageSection` per group, portfolio first, then the closed collaborations. */
export const DetailPage: Story = {
  render: () => (
    <div className="flex h-svh flex-col">
      <CreatorProfileView />
    </div>
  ),
};

export const FormPage: Story = {
  render: () => (
    <Page size="narrow">
      <PageHeader title="Workspace" description="How your workspace appears to clients." />
      <PageSection title="Profile" description="Shown on every shared link.">
        <Card>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
              <Input id="workspace-name" defaultValue="inBeat" />
            </Field>
            <Field>
              <FieldLabel htmlFor="workspace-about">About</FieldLabel>
              <Textarea
                id="workspace-about"
                defaultValue="Micro-influencer marketing for consumer brands."
              />
              <FieldDescription>One or two sentences.</FieldDescription>
            </Field>
          </FieldGroup>
          <Separator />
          <Inline justify="end">
            <Button size="sm">Save</Button>
          </Inline>
        </Card>
      </PageSection>
    </Page>
  ),
};

const OVERVIEW_STATS = [
  ["Applications", "128", "32 this week"],
  ["Spent", "$12,400", "of $20,000 budget"],
] as const;

/** A bento row on `Grid cols={4}`: each figure a Card with a Stat; the hero figure's Card spans two columns from md. */
export const OverviewPage: Story = {
  render: () => (
    <Page>
      <PageHeader title="Overview" description="November across 14 campaigns · synced 2 min ago" />
      <Grid cols={4}>
        <Card className="md:col-span-2">
          <Stat>
            <StatLabel>Content delivered</StatLabel>
            <StatValue size="lg">1,284</StatValue>
            <StatMeta>+18% on October</StatMeta>
          </Stat>
        </Card>
        {OVERVIEW_STATS.map(([label, value, meta]) => (
          <Card key={label}>
            <Stat>
              <StatLabel>{label}</StatLabel>
              <StatValue>{value}</StatValue>
              <StatMeta>{meta}</StatMeta>
            </Stat>
          </Card>
        ))}
      </Grid>
      <PageSection title="Recent collaborations" description="Closed in the last 30 days.">
        <CollaborationsTable rows={COLLABORATIONS.slice(0, 4)} />
      </PageSection>
    </Page>
  ),
};

/** `size="centered"`: sign-in, waiting, 404 and maintenance. A narrow full-height column in the middle of the screen, with quiet links pinned to the bottom by `footer`. */
export const CenteredPage: Story = {
  render: () => (
    <Page
      asChild
      size="centered"
      footer={
        <span className="text-xs text-subtle-foreground">© 2026 Fieldtrip · Help · Privacy</span>
      }
    >
      <main>
        <AppShellTitle>Proof</AppShellTitle>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Use your inbeat.agency account.</CardDescription>
          </CardHeader>
          <Button variant="outline">Continue with Google</Button>
        </Card>
      </main>
    </Page>
  ),
};

/** Without a footer the content sits in the exact middle. */
export const CenteredWithoutFooter: Story = {
  render: () => (
    <Page asChild size="centered">
      <main>
        <EmptyState
          size="page"
          title="Page not found"
          description="The link may be out of date or mistyped."
          action={{ label: "Go to Impact & Recognition", href: "#home", variant: "default" }}
        />
      </main>
    </Page>
  ),
};

const FILL_COLUMNS = [
  { title: "To-do", items: ["Glossier", "Oura", "Nutramax", "Liquid Death", "Athletic Brewing"] },
  { title: "In progress", items: ["Nutramax", "Athletic Brewing"] },
  { title: "Done", items: ["Oura", "Glossier", "Liquid Death"] },
];

/** `fill`: the last child takes the height left in the shell and scrolls inside itself, so a board's columns run to the bottom edge. Shown in a full-height frame standing in for the shell content. */
export const FillPage: Story = {
  render: () => (
    <div className="flex h-svh flex-col">
      <Page size="full" fill>
        <PageHeader title="Discovery" description="Sourcing requests, from backlog to done." />
        <div className="flex min-h-0 gap-3 overflow-x-auto">
          {FILL_COLUMNS.map((column) => (
            <section
              key={column.title}
              aria-label={column.title}
              className="flex min-h-0 min-w-64 flex-1 flex-col gap-1 rounded-2xl bg-muted/60 p-1"
            >
              <h2 className="px-3 pt-3 pb-1.5 text-sm font-medium">{column.title}</h2>
              <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
                {column.items.map((client) => (
                  <li key={client}>
                    <Card className="rounded-lg">
                      <CardHeader>
                        <CardTitle>{client}</CardTitle>
                        <CardDescription>Due Dec 4, 2026</CardDescription>
                      </CardHeader>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Page>
    </div>
  ),
};
