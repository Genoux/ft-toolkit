import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PlatformDisclaimer } from "../../src/components/platform-disclaimer";

const meta = {
  title: "Organisms/PlatformDisclaimer",
  component: PlatformDisclaimer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Fixed to the bottom-right corner and fades in after a 2 second delay. Dismissing stores `cookieName` for 7 days.",
      },
    },
  },
  args: {
    title: "This is an internal inBeat tool",
    description: "Client data here is confidential. Don’t share screenshots outside the team.",
    cookieName: "storybook-platform-disclaimer",
  },
} satisfies Meta<typeof PlatformDisclaimer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A fresh cookie name per visit, so the notice shows again after "Got it". */
export const Default: Story = {
  render: function DefaultStory(args) {
    const [cookieName] = useState(() => `${args.cookieName}-${Date.now()}`);
    return (
      <div className="h-96 w-full">
        <PlatformDisclaimer {...args} cookieName={cookieName} />
      </div>
    );
  },
};
