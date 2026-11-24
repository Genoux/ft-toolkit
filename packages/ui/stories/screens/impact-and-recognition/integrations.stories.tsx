import type { Meta, StoryObj } from "@storybook/react-vite";
import { RefreshCw } from "lucide-react";
import { Badge } from "../../../src/components/badge";
import { Button } from "../../../src/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../../../src/components/item";
import { Page, PageHeader } from "../../../src/components/page";

/** I&R Settings › Integrations (deel-integration.tsx): Deel as a connected app with a quiet Sync now. */
function DeelIntegration({ syncing = false }: { syncing?: boolean }) {
  return (
    <Page size="narrow">
      <PageHeader title="Integrations" />
      <ItemGroup>
        <Item>
          <ItemMedia>
            {/* Stands in for the app's /integrations/deel.png logo. */}
            <span
              aria-hidden
              className="flex size-10 items-center justify-center rounded-full bg-foreground text-xl font-bold tracking-tight text-background"
            >
              d.
            </span>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              Deel
              <Badge variant="outline">Sandbox</Badge>
            </ItemTitle>
            <ItemDescription>Last synced Nov 23, 2026, 4:09 PM</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" loading={syncing}>
              <RefreshCw aria-hidden />
              {syncing ? "Syncing" : "Sync now"}
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </Page>
  );
}

const meta = {
  title: "Screens/Impact and Recognition/Integrations",
  globals: { brand: "fieldtrip" },
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <DeelIntegration /> };
export const Syncing: Story = { render: () => <DeelIntegration syncing /> };
