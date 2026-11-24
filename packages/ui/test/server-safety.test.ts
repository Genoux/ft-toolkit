import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Apps render these components from Next.js Server Components. A module without "use client" that
// creates context or calls a hook, itself or through what it imports, crashes there at render time.
const SRC = join(import.meta.dirname, "..", "src");
// useId, useMemo, useCallback and useDebugValue are exported by React's react-server build, so they stay allowed.
const CLIENT_ONLY_API =
  /\b(createContext|use(State|Effect|LayoutEffect|InsertionEffect|Context|Ref|Reducer|SyncExternalStore|Transition|DeferredValue|ImperativeHandle|Optimistic|ActionState|ReducedMotion))\s*\(/;

const isClientModule = (source: string) => /^\s*["']use client["']/.test(source);

function resolveImport(from: string, specifier: string) {
  const base = resolve(dirname(from), specifier);
  return [`${base}.tsx`, `${base}.ts`, join(base, "index.ts")].find((path) => existsSync(path));
}

function serverViolations(file: string, seen = new Set<string>()): string[] {
  if (seen.has(file)) return [];
  seen.add(file);
  const source = readFileSync(file, "utf8");
  if (isClientModule(source)) return [];
  const own = CLIENT_ONLY_API.test(source) ? [file.slice(SRC.length + 1)] : [];
  const imported = [...source.matchAll(/from\s+["'](\.{1,2}\/[^"']+)["']/g)]
    .map(([, specifier]) => resolveImport(file, specifier))
    .filter((path): path is string => Boolean(path))
    .flatMap((path) => serverViolations(path, seen));
  return [...own, ...imported];
}

describe("server safety", () => {
  const serverComponents = readdirSync(join(SRC, "components"))
    .map((name) => join(SRC, "components", name))
    .filter((path) => !isClientModule(readFileSync(path, "utf8")));

  it.each(serverComponents.map((path) => [path.slice(SRC.length + 1), path]))(
    "%s uses no client-only React API without a use client boundary",
    (_name, path) => {
      expect(serverViolations(path)).toEqual([]);
    },
  );
});
