import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";

type DetailLayoutProps = Omit<ComponentProps<"div">, "children"> & {
  /** The evidence: what a reviewer reads, or the form being filled. */
  children: ReactNode;
  /** Leads the side column and, on narrow screens, comes before `children`: what the item is and where it stands. */
  summary?: ReactNode;
  /** Follows `summary` in the side column and, on narrow screens, comes after `children`: the decision, actions or a form's summary. Several cards stack 24px apart, the column's gap. */
  aside?: ReactNode;
  /** The side column's side: `end` (right) by default, `start` (left) for a record's info column. */
  asidePosition?: "start" | "end";
  /** `inset` sits inside `Page`, a sticky column of cards from lg. `ruled` goes around a `Page`: a full-height
   * 320px column ruled off from it, each scrolling on its own; below sm the column slides over the content
   * while `asideOpen`. */
  variant?: "inset" | "ruled";
  /** With `variant="ruled"`, below sm: shows the column over the content, opened from a header button. */
  asideOpen?: boolean;
};

// Margins by pair, as in Page: cards stacked in the main column keep the side column's 24px, so the
// two columns share one rhythm, while a PageSection (a heading over its content) keeps the page's 40px.
const MAIN_RHYTHM_CLASS =
  "[&>*+*]:mt-6 [&>[data-slot=page-section]+*]:mt-10 [&>*+[data-slot=page-section]]:mt-10";

// The side column sticks at the page's top padding (24px under the shell header). Its height caps at
// the room between that line and the page's 48px bottom padding: any taller and the column sets the
// grid's height, so the grid's end pushes it up into the header at the bottom of the page. Past the
// cap it scrolls on its own, with a visible thin scrollbar in a 12px gutter: a hidden one left the
// decision's buttons below the fold with nothing to say they were there.
const ASIDE_CLASS =
  "contents lg:sticky lg:top-6 lg:-mx-3 lg:flex lg:max-h-[calc(100svh-var(--header-height,0px)-var(--app-shell-inset,0px)-4.5rem)] lg:min-w-0 lg:flex-col lg:gap-6 lg:overflow-y-auto lg:overscroll-contain lg:px-3 lg:[scrollbar-width:thin]";

// Below lg the side column is `display: contents`, so `summary` and `aside` join the main column's
// flow and `order` can put the main content between them; from lg they stick together as one column.
function InsetDetailLayout({
  summary,
  aside,
  asidePosition,
  className,
  children,
  ...props
}: Omit<DetailLayoutProps, "variant" | "asideOpen">) {
  const atStart = asidePosition === "start";
  const column =
    summary || aside ? (
      <div data-slot="detail-layout-aside" className={ASIDE_CLASS}>
        {summary ? (
          <div data-slot="detail-layout-summary" className="order-1 min-w-0">
            {summary}
          </div>
        ) : null}
        {aside ? (
          <div
            data-slot="detail-layout-aside-content"
            className="order-3 flex min-w-0 flex-col gap-6"
          >
            {aside}
          </div>
        ) : null}
      </div>
    ) : null;
  return (
    <div
      data-slot="detail-layout"
      data-variant="inset"
      className={cn(
        "flex min-w-0 flex-col gap-6 lg:grid lg:items-start lg:gap-x-8",
        atStart ? "lg:grid-cols-[22.5rem_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_22.5rem]",
        className,
      )}
      {...props}
    >
      {atStart ? column : null}
      <div
        data-slot="detail-layout-main"
        className={cn("order-2 flex min-w-0 flex-col lg:order-none", MAIN_RHYTHM_CLASS)}
      >
        {children}
      </div>
      {atStart ? null : column}
    </div>
  );
}

// Pool's creator profile: the column fills the height under the shell header, outside Page's padding,
// so it cannot be a grid cell inside Page. Closed on a phone it is hidden, not only moved off-screen,
// so its links leave the tab order; `visibility` waits for the slide to end.
const RULED_ASIDE_CLASS =
  "flex w-80 shrink-0 flex-col gap-6 overflow-y-auto overscroll-contain bg-background p-4 pb-8 [scrollbar-width:thin] max-sm:absolute max-sm:inset-y-0 max-sm:z-10 max-sm:shadow-elevated max-sm:transition-[translate,visibility] max-sm:duration-(--duration-base) max-sm:ease-out-expo max-sm:not-data-open:invisible";

function RuledDetailLayout({
  summary,
  aside,
  asidePosition,
  asideOpen = false,
  className,
  children,
  ...props
}: Omit<DetailLayoutProps, "variant">) {
  const atStart = asidePosition === "start";
  const column = (
    <div
      data-slot="detail-layout-aside"
      data-open={asideOpen || undefined}
      className={cn(
        RULED_ASIDE_CLASS,
        atStart
          ? "border-e max-sm:start-0 max-sm:not-data-open:-translate-x-full"
          : "border-s max-sm:end-0 max-sm:not-data-open:translate-x-full",
      )}
    >
      {summary}
      {aside}
    </div>
  );
  return (
    <div
      data-slot="detail-layout"
      data-variant="ruled"
      className={cn("relative flex min-h-0 min-w-0 flex-1", className)}
      {...props}
    >
      {atStart ? column : null}
      <div data-slot="detail-layout-main" className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
      {atStart ? null : column}
    </div>
  );
}

/** A detail page: the main content beside a side column (`summary` first, `aside` after). `inset` (default) goes inside `Page` with a sticky column from lg; `ruled` goes around a `Page` with a full-height column ruled off. */
function DetailLayout({
  variant = "inset",
  asidePosition = "end",
  asideOpen,
  ...props
}: DetailLayoutProps) {
  return variant === "ruled" ? (
    <RuledDetailLayout asidePosition={asidePosition} asideOpen={asideOpen} {...props} />
  ) : (
    <InsetDetailLayout asidePosition={asidePosition} {...props} />
  );
}

export { DetailLayout };
