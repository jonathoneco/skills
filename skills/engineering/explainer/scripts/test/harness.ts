// A small test runner that works the same on Node, Bun and Deno, so `render test` runs under whichever runtime the
// launcher picked. Each test file registers tests with `test()`; KIT_UPDATE=1 rewrites the golden files.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const tests: { name: string; fn: () => Promise<void> | void }[] = [];
export const test = (name: string, fn: () => Promise<void> | void) => tests.push({ name, fn });
export const here = path.dirname(fileURLToPath(import.meta.url));
export const updating = process.env.KIT_UPDATE === "1";

export async function runTests(filter?: string): Promise<number> {
  for (const f of fs.readdirSync(here).filter((f) => f.endsWith(".test.ts")).sort()) await import(path.join(here, f));
  const picked = tests.filter((t) => !filter || t.name.includes(filter));
  let failed = 0;
  for (const t of picked) {
    const t0 = performance.now();
    try {
      await t.fn();
      console.log(`ok   ${t.name} (${Math.round(performance.now() - t0)} ms)`);
    } catch (e) {
      failed++;
      console.log(`FAIL ${t.name}\n${String(e instanceof Error ? (e.stack ?? e.message) : e).replace(/^/gm, "     ")}`);
    }
  }
  const { closeBrowser } = await import("../browser.ts");
  await closeBrowser();
  console.log(`${picked.length - failed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}
