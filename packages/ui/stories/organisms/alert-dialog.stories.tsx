import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, ShieldCheck } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../src/components/alert-dialog";
import { Button } from "../../src/components/button";

type Scenario = "invite" | "unblacklist" | "discard" | "discardWizard";

/** Pool's AlertDialogs, verbatim. */
const SCENARIOS: Record<
  Scenario,
  {
    trigger: string;
    title: string;
    description: string;
    cancel: string;
    action: string;
    destructive?: boolean;
    icon?: ReactNode;
  }
> = {
  // features/collaborations/components/tracking-table/tracking-table.tsx
  invite: {
    trigger: "Invite",
    title: "Invite Jade Rivera to the portal?",
    description: "They'll receive an email invitation to create their account.",
    cancel: "Cancel",
    action: "Send invite",
    icon: <Mail />,
  },
  // features/creators/components/admin/creator-profile/_components/unblacklist-creator-dialog.tsx
  unblacklist: {
    trigger: "Remove from blacklist",
    title: "Remove Jade Rivera from blacklist?",
    description: "This creator will be restored to active status.",
    cancel: "Cancel",
    action: "Remove from blacklist",
    icon: <ShieldCheck />,
  },
  // features/projects/components/campaign-guides/campaign-guide-dialog.tsx
  discard: {
    trigger: "Close guide",
    title: "Discard changes?",
    description: "Your guide edits have not been saved. Discard them or stay and keep editing.",
    cancel: "Stay",
    action: "Discard changes",
    destructive: true,
  },
  // features/collaborations/components/collaboration-wizard.tsx
  discardWizard: {
    trigger: "Close wizard",
    title: "Discard and close?",
    description: "Your progress won't be saved. The collaboration will remain open.",
    cancel: "Stay",
    action: "Discard and close",
    destructive: true,
  },
};

type DemoArgs = {
  scenario: Scenario;
  size?: ComponentProps<typeof AlertDialogContent>["size"];
  withMedia?: boolean;
  defaultOpen?: boolean;
};

function AlertDialogDemo({ scenario, size = "default", withMedia = false, defaultOpen }: DemoArgs) {
  const content = SCENARIOS[scenario];
  return (
    <AlertDialog defaultOpen={defaultOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{content.trigger}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          {withMedia && content.icon ? <AlertDialogMedia>{content.icon}</AlertDialogMedia> : null}
          <AlertDialogTitle>{content.title}</AlertDialogTitle>
          <AlertDialogDescription>{content.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{content.cancel}</AlertDialogCancel>
          <AlertDialogAction variant={content.destructive ? "destructive" : "default"}>
            {content.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const meta = {
  title: "Organisms/AlertDialog",
  args: { scenario: "invite", size: "default", withMedia: false, defaultOpen: false },
  argTypes: {
    scenario: { control: "inline-radio", options: Object.keys(SCENARIOS) },
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
  render: (args) => <AlertDialogDemo {...args} />,
} satisfies Meta<DemoArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pool's portal invite. Click outside never dismisses it: the reader picks an action. Use the controls for the other Pool confirmations, size and media.",
      },
    },
  },
  args: { defaultOpen: true },
};

export const WithMedia: Story = {
  args: { scenario: "unblacklist", withMedia: true, defaultOpen: true },
};

export const Destructive: Story = { args: { scenario: "discardWizard", defaultOpen: true } };

export const Small: Story = {
  parameters: {
    docs: { description: { story: 'Pool\'s guide editor asks this at `size="sm"`.' } },
  },
  args: { scenario: "discard", size: "sm", defaultOpen: true },
};

export const Closed: Story = {};
