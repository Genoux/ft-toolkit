import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "../src/components/avatar";
import { Badge } from "../src/components/badge";
import { InfoHint } from "../src/components/info-hint";
import { PersonAvatar } from "../src/components/person-identity";
import { StatusDot } from "../src/components/status-dot";
import { TooltipProvider } from "../src/components/tooltip";

describe("color on StatusDot and Badge", () => {
  it("paints the dot with the colour instead of the tone", () => {
    const markup = renderToStaticMarkup(
      <StatusDot color="var(--color-turn-people)" label="With People" />,
    );

    expect(markup).toContain("background-color:var(--color-turn-people)");
    expect(markup).not.toContain("bg-subtle-foreground");
  });

  it("sets the badge colour variable and drops the variant's fill", () => {
    const markup = renderToStaticMarkup(
      <Badge color="var(--color-turn-finance)" dot>
        With Finance
      </Badge>,
    );

    expect(markup).toContain("--tone:var(--color-turn-finance)");
    expect(markup).not.toContain("bg-primary ");
    expect(markup).toContain('data-variant="default"');
  });
});

describe("PersonAvatar size", () => {
  it("takes Avatar's sizes and keeps the 20px default", () => {
    expect(renderToStaticMarkup(<PersonAvatar name="Ben Okafor" />)).toContain('data-size="xs"');
    expect(renderToStaticMarkup(<PersonAvatar name="Ben Okafor" size="md" />)).toContain(
      'data-size="md"',
    );
  });
});

describe("StatusDot description", () => {
  it("puts the line under the label in the label's column, not under the dot", () => {
    const markup = renderToStaticMarkup(
      <StatusDot label="Promotion for Tomás" description="Draft, effective Jul 1, 2027" />,
    );
    expect(markup).toContain("grid-cols-[auto_minmax(0,1fr)]");
    expect(markup).toMatch(/data-slot="status-dot-description" class="col-start-2 [^"]*">Draft/);
  });
});

describe("avatar stack", () => {
  it("paints overlapping discs opaque, so the avatar under one never shows through", () => {
    const markup = renderToStaticMarkup(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>BO</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>,
    );
    const classOf = (slot: string) =>
      markup.match(new RegExp(`data-slot="${slot}" class="([^"]+)"`))?.[1];
    const opaqueFill = "bg-[color-mix(in_oklab,var(--foreground)_8%,var(--card))]";
    expect(classOf("avatar-group-count")).toContain(opaqueFill);
    expect(classOf("avatar-group-count")).not.toMatch(/(^|\s)bg-[a-z-]+\/\d/);
    expect(classOf("avatar-fallback")).toContain(`in-data-[slot=avatar-group]:${opaqueFill}`);
  });
});

describe("InfoHint", () => {
  it("names the button with its label, not the hint", () => {
    const markup = renderToStaticMarkup(
      <TooltipProvider>
        <InfoHint label="What band position means">0% is the band minimum.</InfoHint>
      </TooltipProvider>,
    );

    expect(markup).toContain('aria-label="What band position means"');
    expect(markup).toContain('type="button"');
  });
});
