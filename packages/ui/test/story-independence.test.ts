import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const STORIES = join(import.meta.dirname, "..", "stories");
const SCREENS = join(STORIES, "screens");

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return path === SCREENS ? [] : sourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });

// The Screens/* stories are temporary copies of each app's pages, deleted when that app moves onto
// the kit. Component and pattern stories must still build without them.
describe("stories outside Screens", () => {
  it("never import from the screen copies", () => {
    const offenders = sourceFiles(STORIES).filter((file) =>
      /from\s+["'][^"']*\/screens\//.test(readFileSync(file, "utf8")),
    );
    expect(offenders.map((file) => relative(STORIES, file))).toEqual([]);
  });
});
