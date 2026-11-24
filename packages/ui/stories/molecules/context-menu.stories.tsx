import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy } from "lucide-react";
import { Fragment } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../../src/components/context-menu";
import { HOLIDAY_VIDEO_RUN } from "../screens/proof-agent/fixtures";

const meta = {
  title: "Molecules/ContextMenu",
  component: ContextMenu,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function openFirstContextMenu(canvasElement: HTMLElement) {
  const target = canvasElement.querySelector<HTMLElement>("[data-slot=context-menu-trigger]");
  if (!target) return;
  const bounds = target.getBoundingClientRect();
  target.dispatchEvent(
    new MouseEvent("contextmenu", {
      bubbles: true,
      clientX: bounds.left + 160,
      clientY: bounds.top + bounds.height / 2,
    }),
  );
}

/** Proof, features/sessions/components/session-workspace/_components/workflow-run/card.tsx. */
const RUN_IDS = [
  { label: "Proof run ID", id: "run_8f2c41d0b7e94a6c" },
  { label: "Workflow run ID", id: "wfr_3a91e07c5d2b4f18" },
  { label: "Batch ID", id: "bat_c47d1e92a0f64b35" },
];

const middleTruncate = (id: string) => `${id.slice(0, 8)}…${id.slice(-4)}`;

function RunCard() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex w-md flex-col gap-1 rounded-xl border border-border bg-card px-5 py-4 transition-colors duration-(--duration-fast) data-[state=open]:border-ring/60">
        <span className="text-sm font-medium">{HOLIDAY_VIDEO_RUN.assetLabel}</span>
        <span className="text-xs text-muted-foreground">
          {HOLIDAY_VIDEO_RUN.language} · Last run {HOLIDAY_VIDEO_RUN.lastRun}
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-72">
        {RUN_IDS.map((run, index) => (
          <Fragment key={run.label}>
            {index > 0 ? <ContextMenuSeparator /> : null}
            <ContextMenuItem>
              <Copy />
              {run.label}
              <span className="ml-auto font-mono text-xs text-subtle-foreground">
                {middleTruncate(run.id)}
              </span>
            </ContextMenuItem>
          </Fragment>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export const AllStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Proof's review run card: right-click to copy one of the run's IDs. Same surface, items and motion as DropdownMenu; the menu opens at the pointer.",
      },
    },
  },
  play: ({ canvasElement }) => openFirstContextMenu(canvasElement),
  render: () => (
    <div className="h-80">
      <RunCard />
    </div>
  ),
};
