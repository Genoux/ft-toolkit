import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Card, CardAction, CardDescription, CardSection, CardTitle } from "./card";
import { DescriptionList } from "./description-list";
import { Meter } from "./meter";
import { Skeleton } from "./skeleton";

type RecordCardProps = ComponentProps<typeof Card>;

/** A Card at record density: 16px padding and 12px between header, tags and facts, so a grid of
 * campaigns or requests stays compact (Pool's folder cards). */
function RecordCard({ className, ...props }: RecordCardProps) {
  return (
    <Card className={cn("gap-3 [--card-padding:--spacing(4)]", className)} {...props} />
  );
}

const MARK_SIZE = {
  md: "size-8 text-sm",
  lg: "size-10 text-base",
} as const;

type RecordCardMarkProps = Omit<ComponentProps<"span">, "children"> & {
  /** A client or brand: the tile shows its first letter. People take `PersonAvatar`, two letters. */
  name?: string;
  /** An icon for what the record is (a campaign's folder), in place of the letter. */
  children?: ReactNode;
  /** `lg` (40px) in a card header, `md` (32px) in a table cell. */
  size?: keyof typeof MARK_SIZE;
};

/** A square tile for a record that is not a person: one letter of its name, or an icon. */
function RecordCardMark({ name, children, size = "lg", className, ...props }: RecordCardMarkProps) {
  return (
    <span
      data-slot="record-card-mark"
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-foreground/8 font-medium text-muted-foreground select-none [&>svg]:size-4",
        MARK_SIZE[size],
        className,
      )}
      {...props}
    >
      {children ?? name?.trim().charAt(0).toUpperCase()}
    </span>
  );
}

type RecordCardHeaderProps = Omit<ComponentProps<"div">, "title"> & {
  /** A `PersonAvatar size="lg"` for a person, a `RecordCardMark` for anything else, left of the title. */
  media?: ReactNode;
  /** The record's name; a CardLink here makes the whole card open the record. */
  title: ReactNode;
  /** The title's heading level: 3 when the grid of cards sits inside a titled PageSection. */
  titleLevel?: ComponentProps<typeof CardTitle>["level"];
  /** Under the title, such as a description or an email; up to two lines, the record shows the rest. */
  description?: ReactNode;
  /** A `dots` menu, top-right; it stays clickable above the card's link. */
  action?: ReactNode;
};

/** Who or what the card is: media, name and a description, with a menu top-right. The name keeps to
 * the top with or without a description, so names line up across a row of cards. */
function RecordCardHeader({
  media,
  title,
  titleLevel,
  description,
  action,
  className,
  ...props
}: RecordCardHeaderProps) {
  return (
    <div
      data-slot="record-card-header"
      className={cn("flex min-w-0 items-center gap-(--gap-md) [&>[data-slot=card-action]]:self-center", className)}
      {...props}
    >
      {media}
      <div className="flex min-w-0 flex-1 flex-col">
        <CardTitle level={titleLevel} className="truncate">
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className="line-clamp-2 wrap-anywhere">{description}</CardDescription>
        ) : null}
      </div>
      {action ? <CardAction>{action}</CardAction> : null}
    </div>
  );
}

/** A plan Badge and a StatusDot side by side, under the header. */
function RecordCardTags({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="record-card-tags"
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-x-(--gap-md) gap-y-(--gap-sm)",
        className,
      )}
      {...props}
    />
  );
}

type RecordCardFactsProps = Omit<ComponentProps<typeof DescriptionList>, "layout" | "frame">;

/** Key facts as `DescriptionItem`s, label over value, two per row. Ruled off and pinned to the bottom,
 * so the facts of cards in one row line up whatever the header and tags above them hold. */
function RecordCardFacts({ className, ...props }: RecordCardFactsProps) {
  return (
    <CardSection divided className="mt-auto not-first:pt-3">
      <DescriptionList layout="stacked" className={cn("grid-cols-2 gap-y-3", className)} {...props} />
    </CardSection>
  );
}

type RecordCardMeterProps = {
  /** What is measured, left above the bar: "Usage · 30d". It also names the meter for screen readers. */
  label: string;
  /** Percent of the bar filled, 0 to 100. */
  value: number;
  /** The figure behind it, right above the bar: "142 sessions". */
  valueLabel?: ReactNode;
  className?: string;
};

/** One usage level across the card, after RecordCardFacts. */
function RecordCardMeter({ label, value, valueLabel, className }: RecordCardMeterProps) {
  return (
    <div
      data-slot="record-card-meter"
      className={cn("flex min-w-0 flex-col gap-(--gap-sm)", className)}
    >
      <div className="flex min-w-0 items-baseline justify-between gap-(--gap-md) text-xs">
        <span className="truncate text-subtle-foreground">{label}</span>
        {valueLabel ? (
          <span className="shrink-0 text-foreground tabular-nums">{valueLabel}</span>
        ) : null}
      </div>
      <Meter value={value} aria-label={label} fill />
    </div>
  );
}

type RecordCardSkeletonProps = {
  /** Draws the tags row too, for cards that carry RecordCardTags. */
  tags?: boolean;
  /** Draws the usage bar too, for cards that carry a RecordCardMeter. */
  meter?: boolean;
  className?: string;
};

// Each bar sits in a box at the line height of the text it stands for, so the placeholder is the
// loaded card's height to the pixel and nothing shifts when the records land.
/** A placeholder at the record card's height while the records load: calm bars on each line, not a drawing of the avatar and badges. Match `tags` and `meter` to the loaded cards. */
function RecordCardSkeleton({ tags = false, meter = false, className }: RecordCardSkeletonProps) {
  return (
    <RecordCard data-slot="record-card-skeleton" aria-hidden className={className}>
      <div className="flex h-10 flex-col justify-center gap-(--gap-sm)">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      {tags ? (
        <div className="flex h-6 items-center">
          <Skeleton className="h-3 w-1/3" />
        </div>
      ) : null}
      <CardSection divided className="mt-auto not-first:pt-3">
        <div className="grid grid-cols-2 gap-x-6">
          {["first", "second"].map((fact) => (
            <div key={fact} className="flex flex-col gap-1 *:flex *:h-5 *:items-center">
              <div>
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div>
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </CardSection>
      {meter ? (
        <div className="flex flex-col gap-(--gap-sm)">
          <div className="flex h-4.5 items-center">
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-1 w-full" />
        </div>
      ) : null}
    </RecordCard>
  );
}

export {
  RecordCard,
  RecordCardFacts,
  RecordCardHeader,
  RecordCardMark,
  RecordCardMeter,
  RecordCardSkeleton,
  RecordCardTags,
};
