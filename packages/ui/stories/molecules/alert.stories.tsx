import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../../src/components/alert";
import { Button } from "../../src/components/button";

/** Inline notices from the apps: I&R's PanelNotice copy, Pool's portal and blacklist banners. */
const VARIANTS = {
  default: {
    icon: Info,
    title: "Not shared yet",
    description: "Aisha hears nothing until People releases it for the conversation.",
    action: "Release to share",
  },
  info: {
    icon: Info,
    title: "Changed to version 2",
    description: "Priya Shah corrected the band. Approve it again if it still holds.",
    action: "Review",
  },
  success: {
    icon: CircleCheck,
    title: "Your profile is live",
    description:
      "Welcome to Pool! You're now visible to brands and can receive collaboration invitations by email.",
    action: "Dismiss",
  },
  warning: {
    icon: TriangleAlert,
    title: "Over the Creative budget",
    description: "Approving it needs a reason, saved as a documented exception.",
    action: "Approve as exception",
  },
  destructive: {
    icon: CircleAlert,
    title: "No Creative budget in USD",
    description: "Set one before approving. A missing budget is never treated as unlimited.",
    action: "Set budget",
  },
} as const;

type Variant = keyof typeof VARIANTS;
const VARIANT_NAMES = Object.keys(VARIANTS) as Variant[];

const meta = {
  title: "Molecules/Alert",
  component: Alert,
  args: { variant: "default" },
  argTypes: { variant: { control: "inline-radio", options: VARIANT_NAMES } },
  render: (args) => {
    const content = VARIANTS[args.variant ?? "default"];
    const Icon = content.icon;
    return (
      <Alert {...args} className="w-lg">
        <Icon />
        <AlertTitle>{content.title}</AlertTitle>
        <AlertDescription>{content.description}</AlertDescription>
      </Alert>
    );
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every variant with icon, title, description and action, then title only (Pool's blacklist banner), title with an action (Proof's compliance banner) and without an icon. */
export const AllStates: Story = {
  render: () => (
    <div className="flex w-2xl flex-col gap-3">
      {VARIANT_NAMES.map((variant) => {
        const { icon: Icon, title, description, action } = VARIANTS[variant];
        return (
          <Alert key={variant} variant={variant}>
            <Icon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
            <AlertAction>
              <Button size="sm" variant="secondary">
                {action}
              </Button>
            </AlertAction>
          </Alert>
        );
      })}
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Blacklisted</AlertTitle>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>Oura has no compliance set up</AlertTitle>
        <AlertAction>
          <Button size="sm" variant="secondary">
            Dismiss
          </Button>
        </AlertAction>
      </Alert>
      <Alert>
        <AlertTitle>Own request</AlertTitle>
        <AlertDescription>
          Harper Cole approves it instead. It stays in this queue so the round is complete.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const Default: Story = {};

export const Destructive: Story = { args: { variant: "destructive" } };

// In a narrow panel the title and description wrap instead of being cut.
export const Narrow: Story = {
  render: () => (
    <Alert variant="warning" className="w-80">
      <TriangleAlert />
      <AlertTitle>No pay in Deel yet</AlertTitle>
      <AlertDescription>
        People adds Aisha's pay from Deel. Save a draft now; the increase and the band appear once
        the pay is in.
      </AlertDescription>
    </Alert>
  ),
};
