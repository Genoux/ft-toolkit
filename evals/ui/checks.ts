import AxeBuilder from "@axe-core/playwright";
import type { Page } from "playwright";

export type Finding = { check: string; detail: string };

export const WIDTHS = [375, 768, 1280] as const;

// Serialized into the page by page.evaluate, so it must not reference anything outside itself.
export function inspectLayout(): Finding[] {
  const findings: Finding[] = [];
  const label = (element: Element) => {
    const slot = element.getAttribute("data-slot");
    const text = (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
    return `<${element.tagName.toLowerCase()}${slot ? ` data-slot="${slot}"` : ""}> "${text}"`;
  };
  const isVisible = (element: Element) => {
    const box = element.getBoundingClientRect();
    return box.width > 1 && box.height > 1 && getComputedStyle(element).visibility !== "hidden";
  };

  const root = document.documentElement;
  if (root.scrollWidth > window.innerWidth + 1) {
    findings.push({ check: "page-overflow", detail: `page is ${root.scrollWidth}px wide` });
  }

  const elements = [...document.body.querySelectorAll("*")].filter(isVisible);

  for (const element of elements) {
    const style = getComputedStyle(element);
    const clips = ["hidden", "clip"].includes(style.overflowX);
    const truncatesOnPurpose =
      style.textOverflow === "ellipsis" || element.closest("[data-slot^='carousel']");
    if (
      clips &&
      !truncatesOnPurpose &&
      element.scrollWidth > element.clientWidth + 1 &&
      (element.textContent ?? "").trim()
    ) {
      findings.push({ check: "clipped-content", detail: label(element) });
    }
  }

  // WCAG 2.5.8: targets at least 24px, unless a label extends them or they are links in text.
  const interactive = elements.filter((element) =>
    element.matches(
      "button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=checkbox], [role=switch], [role=tab], [role=menuitem]",
    ),
  );
  for (const element of interactive) {
    const box = element.getBoundingClientRect();
    const labelled =
      element.closest("label") ||
      (element.id && document.querySelector(`label[for="${element.id}"]`));
    const inlineLink = element.matches("a") && element.closest("p, li");
    if ((box.width < 24 || box.height < 24) && !labelled && !inlineLink) {
      findings.push({
        check: "small-target",
        detail: `${label(element)} ${Math.round(box.width)}x${Math.round(box.height)}`,
      });
    }
  }

  // Siblings that are the same component in the same variant should share their padding.
  const paddingOf = (element: Element) => {
    const style = getComputedStyle(element);
    return `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`;
  };
  const firstOfKind = new Map<string, Map<Element, Element>>();
  for (const element of elements) {
    const slot = element.getAttribute("data-slot");
    const parent = element.parentElement;
    if (!slot || !parent || /table|cell|head/.test(slot)) continue;
    const kind = [
      slot,
      element.getAttribute("data-variant"),
      element.getAttribute("data-size"),
    ].join("|");
    const byParent = firstOfKind.get(kind) ?? new Map<Element, Element>();
    firstOfKind.set(kind, byParent);
    const seen = byParent.get(parent);
    if (!seen) {
      byParent.set(parent, element);
      continue;
    }
    const padding = paddingOf(element);
    const seenPadding = paddingOf(seen);
    if (padding !== seenPadding) {
      findings.push({
        check: "inconsistent-padding",
        detail: `${label(seen)} ${seenPadding} vs ${label(element)} ${padding}`,
      });
    }
  }

  return findings;
}

export async function inspectPage(page: Page): Promise<Finding[]> {
  const layout = await page.evaluate(inspectLayout);
  const axe = await new AxeBuilder({ page }).analyze();
  const accessibility = axe.violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .flatMap((violation) =>
      violation.nodes.map((node) => ({
        check: `a11y:${violation.id}`,
        detail: node.target.join(" "),
      })),
    );
  return [...layout, ...accessibility];
}

const SPACING_CLASS =
  /(?<![\w-])-?(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy])-\d+(?:\.5)?\b/g;

/** Spacing utilities the agent wrote itself: each one is a padding or gap it chose by hand. */
export function countSpacingChoices(addedLines: string[]): number {
  return addedLines.reduce((total, line) => total + (line.match(SPACING_CLASS)?.length ?? 0), 0);
}
