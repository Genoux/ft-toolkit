import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Badge } from "../../src/components/badge";
import { Card, CardHeader, CardTitle } from "../../src/components/card";
import { Grid, Inline, Stack } from "../../src/components/layout";
import { MemberAvatarStack } from "../../src/components/member-avatar-stack";
import { Meter } from "../../src/components/meter";
import { PersonIdentity } from "../../src/components/person-identity";
import { Skeleton } from "../../src/components/skeleton";
import { Stat, StatDelta, StatLabel, StatMeta, StatValue } from "../../src/components/stat";
import { StatusDot } from "../../src/components/status-dot";
import {
  AISHA_BUDGET,
  aisha,
  annualCost,
  formatDays,
  formatIncrease,
  formatMoney,
  HOLDER_COLOR,
  type Holder,
  MY_REQUESTS,
  REQUEST_HOLDER,
  ROUND,
} from "../lib/impact-and-recognition-fixtures";
import {
  CREATOR_PROFILE,
  DISCOVERY_REQUESTS,
  formatMoney as formatDollars,
} from "../lib/pool-fixtures";
import { VariantGrid } from "../lib/variant-grid";

// OUR figures: Pool's closed collaboration and the Nutramax discovery request; I&R's cycle, the
// requests by whose turn it is, and the Creative budget with Aisha Grant's increase.

const meta = {
  title: "Molecules/Stat",
  component: Stat,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES = ["sm", "default", "lg"] as const;
const TONES = ["default", "success", "warning", "destructive"] as const;

/** StatValue's sizes by tones, with no container: the parts set no padding or surface, the page picks the card. */
export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={SIZES}
      columns={TONES}
      renderCell={(size, tone) => (
        <Stat>
          <StatLabel>Change</StatLabel>
          <StatValue size={size} tone={tone}>
            +6%
          </StatValue>
          <StatMeta>Within 5–7% for Delivering Impact (3)</StatMeta>
        </Stat>
      )}
    />
  ),
};

const collaboration = CREATOR_PROFILE.closedCollaborations[0];

/** Pool's closed collaboration summary: three facts side by side in one Card, the person where a figure would be. */
export const PoolCollaborationSummary: Story = {
  render: () => {
    const { totalPaid, piecesOfContent, closedBy, closedAt } = collaboration;
    return (
      <Card className="w-3xl">
        <Grid cols={3}>
          <Stat>
            <StatLabel>Total paid</StatLabel>
            <StatValue>{formatDollars(totalPaid ?? 0)}</StatValue>
            <StatMeta>{formatDollars((totalPaid ?? 0) / (piecesOfContent ?? 1))} / piece</StatMeta>
          </Stat>
          <Stat>
            <StatLabel>Pieces of content</StatLabel>
            <StatValue>{piecesOfContent}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Logged by</StatLabel>
            {closedBy ? (
              <PersonIdentity
                size="md"
                name={closedBy.name}
                imageUrl={closedBy.imageUrl}
                description={closedAt}
              />
            ) : (
              <StatMeta>{closedAt}</StatMeta>
            )}
          </Stat>
        </Grid>
      </Card>
    );
  },
};

type StepState = "done" | "current" | "upcoming";

// round-card.tsx's four steps for the H1 2027 cycle, in the app's words.
const CYCLE_STEPS: { name: string; when: string; what: string; state: StepState }[] = [
  {
    name: "Requests",
    when: "Until Apr 30",
    what: "Managers submit requests",
    state: "current",
  },
  {
    name: "Calibration & approvals",
    when: "May 1 – Jun 12",
    what: "Requests can be edited until May 15",
    state: "upcoming",
  },
  {
    name: "Cycle conversations",
    when: "Jun 13 – Jun 30",
    what: "Managers share decisions",
    state: "upcoming",
  },
  { name: "Effective changes", when: "Jul 1", what: "New pay starts in Deel", state: "upcoming" },
];

const STEP_CARD: Record<StepState, string | undefined> = {
  done: undefined,
  current: "border-success/60 bg-success/6",
  upcoming: "border-dashed bg-muted/60",
};

const STEP_TAG: Partial<Record<StepState, ReactNode>> = {
  done: <Badge variant="secondary">Done</Badge>,
  current: (
    <Badge variant="success" solid>
      Now
    </Badge>
  ),
};

