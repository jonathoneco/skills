// Turn a page's HTML into Markdown, for the `notion` target (Notion's enhanced markdown) and the `cold` target
// (plain Markdown, the cold reader's copy). Marked blocks map to their blocks; prose, lists, tables and code convert;
// anything visual, such as a drawing, a control or an image, becomes its still frame as a picture.
import { pickLine, pillText, rulingLine } from "../components/blocks.ts";
import { attr, callForm, elements, isElement, parseFragment, siblingRun } from "../frontends/html.ts";
import type { Call, Element, Node, Page, Suite } from "../ir.ts";

export type Flavour = "notion" | "plain";

/** A figure or island to shoot as its still frame. */
export interface Still {
  key: string;
  /** Path of the picture, relative to the Markdown file. */
  file: string;
  /** HTML that draws it: a figure's drawing, or the island's own source. */
  html: string;
  alt: string;
  caption: string;
  /** Drawn at the wide column's width rather than the text column's. */
  wide: boolean;
}

const VISUAL = new Set(["svg", "img", "canvas", "video", "iframe", "button", "input", "select", "textarea", "picture", "object", "embed"]);
const DROP = new Set(["script", "style", "template", "noscript"]);
const COLOURS: Record<string, string> = { open: "yellow", waiting: "blue", settled: "green" };
const STATUS: Record<string, string> = { critical: "red", warning: "orange", good: "green", waiting: "blue" };

const kids = (el: Element) => ("content" in el && el.content ? el.content.childNodes : el.childNodes);
const hasVisual = (el: Element): boolean => VISUAL.has(el.tagName) || elements(kids(el)).some(hasVisual);
const cls = (el: Element) => attr(el, "class") ?? "";

