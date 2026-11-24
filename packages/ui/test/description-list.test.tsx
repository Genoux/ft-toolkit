import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DescriptionItem, DescriptionList } from "../src/components/description-list";

describe("DescriptionList", () => {
  it("leaves out rows without a value", () => {
    const markup = renderToStaticMarkup(
      <DescriptionList>
        <DescriptionItem label="Country">Canada</DescriptionItem>
        <DescriptionItem label="Deadline">{null}</DescriptionItem>
        <DescriptionItem label="Notes">{""}</DescriptionItem>
      </DescriptionList>,
    );

    expect(markup).toContain("Country");
    expect(markup).not.toContain("Deadline");
    expect(markup).not.toContain("Notes");
  });

  it("takes the list's layout unless a row overrides it", () => {
    const markup = renderToStaticMarkup(
      <DescriptionList layout="stacked">
        <DescriptionItem label="Brief">Three videos</DescriptionItem>
        <DescriptionItem label="Tier" layout="inline">
          Micro
        </DescriptionItem>
      </DescriptionList>,
    );

    expect(markup.match(/data-layout="stacked"/g)).toHaveLength(2);
    expect(markup).toContain('data-layout="inline"');
  });

  it("marks a framed list, never a framed tile row", () => {
    const framed = renderToStaticMarkup(
      <DescriptionList frame>
        <DescriptionItem label="Deadline">Nov 26, 2026</DescriptionItem>
      </DescriptionList>,
    );
    const tiles = renderToStaticMarkup(
      <DescriptionList layout="tiles" frame>
        <DescriptionItem label="Total paid">$1,500</DescriptionItem>
      </DescriptionList>,
    );

    expect(framed).toContain('data-frame="true"');
    expect(tiles).not.toContain("data-frame");
  });

  it("divides only a framed inline list", () => {
    const divided = renderToStaticMarkup(
      <DescriptionList frame divided>
        <DescriptionItem label="Deadline">Nov 26, 2026</DescriptionItem>
      </DescriptionList>,
    );
    const unframed = renderToStaticMarkup(
      <DescriptionList divided>
        <DescriptionItem label="Deadline">Nov 26, 2026</DescriptionItem>
      </DescriptionList>,
    );
    const stacked = renderToStaticMarkup(
      <DescriptionList layout="stacked" frame divided>
        <DescriptionItem label="Deadline">Nov 26, 2026</DescriptionItem>
      </DescriptionList>,
    );

    expect(divided).toContain('data-divided="true"');
    expect(unframed).not.toContain("data-divided");
    expect(stacked).not.toContain("data-divided");
  });
});
