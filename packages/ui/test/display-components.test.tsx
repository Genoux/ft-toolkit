import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
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
