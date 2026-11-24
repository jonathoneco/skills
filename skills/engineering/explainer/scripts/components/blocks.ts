// The marked blocks, rendered for the page target. Each function returns HTML that reads only the kit's tokens and
// the classes in base.css. Text fields from the YAML files are inline HTML, so `<code>` and `<b>` work there.
import type { Call, Figure, KeyEntry, Suite } from "../ir.ts";

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const join = (...parts: (string | undefined | false)[]) => parts.filter(Boolean).join(" ");

const BLOCK = /<(p|ul|ol|div|table|figure|pre|h[1-6]|blockquote|details)\b/i;
/** Wrap inline content in a paragraph; leave block content as it is. */
export const asBlock = (html: string) => (BLOCK.test(html) ? html : `<p>${html.trim()}</p>`);

export function takeaway(inner: string) {
  return `<div class="take">${asBlock(inner)}</div>`;
}

export function asks(items: string[], heading = "What you decide after reading") {
  return `<div class="asks"><h3>${esc(heading)}</h3><ol>${items.map((i) => `<li>${i.trim()}</li>`).join("")}</ol></div>`;
}

/** The words of a call's state: "open", "waiting on the caterer", "settled by Sam". */
export function stateWords(call: Call) {
  if (call.state === "waiting") return `waiting on ${call.waits_on}`;
  if (call.state === "settled") return `settled by ${call.ruling.by}`;
  return "open";
}

/** A pill's words: the state, then where it stands, such as "open · Inbox Q3". The place defaults to who it waits on or who ruled. */
export function pillText(call: Call, where?: string) {
  const place = where?.trim() || (call.state === "waiting" ? call.waits_on : call.state === "settled" ? call.ruling.by : "");
  return join(call.state, place && `· ${place}`);
}

/** A state pill in its status colour. */
export const callPill = (call: Call, where?: string) => `<span class="pill ${call.state}">${pillText(call, where)}</span>`;

const label = (call: Call) => call.label ?? call.id;
const hasCells = (call: Call) => call.options.some((o) => o.buys || o.changes || o.cost);

function optionsTable(call: Call) {
  if (hasCells(call)) {
    const rows = call.options.map((o) => `<tr><td>${o.label}</td><td>${o.buys ?? ""}</td><td>${o.changes ?? o.text ?? ""}</td><td>${o.cost ?? ""}</td></tr>`);
    return `<div class="scroll"><table><thead><tr><th>Option</th><th>Buys</th><th>What changes, and for whom</th><th>Cost</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
  }
  const rows = call.options.map((o) => `<tr><td>${o.label}</td><td>${o.text ?? ""}</td></tr>`);
  return `<div class="scroll"><table><thead><tr><th>Option</th><th>What it means</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}

export function pickLine(call: Call) {
  const p = call.pick;
  return join(
    `<b>Pick (${stateWords(call)}): ${p.label}.</b>`,
    p.why,
    p.measure && `<b>Measure after the ruling:</b> ${p.measure}`,
    p.reverse && `<b>Reverse:</b> ${p.reverse}`,
  );
}

export function rulingLine(call: Call, calls: Map<string, Call>) {
  const r = call.state === "settled" ? call.ruling : undefined;
  const replaced = call.supersedes ? calls.get(call.supersedes) : undefined;
  return join(
    r && `<b>Ruling, ${esc(r.date)}, ${esc(r.by)}:</b> ${r.text}`,
    replaced && `It replaces the ruling on call ${label(replaced)}.`,
  );
}

/** A decision card: the author's framing, the options, the pick, the ruling, then the author's caption. */
export function callCard(call: Call, calls: Map<string, Call>, framing: string, caption: string) {
  const ruling = rulingLine(call, calls);
  return (
    `<figure class="card" id="call-${call.id}">${framing.trim()}${optionsTable(call)}` +
    `<p class="pick">${pickLine(call)}</p>${ruling ? `<p class="ruling">${ruling}</p>` : ""}${caption}</figure>`
  );
}

/** Small calls, one table row each. */
export function callRows(rows: { call: Call; where?: string }[], calls: Map<string, Call>) {
  const body = rows.map(({ call, where }) => {
    const opts = call.options.map((o) => `<b>${o.label}:</b> ${o.text ?? o.changes ?? o.buys ?? ""}`).join(" ");
    const ruling = rulingLine(call, calls);
    return (
      `<tr id="call-${call.id}"><td><b>${label(call)} ·</b> ${call.question}</td><td>${callPill(call, where)}</td>` +
      `<td>${opts}${ruling ? ` ${ruling}` : ""}</td><td>${join(`${call.pick.label}.`, call.pick.why, call.pick.reverse)}</td></tr>`
    );
  });
  return `<div class="scroll"><table class="calls"><thead><tr><th>Call</th><th>State</th><th>Options, and what each means</th><th>Pick</th></tr></thead><tbody>${body.join("")}</tbody></table></div>`;
}

/** Give an SVG a role and a text alternative unless it names its own, and a floor under its width. */
function svgWithAlt(svg: string, alt: string, minWidth?: number) {
  const open = svg.match(/^<svg\b[^>]*>/)?.[0] ?? "";
  let tag = open;
  if (!/\brole=/.test(tag)) tag = tag.replace(/^<svg\b/, '<svg role="img"');
  if (!/\baria-label(ledby)?=/.test(tag)) tag = tag.replace(/^<svg\b/, `<svg aria-label="${esc(alt)}"`);
  if (minWidth)
    tag = /\bstyle="/.test(tag) ? tag.replace(/\bstyle="/, `style="min-width:${minWidth}px;`) : tag.replace(/^<svg\b/, `<svg style="min-width:${minWidth}px"`);
  return tag + svg.slice(open.length);
}

