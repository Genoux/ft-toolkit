import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { toggleMultiSelectValue } from "../../src/components/multi-select-popover";
import { TogglePills } from "../../src/components/toggle-pills";
import { PLATFORMS } from "../lib/form-fixtures";
import { VariantGrid } from "../lib/variant-grid";

const STATES = ["none selected", "some selected", "disabled"] as const;

const SELECTED_BY_STATE: Record<(typeof STATES)[number], string[]> = {
  "none selected": [],
  "some selected": ["TikTok", "Instagram"],
  disabled: ["TikTok"],
};

const meta = {
  title: "Molecules/TogglePills",
  component: TogglePills,
  args: { options: PLATFORMS, selected: [], onToggle: () => {}, "aria-label": "Platforms" },
  render: ({ selected: initialSelected, ...args }) => {
    const [selected, setSelected] = useState(initialSelected);
    return (
      <div className="w-xl">
        <TogglePills
          {...args}
          selected={selected}
          onToggle={(value) => setSelected((current) => toggleMultiSelectValue(current, value))}
        />
      </div>
    );
  },
} satisfies Meta<typeof TogglePills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={STATES}
      columns={["platforms"] as const}
      renderCell={(state) => (
        <TogglePills
          aria-label={state}
          options={PLATFORMS}
          selected={SELECTED_BY_STATE[state]}
          onToggle={() => {}}
          disabled={state === "disabled"}
          className="w-xl"
        />
      )}
    />
  ),
};

export const Default: Story = { args: { selected: ["TikTok"] } };

export const NoneSelected: Story = { args: { selected: [] } };

export const SeveralSelected: Story = { args: { selected: PLATFORMS.slice(0, 3) } };

export const Disabled: Story = { args: { selected: ["Instagram"], disabled: true } };
