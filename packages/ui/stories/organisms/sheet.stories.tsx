import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, CircleCheck } from "lucide-react";
import type { ComponentProps } from "react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import { DescriptionItem, DescriptionList } from "../../src/components/description-list";
import { Item, ItemContent, ItemGroup, ItemTitle } from "../../src/components/item";
import { Inline, Stack } from "../../src/components/layout";
import { PersonAvatar, PersonIdentity } from "../../src/components/person-identity";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetSection,
  SheetTitle,
  SheetTrigger,
} from "../../src/components/sheet";
import { HolderStatus } from "../lib/impact-and-recognition-display";
import { CreatorInfo } from "../lib/patterns";
import { RatingBadge } from "../lib/pool-display";
import { CREATOR_PROFILE, formatMoney } from "../lib/pool-fixtures";

type SheetSide = NonNullable<ComponentProps<typeof SheetContent>["side"]>;

/** Pool, features/collaborations/components/creator-collaboration.tsx: the details sheet of an
 * active collaboration, its rows from collaboration-panel.tsx. */
function CollaborationDetailsSheet({
  side = "right",
  defaultOpen = false,
}: {
  side?: SheetSide;
  defaultOpen?: boolean;
}) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">{defaultOpen ? "Collaboration details" : `Open ${side}`}</Button>
      </SheetTrigger>
      <SheetContent side={side} size="md" showCloseButton>
        <SheetHeader>
          <SheetTitle>Collaboration details</SheetTitle>
          <SheetDescription className="sr-only">
            Status, schedule and results for this collaboration
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <SheetSection
            title="Status"
            aside={<Badge variant="warning">Content for review</Badge>}
          />
          <SheetSection title="Schedule">
            <DescriptionList align="end" frame divided>
              <DescriptionItem label="Guide">Hero product</DescriptionItem>
              <DescriptionItem label="Start">Nov 2, 2026</DescriptionItem>
              <DescriptionItem label="Content due">
                <span className="font-medium">Nov 16, 2026</span>
              </DescriptionItem>
              <DescriptionItem label="Revisions due">
                <span className="font-medium">Nov 23, 2026</span>
              </DescriptionItem>
            </DescriptionList>
          </SheetSection>
          <SheetSection title="Delivery">
            <DescriptionList align="end" frame divided>
              <DescriptionItem label="Guide opened">2w ago</DescriptionItem>
              <DescriptionItem label="Submissions">2</DescriptionItem>
              <DescriptionItem label="Last delivery">Nov 14, 2026</DescriptionItem>
            </DescriptionList>
          </SheetSection>
        </SheetBody>
        <SheetFooter>
          <Button className="w-full">Close collaboration</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const closed = CREATOR_PROFILE.closedCollaborations[0];

/** Pool, collaboration-panel.tsx closedRows: the same sheet once the collaboration is closed, what
 * was paid and how the creator rated, then the review notes and Edit collaboration. */
