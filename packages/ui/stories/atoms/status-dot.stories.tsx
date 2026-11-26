import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusDot } from "../../src/components/status-dot";
import { VariantGrid } from "../lib/variant-grid";

const TONES = ["success", "warning", "destructive", "info", "neutral"] as const;
const TONE_LABELS = {
  success: "Active",
  warning: "Pending",
  destructive: "Suspended",
  info: "Syncing",
  neutral: "Archived",
} as const;

const meta = {
  title: "Atoms/StatusDot",
  component: StatusDot,
  args: { tone: "success", label: "Active", pulse: false },
  argTypes: { tone: { control: "inline-radio", options: TONES } },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={TONES}
      columns={["static", "pulse"] as const}
      renderCell={(tone, column) => (
        <StatusDot tone={tone} label={TONE_LABELS[tone]} pulse={column === "pulse"} />
      )}
    />
  ),
};

const TURNS = [
  { label: "With People", color: "var(--color-sky-500)" },
  { label: "With Finance", color: "var(--color-amber-400)" },
  { label: "With you", color: "var(--color-fuchsia-300)" },
] as const;

/** `color` takes a CSS colour, usually an app token, for a category that is not a status. */
export const CustomColor: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {TURNS.map((turn) => (
        <StatusDot key={turn.label} color={turn.color} label={turn.label} />
      ))}
      <StatusDot color="var(--color-sky-500)" label="Syncing with People" pulse />
    </div>
  ),
};

export const Live: Story = { args: { tone: "info", label: "Rendering 3 of 12", pulse: true } };

/** `description` adds a line that starts under the label, so the dot stands alone in its own column. */
export const WithDescription: Story = {
  args: {
    color: "var(--color-fieldtrip-mauve, #b398ad)",
    label: "Promotion for Tomás",
    description: "Draft, effective Jul 1, 2027",
    className: "text-base font-medium",
  },
};

export const Playground: Story = {};
