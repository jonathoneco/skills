// The cold target: the cold reader's copy (cold-read.md). The pages' text in reading order, each figure as its
// caption, its text alternative and a picture of its still frame, the tables kept, and no fonts, styles or scripts.
import { pageInputs, pagesFor, type Target } from "../targets.ts";
import { toMarkdown } from "./markdown.ts";
import { renderStills } from "./stills.ts";
import fs from "node:fs";
import path from "node:path";

export const target: Target = {
  units: (suite, opts) =>
    pagesFor(suite, opts).map((page) => ({
      id: page.entry.id,
      inputs: pageInputs(suite, page),
      build: async () => {
        const { md, stills } = toMarkdown(suite, page, "plain");
        return { [`${page.entry.id}.md`]: md, ...(await renderStills(suite, opts.out, stills)) };
      },
    })),
  finish: async (suite, opts) => {
    const dir = path.join(opts.out, "cold");
    // Every page rendered so far, in reading order, so an --only run keeps the other pages in cold.md.
    const parts = suite.pages
      .filter((p) => fs.existsSync(path.join(dir, `${p.entry.id}.md`)))
      .map((p) => `<!-- page: ${p.entry.id}.html -->\n\n${fs.readFileSync(path.join(dir, `${p.entry.id}.md`), "utf8").trim()}\n`);
    return { "cold.md": parts.join("\n---\n\n") };
  },
};
