import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "../../../src/components/button";
import { Card, CardSection } from "../../../src/components/card";
import { Checkbox } from "../../../src/components/checkbox";
import { DetailLayout } from "../../../src/components/detail-layout";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../../../src/components/field";
import { Input } from "../../../src/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../../../src/components/input-group";
import { Grid } from "../../../src/components/layout";
import { Page, PageBackLink, PageHeader } from "../../../src/components/page";
import { RadioGroup, RadioGroupItem } from "../../../src/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../src/components/select";
import { StatusDot } from "../../../src/components/status-dot";
import { Textarea } from "../../../src/components/textarea";
import { cn } from "../../../src/lib/utils";
import {
  type EligibilityCheck,
  formatDate,
  formatMoney,
  formatPercentChange,
  formatShortDate,
  HOLDER_COLOR,
  KIND_OPTIONS,
  PROMOTION_LEVELS,
  percentChange,
  RATINGS,
  REQUEST_ISSUES,
  REQUESTER_TINT,
  ROUND,
  TOMAS,
} from "./fixtures";
import { BandScale, IrShell, PanelSection, PolicyChecks } from "./parts";

const ELIGIBILITY: EligibilityCheck[] = [
  { label: "Time at company", result: "met", detail: "4 yrs 1 mo", requirement: "Needs 6 months" },
  {
    label: "Last raise",
    result: "met",
    detail: "Jul 2025",
    requirement: "Needs 12 months since",
  },
  {
    label: "Rating",
    result: "needs_verification",
    detail: "Raising the Bar (4)",
    requirement: "Verified by People in Windmill",
  },
  { label: "Contract", result: "met", detail: "Employee" },
];

const { person } = TOMAS;
const FIRST_NAME = person.name.split(" ")[0];

function Amount({
  label,
  amount,
  role,
  quiet,
}: {
  label: string;
  amount: string;
  role: string;
  quiet?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("text-xl font-medium tabular-nums", quiet && "text-muted-foreground")}>
        {amount}
      </p>
      <p className="min-h-5 text-sm text-muted-foreground">
        {amount === "Not set" ? "" : "a year"}
      </p>
      <p className="text-sm font-medium text-pretty">{role}</p>
    </div>
  );
}

/** Now → from the effective date with each role under its pay, then the change. */
function Statement({ filled, title }: { filled: boolean; title: string }) {
  const amount = TOMAS.proposed.amount - TOMAS.current.amount;
  return (
    <CardSection aria-label="Change">
      <div className="grid grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)] gap-x-3">
        <Amount
          label="Now"
          amount={formatMoney(TOMAS.current)}
          role={`${person.title}, ${person.level}`}
          quiet
        />
        <ArrowRight aria-hidden className="mt-7 size-4 text-muted-foreground" />
        <Amount
          label={`From ${formatShortDate(ROUND.effective)}`}
          amount={filled ? formatMoney(TOMAS.proposed) : "Not set"}
          role={`${title || "New title"}, ${PROMOTION_LEVELS[0]}`}
        />
      </div>
      <p className="flex flex-wrap items-baseline gap-x-2.5 text-sm">
        <span className="text-muted-foreground">Change</span>
        {filled ? (
          <>
            <span className="font-medium tabular-nums">
              {formatPercentChange(percentChange(TOMAS.current, TOMAS.proposed))}
            </span>
            <span className="text-muted-foreground tabular-nums">
              +{formatMoney({ ...TOMAS.current, amount })} a year
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">Enter the increase</span>
        )}
      </p>
    </CardSection>
  );
}

/** The draft as People and Finance will read it, in view while the requester works. */
function ProposalPanel({ filled, title }: { filled: boolean; title: string }) {
  return (
    <Card aria-label="Summary" asChild className="overflow-hidden">
      <aside>
        {/* signature-surface: the draft's head in the requester's holder tint and mark. */}
        <header
          style={{ backgroundColor: REQUESTER_TINT }}
          className="-mx-(--card-padding) -mt-(--card-padding) flex flex-col gap-1 px-(--card-padding) py-4"
        >
          <StatusDot
            color={HOLDER_COLOR.requester}
            label={`Promotion for ${FIRST_NAME}`}
            className="text-base font-medium"
          />
          <p className="text-sm text-muted-foreground">
            Draft, effective {formatDate(ROUND.effective)}
          </p>
        </header>
        <Statement filled={filled} title={title} />
        <PanelSection title="Band">
          {filled ? (
            <BandScale band={TOMAS.band} current={TOMAS.current} proposed={TOMAS.proposed} />
          ) : (
            <p className="text-sm text-pretty text-muted-foreground">
              Enter the increase to see where it lands in the {TOMAS.band.level} band.
            </p>
          )}
        </PanelSection>
        <PanelSection title="Eligibility" aside={`On ${formatShortDate(ROUND.effective)}`}>
          <PolicyChecks checks={ELIGIBILITY} />
        </PanelSection>
      </aside>
    </Card>
  );
}

