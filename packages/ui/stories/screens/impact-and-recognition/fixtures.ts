// Synthetic data in the shape of Impact & Recognition's design fixtures (src/app/design/_fixtures.ts).
// Names, pay and dates are fictional.

export type RequestStatus =
  | "draft"
  | "people_review"
  | "changes_requested"
  | "finance_review"
  | "approved"
  | "released"
  | "communicated"
  | "applied"
  | "withdrawn"
  | "closed";

export type Holder = "people" | "finance" | "requester" | "none";

export const REQUEST_HOLDER: Record<RequestStatus, Holder> = {
  draft: "requester",
  people_review: "people",
  changes_requested: "requester",
  finance_review: "finance",
  approved: "people",
  released: "requester",
  communicated: "people",
  applied: "none",
  withdrawn: "none",
  closed: "none",
};

export const STATUS_LABEL: Record<RequestStatus, string> = {
  draft: "Draft",
  people_review: "People review",
  changes_requested: "Changes requested",
  finance_review: "Finance approval",
  approved: "Approved",
  released: "Ready to share",
  communicated: "Shared",
  applied: "Applied in Deel",
  withdrawn: "Withdrawn",
  closed: "Closed",
};

// I&R's --color-turn-* tokens are the Fieldtrip sky, yellow and mauve. The Fieldtrip brand layer
// defines them; the neutral Storybook theme does not, so each falls back to the same value.
export const HOLDER_COLOR: Record<Holder, string | undefined> = {
  people: "var(--color-fieldtrip-sky, #46bdf0)",
  finance: "var(--color-fieldtrip-yellow, #f9d317)",
  requester: "var(--color-fieldtrip-mauve, #b398ad)",
  none: undefined,
};

/** The holder's light tint, for the head of a draft's summary panel. */
export const REQUESTER_TINT =
  "color-mix(in oklch, var(--color-fieldtrip-mauve-light, #e1d6de) 58%, var(--card))";

export type Pay = { amount: number; currency: string; frequency: "annual" | "hourly" };

const pay = (amount: number, currency = "USD", frequency: Pay["frequency"] = "annual"): Pay => ({
  amount,
  currency,
  frequency,
});

