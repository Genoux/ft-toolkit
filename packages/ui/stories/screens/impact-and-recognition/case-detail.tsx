import {
  ArrowRight,
  Check,
  CircleSlash,
  FileCheck,
  type LucideIcon,
  Pencil,
  Undo2,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "../../../src/components/badge";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardSection,
  CardTitle,
} from "../../../src/components/card";
import {
  CollapsibleBody,
  CollapsibleHeader,
  CollapsibleSection,
} from "../../../src/components/collapsible-section";
import { DescriptionItem, DescriptionList } from "../../../src/components/description-list";
import { DetailLayout } from "../../../src/components/detail-layout";
import { InfoHint } from "../../../src/components/info-hint";
import { Inline, Stack } from "../../../src/components/layout";
import { Page, PageBackLink, PageHeader } from "../../../src/components/page";
import { PersonAvatar } from "../../../src/components/person-identity";
import { Skeleton } from "../../../src/components/skeleton";
import { Stat, StatLabel, StatValue } from "../../../src/components/stat";
import { panelClassName } from "../../../src/lib/surface";
import { cn } from "../../../src/lib/utils";
import { HolderStatus } from "../../lib/impact-and-recognition-display";
import {
  formatMoney,
  formatPercentChange,
  formatShortDate,
  HOLDER_COLOR,
  type IrRequest,
  type Pay,
  percentChange,
  policyChecks,
  REQUEST_HOLDER,
  ROUND,
} from "../../lib/impact-and-recognition-fixtures";
import { BandScale, CasePager, PanelSection, PolicyChecks, type ReceiptRow } from "./parts";

const KIND_LABEL = { increase: "Pay increase", promotion: "Promotion" } as const;

const PAY_NAME = { annual: "Yearly salary", hourly: "Hourly rate" } as const;

/** The case page's cards: a title, quiet text at the right, then the content. */
function CaseCard({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card asChild>
      <section aria-label={title}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {aside ? (
            <CardAction className="self-center text-sm text-muted-foreground">{aside}</CardAction>
          ) : null}
        </CardHeader>
        {children}
      </section>
    </Card>
  );
}

/** A figure on the toolkit's quiet panel: its label (with an optional hint), then the figure. */
function Tile({
  label,
  hint,
  tone,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  tone?: string;
  children: string;
}) {
  return (
    <div className={cn("@container flex h-full min-w-0 flex-col gap-1 p-4", panelClassName)}>
      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        {label}
        {hint}
      </div>
      <p
        className={cn(
          "font-medium whitespace-nowrap tabular-nums",
          children.length > 8 ? "text-lg @[11rem]:text-title" : "text-xl @[9rem]:text-title",
          tone,
        )}
      >
        {children}
      </p>
    </div>
  );
}

const guidanceTone = (request: IrRequest) =>
  percentChange(request.current, request.proposed) > request.guidance.maxPercent
    ? "text-warning-foreground"
    : "text-success-foreground";

const changeInWords = (request: IrRequest) =>
  `${formatMoney({ ...request.current, amount: request.proposed.amount - request.current.amount })} more ${request.current.frequency === "hourly" ? "an hour" : "a year"}`;

/**
 * Current and proposed pay with the arrow between them, then the change in its guideline colour,
 * its amount in a hint. Every tile holds a label and a figure, so all three are one height.
 */
function Proposal({ request }: { request: IrRequest }) {
  const promotion = request.kind === "promotion";
  return (
    <CaseCard title="Proposal" aside={PAY_NAME[request.current.frequency]}>
      <div className="@container">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 @lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,1fr)]">
          {promotion ? (
            <>
              <p className="self-end px-4 text-sm text-pretty">
                {request.person.title}, {request.person.level}
              </p>
              <ArrowRight
                aria-label="to"
                className="size-4 self-center justify-self-center text-muted-foreground"
              />
              <p className="self-end px-4 text-sm font-medium text-pretty @lg:col-span-2">
                {request.proposedTitle}, {request.proposedLevel}
              </p>
            </>
          ) : null}
          <Tile label="Current">{formatMoney(request.current)}</Tile>
          <ArrowRight
            aria-label="to"
            className="size-5 self-center justify-self-center text-muted-foreground"
          />
          <Tile label="Proposed">{formatMoney(request.proposed)}</Tile>
          <div className="col-span-3 @lg:col-span-1 @lg:ml-3">
            <Tile
              label="Change"
              hint={<InfoHint label="What the change is">{changeInWords(request)}</InfoHint>}
              tone={guidanceTone(request)}
            >
              {formatPercentChange(percentChange(request.current, request.proposed))}
            </Tile>
          </div>
        </div>
      </div>
    </CaseCard>
  );
}

