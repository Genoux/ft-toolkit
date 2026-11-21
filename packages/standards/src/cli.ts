#!/usr/bin/env bun
import { resolve } from "node:path";
import { create } from "./create";
import { parseCreateArgs } from "./create-args";
import { formatReport, installExternalSkills } from "./external-skills";
import { foundationProblems } from "./foundation";
import { runMcp } from "./mcp";
import { claudeFilesIgnoringAgents, staleFiles, write } from "./sync";
import {
  SPACING_BASELINE,
  spacingProblems,
  uiRuleProblems,
  writeSpacingBaseline,
} from "./ui-rules";

const USAGE = [
  "usage: ib <create <dir> [--local] | sync [app-dir] | check [app-dir] [--baseline] | mcp>",
  "  create <dir>   start a new app",
  "  mcp            write MCP server config for your AI tools; run `ib mcp` for the picker",
  "  --baseline     with check: allow the hand-picked spacing there is today, fail only new spacing",
  "  --local        write absolute file: paths to ib-toolkit tarballs; for toolkit development and CI only,",
  "                 never commit that package.json",
].join("\n");

const [command = "help", ...args] = process.argv.slice(2);
const appDir = resolve(args.find((arg) => !arg.startsWith("--")) ?? ".");

// Downloads the shared third-party skills. A failed download warns and never fails the command.
// CI never uses them, and the app's postinstall would otherwise fetch them on every CI install.
function syncExternalSkills(dir: string): void {
  // biome-ignore lint/style/noProcessEnv: CI is set by the CI provider, not app config
  if (process.env.CI) {
    console.info("skipped the shared skills (CI)");
    return;
  }
  const report = installExternalSkills(dir);
  for (const line of formatReport(report)) console.info(line);
  if (report.failed.length > 0) {
    console.warn(
      `could not download some skills (offline?); run \`ib sync\` again later:\n  ${report.failed.join("\n  ")}`,
    );
  }
}

const commands: Record<string, () => number | Promise<number>> = {
  create: async () => {
    let parsed: ReturnType<typeof parseCreateArgs>;
    try {
      parsed = parseCreateArgs(args);
    } catch (error) {
      console.error(`${error instanceof Error ? error.message : error}\n${USAGE}`);
      return 1;
    }
    if (!parsed.dir) {
      console.error(USAGE);
      return 1;
    }
    // The skills arrive through the app's postinstall (`ib sync`), run by create's `bun install`.
    await create(parsed.dir, { local: parsed.local });
    return 0;
  },
  sync: () => {
    const written = write(appDir);
    console.info(written.length ? `updated:\n  ${written.join("\n  ")}` : "already up to date");
    syncExternalSkills(appDir);
    return 0;
  },
  check: () => {
    const stale = staleFiles(appDir);
    const ignoring = claudeFilesIgnoringAgents(appDir);
    const problems = foundationProblems(appDir);
    const offRules = uiRuleProblems(appDir);
    if (args.includes("--baseline")) {
      const allowed = writeSpacingBaseline(appDir);
      console.info(`wrote ${SPACING_BASELINE}: ${allowed} hand-picked spacing utilities allowed`);
    }
    const spacing = spacingProblems(appDir);
    if (!spacing.enforced && spacing.total > 0) {
      console.warn(
        `${spacing.total} hand-picked paddings, margins and gaps in src; ` +
          "`ib check --baseline` allows these and fails new ones",
      );
    }
    if (stale.length > 0) {
      console.error(
        `out of date with @inbeat/standards, run \`ib sync\`:\n  ${stale.join("\n  ")}`,
      );
    }
    if (ignoring.length > 0) {
      console.error(
        "Claude Code ignores AGENTS.md when a CLAUDE.md exists; add a line `@AGENTS.md` to:\n" +
          `  ${ignoring.join("\n  ")}`,
      );
    }
    if (problems.length > 0) {
      console.error(`not on the shared foundation:\n  ${problems.join("\n  ")}`);
    }
    if (offRules.length > 0) {
      console.error(
        'outside the UI rules (see "UI" in the standard; use the toolkit, or change it in ' +
          `ib-toolkit):\n  ${offRules.join("\n  ")}`,
      );
    }
    if (spacing.problems.length > 0) {
      console.error(
        "hand-picked spacing (use Stack, Inline, Grid or Item from @inbeat/ui, or mark the file " +
          `\`// signature-surface: <what>\`):\n  ${spacing.problems.join("\n  ")}`,
      );
    }
    const failures = [stale, ignoring, problems, offRules, spacing.problems];
    return failures.every((list) => list.length === 0) ? 0 : 1;
  },
  mcp: () =>
    runMcp(args, {
      cwd: process.cwd(),
      isTTY: Boolean(process.stdin.isTTY),
      out: console.info,
      err: console.error,
    }),
  help: () => {
    console.info(USAGE);
    return 0;
  },
};

const wantsHelp = args.some((arg) => arg === "--help" || arg === "-h");
const handler = wantsHelp && command !== "mcp" ? commands.help : commands[command];
if (!handler) console.error(USAGE);

try {
  process.exit(handler ? await handler() : 1);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
