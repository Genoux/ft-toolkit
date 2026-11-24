import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  MoreHorizontal,
  User,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import { Checkbox } from "../../src/components/checkbox";
import { IconButton } from "../../src/components/icon-button";
import {
  Item,
  ItemActions,
  ItemColumn,
  ItemContent,
  ItemControl,
  ItemDescription,
  ItemGroup,
  ItemLink,
  ItemMedia,
  ItemTitle,
} from "../../src/components/item";
import { PersonAvatar } from "../../src/components/person-identity";
import { StatusDot } from "../../src/components/status-dot";
import { PEOPLE } from "../lib/fixtures";

const meta = {
  title: "Molecules/Item",
  component: Item,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

const email = (name: string) => `${name.split(" ")[0]?.toLowerCase()}@inbeat.co`;

const SETTINGS = [
  { label: "Profile", description: "Name, photo and time zone", icon: User },
  { label: "Notifications", description: "Email and in-app alerts", icon: Bell },
  { label: "Billing", description: "Plan, invoices and payment method", icon: CreditCard },
];

const PLANS = [
  { id: "starter", name: "Starter", description: "Up to 10 creators · $49 / month" },
  { id: "growth", name: "Growth", description: "Up to 50 creators · $149 / month" },
  { id: "scale", name: "Scale", description: "Unlimited creators · $399 / month" },
];

/** Static row, a link row, a focused row (the inset ring plus the hover fill), a selected row, a disabled row and a row with only a title. A neutral badge sits on card with a hairline, so it stays a pill on the hover and selected tints. */
export const AllStates: Story = {
  render: () => (
    <div className="flex w-xl flex-col gap-6">
      <ItemGroup>
        <Item>
          <ItemMedia>
            <PersonAvatar name="Alex Morgan" imageUrl={PEOPLE[0]?.imageUrl} size="md" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Static row</ItemTitle>
            <ItemDescription>Media, title, description and actions</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary">Admin</Badge>
          </ItemActions>
        </Item>
        <Item asChild>
          <a href="#link">
            <ItemMedia>
              <Bell />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Link row</ItemTitle>
              <ItemDescription>Hover tint and an inset focus ring</ItemDescription>
            </ItemContent>
            <ChevronRight className="size-4 text-subtle-foreground" />
          </a>
        </Item>
        <Item asChild className="bg-muted/60 focus-ring-inset!">
          <a href="#focus">
            <ItemMedia>
              <Bell />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Focus-visible</ItemTitle>
              <ItemDescription>Simulated: what a keyboard user sees on the row</ItemDescription>
            </ItemContent>
            <ChevronRight className="size-4 text-subtle-foreground" />
          </a>
        </Item>
        <Item asChild selected>
          <button type="button" aria-pressed>
            <ItemMedia>
              <Check />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Selected row</ItemTitle>
              <ItemDescription>data-selected, muted tint</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="secondary">Current plan</Badge>
            </ItemActions>
          </button>
        </Item>
        <Item disabled>
          <ItemMedia>
            <PersonAvatar name="Sam Lee" imageUrl={PEOPLE[1]?.imageUrl} size="md" decorative />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Disabled row</ItemTitle>
            <ItemDescription>Muted, no hover or clicks; the badge says why</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary">On campaign</Badge>
          </ItemActions>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle>Title only</ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>
  ),
};

export const People: Story = {
  render: () => (
    <ItemGroup className="max-w-xl" asChild>
      <ul>
        {PEOPLE.map((person, index) => (
          <Item key={person.id} asChild>
            <li>
              <ItemMedia>
                <PersonAvatar name={person.name} imageUrl={person.imageUrl} size="md" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{person.name}</ItemTitle>
                <ItemDescription>{email(person.name)}</ItemDescription>
              </ItemContent>
              <ItemActions>
                {index === 3 ? (
                  <StatusDot tone="warning" label="Invite pending" />
                ) : (
                  <Badge variant="secondary">{index === 0 ? "Admin" : "Editor"}</Badge>
                )}
                <IconButton label="More actions" variant="ghost" size="icon-sm">
                  <MoreHorizontal />
                </IconButton>
              </ItemActions>
            </li>
          </Item>
        ))}
      </ul>
    </ItemGroup>
  ),
};

export const LinkRows: Story = {
  render: () => (
    <ItemGroup className="max-w-xl">
      {SETTINGS.map(({ label, description, icon: Icon }, index) => (
        <Item key={label} asChild>
          <a href={`#${label.toLowerCase()}`} aria-current={index === 0 ? "page" : undefined}>
            <ItemMedia>
              <Icon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{label}</ItemTitle>
              <ItemDescription>{description}</ItemDescription>
            </ItemContent>
            <ChevronRight className="size-4 text-subtle-foreground" />
          </a>
        </Item>
      ))}
    </ItemGroup>
  ),
};

/** Rows as a single choice: each row is a label around a native radio, `selected` on the picked one. */
export const Selectable: Story = {
  render: function SelectableStory() {
    const [planId, setPlanId] = useState("growth");
    return (
      <ItemGroup className="max-w-xl" role="radiogroup" aria-label="Plan">
        {PLANS.map((plan) => {
          const selected = plan.id === planId;
          return (
            <Item key={plan.id} asChild selected={selected}>
              <label>
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={selected}
                  onChange={() => setPlanId(plan.id)}
                  className="sr-only"
                />
                <ItemContent>
                  <ItemTitle>{plan.name}</ItemTitle>
                  <ItemDescription>{plan.description}</ItemDescription>
                </ItemContent>
                {selected ? <Check className="size-4 text-foreground" /> : null}
              </label>
            </Item>
          );
        })}
      </ItemGroup>
    );
  },
};

export const WithActions: Story = {
  render: () => (
    <ItemGroup className="max-w-xl">
      <Item>
        <ItemContent>
          <ItemTitle>Connect TikTok Business</ItemTitle>
          <ItemDescription>Pull spend and views for every Spark Ad.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="secondary">
            Connect
          </Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Meta Ads</ItemTitle>
          <ItemDescription>Connected by Alex Morgan on Nov 4, 2026</ItemDescription>
        </ItemContent>
        <ItemActions>
          <StatusDot tone="success" label="Connected" />
          <Button size="sm" variant="ghost">
            Disconnect
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
};

const REQUESTS = [
  {
    id: "hugo",
    name: "Hugo Laurent",
    role: "Copywriter, IC2",
    from: "$58,000",
    to: "$61,480",
    change: "+6%",
    aside: "Due Apr 30",
    overdue: false,
  },
  {
    id: "ben",
    name: "Ben Okafor",
    role: "Motion Designer, IC3",
    from: "$70,000",
    to: "$77,700",
    change: "+11%",
    aside: "9 days",
    overdue: true,
  },
  {
    id: "mei",
    name: "Mei Tanaka",
    role: "Illustrator, IC2",
    from: "$56,500",
    to: "$59,890",
    change: "+6%",
    aside: "Priya Shah",
    overdue: false,
  },
];

type Request = (typeof REQUESTS)[number];

function ChangeColumn({ request }: { request: Request }) {
  return (
    <ItemColumn width="lg">
      <span className="text-muted-foreground">{request.from}</span>
      <ArrowRight aria-label="to" className="size-3.5 text-muted-foreground" />
      <span className="font-medium">{request.to}</span>
      <span className="font-medium">{request.change}</span>
    </ItemColumn>
  );
}

function RequestAside({ request }: { request: Request }) {
  return request.overdue ? (
    <Badge variant="warning">
      <Clock aria-hidden />
      {request.aside}
    </Badge>
  ) : (
    <span className="text-sm whitespace-nowrap text-muted-foreground">{request.aside}</span>
  );
}

/** `ItemColumn` lines a figure up across rows from md (same `width` on every row; give the actions a fixed width too when their content varies). On a phone the column drops under the description and the actions stay top-right: shrink the viewport to see it. */
export const Columns: Story = {
  render: () => (
    <ItemGroup className="max-w-4xl">
      {REQUESTS.map((request) => (
        <Item key={request.id} asChild>
          <a href={`#${request.id}`}>
            <ItemMedia>
              <PersonAvatar name={request.name} size="md" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{request.name}</ItemTitle>
              <ItemDescription>{request.role}</ItemDescription>
            </ItemContent>
            <ChangeColumn request={request} />
            <ItemActions className="md:w-28 md:justify-end">
              <RequestAside request={request} />
            </ItemActions>
          </a>
        </Item>
      ))}
    </ItemGroup>
  ),
};

/** A batch queue: `ItemControl` holds the checkbox at the start and `ItemLink` makes the rest of the row open the record, so the checkbox is never nested in a link. The row shares the link's hover and focus ring. */
export const BatchSelect: Story = {
  render: function BatchSelectStory() {
    const [selected, setSelected] = useState<string[]>(["ben"]);
    const toggle = (id: string) =>
      setSelected((current) =>
        current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
      );
    return (
      <ItemGroup className="max-w-4xl">
        {REQUESTS.map((request) => (
          <Item key={request.id} selected={selected.includes(request.id)}>
            <ItemControl>
              <Checkbox
                checked={selected.includes(request.id)}
                onCheckedChange={() => toggle(request.id)}
                aria-label={`Select ${request.name}`}
              />
            </ItemControl>
            <ItemMedia>
              <PersonAvatar name={request.name} size="md" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                <ItemLink href={`#${request.id}`}>{request.name}</ItemLink>
              </ItemTitle>
              <ItemDescription>{request.role}</ItemDescription>
            </ItemContent>
            <ChangeColumn request={request} />
            <ItemActions className="md:w-28 md:justify-end">
              <RequestAside request={request} />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    );
  },
};
