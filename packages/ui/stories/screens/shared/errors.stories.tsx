import type { Meta, StoryObj } from "@storybook/react-vite";
import { Ambulance, CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "../../../src/components/empty-state";
import { Page } from "../../../src/components/page";

function CenteredPage({ children }: { children: ReactNode }) {
  return (
    <Page asChild size="centered">
      <main>{children}</main>
    </Page>
  );
}

// toolkit-gap: no Fieldtrip mark in the toolkit (Pool serves /logos/fieldtrip.svg); the brand face stands in for it
function FieldtripMark() {
  return <span className="font-brand text-xl font-medium">Fieldtrip</span>;
}

const meta = {
  title: "Screens/Shared/Errors",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fieldtrip Contracts' not-found page: the title and the way home. Proof and Pool redirect an unknown route to home instead. */
export const NotFound: Story = {
  render: () => (
    <CenteredPage>
      <EmptyState
        size="page"
        title="Page not found"
        action={{ label: "Back home", href: "#home", variant: "outline" }}
      />
    </CenteredPage>
  ),
};

/** Pool's creator portal, for a submission link that no longer exists. */
export const LinkNotFound: Story = {
  render: () => (
    <CenteredPage>
      <EmptyState
        size="page"
        icon={CircleAlert}
        title="Link not found"
        description="This link doesn't exist or has been removed. Ask the team for a new one."
      />
    </CenteredPage>
  ),
};

/** Pool with `MAINTENANCE_MODE` on: the Fieldtrip mark, the message and a way to reach support. */
export const Maintenance: Story = {
  render: () => (
    <CenteredPage>
      <FieldtripMark />
      <EmptyState
        size="page"
        title="Down for maintenance"
        description="We'll be back shortly."
        action={{
          label: "Contact support",
          href: "mailto:support@inbeat.agency?subject=Help%20with%20Pool",
          variant: "outline",
        }}
      />
    </CenteredPage>
  ),
};

/** Proof with `MAINTENANCE_MODE` on: the message alone, no support link. */
export const MaintenanceProof: Story = {
  render: () => (
    <CenteredPage>
      <EmptyState
        size="page"
        icon={Ambulance}
        title="Down for maintenance"
        description="We'll be back shortly."
      />
    </CenteredPage>
  ),
};

/** Fieldtrip Contracts' `error.tsx`: never the raw message, only the digest support can look up in the server log. */
export const ServerError: Story = {
  render: () => (
    <CenteredPage>
      <EmptyState
        size="page"
        title="Something went wrong"
        action={{ label: "Try again", variant: "outline", onClick: () => {} }}
        meta={<span className="font-mono text-xs">3871502946</span>}
      />
    </CenteredPage>
  ),
};
