import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppNav } from "../../src/components/app-nav";
import { AppShell, AppShellTitle } from "../../src/components/app-shell";
import { Avatar, AvatarFallback } from "../../src/components/avatar";
import { Button } from "../../src/components/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../../src/components/card";
import { DescriptionItem, DescriptionList } from "../../src/components/description-list";
import { DetailLayout } from "../../src/components/detail-layout";
import { Field, FieldGroup, FieldLabel } from "../../src/components/field";
import { Input } from "../../src/components/input";
import { Grid, Stack } from "../../src/components/layout";
import { Page, PageBackLink, PageHeader, PagePager, PageSection } from "../../src/components/page";
import { Separator } from "../../src/components/separator";
import { Stat, StatLabel, StatMeta, StatValue } from "../../src/components/stat";
import { StatusDot } from "../../src/components/status-dot";
import { Textarea } from "../../src/components/textarea";
import { getInitials } from "../../src/lib/initials";
import {
  aisha,
  formatDate,
  formatDays,
  formatMoney,
  formatPercentChange,
  percentChange,
  ROUND,
} from "../screens/impact-and-recognition/fixtures";
import { IrShell } from "../screens/impact-and-recognition/parts";
import { CreatorProfileView } from "../screens/pool/pool-blocks";

// I&R's approval of Aisha Grant's increase, composed from toolkit parts only; the screen story
// "Screens/Impact and Recognition/Approvals" shows the app's own cards.

const meta = {
  title: "Organisms/DetailLayout",
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "desktop", isRotated: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function StatusSummary() {
  return (
    <Card aria-label="Request">
      <CardHeader>
        <CardTitle>Pay increase</CardTitle>
        <CardDescription>{aisha.reference}</CardDescription>
      </CardHeader>
      <StatusDot tone="warning" label="Finance approval" />
      <Separator />
      <DescriptionList>
        <DescriptionItem label="Waiting">{formatDays(aisha.waitingDays ?? 0)}</DescriptionItem>
        <DescriptionItem label="Approvals">1 of 2</DescriptionItem>
        <DescriptionItem label="Submitted">{formatDate(aisha.submittedAt ?? "")}</DescriptionItem>
        <DescriptionItem label="Requested by">{aisha.requester}</DescriptionItem>
        <DescriptionItem label="Effective if approved">
          {formatDate(ROUND.effective)}
        </DescriptionItem>
      </DescriptionList>
    </Card>
  );
}

function Decision() {
  return (
    <Card aria-label="Decision">
      <CardHeader>
        <CardTitle>Your decision</CardTitle>
        <CardDescription>Approving makes it final. People releases it to share.</CardDescription>
      </CardHeader>
      <Stack gap="sm">
        <Button size="lg">Approve</Button>
        <Button size="lg" variant="outline">
          Request changes
        </Button>
      </Stack>
    </Card>
  );
}

function Evidence() {
  return (
    <>
      <PageSection title="Proposal" description="Yearly salary">
        <Grid cols={3} gap="md">
          <Card>
            <Stat>
              <StatLabel>Current</StatLabel>
              <StatValue>{formatMoney(aisha.current)}</StatValue>
            </Stat>
          </Card>
          <Card>
            <Stat>
              <StatLabel>Proposed</StatLabel>
              <StatValue>{formatMoney(aisha.proposed)}</StatValue>
            </Stat>
          </Card>
          <Card>
            <Stat>
              <StatLabel>Change</StatLabel>
              <StatValue tone="success">
                {formatPercentChange(percentChange(aisha.current, aisha.proposed))}
              </StatValue>
              <StatMeta>Guidance {aisha.guidance.label}</StatMeta>
            </Stat>
          </Card>
        </Grid>
      </PageSection>
      <PageSection title="Why this increase">
        <Card>
          <p className="max-w-prose text-base/7 text-pretty">{aisha.justification}</p>
        </Card>
      </PageSection>
    </>
  );
}

function ApprovalPage() {
  return (
    <Page>
      <PageHeader
        back={<PageBackLink href="#approvals">Approvals</PageBackLink>}
        pager={
          <PagePager
            aria-label="Approvals"
            position={1}
            total={7}
            previousLabel="Previous request"
            nextLabel="Next request"
            onPrevious={() => undefined}
            onNext={() => undefined}
          />
        }
        media={
          <Avatar size="xl" aria-hidden>
            <AvatarFallback>{getInitials(aisha.person.name)}</AvatarFallback>
          </Avatar>
        }
        title={aisha.person.name}
        description={`${aisha.person.title}, ${aisha.person.level}, ${aisha.person.department}`}
      />
      <DetailLayout summary={<StatusSummary />} aside={<Decision />}>
        <Evidence />
      </DetailLayout>
    </Page>
  );
}

/** The case on the left, a sticky column with where it stands, then the decision, from lg. Cards in either column sit 24px apart; sections with a heading keep the page's 40px. */
export const AllStates: Story = { render: () => <ApprovalPage /> };

/** Scrolled in I&R's top bar: the side column stays 24px under the bar, and on a short screen it scrolls on its own instead of riding up into the bar. */
export const InTopbarShell: Story = {
  render: () => (
    <IrShell viewer="finance" active="Approvals">
      <ApprovalPage />
    </IrShell>
  ),
};

/** The same page in the inset sidebar shell, whose frame takes 16px more of the screen. */
export const InSidebarShell: Story = {
  render: () => (
    <AppShell
      variant="inset"
      sidebarHeader={<AppShellTitle>Impact & Recognition</AppShellTitle>}
      sidebar={
        <AppNav
          items={[{ title: "Home" }, { title: "Approvals", isActive: true }, { title: "Budget" }]}
          renderLink={(_item, content) => <a href="#section">{content}</a>}
        />
      }
    >
      <ApprovalPage />
    </AppShell>
  ),
};

/** On a phone the order is status, case, decision: what it is, why, then what to do. */
export const Phone: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  render: () => <ApprovalPage />,
};

/** A form with its summary beside it: only `aside`, which follows the form on a phone. I&R's new request, step one. */
export const FormWithSummary: Story = {
  render: () => (
    <Page>
      <PageHeader
        back={<PageBackLink href="#requests">My requests</PageBackLink>}
        title="New request"
      />
      <DetailLayout
        aside={
          <Card aria-label="Summary">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <DescriptionList>
              <DescriptionItem label="Person">{aisha.person.name}</DescriptionItem>
              <DescriptionItem label="Current">{formatMoney(aisha.current)}</DescriptionItem>
              <DescriptionItem label="Proposed">{formatMoney(aisha.proposed)}</DescriptionItem>
              <DescriptionItem label="Effective if approved">
                {formatDate(ROUND.effective)}
              </DescriptionItem>
            </DescriptionList>
          </Card>
        }
      >
        <Card>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="request-proposed">Proposed pay</FieldLabel>
              <Input id="request-proposed" defaultValue="72,080" inputMode="numeric" />
            </Field>
            <Field>
              <FieldLabel htmlFor="request-reason">Why this increase?</FieldLabel>
              <Textarea id="request-reason" rows={6} defaultValue={aisha.justification} />
            </Field>
          </FieldGroup>
        </Card>
      </DetailLayout>
    </Page>
  ),
};

/** `variant="ruled" asidePosition="start"` around a `Page`: Pool's creator profile, its 320px info
 * column full height and ruled off on the left, each side scrolling on its own. */
export const RuledInfoColumn: Story = {
  render: () => (
    <div className="flex h-svh flex-col">
      <CreatorProfileView />
    </div>
  ),
};
