import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BarChart3,
  CircleCheck,
  Download,
  FileText,
  Filter,
  Images,
  Link2,
  MessagesSquare,
  MoreHorizontal,
  Sparkles,
  Tag,
} from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertTitle } from "../src/components/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "../src/components/avatar";
import { Badge } from "../src/components/badge";
import { Breadcrumb } from "../src/components/breadcrumb";
import { Button } from "../src/components/button";
import { Calendar } from "../src/components/calendar";
import { Card } from "../src/components/card";
import { Checkbox } from "../src/components/checkbox";
import { Chip } from "../src/components/chip";
import {
  CollapsibleBody,
  CollapsibleHeader,
  CollapsibleSection,
} from "../src/components/collapsible-section";
import { DatePicker } from "../src/components/date-picker";
import { DescriptionItem, DescriptionList } from "../src/components/description-list";
import { DropzoneFile } from "../src/components/dropzone";
import { Field, FieldDescription, FieldError, FieldLabel } from "../src/components/field";
import { IconButton } from "../src/components/icon-button";
import { InfoHint } from "../src/components/info-hint";
import { Input } from "../src/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../src/components/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../src/components/item";
import { Kbd, KbdGroup } from "../src/components/kbd";
import { Label } from "../src/components/label";
import { LabeledField } from "../src/components/labeled-field";
import { MemberAvatarStack } from "../src/components/member-avatar-stack";
import { Meter } from "../src/components/meter";
import { NavLinks } from "../src/components/nav-links";
import { NumberDot } from "../src/components/number-dot";
import { Pagination } from "../src/components/pagination";
import { PersonAvatar } from "../src/components/person-identity";
import { Progress } from "../src/components/progress";
import { RadioGroup, RadioGroupItem } from "../src/components/radio-group";
import { SearchInput } from "../src/components/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../src/components/select";
import { Separator } from "../src/components/separator";
import { Spinner } from "../src/components/spinner";
import { Stat, StatDelta, StatLabel, StatMeta, StatValue } from "../src/components/stat";
import { StatusDot } from "../src/components/status-dot";
import { Switch } from "../src/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/components/table";
import { Tabs, TabsList } from "../src/components/tabs";
import { TextLink } from "../src/components/text-link";
import { Textarea } from "../src/components/textarea";
import { TogglePills } from "../src/components/toggle-pills";
import { PEOPLE } from "./lib/fixtures";
import { PLATFORMS } from "./lib/form-fixtures";

const fieldtripLogoLight = new URL(
  "../../../.github/assets/fieldtrip-logo-light.svg",
  import.meta.url,
).href;

const meta = {
  title: "Showcase/Component Grid",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Tile({ children }: { children: ReactNode }) {
  return (
    <Card className="mb-5 break-inside-avoid gap-3 p-5 shadow-[0_24px_40px_-28px_rgb(0_0_0/0.3)]">
      {children}
    </Card>
  );
}

function ToggleRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={checked} aria-label={label} />
    </div>
  );
}

function CheckRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox defaultChecked={checked} aria-label={label} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

const TEAM_ROLES = ["Owner", "Editor", "Viewer"];
const TEAM = PEOPLE.slice(0, 3).map((person, index) => ({ ...person, role: TEAM_ROLES[index] }));

