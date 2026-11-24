import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "../../src/components/avatar";
import { PEOPLE } from "../lib/fixtures";
import { VariantGrid } from "../lib/variant-grid";

const SIZES = ["xs", "sm", "md", "lg"] as const;
const [firstPerson] = PEOPLE;

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <VariantGrid
      rows={SIZES}
      columns={["image", "fallback", "group"] as const}
      renderCell={(size, column) => {
        if (column === "image")
          return (
            <Avatar size={size}>
              <AvatarImage src={firstPerson?.imageUrl ?? undefined} alt={firstPerson?.name} />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
          );
        if (column === "fallback")
          return (
            <Avatar size={size}>
              <AvatarFallback>CK</AvatarFallback>
            </Avatar>
          );
        return (
          <AvatarGroup>
            {PEOPLE.map((person) => (
              <Avatar key={person.id} size={size}>
                {person.imageUrl ? <AvatarImage src={person.imageUrl} alt={person.name} /> : null}
                <AvatarFallback>{initials(person.name)}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+8</AvatarGroupCount>
          </AvatarGroup>
        );
      }}
    />
  ),
};

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src={firstPerson?.imageUrl ?? undefined} alt={firstPerson?.name} />
      <AvatarFallback>AM</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>CK</AvatarFallback>
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="rounded-xl border bg-card p-(--card-padding)">
      <AvatarGroup>
        {PEOPLE.slice(0, 3).map((person) => (
          <Avatar key={person.id} size="sm">
            <AvatarImage src={person.imageUrl ?? undefined} alt={person.name} />
            <AvatarFallback>{initials(person.name)}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
};
