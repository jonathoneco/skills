// A page may load assets from the network but makes no live data calls (build.md). These tests serve the "network"
// from a local server, so they run offline.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openFile } from "../browser.ts";
import { checkSuite } from "../backends/check.ts";
import { loadSuite } from "../frontends/suite.ts";
import { runTarget } from "../render.ts";
import { here, test } from "./harness.ts";
import { corpus } from "./util.ts";

/** Start test/serve.ts under the runtime running this test, and return its port and a way to stop it. */
async function server() {
  const script = path.join(here, "serve.ts");
  const args = "Deno" in globalThis ? ["run", "--quiet", "--allow-net=127.0.0.1", script] : "Bun" in globalThis ? [script] : ["--disable-warning=ExperimentalWarning", script];
  const child = spawn(process.execPath, args, { stdio: ["ignore", "pipe", "inherit"] });
  const port = await new Promise<number>((resolve, reject) => {
    let out = "";
    child.stdout.on("data", (d) => {
      out += String(d);
      if (out.includes("\n")) resolve(Number(out.trim()));
    });
    child.on("exit", (code) => reject(new Error(`serve.ts exited ${code}`)));
  });
  return { port, stop: () => child.kill() };
}

/** A two-page suite: one page loads a script from the server, the other fetches data from it. */
function suiteFor(port: number) {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "explainer-kit-net-")), "suite");
  fs.mkdirSync(path.join(dir, "pages"), { recursive: true });
  const yaml = fs.readFileSync(path.join(corpus, "broken", "suite", "suite.yaml"), "utf8");
  fs.writeFileSync(path.join(dir, "suite.yaml"), yaml.replace(/pages:\n  - id: broken\n    title: Broken\n/, "pages:\n  - id: cdn\n    title: CDN\n  - id: live\n    title: Live\n"));
  const url = `http://127.0.0.1:${port}`;
  fs.writeFileSync(path.join(dir, "pages", "cdn.html"), `<h1>A script from a CDN</h1>\n<p id="cdn-out">not drawn yet</p>\n<script src="${url}/lib.js"></script>\n`);
  fs.writeFileSync(
    path.join(dir, "pages", "live.html"),
    `<h1>A live data call</h1>\n<p id="n">0</p>\n<script>fetch("${url}/data.json").then((r) => r.json()).then((d) => { document.getElementById("n").textContent = String(d.n); });</script>\n`,
  );
  for (const p of ["cdn", "live"]) fs.writeFileSync(path.join(dir, "pages", `${p}.context.md`), `# Agent context: ${p}\n`);
  return { dir, out: path.join(path.dirname(dir), "out") };
}

test("network: a CDN script passes check and its host is listed; a fetch to an outside host fails check", async () => {
  const { port, stop } = await server();
  try {
    const { dir, out } = suiteFor(port);
    const suite = loadSuite(dir);
    await runTarget(suite, "page", { out });
    assert.equal(await checkSuite(suite, { out }), false);
    const report = fs.readFileSync(path.join(out, "check", "report.md"), "utf8");
    assert.match(report, /\| cdn\.html \| \d+ \| \d+ \| pass \|/);
    assert.ok(report.includes(`- 1440×900 light: live.html makes a live data call, fetch http://127.0.0.1:${port}/data.json; a page loads assets only`));
    assert.ok(report.includes(`- cdn.html: 127.0.0.1:${port}\n- live.html: 127.0.0.1:${port}`));
    // The screenshot waits for the network: late.js arrives 400 ms after the load event, and its text is there.
    const { page, close } = await openFile(path.join(out, "page", "cdn.html"), { width: 1440, height: 900, scheme: "light" });
    assert.equal(await page.textContent("#cdn-out"), "drawn by the CDN script");
    await close();
  } finally {
    stop();
  }
});
