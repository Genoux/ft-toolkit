import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, Film, Tag } from "lucide-react";
import { useState } from "react";
import { Chip } from "../../src/components/chip";
import { PersonAvatar } from "../../src/components/person-identity";
import { PEOPLE } from "../lib/fixtures";
import { VariantGrid } from "../lib/variant-grid";

const SIZES = ["sm", "default"] as const;
const LAYOUTS = [
  "label",
  "icon",
  "avatar",
  "removable",
  "icon + remove",
  "avatar + remove",
  "disabled",
  "long label",
] as const;

function LayoutChip({
  size,
  layout,
}: {
  size: (typeof SIZES)[number];
  layout: (typeof LAYOUTS)[number];
}) {
  const person = PEOPLE[0];
  const withIcon = layout === "icon" || layout === "icon + remove";
  const withAvatar = layout === "avatar" || layout === "avatar + remove";
  const removable = layout !== "label" && layout !== "icon" && layout !== "avatar";
  return (
    <Chip
      size={size}
      icon={
        withIcon ? (
          <Tag />
        ) : withAvatar && person ? (
          <PersonAvatar imageUrl={person.imageUrl} name={person.name} />
        ) : undefined
      }
      onRemove={removable ? () => {} : undefined}
      disabled={layout === "disabled"}
      className={layout === "long label" ? "max-w-48" : undefined}
    >
      {withAvatar
        ? (person?.name ?? "")
        : layout === "long label"
          ? "spring-launch-hook-take-three-final.mp4"
          : "Skincare"}
    </Chip>
  );
}

const meta = {
  title: "Molecules/Chip",
  component: Chip,
  parameters: { layout: "padded" },
  args: { children: "Skincare", size: "default", onRemove: () => {} },
  argTypes: { size: { control: "inline-radio", options: SIZES } },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover or tab to the remove button for its hover and focus states. */
export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={LAYOUTS}
      columns={SIZES}
      renderCell={(layout, size) => <LayoutChip size={size} layout={layout} />}
    />
  ),
};

export const Playground: Story = {};

/** Staged files before an analysis: remove one and it leaves the row. */
export const StagedFiles: Story = {
  render: function StagedFilesStory() {
    const [files, setFiles] = useState([
      { name: "hook-take-three.mp4", icon: Film },
      { name: "script-v2.pdf", icon: FileText },
      { name: "unboxing-final-cut.mov", icon: Film },
    ]);
    return (
      <div className="flex w-md flex-wrap gap-2">
        {files.map((file) => (
          <Chip
            key={file.name}
            icon={<file.icon />}
            className="max-w-56"
            onRemove={() => setFiles(files.filter((other) => other.name !== file.name))}
          >
            {file.name}
          </Chip>
        ))}
        {files.length === 0 ? (
          <span className="text-sm text-muted-foreground">Nothing staged.</span>
        ) : null}
      </div>
    );
  },
};
