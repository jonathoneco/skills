// The brief target: one fixed one-pager for the suite. The hub's takeaway and asks, the first figure's still frame,
// and every call still open or waiting. Each place that still needs text an agent writes carries a ⟦kit: …⟧ mark.
import * as B from "../components/blocks.ts";
import { baseCss, tokensCss } from "../components/shell.ts";
import { embedFonts } from "../fonts.ts";
import { parseFragment, walk, attr } from "../frontends/html.ts";
import type { Suite } from "../ir.ts";
import { pageInputs, type Target } from "../targets.ts";
import { toMarkdown } from "./markdown.ts";
import { charsOf, renderBody } from "./page.ts";
import { renderStills } from "./stills.ts";

const CSS = ".brief main{display:block;max-width:46rem;margin:0 auto;padding:2rem 1.2rem 3rem}.brief main>*+*{margin-top:1rem}" +
  ".brief img{display:block;max-width:100%;height:auto}.kit-mark{background:var(--codebg);border:1px dashed var(--warning);border-radius:4px;padding:.3rem .6rem;font:600 .9rem var(--font-head);color:var(--warning)}" +
  "@media print{.brief main{padding:0}}";

const mark = (text: string) => `<p class="kit-mark">⟦kit: ${B.esc(text)}⟧</p>`;

/** Every block of the hub's rendered body whose outer tag carries `cls`. */
function pick(body: string, test: (cls: string, tag: string) => boolean) {
  const tree = parseFragment(body);
  return [...walk(tree.childNodes)]
    .filter((e) => test(attr(e, "class") ?? "", e.tagName))
    .map((e) => body.slice(e.sourceCodeLocation?.startOffset ?? 0, e.sourceCodeLocation?.endOffset ?? 0));
}

export async function renderBrief(suite: Suite, out: string) {
  const hub = suite.pages[0];
  const body = renderBody(suite, hub);
  const take = pick(body.body, (c) => /\btake\b/.test(c))[0] ?? mark("write the takeaway: the hub has no <x-takeaway>");
  const asks = pick(body.body, (c) => /\basks\b/.test(c))[0] ?? mark("write the asks: the hub has no <x-ask>");
  const firstPage = suite.pages.find((p) => p.cites.figures.length);
  let figure = mark("add a figure: no page has an <x-figure>");
  const files: Record<string, string | Uint8Array> = {};
  if (firstPage) {
    const still = toMarkdown(suite, firstPage, "plain").stills.find((s) => s.key === `figure-${firstPage.cites.figures[0]}`);
    if (still) {
      const png = (await renderStills(suite, out, [still]))[still.file];
      figure =
        `<figure><img src="data:image/png;base64,${Buffer.from(png).toString("base64")}" alt="${B.esc(still.alt)}" width="720">` +
        `<figcaption>${still.caption}</figcaption></figure>`;
    }
  }
  const open = [...suite.calls.values()].filter((c) => c.state !== "settled");
  // One row per call: the question, its state and the pick. The options stay on the full pages.
  const rows = open.map((c) => `<tr><td><b>${c.label ?? c.id} ·</b> ${c.question}</td><td>${B.callPill(c)}</td><td>${c.pick.label}</td></tr>`);
  const calls = open.length
    ? `<h2>Open calls</h2><div class="scroll"><table class="calls"><thead><tr><th>Call</th><th>State</th><th>Pick</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`
    : "<h2>Open calls</h2><p>None: every call is settled.</p>";
  const main = [
    `<p class="eyebrow">Brief · ${B.esc(suite.config.title)}</p>`,
    `<h1>${B.esc(body.title)}</h1>`,
    take,
    mark(`write one sentence for ${suite.config.reader}: why this needs them now`),
    asks,
    figure,
    calls,
    mark("write what happens once the calls are answered, and by when"),
    `<footer>${suite.config.read_at ? `${suite.config.read_at} ` : ""}The full explainer: <a href="../page/${hub.entry.id}.html">${B.esc(suite.config.title)}</a>.</footer>`,
  ].join("\n");
  const css = [tokensCss(suite), baseCss, CSS].join("\n");
  const fonts = await embedFonts(suite.config.type, charsOf(main));
  const html =
    `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<link rel="icon" href="data:,"><title>Brief · ${B.esc(suite.config.title)}</title><style>${fonts}\n${css}</style></head>` +
    `<body class="brief"><main>\n${main}\n</main></body></html>\n`;
  files["brief.html"] = html;
  return files;
}

export const target: Target = {
  units: (suite, opts) => [
    {
      id: "brief",
      inputs: JSON.stringify([pageInputs(suite, suite.pages[0]), [...suite.calls.values()], suite.pages.map((p) => p.cites.figures[0] && pageInputs(suite, p))]),
      build: () => renderBrief(suite, opts.out),
    },
  ],
};