function ClosedCollaborationSheet() {
  const { totalPaid, piecesOfContent, ratings, closedAt, closedBy, reviewNotes, reviewNotesBy } =
    closed;
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Collaboration details</Button>
      </SheetTrigger>
      <SheetContent side="right" size="md" showCloseButton>
        <SheetHeader>
          <SheetTitle>Collaboration details</SheetTitle>
          <SheetDescription className="sr-only">
            Status, payment and ratings for this collaboration
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <SheetSection
            title="Status"
            aside={
              <Badge variant="secondary" dot>
                Closed
              </Badge>
            }
          />
          <SheetSection title="Summary">
            <DescriptionList align="end" frame divided>
              <DescriptionItem label="Total paid">
                {totalPaid ? (
                  <>
                    {formatMoney(totalPaid)}
                    {piecesOfContent ? (
                      <span className="text-muted-foreground">
                        {` · ${formatMoney(Math.round(totalPaid / piecesOfContent))}/piece`}
                      </span>
                    ) : null}
                  </>
                ) : null}
              </DescriptionItem>
              <DescriptionItem label="Pieces of content">{piecesOfContent}</DescriptionItem>
              <DescriptionItem label="Visual">
                {ratings ? <RatingBadge rating={ratings.visual} /> : null}
              </DescriptionItem>
              <DescriptionItem label="Acting">
                {ratings ? <RatingBadge rating={ratings.acting} /> : null}
              </DescriptionItem>
              <DescriptionItem label="Reliability">
                {ratings ? <RatingBadge rating={ratings.reliability} /> : null}
              </DescriptionItem>
              <DescriptionItem label="Closed">{closedAt}</DescriptionItem>
              <DescriptionItem label="Logged by">
                {closedBy ? (
                  <PersonIdentity name={closedBy.name} imageUrl={closedBy.imageUrl} />
                ) : null}
              </DescriptionItem>
            </DescriptionList>
          </SheetSection>
          {reviewNotes ? (
            <SheetSection title="Review notes">
              <p className="text-sm text-pretty">{reviewNotes}</p>
              {reviewNotesBy ? (
                <PersonIdentity name={reviewNotesBy.name} imageUrl={reviewNotesBy.imageUrl} />
              ) : null}
            </SheetSection>
          ) : null}
        </SheetBody>
        <SheetFooter>
          <Button className="w-full">Edit collaboration</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/** Pool, features/collaborations/components/creator-preview-sheet.tsx. */
function CreatorPreviewSheet() {
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">{CREATOR_PROFILE.fullName}</Button>
      </SheetTrigger>
      <SheetContent side="right" size="lg" showCloseButton>
        <SheetHeader>
          <SheetTitle>{CREATOR_PROFILE.fullName}</SheetTitle>
          <SheetDescription className="sr-only">Creator profile preview</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <CreatorInfo creator={CREATOR_PROFILE} />
        </SheetBody>
        <SheetFooter>
          <Button className="w-full">View full profile</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/** I&R, features/requests/components/eligible-people.tsx: a person on the Eligibility list. The
 * verdict leads, then the three facts it rests on, who they report to, and this round's requests. */
function EligibilitySheet() {
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Aisha Grant</Button>
      </SheetTrigger>
      <SheetContent side="right" size="md" showCloseButton>
        <SheetHeader>
          <Inline gap="md" wrap={false}>
            <PersonAvatar name="Aisha Grant" size="xl" decorative />
            <Stack gap="xs">
              {/* The person's name is the sheet's Diplomat statement, as on I&R's request page. */}
              <SheetTitle className="font-serif text-2xl font-normal">Aisha Grant</SheetTitle>
              <SheetDescription>Senior Designer, IC3, Creative</SheetDescription>
            </Stack>
          </Inline>
        </SheetHeader>
        <SheetBody>
          <SheetSection title="Eligibility" aside="At Apr 12, 2027">
            <Inline gap="sm" wrap={false}>
              <CircleCheck aria-hidden className="size-5 text-success" />
              <p className="text-xl font-semibold">Eligible</p>
            </Inline>
            <DescriptionList layout="tiles">
              <DescriptionItem label="In the team">5 yrs 10 mo</DescriptionItem>
              <DescriptionItem label="Last award">1 yr 9 mo ago</DescriptionItem>
              <DescriptionItem label="Contract">Employee</DescriptionItem>
            </DescriptionList>
          </SheetSection>
          <SheetSection title="Reporting">
            <DescriptionList>
              <DescriptionItem label="Manager">
                <PersonIdentity name="Maya Bennett" size="md" />
              </DescriptionItem>
              <DescriptionItem label="Head">
                <PersonIdentity name="Jordan Reed" size="md" />
              </DescriptionItem>
            </DescriptionList>
          </SheetSection>
          <SheetSection title="Requests" aside="This round">
            <ItemGroup>
              <Item asChild>
                <a href="#request">
                  <ItemContent>
                    <ItemTitle>Pay increase</ItemTitle>
                  </ItemContent>
                  <HolderStatus status="finance_review" />
                  <ArrowRight aria-hidden className="size-4 text-subtle-foreground" />
                </a>
              </Item>
            </ItemGroup>
          </SheetSection>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: "Organisms/Sheet",
  component: SheetContent,
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pool's Collaboration details as titled SheetSections: the status as its section's heading row, then Schedule and Delivery, each one framed `divided` DescriptionList with its values at the right. A scrolling SheetBody and a footer that sticks to the bottom; `showCloseButton` adds the close button and reserves room for it in the header.",
      },
    },
  },
  render: () => <CollaborationDetailsSheet defaultOpen />,
};

/** The sheet once the collaboration is closed: the status, Pool's closed summary as one framed `divided` list with values at the right, then the review notes as their own section, and Edit collaboration. */
export const ClosedCollaboration: Story = { render: () => <ClosedCollaborationSheet /> };

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      {(["right", "left", "bottom", "top"] as const).map((side) => (
        <CollaborationDetailsSheet key={side} side={side} />
      ))}
    </div>
  ),
};

/** A phone pattern: at desktop widths the rows would stretch the full screen. */
export const Bottom: Story = {
  render: () => <CollaborationDetailsSheet side="bottom" defaultOpen />,
  globals: { viewport: { value: "mobile2", isRotated: false } },
};

export const DetailDrawer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "I&R's person sheet from the Eligibility list: avatar, the name as a Diplomat statement and the role in the header, the close button centred on that row. Then Eligibility (the verdict, then its three facts as `tiles`), Reporting (label left, person right) and this round's request with its holder's status, each a SheetSection.",
      },
    },
  },
  render: () => <EligibilitySheet />,
};

export const MediaInBody: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pool\'s creator preview at `size="lg"`. SheetBody children keep their own height, so the photo frame scrolls with the body instead of collapsing.',
      },
    },
  },
  render: () => <CreatorPreviewSheet />,
};
