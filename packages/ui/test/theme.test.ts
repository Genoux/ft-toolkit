import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const THEME = readFileSync(join(import.meta.dirname, "..", "theme.css"), "utf8");
const FIELDTRIP = readFileSync(join(import.meta.dirname, "..", "fieldtrip.css"), "utf8");
const component = (name: string) =>
  readFileSync(join(import.meta.dirname, "..", "src", "components", `${name}.tsx`), "utf8");
const TONE_STYLES = readFileSync(
  join(import.meta.dirname, "..", "src", "internal", "tone-styles.ts"),
  "utf8",
);
const TONED_COMPONENT_NAMES = ["alert", "badge", "icon-button", "select"];

type Oklch = [number, number, number];
type Rgb = [number, number, number];

// Status tones are written as hex and as `color-mix(in oklab, #hex P%, var(--token))`; both resolve
// to oklch here so every check below reads one shape.
function tokens() {
  const start = THEME.indexOf(":root {");
  const block = THEME.slice(start, THEME.indexOf("\n}", start));
  const resolved: Record<string, Oklch> = Object.fromEntries(
    [...block.matchAll(/--([a-z-]+):\s*oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/g)].map(
      ([, name, lightness, chroma, hue]) => [
        name,
        [Number(lightness), Number(chroma), Number(hue)],
      ],
    ),
  );
  for (const [, name, hex] of block.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6});/gi)) {
    resolved[name ?? ""] = oklchOf(fromHex(hex ?? ""));
  }
  for (const [, name, hex, percent, other] of block.matchAll(
    /--([a-z-]+):\s*color-mix\(in oklab, (#[0-9a-f]{6}) (\d+)%, var\(--([a-z-]+)\)\)/gi,
  )) {
    const weight = Number(percent) / 100;
    const first = oklabOf(fromHex(hex ?? ""));
    const second = toOklab(resolved[other ?? ""] ?? [0, 0, 0]);
    const mixed = first.map(
      (value, index) => value * weight + (second[index] ?? 0) * (1 - weight),
    ) as Oklab;
    resolved[name ?? ""] = [mixed[0], Math.hypot(mixed[1], mixed[2]), hueOf(mixed)];
  }
  return resolved;
}

type Oklab = [number, number, number];

const toOklab = ([lightness, chroma, hue]: Oklch): Oklab => [
  lightness,
  chroma * Math.cos((hue * Math.PI) / 180),
  chroma * Math.sin((hue * Math.PI) / 180),
];

function oklabOf([red, green, blue]: Rgb): Oklab {
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

const linearRgb = (color: Oklch): Rgb => rgbOf(toOklab(color));

function rgbOf([lightness, a, b]: Oklab): Rgb {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const channel = (value: number) => Math.min(Math.max(value, 0), 1);
  const red = channel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const green = channel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const blue = channel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return [red, green, blue];
}

const decode = (value: number) =>
  value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;

function ratio(foreground: Rgb, background: Rgb) {
  const luminance = ([red, green, blue]: Rgb) => 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  const [high, low] = [luminance(foreground), luminance(background)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

const contrast = (foreground: Oklch, background: Oklch) =>
  ratio(linearRgb(foreground), linearRgb(background));

const fromHex = (hex: string): Rgb =>
  [1, 3, 5].map((start) => decode(Number.parseInt(hex.slice(start, start + 2), 16) / 255)) as Rgb;

/** The tokens the Fieldtrip layer swaps in on light (`--warning: var(--color-fieldtrip-orange)`). */
function fieldtripTokens(): Record<string, Rgb> {
  const colors = Object.fromEntries(
    [...FIELDTRIP.matchAll(/--(color-fieldtrip-[a-z-]+):\s*(#[0-9a-f]{6})/gi)].map(
      ([, name, hex]) => [name, hex],
    ),
  );
  return Object.fromEntries(
    [...FIELDTRIP.matchAll(/--([a-z-]+):\s*var\(--(color-fieldtrip-[a-z-]+)\)/g)]
      .filter(([, , name]) => colors[name ?? ""])
      .map(([, token, name]) => [token, fromHex(colors[name ?? ""] ?? "")]),
  );
}

const TONES = ["info", "success", "warning", "destructive"] as const;

const hueOf = ([, a, b]: Oklab) => ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
const hueDistance = (first: number, second: number) =>
  Math.min(Math.abs(first - second), 360 - Math.abs(first - second));

const oklchOf = (color: Rgb): Oklch => {
  const lab = oklabOf(color);
  return [lab[0], Math.hypot(lab[1], lab[2]), hueOf(lab)];
};

const CHROMA = "min(calc(c * var(--tone-tint-chroma)), var(--tone-tint-chroma-max))";
const TONE_RECIPES = {
  "tone-tint": `oklch(from var(--tone) var(--tone-tint-l) ${CHROMA} h)`,
  "tone-tint-hover": `oklch(from var(--tone) calc(var(--tone-tint-l) + var(--tone-tint-step)) ${CHROMA} h)`,
  "tone-tint-strong": `oklch(from var(--tone) calc(var(--tone-tint-l) + 2 * var(--tone-tint-step)) ${CHROMA} h)`,
  "tone-ink": "oklch(from var(--tone) var(--tone-ink-l) calc(c * var(--tone-ink-chroma)) h)",
  "tone-solid":
    "oklch(from var(--tone) clamp(var(--tone-solid-l-min), l, var(--tone-solid-l-max)) c h)",
};

const TONE_TOKENS = {
  tintL: "tone-tint-l",
  tintChroma: "tone-tint-chroma",
  tintChromaMax: "tone-tint-chroma-max",
  tintStep: "tone-tint-step",
  inkL: "tone-ink-l",
  inkChroma: "tone-ink-chroma",
  solidMin: "tone-solid-l-min",
  solidMax: "tone-solid-l-max",
} as const;

/** The --tone-* numbers in a file's :root block; a brand layer's block holds only what it overrides. */
function toneLightness(css: string): Record<keyof typeof TONE_TOKENS, number> {
  const start = css.indexOf(":root {");
  const block = start < 0 ? "" : css.slice(start, css.indexOf("\n}", start));
  const values = Object.fromEntries(
    [...block.matchAll(/--(tone-[a-z-]+):\s*(-?[\d.]+);/g)].map(([, name, value]) => [
      name,
      Number(value),
    ]),
  );
  return Object.fromEntries(
    Object.entries(TONE_TOKENS)
      .filter(([, token]) => values[token] !== undefined)
      .map(([key, token]) => [key, values[token]]),
  ) as Record<keyof typeof TONE_TOKENS, number>;
}

describe("theme tokens", () => {
  it("keeps the sidebar a separate tone from the content", () => {
    const theme = tokens();
    expect(theme.sidebar).toBeDefined();
    expect(Math.abs(theme.sidebar[0] - theme.background[0])).toBeGreaterThanOrEqual(0.015);
  });

  it("keeps every light text level readable (WCAG AA 4.5:1) on cards, canvas and sidebar", () => {
    const theme = tokens();
    const surfaces = {
      card: theme.card ?? [1, 0, 0],
      background: theme.background,
      sidebar: theme.sidebar,
    };
    for (const text of ["foreground", "muted-foreground", "subtle-foreground"]) {
      for (const [surface, value] of Object.entries(surfaces)) {
        expect(contrast(theme[text], value), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("keeps the focus ring at 3:1 or more on every light surface", () => {
    const theme = tokens();
    for (const surface of ["card", "background", "sidebar", "muted"]) {
      const value = theme[surface] ?? [1, 0, 0];
      expect(contrast(theme.ring, value), `ring on ${surface}`).toBeGreaterThanOrEqual(3);
    }
  });

  it("defines the tone colours as the recipe this test checks", () => {
    const css = THEME.replace(/\s+/g, " ").replaceAll("( ", "(").replaceAll(" )", ")");
    for (const [name, recipe] of Object.entries(TONE_RECIPES)) {
      expect(css, `--color-${name} in theme.css`).toContain(`--color-${name}: ${recipe};`);
    }
  });

  it("builds every toned surface from the tone colours, not a translucent tint", () => {
    expect(TONE_STYLES).toContain('"text-tone-ink"');
    expect(TONE_STYLES).toContain('"bg-tone-tint"');
    expect(TONE_STYLES).toContain('"bg-tone-solid text-background"');
    for (const name of TONED_COMPONENT_NAMES) {
      const source = component(name);
      expect(source, `${name} reads tone-styles`).toContain("toneTintClassName");
      expect(source, `${name} has no translucent tone fill`).not.toMatch(/bg-\(--[a-z-]*tone\)\//);
    }
  });

  it.each([false, true])(
    "keeps every tone's text AA 4.5:1 on its tint, hover and pressed fills, the page colour AA on its solid, all in the tone's hue (Fieldtrip: %s)",
    (fieldtrip) => {
      const theme = tokens();
      const brand = fieldtrip ? fieldtripTokens() : {};
      if (fieldtrip) expect(Object.keys(brand).length).toBeGreaterThan(0);
      const lightness = {
        ...toneLightness(THEME),
        ...(fieldtrip ? toneLightness(FIELDTRIP) : {}),
      };
      expect(Object.keys(lightness)).toHaveLength(Object.keys(TONE_TOKENS).length);
      const page = brand.background ?? linearRgb(theme.background);
      for (const tone of TONES) {
        const [toneL, toneC, toneH] = oklchOf(brand[tone] ?? linearRgb(theme[tone]));
        const tintC = Math.min(toneC * lightness.tintChroma, lightness.tintChromaMax);
        const fills = [0, 1, 2].map((steps) =>
          rgbOf(toOklab([lightness.tintL + steps * lightness.tintStep, tintC, toneH])),
        );
        const ink = rgbOf(toOklab([lightness.inkL, toneC * lightness.inkChroma, toneH]));
        const solid = rgbOf(
          toOklab([
            Math.min(Math.max(toneL, lightness.solidMin), lightness.solidMax),
            toneC,
            toneH,
          ]),
        );
        for (const [index, fill] of fills.entries()) {
          expect(ratio(ink, fill), `${tone} text on fill step ${index}`).toBeGreaterThanOrEqual(
            4.5,
          );
        }
        expect(ratio(page, solid), `page colour on a solid ${tone}`).toBeGreaterThanOrEqual(4.5);
        // Measured after the sRGB clip a browser applies, so an out-of-gamut tint that drifts shows here.
        for (const [part, color] of Object.entries({ tint: fills[0], ink, solid })) {
          expect(
            hueDistance(hueOf(oklabOf(color ?? page)), toneH),
            `${tone} ${part} stays in its tone's hue`,
          ).toBeLessThanOrEqual(12);
        }
      }
    },
  );
});
