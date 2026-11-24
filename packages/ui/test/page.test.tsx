import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DetailLayout } from "../src/components/detail-layout";
import { Grid } from "../src/components/layout";
import {
  Page,
  PageBackLink,
  PageHeader,
  PagePager,
  PageSection,
  PageToolbar,
} from "../src/components/page";
import { TooltipProvider } from "../src/components/tooltip";

const renderWithTooltips = (node: ReactNode) =>
  renderToStaticMarkup(<TooltipProvider>{node}</TooltipProvider>);

describe("PageHeader", () => {
  it("puts the back link above the title and meta after the description", () => {
    const markup = renderToStaticMarkup(
      <PageHeader
        back={<PageBackLink href="/creators">Creators</PageBackLink>}
        title="Jade Rivera"
        description="Lifestyle creator"
        meta={<span>Active</span>}
      />,
    );

    const order = ["page-back-link", "<h1", "Lifestyle creator", "page-header-meta"].map((needle) =>
      markup.indexOf(needle),
    );
    expect(order.every((position) => position >= 0)).toBe(true);
    expect([...order].sort((first, second) => first - second)).toEqual(order);
  });

  it("sets meta on the description's line, or beside the title without a description", () => {
    const withDescription = renderToStaticMarkup(
      <PageHeader title="Nutramax" description="18 of 40 sourced" meta={<span>Urgent</span>} />,
    );
    const titleOnly = renderToStaticMarkup(
      <PageHeader title="Nutramax" meta={<span>Urgent</span>} />,
    );

    expect(withDescription).toMatch(
      /<p[^>]*>18 of 40 sourced<\/p><div data-slot="page-header-meta"/,
    );
    expect(titleOnly).toMatch(/<h1[^>]*>Nutramax<\/h1><div data-slot="page-header-meta"/);
  });

  it("aligns the actions to the title row, not the bottom of the header", () => {
    const markup = renderToStaticMarkup(
      <PageHeader
        title="Nutramax"
        description="18 of 40 sourced"
        actions={<button type="button">Add</button>}
      />,
    );

    expect(markup).toContain("items-start justify-between");
    expect(markup).toMatch(
      /data-slot="page-header-actions" class="[^"]*min-h-\(--text-title--line-height\)/,
    );
  });
});

describe("PageHeader slots", () => {
  it("puts the pager on the back link's row and the media before the title", () => {
    const markup = renderWithTooltips(
      <PageHeader
        back={<PageBackLink href="/requests">Requests</PageBackLink>}
        pager={<PagePager position={2} total={3} />}
        media={<span data-avatar />}
        title="Ben Okafor"
      />,
    );

    const order = ["page-back-link", "page-pager", "page-header-media", "<h1"].map((needle) =>
      markup.indexOf(needle),
    );
    expect(order.every((position) => position >= 0)).toBe(true);
    expect([...order].sort((first, second) => first - second)).toEqual(order);
  });
});

describe("PagePager", () => {
  const disabledButtons = (markup: string) => markup.match(/<button[^>]*disabled=""/g)?.length ?? 0;

  it("disables a direction at the end of the list or without a handler", () => {
    const step = () => undefined;
    expect(
      renderWithTooltips(<PagePager position={2} total={3} onPrevious={step} onNext={step} />),
    ).toContain("2 of 3");
    expect(
      disabledButtons(
        renderWithTooltips(<PagePager position={2} total={3} onPrevious={step} onNext={step} />),
      ),
    ).toBe(0);
    expect(
      disabledButtons(
        renderWithTooltips(<PagePager position={1} total={3} onPrevious={step} onNext={step} />),
      ),
    ).toBe(1);
    expect(disabledButtons(renderWithTooltips(<PagePager position={2} total={3} />))).toBe(2);
  });
});

describe("DetailLayout", () => {
  it("orders summary, main and aside on narrow screens", () => {
    const markup = renderToStaticMarkup(
      <DetailLayout summary="Status" aside="Decision">
        Evidence
      </DetailLayout>,
    );

    expect(markup).toMatch(/data-slot="detail-layout-main" class="order-2[^"]*"/);
    expect(markup).toMatch(/data-slot="detail-layout-summary" class="order-1[^"]*">Status/);
    expect(markup).toMatch(/data-slot="detail-layout-aside-content" class="order-3[^"]*">Decision/);
  });

  it("leaves out the side column when there is nothing for it", () => {
    expect(renderToStaticMarkup(<DetailLayout>Form</DetailLayout>)).not.toContain(
      "detail-layout-aside",
    );
  });
});

