import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../../src/components/card";
import { InfoHint } from "../../src/components/info-hint";
import { Grid } from "../../src/components/layout";
import { Stat, StatLabel, StatValue } from "../../src/components/stat";
import { VariantGrid } from "../lib/variant-grid";

const POSITION_HINT =
  "How far along the band the pay is: 0% is the band minimum, 100% the maximum.";

const meta = {
  title: "Atoms/InfoHint",
  component: InfoHint,
  args: { label: "What band position means", children: POSITION_HINT },
} satisfies Meta<typeof InfoHint>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATES = ["default", "hover", "focus-visible"] as const;

const SIMULATED_STATE: Record<(typeof STATES)[number], string | undefined> = {
  default: undefined,
  hover: "bg-muted text-foreground",
  "focus-visible": "text-foreground focus-ring-inset!",
};

/** At rest, hovered and focused beside the term it explains. Hover, Tab to or tap the live one in Playground to open the tooltip. */
export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={["beside a label"] as const}
      columns={STATES}
      renderCell={(_, state) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          Proposed in band
          <InfoHint label="What band position means" className={SIMULATED_STATE[state]}>
            {POSITION_HINT}
          </InfoHint>
        </span>
      )}
    />
  ),
};

/** Open, as after a hover, keyboard focus or a tap: the hint is also the button's description for screen readers. */
export const Open: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="pt-24 pl-40">
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        Proposed in band
        <InfoHint {...args} />
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>("[data-slot=info-hint]")?.click();
  },
};

/** I&R's pay band tiles: the hint follows the StatLabel's words, beside the figure it explains. */
export const InStatLabel: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <Grid cols={3} className="w-3xl">
      {[
        { label: "Now in band", value: "48%", hint: true },
        { label: "Proposed in band", value: "Above maximum", hint: true, tone: "warning" as const },
        { label: "Over the maximum", value: "$2,080", hint: false },
      ].map(({ label, value, hint, tone }) => (
        <Card key={label}>
          <Stat>
            <StatLabel>
              {label}
              {hint ? <InfoHint label="What band position means">{POSITION_HINT}</InfoHint> : null}
            </StatLabel>
            <StatValue tone={tone}>{value}</StatValue>
          </Stat>
        </Card>
      ))}
    </Grid>
  ),
};

export const Playground: Story = {};
