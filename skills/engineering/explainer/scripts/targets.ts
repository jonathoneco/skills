// What a backend hands render.ts: units of work, each with the inputs its content hash covers.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { Page, Suite } from "./ir.ts";

export type Files = Record<string, string | Uint8Array>;

export interface Unit {
  id: string;
  /** What the unit's output depends on, beyond the kit and the suite keys every unit reads. */
  inputs: string;
  build: () => Promise<Files>;
}

export interface Opts {
  out: string;
  only?: string;
}

export interface Target {
  units: (suite: Suite, opts: Opts) => Unit[];
  /** Runs after the units, over the whole target folder, such as a manifest or a joined file. */
  finish?: (suite: Suite, opts: Opts) => Promise<Files>;
}

export const sha = (...parts: (string | Uint8Array)[]) => {
  const h = createHash("sha256");
  for (const p of parts) h.update(p).update("\0");
  return h.digest("hex").slice(0, 20);
};

/** The pages a run covers: all of them, or the one `--only` names. */
export const pagesFor = (suite: Suite, opts: Opts) => suite.pages.filter((p) => !opts.only || p.entry.id === opts.only);

/** A page's own inputs: its source and context, its figures' files, and the records it cites. */
export function pageInputs(suite: Suite, page: Page) {
  const figs = page.cites.figures.flatMap((id) => suite.figures.get(id)?.files ?? []);
  const calls = page.cites.calls.flatMap((id) => {
    const c = suite.calls.get(id);
    return c?.supersedes ? [c, suite.calls.get(c.supersedes)] : [c];
  });
  const facts = page.cites.facts.map((id) => suite.facts.get(id));
  return JSON.stringify({
    source: page.source,
    context: page.context,
    figures: figs.map((f) => [path.basename(path.dirname(f)), path.basename(f), sha(fs.readFileSync(f))]),
    figuresCss: suite.figuresCss,
    calls,
    facts,
  });
}
