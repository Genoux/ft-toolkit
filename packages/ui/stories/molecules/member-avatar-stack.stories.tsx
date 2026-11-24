import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberAvatarStack } from "../../src/components/member-avatar-stack";
import { PEOPLE } from "../lib/fixtures";
import { VariantGrid } from "../lib/variant-grid";

const GROUPS = {
  one: PEOPLE.slice(0, 1),
  two: PEOPLE.slice(0, 2),
  overflow: PEOPLE,
  "no images": [PEOPLE[4], { id: "6", name: null, imageUrl: null, email: "maya@inbeat.co" }].filter(
    (member) => member !== undefined,
  ),
  empty: [],
} as const;

const GROUP_NAMES = Object.keys(GROUPS) as (keyof typeof GROUPS)[];

const meta = {
  title: "Molecules/MemberAvatarStack",
  component: MemberAvatarStack,
  args: { members: PEOPLE.slice(0, 2), showNames: false },
} satisfies Meta<typeof MemberAvatarStack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Avatars alone, and with `showNames` where faces alone would not say who is on it. Hover a stack for every name. */
export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={GROUP_NAMES}
      columns={["avatars", "showNames"] as const}
      renderCell={(group, column) => (
        <MemberAvatarStack members={[...GROUPS[group]]} showNames={column === "showNames"} />
      )}
    />
  ),
};

export const Default: Story = {};

export const Overflow: Story = { args: { members: PEOPLE } };

export const WithNames: Story = { args: { members: PEOPLE, showNames: true } };

/** In a narrow cell the names truncate; the tooltip still lists everyone. */
export const NarrowWithNames: Story = {
  render: () => (
    <div className="w-36">
      <MemberAvatarStack members={PEOPLE} showNames />
    </div>
  ),
};

export const Empty: Story = { args: { members: [] } };

/** `emptyLabel` says what no members means in this place. */
export const EmptyLabel: Story = { args: { members: [], emptyLabel: "No team" } };