function PersonHeading() {
  return (
    <CardSection asChild>
      <header>
        <div className="flex flex-col gap-1">
          {/* signature-surface: the person's name in the serif, the flow's one statement. */}
          <h2 className="font-serif text-title text-balance">{person.name}</h2>
          <p className="text-base text-muted-foreground">
            {person.title}, {person.level}, {person.department}
          </p>
        </div>
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Current pay</dt>
          <dd className="tabular-nums">{formatMoney(TOMAS.current)} a year</dd>
          <dt className="text-muted-foreground">Effective</dt>
          <dd>
            {formatDate(ROUND.effective)}
            <span className="text-muted-foreground">, set by the {ROUND.name}</span>
          </dd>
        </dl>
      </header>
    </CardSection>
  );
}

type Issues = Partial<Record<keyof typeof REQUEST_ISSUES, string>>;

type FormState = ReturnType<typeof useFormState>;

function useFormState(filled: boolean) {
  const [kind, setKind] = useState("promotion");
  const [level, setLevel] = useState(PROMOTION_LEVELS[0]);
  const [rating, setRating] = useState("4");
  const [title, setTitle] = useState(filled ? "Head of Design" : "");
  const [link, setLink] = useState(filled ? TOMAS.jobDescription : "");
  const [increase, setIncrease] = useState(filled ? "10" : "");
  const [proposed, setProposed] = useState(filled ? "79,200" : "");
  const [justification, setJustification] = useState(filled ? TOMAS.justification : "");
  const [declared, setDeclared] = useState(filled);
  return {
    kind,
    setKind,
    level,
    setLevel,
    rating,
    setRating,
    title,
    setTitle,
    link,
    setLink,
    increase,
    setIncrease,
    proposed,
    setProposed,
    justification,
    setJustification,
    declared,
    setDeclared,
  };
}

