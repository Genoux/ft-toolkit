import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  MultiSelectOptionList,
  MultiSelectPopover,
} from "../../src/components/multi-select-popover";
import { listboxPanelClassName } from "../../src/internal/control-styles";
import { POOL_BRAND_INTERESTS } from "../lib/overlay-fixtures";
import { COLLABORATION_FILTER_OPTIONS, STAFF } from "../lib/pool-fixtures";
import { AnnotationCaption } from "../lib/state-annotation";
import { VariantGrid } from "../lib/variant-grid";

const CLIENTS = COLLABORATION_FILTER_OPTIONS.clients;
const CLOSED_BY = COLLABORATION_FILTER_OPTIONS.closedBy;

const TRIGGER_STATES = ["none selected", "one selected", "several selected", "disabled"] as const;

const SELECTED_BY_STATE: Record<(typeof TRIGGER_STATES)[number], string[]> = {
  "none selected": [],
  "one selected": ["Glossier"],
  "several selected": ["Glossier", "Oura", "Nutramax"],
  disabled: ["Glossier"],
};

const meta = {
  title: "Molecules/MultiSelectPopover",
  component: MultiSelectPopover,
  args: {
    placeholder: "Client",
    options: CLIENTS,
    selectedValues: [],
    onChange: () => {},
    size: "sm",
  },
  argTypes: { size: { control: "inline-radio", options: ["sm", "default"] } },
  render: ({ selectedValues: initialValues, ...args }) => {
    const [selectedValues, setSelectedValues] = useState(initialValues);
    return (
      <MultiSelectPopover {...args} selectedValues={selectedValues} onChange={setSelectedValues} />
    );
  },
} satisfies Meta<typeof MultiSelectPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <VariantGrid
        rows={TRIGGER_STATES}
        columns={["sm", "default"] as const}
        renderCell={(state, size) => (
          <MultiSelectPopover
            placeholder="Client"
            options={CLIENTS}
            selectedValues={SELECTED_BY_STATE[state]}
            onChange={() => {}}
            size={size}
            disabled={state === "disabled"}
          />
        )}
      />
      <div className="grid grid-cols-3 gap-4">
        {(["list", "loading", "empty"] as const).map((panel) => (
          <div key={panel} className="flex flex-col gap-2">
            <AnnotationCaption>{panel}</AnnotationCaption>
            <div className={`${listboxPanelClassName} w-64 overflow-hidden`}>
              <MultiSelectOptionList
                options={panel === "empty" ? [] : CLOSED_BY}
                selectedValues={[STAFF.theo.id, STAFF.priya.id]}
                onToggle={() => {}}
                isPending={panel === "loading"}
                searchable={panel === "list"}
                searchPlaceholder="Search team…"
                emptyMessage="No admin users found."
                idPrefix={`panel-${panel}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Default: Story = {};

/** Pool's Create client field: the trigger fills the field and lists the picks. */
export const FormSize: Story = {
  render: ({ selectedValues: initialValues, ...args }) => {
    const [selectedValues, setSelectedValues] = useState(initialValues);
    return (
      <MultiSelectPopover
        {...args}
        size="default"
        triggerClassName="w-72 max-w-none"
        contentClassName="w-(--radix-popover-trigger-width) overflow-hidden"
        renderLabel={(selected) => selected.map((option) => option.label).join(", ")}
        selectedValues={selectedValues}
        onChange={setSelectedValues}
      />
    );
  },
  args: {
    placeholder: "Select brand interests",
    options: POOL_BRAND_INTERESTS,
    selectedValues: ["Beauty", "Personal Care"],
  },
};

/** Pool's Closed by filter: staff with avatars. */
export const WithAvatars: Story = {
  args: { placeholder: "Closed by", options: CLOSED_BY, selectedValues: [STAFF.theo.id] },
};

/** Pool's campaign Team picker: the trigger counts the picks. */
export const CustomLabel: Story = {
  args: {
    placeholder: "Add team members",
    options: CLOSED_BY,
    selectedValues: [STAFF.theo.id, STAFF.maya.id],
    renderLabel: (selectedOptions) =>
      `${selectedOptions.length} ${selectedOptions.length === 1 ? "team member" : "team members"}`,
  },
};

export const Searchable: Story = {
  args: {
    placeholder: "Add team members",
    options: CLOSED_BY,
    searchable: true,
    searchPlaceholder: "Search team…",
  },
};

export const Loading: Story = { args: { isPending: true } };

export const Empty: Story = {
  args: {
    placeholder: "Add team members",
    options: [],
    emptyMessage: "No admin users found.",
  },
};

/** Pool's closed-collaborations filters. The trigger sizes to its label (6rem to 11rem), so a filter bar keeps several on one line at phone width. */
export const FilterBar: Story = {
  render: () => (
    <div className="flex w-80 flex-wrap gap-2 rounded-xl border border-dashed border-border p-2">
      <MultiSelectPopover
        placeholder="Client"
        options={CLIENTS}
        selectedValues={["Glossier"]}
        onChange={() => {}}
      />
      <MultiSelectPopover
        placeholder="Campaign"
        options={COLLABORATION_FILTER_OPTIONS.campaigns}
        selectedValues={[]}
        onChange={() => {}}
      />
      <MultiSelectPopover
        placeholder="Closed by"
        options={CLOSED_BY}
        selectedValues={[STAFF.theo.id, STAFF.priya.id]}
        onChange={() => {}}
      />
    </div>
  ),
};