export function formatMoney({ amount, currency, frequency }: Pay) {
  const showCents = frequency === "hourly" || !Number.isInteger(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const percentChange = (current: Pay, proposed: Pay) =>
  ((proposed.amount - current.amount) / current.amount) * 100;

export function formatPercentChange(percent: number) {
  const rounded = Math.round(percent * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}

const HOURS_A_YEAR = 40 * 52;

/** The yearly cost of the change; hourly pay counts as 40 hours a week. */
export const annualCost = ({
  current,
  proposed,
}: Pick<IrRequest, "current" | "proposed">): Pay => ({
  amount: (proposed.amount - current.amount) * (proposed.frequency === "hourly" ? HOURS_A_YEAR : 1),
  currency: proposed.currency,
  frequency: "annual",
});

export const formatIncrease = (cost: Pay) => `+${formatMoney(cost)}`;

/** What a yearly cost adds from its effective date to the end of that year, by the month. */
export function effectiveYearCost(cost: Pay, effective: string): Pay {
  const date = new Date(effective);
  const month = date.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(date.getUTCFullYear(), month + 1, 0)).getUTCDate();
  const monthsLeft = 12 - month - (date.getUTCDate() - 1) / daysInMonth;
  return { ...cost, amount: Math.round((cost.amount * monthsLeft) / 12) };
}

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const longDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export const formatShortDate = (iso: string) => shortDate.format(new Date(iso));
export const formatDate = (iso: string) => longDate.format(new Date(iso));
export const formatDays = (count: number) => `${count} ${count === 1 ? "day" : "days"}`;

export const LONG_WAIT_DAYS = 7;

export const ROUND = {
  name: "H1 2027 cycle",
  submitBy: "2027-04-30",
  effective: "2027-07-01",
  nextOpens: "2027-09-01",
};

export type PersonSummary = { name: string; title: string; level: string; department: string };

export type EligibilityResult = "met" | "not_met" | "needs_verification" | "exception";

export type EligibilityCheck = {
  label: string;
  result: EligibilityResult;
  detail: string;
  requirement?: string;
};

export type CaseEvent = { id: string; at: string; actor: string; summary: string; note?: string };

export type IrRequest = {
  id: string;
  reference: string;
  kind: "increase" | "promotion";
  status: RequestStatus;
  person: PersonSummary;
  requester: string;
  manager: string;
  current: Pay;
  proposed: Pay;
  proposedTitle?: string;
  proposedLevel?: string;
  waitingDays?: number;
  submittedAt?: string;
  closedOn?: string;
  version: number;
  justification: string;
  guidance: { maxPercent: number; label: string };
  band?: { level: string; min: Pay; max: Pay };
  checks: EligibilityCheck[];
  events: CaseEvent[];
};

export const VIEWERS = {
  manager: { name: "Maya Bennett", email: "maya.bennett@inbeat.agency" },
  head: { name: "Jordan Reed", email: "jordan.reed@inbeat.agency" },
  people: { name: "Priya Shah", email: "priya.shah@inbeat.agency" },
  finance: { name: "Harper Cole", email: "harper.cole@inbeat.agency" },
};

const PRIYA = VIEWERS.people.name;
const HARPER = VIEWERS.finance.name;

const person = (name: string, title: string, level: string, department: string) => ({
  name,
  title,
  level,
  department,
});

const checks = (rating: string, tenure: string, lastRaise = "Jul 2025"): EligibilityCheck[] => [
  { label: "Time at company", result: "met", detail: tenure, requirement: "Needs 6 months" },
  { label: "Last raise", result: "met", detail: lastRaise, requirement: "Needs 12 months since" },
  { label: "Rating", result: "met", detail: rating, requirement: "Verified by People in Windmill" },
  { label: "Contract", result: "met", detail: "Employee" },
];

const formatPercent = (value: number) => `${Number(value.toFixed(1))}%`;

function bandCheck({ band, proposed }: IrRequest): EligibilityCheck {
  const label = "Pay band";
  if (!band) return { label, result: "needs_verification", detail: "No band" };
  const position =
    ((proposed.amount - band.min.amount) / (band.max.amount - band.min.amount)) * 100;
  if (position < 0) return { label, result: "not_met", detail: `Below ${band.level} min` };
  if (position > 100) return { label, result: "not_met", detail: `Above ${band.level} max` };
  return { label, result: "met", detail: `Inside ${band.level}` };
}

/** The eligibility checks, then whether the change fits its guideline and the new pay its band. */
export function policyChecks(request: IrRequest): EligibilityCheck[] {
  const change = percentChange(request.current, request.proposed);
  const { guidance } = request;
  return [
    ...request.checks,
    {
      label: request.kind === "promotion" ? "Promotion" : "Increase",
      result: change > guidance.maxPercent ? "not_met" : "met",
      detail: `${formatPercent(change)} of ${guidance.maxPercent}% max`,
      requirement: `Guidelines: ${guidance.label}`,
    },
    bandCheck(request),
  ];
}

const INCREASE_GUIDANCE = {
  3: { maxPercent: 7, label: "5–7% for Delivering Impact (3)" },
  4: { maxPercent: 10, label: "7–10% for Raising the Bar (4)" },
} as const;

type RequestSpec = Omit<IrRequest, "version" | "manager" | "guidance" | "checks" | "events"> &
  Partial<Pick<IrRequest, "version" | "manager" | "guidance" | "checks" | "events">>;

const request = (spec: RequestSpec): IrRequest => ({
  version: 1,
  manager: spec.requester,
  guidance: INCREASE_GUIDANCE[3],
  checks: checks("Delivering Impact (3)", "3 yrs 2 mo"),
  events: spec.submittedAt
    ? [
        {
          id: "submitted",
          at: spec.submittedAt,
          actor: spec.requester,
          summary: `submitted the ${spec.kind}`,
        },
      ]
    : [],
  ...spec,
});

const MAYA = VIEWERS.manager.name;

export const BEN_RETURN =
  "11% is above the 7–10% guidance for a 4. Bring it to 10%, or add what makes this exceptional; the calibration notes in Windmill would help.";

export const ben = request({
  id: "ir-099",
  reference: "IR-099",
  kind: "increase",
  status: "changes_requested",
  person: person("Ben Okafor", "Motion Designer", "IC3", "Creative"),
  requester: MAYA,
  current: pay(70_000),
  proposed: pay(77_700),
  waitingDays: 1,
  submittedAt: "2027-04-03",
  guidance: INCREASE_GUIDANCE[4],
  band: { level: "IC3", min: pay(62_000), max: pay(84_000) },
  checks: checks("Raising the Bar (4)", "5 yrs 5 mo"),
  justification:
    "Ben built our motion system from scratch and now ships every launch film in-house, which saved two agency contracts this half.",
  events: [
    { id: "submitted", at: "2027-04-03", actor: MAYA, summary: "submitted the increase" },
    {
      id: "returned",
      at: "2027-04-10",
      actor: PRIYA,
      summary: "asked for changes",
      note: BEN_RETURN,
    },
  ],
});

const hugo = request({
  id: "ir-110",
  reference: "IR-110",
  kind: "increase",
  status: "draft",
  person: person("Hugo Laurent", "Copywriter", "IC2", "Creative"),
  requester: MAYA,
  current: pay(58_000),
  proposed: pay(61_480),
  justification:
    "Hugo wrote the Northwind launch campaign end to end and now leads copy reviews for the team.",
});

export const noor = request({
  id: "ir-090",
  reference: "IR-090",
  kind: "increase",
  status: "released",
  person: person("Noor Malik", "Designer", "IC2", "Creative"),
  requester: MAYA,
  current: pay(57_000),
  proposed: pay(61_560),
  waitingDays: 3,
  submittedAt: "2027-03-16",
  guidance: INCREASE_GUIDANCE[4],
  justification:
    "Noor redesigned the Halden product pages, which lifted their sign-ups by a third, and runs our design critiques.",
});

const mei = request({
  id: "ir-100",
  reference: "IR-100",
  kind: "increase",
  status: "people_review",
  person: person("Mei Tanaka", "Illustrator", "IC2", "Creative"),
  requester: MAYA,
  current: pay(56_500),
  proposed: pay(59_890),
  waitingDays: 4,
  submittedAt: "2027-04-06",
  justification:
    "Mei illustrated the full Brightwater campaign and built the shared library every designer now draws from.",
});

export const aisha = request({
  id: "ir-101",
  reference: "IR-101",
  kind: "increase",
  status: "finance_review",
  person: person("Aisha Grant", "Senior Designer", "IC3", "Creative"),
  requester: MAYA,
  current: pay(68_000),
  proposed: pay(72_080),
  waitingDays: 2,
  submittedAt: "2027-04-05",
  band: { level: "IC3", min: pay(62_000), max: pay(84_000) },
  checks: checks("Delivering Impact (3)", "6 yrs"),
  justification:
    "Aisha took over the Halden account mid-cycle and kept it on schedule through two rebrands. She is steady, mentors our juniors and her work is consistently what clients sign off first.",
  events: [
    { id: "submitted", at: "2027-04-05", actor: MAYA, summary: "submitted the increase" },
    { id: "verified", at: "2027-04-09", actor: PRIYA, summary: "verified and sent to Finance" },
  ],
});

const nina = request({
  id: "ir-071",
  reference: "IR-071",
  kind: "increase",
  status: "applied",
  person: person("Nina Petrova", "Designer", "IC2", "Creative"),
  requester: MAYA,
  current: pay(55_000),
  proposed: pay(58_300),
  closedOn: "2027-04-02",
  justification: "Nina took on the Halden social templates and ships them weekly without a miss.",
});

const theo = request({
  id: "ir-084",
  reference: "IR-084",
  kind: "increase",
  status: "withdrawn",
  person: person("Theo Lambert", "Junior Designer", "IC1", "Creative"),
  requester: MAYA,
  current: pay(46_000),
  proposed: pay(48_760),
  closedOn: "2027-03-29",
  justification: "Theo picked up production design for two client pods within his first months.",
});

/** Maya's requests this round: the requester's inbox. */
export const MY_REQUESTS: IrRequest[] = [ben, hugo, noor, mei, aisha, nina, theo];

/** Requests from earlier rounds, for the "All rounds" count. */
export const PAST_ROUND_REQUESTS = 8;

export type CaseGroup = {
  key: string;
  title: string;
  holder: Holder;
  yours: boolean;
  cases: IrRequest[];
};

const REQUESTER_GROUPS: { key: string; title: string; statuses: RequestStatus[] }[] = [
  { key: "submit", title: "To submit", statuses: ["draft"] },
  { key: "revise", title: "To revise", statuses: ["changes_requested"] },
  { key: "share", title: "To share", statuses: ["released"] },
  { key: "people", title: "With People", statuses: ["people_review", "approved", "communicated"] },
  { key: "finance", title: "With Finance", statuses: ["finance_review"] },
];

export function requesterGroups(cases: IrRequest[]): CaseGroup[] {
  return REQUESTER_GROUPS.map(({ statuses, ...group }) => {
    const holder = REQUEST_HOLDER[statuses[0] ?? "draft"];
    return {
      ...group,
      holder,
      yours: holder === "requester",
      cases: cases.filter((entry) => statuses.includes(entry.status)),
    };
  }).filter((group) => group.cases.length > 0);
}

export const closedCases = (cases: IrRequest[]) =>
  cases.filter((entry) => REQUEST_HOLDER[entry.status] === "none");

const CLOSED_WORD: Partial<Record<RequestStatus, string>> = {
  applied: "Applied",
  withdrawn: "Withdrawn",
  closed: "Closed",
};

/** The row's right-hand text: on the viewer's turn the deadline or wait; otherwise who holds it. */
export function requesterAside(entry: IrRequest) {
  const holder = REQUEST_HOLDER[entry.status];
  if (holder === "none")
    return `${CLOSED_WORD[entry.status] ?? ""} ${formatShortDate(entry.closedOn ?? "")}`;
  if (holder === "people") return PRIYA;
  if (holder === "finance") return HARPER;
  if (entry.status === "draft" || entry.status === "changes_requested") {
    return `Due ${formatShortDate(ROUND.submitBy)}`;
  }
  return formatDays(entry.waitingDays ?? 0);
}

const luca = request({
  id: "ir-102",
  reference: "IR-102",
  kind: "increase",
  status: "finance_review",
  person: person("Luca Bianchi", "Art Director", "IC4", "Creative"),
  requester: VIEWERS.head.name,
  current: pay(86_000),
  proposed: pay(93_740),
  waitingDays: 1,
  version: 2,
  justification:
    "Luca art-directed the Northwind and Halden launches back to back and now reviews every campaign before it reaches the client.",
});

const ava = request({
  id: "ir-103",
  reference: "IR-103",
  kind: "increase",
  status: "finance_review",
  person: person("Ava Lindqvist", "Retoucher (contractor)", "IC2", "Production"),
  requester: "Kai Brennan",
  current: pay(45, "USD", "hourly"),
  proposed: pay(48.5, "USD", "hourly"),
  waitingDays: 2,
  justification:
    "Ava retouches every Production shoot and trained the two freelancers who cover launches. Her rate has not moved since she joined the retainer.",
});

const marta = request({
  id: "ir-105",
  reference: "IR-105",
  kind: "increase",
  status: "finance_review",
  person: person("Marta Ruiz", "Senior Strategist", "IC4", "Strategy"),
  requester: "Omar Haddad",
  current: pay(62_000, "EUR"),
  proposed: pay(66_960, "EUR"),
  waitingDays: 4,
  version: 2,
  justification:
    "Marta runs strategy for our two largest retainers and trained the three strategists who joined this year.",
});

const felix = request({
  id: "ir-107",
  reference: "IR-107",
  kind: "increase",
  status: "finance_review",
  person: person("Felix Wagner", "Strategist", "IC3", "Strategy"),
  requester: "Omar Haddad",
  current: pay(51_000, "EUR"),
  proposed: pay(54_570, "EUR"),
  waitingDays: 1,
  justification:
    "Felix took over the quarterly market reports and turned them into a product two clients now pay for.",
});

export const nadia = request({
  id: "ir-108",
  reference: "IR-108",
  kind: "increase",
  status: "finance_review",
  person: person("Nadia Rahman", "Account Director", "IC5", "Client Services"),
  requester: "Rosa Delgado",
  current: pay(96_000, "CAD"),
  proposed: pay(105_600, "CAD"),
  waitingDays: 3,
  guidance: INCREASE_GUIDANCE[4],
  justification:
    "Nadia renewed Halden for three years and brought in Brightwater, our largest new client this year.",
});

const oliver = request({
  id: "ir-109",
  reference: "IR-109",
  kind: "increase",
  status: "finance_review",
  person: person("Oliver Hughes", "Office Manager", "IC3", "Operations"),
  requester: "Ruth Adler",
  current: pay(44_000, "GBP"),
  proposed: pay(47_080, "GBP"),
  waitingDays: 5,
  justification:
    "Oliver moved the London office without a day of downtime and now runs onboarding for every new hire.",
});

const lena = request({
  id: "ir-088",
  reference: "IR-088",
  kind: "increase",
  status: "approved",
  person: person("Lena Fischer", "Producer", "IC2", "Production"),
  requester: "Kai Brennan",
  current: pay(41_000, "GBP"),
  proposed: pay(43_460, "GBP"),
  closedOn: "2027-04-06",
  justification:
    "Lena now runs production for two client pods on her own and has cut our average turnaround by a week.",
});

export type Blocker = "own_request" | "over_budget" | "budget_not_set";

export const BLOCKER_LABEL: Record<Blocker, string> = {
  own_request: "Own request",
  over_budget: "Needs exception",
  budget_not_set: "No budget",
};

export type FinanceRow = { request: IrRequest; blocker?: Blocker; changed?: boolean };

export const FINANCE_QUEUE: FinanceRow[] = [
  { request: aisha },
  { request: luca, changed: true },
  { request: ava },
  { request: marta },
  { request: felix },
  { request: nadia, blocker: "over_budget" },
  { request: oliver, blocker: "budget_not_set" },
];

export const FINANCE_APPROVED: IrRequest[] = [lena];

/** Finance approves per department budget, so its queue groups by department. */
export function byDepartment(rows: FinanceRow[]) {
  const departments = [...new Set(rows.map((row) => row.request.person.department))];
  return departments.map((department) => ({
    department,
    rows: rows.filter((row) => row.request.person.department === department),
  }));
}

export const AISHA_BUDGET = {
  department: "Creative",
  currency: "USD",
  yearly: pay(90_000),
  leftNow: pay(67_400),
};

export type QueueRow = {
  id: string;
  name: string;
  department: string;
  kind: "Increase" | "Promotion";
  change: string;
  requester: string;
  waitingDays: number;
};

const row = (
  id: string,
  name: string,
  department: string,
  change: string,
  requester: string,
  waitingDays: number,
  kind: QueueRow["kind"] = "Increase",
): QueueRow => ({ id, name, department, kind, change, requester, waitingDays });

export type QueueGroup = {
  key: string;
  title: string;
  holder: Holder;
  yours: boolean;
  rows: QueueRow[];
};

export const PEOPLE_QUEUE: QueueGroup[] = [
  {
    key: "verify",
    title: "To verify",
    holder: "people",
    yours: true,
    rows: [
      row("ir-097", "Sofia Reyes", "Strategy", "+8%", "Omar Haddad", 9),
      row("ir-104", "Tomás Silva", "Creative", "+10%", "Jordan Reed", 3, "Promotion"),
      row("ir-100", "Mei Tanaka", "Creative", "+6%", "Maya Bennett", 4),
      row("ir-111", "Clara Moreau", "Production", "+7%", "Kai Brennan", 2),
    ],
  },
  {
    key: "release",
    title: "To release",
    holder: "people",
    yours: true,
    rows: [row("ir-088", "Lena Fischer", "Production", "+6%", "Kai Brennan", 6)],
  },
  {
    key: "record",
    title: "To record in Deel",
    holder: "people",
    yours: true,
    rows: [row("ir-091", "Iris Novak", "Creative", "+9%", "Jordan Reed", 8)],
  },
  {
    key: "finance",
    title: "With Finance",
    holder: "finance",
    yours: false,
    rows: [
      row("ir-101", "Aisha Grant", "Creative", "+6%", "Maya Bennett", 2),
      row("ir-102", "Luca Bianchi", "Creative", "+9%", "Jordan Reed", 1),
      row("ir-105", "Marta Ruiz", "Strategy", "+8%", "Omar Haddad", 4),
      row("ir-108", "Nadia Rahman", "Client Services", "+10%", "Rosa Delgado", 3),
    ],
  },
  {
    key: "requesters",
    title: "With requesters",
    holder: "requester",
    yours: false,
    rows: [
      row("ir-099", "Ben Okafor", "Creative", "+11%", "Maya Bennett", 1),
      row("ir-090", "Noor Malik", "Creative", "+8%", "Maya Bennett", 3),
    ],
  },
];

export type PersonInScope = {
  name: string;
  department: string;
  manager: string;
  eligibility: EligibilityResult;
  request?: RequestStatus;
};

const inScope = (
  name: string,
  department: string,
  manager: string,
  eligibility: EligibilityResult,
  status?: RequestStatus,
): PersonInScope => ({ name, department, manager, eligibility, request: status });

export const PEOPLE_IN_SCOPE: PersonInScope[] = [
  inScope("Rafael Costa", "Creative", "Maya Bennett", "needs_verification"),
  inScope("Grace Liu", "Production", "Kai Brennan", "needs_verification"),
  inScope("Sofia Reyes", "Strategy", "Omar Haddad", "met", "people_review"),
  inScope("Aisha Grant", "Creative", "Maya Bennett", "met", "finance_review"),
  inScope("Hana Sato", "Strategy", "Omar Haddad", "met"),
  inScope("Daniel Kim", "Client Services", "Rosa Delgado", "met"),
  inScope("Zoe Adams", "Production", "Kai Brennan", "met"),
  inScope("Lucas Brandt", "Creative", "Tomás Silva", "not_met"),
  inScope("Mateo Vargas", "Creative", "Tomás Silva", "not_met"),
];

export const ELIGIBILITY_GROUPS: { key: string; title: string; states: EligibilityResult[] }[] = [
  { key: "verify", title: "Needs verification", states: ["needs_verification"] },
  { key: "eligible", title: "Eligible", states: ["met", "exception"] },
  { key: "not", title: "Not eligible", states: ["not_met"] },
];

export const TOMAS = {
  person: person("Tomás Silva", "Design Lead", "TL1", "Creative"),
  current: pay(72_000),
  proposed: pay(79_200),
  justification:
    "Tomás has run the design team since January: he hired two designers, owns the brand system rebuild and led the Northwind launch. The Head of Design role is already his in practice; this makes his title and pay match the work.",
  jobDescription: "https://www.notion.so/fieldtrip/head-of-design",
  band: { level: "TL2", min: pay(78_000), max: pay(100_000) },
  /** The new pay lands in the TL2 band's first third. */
  guidance: { maxPercent: 15, label: "up to 15% for a promotion in the first tercile" },
};

export const PROMOTION_LEVELS = ["TL2", "TL3"];

export const RATINGS = [
  { value: "1", label: "Off Track (1)" },
  { value: "2", label: "Room for Improvement (2)" },
  { value: "3", label: "Delivering Impact (3)" },
  { value: "4", label: "Raising the Bar (4)" },
];

export const KIND_OPTIONS = [
  { value: "increase", label: "Increase", hint: "Same role, higher pay" },
  { value: "promotion", label: "Promotion", hint: "New level and title" },
];

export const REQUEST_ISSUES = {
  proposedTitle: "Add the new title.",
  jobDescriptionUrl: "Add a link to the job description.",
  proposed: "Enter a pay increase.",
  justification: "Add a reason.",
  declared: "Confirm the reviews are complete in Windmill.",
};
