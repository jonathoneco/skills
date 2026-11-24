// The check target: open each built page at 1440 × 900 and 390 × 844, in the light and the dark theme, and fail on a
// face that did not load, a sideways scroll or a clipped label in any state of an interactive figure, a title off
// the first screen, a figure label under 12 px at 390 px, an island or interactive figure with no still frame, a file
// over the publish limit, a live data call (fetch, XHR, EventSource, WebSocket) to an outside host, a console error, or
// an id used twice. It reports each file's size and the outside hosts each page loads from, and exits
// nonzero on any failure.
import fs from "node:fs";
import path from "node:path";
import { openFile } from "../browser.ts";
import { familyOf } from "../fonts.ts";
import { escapedSize, SIZE_LIMIT, type Suite } from "../ir.ts";
import { type Opts, pagesFor } from "../targets.ts";

const VIEWS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
] as const;
const SCHEMES = ["light", "dark"] as const;

interface Probe {
  fonts: string[];
  sideways: number;
  clipped: string[];
  titleBottom: number;
  small: string[];
  dupIds: string[];
}

/** Runs inside the page. Plain JavaScript once types are stripped, so it serializes to the browser. */
async function probe(args: { faces: string[]; narrow: boolean }): Promise<Probe> {
  await Promise.allSettled([...document.fonts].map((f) => f.load()));
  const name = (el: Element) => `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 40)}"`;
  const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, ""));
  const fonts = args.faces.filter((f) => !loaded.includes(f));
  for (const f of document.fonts) if (f.status === "error") fonts.push(`${f.family} ${f.style} (failed to decode)`);
  const de = document.documentElement;
  const clipped: string[] = [];
  const small: string[] = [];
  const texts = [...document.querySelectorAll("figure svg text")].filter((t) => t.getClientRects().length);
  for (const t of texts) {
    const svg = (t as SVGTextElement).ownerSVGElement;
    if (!svg) continue;
    const r = t.getBoundingClientRect();
    const s = svg.getBoundingClientRect();
    if (r.width && (r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1 || r.bottom > s.bottom + 1)) clipped.push(name(t));
    if (args.narrow && !t.closest(".key")) {
      const m = (t as SVGTextElement).getScreenCTM();
      const px = Number.parseFloat(getComputedStyle(t).fontSize) * (m ? Math.hypot(m.a, m.b) : 1);
      if (px < 11.95) small.push(`${name(t)} at ${px.toFixed(1)} px`);
    }
  }
  for (const el of document.querySelectorAll("figure *")) {
    const cs = getComputedStyle(el);
    const hides = /hidden|clip/.test(cs.overflowX + cs.overflowY) || cs.textOverflow === "ellipsis";
    if (hides && el.getClientRects().length && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) && el.textContent?.trim())
      clipped.push(name(el));
    if (args.narrow && el.closest(".kit-draw") && !el.closest("svg") && el.getClientRects().length) {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim());
      const px = Number.parseFloat(cs.fontSize);
      if (own && px < 11.95) small.push(`${name(el)} at ${px.toFixed(1)} px`);
    }
  }
  const seen = new Map<string, number>();
  for (const el of document.querySelectorAll("[id]")) seen.set(el.id, (seen.get(el.id) ?? 0) + 1);
  const h1 = document.querySelector("h1");
  return {
    fonts,
    sideways: de.scrollWidth - de.clientWidth,
    clipped,
    titleBottom: h1 ? h1.getBoundingClientRect().bottom + window.scrollY : 0,
    small,
    dupIds: [...seen].filter(([, n]) => n > 1).map(([id]) => id),
  };
}

export interface PageReport {
  page: string;
  bytes: number;
  escaped: number;
  failures: string[];
  /** Hosts the page loads scripts, styles, fonts or images from. */
  hosts: string[];
}

