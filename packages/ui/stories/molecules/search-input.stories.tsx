import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SearchInput } from "../../src/components/search-input";
import { VariantGrid } from "../lib/variant-grid";

function SearchInputDemo(props: Partial<React.ComponentProps<typeof SearchInput>>) {
  const [value, setValue] = useState(props.value ?? "");
  return <SearchInput {...props} value={value} onChange={setValue} />;
}

const STATES = ["default", "hover", "focus-visible", "filled", "loading", "disabled"] as const;

const meta = {
  title: "Molecules/SearchInput",
  component: SearchInput,
  args: { value: "", onChange: () => {}, placeholder: "Search creators…", isLoading: false },
  render: (args) => <SearchInputDemo {...args} />,
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={STATES}
      columns={["search"] as const}
      renderCell={(state) => (
        <SearchInputDemo
          aria-label={state}
          placeholder="Search creators…"
          value={state === "filled" || state === "loading" ? "sofia" : ""}
          isLoading={state === "loading"}
          disabled={state === "disabled"}
          className={
            state === "hover"
              ? "[&_[data-slot=input]]:border-ring/60"
              : state === "focus-visible"
                ? "[&_[data-slot=input]]:focus-ring!"
                : undefined
          }
        />
      )}
    />
  ),
};

export const Default: Story = {};

export const Filled: Story = { args: { value: "sofia reyes" } };

export const Loading: Story = { args: { value: "sofia", isLoading: true } };

export const Disabled: Story = { args: { disabled: true } };

export const Sizes: Story = {
  render: () => (
    <VariantGrid
      rows={["sm", "default"] as const}
      columns={["empty", "filled"] as const}
      renderCell={(size, content) => (
        <SearchInputDemo
          size={size}
          aria-label={`${size} ${content}`}
          value={content === "filled" ? "sofia" : ""}
        />
      )}
    />
  ),
};
