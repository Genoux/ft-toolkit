import { BellIcon } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge } from "../src/components/badge";
import { IconButton } from "../src/components/icon-button";
import { TooltipProvider } from "../src/components/tooltip";

describe("Badge asChild", () => {
  it("slots onto a link child", () => {
    const markup = renderToStaticMarkup(
      <Badge asChild variant="outline">
        <a href="#campaign">Spring launch</a>
      </Badge>,
    );

    expect(markup).toMatch(/^<a [^>]*data-slot="badge"[^>]*>Spring launch<\/a>$/);
  });

  it("puts the dot inside the slotted child", () => {
    const markup = renderToStaticMarkup(
      <Badge asChild variant="success" dot>
        <a href="#approved">Approved</a>
      </Badge>,
    );

    expect(markup).toMatch(/^<a [^>]*><span[^>]*data-slot="badge-dot"[^>]*><\/span>Approved<\/a>$/);
  });
});

describe("IconButton", () => {
  const render = (node: React.ReactElement) =>
    renderToStaticMarkup(<TooltipProvider>{node}</TooltipProvider>);

  it("draws the unread dot inside the button, also as a link", () => {
    const button = render(
      <IconButton label="Notifications, 3 unread" indicator>
        <BellIcon />
      </IconButton>,
    );
    const link = render(
      <IconButton label="Notifications" indicator asChild>
        <a href="/notifications">
          <BellIcon />
        </a>
      </IconButton>,
    );

    expect(button).toMatch(/<button[^>]*>.*data-slot="icon-button-indicator".*<\/button>/);
    expect(link).toMatch(
      /<a [^>]*href="\/notifications"[^>]*>.*data-slot="icon-button-indicator".*<\/a>/,
    );
  });

  it("keeps the label as the accessible name when a longer tooltip is given", () => {
    const markup = render(
      <IconButton label="Rerun" tooltip="Client rules changed after this run" tone="warning">
        <BellIcon />
      </IconButton>,
    );

    expect(markup).toContain('aria-label="Rerun"');
    expect(markup).toContain('data-tone="warning"');
  });

  it("keeps its own variant while its menu is open instead of turning primary", () => {
    const classOf = (variant: "ghost" | "secondary") =>
      render(
        <IconButton label="More actions" variant={variant}>
          <BellIcon />
        </IconButton>,
      ).match(/<button[^>]*class="([^"]*)"/)?.[1] ?? "";

    expect(classOf("ghost")).toContain("data-[state=open]:bg-muted");
    // Open is the hover tint, never a darker step.
    expect(classOf("secondary")).toContain("hover:bg-accent");
    expect(classOf("secondary")).toContain("data-[state=open]:bg-accent");
    expect(classOf("ghost")).not.toContain("data-[state=open]:bg-primary");
  });
});
