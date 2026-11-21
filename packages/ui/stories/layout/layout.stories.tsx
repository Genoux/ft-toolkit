import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import { Card } from "../../src/components/card";
import { Grid, Inline, Stack } from "../../src/components/layout";

// Every gap comes from the theme's spacing roles, so an app changes its density in one place.

const meta = {
  title: "Layout/Stack, Inline, Grid",
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATS = [
  ["Active clients", "128"],
  ["Open projects", "34"],
  ["Revenue this month", "$84,200"],
  ["Overdue invoices", "3"],
] as const;

export const Roles: Story = {
  render: () => (
    <Stack gap="xl" className="max-w-3xl">
      <Stack gap="xs">
        <div className="text-sm font-medium">xs: a label and its hint</div>
        <p className="text-sm text-muted-foreground">Shown under the field name.</p>
      </Stack>
      <Inline gap="sm">
        <Button size="sm">
          <Plus /> sm: buttons in a group
        </Button>
        <Button size="sm" variant="secondary">
          Cancel
        </Button>
        <Badge>Draft</Badge>
      </Inline>
      <Stack gap="md">
        {["md: items of a list", "Second item", "Third item"].map((item) => (
          <Card key={item}>{item}</Card>
        ))}
      </Stack>
    </Stack>
  ),
};

export const ToolbarRow: Story = {
  render: () => (
    <Inline justify="between" className="max-w-3xl">
      <div className="text-base font-semibold">Recent projects</div>
      <Inline gap="sm">
        <Button size="sm" variant="secondary">
          Export
        </Button>
        <Button size="sm">New project</Button>
      </Inline>
    </Inline>
  ),
};

export const StatGrid: Story = {
  render: () => (
    <Grid min="sm" className="max-w-4xl">
      {STATS.map(([label, value]) => (
        <Card key={label}>
          <Stack gap="xs">
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
          </Stack>
        </Card>
      ))}
    </Grid>
  ),
};
