import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LabeledField } from "../src/components/labeled-field";

describe("LabeledField", () => {
  it("shows a zero value and hides an empty one", () => {
    expect(renderToStaticMarkup(<LabeledField label="Revisions left" value={0} />)).toContain(
      ">0<",
    );
    expect(renderToStaticMarkup(<LabeledField label="Notes" value="" />)).toBe("");
  });
});
