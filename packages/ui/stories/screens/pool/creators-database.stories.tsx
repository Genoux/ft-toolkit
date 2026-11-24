import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpDown, SlidersHorizontal, Users, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Breadcrumb } from "../../../src/components/breadcrumb";
import { Button } from "../../../src/components/button";
import { Checkbox } from "../../../src/components/checkbox";
import {
  CollapsibleBody,
  CollapsibleHeader,
  CollapsibleSection,
} from "../../../src/components/collapsible-section";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../../src/components/dropdown-menu";
import { EmptyState } from "../../../src/components/empty-state";
import { IconButton } from "../../../src/components/icon-button";
import { Label } from "../../../src/components/label";
import { Grid, Inline, Stack } from "../../../src/components/layout";
import { MediaFrame, MediaFrameOverlay } from "../../../src/components/media-frame";
import { Page, PageScroll, PageToolbar } from "../../../src/components/page";
import { SearchInput } from "../../../src/components/search-input";
import { SectionSpinner } from "../../../src/components/spinner";
import { cn } from "../../../src/lib/utils";
import {
  CREATOR_TOTAL,
  CREATORS,
  type CreatorListItem,
  DATABASE_FILTER_SECTIONS,
  photoUrl,
  SORT_OPTIONS,
} from "./fixtures";
import { MediaRatingBadge, VerifiedMark } from "./pool-blocks";
import { POOL_SCREEN_PARAMETERS, PoolShell } from "./pool-shell";

type DatabaseState = "default" | "loading" | "noResults";

// signature-surface: Pool's full-bleed creator card, the photo filling the card with the name,
// country and rate laid on it over a scrim, the rating top-left, a zoom on hover.
function CreatorCard({ creator }: { creator: CreatorListItem }) {
  const rate = creator.rateRange
    ? `$${creator.rateRange.min}-$${creator.rateRange.max}`
    : "Rate TBD";
  return (
    <a
      href={`/database/${creator.id}`}
      onClick={(event) => event.preventDefault()}
      className="rounded-xl outline-none focus-visible:focus-ring"
    >
      <MediaFrame
        src={photoUrl(creator.photoSeed, 640)}
        alt={creator.fullName}
        radius="xl"
        scrim="bottom"
        interactive
        className="h-100 w-full"
      >
        <MediaFrameOverlay placement="top">
          <MediaRatingBadge rating={creator.overallRating} />
        </MediaFrameOverlay>
        <MediaFrameOverlay>
          <Stack gap="xs">
            <Inline gap="sm" wrap={false}>
              <h3 className="truncate text-xl font-semibold">{creator.fullName}</h3>
              {creator.overallRating === "top creator" ? <VerifiedMark /> : null}
            </Inline>
            <span className="text-sm text-white/80">{creator.country}</span>
            <span className="text-sm font-semibold text-white/80 tabular-nums">{rate}</span>
          </Stack>
        </MediaFrameOverlay>
      </MediaFrame>
    </a>
  );
}

function DatabaseFilters({ selected }: { selected: string[] }) {
  return (
    <Stack gap="sm">
      {DATABASE_FILTER_SECTIONS.map((section, index) => (
        <CollapsibleSection key={section.title} defaultOpen={index === 0} size="sm" divider={false}>
          <CollapsibleHeader>{section.title}</CollapsibleHeader>
          <CollapsibleBody>
            <Stack gap="sm">
              {section.options.map((option) => {
                const id = `filter-${section.title}-${option}`;
                return (
                  <Inline key={option} gap="sm" wrap={false}>
                    <Checkbox id={id} defaultChecked={selected.includes(option)} />
                    <Label htmlFor={id} className="capitalize">
                      {option}
                    </Label>
                  </Inline>
                );
              })}
            </Stack>
          </CollapsibleBody>
        </CollapsibleSection>
      ))}
    </Stack>
  );
}

// toolkit-gap: a drawer scoped to the page region. Pool's filters slide over the grid only, under
// the app's header and beside its sidebar; Sheet is fixed to the viewport and would cover both.
function RegionDrawer({
  open,
  onClose,
  label,
  header,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "absolute inset-0 z-20 bg-black/20 transition-opacity duration-(--duration-base) ease-out-expo",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-label={label}
        inert={!open}
        onKeyDown={(event) => event.key === "Escape" && onClose()}
        className={cn(
          "absolute inset-y-0 left-0 z-30 flex w-64 flex-col bg-popover shadow-elevated transition-transform duration-(--duration-fast) ease-out-expo",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b py-3 pr-3 pl-4">
          {header}
          <IconButton label="Close" variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">{children}</div>
      </aside>
    </>
  );
}

function SortMenu() {
  const [sort, setSort] = useState<string>("rating");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label="Sort" variant="secondary">
          <ArrowUpDown />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.key} value={option.key}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CreatorsDatabase({
  state = "default",
  initialQuery = "",
  filtersOpen: initialFiltersOpen = false,
  selectedFilters = [],
}: {
  state?: DatabaseState;
  initialQuery?: string;
  filtersOpen?: boolean;
  selectedFilters?: string[];
}) {
  const [query, setQuery] = useState(initialQuery);
  const [filtersOpen, setFiltersOpen] = useState(initialFiltersOpen);
  const total = state === "noResults" ? 0 : CREATOR_TOTAL;

  return (
    <PoolShell
      active="Database"
      header={
        <>
          <Breadcrumb page="Database" />
          {state === "loading" ? null : (
            <span className="text-sm text-muted-foreground tabular-nums">{total} creators</span>
          )}
        </>
      }
    >
      {state === "loading" ? (
        <Page size="full" fill>
          <SectionSpinner />
        </Page>
      ) : (
        <Page size="full" fill className="relative overflow-hidden">
          <PageToolbar>
            <IconButton
              label="Show filters"
              pressedLabel="Hide filters"
              pressed={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal />
            </IconButton>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search creators…"
              className="w-auto min-w-0 flex-1 sm:w-80 sm:flex-none"
            />
            <div className="ml-auto">
              <SortMenu />
            </div>
          </PageToolbar>
          <PageScroll>
            {state === "noResults" ? (
              <EmptyState
                icon={Users}
                title="No creators found"
                description="Try adjusting your filters or search query."
              />
            ) : (
              <Grid cols={4} gap="sm">
                {CREATORS.map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))}
              </Grid>
            )}
          </PageScroll>
          <RegionDrawer
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            label="Filters"
            header={
              <Inline gap="xs" wrap={false}>
                <span className="text-sm font-medium">Filters</span>
                {selectedFilters.length > 0 ? (
                  <Button variant="secondary" size="xs">
                    Clear
                  </Button>
                ) : null}
              </Inline>
            }
          >
            <DatabaseFilters selected={selectedFilters} />
          </RegionDrawer>
        </Page>
      )}
    </PoolShell>
  );
}

const meta = {
  title: "Screens/Pool/Creators database",
  parameters: POOL_SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <CreatorsDatabase /> };

export const Loading: Story = { render: () => <CreatorsDatabase state="loading" /> };

export const NoResults: Story = {
  render: () => (
    <CreatorsDatabase
      state="noResults"
      initialQuery="skincare asmr"
      selectedFilters={["top creator", "Canada"]}
    />
  ),
};

/** Pool's filters slide in from the left over the grid, not over the sidebar; the database has no row selection. */
export const FiltersOpen: Story = {
  render: () => (
    <CreatorsDatabase filtersOpen selectedFilters={["top creator", "standout", "TikTok"]} />
  ),
};
