import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { uiRuleProblems } from "./ui-rules";

const appDirs: string[] = [];

function appWith(files: Record<string, string>): string {
  const appDir = mkdtempSync(join(tmpdir(), "ib-ui-rules-"));
  appDirs.push(appDir);
  for (const [path, contents] of Object.entries(files)) {
    mkdirSync(join(appDir, path, ".."), { recursive: true });
    writeFileSync(join(appDir, path), contents);
  }
  return appDir;
}

afterEach(() => {
  for (const appDir of appDirs.splice(0)) rmSync(appDir, { recursive: true, force: true });
});

describe("uiRuleProblems", () => {
  it("accepts the roles of the scale, display sizes included", () => {
    const appDir = appWith({
      "src/page.tsx":
        '<h1 className="text-xl font-semibold">Title</h1>\n<p className="text-sm text-[var(--brand)]">Body</p>\n<p className="text-3xl font-medium">Hero</p>\n<code className="text-[0.85em]">x</code>',
    });

    expect(uiRuleProblems(appDir)).toEqual([]);
  });

  it("reports each hand-set size and weight with its file and line", () => {
    const appDir = appWith({
      "src/features/list.tsx": '<p>ok</p>\n<p className="text-[13px] font-bold">Name</p>',
      "src/card.tsx": '<span className="text-[0.8rem] font-[510]">x</span>',
    });

    expect(uiRuleProblems(appDir).sort()).toEqual([
      "src/card.tsx:1 font-[510] (hand-set font weight)",
      "src/card.tsx:1 text-[0.8rem] (hand-set font size)",
      "src/features/list.tsx:2 font-bold (weight outside regular, medium, semibold)",
      "src/features/list.tsx:2 text-[13px] (hand-set font size)",
    ]);
  });

  it("reports hand-set spacing lengths and leaves the spacing scale, var, env and calc alone", () => {
    const appDir = appWith({
      "src/row.tsx":
        '<div className="ml-[11px] gap-[0.5rem] -mt-[2px]" />\n<div className="gap-3 p-13 pb-[env(safe-area-inset-bottom)] ml-[calc(50%-50vw)] px-[var(--gutter)] w-[320px]" />',
    });

    expect(uiRuleProblems(appDir).sort()).toEqual([
      "src/row.tsx:1 -mt-[2px] (hand-set spacing, use the spacing scale)",
      "src/row.tsx:1 gap-[0.5rem] (hand-set spacing, use the spacing scale)",
      "src/row.tsx:1 ml-[11px] (hand-set spacing, use the spacing scale)",
    ]);
  });

  it("reports hand-set colours in classes", () => {
    const appDir = appWith({
      "src/badge.tsx":
        '<span className="bg-[#ff5a1f] text-[rgb(0,0,0)] border-[oklch(0.7_0.1_40)] bg-primary text-fieldtrip-orange" />',
    });

    expect(uiRuleProblems(appDir).sort()).toEqual([
      "src/badge.tsx:1 bg-[#ff5a1f] (hand-set colour, use a token)",
      "src/badge.tsx:1 border-[oklch( (hand-set colour, use a token)",
      "src/badge.tsx:1 text-[rgb( (hand-set colour, use a token)",
    ]);
  });

  it("reports other UI, icon and animation libraries, in .ts files too", () => {
    const appDir = appWith({
      "src/icons.ts": 'import { FaBeer } from "react-icons/fa";',
      "src/menu.tsx":
        'import * as Menu from "@radix-ui/react-dropdown-menu";\nimport { motion } from "framer-motion";\nimport { Check } from "lucide-react";\nimport { Dialog } from "radix-ui";',
    });

    expect(uiRuleProblems(appDir).sort()).toEqual([
      'src/icons.ts:1 from "react-icons (another UI library; use @inbeat/ui, lucide-react, radix-ui and motion)',
      'src/menu.tsx:1 from "@radix-ui/ (another UI library; use @inbeat/ui, lucide-react, radix-ui and motion)',
      'src/menu.tsx:2 from "framer-motion (another UI library; use @inbeat/ui, lucide-react, radix-ui and motion)',
    ]);
  });

  it("keeps @inbeat/ui itself to the weights apps may use", () => {
    const uiDir = join(import.meta.dirname, "..", "..", "ui");
    const weightProblems = uiRuleProblems(uiDir).filter((problem) => problem.includes("weight"));

    expect(weightProblems).toEqual([]);
  });

  it("ignores files that are not code and apps without a src folder", () => {
    expect(uiRuleProblems(appWith({ "src/notes.md": "text-[13px]" }))).toEqual([]);
    expect(uiRuleProblems(appWith({ "README.md": "x" }))).toEqual([]);
  });
});
