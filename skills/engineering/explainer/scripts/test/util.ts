// Helpers shared by the test files: a scratch copy of a suite, and golden-file comparison.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { here, updating } from "./harness.ts";

export const example = path.join(here, "..", "examples", "lunch-orders");
export const corpus = path.join(here, "corpus");

/** A fresh copy of a suite folder in the system temp folder, with its own out folder. */
export function scratch(suiteDir: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "explainer-kit-"));
  const suite = path.join(dir, "suite");
  fs.cpSync(suiteDir, suite, { recursive: true, filter: (s) => !s.includes(`${path.sep}out`) });
  return { suite, out: path.join(dir, "out") };
}

/** Embedded fonts and pictures change with the Chromium and the subsetter; the golden copy names them instead. */
export const normalize = (s: string) =>
  s
    .replace(/data:font\/woff2;base64,[A-Za-z0-9+/=]+/g, "data:font/woff2;base64,<font>")
    .replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g, "data:image/png;base64,<png>");

/** Compare `actual` with the golden file `<rel>.golden`, or write it when KIT_UPDATE=1. The suffix keeps the copies out of the skill checker's link scan. */
export function golden(rel: string, actual: string) {
  const file = path.join(corpus, `${rel}.golden`);
  if (updating) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, actual);
    return;
  }
  assert.ok(fs.existsSync(file), `no golden file ${rel}; run KIT_UPDATE=1 render test`);
  assert.equal(actual, fs.readFileSync(file, "utf8"), `${rel} differs from its golden copy`);
}

/** Width and height of a PNG, read from its header. */
export function pngSize(buf: Buffer) {
  assert.equal(buf.subarray(1, 4).toString("latin1"), "PNG");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** Edit one file of a scratch suite with a string replacement that must apply. */
export function edit(file: string, from: string | RegExp, to: string) {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(from, to);
  assert.notEqual(after, before, `the edit to ${file} did not apply`);
  fs.writeFileSync(file, after);
}
