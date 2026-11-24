// Golden copies of every target for the example suite, and of check's report for a suite built to fail.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { checkSuite } from "../backends/check.ts";
import { loadSuite } from "../frontends/suite.ts";
import { runTarget } from "../render.ts";
import { test } from "./harness.ts";
import { corpus, example, golden, normalize, pngSize, scratch } from "./util.ts";

const read = (...p: string[]) => fs.readFileSync(path.join(...p), "utf8");
const files = (dir: string, ext: string) => fs.readdirSync(dir).filter((f) => f.endsWith(ext)).sort();

async function render(target: Parameters<typeof runTarget>[1], suiteDir = example) {
  const { out } = scratch(suiteDir);
  const r = await runTarget(loadSuite(suiteDir), target, { out });
  return { dir: path.join(out, target), r, out };
}

test("corpus: page", async () => {
  const { dir, r } = await render("page");
  assert.deepEqual(r.rebuilt, ["index", "calls", "how"]);
  assert.deepEqual(r.oversize, []);
  for (const f of [...files(dir, ".html"), ...files(dir, ".md")]) golden(`lunch-orders/page/${f}`, normalize(read(dir, f)));
  // Islands pass through byte for byte: the island and the author's table are in the output exactly as written.
  const src = read(example, "pages", "how.html");
  const island = src.slice(src.indexOf('<div class="tally"'), src.indexOf("</div>", src.indexOf('<div class="tally"')) + 6);
  assert.ok(read(dir, "how.html").includes(island));
});

test("corpus: notion", async () => {
  const { dir } = await render("notion");
  for (const f of files(dir, ".md")) golden(`lunch-orders/notion/${f}`, read(dir, f));
  golden("lunch-orders/notion/pages.json", read(dir, "pages.json"));
  const stills = files(path.join(dir, "stills"), ".png");
  golden("lunch-orders/notion/stills.txt", `${stills.join("\n")}\n`);
  for (const s of stills) assert.ok(pngSize(fs.readFileSync(path.join(dir, "stills", s))).width > 100, `${s} is a picture`);
});

test("corpus: cold", async () => {
  const { dir } = await render("cold");
  golden("lunch-orders/cold/cold.md", read(dir, "cold.md"));
  assert.deepEqual(files(path.join(dir, "stills"), ".png"), ["how-figure-matrix.png", "how-figure-stages.png", "how-figure-stepper.png", "how-island-1.png", "index-figure-flow.png"]);
});

test("corpus: brief", async () => {
  const { dir } = await render("brief");
  golden("lunch-orders/brief/brief.html", normalize(read(dir, "brief.html")));
  assert.equal((read(dir, "brief.html").match(/⟦kit:/g) ?? []).length, 2, "two places for agent-written text");
  assert.ok(read(dir, "brief.html").includes('<a href="../page/index.html">'), "the footer links the hub page");
});

test("corpus: pdf", async () => {
  const { dir } = await render("pdf");
  const pdf = fs.readFileSync(path.join(dir, "suite.pdf"));
  assert.equal(pdf.subarray(0, 5).toString("latin1"), "%PDF-");
  golden("lunch-orders/pdf/suite.stats.pages", `${(pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length}\n`);
});

test("corpus: check passes the example and writes its report", async () => {
  const { out } = await render("page");
  const ok = await checkSuite(loadSuite(example), { out });
  assert.equal(ok, true);
  golden("lunch-orders/check/report.md", read(out, "check", "report.md"));
});

test("corpus: check fails a suite built to break each rule, and names each break", async () => {
  const broken = path.join(corpus, "broken", "suite");
  const { out } = await render("page", broken);
  const ok = await checkSuite(loadSuite(broken), { out });
  assert.equal(ok, false);
  golden("broken/check/report.md", read(out, "check", "report.md"));
});
