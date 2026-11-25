import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

type CardProps = ComponentProps<"div"> & {
  /** Renders the child element instead of a div; a link or button child gets a hover and focus state, for a grid of cards that open something. */
  asChild?: boolean;
};

// Hover strengthens the border instead of tinting the card: a tint vanishes on a muted surface such as a
// board column, and a shadow on top of the border would be a second elevation. Content is centred
// vertically so a card stretched to a taller neighbour in a row has no empty band at the bottom; a
// CardFooter or section with mt-auto still pins to the bottom.
function Card({ asChild = false, className, ...props }: CardProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="card"
      className={cn(
        "isolate flex min-w-0 flex-col justify-center gap-(--gap-lg) rounded-xl border border-border bg-card p-(--card-padding) text-card-foreground",
        "transition-[border-color,box-shadow] duration-(--duration-fast) ease-out-expo",
        "[a&,button&]:text-left [a&,button&]:outline-none",
        "[a&,button&]:hover:border-input [a&,button&]:focus-visible:focus-ring",
        "has-data-[slot=card-link]:relative has-[[data-slot=card-link]:hover]:border-input",
        "has-[[data-slot=card-link]:focus-visible]:focus-ring",
        className,
      )}
      {...props}
    />
  );
}

type CardLinkProps = ComponentProps<"a"> & {
  /** Renders the child element, such as a router Link, instead of an anchor. */
  asChild?: boolean;
};

/** The card's title as a link whose hit area covers the whole card, so the card opens on a click
 * anywhere while CardAction (a menu, a button) stays clickable above it. */
function CardLink({ asChild = false, className, ...props }: CardLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="card-link"
      className={cn("outline-none after:absolute after:inset-0 after:rounded-xl", className)}
      {...props}
    />
  );
}

/** Title and description on the left, an optional CardAction pinned top-right. */
function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid min-w-0 auto-rows-min grid-cols-[1fr_auto] items-start gap-x-(--gap-md) gap-y-(--gap-xs)",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("col-start-1 min-w-0 text-heading text-foreground", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("col-start-1 min-w-0 text-xs text-pretty text-muted-foreground", className)}
      {...props}
    />
  );
}

/** A button, badge or menu in the header's top-right corner. */
function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        // As tall as CardTitle's line, so whatever it holds centres on the title; a taller button
        // overflows it evenly above and below.
        "relative z-10 col-start-2 row-span-2 row-start-1 flex h-[calc(var(--text-heading)*var(--text-heading--line-height))] items-center gap-(--gap-sm) self-start",
        className,
      )}
      {...props}
    />
  );
}

type CardSectionProps = ComponentProps<"div"> & {
  /** Renders the child element, such as a `section` with its own heading, instead of a div. */
  asChild?: boolean;
  /** A full-width rule above this section. Off by default: spacing separates sections; use it only when two sections would otherwise read as one. */
  divided?: boolean;
};

/** One part of a card split by full-width rules: a panel's note, its checks, its actions. Every
 * section after the card's first child gets a rule across the card's padding. */
function CardSection({ asChild = false, divided = false, className, ...props }: CardSectionProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="card-section"
      className={cn(
        "-mx-(--card-padding) flex min-w-0 flex-col gap-(--gap-md) px-(--card-padding)",
        divided && "not-first:border-t not-first:border-border not-first:pt-(--gap-lg)",
        className,
      )}
      {...props}
    />
  );
}

type CardFooterProps = ComponentProps<"div"> & {
  /** The buttons share the width in equal columns, the main action first: a decision's paired
   * actions (Approve and Request changes) at the foot of a side card. They stack full width only
   * when the card is too narrow for their labels side by side. */
  fill?: boolean;
};

/** Buttons that end the card, aligned to the end: a form's save, a "View all" link. */
function CardFooter({ fill = false, className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      data-fill={fill || undefined}
      className={cn(
        "mt-auto flex flex-wrap items-center justify-end gap-(--gap-sm)",
        // A shared 96px basis, not flex-1: a zero basis floors at padding plus border, so an outline
        // button came out 2px wider than a solid one. Its side padding is only the least room around
        // the label; 12px keeps "Request changes" in an even half of a 360px side card.
        fill && "*:shrink *:grow *:basis-24 *:data-[slot=button]:px-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardLink,
  CardDescription,
  CardFooter,
  CardHeader,
  CardSection,
  CardTitle,
};
