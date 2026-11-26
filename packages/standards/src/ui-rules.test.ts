import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  SPACING_BASELINE,
  spacingProblems,
  uiRuleProblems,
  writeSpacingBaseline,
} from "./ui-rules";

const appDirs: string[] = [];

function appWith(files: Record<string, string>): string {
  const appDir = mkdtempSync(join(tmpdir(), "ft-ui-rules-"));
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
  it("reports em dashes, exclamation marks and jargon in copy", () => {
    const appDir = appWith({
      "src/empty.tsx": [
        '<EmptyState title="Nothing here — yet" description="Our seamless solution!" />',
        "<p>You're all set!</p>",
        "const toast = 'Leverage the data';",
      ].join("\n"),
    });

    expect(uiRuleProblems(appDir).sort()).toEqual([
      'src/empty.tsx:1 "Nothing here — yet" — (em dash in copy, use a comma, full stop or colon)',
      'src/empty.tsx:1 "Our seamless solution!" ! (exclamation mark in copy, let the words carry it)',
      'src/empty.tsx:1 "Our seamless solution!" seamless (jargon in copy, say the specific thing)',
      'src/empty.tsx:1 "Our seamless solution!" solution (jargon in copy, say the specific thing)',
      'src/empty.tsx:2 "You\'re all set!" ! (exclamation mark in copy, let the words carry it)',
      'src/empty.tsx:3 "Leverage the data" Leverage (jargon in copy, say the specific thing)',
    ]);
  });

  it("leaves comments, class names, code, tests, prompts and an empty-cell dash alone", () => {
    const appDir = appWith({
      "src/cell.tsx": [
        "// Shown when the value is missing — a dash, not a blank.",
        '<td className="hidden! md:flex">{value ?? "—"}</td>',
        "if (!ready) return null;",
        "<p>Request sent.</p>",
      ].join("\n"),
      "src/cell.test.tsx": 'expect(toast).toBe("Saved!");',
      "src/prompt.ts":
        '// not-interface-copy: the review prompt\nconst rule = "Quote the rule — never its id.";',
    });

    expect(uiRuleProblems(appDir)).toEqual([]);
  });

  it("reports hand-set radius, shadows, style colours and transition-all", () => {
    const appDir = appWith({
      "src/tile.tsx":
        '<div className="rounded-[10px] rounded-t-3xl shadow-[0_2px_4px_#000] transition-all" style={{ color: "#ff0000" }} />\n<div className="rounded-xl rounded-full shadow-elevated transition-colors" style={{ color: "var(--brand)" }} />',
    });

    expect(uiRuleProblems(appDir).sort()).toEqual([
      'src/tile.tsx:1 color: "# (hand-set colour in a style, use a token)',
      "src/tile.tsx:1 rounded-[10px] (radius outside the roles (sm, md, lg, xl, 2xl, full))",
      "src/tile.tsx:1 rounded-t-3xl (radius outside the roles (sm, md, lg, xl, 2xl, full))",
      "src/tile.tsx:1 shadow-[0_2px_4px_#000] (hand-set shadow, use a shadow token)",
      "src/tile.tsx:1 transition-all (transition-all, animate only what changes)",
    ]);
  });

  it("reports dark variants, since apps are light only", () => {
    const appDir = appWith({
      "src/panel.tsx": '<div className="bg-card dark:bg-input/30 hover:bg-muted" />',
    });

    expect(uiRuleProblems(appDir)).toEqual([
      "src/panel.tsx:1 dark:bg-input/30 (dark variant, Fieldtrip apps are light only)",
    ]);
  });

  it("accepts the roles of the scale", () => {
    const appDir = appWith({
      "src/page.tsx":
        '<h1 className="text-title">Title</h1>\n<p className="text-sm text-[var(--brand)]">Body</p>\n<p className="text-display font-serif">Hero</p>\n<h2 className="text-heading">Card</h2>\n<code className="text-[0.85em]">x</code>\n<p className="text-lead text-left">Lead</p>',
    });

    expect(uiRuleProblems(appDir)).toEqual([]);
  });

  it("reports Tailwind's sizes between the roles, behind a variant too", () => {
    const appDir = appWith({
      "src/hero.tsx":
        '<h1 className="text-xl md:text-3xl">Hero</h1>\n<p className="text-lg">Lead</p>',
    });

    expect(uiRuleProblems(appDir).sort()).toEqual([
      "src/hero.tsx:1 text-3xl (size outside the type roles (heading, lead, stat-sm, title-sm, title, stat, display))",
      "src/hero.tsx:1 text-xl (size outside the type roles (heading, lead, stat-sm, title-sm, title, stat, display))",
      "src/hero.tsx:2 text-lg (size outside the type roles (heading, lead, stat-sm, title-sm, title, stat, display))",
    ]);
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
      'src/icons.ts:1 from "react-icons (another UI library; use @fieldtripagency/ui, lucide-react, radix-ui and motion)',
      'src/menu.tsx:1 from "@radix-ui/ (another UI library; use @fieldtripagency/ui, lucide-react, radix-ui and motion)',
      'src/menu.tsx:2 from "framer-motion (another UI library; use @fieldtripagency/ui, lucide-react, radix-ui and motion)',
    ]);
  });

  it("keeps @fieldtripagency/ui itself to the weights apps may use", () => {
    const uiDir = join(import.meta.dirname, "..", "..", "ui");
    const weightProblems = uiRuleProblems(uiDir).filter((problem) => problem.includes("weight"));

    expect(weightProblems).toEqual([]);
  });

  it("ignores files that are not code and apps without a src folder", () => {
    expect(uiRuleProblems(appWith({ "src/notes.md": "text-[13px]" }))).toEqual([]);
    expect(uiRuleProblems(appWith({ "README.md": "x" }))).toEqual([]);
  });
});

