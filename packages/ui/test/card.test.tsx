import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CardTitle } from "../src/components/card";

describe("CardTitle", () => {
  it("is a heading, so screen readers can jump between cards", () => {
    expect(renderToStaticMarkup(<CardTitle>Proposal</CardTitle>)).toMatch(
      /^<h2 [^>]*>Proposal<\/h2>$/,
    );
  });

  it("takes the level of its place in the outline", () => {
    expect(renderToStaticMarkup(<CardTitle level={3}>Policy</CardTitle>)).toMatch(/^<h3 /);
  });
});
