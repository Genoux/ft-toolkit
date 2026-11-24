import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import { Card } from "../../src/components/card";
import { DescriptionItem, DescriptionList } from "../../src/components/description-list";
import { Inline, Stack } from "../../src/components/layout";
import { MemberAvatarStack } from "../../src/components/member-avatar-stack";
import { PersonIdentity } from "../../src/components/person-identity";
import { Stat, StatLabel, StatMeta, StatValue } from "../../src/components/stat";
import { TextLink } from "../../src/components/text-link";
import { AnnotationCaption } from "../lib/state-annotation";
import {
  annualCost,
  FINANCE_APPROVED,
  formatDate,
  formatIncrease,
  formatMoney,
  ROUND,
} from "../screens/impact-and-recognition/fixtures";
import { CREATOR_PROFILE, DISCOVERY_REQUEST_DETAIL } from "../screens/pool/fixtures";
import { PriorityBadge } from "../screens/pool/pool-blocks";

// Pool's discovery request for Nutramax, as its details sheet lists it.
const request = DISCOVERY_REQUEST_DETAIL;
const creator = CREATOR_PROFILE;

function RequestFacts() {
  return (
    <>
      <DescriptionItem label="Priority">
        {request.priority ? <PriorityBadge priority={request.priority} /> : null}
      </DescriptionItem>
      <DescriptionItem label="Assignees">
        <MemberAvatarStack members={request.assignees} showNames />
      </DescriptionItem>
      <DescriptionItem label="Deadline">{request.deadline}</DescriptionItem>
      <DescriptionItem label="Platforms">{request.platforms.join(", ")}</DescriptionItem>
      <DescriptionItem label="Discovery brief">
        <TextLink tone="default" href={request.briefUrl}>
          docs.google.com/document
        </TextLink>
      </DescriptionItem>
      <DescriptionItem label="Completed">{request.completedAt}</DescriptionItem>
    </>
  );
}

function BudgetImpact() {
  return (
    <>
      <DescriptionItem label="Cost a year">+$4,080</DescriptionItem>
      <DescriptionItem label="Cost in 2027 if approved">+$2,057</DescriptionItem>
      <DescriptionItem label="Yearly budget">$120,000</DescriptionItem>
      <DescriptionItem label="Left now">$38,400</DescriptionItem>
      <DescriptionItem label="Left if approved" total>
        $34,320
      </DescriptionItem>
    </>
  );
}

