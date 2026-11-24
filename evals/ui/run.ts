#!/usr/bin/env bun
// Measures how often UI ships with obvious bugs on the current toolkit.
//
// Check an app that already runs (free, no model calls):
//   bun run eval:ui check --url http://localhost:3000 --routes /clients,/database [--app ../ugc-hub]
//   add --login once to sign in by hand in a real browser; the session is reused afterwards.
//
// Let an agent build each task in a fresh app from the local template (calls the model, costs money):
//   bun run eval:ui agent [--tasks list,form] [--repeat 2] [--concurrency 4] [--model sonnet]
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";
import { type Browser, chromium } from "playwright";
import { uiRuleProblems } from "../../packages/standards/src/ui-rules";
import { countSpacingChoices, type Finding, inspectPage, WIDTHS } from "./checks";
import { type EvalTask, TASKS } from "./tasks";

const ROOT = join(import.meta.dir, "../..");
const EVAL_DIR = join(ROOT, ".demo", "eval");
const AGENT_TIMEOUT_MS = 30 * 60_000;
// biome-ignore lint/style/noProcessEnv: child processes need PATH and HOME from the shell that runs the eval
const BUILD_ENV = { ...process.env, SKIP_ENV_VALIDATION: "1", NEXT_TELEMETRY_DISABLED: "1" };

type Agent = { turns: number; costUsd: number; minutes: number };
type Result = {
  name: string;
  build: boolean;
  spacingChoices: number;
  bugs: Finding[];
  screenshots: string[];
  agent?: Agent;
};

const { positionals, values: options } = parseArgs({
  allowPositionals: true,
  options: {
    url: { type: "string" },
    routes: { type: "string" },
    app: { type: "string" },
    login: { type: "boolean", default: false },
    tasks: { type: "string" },
    repeat: { type: "string", default: "1" },
    concurrency: { type: "string", default: "4" },
    model: { type: "string" },
  },
});

async function run(cmd: string[], cwd: string, timeout = 10 * 60_000) {
  const child = Bun.spawn(cmd, { cwd, env: BUILD_ENV, stdout: "pipe", stderr: "pipe", timeout });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { ok: code === 0, stdout, stderr };
}

async function waitForServer(url: string) {
  for (let attempt = 0; attempt < 60; attempt++) {
    const up = await fetch(url).then(
      () => true,
      () => false,
    );
    if (up) return;
    await Bun.sleep(500);
  }
  throw new Error(`${url} never answered`);
}

async function inspectRoutes(
  baseUrl: string,
  routes: string[],
  label: string,
  browser: Browser,
  outDir: string,
  storageState?: string,
) {
  const bugs: Finding[] = [];
  const screenshots: string[] = [];
  for (const route of routes) {
    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, storageState });
      const page = await context.newPage();
      const where = `${route} @${width}`;
      page.on("pageerror", (error) =>
        bugs.push({ check: "page-error", detail: `${where}: ${error.message}` }),
      );
      page.on("console", (message) => {
        if (message.type() === "error") {
          bugs.push({ check: "console-error", detail: `${where}: ${message.text()}` });
        }
      });
      const response = await page.goto(new URL(route, baseUrl).href, { waitUntil: "networkidle" });
      if (!response?.ok()) {
        bugs.push({ check: "http-status", detail: `${where}: answered ${response?.status()}` });
      }
      if (new URL(page.url()).pathname !== new URL(route, baseUrl).pathname) {
        bugs.push({ check: "redirected", detail: `${where}: ended on ${page.url()}` });
      }
      for (const bug of await inspectPage(page)) {
        bugs.push({ ...bug, detail: `${where}: ${bug.detail}` });
      }
      const file = `${label}-${route.replaceAll("/", "_") || "_"}-${width}.png`;
      await page.screenshot({ path: join(outDir, file), fullPage: true });
      screenshots.push(file);
      await context.close();
    }
  }
  return { bugs, screenshots };
}

// The same bug seen at several widths counts once: it is one thing to fix.
function distinct(bugs: Finding[]) {
  const seen = new Map<string, Finding>();
  for (const bug of bugs) seen.set(`${bug.check} ${bug.detail.replace(/ @\d+:/, ":")}`, bug);
  return [...seen.values()];
}

function sourceLines(appDir: string) {
  return [...new Bun.Glob("src/**/*.tsx").scanSync(appDir)].flatMap((file) =>
    readFileSync(join(appDir, file), "utf8").split("\n"),
  );
}

