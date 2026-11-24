import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CollapsibleBody,
  CollapsibleContent,
  CollapsibleHeader,
  CollapsibleSection,
} from "../src/components/collapsible-section";

function classOf(markup: string, slot: string): string {
  const match = markup.match(
    new RegExp(`data-slot="${slot}"[^>]*class="([^"]*)"|class="([^"]*)"[^>]*data-slot="${slot}"`),
  );
  return match?.[1] ?? match?.[2] ?? "";
}

function section(props: Partial<React.ComponentProps<typeof CollapsibleSection>> = {}) {
  return renderToStaticMarkup(
    <CollapsibleSection defaultOpen {...props}>
      <CollapsibleHeader meta="Nov 18">Payment</CollapsibleHeader>
      <CollapsibleBody>Details</CollapsibleBody>
    </CollapsibleSection>,
  );
}

describe("CollapsibleSection", () => {
  it("draws a line under the header and pads the body on every side by default", () => {
    const markup = section();

    expect(classOf(markup, "collapsible-content").split(" ")).toContain("border-t");
    expect(classOf(markup, "collapsible-body").split(" ")).toContain("p-(--collapsible-pad)");
    expect(classOf(markup, "collapsible-body")).not.toContain("pt-0");
  });

  it("drops the line and the body's top padding when divider is false", () => {
    const markup = section({ divider: false });

    expect(classOf(markup, "collapsible-content").split(" ")).not.toContain("border-t");
    expect(classOf(markup, "collapsible-body").split(" ")).toContain("pt-0");
  });

  it("puts the chevron after the title by default and before it with chevron start", () => {
    const end = section();
    const start = section({ chevron: "start" });

    expect(end.indexOf('data-slot="collapsible-chevron"')).toBeGreaterThan(end.indexOf("Payment"));
    expect(start.indexOf('data-slot="collapsible-chevron"')).toBeLessThan(start.indexOf("Payment"));
  });

  it("uses one padding for header and body, 20px by default and 14px when small", () => {
    expect(classOf(section(), "collapsible-section")).toContain("[--collapsible-pad:--spacing(5)]");
    expect(classOf(section({ size: "sm" }), "collapsible-section")).toContain(
      "[--collapsible-pad:--spacing(3.5)]",
    );
    expect(section()).toMatch(
      /data-slot="collapsible-header"[^>]*><div class="[^"]*p-\(--collapsible-pad\)/,
    );
  });

  it("frames header and body on one card surface in both variants", () => {
    for (const variant of ["default", "card"] as const) {
      expect(classOf(section({ variant }), "collapsible-section").split(" ")).toEqual(
        expect.arrayContaining(["border", "bg-card"]),
      );
    }
  });

  it("names the toggle by its title alone and stretches it over the header", () => {
    const markup = section();
    const button = markup.match(/<button[^>]*>(.*?)<\/button>/);

    expect(button?.[0]).toContain("after:absolute");
    expect(button?.[1]).toContain("Payment");
    expect(button?.[1]).not.toContain("Nov 18");
  });

  it("raises the actions above the stretched toggle so they keep their own clicks", () => {
    const markup = renderToStaticMarkup(
      <CollapsibleSection>
        <CollapsibleHeader actions={<button type="button">Download</button>}>
          Payment
        </CollapsibleHeader>
      </CollapsibleSection>,
    );

    expect(markup).toMatch(/class="[^"]*relative z-10[^"]*"><button type="button">Download/);
  });

  it("links the header button to the content it toggles", () => {
    const markup = section();
    const controls = markup.match(/aria-controls="([^"]+)"/)?.[1];

    expect(markup).toContain('aria-expanded="true"');
    expect(controls).toBeTruthy();
    expect(markup).toContain(`id="${controls}"`);
  });

  it("follows the open prop when controlled", () => {
    const markup = renderToStaticMarkup(
      <CollapsibleSection open onOpenChange={() => {}}>
        <CollapsibleHeader>Payment</CollapsibleHeader>
        <CollapsibleBody>Details</CollapsibleBody>
      </CollapsibleSection>,
    );

    expect(markup).toContain("Details");
  });

  it("still lets an app remove the line with border-t-0, as apps do today", () => {
    const markup = renderToStaticMarkup(
      <CollapsibleSection defaultOpen>
        <CollapsibleHeader>Payment</CollapsibleHeader>
        <CollapsibleContent className="border-t-0">Details</CollapsibleContent>
      </CollapsibleSection>,
    );

    const classes = classOf(markup, "collapsible-content").split(" ");
    expect(classes).toContain("border-t-0");
    expect(classes).not.toContain("border-t");
  });
});
