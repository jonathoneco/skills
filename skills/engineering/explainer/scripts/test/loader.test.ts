import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { need } from "../deps.ts";
import { loadSuite } from "../frontends/suite.ts";
import { SourceError } from "../ir.ts";
import { test } from "./harness.ts";
import { edit, example, scratch } from "./util.ts";

const refuses = (dir: string, pattern: RegExp) =>
  assert.throws(
    () => loadSuite(dir),
    (e: unknown) => e instanceof SourceError && pattern.test(e.message),
  );

test("loader: the example loads, with each figure form, each call state and its cited ids", () => {
  const s = loadSuite(example);
  assert.deepEqual(s.pages.map((p) => p.entry.id), ["index", "calls", "how"]);
  assert.deepEqual(
    [...s.figures.values()].map((f) => [f.id, f.drawing.form, f.interactive]),
    [["flow", "svg", false], ["matrix", "html", false], ["stages", "wide-narrow", false], ["stepper", "html", true]],
  );
  assert.deepEqual([...s.calls.values()].map((c) => c.state), ["open", "waiting", "settled", "settled"]);
  assert.deepEqual(s.pages[1].cites, { calls: ["cutoff", "caterer-window", "menu-day", "menu-day-old"], facts: ["orders-per-day", "refused-cost", "late-share"], figures: [] });
  assert.deepEqual(s.pages[2].islands, [{ index: 12, tag: "div", still: "The counter at 0 late orders." }]);
});

test("loader: the example uses every field of suite.yaml, calls.yaml, facts.yaml and meta.yaml", () => {
  const YAML = need<typeof import("yaml")>("yaml");
  const keys = new Set<string>();
  const visit = (v: unknown, at: string) => {
    if (Array.isArray(v)) v.forEach((x) => visit(x, at));
    else if (v && typeof v === "object")
      for (const [k, x] of Object.entries(v)) {
        const key = at === "palette" || at === "palette.light" || at === "palette.dark" ? at : `${at}${at ? "." : ""}${k}`;
        keys.add(key);
        visit(x, key);
      }
  };
  const read = (f: string) => YAML.parse(fs.readFileSync(path.join(example, f), "utf8"));
  visit(read("suite.yaml"), "suite");
  visit(read("calls.yaml"), "calls");
  visit(read("facts.yaml"), "facts");
  for (const f of fs.readdirSync(path.join(example, "figures")).filter((f) => !f.includes("."))) visit(read(`figures/${f}/meta.yaml`), "meta");
  const fields = [
    "suite.title", "suite.reader", "suite.read_at", "suite.pages.id", "suite.pages.title", "suite.pages.thread", "suite.pages.question",
    "suite.pages.holds", "suite.palette", "suite.type.text", "suite.type.heading", "suite.type.mono", "suite.key.mark", "suite.key.label",
    "suite.key.swatch", "suite.notion.accent",
    "calls.id", "calls.label", "calls.question", "calls.small", "calls.state", "calls.waits_on", "calls.options.label", "calls.options.text",
    "calls.options.buys", "calls.options.changes", "calls.options.cost", "calls.pick.label", "calls.pick.why", "calls.pick.measure",
    "calls.pick.reverse", "calls.ruling.text", "calls.ruling.date", "calls.ruling.by", "calls.supersedes",
    "facts.id", "facts.value", "facts.source", "facts.grade",
    "meta.caption", "meta.note", "meta.alt", "meta.marks", "meta.narrow_below", "meta.min_width", "meta.still", "meta.states.name",
    "meta.states.text", "meta.states.click",
  ];
  assert.deepEqual(fields.filter((f) => !keys.has(f)), []);
});

test("loader: a schema error in calls.yaml stops the load and names the key", () => {
  const { suite } = scratch(example);
  edit(path.join(suite, "calls.yaml"), "state: open", "state: maybe");
  refuses(suite, /calls\[0\]\.state: expected one of open, waiting, settled, got "maybe"/);
});

test("loader: a misspelt key in facts.yaml stops the load", () => {
  const { suite } = scratch(example);
  edit(path.join(suite, "facts.yaml"), "grade: observed", "grde: observed");
  refuses(suite, /facts\[0\]: missing `grade`[\s\S]*facts\[0\]: unknown key `grde`/);
});

test("loader: a settled call with no ruling stops the load", () => {
  const { suite } = scratch(example);
  edit(path.join(suite, "calls.yaml"), "  state: open", "  state: settled");
  refuses(suite, /cutoff: a settled call carries its `ruling`/);
});

test("loader: a page that cites a call id neither YAML file holds stops the load", () => {
  const { suite } = scratch(example);
  edit(path.join(suite, "pages", "calls.html"), '<x-call id="cutoff" form="pill">', '<x-call id="no-such-call" form="pill">');
  refuses(suite, /<x-call id="no-such-call">: calls.yaml holds no call `no-such-call`/);
});

test("loader: a page that cites a fact id neither YAML file holds stops the load", () => {
  const { suite } = scratch(example);
  edit(path.join(suite, "pages", "index.html"), '<x-fact id="caterer-lead">', '<x-fact id="cutoff">');
  refuses(suite, /<x-fact id="cutoff">: facts.yaml holds no fact `cutoff`/);
});

test("loader: a figure folder with two drawing forms stops the load", () => {
  const { suite } = scratch(example);
  fs.writeFileSync(path.join(suite, "figures", "flow", "figure.html"), "<p>also</p>");
  refuses(suite, /a figure holds exactly one drawing form[\s\S]*Found: figure.svg, figure.html/);
});
