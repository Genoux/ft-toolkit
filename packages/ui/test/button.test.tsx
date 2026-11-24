import { BellIcon } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "../src/components/button";

describe("Button loading", () => {
  const spinnerCount = (markup: string) => markup.match(/data-slot="button-spinner"/g)?.length ?? 0;

  it("swaps the leading icon for the spinner and keeps the label", () => {
    const markup = renderToStaticMarkup(
      <Button loading>
        <BellIcon />
        Send invite
      </Button>,
    );

    expect(spinnerCount(markup)).toBe(1);
    expect(markup).not.toContain("lucide-bell");
    expect(markup).toContain("Send invite");
  });

  it("swaps a trailing icon at the end", () => {
    const markup = renderToStaticMarkup(
      <Button loading>
        Continue
        <BellIcon data-icon="inline-end" />
      </Button>,
    );

    expect(markup).toMatch(
      /Continue<svg[^>]*data-slot="button-spinner"[^>]*data-icon="inline-end"/,
    );
  });

  it("lays the spinner over a text-only label, which stays in the accessible name", () => {
    const markup = renderToStaticMarkup(<Button loading>Save changes</Button>);

    expect(spinnerCount(markup)).toBe(1);
    expect(markup).toContain('<span class="opacity-0">Save changes</span>');
    expect(markup).toContain('aria-busy="true"');
  });
});
