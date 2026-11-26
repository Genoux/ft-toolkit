import {
  ChevronRight,
  CircleCheck,
  CircleDashed,
  CircleX,
  Clock,
  type LucideIcon,
  Settings,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { AppShell, AppShellNav, AppShellTitle } from "../../../src/components/app-shell";
import { CardAction, CardHeader, CardSection, CardTitle } from "../../../src/components/card";
import { DataTableShell } from "../../../src/components/data-table-shell";
import { DropdownMenuItem } from "../../../src/components/dropdown-menu";
import { IconButton } from "../../../src/components/icon-button";
import { InfoHint } from "../../../src/components/info-hint";
import { Inline } from "../../../src/components/layout";
import { NavUser } from "../../../src/components/nav-user";
import { PagePager, PageToolbar } from "../../../src/components/page";
import { PersonIdentity } from "../../../src/components/person-identity";
import { SearchInput } from "../../../src/components/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../src/components/select";
import { Skeleton } from "../../../src/components/skeleton";
import { StatusDot } from "../../../src/components/status-dot";
import {
  Table,
  TableBody,
  TableCell,
  TableGroupRow,
  TableHead,
  TableHeader,
  type TableHideBelow,
  TableRow,
} from "../../../src/components/table";
import { Tooltip } from "../../../src/components/tooltip";
import { cn } from "../../../src/lib/utils";
import {
  type CaseGroup,
  type EligibilityCheck,
  type EligibilityResult,
  formatMoney,
  formatPercentChange,
  HOLDER_COLOR,
  type Holder,
  type IrRequest,
  LONG_WAIT_DAYS,
  type Pay,
  percentChange,
  ROUND,
  VIEWERS,
} from "../../lib/impact-and-recognition-fixtures";

type Role = keyof typeof VIEWERS;

type Section = "Home" | "My requests" | "Control Room" | "Approvals" | "Budget";

const SECTIONS: Record<Role, Section[]> = {
  manager: ["Home", "My requests"],
  head: ["Home", "My requests"],
  people: ["Home", "Control Room"],
  finance: ["Home", "Approvals", "Budget"],
};

const renderLink = (_item: { title: string }, content: ReactNode) => (
  <a href="#section">{content}</a>
);

/** Stable keys for placeholder rows. */
export const placeholderKeys = (count: number) =>
  ["first", "second", "third", "fourth", "fifth", "sixth"].slice(0, count);

type IrShellProps = { viewer: Role; active: Section; children: ReactNode };

/** I&R's app bar: brand, the viewer's sections, the cycle's step, Settings for People, the account. */
export function IrShell({ viewer: role, active, children }: IrShellProps) {
  const viewer = VIEWERS[role];
  return (
    <AppShell
      layout="topbar"
      topbarBrand={<AppShellTitle>Impact & Recognition</AppShellTitle>}
      topbarNav={
        <AppShellNav
          items={SECTIONS[role].map((title) => ({ title, isActive: title === active }))}
          renderLink={renderLink}
        />
      }
      topbarActions={
        <>
          {/* toolkit-gap: the bar has no slot for a status note; a StatusDot stands in for I&R's RoundNote. */}
          <StatusDot
            tone="success"
            label={`${ROUND.name}: Requests`}
            className="mr-2 hidden text-sm text-muted-foreground lg:inline-flex"
          />
          {role === "people" ? (
            <IconButton label="Settings" variant="ghost" size="icon-sm">
              <Settings />
            </IconButton>
          ) : null}
          <NavUser
            variant="avatar"
            showName
            name={viewer.name}
            email={viewer.email}
            onSignOut={() => {}}
          >
            <DropdownMenuItem>
              <UserRound />
              Manage account
            </DropdownMenuItem>
          </NavUser>
        </>
      }
    >
      {children}
    </AppShell>
  );
}

/** A case page steps through the list it was opened from. */
export function CasePager({ position, total }: { position: number; total: number }) {
  return (
    <PagePager
      aria-label="Requests"
      position={position}
      total={total}
      previousLabel="Previous request"
      nextLabel="Next request"
      onPrevious={() => {}}
      onNext={() => {}}
    />
  );
}

/** A fact on a request's receipt. */
export type ReceiptRow = { label: string; value: ReactNode };

const CHECK_MARK: Record<EligibilityResult, { label: string; icon: LucideIcon; tone: string }> = {
  met: { label: "Met", icon: CircleCheck, tone: "text-success" },
  not_met: { label: "Not met", icon: CircleX, tone: "text-warning" },
  needs_verification: { label: "To verify", icon: CircleDashed, tone: "text-info" },
  exception: { label: "Exception review", icon: TriangleAlert, tone: "text-warning" },
};

/** Policy checks, one line each: the result's mark in its colour, the check with its rule behind an info mark, then its value. */
export function PolicyChecks({ checks }: { checks: EligibilityCheck[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {checks.map((check) => {
        const mark = CHECK_MARK[check.result];
        const notMet = check.result === "not_met";
        return (
          <li
            key={check.label}
            className="grid grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-x-3 text-sm"
          >
            <mark.icon aria-hidden className={cn("size-4", mark.tone)} />
            <span className="flex min-w-0 items-center gap-1">
              <span className="truncate">{check.label}</span>
              {check.requirement ? (
                <InfoHint label={`What ${check.label.toLowerCase()} needs`}>
                  {check.requirement}
                </InfoHint>
              ) : null}
            </span>
            <span
              className={cn(
                "text-right tabular-nums",
                check.result === "met" && "text-muted-foreground",
                notMet && "font-medium text-warning-foreground",
              )}
            >
              <span className="sr-only">{mark.label}: </span>
              {check.detail}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** One titled part of a side card: its title as the card's, quiet text at the right, then its content. */
export function PanelSection({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <CardSection>
      <CardHeader>
        <CardTitle role="heading" aria-level={3}>
          {title}
        </CardTitle>
        {aside ? (
          <CardAction className="gap-1 text-sm text-muted-foreground">{aside}</CardAction>
        ) : null}
      </CardHeader>
      {children}
    </CardSection>
  );
}

type Band = NonNullable<IrRequest["band"]>;

/** Room past the outermost mark, in band percent, so a mark outside the band never sits on the end. */
const OVERFLOW_MARGIN = 8;

const bandPercent = (pay: Pay, band: Band) =>
  ((pay.amount - band.min.amount) / (band.max.amount - band.min.amount)) * 100;

/** Keeps a label over its value without running past the track's ends. */
const anchor = (left: number) =>
  left < 12 ? "translate-x-0" : left > 88 ? "-translate-x-full" : "-translate-x-1/2";

function ScaleLabel({ at, children }: { at: number; children: ReactNode }) {
  return (
    <span
      style={{ left: `${at}%` }}
      className={cn(
        "absolute top-0 text-sm whitespace-nowrap text-muted-foreground tabular-nums",
        anchor(at),
      )}
    >
      {children}
    </span>
  );
}

function ScaleMark({ at, hint, className }: { at: number; hint: string; className: string }) {
  return (
    <Tooltip content={hint}>
      <button
        type="button"
        aria-label={hint}
        style={{ left: `clamp(10px, ${at}%, calc(100% - 10px))` }}
        className="absolute top-1/2 grid size-8 -translate-1/2 place-items-center rounded-full outline-none focus-visible:focus-ring"
      >
        <span aria-hidden className={cn("rounded-full ring-3 ring-card", className)} />
      </button>
    </Tooltip>
  );
}

type BandScaleProps = { band: Band; current: Pay; proposed: Pay; labels?: boolean };

/**
 * The level's pay band drawn to scale in its three thirds: the proposal named over its mark (green
 * inside the band, amber outside), today's pay under its own, the move between them in its colour.
 */
// toolkit-gap: no scale or range track (segments, a range and marks placed by value); Meter is a
// single fill. Composed from tokens.
// signature-surface: I&R's pay band in thirds, the unit the promotion guidelines speak in.
export function BandScale({ band, current, proposed, labels = true }: BandScaleProps) {
  const proposedAt = bandPercent(proposed, band);
  const currentAt = bandPercent(current, band);
  const from = Math.min(0, proposedAt, currentAt);
  const to = Math.max(100, proposedAt, currentAt);
  const start = from < 0 ? from - OVERFLOW_MARGIN : 0;
  const end = to > 100 ? to + OVERFLOW_MARGIN : 100;
  const place = (value: number) => ((value - start) / (end - start)) * 100;
  const inBand = proposedAt >= 0 && proposedAt <= 100;
  const segments = [
    { key: "below", weight: -start, className: "bg-foreground/3" },
    { key: "first", weight: 100 / 3, className: "bg-foreground/7" },
    { key: "second", weight: 100 / 3, className: "bg-foreground/11" },
    { key: "third", weight: 100 / 3, className: "bg-foreground/15" },
    { key: "above", weight: end - 100, className: "bg-foreground/3" },
  ].filter((segment) => segment.weight > 0);
  const [low, high] = [place(currentAt), place(proposedAt)].toSorted((a, b) => a - b);
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="sr-only">
        {band.level} band from {formatMoney(band.min)} to {formatMoney(band.max)}
      </figcaption>
      <div className="relative flex h-8 items-center">
        <span aria-hidden className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full">
          {segments.map((segment) => (
            <span
              key={segment.key}
              style={{ flexGrow: segment.weight }}
              className={cn("min-w-0 basis-0", segment.className)}
            />
          ))}
        </span>
        <span
          aria-hidden
          style={{ left: `${low}%`, width: `${(high ?? 0) - (low ?? 0)}%` }}
          className={cn(
            "absolute top-1/2 h-3 -translate-y-1/2 rounded-full",
            inBand ? "bg-success/45" : "bg-warning/45",
          )}
        />
        <ScaleMark
          at={place(currentAt)}
          hint={`Now: ${formatMoney(current)}`}
          className="size-3.5 border-2 border-foreground/60 bg-card"
        />
        <ScaleMark
          at={place(proposedAt)}
          hint={`Proposed: ${formatMoney(proposed)}`}
          className={cn("size-5", inBand ? "bg-success" : "bg-warning")}
        />
      </div>
      <div aria-hidden className="relative h-6">
        <ScaleLabel at={place(0)}>
          Minimum <span className="font-medium text-foreground">{formatMoney(band.min)}</span>
        </ScaleLabel>
        <ScaleLabel at={place(100)}>
          Maximum <span className="font-medium text-foreground">{formatMoney(band.max)}</span>
        </ScaleLabel>
      </div>
      {labels ? (
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2.5 rounded-full border-2 border-foreground/60 bg-card"
            />
            Now <span className="font-medium text-foreground">{formatMoney(current)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn("size-2.5 rounded-full", inBand ? "bg-success" : "bg-warning")}
            />
            Proposed{" "}
            <span
              className={cn(
                "font-medium",
                inBand ? "text-success-foreground" : "text-warning-foreground",
              )}
            >
              {formatMoney(proposed)}
            </span>
          </span>
        </p>
      ) : null}
    </figure>
  );
}

type FilterOption = { value: string; label: string };

/** A select that filters a list, labelled for screen readers by what it filters. */
export function FilterSelect({ label, options }: { label: string; options: FilterOption[] }) {
  const [value, setValue] = useState(options[0]?.value);
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger aria-label={label} className="w-full sm:w-auto">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** "All …" first, then each value as its own option. */
export const allOf = (label: string, values: string[]): FilterOption[] => [
  { value: "all", label },
  ...values.map((value) => ({ value, label: value })),
];

export const KIND_FILTER = {
  label: "Kind",
  options: [
    { value: "all", label: "All kinds" },
    { value: "increase", label: "Increases" },
    { value: "promotion", label: "Promotions" },
  ],
};

/** The one row above a full-width list: an optional search, its filters, the primary action at the end. */
export function ListFilters({
  searchLabel,
  filters = [],
  action,
}: {
  searchLabel?: string;
  filters?: { label: string; options: FilterOption[] }[];
  /** The page's primary action, pushed to the end of the row. */
  action?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  return (
    <PageToolbar>
      {searchLabel ? (
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={searchLabel}
          aria-label={searchLabel}
          className="w-full sm:w-96"
        />
      ) : null}
      {filters.map((filter) => (
        <FilterSelect key={filter.label} label={filter.label} options={filter.options} />
      ))}
      {action ? <Inline className="ml-auto">{action}</Inline> : null}
    </PageToolbar>
  );
}

/** A wait this long on the viewer's own turn is flagged. */
export function WaitAside({ late, children }: { late: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm whitespace-nowrap tabular-nums",
        late ? "font-medium text-warning-foreground" : "text-muted-foreground",
      )}
    >
      {late ? <Clock aria-hidden className="size-3.5" /> : null}
      {children}
    </span>
  );
}

export const isLate = (entry: IrRequest, yours: boolean) =>
  yours && (entry.waitingDays ?? 0) >= LONG_WAIT_DAYS;

/**
 * One column of the case tables: its header, the width it asks for and its cell. Every column reads
 * from the left, as in I&R's queue, so a row never splits into a left and a right cluster.
 */
export type CaseColumn = {
  key: string;
  /** The header; a function gets the table's open requests, for a select-all checkbox over them. */
  label: ReactNode | ((cases: IrRequest[]) => ReactNode);
  hideBelow?: TableHideBelow;
  /** Applied to the header and every cell, for the column's width; columns without one share what is left. */
  className?: string;
  cell: (entry: IrRequest, yours: boolean) => ReactNode;
};

/** A column with its share of the row on this screen. */
export const sized = (column: CaseColumn, className: string): CaseColumn => ({
  ...column,
  className: cn(column.className, className),
});

const roleLine = (entry: IrRequest) =>
  entry.kind === "promotion"
    ? `Promotion to ${entry.proposedTitle}, ${entry.proposedLevel}`
    : `${entry.person.title}, ${entry.person.level}`;

/** The person and their role on two lines; the name's link covers the whole row, so the row opens the request. */
export const personColumn: CaseColumn = {
  key: "person",
  label: "Person",
  cell: (entry) => {
    const inactive = entry.status === "withdrawn" || entry.status === "closed";
    return (
      <a
        href="#request"
        className="block min-w-0 outline-none after:absolute after:inset-0 focus-visible:after:focus-ring-inset"
      >
        <PersonIdentity
          name={entry.person.name}
          size="md"
          className={cn(
            "max-sm:[&>[data-slot=avatar]]:hidden",
            inactive && "[&_p]:text-muted-foreground",
          )}
          description={roleLine(entry)}
        />
      </a>
    );
  },
};

export const departmentColumn: CaseColumn = {
  key: "department",
  label: "Department",
  hideBelow: "md",
  className: "truncate",
  cell: (entry) => entry.person.department,
};

export const KIND_LABEL: Record<IrRequest["kind"], string> = {
  increase: "Increase",
  promotion: "Promotion",
};

export const requestColumn: CaseColumn = {
  key: "request",
  label: "Request",
  hideBelow: "sm",
  cell: (entry) => KIND_LABEL[entry.kind],
};

export const changeColumn: CaseColumn = {
  key: "change",
  label: "Change",
  cell: (entry) => (
    <span className="font-medium tabular-nums">
      {formatPercentChange(percentChange(entry.current, entry.proposed))}
    </span>
  ),
};

export const requesterColumn: CaseColumn = {
  key: "requester",
  label: "Requested by",
  hideBelow: "md",
  cell: (entry) => <PersonIdentity name={entry.requester} />,
};

/** A group's label in its band: the holder's mark first when the group says whose turn it is. */
export function GroupLabel({ holder, title }: { holder?: Holder; title: string }) {
  if (!holder) return title;
  // signature-surface: I&R's holder colours, the same mark on every list, receipt and step.
  return <StatusDot color={HOLDER_COLOR[holder]} label={title} className="text-sm" />;
}

function CaseTableRow({
  entry,
  yours,
  selected,
  columns,
}: {
  entry: IrRequest;
  yours: boolean;
  selected: boolean;
  columns: CaseColumn[];
}) {
  return (
    <TableRow data-state={selected ? "selected" : undefined} className="relative">
      {columns.map((column) => (
        <TableCell key={column.key} hideBelow={column.hideBelow} className={column.className}>
          {column.cell(entry, yours)}
        </TableCell>
      ))}
    </TableRow>
  );
}

function CaseTableHeader({ columns, cases }: { columns: CaseColumn[]; cases: IrRequest[] }) {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead key={column.key} hideBelow={column.hideBelow} className={column.className}>
            {typeof column.label === "function" ? column.label(cases) : column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

function CaseRows({
  columns,
  cases,
  yours,
  selected,
}: {
  columns: CaseColumn[];
  cases: IrRequest[];
  yours: boolean;
  selected: string[];
}) {
  return cases.map((entry) => (
    <CaseTableRow
      key={entry.id}
      entry={entry}
      yours={yours}
      selected={selected.includes(entry.id)}
      columns={columns}
    />
  ));
}

/** What nobody acts on anymore, the last band, folded until opened. */
function ClosedGroup({
  title,
  cases,
  columns,
}: {
  title: string;
  cases: IrRequest[];
  columns: CaseColumn[];
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <TableBody>
        <TableGroupRow colSpan={columns.length} count={cases.length}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1 rounded-md outline-none focus-visible:focus-ring"
          >
            <ChevronRight
              aria-hidden
              className={cn(
                "size-4 text-muted-foreground transition-transform duration-(--duration-base) ease-out-expo",
                open && "rotate-90",
              )}
            />
            {title}
          </button>
        </TableGroupRow>
      </TableBody>
      <TableBody id={id} hidden={!open}>
        {open ? <CaseRows columns={columns} cases={cases} yours={false} selected={[]} /> : null}
      </TableBody>
    </>
  );
}

/** A group of the case list; `holder` marks its band when the group says whose turn it is. */
export type CaseTableGroup = Omit<CaseGroup, "holder"> & { holder?: Holder };

type CaseTableProps = {
  columns: CaseColumn[];
  groups: CaseTableGroup[];
  /** Requests nobody acts on anymore, folded under the open ones; left out when empty. */
  closed?: IrRequest[];
  /** Finance folds what it already approved as "Approved". */
  closedTitle?: string;
  /** Requests picked for a batch; their rows take the selected tint. */
  selected?: string[];
};

/**
 * The viewer's requests in one table under one header, a band per group: the groups on the
 * viewer's turn first, then the closed ones folded in a last band.
 */
export function CaseTable({
  columns,
  groups,
  closed = [],
  closedTitle = "Closed",
  selected = [],
}: CaseTableProps) {
  const open = groups
    .filter((group) => group.cases.length > 0)
    .toSorted((first, second) => Number(second.yours) - Number(first.yours));
  return (
    <DataTableShell>
      <Table className="table-fixed">
        <CaseTableHeader columns={columns} cases={open.flatMap((group) => group.cases)} />
        {open.map((group) => (
          <TableBody key={group.key}>
            <TableGroupRow colSpan={columns.length} count={group.cases.length}>
              <GroupLabel holder={group.holder} title={group.title} />
            </TableGroupRow>
            <CaseRows
              columns={columns}
              cases={group.cases}
              yours={group.yours}
              selected={selected}
            />
          </TableBody>
        ))}
        {closed.length > 0 ? (
          <ClosedGroup title={closedTitle} cases={closed} columns={columns} />
        ) : null}
      </Table>
    </DataTableShell>
  );
}

/** A table's frame and headers over placeholder rows while the requests load. */
export function CaseTableLoading({ columns, rows = 5 }: { columns: CaseColumn[]; rows?: number }) {
  return (
    <DataTableShell>
      <Table className="table-fixed">
        <CaseTableHeader columns={columns} cases={[]} />
        <TableBody>
          {placeholderKeys(rows).map((key) => (
            <TableRow key={key} data-placeholder>
              {columns.map((column) => (
                <TableCell key={column.key} hideBelow={column.hideBelow}>
                  {column.key === "person" ? (
                    <span className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-full" />
                      <span className="flex flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-44" />
                      </span>
                    </span>
                  ) : column.key === "select" ? (
                    <Skeleton className="size-4 rounded-sm" />
                  ) : (
                    <Skeleton className="h-3.5 w-24" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableShell>
  );
}