const POSITION_HINT =
  "How far along the band the pay is: 0% is the band minimum, 100% the maximum.";

const bandPosition = (pay: Pay, band: NonNullable<IrRequest["band"]>) =>
  ((pay.amount - band.min.amount) / (band.max.amount - band.min.amount)) * 100;

function positionText(position: number) {
  if (position < 0) return "Below minimum";
  if (position > 100) return "Above maximum";
  return `${Math.round(position)}%`;
}

/** Where the pay sits in the level's band: the band to scale, then now, proposed and what is left. */
function PayBand({ request }: { request: IrRequest }) {
  const { band } = request;
  if (!band) {
    return (
      <CaseCard title="Pay band">
        <p className="text-sm text-muted-foreground">
          No {request.person.level} band in {request.proposed.currency} yet.
        </p>
      </CaseCard>
    );
  }
  const next = bandPosition(request.proposed, band);
  const inBand = next >= 0 && next <= 100;
  const headroom = band.max.amount - request.proposed.amount;
  const positionHint = <InfoHint label="What position in band means">{POSITION_HINT}</InfoHint>;
  return (
    <CaseCard title="Pay band" aside={`${band.level} band`}>
      <BandScale band={band} current={request.current} proposed={request.proposed} labels={false} />
      <dl className="@container grid gap-3 sm:grid-cols-3">
        <Tile label={<dt>Now in band</dt>} hint={positionHint}>
          {positionText(bandPosition(request.current, band))}
        </Tile>
        <Tile
          label={<dt>Proposed in band</dt>}
          hint={positionHint}
          tone={inBand ? "text-success-foreground" : "text-warning-foreground"}
        >
          {positionText(next)}
        </Tile>
        <Tile
          label={<dt>{headroom < 0 ? "Over the maximum" : "Left to maximum"}</dt>}
          tone={headroom < 0 ? "text-warning-foreground" : undefined}
        >
          {formatMoney({ ...request.proposed, amount: Math.abs(headroom) })}
        </Tile>
      </dl>
    </CaseCard>
  );
}

function Reason({ request }: { request: IrRequest }) {
  return (
    <CaseCard title={`Why this ${request.kind}`}>
      <p className="max-w-prose text-base/7 text-pretty">{request.justification}</p>
    </CaseCard>
  );
}

const EVENT_MARK: { verb: RegExp; icon: LucideIcon; tone: string }[] = [
  { verb: /^approved/, icon: Check, tone: "bg-success/12 text-success-foreground" },
  { verb: /^asked for changes/, icon: Undo2, tone: "bg-muted" },
  {
    verb: /^(verified|released|submitted|resubmitted|shared)/,
    icon: ArrowRight,
    tone: "bg-info/12",
  },
  { verb: /^recorded/, icon: FileCheck, tone: "bg-muted" },
  { verb: /^(withdrew|closed)/, icon: CircleSlash, tone: "bg-muted" },
];

const eventMark = (summary: string) =>
  EVENT_MARK.find((mark) => mark.verb.test(summary)) ?? {
    icon: Pencil,
    tone: "bg-muted",
  };