/** I&R's home cycle card: the countdown is a figure at the header's end, each step a small figure for its dates. */
export const IrCycleCard: Story = {
  render: () => (
    <Card className="w-6xl">
      <Inline justify="between" align="start">
        <Stack gap="sm">
          <CardTitle>{ROUND.name}</CardTitle>
          <StatusDot tone="success" pulse label="Open for requests" />
        </Stack>
        <Stat className="items-end text-right">
          <StatValue>{formatDays(12)}</StatValue>
          <StatMeta>until requests close</StatMeta>
        </Stat>
      </Inline>
      <Grid asChild cols={4} gap="sm">
        <ol aria-label="Cycle steps">
          {CYCLE_STEPS.map((step) => (
            <Card
              asChild
              key={step.name}
              aria-current={step.state === "current" ? "step" : undefined}
              className={STEP_CARD[step.state]}
            >
              <li>
                <Stat>
                  <Inline justify="between" gap="sm">
                    <StatLabel className="text-foreground">{step.name}</StatLabel>
                    {STEP_TAG[step.state]}
                  </Inline>
                  <StatValue size="sm">{step.when}</StatValue>
                  <StatMeta>{step.what}</StatMeta>
                </Stat>
              </li>
            </Card>
          ))}
        </ol>
      </Grid>
    </Card>
  ),
};

const HOLDER_LABEL: Record<Holder, string> = {
  requester: "Action needed",
  people: "People Strategy",
  finance: "Finance",
  none: "Completed",
};

const HOLDERS = Object.keys(HOLDER_LABEL) as Holder[];
const COMPLETED_COLOR = "var(--color-subtle-foreground)";

const TURN_COUNTS = HOLDERS.map((holder) => ({
  holder,
  count: MY_REQUESTS.filter((request) => REQUEST_HOLDER[request.status] === holder).length,
}));

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// A 2px surface gap between slices, measured along the ring, as turn-summary.tsx draws it.
const SLICE_GAP = 2;

function TurnDonut({ total }: { total: number }) {
  const shown = TURN_COUNTS.filter(({ count }) => count > 0);
  const slices = shown.map(({ holder, count }, index) => ({
    holder,
    length: (count / total) * CIRCUMFERENCE - SLICE_GAP,
    offset:
      (shown.slice(0, index).reduce((sum, entry) => sum + entry.count, 0) / total) * CIRCUMFERENCE,
  }));
  return (
    <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden>
      {slices.map(({ holder, length, offset }) => (
        <circle
          key={holder}
          cx="64"
          cy="64"
          r={RADIUS}
          fill="none"
          strokeWidth="14"
          strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
          strokeDashoffset={-offset}
          stroke={HOLDER_COLOR[holder] ?? COMPLETED_COLOR}
        />
      ))}
    </svg>
  );
}

/** I&R's turn summary: the total is a Stat centred in the donut, the legend counts beside it. */
export const IrTurnSummary: Story = {
  render: () => {
    const total = TURN_COUNTS.reduce((sum, { count }) => sum + count, 0);
    return (
      <Card className="w-xl">
        <CardHeader>
          <CardTitle>Your requests this cycle</CardTitle>
        </CardHeader>
        <Inline gap="xl">
          <div className="relative size-36 shrink-0">
            <TurnDonut total={total} />
            <Stat className="absolute inset-0 items-center justify-center">
              <StatValue>{total}</StatValue>
              <StatMeta>requests</StatMeta>
            </Stat>
          </div>
          <Stack asChild gap="md" className="flex-1">
            <ul aria-label="Your requests this cycle by holder">
              {TURN_COUNTS.map(({ holder, count }) => (
                <Inline asChild key={holder} justify="between">
                  <li>
                    <StatusDot
                      label={HOLDER_LABEL[holder]}
                      color={HOLDER_COLOR[holder] ?? COMPLETED_COLOR}
                    />
                    <span className="text-sm font-medium tabular-nums">{count}</span>
                  </li>
                </Inline>
              ))}
            </ul>
          </Stack>
        </Inline>
      </Card>
    );
  },
};

const cost = annualCost(aisha);
const leftIfApproved = {
  ...AISHA_BUDGET.leftNow,
  amount: AISHA_BUDGET.leftNow.amount - cost.amount,
};
const approved = {
  ...AISHA_BUDGET.yearly,
  amount: AISHA_BUDGET.yearly.amount - AISHA_BUDGET.leftNow.amount,
};
const approvedPercent = Math.round((approved.amount / AISHA_BUDGET.yearly.amount) * 100);

