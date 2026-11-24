import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(import.meta.dirname, "..", "src");

const HAND_WRITTEN_FOCUS = /\S*focus\S*:(ring|border-ring)\S*|(?<![\w-])ring-inset\b/g;

const sourceFiles = ["components", "internal"].flatMap((folder) =>
  readdirSync(join(SRC, folder)).map((name) => join(folder, name)),
);

describe("focus indicator", () => {
  it.each(sourceFiles)("%s draws focus only with the focus-ring utilities", (file) => {
    const source = readFileSync(join(SRC, file), "utf8");
    expect(source.match(HAND_WRITTEN_FOCUS) ?? []).toEqual([]);
  });

  it.each(sourceFiles)("%s names the properties it transitions", (file) => {
    expect(readFileSync(join(SRC, file), "utf8")).not.toContain("transition-all");
  });
});