describe("PageBackLink", () => {
  it("keeps the arrow when rendering the router's link", () => {
    const markup = renderToStaticMarkup(
      <PageBackLink asChild>
        <a href="/creators" data-router="link">
          Creators
        </a>
      </PageBackLink>,
    );

    expect(markup).toMatch(/^<a[^>]*data-router="link"[^>]*><svg[^>]*>.*<\/svg>Creators<\/a>$/);
  });
});

describe("Page", () => {
  it("centres a full-height column up to 36rem and pins the footer after the content", () => {
    const markup = renderToStaticMarkup(
      <Page size="centered" footer="Help">
        <h1>Sign in</h1>
      </Page>,
    );

    expect(markup).toMatch(
      /^<div data-slot="page" data-size="centered" class="[^"]*min-h-svh[^"]*max-w-xl/,
    );
    expect(markup).toMatch(/<h1>Sign in<\/h1><footer data-slot="page-footer"[^>]*>Help<\/footer>/);
  });

  it("hands the remaining height to its last child only with fill", () => {
    const flow = renderToStaticMarkup(<Page>Content</Page>);
    const fill = renderToStaticMarkup(<Page fill>Content</Page>);

    expect(flow).not.toContain("data-fill");
    expect(fill).toMatch(
      /^<div data-slot="page" data-size="default" data-fill="true" class="[^"]*\*:last:flex-1/,
    );
    expect(fill).toContain("min-h-0 flex-1");
  });

  it("grows to the shell's height so an empty state can fill the room under the header", () => {
    expect(renderToStaticMarkup(<Page>Content</Page>)).toMatch(/class="[^"]*\bgrow\b/);
  });

  it("renders the footer inside the child element with asChild", () => {
    const markup = renderToStaticMarkup(
      <Page asChild size="centered" footer="Help">
        <main>Content</main>
      </Page>,
    );

    expect(markup).toMatch(
      /^<main data-slot="page"[^>]*>Content<footer[^>]*>Help<\/footer><\/main>$/,
    );
  });
});

describe("PageToolbar", () => {
  it("only sticks when asked", () => {
    expect(renderToStaticMarkup(<PageToolbar />)).not.toContain("sticky");
    expect(renderToStaticMarkup(<PageToolbar sticky />)).toContain("sticky top-2");
  });
});

describe("Grid", () => {
  it("auto-fills by default and uses a fixed count with cols", () => {
    expect(renderToStaticMarkup(<Grid />)).toContain("auto-fill");
    const fixed = renderToStaticMarkup(<Grid cols={4} />);
    expect(fixed).toContain("lg:grid-cols-4");
    expect(fixed).not.toContain("auto-fill");
    expect(renderToStaticMarkup(<Grid cols={3} />)).toContain("sm:grid-cols-2");
  });

  it("keeps two columns on a phone only when asked", () => {
    expect(renderToStaticMarkup(<Grid cols={4} />)).not.toContain("max-sm:grid-cols-2");
    expect(renderToStaticMarkup(<Grid cols={4} phoneCols={2} />)).toContain("max-sm:grid-cols-2");
    expect(renderToStaticMarkup(<Grid min="sm" phoneCols={2} />)).toContain("max-sm:grid-cols-2");
  });
});

describe("PageSection", () => {
  it("writes the count as muted text after the title, never a pill", () => {
    const markup = renderToStaticMarkup(
      <PageSection title="Sourced profiles" meta="20 profiles">
        Rows
      </PageSection>,
    );

    expect(markup).toMatch(
      /<h2[^>]*>Sourced profiles<\/h2><span data-slot="page-section-meta" class="[^"]*text-muted-foreground[^"]*">20 profiles<\/span>/,
    );
  });

  it("centres the title row on its actions, and tops it under a description", () => {
    const headerClass = (markup: string) =>
      markup.match(/data-slot="page-section-header" class="([^"]*)"/)?.[1]?.split(" ") ?? [];

    expect(
      headerClass(
        renderToStaticMarkup(
          <PageSection title="Profiles" actions={<button type="button">Add</button>} />,
        ),
      ),
    ).toContain("items-center");
    expect(
      headerClass(
        renderToStaticMarkup(
          <PageSection
            title="Profiles"
            description="Sourced for Nutramax"
            actions={<button type="button">Add</button>}
          />,
        ),
      ),
    ).toContain("items-start");
  });
});
