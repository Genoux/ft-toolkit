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
