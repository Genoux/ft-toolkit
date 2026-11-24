import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowUpDown,
  BellIcon,
  Download,
  ExternalLink,
  Filter,
  PanelLeft,
  Plus,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../src/components/dropdown-menu";
import { IconButton } from "../../src/components/icon-button";
import { SIMULATED_STATE_CLASS } from "../lib/control-states";
import { VariantGrid } from "../lib/variant-grid";

const VARIANTS = ["default", "secondary", "outline", "ghost"] as const;
const SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;
const STATES = [
  "default",
  "hover",
  "focus-visible",
  "pressed",
  "toggled",
  "open",
  "disabled",
  "loading",
] as const;

type Variant = (typeof VARIANTS)[number];
type State = (typeof STATES)[number];

const HOVER_CLASS: Record<Variant, string> = {
  default: "bg-primary/90",
  secondary: "bg-accent",
  outline: "bg-muted",
  ghost: "bg-muted",
};

function forcedStateClass(variant: Variant, state: State) {
  if (state === "hover") return HOVER_CLASS[variant];
  if (state === "focus-visible") return SIMULATED_STATE_CLASS.focus;
  if (state === "pressed") return `${HOVER_CLASS[variant]} scale-98`;
  return undefined;
}

function StateCell({ variant, state }: { variant: Variant; state: State }) {
  if (state === "toggled") {
    return (
      <IconButton label="Show filters" pressedLabel="Hide filters" pressed>
        <Filter />
      </IconButton>
    );
  }
  return (
    <IconButton
      label="Add creator"
      variant={variant}
      disabled={state === "disabled"}
      loading={state === "loading"}
      data-state={state === "open" ? "open" : undefined}
      className={forcedStateClass(variant, state)}
    >
      <Plus />
    </IconButton>
  );
}

function PanelToggle() {
  const [pressed, setPressed] = useState(false);
  return (
    <IconButton
      label="Show panel"
      pressedLabel="Hide panel"
      pressed={pressed}
      onClick={() => setPressed(!pressed)}
    >
      <PanelLeft />
    </IconButton>
  );
}

function DownloadButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  return (
    <IconButton
      label="Download report"
      variant="outline"
      loading={isDownloading}
      onClick={() => {
        setIsDownloading(true);
        setTimeout(() => setIsDownloading(false), 1600);
      }}
    >
      <Download />
    </IconButton>
  );
}

const meta = {
  title: "Atoms/IconButton",
  component: IconButton,
  parameters: { layout: "padded" },
  args: { label: "Add creator" },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={VARIANTS}
      columns={STATES}
      renderCell={(variant, state) => <StateCell variant={variant} state={state} />}
    />
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <VariantGrid
      rows={VARIANTS}
      columns={SIZES}
      renderCell={(variant, size) => (
        <IconButton {...args} variant={variant} size={size}>
          <Plus />
        </IconButton>
      )}
    />
  ),
};

export const Toggle: Story = {
  render: () => <PanelToggle />,
};

export const MenuTrigger: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label="Sort">
          <ArrowUpDown />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Newest first</DropdownMenuItem>
        <DropdownMenuItem>Oldest first</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** `indicator` puts a dot in the corner for something unseen; the label says it too. */
export const Indicator: Story = {
  render: () => (
    <VariantGrid
      rows={VARIANTS}
      columns={["unread", "read"] as const}
      renderCell={(variant, column) => (
        <IconButton
          label={column === "unread" ? "Notifications, 3 unread" : "Notifications"}
          variant={variant}
          size="icon-sm"
          indicator={column === "unread"}
        >
          <BellIcon />
        </IconButton>
      )}
    />
  ),
};

/** `tone="warning"` flags an action that is due; `tooltip` explains why while the label stays short. */
export const WarningTone: Story = {
  render: () => (
    <VariantGrid
      rows={["warning"] as const}
      columns={["default", "hover", "focus-visible", "disabled"] as const}
      renderCell={(_, state) => (
        <IconButton
          label="Rerun with updated rules"
          tooltip="Client rules changed after this run. Rerun to check against the current rules."
          tone="warning"
          size="icon-2xs"
          disabled={state === "disabled"}
          className={
            state === "hover"
              ? "bg-warning/20"
              : state === "focus-visible"
                ? SIMULATED_STATE_CLASS.focus
                : undefined
          }
        >
          <TriangleAlert />
        </IconButton>
      )}
    />
  ),
};

export const Loading: Story = {
  render: () => <DownloadButton />,
};

export const Link: Story = {
  render: (args) => (
    <IconButton {...args} asChild variant="outline" label="Open brand guidelines">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        <ExternalLink />
      </a>
    </IconButton>
  ),
};
