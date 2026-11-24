import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLink } from "../../src/components/text-link";
import { SIMULATED_STATE_CLASS } from "../lib/control-states";
import { VariantGrid } from "../lib/variant-grid";

const TONES = ["muted", "default"] as const;
const STATES = ["default", "hover", "focus-visible"] as const;

const SIMULATED_STATE: Record<(typeof TONES)[number], Record<(typeof STATES)[number], string>> = {
  muted: {
    default: "",
    hover: "text-foreground decoration-current",
    "focus-visible": `text-foreground decoration-current ${SIMULATED_STATE_CLASS.focus}`,
  },
  default: {
    default: "",
    hover: "decoration-current",
    "focus-visible": `decoration-current ${SIMULATED_STATE_CLASS.focus}`,
  },
};

const meta = {
  title: "Atoms/TextLink",
  component: TextLink,
  parameters: { layout: "padded" },
  args: { href: "#terms", children: "Terms of service", tone: "muted" },
  argTypes: { tone: { control: "inline-radio", options: TONES } },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={TONES}
      columns={STATES}
      renderCell={(tone, state) => (
        <TextLink href="#privacy" tone={tone} className={SIMULATED_STATE[tone][state]}>
          Privacy
        </TextLink>
      )}
    />
  ),
};

export const Playground: Story = {};

/** `muted` for quiet footer links. */
export const Footer: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-subtle-foreground">© 2026 Fieldtrip</span>
      <TextLink href="#help">Help</TextLink>
      <TextLink href="#privacy">Privacy</TextLink>
      <TextLink href="#terms">Terms</TextLink>
    </div>
  ),
};

/** `default` inside running text or a value, such as a timestamp that opens the video there. */
export const InText: Story = {
  render: () => (
    <p className="max-w-md text-sm text-muted-foreground">
      The logo is cropped at{" "}
      <TextLink tone="default" href="#t=0:12" className="tabular-nums">
        0:12
      </TextLink>{" "}
      and the claim needs a source. See the{" "}
      <TextLink tone="default" href="#rules">
        client rules
      </TextLink>
      .
    </p>
  ),
};

/** `asChild` gives a router Link the same look. */
export const AsChild: Story = {
  render: () => (
    <TextLink asChild>
      <a href="#settings" data-router-link="">
        Workspace settings
      </a>
    </TextLink>
  ),
};
