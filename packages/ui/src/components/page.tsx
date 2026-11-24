import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils";
import { IconButton } from "./icon-button";

// Margins, not `gap`: the space before a block depends on what precedes it (a header or a toolbar
// sits close to what it introduces, sections stand apart), which one gap value cannot express.
// Flex items' margins never collapse, so each pair gets exactly its value. A floating child (a drawer,
// a scrim) takes no margin, which would shift it; keep it last so it does not push the next child.
const PAGE_RHYTHM_CLASS =
  "[&>*+*]:mt-10 [&>[data-slot=page-header]+*]:mt-6 [&>[data-slot=page-toolbar]+*]:mt-6 [&>:is(.absolute,.fixed)]:mt-0!";

// The page grows to the shell's height, so an empty state, the last section or a table frame holding
// one can take the room under the header. When the last block is that empty state the bottom padding
// matches the sides: there is nothing below it to scroll clear of.
const PAGE_GROW_CLASS =
  "grow has-[>:last-child:is([data-slot=empty-state],:has(>[data-slot=empty-state]),:has([data-slot=data-table-status]))]:pb-6";

const PAGE_FLOW_CLASS = `px-6 pt-6 pb-12 ${PAGE_GROW_CLASS} ${PAGE_RHYTHM_CLASS}`;

// The page stops growing with its content and hands the height left in the shell to its last
// child, which scrolls inside itself: boards and split views that run to the bottom edge.
const PAGE_FILL_CLASS = "min-h-0 flex-1 pb-6 *:last:min-h-0 *:last:flex-1";

// `default` fills the room beside the sidebar on laptops and desktops and stops at 1536px, where
// a wider line of content only spreads the eye; `full` drops even that cap for workspaces.
// Auto margins centre the content in the room the footer leaves; `justify-center` covers no footer.
const PAGE_SIZE = {
  default: `${PAGE_FLOW_CLASS} max-w-384`,
  narrow: `${PAGE_FLOW_CLASS} max-w-3xl`,
  medium: `${PAGE_FLOW_CLASS} max-w-5xl`,
  full: PAGE_FLOW_CLASS,
  centered:
    "min-h-svh max-w-xl flex-1 items-center justify-center gap-(--gap-xl) px-6 py-12 in-data-[slot=app-shell-content]:min-h-0 has-[>[data-slot=page-footer]]:pb-6 has-[>[data-slot=page-footer]]:*:first:mt-auto",
} as const;

type PageProps = ComponentProps<"div"> & {
  /** `default` (up to 1536px) for lists, details and overviews; `narrow` for forms and a single-column settings page; `medium` for settings with a SettingsLayout nav, centred with its title; `full` for workspaces that use any width; `centered` for sign-in, waiting, 404 and maintenance: a full-height column up to 36rem in the middle of the screen, wide enough for a page message's description to read at a comfortable measure. */
  size?: keyof typeof PAGE_SIZE;
  /** Renders the child element, usually `main`, instead of a div. */
  asChild?: boolean;
  /** Quiet links or legal text pinned to the bottom of the page, under a `centered` page. */
  footer?: ReactNode;
  /** The last child takes the remaining height of the shell instead of the page scrolling, for a board whose columns run to the bottom. */
  fill?: boolean;
};

function Page({
  size = "default",
  asChild = false,
  footer,
  fill = false,
  className,
  children,
  ...props
}: PageProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="page"
      data-size={size}
      data-fill={fill || undefined}
      className={cn(
        "mx-auto flex w-full min-w-0 flex-col",
        PAGE_SIZE[size],
        fill && PAGE_FILL_CLASS,
        className,
      )}
      {...props}
    >
      <Slot.Slottable>{children}</Slot.Slottable>
      {footer != null ? (
        <footer data-slot="page-footer" className="mt-auto flex w-full justify-center pt-(--gap-xl)">
          {footer}
        </footer>
      ) : null}
    </Comp>
  );
}

type PageBackLinkProps = ComponentProps<"a"> & {
  /** Renders the child element, usually the router's Link, keeping the arrow. */
  asChild?: boolean;
};

/** The way back from a detail page to its list, for `PageHeader back`. Name the list: "Creators". */
function PageBackLink({ asChild = false, className, children, ...props }: PageBackLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="page-back-link"
      className={cn(
        "-my-1 -ml-1 inline-flex w-fit items-center gap-1 rounded-full px-1 py-1 text-sm text-muted-foreground outline-none",
        "transition-colors duration-(--duration-fast) ease-out-expo hover:text-foreground focus-visible:focus-ring",
        "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-(--duration-fast) hover:[&_svg]:-translate-x-0.5",
        className,
      )}
      {...props}
    >
      <ArrowLeft aria-hidden />
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  );
}

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** A `PageBackLink` above the title, on detail pages. */
  back?: ReactNode;
  /** A `PagePager` at the end of the row `back` sits on, to step through the list the page was opened from. */
  pager?: ReactNode;
  /** An avatar or logo beside the title and description, on a person's or a company's page: `Avatar size="xl"` (56px), centred on the title and description together. */
  media?: ReactNode;
  /** Badges and status on the description's line, or beside the title without a description. */
  meta?: ReactNode;
  className?: string;
};

