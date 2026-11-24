import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "../../src/components/breadcrumb";

const LEVELS = [
  { label: "Clients", href: "#clients" },
  { label: "Nutramax", href: "#nutramax" },
  {
    label: "NMAX - UGC brief - D1 - Nutramax BAU UGC Ads - Concept 3 - Wellness",
    href: "#campaign",
  },
  { label: "Jade Rivera", href: "#creator" },
  { label: "Brief - Concept 3 - Wellness hooks and raw footage", href: "#folder" },
];

function Trail({ depth }: { depth: number }) {
  return <Breadcrumb links={LEVELS.slice(0, depth - 1)} page={LEVELS[depth - 1]?.label} />;
}

type StoryArgs = { depth: number };

const meta = {
  title: "Molecules/Breadcrumb",
  parameters: { layout: "padded" },
  globals: { viewport: { value: "desktop", isRotated: false } },
  args: { depth: LEVELS.length },
  argTypes: { depth: { control: { type: "range", min: 1, max: LEVELS.length, step: 1 } } },
  render: ({ depth }) => <Trail depth={depth} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Depth 1 to 5: the current page alone, inline links up to two, then the middle collapses into a … menu; long labels truncate with a tooltip. */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {LEVELS.map((level, index) => (
        <div key={level.href} className="flex items-center gap-4">
          <code className="w-16 shrink-0 text-xs text-muted-foreground">depth {index + 1}</code>
          <Trail depth={index + 1} />
        </div>
      ))}
      <div className="flex items-center gap-4">
        <code className="w-16 shrink-0 text-xs text-muted-foreground">narrow</code>
        <div className="w-72 rounded-lg border px-2 py-1">
          <Trail depth={3} />
        </div>
      </div>
    </div>
  ),
};

export const Default: Story = {};

/** The … menu holds the collapsed middle levels. */
export const OverflowMenuOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Show more breadcrumbs" }).at(-1) as HTMLElement,
    );
  },
};

/** Below lg every link collapses into the menu and only the current page stays inline. */
export const Mobile: Story = { globals: { viewport: { value: "mobile2", isRotated: false } } };
