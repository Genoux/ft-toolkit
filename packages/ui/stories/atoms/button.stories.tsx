import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, ChevronDown, Download, MoreHorizontal, Plus, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "../../src/components/button";
import { SIMULATED_STATE_CLASS } from "../lib/control-states";
import { VariantGrid } from "../lib/variant-grid";

const VARIANTS = ["default", "destructive", "secondary", "outline", "ghost", "link"] as const;
const SIZES = ["xs", "sm", "default", "lg"] as const;
const STATES = [
  "default",
  "hover",
  "focus-visible",
  "pressed",
  "open",
  "disabled",
  "loading",
] as const;

type Variant = (typeof VARIANTS)[number];
type State = (typeof STATES)[number];

const HOVER_CLASS: Record<Variant, string> = {
  default: "bg-primary/90",
  destructive: "bg-(--destructive-hover)",
  secondary: "bg-accent",
  outline: "bg-muted",
  ghost: "bg-muted",
  link: "underline",
};

function forcedStateClass(variant: Variant, state: State) {
  if (state === "hover") return HOVER_CLASS[variant];
  if (state === "focus-visible") return SIMULATED_STATE_CLASS.focus;
  if (state === "pressed") return `${HOVER_CLASS[variant]} ${variant === "link" ? "" : "scale-98"}`;
  return undefined;
}

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: { layout: "padded" },
  args: { children: "Save changes", disabled: false, loading: false },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <VariantGrid
      rows={VARIANTS}
      columns={STATES}
      renderCell={(variant, state) => (
        <Button
          variant={variant}
          disabled={state === "disabled"}
          loading={state === "loading"}
          data-state={state === "open" ? "open" : undefined}
          className={forcedStateClass(variant, state)}
        >
          {variant === "destructive" ? null : <Plus />}
          {variant === "destructive" ? "Delete campaign" : "New campaign"}
        </Button>
      )}
    />
  ),
};

export const Sizes: Story = {
  render: ({ children }) => (
    <VariantGrid
      rows={VARIANTS}
      columns={SIZES}
      renderCell={(variant, size) => (
        <Button variant={variant} size={size}>
          {children}
        </Button>
      )}
    />
  ),
};

const ICON_LAYOUTS = ["leading", "trailing", "both", "icon only"] as const;

export const Icons: Story = {
  render: () => (
    <VariantGrid
      rows={SIZES}
      columns={ICON_LAYOUTS}
      renderCell={(size, layout) => {
        if (layout === "icon only") {
          const iconSize = size === "default" ? "icon" : (`icon-${size}` as const);
          return (
            <Button variant="outline" size={iconSize} aria-label="Download report">
              <Download />
            </Button>
          );
        }
        return (
          <Button variant="outline" size={size}>
            {layout !== "trailing" ? <Download /> : null}
            Export
            {layout !== "leading" ? <ChevronDown data-icon="inline-end" /> : null}
          </Button>
        );
      }}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <VariantGrid
      rows={["idle", "loading"] as const}
      columns={["leading icon", "text only", "trailing icon", "icon only"] as const}
      renderCell={(row, column) => {
        const loading = row === "loading";
        if (column === "leading icon")
          return (
            <Button loading={loading}>
              <Send />
              Send invite
            </Button>
          );
        if (column === "text only")
          return (
            <Button variant="outline" loading={loading}>
              Save changes
            </Button>
          );
        if (column === "trailing icon")
          return (
            <Button variant="secondary" loading={loading}>
              Continue
              <ArrowRight data-icon="inline-end" />
            </Button>
          );
        return (
          <Button size="icon" variant="outline" loading={loading} aria-label="Download report">
            <Download />
          </Button>
        );
      }}
    />
  ),
};

function SaveButton() {
  const [isSaving, setIsSaving] = useState(false);
  return (
    <Button
      loading={isSaving}
      onClick={() => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1600);
      }}
    >
      <Send />
      Send for approval
    </Button>
  );
}

export const LoadingInteractive: Story = {
  render: () => <SaveButton />,
};

export const Playground: Story = {};

export const AsLink: Story = {
  render: () => (
    <Button asChild variant="outline">
      <a href="#creators">
        View creators
        <ArrowRight data-icon="inline-end" />
      </a>
    </Button>
  ),
};

export const Dots: Story = {
  render: () => (
    <div
      data-row
      className="flex w-80 items-center justify-between rounded-md px-3 py-2 hover:bg-muted/60"
    >
      <span className="text-table">Spring launch brief</span>
      <Button variant="dots" aria-label="More actions">
        <MoreHorizontal />
      </Button>
    </div>
  ),
};
