import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EmptyState } from "../src/components/empty-state";

describe("EmptyState", () => {
  it("renders an href action as a link styled as a button", () => {
    const markup = renderToStaticMarkup(
      <EmptyState
        title="No requests yet"
        action={{ label: "New request", href: "/requests/new" }}
      />,
    );

    expect(markup).toContain('href="/requests/new"');
    expect(markup).toContain('data-slot="button"');
    expect(markup).toContain(">New request</a>");
    expect(markup).not.toContain("<button");
  });

  it("renders an href action through renderLink, for a router link", () => {
    const markup = renderToStaticMarkup(
      <EmptyState
        title="No requests yet"
        action={{ label: "New request", href: "/requests/new" }}
        renderLink={(href, content) => (
          <a href={href} data-router-link="">
            {content}
          </a>
        )}
      />,
    );

    expect(markup).toContain('data-router-link=""');
    expect(markup).toContain('href="/requests/new"');
  });

  it("keeps an onClick action a button", () => {
    const markup = renderToStaticMarkup(
      <EmptyState title="No items yet" action={{ label: "Create item", onClick: () => {} }} />,
    );

    expect(markup).toContain(">Create item</button>");
    expect(markup).not.toContain("<a");
  });
});

describe("EmptyState height", () => {
  it("grows into the room its flex parent leaves, without forcing a height", () => {
    const classOf = (markup: string) =>
      markup.match(/data-slot="empty-state"[^>]*class="([^"]*)"/)?.[1]?.split(" ") ?? [];
    const classes = classOf(renderToStaticMarkup(<EmptyState title="No items" />));

    expect(classes).toContain("grow");
    expect(classes).not.toContain("h-full");
  });

  it("announces a destructive empty state", () => {
    const markup = renderToStaticMarkup(<EmptyState title="Couldn’t load" tone="destructive" />);

    expect(markup).toContain('role="alert"');
  });
});

describe("EmptyState frame", () => {
  it("sits on the page without a frame or a surface by default", () => {
    const markup = renderToStaticMarkup(<EmptyState title="No clients yet" />);

    expect(markup).not.toContain("data-frame");
    expect(markup).not.toContain("border");
    expect(markup).not.toContain("bg-card");
  });

  it("never frames a page-size message", () => {
    const markup = renderToStaticMarkup(<EmptyState size="page" title="Page not found" />);

    expect(markup).not.toContain("data-frame");
    expect(markup).not.toContain("rounded-xl");
  });
});

describe("EmptyState sizes and actions", () => {
  it("makes the title the page's h1 at page size", () => {
    const markup = renderToStaticMarkup(<EmptyState size="page" title="Page not found" />);

    expect(markup).toContain(">Page not found</h1>");
    expect(renderToStaticMarkup(<EmptyState title="No cycles yet" />)).not.toContain("<h1");
  });

  it("renders the secondary action after the action, and the meta line", () => {
    const markup = renderToStaticMarkup(
      <EmptyState
        title="Something went wrong"
        action={{ label: "Try again", onClick: () => {} }}
        secondaryAction={{ label: "Contact us", href: "mailto:support@inbeat.agency" }}
        meta="Reference ERR_7F3K"
      />,
    );

    expect(markup.indexOf("Try again")).toBeLessThan(markup.indexOf("Contact us"));
    expect(markup).toContain('data-variant="ghost"');
    expect(markup).toContain("Reference ERR_7F3K");
  });

  it("draws a dashed frame for an empty slot", () => {
    const markup = renderToStaticMarkup(<EmptyState title="No languages yet" frame="dashed" />);

    expect(markup).toContain('data-frame="dashed"');
    expect(markup).toContain("border-dashed");
  });
});
