import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Ban,
  Banana,
  BugPlay,
  ChevronRight,
  CircleAlert,
  FileText,
  Film,
  Flag,
  HardDrive,
  ImageIcon,
  Languages,
  LogOut,
  MoreHorizontal,
  NotebookPen,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Settings,
  Trash2,
  TriangleAlert,
  Type,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../../../src/components/alert";
import { AppShell, AppShellTitle } from "../../../src/components/app-shell";
import { Badge } from "../../../src/components/badge";
import { Button } from "../../../src/components/button";
import {
  CollapsibleBody,
  CollapsibleSection,
  CollapsibleTrigger,
  useCollapsible,
} from "../../../src/components/collapsible-section";
import { DestructiveActionDialog } from "../../../src/components/destructive-action-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../src/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../src/components/dropdown-menu";
import { EmptyState } from "../../../src/components/empty-state";
import { IconButton } from "../../../src/components/icon-button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "../../../src/components/item";
import { Inline, Stack } from "../../../src/components/layout";
import { MediaFrame } from "../../../src/components/media-frame";
import { MultiSelectOptionList } from "../../../src/components/multi-select-popover";
import { NavUser } from "../../../src/components/nav-user";
import { PersonIdentity } from "../../../src/components/person-identity";
import { Popover, PopoverContent, PopoverTrigger } from "../../../src/components/popover";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../src/components/sidebar";
import { Spinner } from "../../../src/components/spinner";
import { StatusDot } from "../../../src/components/status-dot";
import { Tabs, TabsContent, TabsList } from "../../../src/components/tabs";
import { TextLink } from "../../../src/components/text-link";
import { Tooltip } from "../../../src/components/tooltip";
import { cn } from "../../../src/lib/utils";
import {
  ACTIVE_SESSION,
  type AssetType,
  type BatchStatus,
  CANCELLED_RUN,
  CAPTION_RUN,
  type CheckRow,
  type CheckTab,
  ERROR_RUN,
  type Finding,
  type FindingField,
  HOLIDAY_VIDEO_RUN,
  MY_SESSIONS,
  PROCESSING_RUN,
  PRODUCTS,
  PROOF_USER,
  RETRYING_RUN,
  type ResultTier,
  type ReviewRun,
  SESSION_LANGUAGES,
  type SidebarSession,
  STAGED_ASSETS,
  STALE_RULES_RUN,
  STATIC_IMAGE_RUN,
  type StagedAsset,
  TEAM_SESSIONS,
} from "../../lib/proof-agent-fixtures";

const ASSET_ICON: Record<AssetType, typeof Film> = { video: Film, image: ImageIcon, text: Type };
const ASSET_TYPE_LABEL: Record<AssetType, string> = {
  video: "Video",
  image: "Image",
  text: "Text",
};

const resultTier = (run: ReviewRun): ResultTier | undefined => {
  if (run.status !== "complete" || !run.tabs) return undefined;
  const findings = run.tabs.flatMap((tab) => tab.findings);
  if (findings.some((finding) => finding.tier === "issue")) return "issue";
  if (
    findings.length > 0 ||
    run.tabs.some((tab) => tab.checkRows.some((row) => row.verdict === "unsure"))
  )
    return "unsure";
  return "pass";
};

function ProofSidebarHeader() {
  return (
    <Inline justify="between" wrap={false} className="pe-1.5">
      <AppShellTitle>Proof</AppShellTitle>
      <IconButton label="Settings" size="icon-sm">
        <Settings />
      </IconButton>
    </Inline>
  );
}

function BatchIndicator({ status }: { status: BatchStatus }) {
  if (status === "processing") return <Spinner label="Batch processing" />;
  if (status === "complete")
    return <StatusDot tone="success" label={<span className="sr-only">Batch complete</span>} />;
  if (status === "error")
    return <StatusDot tone="destructive" label={<span className="sr-only">Batch errored</span>} />;
  return null;
}

