import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { type ExternalToast, toast } from "sonner";
import { Button } from "../../src/components/button";
import { Toaster } from "../../src/components/sonner";

const meta = {
  title: "Molecules/Toast",
  component: Toaster,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

function downloadCampaignFiles() {
  return new Promise<void>((resolve) => setTimeout(resolve, 1800));
}

/** Toasts the apps send, verbatim (Pool, I&R and Proof). */
const EXAMPLES: { label: string; show: (options?: ExternalToast) => string | number }[] = [
  { label: "Default", show: (options) => toast("Marked as shared", options) },
  {
    label: "Success",
    show: (options) =>
      toast.success("Request withdrawn", {
        description: "Aisha Grant's request is closed.",
        ...options,
      }),
  },
  {
    label: "Info",
    show: (options) => toast.info("Jade Rivera is already on this campaign", options),
  },
  {
    label: "Warning",
    show: (options) => toast.warning("Downloaded 10 of 12 files", options),
  },
  {
    label: "Error",
    show: (options) =>
      toast.error(
        "This request changed since you opened it. Refresh to see the new version.",
        options,
      ),
  },
  { label: "Loading", show: (options) => toast.loading("Preparing zip 4/12…", options) },
  {
    label: "Action",
    show: (options) =>
      toast.success("Jade Rivera added to campaign", {
        action: { label: "View campaign", onClick: () => undefined },
        ...options,
      }),
  },
];

const SHOWCASE_TOASTER = "toast-showcase";

function ShowcaseToasts({ expand }: { expand: boolean }) {
  useEffect(() => {
    const ids = EXAMPLES.map((example) =>
      example.show({ toasterId: SHOWCASE_TOASTER, duration: Number.POSITIVE_INFINITY }),
    );
    return () => {
      for (const id of ids) toast.dismiss(id);
    };
  }, []);
  return (
    <Toaster
      id={SHOWCASE_TOASTER}
      expand={expand}
      visibleToasts={expand ? EXAMPLES.length : 3}
      position="bottom-right"
    />
  );
}

export const AllStates: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Default, success, info, warning, error, loading and action, kept on screen and expanded, at the apps' bottom-right position.",
      },
    },
  },
  render: () => (
    <div className="h-screen">
      <ShowcaseToasts expand />
    </div>
  ),
};

export const Stacked: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "The same toasts at rest: the newest three stack, and hovering the stack expands it.",
      },
    },
  },
  render: () => (
    <div className="h-screen">
      <ShowcaseToasts expand={false} />
    </div>
  ),
};

export const Triggers: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {EXAMPLES.map((example) => (
        <Button key={example.label} variant="outline" onClick={() => example.show()}>
          {example.label}
        </Button>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(downloadCampaignFiles(), {
            loading: "Starting download…",
            success: "Download complete",
            error: "Download failed",
          })
        }
      >
        Promise
      </Button>
    </div>
  ),
};
