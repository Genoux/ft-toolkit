import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PACKAGE_ROOT = join(import.meta.dirname, "..");
export const DESIGN_MD_PATH = join(PACKAGE_ROOT, "DESIGN.md");

// next/font injects Geist through --font-geist-sans at runtime, so the family name never appears in theme.css.
const INTERFACE_FONT_FAMILY = "Geist, ui-sans-serif, system-ui, sans-serif";
const REM_IN_PX = 16;

type Declarations = Map<string, string>;
type TokenGroup = { [key: string]: string | number | TokenGroup };

const readPackageFile = (name: string) => readFileSync(join(PACKAGE_ROOT, name), "utf8");

function declarationsOf(css: string, blockHeader: string): Declarations {
  const blockPattern = new RegExp(`^${escapeRegExp(blockHeader)} \\{\\n([\\s\\S]*?)\\n\\}`, "gm");
  const blocks = [...css.matchAll(blockPattern)].map(([, body]) => body ?? "");
  if (blocks.length === 0) throw new Error(`design-md: no "${blockHeader} {" block found`);
  return new Map(
    blocks.flatMap((body) =>
      [...body.matchAll(/^\s*--([a-z0-9-]+):\s*([^;]+);/gm)].map(
        ([, name, value]) => [name ?? "", (value ?? "").trim()] as const,
      ),
    ),
  );
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolveVariables(value: string, scope: Declarations): string {
  return value.replace(/var\(--([a-z0-9-]+)\)/g, (reference, name: string) => {
    const referenced = scope.get(name);
    return referenced === undefined ? reference : resolveVariables(referenced, scope);
  });
}

const isColor = (value: string) => /^(oklch\(|#[0-9a-f]{3,8}$|color-mix\()/i.test(value);
const isRemLength = (value: string) => /^[\d.]+rem$/.test(value);

function toPixels(length: string): number {
  const amount = Number.parseFloat(length);
  if (length.endsWith("rem")) return amount * REM_IN_PX;
  if (length.endsWith("px")) return amount;
  throw new Error(`design-md: cannot convert "${length}" to pixels`);
}

function evaluateLength(expression: string): string {
  const calc = expression.match(/^calc\((\S+) ([+-]) (\S+)\)$/);
  if (!calc) return `${toPixels(expression)}px`;
  const [, left = "", operator, right = ""] = calc;
  const pixels =
    operator === "+" ? toPixels(left) + toPixels(right) : toPixels(left) - toPixels(right);
  return `${pixels}px`;
}

function colorTokens(theme: string, fieldtrip: string): TokenGroup {
  const scope = declarationsOf(theme, ":root");
  const interfaceColors = [...scope.entries()]
    .map(([name, value]) => [name, resolveVariables(value, scope)] as const)
    .filter(([, value]) => isColor(value));
  const brand = [...declarationsOf(fieldtrip, "@theme static").entries()]
    .filter(([name]) => name.startsWith("color-"))
    .map(([name, value]) => [name.replace(/^color-/, ""), value] as const);
  return Object.fromEntries([...interfaceColors, ...brand]);
}

function typographyTokens(theme: string): TokenGroup {
  const scale = declarationsOf(theme, "@theme");
  const roles = [...scale.keys()]
    .filter((name) => /^text-[a-z0-9-]+$/.test(name) && !name.includes("--"))
    .map((name) => name.replace(/^text-/, ""));
  return Object.fromEntries(
    roles.map((role) => {
      const property = (suffix: string) => scale.get(`text-${role}--${suffix}`);
      const fontWeight = property("font-weight");
      const letterSpacing = property("letter-spacing");
      return [
        role,
        {
          fontFamily: INTERFACE_FONT_FAMILY,
          fontSize: scale.get(`text-${role}`) ?? "",
          ...(fontWeight ? { fontWeight: Number(fontWeight) } : {}),
          lineHeight: property("line-height") ?? "",
          ...(letterSpacing ? { letterSpacing } : {}),
        },
      ];
    }),
  );
}

function roundedTokens(theme: string): TokenGroup {
  const light = declarationsOf(theme, ":root");
  return Object.fromEntries(
    [...declarationsOf(theme, "@theme inline").entries()]
      .filter(([name]) => name.startsWith("radius-"))
      .map(([name, value]) => [
        name.replace(/^radius-/, ""),
        evaluateLength(resolveVariables(value, light)),
      ]),
  );
}

function spacingTokens(theme: string): TokenGroup {
  const controlHeights = [...declarationsOf(theme, "@theme").entries()]
    .filter(([name]) => name.startsWith("spacing-control-"))
    .map(([name, value]) => [name.replace(/^spacing-/, ""), value] as const);
  const roles = [...declarationsOf(theme, ":root").entries()].filter(
    ([name, value]) => name !== "radius" && isRemLength(value),
  );
  return Object.fromEntries([...controlHeights, ...roles]);
}

function toYaml(value: TokenGroup, depth = 0): string {
  const indent = "  ".repeat(depth);
  return Object.entries(value)
    .map(([key, entry]) =>
      typeof entry === "object"
        ? `${indent}${key}:\n${toYaml(entry, depth + 1)}`
        : `${indent}${key}: ${typeof entry === "number" ? entry : JSON.stringify(entry)}`,
    )
    .join("\n");
}

export function renderDesignFrontmatter(): string {
  const theme = readPackageFile("theme.css");
  const fieldtrip = readPackageFile("fieldtrip.css");
  const tokens = {
    name: "Fieldtrip UI",
    description: "The tokens and components every Fieldtrip app is built from.",
    colors: colorTokens(theme, fieldtrip),
    typography: typographyTokens(theme),
    rounded: roundedTokens(theme),
    spacing: spacingTokens(theme),
  };
  return [
    "---",
    "# Generated from theme.css and fieldtrip.css by `bun run design`. Edit those files, then rerun it.",
    toYaml(tokens),
    "---",
  ].join("\n");
}

const FRONTMATTER_PATTERN = /^---\n[\s\S]*?\n---/;

export function currentDesignFrontmatter(): string {
  return readFileSync(DESIGN_MD_PATH, "utf8").match(FRONTMATTER_PATTERN)?.[0] ?? "";
}

export function writeDesignFrontmatter() {
  const document = readFileSync(DESIGN_MD_PATH, "utf8");
  const frontmatter = renderDesignFrontmatter();
  const updated = FRONTMATTER_PATTERN.test(document)
    ? document.replace(FRONTMATTER_PATTERN, () => frontmatter)
    : `${frontmatter}\n\n${document}`;
  writeFileSync(DESIGN_MD_PATH, updated);
}