function SessionMenu({ title }: { title: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dots" aria-label={`Open session menu for ${title}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem>
          <Pencil />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// toolkit-gap: AppNav rows take an icon and a label; a Proof session row is its title, the client code and the batch's status
function SessionRow({
  session,
  active,
  canManage,
}: {
  session: SidebarSession;
  active: boolean;
  canManage: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} className="pe-9">
        <a href={`#${session.id}`} aria-current={active ? "page" : undefined}>
          <span className="min-w-0 flex-1 truncate">{session.title}</span>
          <Badge variant="secondary" size="sm">
            {session.clientCode}
          </Badge>
        </a>
      </SidebarMenuButton>
      <div className="absolute inset-y-0 end-2 grid items-center *:col-start-1 *:row-start-1">
        <span
          className={cn(
            "flex justify-self-end",
            canManage &&
              "pointer-fine:group-hover/menu-item:opacity-0 pointer-fine:group-focus-within/menu-item:opacity-0",
          )}
        >
          <BatchIndicator status={session.batchStatus} />
        </span>
        {canManage ? <SessionMenu title={session.title} /> : null}
      </div>
    </SidebarMenuItem>
  );
}

// toolkit-gap: AppNav's foldable label is the uppercase overline; Proof's groups fold the same way, rows differ (see SessionRow)
function SessionSection({
  title,
  sessions,
  defaultOpen,
  canManage,
}: {
  title: string;
  sessions: SidebarSession[];
  defaultOpen: boolean;
  canManage: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <SidebarGroup className="py-1">
      <SidebarGroupLabel asChild className="gap-1">
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span className="truncate">{title}</span>
          <ChevronRight
            aria-hidden
            className={cn(
              "size-3! transition-transform duration-(--duration-base) ease-out-expo",
              open && "rotate-90",
            )}
          />
        </button>
      </SidebarGroupLabel>
      {open ? (
        <SidebarMenu className="gap-0.5">
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              active={session.id === "s1"}
              canManage={canManage}
            />
          ))}
        </SidebarMenu>
      ) : null}
    </SidebarGroup>
  );
}

function ProofSidebar({ sessions = true }: { sessions?: boolean }) {
  return (
    <>
      <SidebarGroup className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Create a new session">
              <Plus />
              <span>New session</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      {sessions ? (
        <>
          <SessionSection title="My Sessions" sessions={MY_SESSIONS} defaultOpen canManage />
          <SessionSection
            title="Team Sessions"
            sessions={TEAM_SESSIONS}
            defaultOpen={false}
            canManage={false}
          />
        </>
      ) : (
        <p className="px-2 py-6 text-center text-sm text-muted-foreground">No sessions yet.</p>
      )}
    </>
  );
}

