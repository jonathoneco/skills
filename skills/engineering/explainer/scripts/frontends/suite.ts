// Load a suite folder into the IR. Every check that needs only the sources runs here, so a broken suite fails before
// any target renders: the YAML schemas, ids that are cited but not defined, and figure folders with no drawing.
import fs from "node:fs";
import path from "node:path";
import { need } from "../deps.ts";
import {
  type Call,
  type Drawing,
  type Fact,
  type Figure,
  GRADES,
  type Page,
  SourceError,
  STATES,
  type Suite,
  type SuiteConfig,
} from "../ir.ts";
import { bundledFaces } from "../fonts.ts";
import { holdsControl, parsePage } from "./html.ts";
import { bool, dict, list, num, obj, oneOf, type Spec, str } from "./schema.ts";

/** Tokens every palette defines in both themes, because the kit's components read them. */
export const BASE_TOKENS = ["paper", "ink", "ink2", "rule", "card", "codebg", "accent", "critical", "warning", "good", "waiting"];
const NOTION_COLOURS = ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"] as const;
const ID = /^[a-z0-9][a-z0-9-]*$/;

const id: Spec<string> = (v, at, errors) => {
  const s = str(v, at, errors);
  if (s !== undefined && !ID.test(s)) errors.push(`${at}: an id is lower-case letters, digits and hyphens, got ${JSON.stringify(s)}`);
  return s;
};

const suiteSpec = obj(
  {
    title: str,
    reader: str,
    pages: list(obj({ id, title: str }, { thread: id, question: str, holds: str }), { nonEmpty: true }),
    palette: obj({ light: dict(str), dark: dict(str) }),
    type: obj({ text: str, heading: str, mono: str }),
  },
  {
    read_at: str,
    key: list(obj({ mark: id, label: str, swatch: str })),
    notion: obj({ accent: oneOf(NOTION_COLOURS) }),
  },
);

const callSpec = obj(
  {
    id,
    question: str,
    small: bool,
    options: list(obj({ label: str }, { text: str, buys: str, changes: str, cost: str }), { nonEmpty: true }),
    pick: obj({ label: str }, { why: str, measure: str, reverse: str }),
    state: oneOf(STATES),
  },
  { label: str, waits_on: str, ruling: obj({ text: str, date: str, by: str }), supersedes: id },
);

const factSpec = obj({ id, value: str, source: str, grade: oneOf(GRADES) });

const metaSpec = obj(
  { caption: str, alt: str },
  {
    note: str,
    marks: list(id),
    narrow_below: num,
    min_width: num,
    still: str,
    states: list(obj({ name: str, text: str }, { click: str })),
  },
);

function readYaml(file: string): unknown {
  const YAML = need<typeof import("yaml")>("yaml");
  try {
    return YAML.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    throw new SourceError(`${file}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function parseFile<T>(file: string, spec: Spec<T>, at: string): T {
  const errors: string[] = [];
  const out = spec(readYaml(file), at, errors);
  if (errors.length || out === undefined) throw new SourceError(`${file}:\n  ${errors.join("\n  ")}`);
  return out;
}

function byId<T extends { id: string }>(file: string, items: T[]): Map<string, T> {
  const m = new Map<string, T>();
  for (const it of items) {
    if (m.has(it.id)) throw new SourceError(`${file}: the id \`${it.id}\` is used twice`);
    m.set(it.id, it);
  }
  return m;
}

type RawCall = NonNullable<ReturnType<typeof callSpec>>;

/** Parse each call into the variant its state names, and check the rules a call's fields keep together. */
function toCalls(file: string, raw: RawCall[]): Map<string, Call> {
  const errors: string[] = [];
  const calls = new Map<string, Call>();
  for (const { state, waits_on, ruling, ...base } of raw) {
    if (calls.has(base.id)) errors.push(`the id \`${base.id}\` is used twice`);
    if (state !== "waiting" && waits_on) errors.push(`${base.id}: only a waiting call carries \`waits_on\``);
    if (state !== "settled" && ruling) errors.push(`${base.id}: only a settled call carries a \`ruling\``);
    if (!base.small && !(base.pick.reverse && base.options.every((o) => o.cost)))
      errors.push(`${base.id}: a call that is not small gives each option's \`cost\` and the pick's \`reverse\``);
    if (state === "open") calls.set(base.id, { ...base, state });
    else if (state === "waiting") {
      if (waits_on) calls.set(base.id, { ...base, state, waits_on });
      else errors.push(`${base.id}: a waiting call names what it waits on in \`waits_on\``);
    } else if (ruling) calls.set(base.id, { ...base, state, ruling });
    else errors.push(`${base.id}: a settled call carries its \`ruling\``);
  }
  for (const c of calls.values())
    if (c.supersedes && !calls.has(c.supersedes)) errors.push(`${c.id}: supersedes \`${c.supersedes}\`, which calls.yaml does not hold`);
  if (errors.length) throw new SourceError(`${file}:\n  ${errors.join("\n  ")}`);
  return calls;
}

const stripProlog = (svg: string) => svg.replace(/^\s*<\?xml[^>]*\?>\s*/, "").replace(/^\s*<!DOCTYPE[^>]*>\s*/i, "").trim();

