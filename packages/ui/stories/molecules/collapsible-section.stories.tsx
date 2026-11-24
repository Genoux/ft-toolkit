import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import {
  CollapsibleBody,
  CollapsibleContent,
  CollapsibleHeader,
  CollapsibleSection,
  CollapsibleTrigger,
} from "../../src/components/collapsible-section";
import { IconButton } from "../../src/components/icon-button";

const DIVIDERS = [true, false] as const;
const CHEVRONS = ["end", "start"] as const;
const SIZES = ["md", "sm"] as const;

const meta = {
  title: "Molecules/CollapsibleSection",
  component: CollapsibleSection,
  args: {
    defaultOpen: true,
    divider: true,
    chevron: "end",
    size: "md",
    variant: "default",
    children: null,
  },
  argTypes: {
    chevron: { control: "inline-radio", options: CHEVRONS },
    variant: { control: "inline-radio", options: ["default", "card"] },
    size: { control: "inline-radio", options: SIZES },
  },
  render: (args) => (
    <CollapsibleSection {...args} className="w-md">
      <CollapsibleHeader meta="3 fields">Canadian bank account</CollapsibleHeader>
      <CollapsibleBody className="text-sm text-muted-foreground">
        Institution, transit and account number.
      </CollapsibleBody>
    </CollapsibleSection>
  ),
} satisfies Meta<typeof CollapsibleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every divider × chevron × size, open and closed. */
export const AllStates: Story = {
  render: () => (
    <div className="grid w-5xl grid-cols-4 items-start gap-4">
      {SIZES.flatMap((size) =>
        DIVIDERS.flatMap((divider) =>
          CHEVRONS.flatMap((chevron) =>
            [true, false].map((open) => (
              <div key={`${size}-${divider}-${chevron}-${open}`} className="flex flex-col gap-2">
                <code className="text-xs text-muted-foreground">
                  {size} · {divider ? "divider" : "no divider"} · {chevron} ·{" "}
                  {open ? "open" : "closed"}
                </code>
                <CollapsibleSection
                  defaultOpen={open}
                  divider={divider}
                  chevron={chevron}
                  size={size}
                >
                  <CollapsibleHeader meta="Nov 18">Submission 2</CollapsibleHeader>
                  <CollapsibleBody className="text-sm text-muted-foreground">
                    Three videos delivered for review.
                  </CollapsibleBody>
                </CollapsibleSection>
              </div>
            )),
          ),
        ),
      )}
    </div>
  ),
};

export const Default: Story = {};

const HISTORY = [
  { id: "sent", text: "Maya Bennett sent the request", date: "Apr 2" },
  { id: "review", text: "Priya Shah approved it for Finance", date: "Apr 12" },
  { id: "finance", text: "Harper Cole approved it", date: "Apr 15" },
];

/** Both variants are a white surface with a hairline frame; `card` takes the card radius, for a section on the page canvas beside cards. */
export const CardSurface: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid w-3xl grid-cols-2 items-start gap-4">
      {(["card", "default"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <code className="text-xs text-muted-foreground">{variant}</code>
          <CollapsibleSection variant={variant} defaultOpen>
            <CollapsibleHeader meta={HISTORY.length}>History</CollapsibleHeader>
            <CollapsibleBody>
              <ol className="flex flex-col gap-3 text-sm">
                {HISTORY.map((event) => (
                  <li key={event.id} className="flex justify-between gap-4">
                    <span>{event.text}</span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {event.date}
                    </span>
                  </li>
                ))}
              </ol>
            </CollapsibleBody>
          </CollapsibleSection>
        </div>
      ))}
    </div>
  ),
};

export const NoDivider: Story = { args: { divider: false } };

export const ChevronStart: Story = { args: { chevron: "start" } };

/** Controls that must not toggle the section go in actions, outside the button. */
export const WithActions: Story = {
  render: () => (
    <CollapsibleSection defaultOpen divider={false} chevron="start" size="sm" className="w-md">
      <CollapsibleHeader
        meta="Nov 18, 2026"
        actions={
          <IconButton label="Download all" variant="ghost" size="icon-xs">
            <Download />
          </IconButton>
        }
      >
        Submission 2
      </CollapsibleHeader>
      <CollapsibleBody>
        <div className="grid grid-cols-3 gap-2">
          {["Hook", "Demo", "Call to action"].map((clip) => (
            <div
              key={clip}
              className="flex aspect-9/16 items-end rounded-md bg-muted p-2 text-xs text-muted-foreground"
            >
              {clip}
            </div>
          ))}
        </div>
      </CollapsibleBody>
    </CollapsibleSection>
  ),
};

/** In a narrow container (under 24rem) the meta and actions drop under the title instead of squeezing it. */
export const Narrow: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {CHEVRONS.map((chevron) => (
        <CollapsibleSection key={chevron} chevron={chevron} size="sm" className="w-80">
          <CollapsibleHeader
            meta="2 hours ago"
            actions={
              <>
                <Badge variant="warning" dot>
                  Needs revision
                </Badge>
                <IconButton label="Download all" variant="ghost" size="icon-xs">
                  <Download />
                </IconButton>
                <IconButton label="Delete run" variant="ghost" size="icon-xs">
                  <Trash2 />
                </IconButton>
              </>
            }
          >
            Spring launch hook, take three.mp4
          </CollapsibleHeader>
          <CollapsibleBody className="text-sm text-muted-foreground">
            Two findings to fix before the client sees it.
          </CollapsibleBody>
        </CollapsibleSection>
      ))}
    </div>
  ),
};

/** `open` and `onOpenChange` from the parent: one section open at a time. */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [openId, setOpenId] = useState<string | null>("brief");
    const sections = [
      { id: "brief", title: "Brief", body: "Three 30-second videos for TikTok and Reels." },
      { id: "rights", title: "Usage rights", body: "Paid usage for 12 months, organic forever." },
      { id: "payment", title: "Payment", body: "$1,200 on approval, paid on the 1st." },
    ];
    return (
      <div className="flex w-md flex-col gap-2">
        {sections.map((section) => (
          <CollapsibleSection
            key={section.id}
            open={openId === section.id}
            onOpenChange={(open) => setOpenId(open ? section.id : null)}
          >
            <CollapsibleHeader>{section.title}</CollapsibleHeader>
            <CollapsibleBody className="text-sm text-muted-foreground">
              {section.body}
            </CollapsibleBody>
          </CollapsibleSection>
        ))}
        <Button variant="ghost" size="sm" className="self-start" onClick={() => setOpenId(null)}>
          Collapse all
        </Button>
      </div>
    );
  },
};

/** The bare parts, for a header the app draws itself. */
export const CustomHeader: Story = {
  render: () => (
    <CollapsibleSection defaultOpen className="w-md">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium">
        Custom header
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="px-4 py-3 text-sm text-muted-foreground">Content the app pads itself.</p>
      </CollapsibleContent>
    </CollapsibleSection>
  ),
};
