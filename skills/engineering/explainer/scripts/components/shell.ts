// The page shell: head, theme tokens, the rail, the agent entry and the foot. Every page of every suite wears it.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { familyOf } from "../fonts.ts";
import type { Page, Suite } from "../ir.ts";
import { esc } from "./blocks.ts";

export const baseCss = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "base.css"), "utf8");

const fontStack = (stem: string, fallback: string) => `"${familyOf(stem)}",${fallback}`;

/** The palette as custom properties: light on :root, dark under the reader's system setting. No theme control. */
export function tokensCss(suite: Suite) {
  const { palette, type, pages } = suite.config;
  const vars = (t: Record<string, string>) => Object.entries(t).map(([k, v]) => `--${k}:${v};`).join("");
  const fonts =
    `--font-text:${fontStack(type.text, "Georgia,serif")};--font-head:${fontStack(type.heading, "system-ui,sans-serif")};` +
    `--font-mono:${fontStack(type.mono, "ui-monospace,monospace")};`;
  const threads = [...new Set(pages.flatMap((p) => (p.thread ? [p.thread] : [])))]
    .map((t) => `nav.rail a.t-${t},ol.read li.t-${t}{border-left-color:var(--th-${t})}.th-chip.th-${t}{background:var(--th-${t})}`)
    .join("");
  return `:root{${vars(palette.light)}${fonts}}\n@media (prefers-color-scheme: dark){:root{${vars(palette.dark)}}}\n${threads}`;
}

/** The rail label of a page: the hub keeps its title; the others carry their reading-order number. */
export function railLabel(suite: Suite, index: number) {
  const p = suite.config.pages[index];
  return suite.pages.length > 1 && index > 0 ? `${index} · ${p.title}` : p.title;
}

export interface Section {
  id: string;
  text: string;
  group?: string;
}

/** The rail: the suite's pages, then this page's sections in groups. A single page with fewer than 5 sections has none. */
export function rail(suite: Suite, page: Page, sections: Section[]) {
  const several = suite.pages.length > 1;
  if (!several && sections.length < 5) return "";
  const groups: string[] = [];
  if (several) {
    const links = suite.config.pages.map((p, i) => {
      const here = p.id === page.entry.id;
      const cls = [here && "here", p.thread && `t-${p.thread}`].filter(Boolean).join(" ");
      return `<a href="${p.id}.html"${here ? ' aria-current="page"' : ""}${cls ? ` class="${cls}"` : ""}>${esc(railLabel(suite, i))}</a>`;
    });
    groups.push(`<div><p class="rail-h">Read in this order</p>${links.join("")}</div>`);
  }
  const byGroup = new Map<string, Section[]>();
  for (const s of sections) {
    const g = s.group ?? "On this page";
    const list = byGroup.get(g) ?? [];
    list.push(s);
    byGroup.set(g, list);
  }
  for (const [g, list] of byGroup)
    groups.push(`<div><p class="rail-h">${esc(g)}</p>${list.map((s) => `<a href="#${s.id}">${esc(s.text)}</a>`).join("")}</div>`);
  const inner = groups.join("");
  return (
    `<nav class="rail" aria-label="Pages and sections"><details class="rail-fold"><summary>Pages and sections</summary>` +
    `<div class="rail-body">${inner}</div></details><div class="rail-body rail-wide">${inner}</div></nav>`
  );
}

const contextName = (page: Page) => `${page.entry.id}.context.md`;

export function agentEntry(page: Page) {
  const ctx = contextName(page);
  return (
    `<div class="agent-entry" aria-hidden="true">For an agent reading this page: the claims, sources, grades and record ids ` +
    `behind it are in <a href="${ctx}" tabindex="-1">${ctx}</a>, in this folder. Read it before you act on this page.</div>`
  );
}

export function forAgents(suite: Suite, page: Page) {
  const ctx = contextName(page);
  const readAt = suite.config.read_at ? ` ${suite.config.read_at}` : "";
  return (
    `<section class="for-agents"><details><summary>For agents</summary><p>The agent context for this page is ` +
    `<a href="${ctx}">${ctx}</a>: each claim with its source and grade, the record ids, and the figures' other states.${readAt}</p></details></section>` +
    `<footer>${readAt ? `${readAt.trim()} ` : ""}Agent context: <a href="${ctx}">${ctx}</a>.</footer>`
  );
}

export function shell(o: { suite: Suite; page: Page; title: string; body: string; css: string; railHtml: string }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="data:,">
<title>${esc(o.title)} · ${esc(o.suite.config.title)}</title>
<style>${o.css}</style></head>
<body>
${agentEntry(o.page)}
<div class="shell${o.railHtml ? "" : " no-rail"}">
${o.railHtml}
<main>
${o.body}
${forAgents(o.suite, o.page)}
</main>
</div>
</body></html>
`;
}
