import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

// The plumbing and look rules of the "UI" section of the standard that a pattern can catch.
// Type scale: an app picks a role (text-sm, text-xs, ...) and never a size or weight of its own,
// so a change of scale happens once, in the toolkit. `em` sizes are relative to their parent
// (inline code in running text), so they follow the scale.
// Spacing and colour: plain lengths and colour literals are flagged; var(), env() and calc()
// pass, because safe-area insets, full-bleed offsets and token references need them.
const SPACING = "(?:space-[xy]|gap-[xy]|gap|p[xytrblse]?|m[xytrblse]?)";

const RULES = [
  { pattern: /\btext-\[[\d.]+(?:px|rem)\]/g, reason: "hand-set font size" },
  { pattern: /\bfont-\[\d+\]/g, reason: "hand-set font weight" },
  {
    pattern: /\bfont-(?:bold|extrabold|black)\b/g,
    reason: "weight outside regular, medium, semibold",
  },
  {
    pattern: new RegExp(`(?<![\\w-])-?${SPACING}-\\[-?[\\d.]+(?:px|rem|em)?\\]`, "g"),
    reason: "hand-set spacing, use the spacing scale",
  },
  {
    pattern:
      /(?<![\w-])[a-z]+(?:-[a-z]+)*-\[(?:#[0-9a-fA-F]{3,8}\]|(?:rgba?|hsla?|oklch|oklab)\()/g,
    reason: "hand-set colour, use a token",
  },
  {
    pattern:
      /from "(?:@mui\/|@chakra-ui\/|antd|@mantine\/|@headlessui\/|react-bootstrap|@nextui-org\/|@heroui\/|react-icons|@heroicons\/|@tabler\/icons|@phosphor-icons|framer-motion|@radix-ui\/)/g,
    reason: "another UI library; use @inbeat/ui, lucide-react, radix-ui and motion",
  },
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

/** `src/file.tsx:12 text-[13px] (hand-set font size)` for every match of a UI rule. */
export function uiRuleProblems(appDir: string): string[] {
  const srcDir = join(appDir, "src");
  if (!existsSync(srcDir)) return [];

  return sourceFiles(srcDir).flatMap((path) =>
    readFileSync(path, "utf8")
      .split("\n")
      .flatMap((line, index) =>
        RULES.flatMap(({ pattern, reason }) =>
          [...line.matchAll(pattern)].map(
            ([match]) => `${relative(appDir, path)}:${index + 1} ${match} (${reason})`,
          ),
        ),
      ),
  );
}

// Each padding, margin or gap an app picks by hand is a guess the next screen guesses differently.
// Stack, Inline, Grid, Item, Card and Page own spacing through the theme's roles instead. Zero
// resets pass; a file marked `// signature-surface: <what>` is free, like the rest of that layer.
const HAND_PICKED_SPACING = new RegExp(
  `(?<![\\w-])(?:[a-z0-9]+:)*-?${SPACING}-(?:\\d+(?:\\.\\d+)?|px)\\b(?<!-0)`,
  "g",
);
const SIGNATURE_SURFACE = /signature-surface:/;
const SPACING_REASON = "(hand-picked spacing; use Stack, Inline, Grid or Item)";

export const SPACING_BASELINE = ".ib-spacing-baseline";
const BASELINE_HEADER = [
  "# Hand-picked spacing allowed per file while it moves to Stack, Inline, Grid and Item.",
  "# `ib check` fails when a file gains more. Rewrite it with `ib check --baseline` after removing some.",
];

function handPickedSpacing(appDir: string): Map<string, string[]> {
  const srcDir = join(appDir, "src");
  const byFile = new Map<string, string[]>();
  if (!existsSync(srcDir)) return byFile;
  for (const path of sourceFiles(srcDir).filter((file) => file.endsWith(".tsx"))) {
    const source = readFileSync(path, "utf8");
    if (SIGNATURE_SURFACE.test(source)) continue;
    const file = relative(appDir, path);
    const found = source
      .split("\n")
      .flatMap((line, index) =>
        [...line.matchAll(HAND_PICKED_SPACING)].map(([match]) => `${file}:${index + 1} ${match}`),
      );
    if (found.length > 0) byFile.set(file, found);
  }
  return byFile;
}

function readBaseline(appDir: string): Map<string, number> | undefined {
  const path = join(appDir, SPACING_BASELINE);
  if (!existsSync(path)) return undefined;
  const entries = readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [count = "0", ...file] = line.split(" ");
      return [file.join(" "), Number(count)] as const;
    });
  return new Map(entries);
}

/** Until an app writes a baseline the rule only counts, so upgrading the toolkit never breaks it. */
export function spacingProblems(appDir: string): {
  enforced: boolean;
  total: number;
  problems: string[];
} {
  const byFile = handPickedSpacing(appDir);
  const total = [...byFile.values()].reduce((sum, found) => sum + found.length, 0);
  const baseline = readBaseline(appDir);
  if (!baseline) return { enforced: false, total, problems: [] };
  const problems = [...byFile]
    .filter(([file, found]) => found.length > (baseline.get(file) ?? 0))
    .flatMap(([, found]) => found.map((line) => `${line} ${SPACING_REASON}`));
  return { enforced: true, total, problems };
}

/** Records today's hand-picked spacing per file, so only new spacing fails. Returns the total. */
export function writeSpacingBaseline(appDir: string): number {
  const byFile = handPickedSpacing(appDir);
  const lines = [...byFile]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([file, found]) => `${found.length} ${file}`);
  writeFileSync(join(appDir, SPACING_BASELINE), `${[...BASELINE_HEADER, ...lines].join("\n")}\n`);
  return lines.reduce((sum, line) => sum + Number(line.split(" ")[0]), 0);
}
