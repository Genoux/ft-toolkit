import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowBigUp, Command, CornerDownLeft } from "lucide-react";
import { Kbd, KbdGroup } from "../../src/components/kbd";
import { VariantGrid } from "../lib/variant-grid";

const meta = {
  title: "Atoms/Kbd",
  component: Kbd,
  args: { children: "K", size: "default" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "default"] } },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={["sm", "default"] as const}
      columns={["letter", "word", "icon", "group"] as const}
      renderCell={(size, column) => {
        if (column === "letter") return <Kbd size={size}>K</Kbd>;
        if (column === "word") return <Kbd size={size}>Esc</Kbd>;
        if (column === "icon")
          return (
            <Kbd size={size} aria-label="Enter">
              <CornerDownLeft />
            </Kbd>
          );
        return (
          <KbdGroup>
            <Kbd size={size} aria-label="Command">
              <Command />
            </Kbd>
            <Kbd size={size} aria-label="Shift">
              <ArrowBigUp />
            </Kbd>
            <Kbd size={size}>P</Kbd>
          </KbdGroup>
        );
      }}
    />
  ),
};

export const InText: Story = {
  render: () => (
    <p className="text-sm text-muted-foreground">
      Press{" "}
      <KbdGroup>
        <Kbd aria-label="Command">
          <Command />
        </Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{" "}
      to search creators, or <Kbd>Esc</Kbd> to close.
    </p>
  ),
};

export const Playground: Story = {};
