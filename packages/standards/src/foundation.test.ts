import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { foundationProblems } from "./foundation";

const VALID_FILES: Record<string, string> = {
  "biome.json": JSON.stringify({ extends: ["@fieldtripagency/config/biome"] }),
  "tsconfig.json": JSON.stringify({ extends: "@fieldtripagency/config/tsconfig/nextjs.json" }),
  ".dependency-cruiser.cjs":
    'module.exports = require("@fieldtripagency/config/dependency-cruiser");',
  "vitest.config.ts": 'import { vitestPreset } from "@fieldtripagency/config/vitest";',
};

function appWith(overrides: Record<string, string | null> = {}): string {
  const dir = mkdtempSync(join(tmpdir(), "ft-foundation-"));
  for (const [path, contents] of Object.entries({ ...VALID_FILES, ...overrides })) {
    if (contents === null) continue;
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), contents);
  }
  return dir;
}

describe("foundationProblems", () => {
  it("passes an app that uses every preset", () => {
    expect(foundationProblems(appWith())).toEqual([]);
  });

  it("accepts extends as a string or as an array containing the preset", () => {
    const dir = appWith({
      "biome.json": JSON.stringify({ extends: "@fieldtripagency/config/biome" }),
      "tsconfig.json": JSON.stringify({
        extends: ["./base.json", "@fieldtripagency/config/tsconfig/nextjs.json"],
      }),
    });
    expect(foundationProblems(dir)).toEqual([]);
  });

  it("accepts an app that overrides fields next to the vitest preset", () => {
    const dir = appWith({
      "vitest.config.ts": `import { vitestPreset } from "@fieldtripagency/config/vitest";
export default { test: { ...vitestPreset.test, restoreMocks: false } };`,
    });
    expect(foundationProblems(dir)).toEqual([]);
  });

  it.each([
    ["biome.json", "biome.json (or biome.jsonc) must extend @fieldtripagency/config/biome"],
    ["tsconfig.json", "tsconfig.json must extend @fieldtripagency/config/tsconfig/nextjs.json"],
    [
      ".dependency-cruiser.cjs",
      ".dependency-cruiser.cjs must use @fieldtripagency/config/dependency-cruiser",
    ],
    ["vitest.config.ts", "vitest.config.ts must import from @fieldtripagency/config/vitest"],
  ])("reports a missing %s", (file, message) => {
    expect(foundationProblems(appWith({ [file]: null }))).toEqual([message]);
  });

  it("reports a config that does not use the preset", () => {
    const dir = appWith({
      "biome.json": JSON.stringify({ extends: ["./own.json"] }),
      "tsconfig.json": JSON.stringify({ compilerOptions: {} }),
      ".dependency-cruiser.cjs": "module.exports = {};",
      "vitest.config.ts": "export default {};",
    });
    expect(foundationProblems(dir)).toHaveLength(4);
  });

  it("accepts biome.json and tsconfig.json with comments and trailing commas", () => {
    const dir = appWith({
      "biome.json": '{\n  // shared rules\n  "extends": ["@fieldtripagency/config/biome",],\n}',
      "tsconfig.json":
        '{\n  /* preset */ "extends": "@fieldtripagency/config/tsconfig/nextjs.json",\n  "compilerOptions": {},\n}',
    });
    expect(foundationProblems(dir)).toEqual([]);
  });

  it("accepts biome.jsonc in place of biome.json", () => {
    const dir = appWith({
      "biome.json": null,
      "biome.jsonc": '{\n  // shared rules\n  "extends": ["@fieldtripagency/config/biome"]\n}',
    });
    expect(foundationProblems(dir)).toEqual([]);
  });

  it("reports a config that is not JSON and names no preset", () => {
    expect(foundationProblems(appWith({ "biome.json": "{ nope" }))).toEqual([
      "biome.json (or biome.jsonc) must extend @fieldtripagency/config/biome",
    ]);
  });
});
