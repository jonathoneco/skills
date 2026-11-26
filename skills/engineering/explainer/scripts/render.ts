// render <suite> --to page|notion|brief|pdf|cold|check [--only <page>] [--out <dir>] [--force]
// render test
//
// Renders an explainer suite from its sources. Each page gets a content hash over its own files, its figures, the
// records it cites, the suite.yaml keys every page uses, and the kit's own code. A re-render rebuilds only the units
// whose hash changed, and `<out>/.kit/index.json` maps each call and fact id to the pages that cite it.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fontsDir } from "./fonts.ts";
import { loadSuite } from "./frontends/suite.ts";
import { escapedSize, SIZE_LIMIT, SourceError, type Suite } from "./ir.ts";
import { type Files, type Opts, sha, type Target } from "./targets.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const TARGETS = ["page", "notion", "brief", "pdf", "cold", "check"] as const;
type TargetName = (typeof TARGETS)[number];

/** The kit's own code, components and bundled faces: a change to any of them rebuilds every unit. */
function kitHash() {
  const files: string[] = [];
  const visit = (dir: string) => {
    for (const f of fs.readdirSync(dir).sort()) {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) {
        if (!["test", "examples", "node_modules"].includes(f)) visit(p);
      } else if (/\.(ts|css|json)$/.test(f)) files.push(p);
    }
  };
  visit(here);
  visit(fontsDir);
  return sha(...files.flatMap((f) => [path.relative(here, f), fs.readFileSync(f)]));
}

/** The suite.yaml keys every page reads: its title, the page list (the rail), the palette, the type, the key. */
function suiteKeys(suite: Suite) {
  const { reader: _reader, ...used } = suite.config;
  return JSON.stringify(used);
}

/** Which pages cite each call and fact id. */
export function reverseIndex(suite: Suite) {
  const calls: Record<string, string[]> = {};
  const facts: Record<string, string[]> = {};
  for (const p of suite.pages) {
    for (const c of p.cites.calls) (calls[c] ??= []).push(p.entry.id);
    for (const f of p.cites.facts) (facts[f] ??= []).push(p.entry.id);
  }
  return { calls, facts };
}

async function loadTarget(name: Exclude<TargetName, "check">): Promise<Target> {
  return (await import(`./backends/${name}.ts`)).target;
}

function writeFiles(dir: string, files: Files) {
  for (const [rel, content] of Object.entries(files)) {
    const p = path.join(dir, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  }
}

export interface RunResult {
  rebuilt: string[];
  kept: string[];
  oversize: string[];
}

/** Build one target into `<out>/<target>/`, rebuilding only the units whose hash changed. */
export async function runTarget(suite: Suite, name: Exclude<TargetName, "check">, opts: Opts & { force?: boolean }): Promise<RunResult> {
  const target = await loadTarget(name);
  const dir = path.join(opts.out, name);
  const stateFile = path.join(opts.out, ".kit", `${name}.json`);
  let state: Record<string, { hash: string; files: string[] }> = {};
  try {
    state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  } catch {
    // no earlier render
  }
  const common = sha(kitHash(), suiteKeys(suite), name);
  const result: RunResult = { rebuilt: [], kept: [], oversize: [] };
  for (const unit of target.units(suite, opts)) {
    const hash = sha(common, unit.inputs);
    const prev = state[unit.id];
    if (!opts.force && prev?.hash === hash && prev.files.every((f) => fs.existsSync(path.join(dir, f)))) {
      result.kept.push(unit.id);
      continue;
    }
    const files = await unit.build();
    writeFiles(dir, files);
    state[unit.id] = { hash, files: Object.keys(files) };
    result.rebuilt.push(unit.id);
  }
  if (target.finish) writeFiles(dir, await target.finish(suite, opts));
  if (name === "page")
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".html")))
      if (escapedSize(fs.readFileSync(path.join(dir, f), "utf8")) > SIZE_LIMIT) result.oversize.push(f);
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 1));
  fs.writeFileSync(path.join(opts.out, ".kit", "index.json"), JSON.stringify(reverseIndex(suite), null, 1));
  return result;
}

/**
 * Where a run writes when `--out` is absent: `~/.local/state/agent-runs/<effort>/out`, so stills, PDFs and print pages
 * stay out of the synced notes. The effort is the folder under `agent-notes/` that holds the suite, else the suite
 * folder's own name.
 */
export function defaultOut(suiteDir: string) {
  const parts = path.resolve(suiteDir).split(path.sep);
  const i = parts.lastIndexOf("agent-notes");
  const effort = i >= 0 && parts[i + 1] ? parts[i + 1] : path.basename(path.resolve(suiteDir));
  return path.join(os.homedir(), ".local", "state", "agent-runs", effort, "out");
}

function usage(msg?: string): never {
  if (msg) console.error(msg);
  console.error("usage: render <suite> --to page|notion|brief|pdf|cold|check[,…] [--only <page>] [--out <dir>] [--force]\n       render test [<name filter>]");
  process.exit(2);
}

export function parseArgs(argv: string[]) {
  const [suiteDir, ...rest] = argv;
  if (!suiteDir || suiteDir.startsWith("--")) usage();
  let to: TargetName[] = [];
  let only: string | undefined;
  let out: string | undefined;
  let force = false;
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--to") {
      to = (rest[++i] ?? "").split(",").map((t) => {
        if (!(TARGETS as readonly string[]).includes(t)) usage(`unknown target \`${t}\``);
        return t as TargetName;
      });
    } else if (a === "--only") only = rest[++i];
    else if (a === "--out") out = rest[++i];
    else if (a === "--force") force = true;
    else usage(`unknown argument \`${a}\``);
  }
  if (!to.length) usage("--to names at least one target");
  return { suiteDir, to, only, out: path.resolve(out ?? defaultOut(suiteDir)), force };
}

async function main(argv: string[]) {
  if (argv[0] === "test") {
    const { runTests } = await import("./test/harness.ts");
    process.exit(await runTests(argv[1]));
  }
  const args = parseArgs(argv);
  const t0 = performance.now();
  const suite = loadSuite(args.suiteDir);
  if (args.only && !suite.pages.some((p) => p.entry.id === args.only)) usage(`no page \`${args.only}\` in suite.yaml`);
  let failed = false;
  for (const name of args.to) {
    const t = performance.now();
    if (name === "check") {
      await runTarget(suite, "page", args);
      const { checkSuite } = await import("./backends/check.ts");
      failed = !(await checkSuite(suite, args)) || failed;
      continue;
    }
    const r = await runTarget(suite, name, args);
    const ms = Math.round(performance.now() - t);
    console.log(`${name}: rebuilt ${r.rebuilt.length} (${r.rebuilt.join(" ") || "none"}), kept ${r.kept.length}, ${ms} ms → ${path.join(args.out, name)}`);
    for (const f of r.oversize) console.error(`${name}: ${f} is over ${SIZE_LIMIT} bytes once JSON-escaped, the explainer's page budget`);
    failed = failed || r.oversize.length > 0;
  }
  const { closeBrowser } = await import("./browser.ts");
  await closeBrowser();
  console.log(`total ${Math.round(performance.now() - t0)} ms`);
  process.exit(failed ? 1 : 0);
}

if (import.meta.main ?? process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((e) => {
    if (e instanceof SourceError) {
      console.error(e.message);
      process.exit(2);
    }
    throw e;
  });
}