function BudgetRow({ loading = false }: { loading?: boolean }) {
  const figure = (value: string, width: string) =>
    loading ? <Skeleton className={width} /> : value;
  return (
    <Grid cols={3} aria-busy={loading || undefined}>
      <Card>
        <Stat>
          <StatLabel>Yearly budget</StatLabel>
          <StatValue>{figure(formatMoney(AISHA_BUDGET.yearly), "w-32")}</StatValue>
          <StatMeta>
            {figure(`${AISHA_BUDGET.department}, ${AISHA_BUDGET.currency}`, "w-24")}
          </StatMeta>
        </Stat>
      </Card>
      <Card>
        <Stat>
          <StatLabel>Left now</StatLabel>
          <StatValue>{figure(formatMoney(AISHA_BUDGET.leftNow), "w-28")}</StatValue>
          <StatMeta>{figure(`${formatMoney(approved)} approved`, "w-28")}</StatMeta>
        </Stat>
      </Card>
      <Card>
        <Stat>
          <StatLabel>Left if approved</StatLabel>
          <StatValue>{figure(formatMoney(leftIfApproved), "w-28")}</StatValue>
          <StatMeta>
            {loading ? (
              <Skeleton className="w-40" />
            ) : (
              <>
                <StatDelta direction="down" tone="neutral" value={`-${formatMoney(cost)}`} /> for
                Aisha Grant's increase
              </>
            )}
          </StatMeta>
        </Stat>
      </Card>
    </Grid>
  );
}

/** A plain row of I&R's budget figures: each Card holds one Stat and is only as tall as it. */
export const IrBudgetRow: Story = {
  render: () => (
    <div className="w-5xl">
      <BudgetRow />
    </div>
  ),
};

const discovery = DISCOVERY_REQUESTS.find((request) => request.clientName === "Nutramax");

/** Visuals are free composition: a Meter under the budget figure, the assignees under Pool's Nutramax discovery. Each Card stacks its own parts. */
export const WithVisuals: Story = {
  render: () => (
    <Grid cols={2} className="w-3xl">
      <Card>
        <Stat>
          <StatLabel>Approved this year</StatLabel>
          <StatValue>{formatMoney(approved)}</StatValue>
          <StatMeta>
            {approvedPercent}% of the {formatMoney(AISHA_BUDGET.yearly)} Creative budget
          </StatMeta>
        </Stat>
        <Meter value={approvedPercent} fill aria-label="Creative budget approved" />
      </Card>
      {discovery ? (
        <Card>
          <Stat>
            <StatLabel>Discovery</StatLabel>
            <StatValue>{discovery.profilesFound}</StatValue>
            <StatMeta>
              of {discovery.profilesToSource} profiles for {discovery.clientName}
            </StatMeta>
          </Stat>
          <MemberAvatarStack members={discovery.assignees} showNames />
        </Card>
      ) : null}
    </Grid>
  ),
};

/** `tone` colours the figure when it is the signal; the meta says why in words. I&R's request figures. */
export const Tones: Story = {
  render: () => (
    <Grid cols={3} className="w-4xl">
      {[
        { tone: "success", value: "+6%", reason: "Within 5–7% for Delivering Impact (3)" },
        { tone: "warning", value: "+11%", reason: "Above 7–10% for Raising the Bar (4)" },
        { tone: "destructive", value: "$1,200", reason: "Past the IC3 band maximum" },
      ].map(({ tone, value, reason }) => (
        <Card key={tone}>
          <Stat>
            <StatLabel>{tone === "destructive" ? "Over the maximum" : "Change"}</StatLabel>
            <StatValue tone={tone as (typeof TONES)[number]}>{value}</StatValue>
            <StatMeta>{reason}</StatMeta>
          </Stat>
        </Card>
      ))}
    </Grid>
  ),
};

/** The page composes Skeleton: inside a StatValue or StatMeta it sits on the line at the text's height, labels stay. Loaded above, loading below: nothing moves when the figures land. */
export const Loading: Story = {
  render: () => (
    <Stack gap="xl" className="w-5xl">
      <BudgetRow />
      <BudgetRow loading />
    </Stack>
  ),
};

/** `size="lg"` is the one hero figure on a page; the page gives its Card the room. */
export const HeroFigure: Story = {
  render: () => (
    <Grid cols={4} className="w-6xl">
      <Card className="md:col-span-2">
        <Stat>
          <StatLabel>Left now</StatLabel>
          <StatValue size="lg">{formatMoney(AISHA_BUDGET.leftNow)}</StatValue>
          <StatMeta>of the {formatMoney(AISHA_BUDGET.yearly)} Creative budget</StatMeta>
        </Stat>
      </Card>
      <Card>
        <Stat>
          <StatLabel>Cost a year</StatLabel>
          <StatValue>{formatIncrease(cost)}</StatValue>
          <StatMeta>Aisha Grant's increase</StatMeta>
        </Stat>
      </Card>
      <Card>
        <Stat>
          <StatLabel>Left if approved</StatLabel>
          <StatValue>{formatMoney(leftIfApproved)}</StatValue>
        </Stat>
      </Card>
    </Grid>
  ),
};
