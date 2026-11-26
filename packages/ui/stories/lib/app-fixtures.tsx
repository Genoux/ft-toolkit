import {
  BadgeCheck,
  FolderIcon,
  type LucideIcon,
  MoreHorizontal,
  SearchCheckIcon,
  UserPlus,
  Users,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "../../src/components/button";
import { DataTableShell } from "../../src/components/data-table-shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../src/components/dropdown-menu";
import { Inline } from "../../src/components/layout";
import { MultiSelectPopover } from "../../src/components/multi-select-popover";
import { PageToolbar } from "../../src/components/page";
import { PersonIdentity } from "../../src/components/person-identity";
import { SearchInput } from "../../src/components/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowActions,
} from "../../src/components/table";
import { RatingBadge, TablePlaceholder } from "./pool-display";
import {
  COLLABORATION_FILTER_OPTIONS,
  COLLABORATIONS,
  type CollaborationListItem,
  formatMoney,
  photoUrl,
} from "./pool-fixtures";

// The organism stories show Pool's real data: its navigation, and its closed collaborations. The data
// lives in pool-fixtures, which the Pool screens read too, so both stay one source.

export { COLLABORATION_TOTAL, COLLABORATIONS, POOL_USER } from "./pool-fixtures";

export type StoryNavItem = { title: string; icon: LucideIcon; href: string };

export const POOL_NAV: StoryNavItem[] = [
  { title: "Applicants", icon: UserPlus, href: "/applicants" },
  { title: "Database", icon: Users, href: "/database" },
  { title: "Clients", icon: FolderIcon, href: "/clients" },
  { title: "Collaborations", icon: BadgeCheck, href: "/collaborations" },
  { title: "Discovery", icon: SearchCheckIcon, href: "/discovery" },
];

export const POOL_CLIENTS = COLLABORATION_FILTER_OPTIONS.clients.map((client) => client.label);

/** Pool's Collaborations toolbar: search on the left, the client, campaign and closed-by filters on the right. */
export function CollaborationsToolbar({ sticky }: { sticky?: boolean }) {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [closedBy, setClosedBy] = useState<string[]>([]);
  return (
    <PageToolbar sticky={sticky}>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search creator, client, campaign…"
        aria-label="Search closed collaborations"
        className="w-full sm:w-80"
      />
      <Inline gap="sm" wrap={false} className="sm:ml-auto">
        <MultiSelectPopover
          placeholder="Client"
          options={COLLABORATION_FILTER_OPTIONS.clients}
          selectedValues={clients}
          onChange={setClients}
          idPrefix="story-collaboration-client-filter"
        />
        <MultiSelectPopover
          placeholder="Campaign"
          options={COLLABORATION_FILTER_OPTIONS.campaigns}
          selectedValues={campaigns}
          onChange={setCampaigns}
          idPrefix="story-collaboration-campaign-filter"
        />
        <MultiSelectPopover
          placeholder="Closed by"
          options={COLLABORATION_FILTER_OPTIONS.closedBy}
          selectedValues={closedBy}
          onChange={setClosedBy}
          idPrefix="story-collaboration-closed-by-filter"
        />
      </Inline>
    </PageToolbar>
  );
}

function RowMenu() {
  return (
    <TableRowActions>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="dots" aria-label="Actions">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableRowActions>
  );
}

/** Pool's closed collaborations, with the columns of its Collaborations page; the creator takes a third, the rest share the width. */
export function CollaborationsTable({ rows }: { rows: CollaborationListItem[] }) {
  return (
    <DataTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-3/10">Creator</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Average grading</TableHead>
            <TableHead numeric>Total paid</TableHead>
            <TableHead>Pieces</TableHead>
            <TableHead>Closed</TableHead>
            <TableHead>Closed by</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <PersonIdentity
                  size="md"
                  name={row.creator.fullName}
                  imageUrl={row.creator.photoSeed ? photoUrl(row.creator.photoSeed, 80) : null}
                />
              </TableCell>
              <TableCell className="font-medium">{row.clientName}</TableCell>
              <TableCell>{row.projectName}</TableCell>
              <TableCell>
                <RatingBadge rating={row.overallRating} />
              </TableCell>
              <TableCell numeric>
                {row.totalPaid ? formatMoney(row.totalPaid) : <TablePlaceholder />}
              </TableCell>
              <TableCell>{row.piecesOfContent ?? <TablePlaceholder />}</TableCell>
              <TableCell className="text-muted-foreground">
                {row.closedAt ?? <TablePlaceholder />}
              </TableCell>
              <TableCell>
                {row.closedBy ? (
                  <PersonIdentity name={row.closedBy.name} imageUrl={row.closedBy.imageUrl} />
                ) : (
                  <TablePlaceholder />
                )}
              </TableCell>
              <TableCell>
                <RowMenu />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableShell>
  );
}

/** A longer list for scrolling stories; each copy gets its own id. */
export const collaborationRows = (copies: number) =>
  Array.from({ length: copies }, (_, copy) =>
    COLLABORATIONS.map((row) => ({ ...row, id: `${row.id}-${copy}` })),
  ).flat();

const slug = (title: string) => title.toLowerCase().replaceAll(" ", "-");

/** Stands in for next/link: an anchor that marks the item active instead of navigating. */
export function renderStoryLink<Item extends { title: string; href?: string; disabled?: boolean }>(
  onSelect: (item: Item) => void,
) {
  return (item: Item, content: ReactNode) => (
    <a
      href={item.href ?? `#${slug(item.title)}`}
      onClick={(event) => {
        event.preventDefault();
        if (!item.disabled) onSelect(item);
      }}
    >
      {content}
    </a>
  );
}

/** The router's current page, for stories: marks the item with `activeTitle` active. */
export function useActiveTitle(initialTitle: string) {
  const [activeTitle, setActiveTitle] = useState(initialTitle);
  const markActive = <Item extends { title: string }>(items: Item[]) =>
    items.map((item) => ({ ...item, isActive: item.title === activeTitle }));
  const renderLink = renderStoryLink((item: { title: string }) => setActiveTitle(item.title));
  return { activeTitle, markActive, renderLink };
}
