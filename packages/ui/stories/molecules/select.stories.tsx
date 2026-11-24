import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info, Plus } from "lucide-react";
import { useState } from "react";
import { DatePicker } from "../../src/components/date-picker";
import { Field, FieldError, FieldLabel } from "../../src/components/field";
import { IconButton } from "../../src/components/icon-button";
import { MultiSelectPopover } from "../../src/components/multi-select-popover";
import { SearchInput } from "../../src/components/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../../src/components/select";
import { StatusDot } from "../../src/components/status-dot";
import { CONTROL_STATES, stateProps } from "../lib/control-states";
import { DISCOVERY_PRIORITIES, DISCOVERY_STATUSES } from "../lib/form-fixtures";
import { IR_ROLES, POOL_SORT_OPTIONS, PROOF_SCOPE_LANGUAGES } from "../lib/overlay-fixtures";
import { VariantGrid } from "../lib/variant-grid";

const TRIGGER_COLUMNS = ["placeholder", "filled", "sm", "ghost", "badge"] as const;

function PriorityItems() {
  return DISCOVERY_PRIORITIES.map((priority) => (
    <SelectItem key={priority.value} value={priority.value}>
      {priority.label}
    </SelectItem>
  ));
}

function TriggerCell({
  state,
  column,
}: {
  state: (typeof CONTROL_STATES)[number];
  column: (typeof TRIGGER_COLUMNS)[number];
}) {
  const { className, ...props } = stateProps(state);
  const isBadge = column === "badge";
  // A status pill picks from fixed options, so it has no invalid state to show.
  if (isBadge && props["aria-invalid"]) return null;
  const variant = column === "ghost" ? column : "default";
  const hoverClassName = isBadge ? "bg-tone-tint-hover" : "bg-muted";
  const triggerClassName =
    variant === "default" && !isBadge ? className : state === "hover" ? hoverClassName : className;
  const triggerProps = {
    "aria-label": `${state} ${column}`,
    "aria-invalid": props["aria-invalid"],
    className: triggerClassName,
    children: <SelectValue placeholder="Pick a priority" />,
  };
  return (
    <div className="flex flex-col gap-1.5">
      <Select
        defaultValue={column === "placeholder" ? undefined : isBadge ? "done" : "high"}
        disabled={props.disabled}
      >
        {isBadge ? (
          <SelectTrigger variant="badge" tone={DISCOVERY_STATUSES[3].tone} {...triggerProps} />
        ) : (
          <SelectTrigger
            variant={variant}
            size={column === "sm" ? "sm" : "default"}
            {...triggerProps}
          />
        )}
        <SelectContent>
          {isBadge ? (
            DISCOVERY_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))
          ) : (
            <PriorityItems />
          )}
        </SelectContent>
      </Select>
      {state === "invalid" && column === "placeholder" && <FieldError>Pick a priority</FieldError>}
    </div>
  );
}

const meta = {
  title: "Molecules/Select",
  component: Select,
  args: { clearable: false, disabled: false },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <SelectTrigger className="w-56" aria-label="Priority">
          <SelectValue placeholder="Pick a priority" />
        </SelectTrigger>
        <SelectContent>
          <PriorityItems />
        </SelectContent>
      </Select>
    );
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={CONTROL_STATES}
      columns={TRIGGER_COLUMNS}
      renderCell={(state, column) => <TriggerCell state={state} column={column} />}
    />
  ),
};

export const Default: Story = {};

/** Proof's Change rule scope select: All languages, a rule, then the client's languages. */
export const Open: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex h-96 justify-center pt-4">
      <Field className="w-64">
        <FieldLabel htmlFor="rule-scope">Applies to</FieldLabel>
        <Select defaultOpen defaultValue="French (Canada)">
          <SelectTrigger id="rule-scope" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All languages</SelectItem>
            <SelectSeparator />
            {PROOF_SCOPE_LANGUAGES.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
};

/** I&R's Invite role, opened from its placeholder. */
export const OpenWithPlaceholder: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex h-96 justify-center pt-4">
      <Select defaultOpen>
        <SelectTrigger className="w-64" aria-label="Role">
          <SelectValue placeholder="Choose a role" />
        </SelectTrigger>
        <SelectContent position="popper">
          {IR_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Clearable: Story = { args: { clearable: true } };

export const Disabled: Story = { args: { disabled: true } };

export const Small: Story = {
  render: () => (
    <Select defaultValue="medium">
      <SelectTrigger size="sm" className="w-44" aria-label="Priority">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <PriorityItems />
      </SelectContent>
    </Select>
  ),
};

export const Ghost: Story = {
  render: () => (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      Sorted by
      <Select defaultValue="Best performers">
        <SelectTrigger variant="ghost" size="sm" aria-label="Sort">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          {POOL_SORT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

type DiscoveryStatus = (typeof DISCOVERY_STATUSES)[number]["value"];

function StatusBadgeSelect({
  disabled,
  initialStatus = "in_progress",
  size,
}: {
  disabled?: boolean;
  initialStatus?: DiscoveryStatus;
  size?: "default" | "lg";
}) {
  const [status, setStatus] = useState<DiscoveryStatus>(initialStatus);
  const current = DISCOVERY_STATUSES.find((option) => option.value === status);
  return (
    <Select
      value={status}
      onValueChange={(next) => {
        const option = DISCOVERY_STATUSES.find((candidate) => candidate.value === next);
        if (option) setStatus(option.value);
      }}
      disabled={disabled}
    >
      <SelectTrigger
        variant="badge"
        size={size}
        tone={current?.tone}
        aria-label={`Change status, current: ${current?.label}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {DISCOVERY_STATUSES.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** `variant="badge"` with a status `tone`: a status picker that reads as the status pill. Two sizes:
 * `default` sits in a table row; `lg` is a page or section header's status, as tall as the `icon-sm`
 * buttons beside it. */
export const Badge: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {DISCOVERY_STATUSES.map((option) => (
          <StatusBadgeSelect key={option.value} initialStatus={option.value} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <StatusBadgeSelect disabled />
      </div>
      <div className="flex items-center gap-2">
        <StatusBadgeSelect size="lg" />
        <IconButton label="Request details" size="icon-sm">
          <Info />
        </IconButton>
        <IconButton label="Add profile" size="icon-sm">
          <Plus />
        </IconButton>
      </div>
    </div>
  ),
};

/** Pool's discovery status with its dot in each option and in the trigger. */
export const WithIcons: Story = {
  render: () => (
    <Select defaultValue="in_progress">
      <SelectTrigger className="w-52" aria-label="Status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {DISCOVERY_STATUSES.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            <StatusDot tone={status.tone} label={status.label} className="text-sm" />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

function FilterBarDemo() {
  const [search, setSearch] = useState("");
  const [priorities, setPriorities] = useState<string[]>(["urgent"]);
  const [since, setSince] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        size="sm"
        value={search}
        onChange={setSearch}
        placeholder="Search requests…"
        className="w-64"
      />
      <Select defaultValue="all">
        <SelectTrigger size="sm" aria-label="Status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          <SelectItem value="all">All statuses</SelectItem>
          {DISCOVERY_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <MultiSelectPopover
        size="sm"
        placeholder="Priority"
        options={DISCOVERY_PRIORITIES}
        selectedValues={priorities}
        onChange={setPriorities}
      />
      <div className="w-40">
        <DatePicker
          size="sm"
          value={since}
          onChange={setSince}
          placeholder="Deadline"
          aria-label="Deadline"
        />
      </div>
    </div>
  );
}

export const FilterBar: Story = { render: () => <FilterBarDemo /> };