function loadFigure(dir: string, figId: string): Figure {
  const base = path.join(dir, figId);
  const metaFile = path.join(base, "meta.yaml");
  if (!fs.existsSync(metaFile)) throw new SourceError(`${base}: a figure folder holds meta.yaml`);
  const meta = parseFile(metaFile, metaSpec, "meta");
  const has = (f: string) => fs.existsSync(path.join(base, f));
  const read = (f: string) => fs.readFileSync(path.join(base, f), "utf8");
  const forms = [has("figure.svg") && "figure.svg", has("wide.svg") && has("narrow.svg") && "wide.svg + narrow.svg", has("figure.html") && "figure.html"].filter(Boolean);
  if (forms.length !== 1)
    throw new SourceError(
      `${base}: a figure holds exactly one drawing form: figure.svg, wide.svg plus narrow.svg, or figure.html. Found: ${forms.join(", ") || "none"}`,
    );
  if (has("wide.svg") !== has("narrow.svg")) throw new SourceError(`${base}: wide.svg and narrow.svg come as a pair`);
  let drawing: Drawing;
  if (has("figure.svg")) drawing = { form: "svg", svg: stripProlog(read("figure.svg")) };
  else if (has("figure.html")) drawing = { form: "html", html: read("figure.html").trim() };
  else drawing = { form: "wide-narrow", wide: stripProlog(read("wide.svg")), narrow: stripProlog(read("narrow.svg")), narrowBelow: meta.narrow_below ?? 560 };
  const text = drawing.form === "wide-narrow" ? drawing.wide + drawing.narrow : drawing.form === "svg" ? drawing.svg : drawing.html;
  return {
    id: figId,
    caption: meta.caption,
    note: meta.note,
    alt: meta.alt,
    minWidth: meta.min_width,
    marks: meta.marks ?? [],
    drawing,
    interactive: holdsControl(text),
    still: meta.still,
    states: meta.states ?? [],
    files: fs.readdirSync(base).sort().map((f) => path.join(base, f)),
  };
}

export function loadSuite(dir: string): Suite {
  dir = path.resolve(dir);
  const suiteFile = path.join(dir, "suite.yaml");
  if (!fs.existsSync(suiteFile)) throw new SourceError(`${dir}: a suite folder holds suite.yaml`);
  const raw = parseFile(suiteFile, suiteSpec, "suite");
  const config: SuiteConfig = { ...raw, key: raw.key ?? [], notion: raw.notion ?? { accent: "blue" } };

  const errors: string[] = [];
  const faces = bundledFaces();
  for (const role of ["text", "heading", "mono"] as const)
    if (!faces.includes(config.type[role]))
      errors.push(`type.${role}: \`${config.type[role]}\` is not a bundled face (fonts/README.md): ${faces.join(", ")}`);
  const threads = new Set(config.pages.flatMap((p) => (p.thread ? [p.thread] : [])));
  for (const theme of ["light", "dark"] as const) {
    const have = config.palette[theme];
    for (const t of [...BASE_TOKENS, ...[...threads].map((t) => `th-${t}`)])
      if (!have[t]) errors.push(`palette.${theme}: missing token \`${t}\``);
  }
  const pageIds = new Set<string>();
  for (const p of config.pages) {
    if (pageIds.has(p.id)) errors.push(`pages: the id \`${p.id}\` is used twice`);
    pageIds.add(p.id);
  }
  if (errors.length) throw new SourceError(`${suiteFile}:\n  ${errors.join("\n  ")}`);

  const callsFile = path.join(dir, "calls.yaml");
  const factsFile = path.join(dir, "facts.yaml");
  const calls = fs.existsSync(callsFile) ? toCalls(callsFile, parseFile(callsFile, list(callSpec), "calls")) : new Map<string, Call>();
  const facts = fs.existsSync(factsFile) ? byId(factsFile, parseFile(factsFile, list(factSpec), "facts") as Fact[]) : new Map<string, Fact>();

  const figDir = path.join(dir, "figures");
  const figures = new Map<string, Figure>();
  if (fs.existsSync(figDir))
    for (const f of fs.readdirSync(figDir).sort())
      if (fs.statSync(path.join(figDir, f)).isDirectory()) figures.set(f, loadFigure(figDir, f));
  const figuresCssFile = path.join(figDir, "figures.css");
  const figuresCss = fs.existsSync(figuresCssFile) ? fs.readFileSync(figuresCssFile, "utf8") : "";
  const keyMarks = new Set(config.key.map((k) => k.mark));
  for (const f of figures.values())
    for (const m of f.marks)
      if (!keyMarks.has(m)) throw new SourceError(`${figDir}/${f.id}/meta.yaml: mark \`${m}\` is not in suite.yaml's key`);

  const suite: Suite = { dir, config, calls, facts, figures, figuresCss, pages: [] };
  suite.pages = config.pages.map((entry, index): Page => {
    const file = path.join(dir, "pages", `${entry.id}.html`);
    if (!fs.existsSync(file)) throw new SourceError(`${suiteFile}: page \`${entry.id}\` has no pages/${entry.id}.html`);
    const ctxFile = path.join(dir, "pages", `${entry.id}.context.md`);
    if (!fs.existsSync(ctxFile)) throw new SourceError(`${file}: the page's agent context pages/${entry.id}.context.md is missing`);
    const source = fs.readFileSync(file, "utf8");
    const parsed = parsePage(file, source);
    const missing = [
      ...parsed.cites.calls.filter((c) => !calls.has(c)).map((c) => `<x-call id="${c}">: calls.yaml holds no call \`${c}\``),
      ...parsed.cites.facts.filter((c) => !facts.has(c)).map((c) => `<x-fact id="${c}">: facts.yaml holds no fact \`${c}\``),
      ...parsed.cites.figures.filter((c) => !figures.has(c)).map((c) => `<x-figure id="${c}">: figures/ holds no folder \`${c}\``),
    ];
    if (missing.length) throw new SourceError(`${file}:\n  ${missing.join("\n  ")}`);
    return { entry, index, file, source, context: fs.readFileSync(ctxFile, "utf8"), ...parsed };
  });
  return suite;
}
