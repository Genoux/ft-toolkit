import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps, ReactNode } from "react";
import { Tabs, TabsContent, TabsList } from "../../src/components/tabs";
import { AnnotationCaption, StateMarker } from "../lib/state-annotation";
import { VariantGrid } from "../lib/variant-grid";

const REQUEST_TABS = [
  { value: "all", label: "All" },
  { value: "sourcing", label: "Sourcing" },
  { value: "review", label: "In review" },
  { value: "delivered", label: "Delivered" },
  { value: "archived", label: "Archived", disabled: true },
];

const CHECK_TABS = [
  { value: "claims", label: "Claims" },
  { value: "disclosure", label: "Disclosure" },
  { value: "brand-safety", label: "Brand safety" },
  { value: "never-say", label: "Never say" },
  { value: "pronunciation", label: "Pronunciation" },
  { value: "captions", label: "Captions" },
  { value: "music", label: "Music rights", disabled: true },
];

const CONTROL_ROOM_TABS = [
  { value: "overview", label: "Overview" },
  { value: "nominations", label: "Nominations" },
  { value: "awards", label: "Awards" },
  { value: "settings", label: "Settings" },
];

type TabsListProps = ComponentProps<typeof TabsList>;

const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ["default", "line"] as const;
const SIZES = ["default", "sm"] as const;

// Static stand-ins for :hover and :focus-visible on one trigger, so the canvas shows both states.
const SIMULATED_HOVER = "[&_[data-slot=tabs-trigger]:last-child]:text-foreground";
const SIMULATED_FOCUS = "[&_[data-slot=tabs-trigger]:last-child]:focus-ring-inset!";

function Section({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <AnnotationCaption>{caption}</AnnotationCaption>
      {children}
    </div>
  );
}

export const AllStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Variant × size, then hover and keyboard focus, full width, and overflow: tabs that do not fit collapse into a More menu while the active tab stays in the row. The last request tab is disabled.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-10">
      <VariantGrid
        rows={VARIANTS}
        columns={SIZES}
        renderCell={(variant, size) => (
          <Tabs defaultValue="sourcing">
            <TabsList tabs={REQUEST_TABS} variant={variant} size={size} />
          </Tabs>
        )}
      />
      <Section caption="hover · focus-visible">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-wrap gap-12">
            <StateMarker state="hover">
              <Tabs defaultValue="all">
                <TabsList
                  tabs={REQUEST_TABS.slice(0, 3)}
                  variant={variant}
                  className={SIMULATED_HOVER}
                />
              </Tabs>
            </StateMarker>
            <StateMarker state="focus-visible">
              <Tabs defaultValue="review">
                <TabsList
                  tabs={REQUEST_TABS.slice(0, 3)}
                  variant={variant}
                  className={SIMULATED_FOCUS}
                />
              </Tabs>
            </StateMarker>
          </div>
        ))}
      </Section>
      <Section caption="fullWidth">
        <div className="flex w-xl flex-col gap-6">
          <Tabs defaultValue="sourcing">
            <TabsList tabs={REQUEST_TABS.slice(0, 3)} fullWidth />
          </Tabs>
          <Tabs defaultValue="nominations">
            <TabsList tabs={CONTROL_ROOM_TABS} variant="line" fullWidth />
          </Tabs>
        </div>
      </Section>
      <Section caption="overflow · active tab from the menu stays in the row">
        <OverflowingTabs />
      </Section>
    </div>
  ),
};

function OverflowingTabs() {
  return (
    <div className="flex w-96 flex-col gap-6 rounded-xl border bg-card p-4">
      {VARIANTS.map((variant) => (
        <Tabs key={variant} defaultValue="captions">
          <TabsList tabs={CHECK_TABS} variant={variant} aria-label="Checks" />
        </Tabs>
      ))}
    </div>
  );
}

function TabsWithPanels(props: Pick<TabsListProps, "variant" | "size" | "fullWidth">) {
  return (
    <Tabs defaultValue="overview" className="w-xl gap-4">
      <TabsList tabs={CONTROL_ROOM_TABS} {...props} />
      {CONTROL_ROOM_TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <p className="text-muted-foreground">
            {tab.label}: the panel content for this section of Control Room.
          </p>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export const Default: Story = { render: () => <TabsWithPanels /> };

export const Line: Story = { render: () => <TabsWithPanels variant="line" /> };

export const Small: Story = { render: () => <TabsWithPanels size="sm" /> };

export const FullWidth: Story = { render: () => <TabsWithPanels fullWidth /> };

export const FilterBar: Story = {
  parameters: {
    docs: {
      description: {
        story: "Without TabsContent, as a filter driven by `value` and `onValueChange` on Tabs.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="all">
      <TabsList tabs={REQUEST_TABS} aria-label="Request status" />
    </Tabs>
  ),
};

export const Overflow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Priority+ overflow: the tabs that fit stay in the row and the rest move into a More menu at the end. Picking one from the menu selects it and swaps it into the row. Drag the corner of the frame to resize it.",
      },
    },
  },
  render: () => (
    <div className="flex w-2xl max-w-full min-w-40 resize-x flex-col gap-6 overflow-hidden rounded-xl border bg-card p-4">
      {VARIANTS.map((variant) => (
        <Tabs key={variant} defaultValue="claims">
          <TabsList tabs={CHECK_TABS} variant={variant} aria-label="Checks" />
        </Tabs>
      ))}
    </div>
  ),
};

export const Wrap: Story = {
  parameters: {
    docs: {
      description: {
        story: "`wrap` puts the tabs that do not fit on another row instead of a More menu.",
      },
    },
  },
  render: () => (
    <div className="w-96 rounded-xl border bg-card p-4">
      <Tabs defaultValue="captions">
        <TabsList tabs={CHECK_TABS} wrap aria-label="Checks" />
      </Tabs>
    </div>
  ),
};