async function addedSourceLines(appDir: string) {
  await run(["git", "add", "-A"], appDir);
  const diff = await run(["git", "diff", "--cached", "-U0", "--", "src"], appDir);
  return diff.stdout.split("\n").filter((line) => line.startsWith("+") && !line.startsWith("+++"));
}

const staticBugs = (appDir: string): Finding[] =>
  uiRuleProblems(appDir).map((detail) => ({ check: "ft-check", detail }));

async function login(baseUrl: string, sessionFile: string) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  await (await context.newPage()).goto(baseUrl);
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  await prompt.question("Sign in in the browser window, then press Enter here. ");
  prompt.close();
  await context.storageState({ path: sessionFile });
  await browser.close();
}

async function checkRunningApp(browser: Browser, outDir: string): Promise<Result[]> {
  if (!options.url || !options.routes) {
    throw new Error(
      "check needs --url and --routes, for example --url http://localhost:3000 --routes /clients",
    );
  }
  const sessionFile = join(EVAL_DIR, `session-${new URL(options.url).host.replace(":", "-")}.json`);
  if (options.login) await login(options.url, sessionFile);
  const storageState = existsSync(sessionFile) ? sessionFile : undefined;
  const routes = options.routes.split(",");
  const rendered = await inspectRoutes(options.url, routes, "app", browser, outDir, storageState);
  const appDir = options.app;
  return [
    {
      name: appDir ?? options.url,
      build: true,
      spacingChoices: appDir ? countSpacingChoices(sourceLines(appDir)) : 0,
      bugs: distinct([...(appDir ? staticBugs(appDir) : []), ...rendered.bugs]),
      screenshots: rendered.screenshots,
    },
  ];
}

async function createApp(dir: string) {
  const created = await run(
    ["bun", "packages/standards/src/cli.ts", "create", dir, "--local"],
    ROOT,
  );
  if (!created.ok) throw new Error(`ft create failed: ${created.stderr}`);
  const git = (...args: string[]) =>
    run(["git", "-c", "user.name=eval", "-c", "user.email=eval@local", ...args], dir);
  await git("init", "-q");
  await git("add", "-A");
  await git("commit", "-q", "-m", "base");
}

async function runAgent(task: EvalTask, dir: string): Promise<Agent> {
  const started = Date.now();
  // Project settings only, no MCP servers: the run measures the toolkit, not one developer's setup.
  const result = await run(
    [
      "claude",
      "-p",
      task.prompt,
      "--output-format",
      "json",
      "--dangerously-skip-permissions",
      "--setting-sources",
      "project,local",
      "--strict-mcp-config",
      "--no-session-persistence",
      ...(options.model ? ["--model", options.model] : []),
    ],
    dir,
    AGENT_TIMEOUT_MS,
  );
  const minutes = (Date.now() - started) / 60_000;
  try {
    const summary = JSON.parse(result.stdout);
    return { turns: summary.num_turns, costUsd: summary.total_cost_usd, minutes };
  } catch {
    return { turns: 0, costUsd: 0, minutes };
  }
}

async function buildWithAgent(
  task: EvalTask,
  name: string,
  port: number,
  workDir: string,
  outDir: string,
  browser: Browser,
): Promise<Result> {
  const dir = join(workDir, name);
  await createApp(dir);
  const agent = await runAgent(task, dir);
  const spacingChoices = countSpacingChoices(await addedSourceLines(dir));
  const bugs = staticBugs(dir);
  const typecheck = await run(["bun", "run", "typecheck"], dir);
  if (!typecheck.ok) {
    const firstError = typecheck.stdout.split("\n").find((line) => line.includes("error"));
    bugs.push({ check: "typecheck", detail: firstError ?? "failed" });
  }
  const build = await run(["bun", "run", "build"], dir);
  if (!build.ok) {
    bugs.push({ check: "build", detail: "bun run build failed" });
    return { name, agent, build: false, spacingChoices, bugs, screenshots: [] };
  }
  const server = Bun.spawn(["bun", "run", "start", "-p", String(port)], {
    cwd: dir,
    env: BUILD_ENV,
    stdout: "ignore",
    stderr: "ignore",
  });
  try {
    const baseUrl = `http://localhost:${port}`;
    await waitForServer(baseUrl);
    const rendered = await inspectRoutes(baseUrl, task.routes, name, browser, outDir);
    return {
      name,
      agent,
      build: true,
      spacingChoices,
      bugs: distinct([...bugs, ...rendered.bugs]),
      screenshots: rendered.screenshots,
    };
  } finally {
    server.kill();
  }
}