/** The request's history folded to its title and count: newest first, one line each with its note. */
function History({ request }: { request: IrRequest }) {
  return (
    // Finance reads People's note in the history, so it starts open while Finance holds the case.
    <CollapsibleSection variant="card" defaultOpen={request.status === "finance_review"}>
      <CollapsibleHeader
        meta={
          <Badge variant="secondary" size="sm">
            {request.events.length}
          </Badge>
        }
      >
        History
      </CollapsibleHeader>
      <CollapsibleBody>
        <ul className="flex flex-col divide-y divide-border">
          {request.events.toReversed().map((event) => {
            const mark = eventMark(event.summary);
            return (
              <li
                key={event.id}
                className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden
                  className={cn("grid size-8 place-items-center rounded-md", mark.tone)}
                >
                  <mark.icon className="size-4" />
                </span>
                <div className="min-w-0 pt-1.5">
                  <p className="text-sm text-pretty">
                    <span className="font-medium">{event.actor}</span> {event.summary}
                  </p>
                  {event.note ? (
                    <blockquote className="mt-2 max-w-prose rounded-md bg-muted px-3 py-2 text-sm text-pretty text-muted-foreground">
                      {event.note}
                    </blockquote>
                  ) : null}
                </div>
                <time
                  dateTime={event.at}
                  className="pt-2 text-xs whitespace-nowrap text-muted-foreground"
                >
                  {formatShortDate(event.at)}
                </time>
              </li>
            );
          })}
        </ul>
      </CollapsibleBody>
    </CollapsibleSection>
  );
}

/** A label above a larger value: the request's kind and its status are set alike. */
function Fact({
  label,
  aside,
  children,
}: {
  label: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Stat>
      <StatLabel className="justify-between">
        {label}
        {aside}
      </StatLabel>
      <StatValue size="sm">{children}</StatValue>
    </Stat>
  );
}

type CaseStatusProps = {
  request: IrRequest;
  rows: ReceiptRow[];
  /** The viewer's own facts before the actions (Finance: budget impact). */
  review?: ReactNode;
  /** The viewer's actions, right under what they act on. */
  actions?: ReactNode;
};

/**
 * What the request is and where it stands, the facts a reviewer looks up, then what the viewer can
 * do about it. The bar and the mark carry the colour of whoever holds the request, the same as its
 * step in the Control Room.
 */
function CaseStatus({ request, rows, review, actions }: CaseStatusProps) {
  const color = HOLDER_COLOR[REQUEST_HOLDER[request.status]];
  return (
    <Card aria-label="Request" asChild className="relative gap-(--gap-xl) overflow-hidden">
      <section>
        <CardSection>
          <Fact label="Request" aside={<span className="tabular-nums">{request.reference}</span>}>
            {KIND_LABEL[request.kind]}
          </Fact>
          <Fact label="Status">
            <HolderStatus status={request.status} size="lg" className="text-xl" />
          </Fact>
          <DescriptionList align="end" frame divided>
            {rows.map((row) => (
              <DescriptionItem key={row.label} label={row.label}>
                {row.value}
              </DescriptionItem>
            ))}
          </DescriptionList>
        </CardSection>
        {review}
        {actions}
        {/* signature-surface: the coloured holder bar across the top of the status receipt. */}
        <div
          aria-hidden
          style={color ? { backgroundColor: color } : undefined}
          className={cn("absolute inset-x-0 top-0 h-1.5", !color && "bg-subtle-foreground/40")}
        />
      </section>
    </Card>
  );
}

type DecisionProps = Omit<CaseStatusProps, "rows"> & {
  /** The one message that changes what happens next: a returned note, a blocker. */
  notice?: ReactNode;
};

/** Under the request's card: the note that changes what happens next in a card of its own when there is one, then every policy check. */
function DecisionPanel({ request, notice }: Pick<DecisionProps, "request" | "notice">) {
  const checks = policyChecks(request);
  const met = checks.filter((check) => check.result === "met").length;
  const toVerify = checks.filter((check) => check.result === "needs_verification").length;
  return (
    <>
      {notice ? (
        <Card aria-label="Note" asChild>
          <aside>{notice}</aside>
        </Card>
      ) : null}
      <Card aria-label="Policy" asChild>
        <aside>
          <PanelSection
            title="Policy"
            aside={
              <>
                {toVerify > 0
                  ? `${met} met, ${toVerify} to verify`
                  : `${met} of ${checks.length} met`}
                <InfoHint label="When policy is checked">
                  Checked as of {formatShortDate(ROUND.effective)}, the proposed effective date.
                </InfoHint>
              </>
            }
          >
            <PolicyChecks checks={checks} />
          </PanelSection>
        </aside>
      </Card>
    </>
  );
}

