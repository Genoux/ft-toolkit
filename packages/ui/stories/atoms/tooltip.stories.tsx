import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronLeft, MessageSquareText, Plus } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { Button } from "../../src/components/button";
import { IconButton } from "../../src/components/icon-button";
import { Tooltip, TooltipContent, TooltipRoot, TooltipTrigger } from "../../src/components/tooltip";

const meta = {
  title: "Atoms/Tooltip",
  component: Tooltip,
  args: {
    content: "Create a new session",
    side: "top",
    children: (
      <Button>
        <Plus />
        New session
      </Button>
    ),
  },
  argTypes: { side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] } },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

function OpenTooltip({
  children,
  content,
  side,
}: {
  children: ReactElement;
  content: ReactNode;
  side?: "top" | "bottom";
}) {
  return (
    <TooltipRoot open>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </TooltipRoot>
  );
}

/** Proof's New session and Session instruction buttons, I&R's case pager and a cycle step card. */
export const Open: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-2 place-items-center gap-x-24 gap-y-20 p-16">
      <OpenTooltip content="Create a new session">
        <Button>
          <Plus />
          New session
        </Button>
      </OpenTooltip>
      <OpenTooltip content="Session instruction">
        <IconButton label="Session instruction" variant="outline">
          <MessageSquareText />
        </IconButton>
      </OpenTooltip>
      <OpenTooltip side="bottom" content="Previous request">
        <IconButton label="Previous request" variant="outline">
          <ChevronLeft />
        </IconButton>
      </OpenTooltip>
      <OpenTooltip
        side="bottom"
        content="Managers and Heads request pay increases and promotions for their reports. Reviews run alongside in Windmill."
      >
        <Button variant="ghost">Requests</Button>
      </OpenTooltip>
    </div>
  ),
};

export const Default: Story = {};
