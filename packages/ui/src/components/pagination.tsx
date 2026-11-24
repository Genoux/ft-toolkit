import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

// Seven slots at most, and always seven once there are more pages, so the buttons never shift
// under the pointer while paging.
const MAX_SLOTS = 7;

/** The page numbers to draw for `page` of `pageCount`: first, last, the current one with its neighbours, ellipses for the gaps. */
export function getPageItems(page: number, pageCount: number): PageItem[] {
  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, index) => from + index);
  if (pageCount <= MAX_SLOTS) return range(1, pageCount);
  if (page <= 4) return [...range(1, 5), "ellipsis-end", pageCount];
  if (page >= pageCount - 3) return [1, "ellipsis-start", ...range(pageCount - 4, pageCount)];
  return [1, "ellipsis-start", page - 1, page, page + 1, "ellipsis-end", pageCount];
}

const formatCount = (count: number) => count.toLocaleString("en-US");

// The element is rendered through Slot and asChild, so it must forward props and ref.
type RenderPaginationLink = (href: string, content: ReactNode) => ReactElement;

const renderAnchor: RenderPaginationLink = (href, content) => <a href={href}>{content}</a>;

type PaginationProps = {
  /** The current page, from 1. */
  page: number;
  pageSize: number;
  /** Rows across every page; the meta reads "Showing 1–25 of 2,847". */
  total: number;
  className?: string;
} & (
  | { onPageChange: (page: number) => void; getHref?: never; renderLink?: never }
  | {
      /** Pages as links, so a Server Component can page through search params. */
      getHref: (page: number) => string;
      /** The router Link; it must forward props and ref, which `next/link` does. */
      renderLink?: RenderPaginationLink;
      onPageChange?: never;
    }
);

/** Numbered page pills with previous and next, beside a "Showing 1–25 of 2,847" line. Under a table or a list. */
function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  getHref,
  renderLink = renderAnchor,
  className,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const firstRow = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastRow = Math.min(currentPage * pageSize, total);

  const pageControl = (target: number, content: ReactNode, props: PageControlProps) => {
    const disabled = props.disabled || target === currentPage;
    if (getHref && !disabled) {
      return (
        <Button asChild variant={props.variant} size={props.size} aria-label={props.label}>
          {renderLink(getHref(target), content)}
        </Button>
      );
    }
    return (
      <Button
        type="button"
        variant={props.variant}
        size={props.size}
        aria-label={props.label}
        aria-current={props.current ? "page" : undefined}
        disabled={props.disabled}
        onClick={props.current ? undefined : () => onPageChange?.(target)}
        className={props.current ? "pointer-events-none" : undefined}
      >
        {content}
      </Button>
    );
  };

  return (
    <nav
      aria-label="Pagination"
      data-slot="pagination"
      className={cn("flex min-w-0 flex-wrap items-center justify-between gap-(--gap-md)", className)}
    >
      <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
        {total === 0
          ? "No results"
          : `Showing ${formatCount(firstRow)}–${formatCount(lastRow)} of ${formatCount(total)}`}
      </p>
      {pageCount > 1 ? (
        <div className="flex items-center gap-1">
          {pageControl(currentPage - 1, <ChevronLeft />, {
            variant: "ghost",
            size: "icon-sm",
            label: "Previous page",
            disabled: currentPage === 1,
          })}
          <ul className="hidden items-center gap-1 sm:flex">
            {getPageItems(currentPage, pageCount).map((item) => (
              <li key={item} className="flex">
                {typeof item === "number" ? (
                  pageControl(item, formatCount(item), {
                    variant: item === currentPage ? "outline" : "ghost",
                    size: "icon-sm",
                    label: `Page ${item}`,
                    current: item === currentPage,
                  })
                ) : (
                  <span
                    aria-hidden
                    className="flex size-8 items-center justify-center text-sm text-subtle-foreground"
                  >
                    …
                  </span>
                )}
              </li>
            ))}
          </ul>
          <span className="px-2 text-xs text-muted-foreground tabular-nums sm:hidden">
            Page {formatCount(currentPage)} of {formatCount(pageCount)}
          </span>
          {pageControl(currentPage + 1, <ChevronRight />, {
            variant: "ghost",
            size: "icon-sm",
            label: "Next page",
            disabled: currentPage === pageCount,
          })}
        </div>
      ) : null}
    </nav>
  );
}

type PageControlProps = {
  variant: "ghost" | "outline";
  size: "icon-sm";
  label: string;
  current?: boolean;
  disabled?: boolean;
};

type PaginationLoadMoreProps = {
  /** Rows on screen now. */
  shown: number;
  total: number;
  onLoadMore: () => void;
  /** Keeps the button in place, disabled, while the next rows load. */
  loading?: boolean;
  label?: string;
  className?: string;
};

/** "Showing 25 of 2,847" and a Load more button, for a feed or a list that grows in place. Hidden once everything is shown. */
function PaginationLoadMore({
  shown,
  total,
  onLoadMore,
  loading = false,
  label = "Load more",
  className,
}: PaginationLoadMoreProps) {
  return (
    <div
      data-slot="pagination-load-more"
      className={cn("flex flex-col items-center gap-(--gap-sm)", className)}
    >
      {shown < total ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={loading}
          onClick={onLoadMore}
        >
          {label}
        </Button>
      ) : null}
      <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
        Showing {formatCount(Math.min(shown, total))} of {formatCount(total)}
      </p>
    </div>
  );
}

export { Pagination, PaginationLoadMore };
