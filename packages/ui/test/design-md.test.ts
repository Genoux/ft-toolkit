import { describe, expect, it } from "vitest";
import { currentDesignFrontmatter, renderDesignFrontmatter } from "../scripts/design-md";

describe("DESIGN.md", () => {
  it("carries the tokens theme.css and fieldtrip.css define", () => {
    expect(
      currentDesignFrontmatter(),
      "DESIGN.md is out of date with the tokens: run `bun run design` in packages/ui",
    ).toBe(renderDesignFrontmatter());
  });
});
