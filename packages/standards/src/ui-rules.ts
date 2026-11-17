import { existsSync, readdirSync, readFileSync } from "node:fs";
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