describe("spacingProblems", () => {
  const list =
    '<div className="flex gap-4 px-3 md:py-2 -mt-1">\n<Stack gap="md" className="p-0 mx-auto top-4">';

  it("only counts hand-picked spacing until the app has a baseline", () => {
    const appDir = appWith({ "src/features/list.tsx": list });

    expect(spacingProblems(appDir)).toEqual({ enforced: false, total: 4, problems: [] });
  });

  it("fails each line of a file that has more hand-picked spacing than its baseline allows", () => {
    const appDir = appWith({
      "src/features/list.tsx": list,
      "src/features/old.tsx": '<div className="gap-2">',
      [SPACING_BASELINE]: "1 src/features/old.tsx\n",
    });

    expect(spacingProblems(appDir)).toEqual({
      enforced: true,
      total: 5,
      problems: [
        "src/features/list.tsx:1 gap-4 (hand-picked spacing; use Stack, Inline, Grid or Item)",
        "src/features/list.tsx:1 px-3 (hand-picked spacing; use Stack, Inline, Grid or Item)",
        "src/features/list.tsx:1 md:py-2 (hand-picked spacing; use Stack, Inline, Grid or Item)",
        "src/features/list.tsx:1 -mt-1 (hand-picked spacing; use Stack, Inline, Grid or Item)",
      ],
    });
  });

  it("leaves signature surfaces free", () => {
    const appDir = appWith({
      "src/features/board.tsx": `// signature-surface: the game board\n${list}`,
      [SPACING_BASELINE]: "",
    });

    expect(spacingProblems(appDir).problems).toEqual([]);
  });

  it("writes today's counts as the baseline, which then passes", () => {
    const appDir = appWith({ "src/features/list.tsx": list, "src/page.tsx": "<Page />" });

    expect(writeSpacingBaseline(appDir)).toBe(4);
    expect(readFileSync(join(appDir, SPACING_BASELINE), "utf8")).toContain(
      "4 src/features/list.tsx\n",
    );
    expect(spacingProblems(appDir)).toEqual({ enforced: true, total: 4, problems: [] });
  });
});
