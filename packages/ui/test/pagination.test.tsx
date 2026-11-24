import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getPageItems, Pagination, PaginationLoadMore } from "../src/components/pagination";

describe("getPageItems", () => {
  it("lists every page when they fit in seven slots", () => {
    expect(getPageItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("keeps seven slots at the start, middle and end of a long list", () => {
    expect(getPageItems(1, 114)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 114]);
    expect(getPageItems(57, 114)).toEqual([1, "ellipsis-start", 56, 57, 58, "ellipsis-end", 114]);
    expect(getPageItems(114, 114)).toEqual([1, "ellipsis-start", 110, 111, 112, 113, 114]);
  });
});

describe("Pagination", () => {
  it("states the visible range and marks the current page", () => {
    const markup = renderToStaticMarkup(
      <Pagination page={2} pageSize={25} total={2847} onPageChange={() => {}} />,
    );

    expect(markup).toContain("Showing 26–50 of 2,847");
    expect(markup).toMatch(/aria-current="page"[^>]*>2</);
  });

  it("renders links when given getHref, and no link for the current page", () => {
    const markup = renderToStaticMarkup(
      <Pagination page={1} pageSize={25} total={100} getHref={(page) => `?page=${page}`} />,
    );

    expect(markup).toContain('href="?page=2"');
    expect(markup).not.toContain('href="?page=1"');
  });

  it("hides the page buttons when everything fits on one page", () => {
    const markup = renderToStaticMarkup(
      <Pagination page={1} pageSize={25} total={18} onPageChange={() => {}} />,
    );

    expect(markup).toContain("Showing 1–18 of 18");
    expect(markup).not.toContain("<button");
  });
});

describe("PaginationLoadMore", () => {
  it("drops the button once everything is shown", () => {
    const more = renderToStaticMarkup(
      <PaginationLoadMore shown={25} total={60} onLoadMore={() => {}} />,
    );
    const done = renderToStaticMarkup(
      <PaginationLoadMore shown={60} total={60} onLoadMore={() => {}} />,
    );

    expect(more).toContain("Load more");
    expect(done).not.toContain("<button");
    expect(done).toContain("Showing 60 of 60");
  });
});
