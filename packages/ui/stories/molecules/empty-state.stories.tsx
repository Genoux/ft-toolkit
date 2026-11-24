import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BugPlay,
  CircleCheck,
  FolderKanban,
  Languages,
  LogOut,
  Plus,
  RotateCw,
  SearchX,
  TriangleAlert,
} from "lucide-react";
import type { ReactNode } from "react";
import { fn } from "storybook/test";
import { EmptyState } from "../../src/components/empty-state";
import { Page } from "../../src/components/page";
import { AnnotationCaption } from "../lib/state-annotation";

const meta = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  parameters: { layout: "padded" },
  args: {
    icon: FolderKanban,
    title: "No campaigns yet",
    description: "Create a campaign to invite creators and track their delivery.",
    action: { label: "Create campaign", icon: Plus, variant: "default", onClick: fn() },
    className: "w-lg",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <AnnotationCaption>{label}</AnnotationCaption>
      {children}
    </div>
  );
}

/** The states the apps show, with their copy: nothing yet (a create action), no results (clear filters), a failed load (try again), nothing to do (no action), an empty slot to fill (dashed) and a title alone. Frameless on the page, never a white box; `dashed` only for an "add something" slot inside a section among other content. In a grid row each takes the height of its content; in a flex column (a page, a section, a card, a table) it fills the room left. */
export const AllStates: Story = {
  render: () => (
    <div className="grid w-6xl grid-cols-3 items-start gap-x-4 gap-y-6">
      <Labelled label="nothing yet · Pool campaigns">
        <EmptyState
          icon={FolderKanban}
          title="No campaigns yet"
          description="Create a campaign to invite creators and track their delivery."
          action={{ label: "Create campaign", icon: Plus, variant: "default", onClick: fn() }}
        />
      </Labelled>
      <Labelled label="no results · I&R control room">
        <EmptyState
          icon={SearchX}
          title="No requests match"
          description="Try another search or clear the filters."
          action={{ label: "Clear filters", variant: "outline", onClick: fn() }}
        />
      </Labelled>
      <Labelled label="failed load · I&R approvals">
        <EmptyState
          tone="destructive"
          icon={TriangleAlert}
          title="Something went wrong"
          description="We couldn't load your approvals. Try again; if it keeps happening, send IT the reference below."
          action={{ label: "Try again", icon: RotateCw, onClick: fn() }}
          meta="Reference ERR_7F3K"
        />
      </Labelled>
      <Labelled label="nothing to do · I&R approvals">
        <EmptyState
          icon={CircleCheck}
          title="Nothing to approve"
          description="Requests arrive here once People Strategy verifies them, grouped by department."
        />
      </Labelled>
      <Labelled label="empty slot · Proof client languages">
        <EmptyState
          frame="dashed"
          icon={Languages}
          title="No languages yet"
          description="Add a language to start configuring source-of-truth."
        />
      </Labelled>
      <Labelled label="title and line · I&R cycles">
        <EmptyState
          title="No cycles yet"
          description="Set up the first half-year cycle with New cycle."
        />
      </Labelled>
    </div>
  ),
};

export const FirstRun: Story = {};

export const NoResults: Story = {
  args: {
    icon: SearchX,
    title: "No requests match",
    description: "Try another search or clear the filters.",
    action: { label: "Clear filters", variant: "outline", onClick: fn() },
  },
};

/** `tone="destructive"` tints the icon and announces the message; the action retries and `meta` carries the reference. */
export const LoadError: Story = {
  args: {
    tone: "destructive",
    icon: TriangleAlert,
    title: "Something went wrong",
    description:
      "We couldn't load your approvals. Try again; if it keeps happening, send IT the reference below.",
    action: { label: "Try again", icon: RotateCw, onClick: fn() },
    meta: "Reference ERR_7F3K",
  },
};

/** `frame="dashed"`: an "add something" slot inside a section among other content, waiting for the user to add the first item. The only frame an empty state takes. */
export const Dashed: Story = {
  args: {
    frame: "dashed",
    icon: Languages,
    title: "No languages yet",
    description: "Add a language to start configuring source-of-truth.",
    action: undefined,
  },
};

export const Minimal: Story = {
  args: {
    icon: undefined,
    action: undefined,
    title: "No cycles yet",
    description: "Set up the first half-year cycle with New cycle.",
  },
};

/** Any empty state takes the room its flex column leaves and centres its message there: Proof's workspace before a session exists. */
export const Fill: Story = {
  render: () => (
    <div className="flex h-96 w-2xl flex-col rounded-xl bg-card">
      <EmptyState
        icon={BugPlay}
        title="Start a new QA session"
        description="Create a new session to start"
      />
    </div>
  ),
};

// An href action renders a link, so a Server Component can pass one; renderLink takes the router Link.
export const LinkAction: Story = {
  args: {
    icon: undefined,
    title: "No requests yet",
    description:
      "Request an increase or a promotion for someone on your team. This round takes requests until Dec 12.",
    action: { label: "New request", icon: Plus, variant: "default", href: "#new-request" },
  },
};

function CenteredPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Page asChild size="centered" className={className}>
      <main>{children}</main>
    </Page>
  );
}

/** `size="page"` for a message that is the whole page, inside a `centered` Page: the title is the page's h1, the description reads at body size on a 33rem measure and the action is large. Never framed, in the app shell or out of it: it sits on the page. 404, error, maintenance and access denied, with the apps' copy. */
export const PageSizes: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="grid grid-cols-2 divide-x divide-y divide-border border-b border-border">
      <div className="flex h-110 flex-col">
        <CenteredPage className="min-h-0">
          <EmptyState
            size="page"
            title="Page not found"
            description="The link may be out of date or mistyped."
            action={{ label: "Go to Impact & Recognition", variant: "default", href: "#home" }}
          />
        </CenteredPage>
      </div>
      <div className="flex h-110 flex-col">
        <CenteredPage className="min-h-0">
          <EmptyState
            size="page"
            title="Something went wrong"
            action={{ label: "Try again", variant: "outline", onClick: fn() }}
            secondaryAction={{ label: "Contact us", variant: "default", href: "#support" }}
            meta={<span className="font-mono text-xs">3871502946</span>}
          />
        </CenteredPage>
      </div>
      <div className="flex h-110 flex-col">
        <CenteredPage className="min-h-0">
          <EmptyState
            size="page"
            title="Down for maintenance"
            description="We'll be back shortly."
            action={{ label: "Contact support", variant: "outline", href: "#support" }}
          />
        </CenteredPage>
      </div>
      <div className="flex h-110 flex-col">
        <CenteredPage className="min-h-0">
          <EmptyState
            size="page"
            title="You don't have access"
            description="This tool is for managers, Heads, People Strategy and Finance. If you should have access, ask People Strategy to add you."
            action={{ label: "Sign out", icon: LogOut, variant: "default", onClick: fn() }}
            meta={
              <>
                Signed in as <span className="text-foreground">jamie.cruz@inbeat.agency</span>
              </>
            }
          />
        </CenteredPage>
      </div>
    </div>
  ),
};
