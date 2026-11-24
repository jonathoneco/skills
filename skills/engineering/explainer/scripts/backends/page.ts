// The page target: one self-contained HTML file per page, with its agent context beside it.
// Marked blocks are rendered and spliced into the author's source by their offsets; every other byte, the islands,
// passes through as written. The kit edits only two things outside marked blocks: it gives each <h2> an id for the
// rail, and it puts the thread's chip in the first `.eyebrow`.
import * as B from "../components/blocks.ts";
import { baseCss, rail, type Section, shell, tokensCss } from "../components/shell.ts";
import { embedFonts } from "../fonts.ts";
import { attr, callForm, elements, isElement, parseFragment, plainText, siblingRun, walk } from "../frontends/html.ts";
import type { Element, Node, Page, Suite } from "../ir.ts";
import { pageInputs, pagesFor, type Target } from "../targets.ts";

interface Edit {
  start: number;
  end: number;
  text: string;
}

const loc = (el: Element) => {
  const l = el.sourceCodeLocation;
  if (!l) throw new Error(`<${el.tagName}> has no source location`);
  return l;
};

function apply(src: string, from: number, to: number, edits: Edit[]) {
  let out = "";
  let at = from;
  for (const e of [...edits].sort((a, b) => a.start - b.start)) {
    if (e.start < at) continue; // nested inside an edit already applied
    out += src.slice(at, e.start) + e.text;
    at = e.end;
  }
  return out + src.slice(at, to);
}

/** The text a reader sees in `nodes`, without state pills. */
export function textOf(nodes: Node[]): string {
  let out = "";
  for (const n of nodes) {
    if ("value" in n && n.nodeName === "#text") out += n.value;
    else if (isElement(n) && !(n.tagName === "x-call" || /\bpill\b/.test(attr(n, "class") ?? ""))) out += textOf(n.childNodes);
  }
  return out.replace(/\s+/g, " ").trim();
}

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "section";

/** Runs of sibling elements that render as one block: adjacent asks, and adjacent small-call rows. */
function runKind(el: Element) {
  if (el.tagName === "x-ask") return "ask";
  if (el.tagName === "x-call" && callForm(el) === "row") return "row";
  return undefined;
}

export interface Body {
  title: string;
  body: string;
  css: string;
  sections: Section[];
}

export function renderBody(suite: Suite, page: Page): Body {
  const src = page.source;
  const css: string[] = [];
  const sections: Section[] = [];
  const ids = new Set<string>();
  const pageMarks = new Set(page.cites.figures.flatMap((f) => suite.figures.get(f)?.marks ?? []));
  let keyPlaced = false;
  let chipPlaced = false;
  const thread = page.entry.thread;

  const inner = (el: Element) => {
    const l = loc(el);
    return apply(src, l.startTag?.endOffset ?? l.startOffset, l.endTag?.startOffset ?? l.endOffset, edits(el.childNodes));
  };
  const call = (el: Element) => {
    const c = suite.calls.get(attr(el, "id") ?? "");
    if (!c) throw new Error(`call ${attr(el, "id")} missing after load`);
    return c;
  };

  function render(el: Element): string {
    switch (el.tagName) {
      case "x-takeaway":
        return B.takeaway(inner(el));
      case "x-fact":
        return suite.facts.get(attr(el, "id") ?? "")?.value ?? "";
      case "x-detail":
        return B.detail(attr(el, "summary") ?? "", inner(el));
      case "x-caveat":
        return B.caveat(inner(el), attr(el, "heading"));
      case "x-pages":
        return B.pagesList(suite, page.entry.id);
      case "x-figure": {
        const fig = suite.figures.get(attr(el, "id") ?? "");
        if (!fig) throw new Error(`figure ${attr(el, "id")} missing after load`);
        css.push(B.figureSwitchCss(fig));
        let key: string | undefined;
        if (!keyPlaced && fig.marks.length) {
          keyPlaced = true;
          key = B.key(suite.config.key.filter((k) => pageMarks.has(k.mark)));
        }
        return B.figure(fig, { cls: attr(el, "class"), key });
      }
      case "x-call": {
        const c = call(el);
        const form = callForm(el);
        if (form === "pill") return B.callPill(c, textOf(el.childNodes));
        if (form === "row") return B.callRows([{ call: c, where: attr(el, "where") }], suite.calls);
        const cap = elements(el.childNodes).find((e) => e.tagName === "figcaption");
        const l = loc(el);
        const from = l.startTag?.endOffset ?? l.startOffset;
        const to = l.endTag?.startOffset ?? l.endOffset;
        const cut = cap ? [{ start: loc(cap).startOffset, end: loc(cap).endOffset, text: "" }] : [];
        const framing = apply(src, from, to, [...edits(el.childNodes), ...cut]);
        const caption = cap ? apply(src, loc(cap).startOffset, loc(cap).endOffset, edits(cap.childNodes)) : "";
        return B.callCard(c, suite.calls, framing, caption);
      }
      default:
        throw new Error(`no renderer for <${el.tagName}>`);
    }
  }

  function edits(nodes: Node[]): Edit[] {
    const out: Edit[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (!isElement(n)) continue;
      const kind = runKind(n);
      if (kind) {
        const run = siblingRun(nodes, i, (m) => runKind(m) === kind);
        i = nodes.indexOf(run[run.length - 1]);
        const text =
          kind === "ask"
            ? B.asks(run.map(inner), attr(run[0], "heading"))
            : B.callRows(run.map((e) => ({ call: call(e), where: attr(e, "where") })), suite.calls);
        out.push({ start: loc(run[0]).startOffset, end: loc(run[run.length - 1]).endOffset, text });
        continue;
      }
      if (n.tagName.startsWith("x-")) {
        out.push({ start: loc(n).startOffset, end: loc(n).endOffset, text: render(n) });
        continue;
      }
      if (n.tagName === "h2" && n.sourceCodeLocation) {
        let id = attr(n, "id");
        if (!id) {
          id = slug(textOf(n.childNodes));
          while (ids.has(id)) id += "-2";
          const at = loc(n).startOffset + 3;
          out.push({ start: at, end: at, text: ` id="${id}"` });
        }
        ids.add(id);
        sections.push({ id, text: textOf(n.childNodes), group: attr(n, "data-group") });
      }
      if (!chipPlaced && thread && n.tagName === "p" && /\beyebrow\b/.test(attr(n, "class") ?? "")) {
        chipPlaced = true;
        const at = loc(n).startTag?.endOffset ?? loc(n).startOffset;
        out.push({ start: at, end: at, text: `<span class="th-chip th-${thread}" aria-hidden="true"></span>` });
      }
      out.push(...edits("content" in n && n.content ? n.content.childNodes : n.childNodes));
    }
    return out;
  }

  const body = apply(src, 0, src.length, edits(page.tree.childNodes)).trim();
  const h1 = [...walk(page.tree.childNodes)].find((e) => e.tagName === "h1");
  return { title: h1 ? textOf(h1.childNodes) : page.entry.title, body, css: css.filter(Boolean).join("\n"), sections };
}