function SessionLanguageMenu() {
  const [language, setLanguage] = useState(ACTIVE_SESSION.language);
  const label = SESSION_LANGUAGES.find((option) => option.value === language)?.label;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label={`Language: ${label}`} size="icon-sm">
          <Languages />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Session language</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          {SESSION_LANGUAGES.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SessionProductPicker() {
  const [productIds, setProductIds] = useState(["Oura Ring 4"]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          label="Select products"
          size="icon-sm"
          variant={productIds.length > 0 ? "default" : "secondary"}
        >
          <Package />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <MultiSelectOptionList
          options={PRODUCTS.map((product) => ({ value: product, label: product }))}
          selectedValues={productIds}
          onToggle={(product) =>
            setProductIds((current) =>
              current.includes(product)
                ? current.filter((id) => id !== product)
                : [...current, product],
            )
          }
          emptyMessage="No products found."
          idPrefix="session-product"
        />
      </PopoverContent>
    </Popover>
  );
}

function SessionHeader({ canManage }: { canManage: boolean }) {
  return (
    <>
      <Inline gap="sm" wrap={false} className="min-w-0 flex-1">
        <Inline gap="xs" wrap={false} className="shrink-0">
          <span className="text-sm font-medium">{ACTIVE_SESSION.clientName}</span>
          <Tooltip content="Client code">
            <Badge variant="secondary">{ACTIVE_SESSION.clientCode}</Badge>
          </Tooltip>
        </Inline>
        <ChevronRight aria-hidden className="size-3.5 shrink-0 text-subtle-foreground" />
        <span className="truncate text-sm font-medium">{ACTIVE_SESSION.title}</span>
      </Inline>
      <Inline gap="sm" wrap={false} className="shrink-0">
        <Tooltip content="Created by">
          <div className="hidden md:flex">
            <PersonIdentity
              name={ACTIVE_SESSION.createdBy.name}
              imageUrl={ACTIVE_SESSION.createdBy.imageUrl}
            />
          </div>
        </Tooltip>
        <Dialog>
          <DialogTrigger asChild>
            <IconButton label="Session instruction" size="icon-sm">
              <NotebookPen />
            </IconButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Session instruction</DialogTitle>
              <DialogDescription>Extra context for every review in this session.</DialogDescription>
            </DialogHeader>
            <p className="text-sm whitespace-pre-wrap">{ACTIVE_SESSION.instruction}</p>
          </DialogContent>
        </Dialog>
        <IconButton label="Client settings" size="icon-sm">
          <Settings />
        </IconButton>
        {canManage ? (
          <>
            <SessionLanguageMenu />
            <SessionProductPicker />
          </>
        ) : null}
      </Inline>
    </>
  );
}

function ProofShell({
  children,
  canManage = true,
  session = true,
}: {
  children: ReactNode;
  canManage?: boolean;
  session?: boolean;
}) {
  return (
    <AppShell
      variant="floating"
      sidebarWidth="260px"
      headerVariant="plain"
      sidebarHeader={<ProofSidebarHeader />}
      sidebar={<ProofSidebar sessions={session} />}
      sidebarFooter={
        <NavUser {...PROOF_USER}>
          <DropdownMenuItem>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </NavUser>
      }
      header={session ? <SessionHeader canManage={canManage} /> : undefined}
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
    </AppShell>
  );
}

// signature-surface: the dot grid under the session workspace, faded towards the edges
function WorkspaceGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-border)_85%,transparent)_1.25px,transparent_1.75px)] bg-size-[20px_20px] mask-[radial-gradient(ellipse_at_center,black_0%,black_58%,transparent_100%)]"
    />
  );
}

// signature-surface: the status gradient, a run card tinted from the top by its strongest finding
const TIER_SURFACE: Record<ResultTier, string> = {
  issue: "border-destructive/25 bg-linear-to-b from-destructive/6 to-card to-[6rem]",
  unsure: "border-warning/30 bg-linear-to-b from-warning/8 to-card to-[6rem]",
  pass: "border-success/25 bg-linear-to-b from-success/6 to-card to-[6rem]",
};

function RowChevron() {
  const { open } = useCollapsible();
  return (
    <ChevronRight
      aria-hidden
      className={cn(
        "size-4 shrink-0 text-muted-foreground transition-[transform,color] duration-(--duration-base) ease-out-expo group-hover/row-header:text-foreground",
        open && "rotate-90",
      )}
    />
  );
}

// toolkit-gap: CollapsibleHeader places the chevron before its actions; Proof's run and finding rows end on the chevron, after the actions
function RowHeader({
  label,
  children,
  trailing,
  className,
}: {
  label: string;
  children: ReactNode;
  trailing: ReactNode;
  className?: string;
}) {
  const { open } = useCollapsible();
  return (
    <div
      className={cn(
        "group/row-header relative isolate flex flex-wrap items-center gap-3 p-(--collapsible-pad)",
        className,
      )}
    >
      <CollapsibleTrigger className="absolute inset-0 rounded-[inherit] outline-none focus-visible:focus-ring-inset">
        <span className="sr-only">
          {open ? "Collapse" : "Expand"} {label}
        </span>
      </CollapsibleTrigger>
      <div className="pointer-events-none relative z-10 flex min-w-48 flex-1 items-center gap-3 *:pointer-events-auto">
        {children}
      </div>
      <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2">
        {trailing}
        <span className="pointer-events-none">
          <RowChevron />
        </span>
      </div>
    </div>
  );
}

const HOVER_REVEAL =
  "pointer-fine:opacity-0 transition-opacity duration-(--duration-fast) group-hover/collapsible-section:opacity-100 has-focus-visible:opacity-100 has-data-[state=open]:opacity-100";