function PageHeader({ title, description, actions, back, pager, media, meta, className }: PageHeaderProps) {
  const metaElement = meta ? (
    <div data-slot="page-header-meta" className="flex flex-wrap items-center gap-(--gap-sm)">
      {meta}
    </div>
  ) : null;
  return (
    <header data-slot="page-header" className={cn("flex flex-col gap-3", className)}>
      {back || pager ? (
        <div className="flex items-center justify-between gap-(--gap-md)">
          {back ? <div className="flex">{back}</div> : null}
          {pager ? <div className="ml-auto flex">{pager}</div> : null}
        </div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-(--gap-md)">
        <div className="flex min-w-0 items-center gap-(--gap-md)">
          {media ? (
            <div data-slot="page-header-media" className="flex shrink-0">
              {media}
            </div>
          ) : null}
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-title font-semibold text-balance in-data-[size=medium]:text-title-sm in-data-[size=narrow]:text-title-sm">{title}</h1>
              {description ? null : metaElement}
            </div>
            {description ? (
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
                <p className="text-base text-pretty text-muted-foreground">{description}</p>
                {metaElement}
              </div>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div
            data-slot="page-header-actions"
            className="flex min-h-(--text-title--line-height) shrink-0 items-center gap-(--gap-sm) in-data-[size=medium]:min-h-(--text-title-sm--line-height) in-data-[size=narrow]:min-h-(--text-title-sm--line-height)"
          >
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}

type PagePagerProps = Omit<ComponentProps<"div">, "children"> & {
  /** Where this page sits in the list it was opened from, counting from 1. */
  position: number;
  total: number;
  /** Opens the previous item; disabled when missing or on the first. */
  onPrevious?: () => void;
  /** Opens the next item; disabled when missing or on the last. */
  onNext?: () => void;
  /** Name the item: "Previous request". */
  previousLabel?: string;
  nextLabel?: string;
};

/** "2 of 3" with previous and next, for `PageHeader pager`. Name the list with `aria-label`. */
function PagePager({
  position,
  total,
  onPrevious,
  onNext,
  previousLabel = "Previous",
  nextLabel = "Next",
  className,
  ...props
}: PagePagerProps) {
  return (
    <div
      data-slot="page-pager"
      role="group"
      className={cn("flex items-center gap-(--gap-xs)", className)}
      {...props}
    >
      <span className="px-1 text-xs text-muted-foreground tabular-nums">
        {position} of {total}
      </span>
      <IconButton
        label={previousLabel}
        variant="ghost"
        size="icon-sm"
        disabled={!onPrevious || position <= 1}
        onClick={onPrevious}
      >
        <ChevronUp />
      </IconButton>
      <IconButton
        label={nextLabel}
        variant="ghost"
        size="icon-sm"
        disabled={!onNext || position >= total}
        onClick={onNext}
      >
        <ChevronDown />
      </IconButton>
    </div>
  );
}

type PageSectionProps = Omit<ComponentProps<"section">, "title"> & {
  title?: ReactNode;
  /** Muted text on the title's line, after it: the count and how the list is sorted ("20 profiles", "2,847 customers · sorted by last seen"). Never a count pill. */
  meta?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

// The title row centres on its actions (a 36px status select or icon buttons beside a 24px title);
// with a description under the title the actions stay at the top of the two lines instead.
function PageSection({ title, meta, description, actions, className, children, ...props }: PageSectionProps) {
  const hasHeader = title || description || actions;
  return (
    <section
      data-slot="page-section"
      className={cn(
        "flex min-w-0 flex-col last:grow [&>*+*]:mt-4 [&>[data-slot=page-section-header]+*]:mt-3",
        className,
      )}
      {...props}
    >
      {hasHeader ? (
        <div
          data-slot="page-section-header"
          className={cn(
            "flex justify-between gap-(--gap-xl)",
            description ? "items-start" : "items-center",
          )}
        >
          <div className="flex min-w-0 flex-col gap-1">
            {title ? (
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                <h2 className="text-base font-medium">{title}</h2>
                {meta ? (
                  <span data-slot="page-section-meta" className="text-sm text-muted-foreground tabular-nums">
                    {meta}
                  </span>
                ) : null}
              </div>
            ) : null}
            {description ? (
              <p className="text-sm text-pretty text-subtle-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-(--gap-sm)">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

type PageToolbarProps = ComponentProps<"div"> & {
  /** Sticks to the top of the scrolling area so search and filters stay in reach over a long list. */
  sticky?: boolean;
};

/** The row above a list: search and filters at the start, view controls and the primary action at the end (`ml-auto`). The list it introduces sits 16px below it. */
function PageToolbar({ sticky = false, className, ...props }: PageToolbarProps) {
  return (
    <div
      data-slot="page-toolbar"
      data-sticky={sticky || undefined}
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-(--gap-sm)",
        // A spread shadow in the page colour masks rows scrolling under it without padding, which
        // would push the toolbar off the page rhythm.
        sticky && "sticky top-2 z-10 bg-background shadow-[0_0_0_8px_var(--color-background)]",
        className,
      )}
      {...props}
    />
  );
}

/** The scrolling region of a `fill` page, such as a grid of cards: it runs under the page's bottom
 * padding to the window edge, and carries that padding inside so the last row scrolls clear. A column
 * whose children never shrink, so an empty state in it fills the region. */
function PageScroll({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-scroll"
      className={cn("-mb-6 flex min-h-0 flex-1 flex-col overflow-y-auto pb-6 *:shrink-0", className)}
      {...props}
    />
  );
}

export { Page, PageBackLink, PageHeader, PagePager, PageScroll, PageSection, PageToolbar };
