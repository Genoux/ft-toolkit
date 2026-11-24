import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, Loader2, TriangleAlert, X } from "lucide-react";
import { Badge } from "../../src/components/badge";
import { VariantGrid } from "../lib/variant-grid";

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "success",
  "warning",
  "info",
  "destructive",
] as const;
const SIZES = ["sm", "md", "lg"] as const;
const LAYOUTS = ["text", "dot", "icon"] as const;

const VARIANT_LABELS: Record<(typeof VARIANTS)[number], string> = {
  default: "New",
  secondary: "Draft",
  outline: "Paid social",
  success: "Approved",
  warning: "Needs review",
  info: "Processing",
  destructive: "Rejected",
};

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "Approved", variant: "success", dot: false },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <VariantGrid
      rows={VARIANTS}
      columns={SIZES.flatMap((size) => LAYOUTS.map((layout) => `${size} · ${layout}` as const))}
      renderCell={(variant, column) => {
        const [size, layout] = column.split(" · ") as [(typeof SIZES)[number], string];
        return (
          <Badge variant={variant} size={size} dot={layout === "dot"}>
            {layout === "icon" ? <Check /> : null}
            {VARIANT_LABELS[variant]}
          </Badge>
        );
      }}
    />
  ),
};

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="info">
        <Loader2 className="animate-spin motion-reduce:animate-none" />
        Processing
      </Badge>
      <Badge variant="success">
        <Check />
        Delivered
      </Badge>
      <Badge variant="warning">
        <TriangleAlert />
        Missing usage rights
      </Badge>
      <Badge variant="destructive">
        <X />
        Upload failed
      </Badge>
      <Badge variant="secondary" dot>
        Queued
      </Badge>
    </div>
  ),
};

const TONES = ["success", "warning", "info", "destructive"] as const;

/** `solid` fills a tone badge with the tone itself, darkened only as far as the page colour on it needs for AA, for the one item that stands out, such as the current step's "Now"; the page colour on it passes AA in every theme. */
export const Solid: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          {TONES.map((tone) => (
            <Badge key={tone} variant={tone} size={size} solid>
              {VARIANT_LABELS[tone]}
            </Badge>
          ))}
          <Badge variant="success" size={size} solid dot>
            Now
          </Badge>
        </div>
      ))}
    </div>
  ),
};

const TURNS = [
  { label: "With People", color: "var(--color-sky-500)" },
  { label: "With Finance", color: "var(--color-amber-400)" },
  { label: "With you", color: "var(--color-fuchsia-300)" },
] as const;

/** `color` takes a CSS colour, usually an app token, for a category that is not a status: it gets the same pastel tint and dark text as a status tone, so it stays readable. */
export const CustomColor: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-2">
          {TURNS.map((turn) => (
            <Badge key={turn.label} size={size} color={turn.color} dot>
              {turn.label}
            </Badge>
          ))}
          <Badge asChild size={size} color="var(--color-sky-500)">
            <a href="#people">Open People queue</a>
          </Badge>
        </div>
      ))}
    </div>
  ),
};

/** `asChild` slots the badge onto a link; a `dot` goes inside the link. */
export const AsLink: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge asChild variant="outline">
        <a href="#campaign">Spring launch</a>
      </Badge>
      <Badge asChild variant="success" dot>
        <a href="#approved">Approved</a>
      </Badge>
    </div>
  ),
};

export const Playground: Story = {};
