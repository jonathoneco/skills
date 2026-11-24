// Parse one page's HTML into a parse5 tree with source offsets, and check its marked blocks.
// The page target splices rendered blocks into the source text by those offsets, so everything else on the page,
// the islands, reaches the output byte for byte.
import { need } from "../deps.ts";
import { CALL_FORMS, type CallForm, type Element, type Fragment, type Island, isMarked, type Node, SourceError } from "../ir.ts";

export const isElement = (n: Node): n is Element => "tagName" in n;
export const attr = (el: Element, name: string) => el.attrs.find((a) => a.name === name)?.value;
export const elements = (nodes: Node[]) => nodes.filter(isElement);

/** Visit every element under `nodes`, depth first, in document order. */
export function* walk(nodes: Node[]): Generator<Element> {
  for (const n of nodes) {
    if (!isElement(n)) continue;
    yield n;
    yield* walk("content" in n && n.content ? n.content.childNodes : n.childNodes);
  }
}

const INTERACTIVE = new Set(["script", "button", "input", "select", "textarea", "canvas"]);
const hasInteractive = (el: Element) => INTERACTIVE.has(el.tagName) || [...walk(el.childNodes)].some((e) => INTERACTIVE.has(e.tagName));
/** True when an HTML or SVG drawing holds a script or a control, so it needs a named still frame. */
export const holdsControl = (html: string) => [...walk(parseFragment(html).childNodes)].some((e) => INTERACTIVE.has(e.tagName));

/** True when `el` is an x-call in the given form. A call without `form` is a card. */
export const callForm = (el: Element): CallForm => {
  const f = attr(el, "form") ?? "card";
  return f === "row" || f === "pill" ? f : "card";
};

const isBlank = (n: Node) => n.nodeName === "#comment" || (n.nodeName === "#text" && "value" in n && !n.value.trim());

/** The elements from `nodes[start]` on that `same` accepts, with only blank text or comments between them. */
export function siblingRun(nodes: Node[], start: number, same: (el: Element) => boolean): Element[] {
  const run: Element[] = [];
  for (let j = start; j < nodes.length; j++) {
    const m = nodes[j];
    if (isElement(m) && same(m)) run.push(m);
    else if (!isBlank(m)) break;
  }
  return run;
}

/** The text of an HTML fragment, with whitespace collapsed. */
export const plainText = (html: string) => textContent(parseFragment(html).childNodes).replace(/\s+/g, " ").trim();
const textContent = (nodes: Node[]): string =>
  nodes.map((n) => (n.nodeName === "#text" && "value" in n ? n.value : isElement(n) ? textContent(n.childNodes) : "")).join("");

export function parseFragment(source: string): Fragment {
  const parse5 = need<typeof import("parse5")>("parse5");
  return parse5.parseFragment(source, { sourceCodeLocationInfo: true });
}

export function parsePage(file: string, source: string) {
  const tree = parseFragment(source);
  const cites = { calls: [] as string[], facts: [] as string[], figures: [] as string[] };
  const errors: string[] = [];
  const line = (el: Element) => el.sourceCodeLocation?.startLine ?? 0;
  const add = (list: string[], v: string) => list.includes(v) || list.push(v);

  for (const el of walk(tree.childNodes)) {
    const tag = el.tagName;
    if (!tag.startsWith("x-")) continue;
    const at = `line ${line(el)}: <${tag}>`;
    if (!isMarked(tag)) {
      errors.push(`${at} is not a marked block the kit knows`);
      continue;
    }
    if (!el.sourceCodeLocation?.endTag) errors.push(`${at} needs its closing </${tag}>`);
    const id = attr(el, "id");
    switch (tag) {
      case "x-call": {
        if (!id) errors.push(`${at} needs an id`);
        else add(cites.calls, id);
        const form = attr(el, "form");
        if (form && !(CALL_FORMS as readonly string[]).includes(form)) errors.push(`${at} form is one of ${CALL_FORMS.join(", ")}`);
        break;
      }
      case "x-fact":
        if (!id) errors.push(`${at} needs an id`);
        else add(cites.facts, id);
        if (el.childNodes.length) errors.push(`${at} takes its value from facts.yaml; write <x-fact id="${id}"></x-fact> with nothing inside`);
        break;
      case "x-figure":
        if (!id) errors.push(`${at} needs an id`);
        else add(cites.figures, id);
        if (el.childNodes.some((n) => isElement(n) || ("value" in n && n.value.trim())))
          errors.push(`${at} takes its drawing and caption from figures/${id}/; leave it empty`);
        break;
      case "x-detail":
        if (!attr(el, "summary")) errors.push(`${at} needs a summary attribute`);
        break;
      case "x-takeaway":
      case "x-ask":
      case "x-caveat":
      case "x-pages":
        break;
      default: {
        const _exhaustive: never = tag;
        throw new Error(`unhandled marked block ${_exhaustive}`);
      }
    }
  }

  const islands: Island[] = [];
  elements(tree.childNodes).forEach((el, index) => {
    if (isMarked(el.tagName) || el.tagName === "style" || el.tagName === "script" && !attr(el, "data-still")) return;
    if (hasInteractive(el)) islands.push({ index, tag: el.tagName, still: attr(el, "data-still") });
  });

  if (errors.length) throw new SourceError(`${file}:\n  ${errors.join("\n  ")}`);
  return { tree, cites, islands };
}