function RoleSection({ form, issues }: { form: FormState; issues: Issues }) {
  return (
    <CardSection className="gap-7">
      <FieldSet>
        <FieldLegend>Request type</FieldLegend>
        <RadioGroup value={form.kind} onValueChange={form.setKind} className="sm:grid-cols-2">
          {KIND_OPTIONS.map((option) => (
            <FieldLabel key={option.value} htmlFor={`kind-${option.value}`}>
              <Field orientation="horizontal">
                <RadioGroupItem id={`kind-${option.value}`} value={option.value} />
                <FieldContent>
                  <FieldTitle>{option.label}</FieldTitle>
                  <FieldDescription>{option.hint}</FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>
      {form.kind === "promotion" ? (
        <>
          <Grid cols={2} gap="md">
            <Field>
              <FieldLabel htmlFor="request-level">New level</FieldLabel>
              <Select value={form.level} onValueChange={form.setLevel}>
                <SelectTrigger id="request-level" className="w-full">
                  <SelectValue placeholder="Choose a level" />
                </SelectTrigger>
                <SelectContent>
                  {PROMOTION_LEVELS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field data-invalid={Boolean(issues.proposedTitle)}>
              <FieldLabel htmlFor="request-title">New title</FieldLabel>
              <Input
                id="request-title"
                value={form.title}
                onChange={(event) => form.setTitle(event.target.value)}
                aria-invalid={Boolean(issues.proposedTitle)}
                aria-describedby="request-title-error"
              />
              <FieldError id="request-title-error">{issues.proposedTitle}</FieldError>
            </Field>
          </Grid>
          <Field data-invalid={Boolean(issues.jobDescriptionUrl)}>
            <FieldLabel htmlFor="request-job-description">Job description</FieldLabel>
            <Input
              id="request-job-description"
              type="url"
              placeholder="https://"
              value={form.link}
              onChange={(event) => form.setLink(event.target.value)}
              aria-invalid={Boolean(issues.jobDescriptionUrl)}
              aria-describedby="request-job-description-hint request-job-description-error"
            />
            <FieldDescription id="request-job-description-hint">
              A link to the current description of the new role.
            </FieldDescription>
            <FieldError id="request-job-description-error">{issues.jobDescriptionUrl}</FieldError>
          </Field>
        </>
      ) : null}
    </CardSection>
  );
}

function PaySection({ form, issues }: { form: FormState; issues: Issues }) {
  return (
    <CardSection className="gap-7">
      <Field>
        <FieldLabel htmlFor="request-rating">Windmill rating</FieldLabel>
        <Select value={form.rating} onValueChange={form.setRating}>
          <SelectTrigger
            id="request-rating"
            className="w-full sm:w-1/2"
            aria-describedby="request-rating-hint"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RATINGS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription id="request-rating-hint">
          Entered by you from Windmill; People verifies it there.
        </FieldDescription>
      </Field>
      <div className="flex flex-col gap-3">
        <Grid cols={2} gap="md">
          <Field>
            <FieldLabel htmlFor="request-increase">Increase</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="request-increase"
                inputMode="decimal"
                value={form.increase}
                onChange={(event) => form.setIncrease(event.target.value)}
                aria-describedby="request-pay-hint"
              />
              <InputGroupAddon align="inline-end">%</InputGroupAddon>
            </InputGroup>
          </Field>
          <Field data-invalid={Boolean(issues.proposed)}>
            <FieldLabel htmlFor="request-proposed">Proposed pay</FieldLabel>
            <InputGroup>
              <InputGroupAddon>USD</InputGroupAddon>
              <InputGroupInput
                id="request-proposed"
                inputMode="decimal"
                value={form.proposed}
                onChange={(event) => form.setProposed(event.target.value)}
                aria-invalid={Boolean(issues.proposed)}
                aria-describedby={issues.proposed ? "request-proposed-error" : "request-pay-hint"}
              />
              <InputGroupAddon align="inline-end">a year</InputGroupAddon>
            </InputGroup>
            <FieldError id="request-proposed-error">{issues.proposed}</FieldError>
          </Field>
        </Grid>
        <FieldDescription id="request-pay-hint">
          Guidance is {TOMAS.guidance.label}. Edit either field; the other follows.
        </FieldDescription>
      </div>
    </CardSection>
  );
}

function ReasonSection({ form, issues }: { form: FormState; issues: Issues }) {
  return (
    <CardSection className="gap-7">
      <Field data-invalid={Boolean(issues.justification)}>
        <FieldLabel htmlFor="request-justification">
          {form.kind === "promotion" ? "Why this promotion?" : "Why this increase?"}
        </FieldLabel>
        <Textarea
          id="request-justification"
          rows={5}
          value={form.justification}
          onChange={(event) => form.setJustification(event.target.value)}
          aria-invalid={Boolean(issues.justification)}
          aria-describedby="request-justification-hint request-justification-error"
        />
        <FieldDescription id="request-justification-hint">
          What changed in their work and its impact. Above guidance, say why it is deserved.
        </FieldDescription>
        <FieldError id="request-justification-error">{issues.justification}</FieldError>
      </Field>
      <Field orientation="horizontal" data-invalid={Boolean(issues.declared)}>
        <Checkbox
          id="request-declared"
          checked={form.declared}
          onCheckedChange={(value) => form.setDeclared(value === true)}
          aria-invalid={Boolean(issues.declared)}
          aria-describedby="request-declared-hint request-declared-error"
        />
        <FieldContent>
          <FieldLabel htmlFor="request-declared">Windmill reviews are complete</FieldLabel>
          <FieldDescription id="request-declared-hint">
            Self-reflection, peer feedback and manager review, for this round.
          </FieldDescription>
          <FieldError id="request-declared-error">{issues.declared}</FieldError>
        </FieldContent>
      </Field>
    </CardSection>
  );
}

/** The step's buttons pinned to the bottom of the page, with one line on who hears what. */
// toolkit-gap: no sticky page footer bar; composed from tokens on the canvas edge.
function FlowFooter({ note, children }: { note: string; children: ReactNode }) {
  return (
    <footer className="sticky bottom-0 z-10 border-t border-border bg-card py-3">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 sm:flex-row sm:items-center sm:gap-6 md:px-10">
        <p className="text-sm text-pretty text-muted-foreground">{note}</p>
        <div className="flex flex-wrap justify-end gap-2 sm:ml-auto sm:gap-3">{children}</div>
      </div>
    </footer>
  );
}

function NewRequest({ filled = true, issues = {} }: { filled?: boolean; issues?: Issues }) {
  const form = useFormState(filled);
  return (
    <IrShell viewer="head" active="My requests">
      <form
        noValidate
        onSubmit={(event) => event.preventDefault()}
        className="flex min-h-full flex-col"
      >
        <Page className="max-w-5xl flex-1">
          <PageHeader
            back={<PageBackLink href="#list">My requests</PageBackLink>}
            title="New request"
          />
          <DetailLayout aside={<ProposalPanel filled={filled} title={form.title} />}>
            <Card>
              <PersonHeading />
              <RoleSection form={form} issues={issues} />
              <PaySection form={form} issues={issues} />
              <ReasonSection form={form} issues={issues} />
            </Card>
          </DetailLayout>
        </Page>
        <FlowFooter note="Saving a draft notifies nobody.">
          <Button type="button" size="lg" variant="outline">
            Save draft
          </Button>
          <Button type="submit" size="lg">
            Review request
          </Button>
        </FlowFooter>
      </form>
    </IrShell>
  );
}

const meta = {
  title: "Screens/Impact and Recognition/New request",
  // I&R is the only app on the Fieldtrip colours (its globals.css imports fieldtrip.css).
  globals: { brand: "fieldtrip" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A Head proposing a promotion: the details step, with the summary reviewers will read beside it. */
export const Default: Story = { render: () => <NewRequest /> };

/** "Review request" on an incomplete proposal: every missing field says what it needs. */
export const ValidationErrors: Story = {
  render: () => <NewRequest filled={false} issues={REQUEST_ISSUES} />,
};