function CreatorFacts() {
  return (
    <>
      <DescriptionItem label="Country">{creator.country}</DescriptionItem>
      <DescriptionItem label="Languages">{creator.languages.join(", ")}</DescriptionItem>
      <DescriptionItem label="Age">{creator.age} years old</DescriptionItem>
      <DescriptionItem label="Gender">{creator.genderIdentity}</DescriptionItem>
      <DescriptionItem label="Ethnicity">{creator.ethnicity.join(", ")}</DescriptionItem>
      <DescriptionItem label="Social channels">{creator.socialChannels.join(", ")}</DescriptionItem>
      <DescriptionItem label="UGC categories" wide>
        <Inline gap="xs">
          {creator.ugcCategories.map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
        </Inline>
      </DescriptionItem>
    </>
  );
}

const meta = {
  title: "Molecules/DescriptionList",
  component: DescriptionList,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The three layouts. `inline` is a properties list for a panel or a sheet: muted labels in one column, each value beside its label. `stacked` sets label over value in as many columns as fit, for a record's details. `tiles` sets a few short facts side by side. Rows are separated by spacing; `frame` sets a list on a near-white panel with a faint edge, and `divided` adds faint rules between a framed inline list's rows. A row without a value (Completed here) is left out. */
export const AllStates: Story = {
  render: () => (
    <div className="grid w-6xl grid-cols-[24rem_minmax(0,1fr)] items-start gap-x-12 gap-y-10">
      {([false, true] as const).map((frame) => (
        <div key={`inline-${frame}`} className="contents">
          <div className="flex flex-col gap-3">
            <AnnotationCaption>inline · {frame ? "frame" : "no frame"}</AnnotationCaption>
            <DescriptionList frame={frame}>
              <RequestFacts />
            </DescriptionList>
          </div>
          <div className="flex flex-col gap-3">
            <AnnotationCaption>stacked · {frame ? "frame" : "no frame"}</AnnotationCaption>
            <DescriptionList layout="stacked" frame={frame}>
              <CreatorFacts />
            </DescriptionList>
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-3">
        <AnnotationCaption>inline · frame · divided</AnnotationCaption>
        <DescriptionList frame divided>
          <RequestFacts />
        </DescriptionList>
      </div>
      <div className="flex flex-col gap-3">
        <AnnotationCaption>inline · frame · divided · align end</AnnotationCaption>
        <DescriptionList align="end" frame divided className="w-sm">
          <BudgetImpact />
        </DescriptionList>
      </div>
      <div className="col-span-full flex flex-col gap-3">
        <AnnotationCaption>tiles</AnnotationCaption>
        <DescriptionList layout="tiles">
          <DescriptionItem label="Total paid">$1,500</DescriptionItem>
          <DescriptionItem label="Per piece">$375</DescriptionItem>
          <DescriptionItem label="Pieces of content">4</DescriptionItem>
          <DescriptionItem label="Closed">November 12, 2026</DescriptionItem>
        </DescriptionList>
      </div>
    </div>
  ),
};

/** `inline`: a properties list, the label column as wide as its longest label, each value right beside it. Pool's discovery request summary, on a framed panel. */
export const Properties: Story = {
  render: () => (
    <DescriptionList frame className="w-sm">
      <RequestFacts />
    </DescriptionList>
  ),
};

/** `stacked`: label over value in as many columns as fit, so a record's details read as a compact grid instead of a long column. `wide` gives a row of tags the whole width. Pool's creator profile. */
export const Details: Story = {
  render: () => (
    <DescriptionList layout="stacked" className="w-3xl">
      <CreatorFacts />
    </DescriptionList>
  ),
};

/** Short facts inline, one long note stacked across the list under its label. */
export const MixedRows: Story = {
  render: () => (
    <DescriptionList frame className="w-sm">
      <DescriptionItem label="Tier">{request.tiers.join(", ")}</DescriptionItem>
      <DescriptionItem label="Contact details">{request.contactDetails.join(", ")}</DescriptionItem>
      <DescriptionItem label="Notes / Context" layout="stacked">
        {request.notes}
      </DescriptionItem>
    </DescriptionList>
  ),
};

/** `align="end"` lines amounts up on their last digit; `total` sets the result apart. I&R's budget impact of a request, in Finance's panel: plain, framed, and framed `divided` as the panel sets it. */
export const Amounts: Story = {
  render: () => (
    <Inline gap="xl" align="start">
      <DescriptionList align="end" className="w-xs">
        <BudgetImpact />
      </DescriptionList>
      <DescriptionList align="end" frame className="w-xs">
        <BudgetImpact />
      </DescriptionList>
      <DescriptionList align="end" frame divided className="w-xs">
        <BudgetImpact />
      </DescriptionList>
    </Inline>
  ),
};

/** `divided` with `frame`: faint rules between the rows of a contained panel, for label and value pairs whose values sit far from their labels. The rules stay inside the panel's padding. Never on a page list or between sections. Pool's discovery request in its details sheet. */
export const Divided: Story = {
  render: () => (
    <DescriptionList frame divided className="w-sm">
      <RequestFacts />
    </DescriptionList>
  ),
};

const approved = FINANCE_APPROVED[0];

/** A receipt: a status mark, the headline figure, the facts behind it as a framed `divided` list with values at the right, then the one action. I&R's approved increase for Lena Fischer, as People sees it before releasing it. */
export const Receipt: Story = {
  render: () => (
    <Card className="w-sm">
      <Stack gap="md" align="center" className="text-center">
        <span
          aria-hidden
          className="grid size-10 place-items-center rounded-full bg-success/12 text-success-foreground"
        >
          <Check className="size-5" />
        </span>
        <Stat className="items-center">
          <StatLabel>Pay increase approved</StatLabel>
          <StatValue>{formatIncrease(annualCost(approved))}</StatValue>
          <StatMeta>a year, from {formatDate(ROUND.effective)}</StatMeta>
        </Stat>
      </Stack>
      <DescriptionList align="end" frame divided>
        <DescriptionItem label="Person">
          <PersonIdentity name={approved.person.name} />
        </DescriptionItem>
        <DescriptionItem label="Current">{formatMoney(approved.current)}</DescriptionItem>
        <DescriptionItem label="Proposed">{formatMoney(approved.proposed)}</DescriptionItem>
        <DescriptionItem label="Requested by">{approved.requester}</DescriptionItem>
        <DescriptionItem label="Approved">{formatDate(approved.closedOn ?? "")}</DescriptionItem>
        <DescriptionItem label="Request">{approved.reference}</DescriptionItem>
      </DescriptionList>
      <Button size="lg" className="w-full">
        Release to share
      </Button>
    </Card>
  ),
};

/** `tiles`: a few short facts side by side, filling the row. Values stay on one line, so every tile in a row is the same height; a tile widens for a longer value and the row wraps when they no longer fit. Pool's figures for a closed collaboration, at a sheet's width and a page's. */
export const Tiles: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["w-md", "w-2xl"] as const).map((width) => (
        <DescriptionList key={width} layout="tiles" className={width}>
          <DescriptionItem label="Total paid">$1,500</DescriptionItem>
          <DescriptionItem label="Per piece">$375</DescriptionItem>
          <DescriptionItem label="Pieces of content">4</DescriptionItem>
          <DescriptionItem label="Closed">November 12, 2026</DescriptionItem>
        </DescriptionList>
      ))}
    </div>
  ),
};
