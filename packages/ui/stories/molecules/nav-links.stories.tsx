import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, FileText, Images, MessagesSquare } from "lucide-react";
import { NavLinks } from "../../src/components/nav-links";
import { useActiveTitle } from "../lib/app-fixtures";

const ITEMS = [
  { title: "Overview", icon: BarChart3 },
  { title: "Briefs", icon: FileText, count: 4 },
  { title: "Content", icon: Images, count: 128 },
  { title: "Messages", icon: MessagesSquare },
  { title: "Contracts", icon: FileText, disabled: true },
];

function Links({
  orientation,
  variant,
}: Pick<Parameters<typeof NavLinks>[0], "orientation" | "variant">) {
  const { markActive, renderLink } = useActiveTitle("Content");
  return (
    <NavLinks
      items={markActive(ITEMS)}
      renderLink={renderLink}
      orientation={orientation}
      variant={variant}
      className={variant === "underline" ? "border-b" : undefined}
    />
  );
}

const meta = {
  title: "Molecules/NavLinks",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Route links, unlike Tabs which switch state: pill, underline and vertical, each with an active and a disabled link; counts show in the vertical list only. Click to watch the indicator slide. */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <code className="text-xs text-muted-foreground">variant="pill"</code>
        <Links />
      </div>
      <div className="flex flex-col gap-3">
        <code className="text-xs text-muted-foreground">variant="underline"</code>
        <Links variant="underline" />
      </div>
      <div className="flex w-56 flex-col gap-3">
        <code className="text-xs text-muted-foreground">orientation="vertical"</code>
        <Links orientation="vertical" />
      </div>
    </div>
  ),
};

/** Links that do not fit collapse into a More menu at the end; the active link always stays in the row. Drag the corner of the frame to resize it. */
export const Overflow: Story = {
  render: () => (
    <div className="flex w-sm max-w-full min-w-40 resize-x flex-col gap-6 overflow-hidden rounded-xl border bg-card p-4">
      <Links />
      <Links variant="underline" />
    </div>
  ),
};