async function pool<T, R>(items: T[], size: number, work: (item: T, slot: number) => Promise<R>) {
  const results: R[] = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async (_, slot) => {
      while (next < items.length) {
        const item = items[next++] as T;
        results.push(await work(item, slot));
      }
    }),
  );
  return results;
}

async function buildAllWithAgent(browser: Browser, outDir: string) {
  const wanted = options.tasks?.split(",");
  const tasks = wanted ? TASKS.filter((task) => wanted.includes(task.id)) : TASKS;
  if (tasks.length === 0) throw new Error(`no task matches --tasks ${options.tasks}`);
  const runs = tasks.flatMap((task) =>
    Array.from({ length: Number(options.repeat) }, (_, index) => ({
      task,
      name: `${task.id}-${index + 1}`,
    })),
  );
  const workDir = mkdtempSync(join(tmpdir(), "ft-ui-eval-"));
  console.info(`apps are built in ${workDir}`);
  const results = await pool(runs, Number(options.concurrency), async ({ task, name }, slot) => {
    console.info(`start ${name}`);
    const result = await buildWithAgent(task, name, 4300 + slot, workDir, outDir, browser);
    console.info(`done  ${name}: ${result.bugs.length} bugs`);
    return result;
  });
  return results.sort((a, b) => a.name.localeCompare(b.name));
}

function report(results: Result[], runId: string) {
  const withAgent = results.some((result) => result.agent);
  const agentCells = (agent?: Agent) =>
    withAgent && agent
      ? `<td>${agent.turns}</td><td>$${agent.costUsd.toFixed(2)}</td><td>${agent.minutes.toFixed(1)}m</td>`
      : "";
  const rows = results
    .map(
      (result) => `<tr><td>${Bun.escapeHTML(result.name)}</td><td>${result.bugs.length}</td>
<td>${result.spacingChoices}</td><td>${result.build ? "yes" : "no"}</td>${agentCells(result.agent)}</tr>
<tr><td colspan="7"><details><summary>bugs and screenshots</summary><ul>${result.bugs
        .map((bug) => `<li><b>${bug.check}</b> ${Bun.escapeHTML(bug.detail)}</li>`)
        .join("")}</ul>${result.screenshots
        .map((file) => `<a href="${file}"><img src="${file}" alt="${file}" loading="lazy"></a>`)
        .join("")}</details></td></tr>`,
    )
    .join("\n");
  const total = results.reduce((sum, result) => sum + result.bugs.length, 0);
  const agentHeads = withAgent ? "<th>Turns</th><th>Cost</th><th>Time</th>" : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>UI eval ${runId}</title>
<style>
:root{color-scheme:light dark;--bg:#fff;--fg:#111;--line:#ddd}
@media (prefers-color-scheme:dark){:root{--bg:#111;--fg:#eee;--line:#333}}
body{background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,sans-serif;margin:0 auto;max-width:1100px;padding:24px 16px}
table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
img{border:1px solid var(--line);margin:4px;max-height:240px;max-width:100%}li{word-break:break-word}
</style></head><body>
<h1>UI eval ${runId}</h1>
<p>${total} obvious bugs across ${results.length} runs. Spacing choices are the padding and gap utilities written by hand.</p>
<table><thead><tr><th>Run</th><th>Bugs</th><th>Spacing choices</th><th>Builds</th>${agentHeads}</tr></thead>
<tbody>${rows}</tbody></table></body></html>`;
}

const mode = positionals[0];
if (mode !== "check" && mode !== "agent") {
  throw new Error(
    "usage: bun run eval:ui check --url <url> --routes </a,/b> | agent [--tasks a,b]",
  );
}
const runId = new Date().toISOString().slice(0, 16).replace(":", "");
const outDir = join(EVAL_DIR, runId);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  const results =
    mode === "check"
      ? await checkRunningApp(browser, outDir)
      : await buildAllWithAgent(browser, outDir);
  writeFileSync(join(outDir, "results.json"), `${JSON.stringify(results, null, 2)}\n`);
  writeFileSync(join(outDir, "report.html"), report(results, runId));
  for (const { name, bugs, spacingChoices, agent } of results) {
    const cost = agent ? `, $${agent.costUsd.toFixed(2)}` : "";
    console.info(`${name}: ${bugs.length} bugs, ${spacingChoices} spacing choices${cost}`);
  }
  console.info(`report: ${join(outDir, "report.html")}`);
} finally {
  await browser.close();
}
