import { MoreHorizontalIcon } from "lucide-react";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../src/components/dropdown-menu";
import { Meter } from "../../src/components/meter";
import { PersonIdentity } from "../../src/components/person-identity";
import { StatusDot } from "../../src/components/status-dot";
import { TableRowActions } from "../../src/components/table";
import { CREATOR_STATUS, type Creator } from "./creator-fixtures";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const usd = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const shortDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const MAX_ENGAGEMENT_RATE = 12;
const VISIBLE_TAG_COUNT = 2;

export const formatCompact = (value: number) => compactNumber.format(value);
export const formatUsd = (value: number) => usd.format(value);
export const formatShortDate = (isoDate: string) => shortDate.format(new Date(isoDate));

export function CreatorIdentity({ creator }: { creator: Creator }) {
  return (
    <PersonIdentity
      size="md"
      name={creator.name}
      imageUrl={creator.imageUrl}
      description={creator.email}
    />
  );
}

export function CreatorStatus({ status }: { status: Creator["status"] }) {
  const { label, tone } = CREATOR_STATUS[status];
  return <StatusDot tone={tone} label={label} />;
}

export function CreatorEngagement({ rate }: { rate: number }) {
  return <Meter value={(rate / MAX_ENGAGEMENT_RATE) * 100} label={`${rate.toFixed(1)}%`} />;
}

export function CreatorTags({ tags }: { tags: string[] }) {
  const hiddenCount = tags.length - VISIBLE_TAG_COUNT;
  return (
    <div className="flex items-center gap-1">
      {tags.slice(0, VISIBLE_TAG_COUNT).map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
      {hiddenCount > 0 ? <Badge variant="outline">+{hiddenCount}</Badge> : null}
    </div>
  );
}

export function CreatorRowActions({ creator }: { creator: Creator }) {
  return (
    <TableRowActions>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="dots" aria-label={`Actions for ${creator.name}`}>
            <MoreHorizontalIcon aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View profile</DropdownMenuItem>
          <DropdownMenuItem>Add to campaign</DropdownMenuItem>
          <DropdownMenuItem>Copy email</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableRowActions>
  );
}