/** A figure from figures/<id>/: its drawing, the page's key when this is the first figure with marks, and its caption. */
export function figure(fig: Figure, opts: { cls?: string; key?: string }) {
  const d = fig.drawing;
  let drawing: string;
  if (d.form === "svg") drawing = svgWithAlt(d.svg, fig.alt, fig.minWidth);
  else if (d.form === "html") drawing = d.html;
  else
    drawing =
      `<div class="kit-wide">${svgWithAlt(d.wide, fig.alt, fig.minWidth)}</div>` +
      `<div class="kit-narrow">${svgWithAlt(d.narrow, fig.alt)}</div>`;
  return (
    `<figure class="${join("kit-fig", opts.cls)}" id="fig-${fig.id}" data-figure="${fig.id}">` +
    `<div class="kit-draw">${drawing}</div>${opts.key ?? ""}` +
    `<figcaption>${join(`<b>${fig.caption}</b>`, fig.note)}</figcaption></figure>`
  );
}

/** The container rule that swaps a wide drawing for its narrow one. */
export const figureSwitchCss = (fig: Figure) =>
  fig.drawing.form === "wide-narrow"
    ? `@container (max-width:${fig.drawing.narrowBelow - 1}px){#fig-${fig.id} .kit-wide{display:none}#fig-${fig.id} .kit-narrow{display:block}}`
    : "";

export function detail(summary: string, inner: string) {
  return `<details class="kit-detail"><summary>${esc(summary)}</summary><div>${asBlock(inner)}</div></details>`;
}

export function caveat(inner: string, heading = "Caveat") {
  return `<aside class="kit-caveat" role="note"><b>${esc(heading)}</b>${inner.trim()}</aside>`;
}

/** The key of marks: each mark the page's figures use, in the suite's order. */
export function key(entries: KeyEntry[]) {
  const items = entries.map((k) => `<span class="k">${k.swatch}${k.label}</span>`).join("");
  return `<div class="key" aria-label="Key to the marks on this page"><span class="key-h">Key</span>${items}</div>`;
}

/** The hub's reading order: every page but the one it sits on, each with its question and what it holds. */
export function pagesList(suite: Suite, here: string) {
  const items = suite.config.pages
    .filter((p) => p.id !== here)
    .map((p) => `<li${p.thread ? ` class="t-${p.thread}"` : ""}><a href="${p.id}.html"><b>${esc(p.title)}.</b></a> ${join(p.question, p.holds)}</li>`);
  return `<ol class="read">${items.join("")}</ol>`;
}
