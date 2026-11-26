import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import { openStory, ROOT, storybook, storyIds } from "./storybook";

// Visual regression for @fieldtripagency/ui: screenshots every Storybook story at desktop and phone
// width and compares them with the last approved run. Screenshots stay local in .visual/ (gitignored).
//   bun run visual            build Storybook, snapshot, diff against .visual/baseline
//   bun run visual:approve    accept the current snapshot as the new baseline
//   --url http://localhost:6006   snapshot a running Storybook instead of building one
//   --filter organisms-page    only stories whose id contains the text

const VISUAL = join(ROOT, ".visual");
const BASELINE = join(VISUAL, "baseline");
const CURRENT = join(VISUAL, "current");
const DIFF = join(VISUAL, "diff");
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
] as const;
// Anti-aliasing noise stays under this; a moved element or a changed colour does not.
const CHANGED_PIXEL_THRESHOLD = 20;

function approve() {
  if (!existsSync(CURRENT)) {
    console.error("Nothing to approve: run `bun run visual` first.");
    process.exit(1);
  }
  rmSync(BASELINE, { recursive: true, force: true });
  cpSync(CURRENT, BASELINE, { recursive: true });
  console.log("Baseline updated from the current snapshot.");
}

async function snapshot(baseUrl: string) {
  const ids = await storyIds(baseUrl);
  rmSync(CURRENT, { recursive: true, force: true });
  const browser = await chromium.launch();
  for (const viewport of VIEWPORTS) {
    mkdirSync(join(CURRENT, viewport.name), { recursive: true });
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const id of ids) {
      await openStory(page, baseUrl, id);
      await page.screenshot({ path: join(CURRENT, viewport.name, `${id}.png`), fullPage: true });
    }
    await page.close();
  }
  await browser.close();
  return ids;
}

function compare(ids: string[]) {
  if (!existsSync(BASELINE)) {
    console.log(
      `No baseline yet: ${ids.length} stories snapshotted. Run \`bun run visual:approve\` to accept them.`,
    );
    return 0;
  }
  rmSync(DIFF, { recursive: true, force: true });
  const changed: string[] = [];
  for (const viewport of VIEWPORTS) {
    for (const id of ids) {
      const name = join(viewport.name, `${id}.png`);
      const before = join(BASELINE, name);
      if (!existsSync(before)) {
        changed.push(`NEW      ${name}`);
        continue;
      }
      const baseline = PNG.sync.read(readFileSync(before));
      const current = PNG.sync.read(readFileSync(join(CURRENT, name)));
      if (baseline.width !== current.width || baseline.height !== current.height) {
        changed.push(
          `RESIZED  ${name}  ${baseline.width}×${baseline.height} → ${current.width}×${current.height}`,
        );
        continue;
      }
      const diff = new PNG({ width: baseline.width, height: baseline.height });
      const pixels = pixelmatch(
        baseline.data,
        current.data,
        diff.data,
        baseline.width,
        baseline.height,
        {
          threshold: 0.1,
        },
      );
      if (pixels > CHANGED_PIXEL_THRESHOLD) {
        mkdirSync(join(DIFF, viewport.name), { recursive: true });
        writeFileSync(join(DIFF, name), PNG.sync.write(diff));
        changed.push(`CHANGED  ${name}  (${pixels} px)`);
      }
    }
  }
  for (const line of changed) console.log(line);
  console.log(
    changed.length === 0
      ? `No visual change in ${ids.length} stories.`
      : `${changed.length} snapshots differ. Diff images: .visual/diff. If they are intended: bun run visual:approve`,
  );
  return changed.length;
}

if (process.argv.includes("--approve")) {
  approve();
} else {
  const { baseUrl, stop } = storybook();
  const ids = await snapshot(baseUrl);
  stop();
  process.exit(compare(ids) === 0 ? 0 : 1);
}