function RunStatusBadge({ run }: { run: ReviewRun }) {
  const tier = resultTier(run);
  if (tier === "issue")
    return (
      <Badge variant="destructive" dot>
        Needs revision
      </Badge>
    );
  if (tier === "unsure")
    return (
      <Badge variant="warning" dot>
        Needs revision
      </Badge>
    );
  if (tier === "pass")
    return (
      <Badge variant="success" dot>
        Pass
      </Badge>
    );
  if (run.status === "processing")
    return (
      <Badge variant="info" dot>
        Analysing
      </Badge>
    );
  if (run.status === "error")
    return (
      <Tooltip content={run.errorMessage}>
        <Badge variant="destructive" dot>
          Error
        </Badge>
      </Tooltip>
    );
  return (
    <Badge variant="secondary" dot>
      Cancelled
    </Badge>
  );
}

function RunActions({ run }: { run: ReviewRun }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  if (run.status === "processing") {
    return (
      <span className={HOVER_REVEAL}>
        <IconButton label="Cancel run" variant="outline" size="icon-xs">
          <Ban />
        </IconButton>
      </span>
    );
  }
  // Hover-revealed actions keep their slot so nothing shifts on hover; they take the outer side, so a
  // standing one (the stale-rules rerun) sits beside the time instead of across an empty slot.
  return (
    <>
      <span className={HOVER_REVEAL}>
        <IconButton
          label="Delete run"
          variant="outline"
          size="icon-xs"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 />
        </IconButton>
      </span>
      {run.rulesChanged ? (
        <IconButton
          label="Rerun with updated rules"
          tooltip="Client rules changed after this run. Rerun to check against current rules."
          tone="warning"
          size="icon-2xs"
        >
          <TriangleAlert />
        </IconButton>
      ) : (
        <span className={HOVER_REVEAL}>
          <IconButton label="Rerun" tooltip="Rerun run" variant="outline" size="icon-xs">
            <RotateCcw />
          </IconButton>
        </span>
      )}
      <DestructiveActionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete run?"
        description="This will remove the workflow run and its results from this session."
        onConfirm={() => setDeleteOpen(false)}
      />
    </>
  );
}

function AssetTypeChip({ run }: { run: ReviewRun }) {
  if (run.assetType === "text") return null;
  const label = run.integration ?? ASSET_TYPE_LABEL[run.assetType];
  const Icon = run.integration ? HardDrive : ASSET_ICON[run.assetType];
  return (
    <Tooltip content={label}>
      <Badge variant="secondary" size="sm" aria-label={label}>
        <Icon aria-hidden />
      </Badge>
    </Tooltip>
  );
}

function RunCardHeader({ run, canManage }: { run: ReviewRun; canManage: boolean }) {
  const tier = resultTier(run);
  const { open } = useCollapsible();
  return (
    <RowHeader
      label={run.assetLabel}
      className={cn(open && "pb-4")}
      trailing={
        <>
          {canManage ? <RunActions run={run} /> : null}
          <Tooltip content="Last run">
            <span className="pointer-events-auto ms-1 text-xs text-muted-foreground">
              {run.lastRun}
            </span>
          </Tooltip>
        </>
      }
    >
      <MediaFrame
        aspect="square"
        alt={run.assetLabel}
        icon={run.integration ? HardDrive : ASSET_ICON[run.assetType]}
        loading={run.status === "processing"}
        className={cn("size-13", tier === "pass" && "bg-success/15 text-success")}
      />
      <Stack gap="sm" className="min-w-0">
        <TextLink tone="default" href="#asset" className="truncate text-sm font-medium">
          {run.assetLabel}
        </TextLink>
        <Inline gap="xs">
          <AssetTypeChip run={run} />
          <RunStatusBadge run={run} />
          <Badge variant="outline">{run.language}</Badge>
        </Inline>
      </Stack>
    </RowHeader>
  );
}

function FeedbackFlag({ reveal }: { reveal: boolean }) {
  return (
    <span className={cn(reveal && HOVER_REVEAL)}>
      <IconButton label="Report a problem" variant="ghost" size="icon-xs">
        <Flag />
      </IconButton>
    </span>
  );
}

function FieldValue({ field }: { field: FindingField }) {
  if (!field.href) return field.value;
  return (
    <TextLink tone="default" href={field.href} className="tabular-nums">
      {field.value}
    </TextLink>
  );
}