export async function checkPage(suite: Suite, id: string, file: string): Promise<PageReport> {
  const page = suite.pages.find((p) => p.entry.id === id);
  if (!page) throw new Error(`no page ${id}`);
  const html = fs.readFileSync(file, "utf8");
  const report: PageReport = { page: id, bytes: Buffer.byteLength(html), escaped: escapedSize(html), failures: [], hosts: [] };
  const hosts = new Set<string>();
  const fail = (s: string) => report.failures.includes(s) || report.failures.push(s);
  if (report.escaped > SIZE_LIMIT) fail(`over the limit: ${report.escaped} bytes JSON-escaped, limit ${SIZE_LIMIT}`);
  for (const i of page.islands) if (!i.still) fail(`island <${i.tag}> (top-level element ${i.index + 1}) has no data-still naming its still frame`);
  const figs = page.cites.figures.map((f) => suite.figures.get(f)).filter((f) => f !== undefined);
  for (const f of figs) if (f.interactive && !f.still) fail(`figure ${f.id} is interactive and its meta.yaml names no still frame`);

  const faces = [familyOf(suite.config.type.text), familyOf(suite.config.type.heading)];
  for (const view of VIEWS)
    for (const scheme of SCHEMES) {
      const at = `${view.width}×${view.height} ${scheme}`;
      const { page: pw, errors, net, close } = await openFile(file, { ...view, scheme });
      try {
        const narrow = view.width <= 390;
        const report1 = await pw.evaluate(probe, { faces, narrow });
        const states: [string, Probe][] = [["still frame", report1]];
        for (const f of figs)
          for (const s of f.states) {
            if (!s.click) continue;
            const target = pw.locator(`[data-figure="${f.id}"] ${s.click}`).first();
            if (!(await target.count())) {
              fail(`${at}: figure ${f.id} state "${s.name}": nothing matches ${s.click}`);
              continue;
            }
            await target.click();
            states.push([`figure ${f.id} state "${s.name}"`, await pw.evaluate(probe, { faces, narrow })]);
          }
        for (const fm of report1.fonts) fail(`${at}: face ${fm} did not load`);
        if (report1.titleBottom > view.height) fail(`${at}: the title ends at ${Math.round(report1.titleBottom)} px, off the first screen`);
        for (const d of report1.dupIds) fail(`${at}: id "${d}" is used twice; prefix figure ids with the figure's name`);
        for (const [name, p] of states) {
          if (p.sideways > 1) fail(`${at}, ${name}: the page scrolls sideways by ${p.sideways} px`);
          for (const c of p.clipped) fail(`${at}, ${name}: clipped label ${c}`);
          for (const s of p.small) fail(`${at}, ${name}: figure label under 12 px: ${s}`);
        }
        for (const call of net.dataCalls) fail(`${at}: ${id}.html makes a live data call, ${call}; a page loads assets only`);
        for (const h of net.hosts) hosts.add(h);
        for (const e of errors) fail(`${at}: console error: ${e}`);
      } finally {
        await close();
      }
    }
  report.hosts = [...hosts].sort();
  return report;
}

export async function checkSuite(suite: Suite, opts: Opts) {
  const dir = path.join(opts.out, "page");
  const reports: PageReport[] = [];
  for (const p of pagesFor(suite, opts)) reports.push(await checkPage(suite, p.entry.id, path.join(dir, `${p.entry.id}.html`)));
  const lines = [
    "| Page | Bytes | JSON-escaped | Result |",
    "|---|---:|---:|---|",
    ...reports.map((r) => `| ${r.page}.html | ${r.bytes} | ${r.escaped} | ${r.failures.length ? `${r.failures.length} failures` : "pass"} |`),
  ];
  for (const r of reports) if (r.failures.length) lines.push("", `## ${r.page}.html`, "", ...r.failures.map((f) => `- ${f}`));
  const outside = reports.filter((r) => r.hosts.length);
  if (outside.length)
    lines.push(
      "",
      "## Outside hosts",
      "",
      "These pages load from the network. A review view that loads only its own domain shows them without these assets.",
      "",
      ...outside.map((r) => `- ${r.page}.html: ${r.hosts.join(", ")}`),
    );
  const text = `${lines.join("\n")}\n`;
  fs.mkdirSync(path.join(opts.out, "check"), { recursive: true });
  fs.writeFileSync(path.join(opts.out, "check", "report.md"), text);
  console.log(text.trimEnd());
  const ok = reports.every((r) => !r.failures.length);
  console.log(`check: ${ok ? "pass" : "FAIL"} → ${path.join(opts.out, "check", "report.md")}`);
  return ok;
}