export function toMarkdown(suite: Suite, page: Page, flavour: Flavour) {
  const notion = flavour === "notion";
  const stills: Still[] = [];
  const marks: string[] = [];
  const id = page.entry.id;
  const src = page.source;

  const escape = (s: string) => (notion ? s.replace(/([\\*~`$[\]<>{}|^])/g, "\\$1") : s);
  const sliceOf = (el: Element) => {
    const l = el.sourceCodeLocation;
    return l ? src.slice(l.startOffset, l.endOffset) : "";
  };
  const html = (s: string) => parseFragment(s).childNodes;
  const callOf = (el: Element): Call => {
    const c = suite.calls.get(attr(el, "id") ?? "");
    if (!c) throw new Error(`call ${attr(el, "id")} missing after load`);
    return c;
  };
  const pageLink = (target: string) => `kit:page/${target}`;

  const pillMd = (state: string, text: string) => (notion ? `<span color="${COLOURS[state]}">**${text}**</span>` : `[${text}]`);
  const pill = (call: Call, where?: string) => pillMd(call.state, escape(pillText(call, where)));

  function inline(nodes: Node[]): string {
    let out = "";
    for (const n of nodes) {
      if (n.nodeName === "#text" && "value" in n) out += escape(n.value.replace(/\s+/g, " "));
      if (!isElement(n) || DROP.has(n.tagName)) continue;
      // A status class colours its text in Notion, as the page colours it.
      const status = notion && !/\bpill\b/.test(cls(n)) ? Object.keys(STATUS).find((c) => new RegExp(`\\b${c}\\b`).test(cls(n))) : undefined;
      if (status) out += `<span color="${STATUS[status]}">`;
      const inner = () => inline(kids(n));
      const wrap = (m: string) => {
        const t = inner();
        const lead = t.match(/^\s*/)?.[0] ?? "";
        const trail = t.match(/\s*$/)?.[0] ?? "";
        return t.trim() ? `${lead}${m}${t.trim()}${m}${trail}` : t;
      };
      switch (n.tagName) {
        case "b":
        case "strong":
          out += wrap("**");
          break;
        case "i":
        case "em":
        case "cite":
          out += wrap("*");
          break;
        case "s":
        case "del":
          out += wrap("~~");
          break;
        case "code":
        case "kbd":
        case "samp":
          out += `\`${textOf(kids(n))}\``;
          break;
        case "br":
          out += notion ? "<br>" : "\n";
          break;
        case "a": {
          const href = attr(n, "href") ?? "";
          const target = href.match(/^([a-z0-9-]+)\.html(#.*)?$/)?.[1];
          const t = inner().trim();
          if (target && suite.pages.some((p) => p.entry.id === target)) out += notion ? `[${t}](${pageLink(target)})` : t;
          else if (/\.context\.md$/.test(href)) out += t;
          else out += href && !href.startsWith("#") ? `[${t}](${href})` : t;
          break;
        }
        case "x-fact":
          out += inline(html(suite.facts.get(attr(n, "id") ?? "")?.value ?? ""));
          break;
        case "x-call":
          out += pill(callOf(n), textOf(kids(n)));
          break;
        case "span":
          if (/\bpill\b/.test(cls(n))) {
            out += pillMd(["open", "waiting", "settled"].find((s) => cls(n).includes(s)) ?? "open", inner().trim());
          } else if (/\bth-chip\b/.test(cls(n))) break;
          else out += inner();
          break;
        default:
          if (VISUAL.has(n.tagName)) break;
          out += inner();
      }
      if (status) out += "</span>";
    }
    return out;
  }

  const textOf = (nodes: Node[]): string =>
    nodes.map((n) => (n.nodeName === "#text" && "value" in n ? n.value : isElement(n) && !DROP.has(n.tagName) ? textOf(kids(n)) : "")).join("");
  const line = (nodes: Node[]) => inline(nodes).replace(/[ \t]+/g, " ").trim();
  const indent = (block: string) => block.split("\n").map((l) => `\t${l}`).join("\n");
  const callout = (icon: string, colour: string, body: string[]) =>
    notion ? [`<callout icon="${icon}" color="${colour}_bg">`, ...body.map(indent), "</callout>"].join("\n") : body.join("\n\n");
  const gray = (s: string) => (notion ? `<span color="gray">${s}</span>` : s);

  function table(rows: { cells: string[]; head: boolean }[]) {
    if (!rows.length) return "";
    if (notion) {
      const tr = rows.map((r) => `<tr>${r.cells.map((c) => `<td>${c.replace(/\\\|/g, "/")}</td>`).join("")}</tr>`);
      return [`<table header-row="${rows[0].head}">`, ...tr, "</table>"].join("\n");
    }
    const width = Math.max(...rows.map((r) => r.cells.length));
    const fmt = (cells: string[]) => `| ${[...cells, ...Array(width - cells.length).fill("")].map((c) => c.replace(/\|/g, "/").replace(/\n/g, " ")).join(" | ")} |`;
    const [first, ...rest] = rows[0].head ? rows : [{ cells: Array(width).fill(""), head: true }, ...rows];
    return [fmt(first.cells), `|${" --- |".repeat(width)}`, ...rest.map((r) => fmt(r.cells))].join("\n");
  }

  function htmlTable(el: Element) {
    const rows = [...walkRows(el)].map((tr) => ({
      cells: elements(kids(tr)).filter((c) => c.tagName === "td" || c.tagName === "th").map((c) => line(kids(c))),
      head: elements(kids(tr)).every((c) => c.tagName === "th"),
    }));
    return table(rows);
  }
  function* walkRows(el: Element): Generator<Element> {
    for (const c of elements(kids(el))) {
      if (c.tagName === "tr") yield c;
      else if (["thead", "tbody", "tfoot"].includes(c.tagName)) yield* walkRows(c);
    }
  }

  function image(s: Omit<Still, "file">): string[] {
    const file = `stills/${id}-${s.key}.png`;
    stills.push({ ...s, file });
    const caption = s.caption ? line(html(s.caption)) : "";
    if (!caption) marks.push(`${file}: write a caption for this picture; its source has none`);
    if (notion) return [`![${escape(s.alt)}](${file})`, ...(caption ? [caption] : [`⟦kit: write a caption for ${file}⟧`])];
    return [`[Figure${caption ? `: ${caption}` : ""}]`, `Text alternative: ${s.alt}`, `Still frame: ${file}`];
  }

  let islandCount = 0;
  function island(el: Element): string[] {
    const cap = elements(kids(el)).find((c) => c.tagName === "figcaption");
    const capHtml = cap ? sliceOf(cap).replace(/^<figcaption[^>]*>|<\/figcaption>$/g, "") : "";
    return image({ key: `island-${++islandCount}`, html: sliceOf(el), wide: /\bwide\b/.test(cls(el)), alt: attr(el, "data-still") ?? attr(el, "aria-label") ?? textOf(kids(el)).replace(/\s+/g, " ").trim().slice(0, 200), caption: capHtml });
  }

  function callBlocks(el: Element): string[] {
    const call = callOf(el);
    const cap = elements(kids(el)).find((c) => c.tagName === "figcaption");
    const body = blocks(kids(el).filter((n) => n !== cap));
    const cells = call.options.some((o) => o.buys || o.changes || o.cost);
    const rows = [
      { cells: cells ? ["Option", "Buys", "What changes, and for whom", "Cost"] : ["Option", "What it means"], head: true },
      ...call.options.map((o) => ({
        cells: (cells ? [o.label, o.buys ?? "", o.changes ?? o.text ?? "", o.cost ?? ""] : [o.label, o.text ?? ""]).map((c) => line(html(c))),
        head: false,
      })),
    ];
    const ruling = rulingLine(call, suite.calls);
    const pick = [line(html(pickLine(call))), ...(ruling ? [line(html(ruling))] : [])];
    return [...body, table(rows), notion ? callout("💡", "yellow", pick) : pick.join("\n\n"), ...(cap ? [line(kids(cap))] : [])];
  }

  function rowsTable(els: Element[]) {
    const rows = [
      { cells: ["Call", "State", "Options, and what each means", "Pick"], head: true },
      ...els.map((el) => {
        const c = callOf(el);
        const opts = c.options.map((o) => `<b>${o.label}:</b> ${o.text ?? o.changes ?? o.buys ?? ""}`).join(" ");
        const ruling = rulingLine(c, suite.calls);
        return {
          cells: [
            line(html(`<b>${c.label ?? c.id} ·</b> ${c.question}`)),
            pill(c, attr(el, "where")),
            line(html(`${opts}${ruling ? ` ${ruling}` : ""}`)),
            line(html([`${c.pick.label}.`, c.pick.why, c.pick.reverse].filter(Boolean).join(" "))),
          ],
          head: false,
        };
      }),
    ];
    return table(rows);
  }

  function blocks(nodes: Node[]): string[] {
    const out: string[] = [];
    let lastTable = false;
    const push = (...bs: string[]) => {
      for (const b of bs) {
        if (!b.trim()) continue;
        const isTable = b.startsWith("<table") || b.startsWith("|");
        if (notion && isTable && lastTable) out.push("---");
        out.push(b);
        lastTable = isTable;
      }
    };
    let inlineRun: Node[] = [];
    const flush = () => {
      const t = line(inlineRun);
      if (t) push(t);
      inlineRun = [];
    };
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (!isElement(n)) {
        if (n.nodeName === "#text") inlineRun.push(n);
        continue;
      }
      const tag = n.tagName;
      const BLOCKS = /^(p|h[1-6]|ul|ol|table|pre|blockquote|hr|details|figure|figcaption|div|section|aside|article|header|footer|main|nav|x-.*)$/;
      if (!BLOCKS.test(tag) || tag === "x-fact" || (tag === "x-call" && callForm(n) === "pill")) {
        inlineRun.push(n);
        continue;
      }
      flush();
      if (DROP.has(tag)) continue;
      switch (tag) {
        case "p": {
          const t = line(kids(n));
          push(/\b(eyebrow|muted)\b/.test(cls(n)) ? gray(t) : t);
          break;
        }
        case "h1":
          push(`# ${line(kids(n))}`);
          break;
        case "h2":
          push(`## ${line(kids(n))}`);
          break;
        case "h3":
          push(`### ${line(kids(n))}`);
          break;
        case "h4":
        case "h5":
        case "h6":
          push(`**${line(kids(n))}**`);
          break;
        case "ul":
        case "ol":
          push(list(n));
          break;
        case "table":
          push(htmlTable(n));
          break;
        case "pre":
          push(`\`\`\`\n${textOf(kids(n)).replace(/\n$/, "")}\n\`\`\``);
          break;
        case "blockquote":
          push(blocks(kids(n)).map((b) => `> ${b}`).join("\n"));
          break;
        case "hr":
          push("---");
          break;
        case "details": {
          const sum = elements(kids(n)).find((c) => c.tagName === "summary");
          push(toggle(sum ? line(kids(sum)) : "Details", blocks(kids(n).filter((c) => c !== sum))));
          break;
        }
        case "x-takeaway":
          push(notion ? callout("🧭", suite.config.notion.accent, blocks(kids(n))) : blocks(kids(n)).join("\n\n"));
          break;
        case "x-ask": {
          const run = siblingRun(nodes, i, (m) => m.tagName === "x-ask");
          i = nodes.indexOf(run[run.length - 1]);
          push(`### ${escape(attr(n, "heading") ?? "What you decide after reading")}`, run.map((a, k) => `${k + 1}. ${line(kids(a))}`).join("\n"));
          break;
        }
        case "x-call": {
          if (callForm(n) === "row") {
            const run = siblingRun(nodes, i, (m) => m.tagName === "x-call" && callForm(m) === "row");
            i = nodes.indexOf(run[run.length - 1]);
            push(rowsTable(run));
          } else push(...callBlocks(n));
          break;
        }
        case "x-figure": {
          const fig = suite.figures.get(attr(n, "id") ?? "");
          if (!fig) break;
          const d = fig.drawing;
          const drawing = d.form === "svg" ? d.svg : d.form === "html" ? d.html : `<div class="kit-wide">${d.wide}</div><div class="kit-narrow">${d.narrow}</div>`;
          push(...image({ key: `figure-${fig.id}`, html: drawing, wide: /\bwide\b/.test(cls(n)), alt: fig.alt, caption: [`<b>${fig.caption}</b>`, fig.note].filter(Boolean).join(" ") }));
          break;
        }
        case "x-detail":
          push(toggle(escape(attr(n, "summary") ?? "Details"), blocks(kids(n))));
          break;
        case "x-caveat": {
          const head = attr(n, "heading") ?? "Caveat";
          const body = blocks(kids(n));
          push(notion ? callout("⚠️", "red", [`**${escape(head)}.** ${body[0] ?? ""}`, ...body.slice(1)]) : [`**${head}.** ${body[0] ?? ""}`, ...body.slice(1)].join("\n\n"));
          break;
        }
        case "x-pages":
          push(
            suite.config.pages
              .filter((p) => p.id !== id)
              .map((p, k) => {
                const lead = `${k + 1}. **${escape(p.title)}.** ${[p.question, p.holds].filter(Boolean).map((t) => line(html(t ?? ""))).join(" ")}`;
                return notion ? `${lead} → <mention-page url="${pageLink(p.id)}"/>` : lead;
              })
              .join("\n"),
          );
          break;
        default:
          // figure, div, section and the rest: a visual island becomes its still frame; anything else converts.
          if (hasVisual(n)) push(...island(n));
          else if (/\bcase\b/.test(cls(n))) push(notion ? callout("📖", "gray", blocks(kids(n))) : blocks(kids(n)).join("\n\n"));
          else push(...blocks(kids(n)));
      }
    }
    flush();
    return out;
  }

  function list(el: Element, depth = 0): string {
    const ordered = el.tagName === "ol";
    return elements(kids(el))
      .filter((li) => li.tagName === "li")
      .map((li, k) => {
        const sub = elements(kids(li)).filter((c) => c.tagName === "ul" || c.tagName === "ol");
        const head = `${"\t".repeat(depth)}${ordered ? `${k + 1}.` : "-"} ${line(kids(li).filter((c) => !sub.includes(c as Element)))}`;
        return [head, ...sub.map((s) => list(s, depth + 1))].join("\n");
      })
      .join("\n");
  }

  function toggle(summary: string, body: string[]) {
    return notion ? ["<details>", `<summary>${summary}</summary>`, ...body.map(indent), "</details>"].join("\n") : [`**${summary}**`, ...body].join("\n\n");
  }

  const body = blocks(page.tree.childNodes);
  if (notion) {
    const readAt = suite.config.read_at ? `${line(html(suite.config.read_at))} ` : "";
    body.push(gray(`${readAt}For your agent: the sources, record ids and grades behind this page are in the child page "Agent context: ${escape(page.entry.title)}", at the foot of this page.`));
  }
  return { md: `${body.join(notion ? "\n" : "\n\n")}\n`, stills, marks };
}
