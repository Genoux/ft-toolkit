import type { Meta, StoryObj } from "@storybook/react-vite";
import { Page, PageHeader } from "../../src/components/page";
import { SectionSpinner, Spinner } from "../../src/components/spinner";
import { AnnotationCaption } from "../lib/state-annotation";

const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A spinner is for a short wait whose result has no known shape: Proof's autosave line and a session still processing in its list. A layout that is known loads as skeletons instead. */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <AnnotationCaption>inline, beside its words · Proof autosave</AnnotationCaption>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Spinner className="size-3" />
          Saving…
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <AnnotationCaption>alone, so it carries the label · Proof session list</AnnotationCaption>
        <span className="flex items-center gap-2 text-sm">
          <Spinner label="Batch processing" className="size-3" />
          Holiday UGC round 2
        </span>
      </div>
    </div>
  ),
};

export const Default: Story = {};

/** A panel whose layout is unknown, inside chrome already on screen: the spinner sits on the surface, centred in the room left under the page's heading, with no box around it. It appears after 200ms so a fast load never flashes. */
export const Section: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex h-svh flex-col">
      <Page size="full">
        <PageHeader title="Discovery" />
        <SectionSpinner />
      </Page>
    </div>
  ),
};