// toolkit-gap: DescriptionList puts the value at the row's end; Proof's finding fields keep a fixed label column with the value beside it
function FindingFields({ fields }: { fields: FindingField[] }) {
  return (
    <dl className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-start gap-x-3 gap-y-2 text-sm">
      {fields.map((field) => (
        <div key={field.label} className="contents">
          <dt className="text-subtle-foreground">{field.label}</dt>
          <dd className="min-w-0 break-words">
            <FieldValue field={field} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FindingRow({
  finding,
  defaultOpen,
  canManage,
}: {
  finding: Finding;
  defaultOpen: boolean;
  canManage: boolean;
}) {
  return (
    <li>
      <CollapsibleSection size="sm" defaultOpen={defaultOpen}>
        <RowHeader
          label={finding.title}
          trailing={
            <>
              {canManage ? <FeedbackFlag reveal /> : null}
              {finding.issueType ? <Badge variant="outline">{finding.issueType}</Badge> : null}
              <Badge variant={finding.tier === "issue" ? "destructive" : "warning"} dot>
                {finding.tier === "issue" ? "flag" : "unsure"}
              </Badge>
            </>
          }
        >
          <span className="pointer-events-none truncate text-sm font-medium">{finding.title}</span>
        </RowHeader>
        <CollapsibleBody>
          <Stack gap="md">
            <p className="text-sm">{finding.narrative}</p>
            <FindingFields fields={finding.fields} />
          </Stack>
        </CollapsibleBody>
      </CollapsibleSection>
    </li>
  );
}

function CheckRowItem({ row, canManage }: { row: CheckRow; canManage: boolean }) {
  return (
    <Item>
      <ItemContent>
        <ItemTitle>{row.title}</ItemTitle>
        {row.description ? <ItemDescription>{row.description}</ItemDescription> : null}
      </ItemContent>
      <ItemActions>
        {canManage && row.verdict === "pass" ? <FeedbackFlag reveal={false} /> : null}
        <Badge variant={row.verdict === "pass" ? "success" : "warning"} dot>
          {row.verdict}
        </Badge>
      </ItemActions>
    </Item>
  );
}

function CheckTabContent({ tab, canManage }: { tab: CheckTab; canManage: boolean }) {
  return (
    <Stack gap="md">
      {tab.findings.length > 0 ? (
        <Stack asChild gap="md">
          <ul>
            {tab.findings.map((finding) => (
              <FindingRow
                key={finding.id}
                finding={finding}
                canManage={canManage}
                defaultOpen={tab.findings.length === 1 || finding.tier === "issue"}
              />
            ))}
          </ul>
        </Stack>
      ) : null}
      {tab.checkRows.length > 0 ? (
        <ItemGroup>
          {tab.checkRows.map((row) => (
            <CheckRowItem key={row.id} row={row} canManage={canManage} />
          ))}
        </ItemGroup>
      ) : null}
    </Stack>
  );
}

function ResultTabs({ tabs, canManage }: { tabs: CheckTab[]; canManage: boolean }) {
  return (
    <Tabs defaultValue={tabs[0]?.id}>
      {/* The default bg-muted track reads too dark over the status tint. */}
      <TabsList
        aria-label="Checks"
        className="bg-background inset-ring inset-ring-border"
        tabs={tabs.map((tab) => ({ value: tab.id, label: tab.label }))}
      />
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <CheckTabContent tab={tab} canManage={canManage} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

// toolkit-gap: no dashed placeholder panel for in-progress work (EmptyState frames with a solid border)
function ProcessingPanel({ progress }: { progress: NonNullable<ReviewRun["progress"]> }) {
  return (
    <div className="flex min-h-36 items-center justify-center rounded-lg border border-dashed border-border px-4 py-8">
      <Inline role="status" gap="xs" justify="center" className="text-sm text-muted-foreground">
        <span>{progress.label}...</span>
        {progress.attempt ? <span>Model busy, retrying (attempt {progress.attempt})</span> : null}
        <span className="text-subtle-foreground tabular-nums">{progress.elapsed}</span>
      </Inline>
    </div>
  );
}

function RunBody({ run, canManage }: { run: ReviewRun; canManage: boolean }) {
  if (run.status === "processing" && run.progress)
    return <ProcessingPanel progress={run.progress} />;
  if (run.status === "error") {
    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertDescription>{run.errorMessage}</AlertDescription>
      </Alert>
    );
  }
  if (run.status === "cancelled") {
    return (
      <Alert>
        <Ban />
        <AlertDescription>Cancelled.</AlertDescription>
      </Alert>
    );
  }
  return run.tabs ? <ResultTabs tabs={run.tabs} canManage={canManage} /> : null;
}

function RunCard({ run, canManage }: { run: ReviewRun; canManage: boolean }) {
  const tier = resultTier(run);
  return (
    <CollapsibleSection
      defaultOpen
      divider={false}
      variant="card"
      className={tier ? TIER_SURFACE[tier] : undefined}
    >
      <RunCardHeader run={run} canManage={canManage} />
      <CollapsibleBody>
        <RunBody run={run} canManage={canManage} />
      </CollapsibleBody>
    </CollapsibleSection>
  );
}

const ADD_ASSET_ACTIONS = [
  { label: "Add a Google Drive link", icon: HardDrive },
  { label: "Upload media", icon: ImageIcon },
  { label: "Add text", icon: FileText },
];

function AddAssetButtons() {
  return (
    <>
      {ADD_ASSET_ACTIONS.map((action) => (
        <IconButton key={action.label} label={action.label} variant="outline" size="icon-lg">
          <action.icon />
        </IconButton>
      ))}
    </>
  );
}

// toolkit-gap: Chip is one line; a staged asset is a taller pill with a round thumbnail, its name over its kind
function StagingChip({ asset }: { asset: StagedAsset }) {
  const Icon =
    asset.kind === "Google Drive" ? HardDrive : asset.kind === "Video" ? Film : ImageIcon;
  return (
    <Tooltip content={asset.name}>
      <span className="group/chip flex h-12 max-w-56 min-w-0 items-center gap-2 rounded-full border border-border bg-card pr-1 pl-1.5 shadow-hairline">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon aria-hidden className="size-4" />
        </span>
        <Stack gap="none" className="min-w-0">
          <span className="truncate text-sm font-medium">{asset.name}</span>
          <span className="text-xs text-muted-foreground">{asset.kind}</span>
        </Stack>
        <span className="pointer-fine:opacity-0 transition-opacity duration-(--duration-fast) group-hover/chip:opacity-100 has-focus-visible:opacity-100">
          <IconButton label="Remove staged item" variant="ghost" size="icon-sm">
            <X />
          </IconButton>
        </span>
      </span>
    </Tooltip>
  );
}

const VISIBLE_STAGED_LIMIT = 2;

function StagedTray({ staged }: { staged: StagedAsset[] }) {
  const overflow = staged.slice(VISIBLE_STAGED_LIMIT);
  return (
    <Inline gap="xs" justify="center" className="rounded-full bg-foreground/5 p-1.5">
      <Popover>
        <PopoverTrigger asChild>
          <IconButton label="Add asset" variant="outline" size="icon-lg">
            <Plus />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent side="top" className="flex w-auto gap-2">
          <AddAssetButtons />
        </PopoverContent>
      </Popover>
      {staged.slice(0, VISIBLE_STAGED_LIMIT).map((asset) => (
        <StagingChip key={asset.id} asset={asset} />
      ))}
      {overflow.length > 0 ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon-lg"
              aria-label={`Show ${overflow.length} more staged assets`}
            >
              +{overflow.length}
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="flex w-auto flex-col gap-2">
            {overflow.map((asset) => (
              <StagingChip key={asset.id} asset={asset} />
            ))}
          </PopoverContent>
        </Popover>
      ) : null}
    </Inline>
  );
}

function SessionComposer({ staged }: { staged: StagedAsset[] }) {
  return (
    <Stack gap="sm" align="center" className="mx-auto w-full max-w-4xl px-4 pt-3 pb-6">
      <Inline gap="md" justify="center">
        {staged.length > 0 ? (
          <>
            <StagedTray staged={staged} />
            <Button size="lg">
              {staged.length > 1 ? `Analyse (${staged.length})` : "Analyse"}
            </Button>
          </>
        ) : (
          <AddAssetButtons />
        )}
      </Inline>
      <p className="text-center text-xs text-muted-foreground">
        Results aren&apos;t always perfect. Please use your own judgment and don&apos;t trust the
        model blindly.
      </p>
    </Stack>
  );
}

function MissingComplianceBanner() {
  return (
    <div className="absolute top-2 right-4 z-20">
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>{ACTIVE_SESSION.clientName} has no compliance set up</AlertTitle>
        <AlertAction>
          <IconButton label="Dismiss" variant="ghost" size="icon-sm">
            <X />
          </IconButton>
        </AlertAction>
      </Alert>
    </div>
  );
}

function SessionWorkspace({
  runs,
  staged = [],
  canManage = true,
  hasCompliance = true,
}: {
  runs: ReviewRun[];
  staged?: StagedAsset[];
  canManage?: boolean;
  hasCompliance?: boolean;
}) {
  return (
    <>
      <WorkspaceGrid />
      {hasCompliance ? null : <MissingComplianceBanner />}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4">
        {runs.length === 0 ? (
          <EmptyState
            icon={Banana}
            title="No QA runs yet"
            description={
              canManage
                ? "Add Drive links, media, or text below, then Analyse to start."
                : "This session has no workflow runs yet."
            }
          />
        ) : (
          <Stack gap="none" className="mx-auto max-w-5xl gap-6 pt-6 pb-12">
            {runs.map((run) => (
              <RunCard key={run.id} run={run} canManage={canManage} />
            ))}
          </Stack>
        )}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-background to-transparent"
      />
      {canManage ? (
        // Below the scroller, not over it: no run ever passes under the composer, the fade only softens the edge.
        <div className="relative z-10 shrink-0 bg-background">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-full h-10 bg-linear-to-t from-background to-transparent"
          />
          <SessionComposer staged={staged} />
        </div>
      ) : null}
    </>
  );
}

const meta = {
  title: "Screens/Proof Agent/Review result",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A session after a batch: a flagged video on its findings, an unsure caption, a clean static, and a pass whose client rules changed since (the rerun turns amber). Three assets are staged in the composer. */
export const Default: Story = {
  render: () => (
    <ProofShell>
      <SessionWorkspace
        staged={STAGED_ASSETS}
        runs={[HOLIDAY_VIDEO_RUN, CAPTION_RUN, STATIC_IMAGE_RUN, STALE_RULES_RUN]}
      />
    </ProofShell>
  ),
};

/** Runs still in the durable workflow: the current step and elapsed time, a model retry, and a cancelled run. */
export const Processing: Story = {
  render: () => (
    <ProofShell>
      <SessionWorkspace runs={[PROCESSING_RUN, RETRYING_RUN, CANCELLED_RUN, STATIC_IMAGE_RUN]} />
    </ProofShell>
  ),
};

/** A run the model could not read: reviewer-facing copy in the card, the rerun in its header. */
export const Failed: Story = {
  render: () => (
    <ProofShell>
      <SessionWorkspace runs={[ERROR_RUN, CAPTION_RUN]} />
    </ProofShell>
  ),
};

/** A new session for a client with no compliance set up: the dismissible banner, then the empty workspace over the dot grid. */
export const Empty: Story = {
  render: () => (
    <ProofShell>
      <SessionWorkspace runs={[]} hasCompliance={false} />
    </ProofShell>
  ),
};

/** The home page before the first session: the shell with an empty sidebar and one prompt. */
export const NoSessions: Story = {
  render: () => (
    <ProofShell session={false}>
      <EmptyState
        icon={BugPlay}
        title="Start a new QA session"
        description="Create a new session to start"
      />
    </ProofShell>
  ),
};

/** A session route while it loads: only the dot grid, as the app's loading.tsx renders it. */
export const Loading: Story = {
  render: () => (
    <ProofShell>
      <WorkspaceGrid />
    </ProofShell>
  ),
};

/** A teammate's session: results are readable, but rerun, delete, reporting, language, products and the composer are hidden. */
export const ReadOnly: Story = {
  render: () => (
    <ProofShell canManage={false}>
      <SessionWorkspace canManage={false} runs={[HOLIDAY_VIDEO_RUN, STATIC_IMAGE_RUN]} />
    </ProofShell>
  ),
};