const MONO = new Set(["code", "pre", "kbd", "samp"]);
const ITALIC = new Set(["i", "em", "cite", "var", "dfn"]);

/** The characters a page draws in each face, read from the finished HTML. */
export function charsOf(html: string) {
  const tree = parseFragment(html);
  let text = "";
  let mono = "";
  let italic = /font-style\s*:\s*italic/.test(html);
  const visit = (nodes: Node[], inMono: boolean) => {
    for (const n of nodes) {
      if (n.nodeName === "#text" && "value" in n) {
        text += n.value;
        if (inMono) mono += n.value;
      } else if (isElement(n)) {
        if (n.tagName === "style" || n.tagName === "script") continue;
        if (ITALIC.has(n.tagName)) italic = true;
        const m = inMono || MONO.has(n.tagName) || /\bmono\b/.test(attr(n, "class") ?? "");
        visit("content" in n && n.content ? n.content.childNodes : n.childNodes, m);
      }
    }
  };
  visit(tree.childNodes, false);
  return { text, mono, italic };
}

/** The full page: shell, tokens, kit CSS, the suite's drawing styles, and fonts cut to the page's characters. */
export async function renderPage(suite: Suite, page: Page) {
  const b = renderBody(suite, page);
  const railHtml = rail(suite, page, b.sections);
  const css = [tokensCss(suite), baseCss, suite.figuresCss, b.css].filter(Boolean).join("\n");
  const draft = shell({ suite, page, title: b.title, body: b.body, css: "", railHtml });
  const fonts = await embedFonts(suite.config.type, charsOf(draft + (css.match(/content:\s*"[^"]*"/g)?.join("") ?? "")));
  const html = shell({ suite, page, title: b.title, body: b.body, css: `${fonts}\n${css}`, railHtml });
  return { html, context: contextMd(suite, page) };
}

const plain = plainText;

/** The author's agent context, plus the text of each figure's other states and the records the page cites. */
export function contextMd(suite: Suite, page: Page) {
  const parts = [page.context.trimEnd()];
  const states = page.cites.figures.map((id) => suite.figures.get(id)).filter((f) => f && (f.still || f.states.length));
  if (states.length) {
    parts.push("## Figure states (added by the kit)");
    for (const f of states)
      if (f)
        parts.push(
          [`### ${f.id}: ${plain(f.caption)}`, ...(f.still ? [`- Still frame: ${plain(f.still)}`] : []), ...f.states.map((s) => `- ${s.name}: ${plain(s.text)}`)].join("\n"),
        );
  }
  const calls = page.cites.calls.map((id) => suite.calls.get(id)).filter((c) => c !== undefined);
  const facts = page.cites.facts.map((id) => suite.facts.get(id)).filter((f) => f !== undefined);
  if (calls.length || facts.length) parts.push("## Records this page cites (added by the kit)");
  if (calls.length)
    parts.push(
      calls
        .map((c) => {
          const ruling = c.state === "settled" ? ` Ruling, ${c.ruling.date}, ${c.ruling.by}: ${plain(c.ruling.text)}` : "";
          return `- Call \`${c.id}\` (${plain(B.stateWords(c))}): ${plain(c.question)} Pick: ${plain(c.pick.label)}.${ruling}`;
        })
        .join("\n"),
    );
  if (facts.length)
    parts.push(
      ["| Fact | Value | Source | Grade |", "|---|---|---|---|", ...facts.map((f) => `| \`${f.id}\` | ${plain(f.value)} | ${plain(f.source)} | ${f.grade} |`)].join(
        "\n",
      ),
    );
  return `${parts.join("\n\n")}\n`;
}

export const target: Target = {
  units: (suite, opts) =>
    pagesFor(suite, opts).map((page) => ({
      id: page.entry.id,
      inputs: pageInputs(suite, page),
      build: async () => {
        const r = await renderPage(suite, page);
        return { [`${page.entry.id}.html`]: r.html, [`${page.entry.id}.context.md`]: r.context };
      },
    })),
};