/** One message in the decision panel: a short title, then the note (quoted) or what it means. */
export function PanelNotice({
  title,
  quote,
  children,
}: {
  title: ReactNode;
  quote?: boolean;
  children: ReactNode;
}) {
  return (
    <Stack gap="sm">
      <h3 className="text-sm font-medium">{title}</h3>
      {quote ? (
        <blockquote className="border-l border-input pl-3 text-sm text-pretty">
          {children}
        </blockquote>
      ) : (
        <p className="text-sm text-pretty">{children}</p>
      )}
    </Stack>
  );
}

/** Someone's note at the top of the decision panel: their avatar and name, then their words. */
export function PanelNote({ author, children }: { author: string; children: ReactNode }) {
  return (
    <PanelNotice
      quote
      title={
        <Inline gap="sm" wrap={false}>
          <PersonAvatar name={author} size="md" aria-hidden />
          {author}'s note
        </Inline>
      }
    >
      {children}
    </PanelNotice>
  );
}

/** The viewer's actions at the foot of the request's card: what the step needs, then the buttons side by side. */
export function PanelActions({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <CardSection>
      {caption ? <p className="text-sm text-pretty text-muted-foreground">{caption}</p> : null}
      <CardFooter fill>{children}</CardFooter>
    </CardSection>
  );
}

// toolkit-gap: Page has no size between medium (1024) and default (1536). I&R's case page is
// max-w-6xl less its 40px sides, a 1072px column; 1120 less Page's 24px sides gives the same.
const CASE_PAGE_WIDTH = "max-w-280";

type CaseDetailProps = DecisionProps & {
  back: string;
  position: number;
  total: number;
  rows: ReceiptRow[];
};

/**
 * One request as a page: back and pager, the person across the page; below, the case in cards by
 * subject on the left, and on the right what the request is and where it stands, then the decision.
 */
export function CaseDetail({ request, back, position, total, rows, ...decision }: CaseDetailProps) {
  return (
    <Page className={CASE_PAGE_WIDTH}>
      <PageHeader
        back={<PageBackLink href="#list">{back}</PageBackLink>}
        pager={<CasePager position={position} total={total} />}
        media={<PersonAvatar name={request.person.name} size="xl" aria-hidden />}
        // signature-surface: the person's name in the serif, the case page's one statement.
        title={<span className="font-serif font-normal">{request.person.name}</span>}
        description={`${request.person.title}, ${request.person.level}, ${request.person.department}`}
      />
      <DetailLayout
        summary={
          <CaseStatus
            request={request}
            rows={rows}
            review={decision.review}
            actions={decision.actions}
          />
        }
        aside={<DecisionPanel request={request} notice={decision.notice} />}
      >
        <Proposal request={request} />
        <PayBand request={request} />
        <Reason request={request} />
        {request.events.length > 0 ? <History request={request} /> : null}
      </DetailLayout>
    </Page>
  );
}

export function CaseDetailLoading({ back }: { back: string }) {
  return (
    <Page aria-busy className={CASE_PAGE_WIDTH}>
      <Stack gap="sm">
        <Inline>
          <PageBackLink href="#list">{back}</PageBackLink>
        </Inline>
        <Inline gap="md">
          <Skeleton className="size-14 rounded-full" />
          <Stack gap="xs">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-3.5 w-56" />
          </Stack>
        </Inline>
      </Stack>
      <DetailLayout
        summary={<Skeleton className="h-72 w-full rounded-xl" />}
        aside={<Skeleton className="h-56 w-full rounded-xl" />}
      >
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </DetailLayout>
    </Page>
  );
}