const TILES: ReactNode[] = [
  <Tile key="stat">
    <Stat>
      <StatLabel>Total paid</StatLabel>
      <StatValue size="lg">$48,200</StatValue>
      <StatDelta value="+12%" direction="up" />
      <StatMeta>$1,205 / piece across 40 pieces</StatMeta>
    </Stat>
    <Meter value={72} label="72%" />
  </Tile>,
  <Tile key="buttons">
    <div className="flex flex-wrap gap-2">
      <Button>Approve request</Button>
      <Button variant="outline">
        <Download /> Export
      </Button>
    </div>
  </Tile>,
  <Tile key="team">
    <ItemGroup>
      {TEAM.map((person) => (
        <Item key={person.id}>
          <ItemMedia>
            <PersonAvatar name={person.name} imageUrl={person.imageUrl} size="md" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{person.name}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary">{person.role}</Badge>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  </Tile>,
  <Tile key="search">
    <SearchInput value="" onChange={() => {}} placeholder="Search creators" />
  </Tile>,
  <Tile key="tabs">
    <Tabs defaultValue="sourcing">
      <TabsList
        fullWidth
        tabs={[
          { value: "all", label: "All" },
          { value: "sourcing", label: "Sourcing" },
          { value: "review", label: "In review" },
        ]}
      />
    </Tabs>
  </Tile>,
  <Tile key="badges">
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" dot>
        Delivered
      </Badge>
      <Badge variant="warning" dot>
        In review
      </Badge>
      <Badge variant="info" dot>
        Sourcing
      </Badge>
      <Badge variant="destructive" dot>
        Overdue
      </Badge>
    </div>
  </Tile>,
  <Tile key="calendar">
    <Calendar
      mode="range"
      className="p-0"
      defaultMonth={new Date(2027, 3, 1)}
      selected={{ from: new Date(2027, 3, 12), to: new Date(2027, 3, 23) }}
    />
  </Tile>,
  <Tile key="switches">
    <ToggleRow label="Notify in Slack" checked />
    <ToggleRow label="Auto-approve drafts" checked={false} />
    <ToggleRow label="Whitelist content" checked />
  </Tile>,
  <Tile key="files">
    <ItemGroup>
      <DropzoneFile name="hook-v2.mp4" size={8_400_000} progress={64} />
      <DropzoneFile name="unboxing.mov" size={96_400_000} />
    </ItemGroup>
  </Tile>,
  <Tile key="alert">
    <Alert variant="success">
      <CircleCheck />
      <AlertTitle>Contract signed</AlertTitle>
    </Alert>
  </Tile>,
  <Tile key="input">
    <Label htmlFor="showcase-campaign">Campaign name</Label>
    <Input id="showcase-campaign" defaultValue="Spring launch 2027" />
  </Tile>,
  <Tile key="radio">
    <RadioGroup defaultValue="On screen" aria-label="Placement">
      {["On screen", "Voiceover", "Caption"].map((placement) => (
        <div key={placement} className="flex items-center gap-3">
          <RadioGroupItem value={placement} id={`showcase-${placement}`} />
          <Label htmlFor={`showcase-${placement}`} className="font-normal">
            {placement}
          </Label>
        </div>
      ))}
    </RadioGroup>
  </Tile>,
  <Tile key="facts">
    <DescriptionList>
      <DescriptionItem label="Priority">
        <Badge variant="destructive" dot>
          Urgent
        </Badge>
      </DescriptionItem>
      <DescriptionItem label="Deadline">Apr 30, 2027</DescriptionItem>
      <DescriptionItem label="Budget">$12,000</DescriptionItem>
    </DescriptionList>
  </Tile>,
  <Tile key="pills">
    <TogglePills
      aria-label="Platforms"
      options={PLATFORMS.slice(0, 3)}
      selected={["TikTok", "Instagram"]}
      onToggle={() => {}}
    />
  </Tile>,
  <Tile key="checks">
    <CheckRow label="Product shipped" checked />
    <CheckRow label="Disclosure declared" checked />
    <CheckRow label="Music rights cleared" checked={false} />
  </Tile>,
  <Tile key="pieces">
    <div className="grid grid-cols-2 gap-4">
      <Stat>
        <StatLabel>Pieces delivered</StatLabel>
        <StatValue>40</StatValue>
        <StatDelta value="-3" direction="down" />
      </Stat>
      <Stat>
        <StatLabel>Turnaround</StatLabel>
        <StatValue>4.2d</StatValue>
        <StatDelta value="-0.8d" direction="down" tone="positive" />
      </Stat>
    </div>
  </Tile>,
  <Tile key="members">
    <MemberAvatarStack members={PEOPLE} showNames />
  </Tile>,
  <Tile key="brief">
    <Label htmlFor="showcase-brief">Brief</Label>
    <Textarea
      id="showcase-brief"
      defaultValue="Unboxing in natural light. Show the ring on the hand within the first three seconds."
    />
  </Tile>,
  <Tile key="progress">
    <div className="flex items-center justify-between text-sm">
      <span>Rendering videos</span>
      <span className="text-muted-foreground tabular-nums">64%</span>
    </div>
    <Progress value={64} aria-label="Rendering videos" />
  </Tile>,
  <Tile key="status">
    {[
      { tone: "success", label: "Active", count: 128 },
      { tone: "warning", label: "Pending", count: 14 },
      { tone: "info", label: "Syncing", count: 3 },
    ].map((row) => (
      <div key={row.label} className="flex items-center justify-between">
        <StatusDot
          tone={row.tone as "success" | "warning" | "info"}
          label={row.label}
          pulse={row.tone === "success"}
        />
        <span className="text-sm text-muted-foreground tabular-nums">{row.count}</span>
      </div>
    ))}
  </Tile>,
  <Tile key="chips">
    <div className="flex flex-wrap gap-2">
      <Chip icon={<Tag />}>Skincare</Chip>
      <Chip icon={<Sparkles />} onRemove={() => {}}>
        UGC
      </Chip>
      <Chip onRemove={() => {}}>Wellness</Chip>
    </div>
  </Tile>,
  <Tile key="loading">
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" disabled>
        <Spinner /> Saving
      </Button>
      <Button variant="destructive">Remove</Button>
    </div>
  </Tile>,
  <Tile key="kbd">
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">Command menu</span>
      <KbdGroup>
        <Kbd aria-label="Command">⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  </Tile>,
  <Tile key="nav">
    <NavLinks
      orientation="vertical"
      items={[
        { title: "Overview", icon: BarChart3 },
        { title: "Briefs", icon: FileText, count: 4 },
        { title: "Content", icon: Images, count: 128, isActive: true },
        { title: "Messages", icon: MessagesSquare },
      ]}
      renderLink={(item, content) => <a href={`#${item.title}`}>{content}</a>}
    />
  </Tile>,
  <Tile key="table">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Creator</TableHead>
          <TableHead className="text-right">Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ["Jade Rivera", "$450"],
          ["Sofia Reyes", "$620"],
          ["Noah Kim", "$380"],
        ].map(([name, rate]) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell className="text-right tabular-nums">{rate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Tile>,
  <Tile key="select">
    <Label>Priority</Label>
    <Select defaultValue="high">
      <SelectTrigger className="w-full" aria-label="Priority">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="high">High</SelectItem>
        <SelectItem value="low">Low</SelectItem>
      </SelectContent>
    </Select>
  </Tile>,
  <Tile key="date">
    <Label>Deadline</Label>
    <DatePicker value="2027-04-30" onChange={() => {}} className="w-full" />
  </Tile>,
  <Tile key="url">
    <InputGroup>
      <InputGroupAddon>
        <Link2 />
      </InputGroupAddon>
      <InputGroupInput aria-label="Profile link" defaultValue="tiktok.com/@jaderivera" />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>CAD</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Salary" className="tabular-nums" defaultValue="87,360" />
    </InputGroup>
  </Tile>,
  <Tile key="avatars">
    <AvatarGroup>
      {PEOPLE.slice(0, 4).map((person) => (
        <Avatar key={person.id} size="md">
          <AvatarImage src={person.imageUrl ?? undefined} alt={person.name} />
          <AvatarFallback>{person.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+8</AvatarGroupCount>
    </AvatarGroup>
  </Tile>,
  <Tile key="breadcrumb">
    <Breadcrumb
      links={[
        { label: "Clients", href: "#clients" },
        { label: "Nutramax", href: "#nutramax" },
      ]}
      page="Concept 3"
    />
  </Tile>,
  <Tile key="pagination">
    <Pagination page={3} pageSize={25} total={2847} getHref={(page) => `?page=${page}`} />
  </Tile>,
  <Tile key="icon-buttons">
    <div className="flex items-center gap-2">
      <IconButton label="Filters" variant="outline">
        <Filter />
      </IconButton>
      <IconButton label="More" variant="ghost">
        <MoreHorizontal />
      </IconButton>
      <span className="flex items-center gap-2 text-sm">
        Inbox <NumberDot count={4} />
      </span>
      <InfoHint label="What the inbox holds">Requests waiting on you.</InfoHint>
    </div>
  </Tile>,
  <Tile key="links">
    <div className="flex items-center gap-4 text-sm">
      <TextLink href="#help">Help</TextLink>
      <Separator orientation="vertical" className="h-4" />
      <TextLink href="#privacy">Privacy</TextLink>
      <Separator orientation="vertical" className="h-4" />
      <TextLink href="#terms">Terms</TextLink>
    </div>
  </Tile>,
  <Tile key="field-error">
    <Field data-invalid>
      <FieldLabel htmlFor="showcase-email" required>
        Email
      </FieldLabel>
      <Input id="showcase-email" aria-invalid defaultValue="jade@" />
      <FieldError>Enter a full email address.</FieldError>
    </Field>
  </Tile>,
  <Tile key="field-hint">
    <Field>
      <FieldLabel htmlFor="showcase-client">Full client name</FieldLabel>
      <Input id="showcase-client" defaultValue="Oura" />
      <FieldDescription>The client&apos;s full name.</FieldDescription>
    </Field>
  </Tile>,
  <Tile key="labeled">
    <div className="grid grid-cols-2 gap-4">
      <LabeledField label="Followers" value="32,086" />
      <LabeledField label="Engagement" value="4.8%" />
    </div>
  </Tile>,
  <Tile key="collapsible">
    <CollapsibleSection defaultOpen divider={false} chevron="start" size="sm">
      <CollapsibleHeader meta="Nov 18, 2026">Submission 2</CollapsibleHeader>
      <CollapsibleBody>
        <div className="grid grid-cols-3 gap-2">
          {["Hook", "Demo", "Call to action"].map((clip) => (
            <div
              key={clip}
              className="flex aspect-[9/16] items-end rounded-md bg-muted p-2 text-2xs text-muted-foreground"
            >
              {clip}
            </div>
          ))}
        </div>
      </CollapsibleBody>
    </CollapsibleSection>
  </Tile>,
];

export const Cover: Story = {
  render: () => (
    <div className="relative flex h-[1115px] w-[2400px] overflow-hidden bg-background">
      <div className="relative z-10 flex w-[880px] shrink-0 flex-col justify-between bg-[var(--color-fieldtrip-ink,#191910)] p-20 text-white">
        <img src={fieldtripLogoLight} alt="Fieldtrip" className="h-7 w-auto self-start" />
        <div className="flex flex-col">
          <h1 className="font-serif text-[128px] leading-[0.95] tracking-tight">Toolkit</h1>
          <p className="mt-6 max-w-[520px] text-[22px] leading-normal text-balance text-white/60">
            Shared packages for every Fieldtrip app: config, server building blocks, UI and agent
            standards.
          </p>
        </div>
      </div>
      <div className="relative flex-1 bg-muted">
        <div className="absolute -top-2 left-16 h-[1280px] w-[2000px] origin-top-left scale-125 columns-6 gap-5 [column-fill:auto]">
          {TILES}
        </div>
      </div>
    </div>
  ),
};
