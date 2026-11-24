// A re-render rebuilds exactly the pages whose own inputs changed.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadSuite } from "../frontends/suite.ts";
import { parseArgs, runTarget } from "../render.ts";
import { test } from "./harness.ts";
import { edit, example, scratch } from "./util.ts";

async function setup() {
  const { suite, out } = scratch(example);
  const first = await runTarget(loadSuite(suite), "page", { out });
  assert.deepEqual(first.rebuilt, ["index", "calls", "how"]);
  const again = async () => (await runTarget(loadSuite(suite), "page", { out })).rebuilt;
  return { suite, out, again };
}

test("incremental: an unchanged suite rebuilds nothing", async () => {
  const { again } = await setup();
  assert.deepEqual(await again(), []);
});

test("incremental: a call's state change rebuilds only the pages that cite it", async () => {
  const { suite, out, again } = await setup();
  edit(path.join(suite, "calls.yaml"), "  state: open\n", "  state: waiting\n  waits_on: Sam's manager\n");
  assert.deepEqual(await again(), ["calls"]);
  assert.match(fs.readFileSync(path.join(out, "page", "calls.html"), "utf8"), /<span class="pill waiting">waiting · Sam<\/span>/);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out, ".kit", "index.json"), "utf8")).calls.cutoff, ["calls"]);
});

test("incremental: a fact's value change rebuilds only the pages that cite it", async () => {
  const { suite, again } = await setup();
  edit(path.join(suite, "facts.yaml"), "value: 4 in 100", "value: 5 in 100");
  assert.deepEqual(await again(), ["index", "calls"]);
});

test("incremental: a figure's drawing change rebuilds only the page that shows it", async () => {
  const { suite, again } = await setup();
  edit(path.join(suite, "figures", "stages", "wide.svg"), ">Kitchen<", ">Kitchen hatch<");
  assert.deepEqual(await again(), ["how"]);
});

test("incremental: a palette token change rebuilds every page", async () => {
  const { suite, again } = await setup();
  edit(path.join(suite, "suite.yaml"), 'accent: "#2f6b4f"', 'accent: "#2f5f6b"');
  assert.deepEqual(await again(), ["index", "calls", "how"]);
});

test("incremental: a deleted output is rebuilt even when its hash holds", async () => {
  const { out, again } = await setup();
  fs.rmSync(path.join(out, "page", "how.html"));
  assert.deepEqual(await again(), ["how"]);
});

test("render: with no --out, output goes to agent-runs/<effort>/out, outside the synced notes", () => {
  const home = os.homedir();
  assert.equal(parseArgs([`${home}/.local/state/agent-notes/f6-docs/explainer`, "--to", "page"]).out, `${home}/.local/state/agent-runs/f6-docs/out`);
  assert.equal(parseArgs(["/srv/suites/lunch", "--to", "page"]).out, `${home}/.local/state/agent-runs/lunch/out`);
});

test("incremental: an --only run keeps every page in cold.md and in notion's pages.json", async () => {
  const { suite, out } = scratch(example);
  const s = loadSuite(suite);
  for (const target of ["cold", "notion"] as const) await runTarget(s, target, { out });
  edit(path.join(suite, "pages", "how.html"), "Today's timings", "Today's closing times");
  const again = loadSuite(suite);
  assert.deepEqual((await runTarget(again, "cold", { out, only: "how" })).rebuilt, ["how"]);
  assert.deepEqual((await runTarget(again, "notion", { out, only: "how" })).rebuilt, ["how"]);
  const cold = fs.readFileSync(path.join(out, "cold", "cold.md"), "utf8");
  assert.deepEqual([...cold.matchAll(/<!-- page: ([a-z-]+)\.html -->/g)].map((m) => m[1]), ["index", "calls", "how"]);
  assert.match(cold, /## Today's closing times/);
  const manifest = JSON.parse(fs.readFileSync(path.join(out, "notion", "pages.json"), "utf8"));
  assert.deepEqual(manifest.pages.map((p: { id: string }) => p.id), ["index", "calls", "how"]);
});
