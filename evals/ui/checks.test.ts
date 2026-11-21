import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { type Browser, chromium } from "playwright";
import { countSpacingChoices, inspectPage } from "./checks";

const BROKEN = `<!doctype html><html lang="en"><head><title>Broken</title></head><body>
<main>
  <div style="width:2000px">too wide</div>
  <div style="width:80px;overflow:hidden;white-space:nowrap">a label that is far too long for its box</div>
  <button style="width:16px;height:16px;padding:0">x</button>
  <section>
    <div data-slot="card" style="padding:16px">First card</div>
    <div data-slot="card" style="padding:24px">Second card</div>
  </section>
  <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
</main></body></html>`;

const CLEAN = `<!doctype html><html lang="en"><head><title>Clean</title></head><body>
<main>
  <h1>Clients</h1>
  <div style="width:80px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">a long truncated label</div>
  <button style="width:32px;height:32px">Go</button>
  <label><input type="checkbox" style="width:16px;height:16px"> Remember me</label>
  <section>
    <div data-slot="card" style="padding:16px">First card</div>
    <div data-slot="card" style="padding:16px">Second card</div>
  </section>
  <p>Read <a href="/terms">the terms</a>.</p>
</main></body></html>`;

let browser: Browser;
beforeAll(async () => {
  browser = await chromium.launch();
});
afterAll(async () => {
  await browser.close();
});

async function checksOn(html: string) {
  const context = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const page = await context.newPage();
  await page.setContent(html);
  const findings = await inspectPage(page);
  await context.close();
  return new Set(findings.map(({ check }) => check));
}

describe("inspectPage", () => {
  it("flags every obvious layout and accessibility bug", async () => {
    const checks = await checksOn(BROKEN);
    expect([...checks].sort()).toEqual(
      [
        "a11y:image-alt",
        "clipped-content",
        "inconsistent-padding",
        "page-overflow",
        "small-target",
      ].sort(),
    );
  });

  it("stays quiet on intended truncation, labelled controls and links in text", async () => {
    expect([...(await checksOn(CLEAN))]).toEqual([]);
  });
});

describe("countSpacingChoices", () => {
  it("counts hand-written padding, margin and gap utilities", () => {
    expect(countSpacingChoices(['<div className="p-4 mt-2 gap-x-1.5 -mx-3">', "<Card />"])).toBe(4);
  });

  it("ignores words that only look like spacing", () => {
    expect(countSpacingChoices(['<div className="top-4 map-2 py-[13px]">'])).toBe(0);
  });
});
