import { spawnSync } from "node:child_process";
import { join } from "node:path";
import type { Page } from "playwright";

// Shared by the browser checks (visual.ts, align.ts): build or reach a Storybook, list its stories
// and open one settled, so every check sees the same rendering.

export const ROOT = join(import.meta.dirname, "..");
const STATIC = join(ROOT, "packages", "ui", "storybook-static");

export function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function buildStorybook() {
  const build = spawnSync("bunx", ["storybook", "build", "-o", STATIC, "--quiet"], {
    cwd: join(ROOT, "packages", "ui"),
    stdio: "inherit",
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

function serveStatic() {
  return Bun.serve({
    port: 0,
    async fetch(request) {
      const path = new URL(request.url).pathname;
      const file = Bun.file(join(STATIC, path === "/" ? "index.html" : path));
      return (await file.exists())
        ? new Response(file)
        : new Response("not found", { status: 404 });
    },
  });
}

/** The Storybook to check: `--url` when given, otherwise a fresh static build served locally. */
export function storybook() {
  const url = argument("--url");
  if (url) return { baseUrl: url, stop: () => {} };
  buildStorybook();
  const server = serveStatic();
  return { baseUrl: `http://localhost:${server.port}`, stop: () => server.stop() };
}

// Screens/* are temporary copies of each app's pages, removed as each app moves onto the kit; the
// checks guard the kit on its own component and pattern stories instead.
const isScreenCopy = (id: string) => id.startsWith("screens-");

export async function storyIds(baseUrl: string, filter = argument("--filter") ?? "") {
  const index = (await (await fetch(`${baseUrl}/index.json`)).json()) as {
    entries: Record<string, { type: string }>;
  };
  return Object.entries(index.entries)
    .filter(([id, entry]) => entry.type === "story" && !isScreenCopy(id) && id.includes(filter))
    .map(([id]) => id);
}

export async function openStory(page: Page, baseUrl: string, id: string) {
  await page.goto(`${baseUrl}/iframe.html?id=${id}&viewMode=story`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
}
