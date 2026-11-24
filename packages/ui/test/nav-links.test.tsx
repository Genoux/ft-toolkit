import { Building2 } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NavLinks } from "../src/components/nav-links";

const ITEMS = [
  { title: "Clients", icon: Building2, isActive: true, count: 4 },
  { title: "Database", icon: Building2, disabled: true },
];

function links(orientation?: "horizontal" | "vertical") {
  return renderToStaticMarkup(
    <NavLinks
      items={ITEMS}
      orientation={orientation}
      renderLink={(item, content) => <a href={`/${item.title}`}>{content}</a>}
    />,
  );
}

describe("NavLinks", () => {
  it("marks only the active link as the current page and draws its indicator", () => {
    const markup = links();

    expect(markup.match(/aria-current="page"/g)).toHaveLength(1);
    expect(markup.match(/data-slot="nav-links-indicator"/g)).toHaveLength(1);
    expect(markup.match(/<a[^>]*href="\/Database"[^>]*>/)?.[0]).toContain('aria-disabled="true"');
  });

  it("shows icons and counts only in the vertical list", () => {
    expect(links()).not.toContain("lucide-building");
    expect(links()).not.toContain('data-slot="nav-links-count"');
    expect(links("vertical")).toContain("lucide-building");
    expect(links("vertical")).toContain('data-slot="nav-links-count"');
  });
});
