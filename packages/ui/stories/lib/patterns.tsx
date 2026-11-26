import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../src/components/badge";
import { DataTable } from "../../src/components/data-table";
import { DataTableShell } from "../../src/components/data-table-shell";
import { DescriptionItem, DescriptionList } from "../../src/components/description-list";
import { DetailLayout } from "../../src/components/detail-layout";
import { Grid, Inline, Stack } from "../../src/components/layout";
import { Page, PageSection } from "../../src/components/page";
import { PersonAvatar, PersonIdentity } from "../../src/components/person-identity";
import { Skeleton } from "../../src/components/skeleton";
import { RatingBadge, TablePlaceholder } from "./pool-display";
import {
  type ClosedCollaboration,
  CREATOR_PROFILE,
  type CreatorProfile,
  formatMoney,
  photoUrl,
} from "./pool-fixtures";

// Generic patterns built only from toolkit components, filled with real app data shapes.

function TagList({ tags }: { tags: string[] }) {
  return (
    <Inline gap="xs">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline">
          {tag}
        </Badge>
      ))}
    </Inline>
  );
}

/** A record's info column: who it is, then its facts as a stacked description list. */
export function CreatorInfo({ creator = CREATOR_PROFILE }: { creator?: CreatorProfile }) {
  return (
    <Stack gap="lg">
      <Stack gap="sm">
        <PersonAvatar
          name={creator.fullName}
          imageUrl={photoUrl(creator.photoSeed, 160)}
          size="xl"
        />
        <Stack gap="xs">
          <p className="text-heading">{creator.fullName}</p>
          <RatingBadge rating={creator.overallRating} />
        </Stack>
      </Stack>
      <DescriptionList layout="stacked">
        <DescriptionItem label="Country">{creator.country}</DescriptionItem>
        <DescriptionItem label="Languages">{creator.languages.join(", ")}</DescriptionItem>
        <DescriptionItem label="Age">{creator.age} years old</DescriptionItem>
        <DescriptionItem label="Gender">{creator.genderIdentity}</DescriptionItem>
        <DescriptionItem label="Rate">
          {formatMoney(creator.rateRange.min)} to {formatMoney(creator.rateRange.max)}
        </DescriptionItem>
      </DescriptionList>
      <DescriptionList layout="stacked">
        <DescriptionItem label="UGC categories">
          <TagList tags={creator.ugcCategories} />
        </DescriptionItem>
        <DescriptionItem label="Content formats">
          <TagList tags={creator.contentFormats} />
        </DescriptionItem>
      </DescriptionList>
    </Stack>
  );
}

/** The info column while the record loads, at the loaded column's shape. */
function CreatorInfoSkeleton() {
  return (
    <Stack gap="lg">
      <Stack gap="sm">
        <Skeleton className="size-14 rounded-full" />
        <Stack gap="xs">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </Stack>
      </Stack>
      <Grid cols={2} phoneCols={2} gap="md">
        {["country", "languages", "age", "gender", "rate"].map((field) => (
          <Stack key={field} gap="xs">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-24" />
          </Stack>
        ))}
      </Grid>
    </Stack>
  );
}

const COLLABORATION_COLUMNS: ColumnDef<ClosedCollaboration>[] = [
  {
    accessorKey: "projectName",
    header: "Campaign",
    cell: ({ row }) => <span className="font-medium">{row.original.projectName}</span>,
  },
  { accessorKey: "clientName", header: "Client" },
  {
    accessorKey: "totalPaid",
    header: "Total paid",
    cell: ({ row }) =>
      row.original.totalPaid ? formatMoney(row.original.totalPaid) : <TablePlaceholder />,
    meta: { numeric: true },
  },
  {
    accessorKey: "piecesOfContent",
    header: "Pieces",
    cell: ({ row }) => row.original.piecesOfContent ?? <TablePlaceholder />,
  },
  {
    accessorKey: "closedAt",
    header: "Closed",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.closedAt}</span>,
  },
  {
    id: "closedBy",
    header: "Closed by",
    cell: ({ row }) =>
      row.original.closedBy ? (
        <PersonIdentity
          name={row.original.closedBy.name}
          imageUrl={row.original.closedBy.imageUrl}
        />
      ) : (
        <TablePlaceholder />
      ),
  },
];

/** A record's related list: a titled section with a count over a data table. */
function CollaborationsSection({
  collaborations = CREATOR_PROFILE.closedCollaborations,
  loading = false,
}: {
  collaborations?: ClosedCollaboration[];
  loading?: boolean;
}) {
  const count = collaborations.length;
  return (
    <PageSection
      title="Collaborations"
      meta={loading ? undefined : `${count} ${count === 1 ? "collaboration" : "collaborations"}`}
    >
      <DataTableShell>
        <DataTable
          columns={COLLABORATION_COLUMNS}
          data={loading ? [] : collaborations}
          isLoading={loading}
          loadingRowCount={3}
          emptyMessage="No closed collaborations yet."
        />
      </DataTableShell>
    </PageSection>
  );
}

/** A record's detail page with a ruled info column on the left: `DetailLayout variant="ruled"`
 * around a `Page`, each side scrolling on its own. `loading` shows skeletons at the loaded shape. */
export function CreatorDetail({
  creator = CREATOR_PROFILE,
  loading = false,
}: {
  creator?: CreatorProfile;
  loading?: boolean;
}) {
  return (
    <DetailLayout
      variant="ruled"
      asidePosition="start"
      aside={
        <aside aria-label="Creator info" aria-busy={loading || undefined}>
          {loading ? <CreatorInfoSkeleton /> : <CreatorInfo creator={creator} />}
        </aside>
      }
    >
      <Page size="full" className="flex-1">
        <CollaborationsSection collaborations={creator.closedCollaborations} loading={loading} />
      </Page>
    </DetailLayout>
  );
}
