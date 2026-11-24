import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import { Card } from "../../src/components/card";
import { Grid, Inline, Stack } from "../../src/components/layout";
import { Stat, StatLabel, StatMeta, StatValue } from "../../src/components/stat";

// Every gap comes from the theme's spacing roles, so an app changes its density in one place.

const meta = {
  title: "Organisms/Layout",
  parameters: { layout: "padded" },
  globals: { viewport: { value: "desktop", isRotated: false } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const STATS = [
  ["Active clients", "24", "3 onboarding"],
  ["Live collaborations", "132", "48 delivering"],
  ["Applicants", "18", "6 new today"],
  ["Spent this month", "$84,200", "of $120,000"],
] as const;

function StatTile({
  label,
  value,
  meta,
  hero = false,
  className,
}: {
  label: string;
  value: string;
  meta?: string;
  hero?: boolean;
  className?: string;
}) {
  return (
    <Card className={className}>
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatValue size={hero ? "lg" : "default"}>{value}</StatValue>
        {meta ? <StatMeta>{meta}</StatMeta> : null}
      </Stat>
    </Card>
  );
}

/** Each gap role in use: xs, sm, md, then xl between the groups. */
export const AllStates: Story = {
  render: () => (
    <Stack gap="xl" className="max-w-3xl">
      <Stack gap="xs">
        <div className="text-sm font-medium">Usage rights</div>
        <p className="text-sm text-muted-foreground">xs: a label and its hint.</p>
      </Stack>
      <Inline gap="sm">
        <Button size="sm">
          <Plus />
          New collaboration
        </Button>
        <Button size="sm" variant="secondary">
          Cancel
        </Button>
        <Badge variant="warning">sm: a group of controls</Badge>
      </Inline>
      <Stack gap="md">
        {["md: items of a list", "Oura · 12 collaborations", "Glossier · 7 collaborations"].map(
          (item) => (
            <Card key={item}>{item}</Card>
          ),
        )}
      </Stack>
    </Stack>
  ),
};

export const ToolbarRow: Story = {
  render: () => (
    <Inline justify="between" className="max-w-3xl">
      <div className="text-base font-medium">Recent collaborations</div>
      <Inline gap="sm">
        <Button size="sm" variant="secondary">
          Export
        </Button>
        <Button size="sm">New collaboration</Button>
      </Inline>
    </Inline>
  ),
};

/** `min` (default): as many columns as fit, one on a phone. */
export const AutoFillGrid: Story = {
  render: () => (
    <Grid min="sm">
      {STATS.map(([label, value, meta]) => (
        <StatTile key={label} label={label} value={value} meta={meta} />
      ))}
    </Grid>
  ),
};

/** `cols`: a fixed count from lg (two from sm, one on a phone), for sets that must line up. */
export const FixedColumns: Story = {
  render: () => (
    <Stack gap="xl">
      {([2, 3, 4] as const).map((cols) => (
        <Stack key={cols} gap="sm">
          <code className="text-xs text-muted-foreground">cols={cols}</code>
          <Grid cols={cols}>
            {STATS.slice(0, cols).map(([label, value, meta]) => (
              <StatTile key={label} label={label} value={value} meta={meta} />
            ))}
          </Grid>
        </Stack>
      ))}
    </Stack>
  ),
};

/** Bento: the hero figure's Card spans two of four columns, three stats fill the rest across two rows. */
export const Bento: Story = {
  render: () => (
    <Grid cols={4}>
      <StatTile
        hero
        label="Content delivered"
        value="1,284"
        meta="+18% on October"
        className="md:col-span-2"
      />
      {STATS.slice(0, 2).map(([label, value, meta]) => (
        <StatTile key={label} label={label} value={value} meta={meta} />
      ))}
      {STATS.slice(2).map(([label, value, meta]) => (
        <StatTile key={label} label={label} value={value} meta={meta} className="lg:col-span-2" />
      ))}
    </Grid>
  ),
};

const FILTERS = ["All steps", "All kinds", "Oldest first", "All departments"] as const;

/** `phoneCols={2}` keeps two columns on a phone instead of one, for filters and small tiles. */
export const TwoColumnsOnPhone: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
  render: () => (
    <Stack gap="xl">
      <Grid cols={4} phoneCols={2} gap="sm">
        {FILTERS.map((filter) => (
          <Button key={filter} size="sm" variant="outline" className="justify-start">
            {filter}
          </Button>
        ))}
      </Grid>
      <Grid min="sm" phoneCols={2} gap="md">
        {STATS.map(([label, value]) => (
          <StatTile key={label} label={label} value={value} />
        ))}
      </Grid>
    </Stack>
  ),
};
