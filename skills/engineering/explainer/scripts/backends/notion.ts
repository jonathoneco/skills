// The notion target: one Notion-markdown file per page, its agent context as a child page's source, and each
// figure's or island's still frame as a picture to upload. `pages.json` lists every upload and every place left to
// the agent: links to other pages (`kit:page/<id>`) and pictures with no caption.
import fs from "node:fs";
import path from "node:path";
import { pageInputs, pagesFor, type Target } from "../targets.ts";
import { toMarkdown } from "./markdown.ts";
import { contextMd, renderBody } from "./page.ts";
import { renderStills } from "./stills.ts";

export const target: Target = {
  units: (suite, opts) =>
    pagesFor(suite, opts).map((page) => ({
      id: page.entry.id,
      inputs: pageInputs(suite, page),
      build: async () => {
        const id = page.entry.id;
        const { md, stills, marks } = toMarkdown(suite, page, "notion");
        // This page's entry in pages.json; finish joins the entries, so a page kept from an earlier run still counts.
        const entry = {
          id,
          title: page.index === 0 && suite.pages.length > 1 ? suite.config.title : page.entry.title,
          headline: renderBody(suite, page).title,
          markdown: `${id}.md`,
          agentContext: { title: `Agent context: ${page.entry.title}`, markdown: `${id}.agent-context.md` },
          uploads: stills.map((s) => ({ file: s.file, alt: s.alt })),
          links: [...new Set([...md.matchAll(/kit:page\/([a-z0-9-]+)/g)].map((m) => m[1]))],
          marks,
        };
        return {
          [`${id}.md`]: md,
          [`${id}.agent-context.md`]: contextMd(suite, page),
          [`.entries/${id}.json`]: JSON.stringify(entry),
          ...(await renderStills(suite, opts.out, stills)),
        };
      },
    })),
  finish: async (suite, opts) => {
    const dir = path.join(opts.out, "notion", ".entries");
    const pages = suite.pages
      .map((p) => path.join(dir, `${p.entry.id}.json`))
      .filter((f) => fs.existsSync(f))
      .map((f) => JSON.parse(fs.readFileSync(f, "utf8")));
    return { "pages.json": `${JSON.stringify({ suite: suite.config.title, pages }, null, 2)}\n` };
  },
};
