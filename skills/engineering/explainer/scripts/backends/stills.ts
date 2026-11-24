// Still frames: each figure or island drawn alone, in the light theme, before anyone touches a control.
// The pictures are cached by a hash of what draws them, under <out>/.kit/stills/, and shared by every target.
import fs from "node:fs";
import path from "node:path";
import { stills as shoot } from "../browser.ts";
import { baseCss, tokensCss } from "../components/shell.ts";
import { embedFonts } from "../fonts.ts";
import type { Suite } from "../ir.ts";
import { sha } from "../targets.ts";
import { charsOf } from "./page.ts";
import type { Still } from "./markdown.ts";

const STILL_CSS =
  "main{display:block;padding:24px}.kit-still{background:var(--paper);padding:16px;margin:0 0 24px;width:fit-content;min-width:360px;max-width:720px}" +
  ".kit-still.wide{max-width:1120px}.kit-still figcaption{display:none}.kit-still>figure{margin:0}";

/** Make sure each still's picture exists, and return the pictures keyed by `still.file`. */
export async function renderStills(suite: Suite, out: string, list: Still[]) {
  const css = [tokensCss(suite), baseCss, suite.figuresCss, STILL_CSS].join("\n");
  const cache = path.join(out, ".kit", "stills");
  const todo = list.map((s) => ({ s, png: path.join(cache, `${sha(css, s.html, String(s.wide))}.png`) })).filter((t) => !fs.existsSync(t.png));
  if (todo.length) {
    const body = todo.map((t, i) => `<div class="kit-still${t.s.wide ? " wide" : ""}" data-kit-still="${i}"><div class="kit-draw">${t.s.html}</div></div>`).join("\n");
    const fonts = await embedFonts(suite.config.type, charsOf(body));
    const file = path.join(out, ".kit", `stills-${process.pid}.html`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${fonts}\n${css}</style></head><body><main>${body}</main></body></html>`);
    try {
      // Each picture lands under a temporary name and is renamed once whole, so a run cut short never leaves a
      // broken picture in the cache for later runs to trust.
      const tmp = (png: string) => `${png}.tmp-${process.pid}`;
      await shoot(todo.map((t, i) => ({ file, selector: `[data-kit-still="${i}"]`, out: tmp(t.png), width: 1440 })));
      for (const t of todo) fs.renameSync(tmp(t.png), t.png);
    } finally {
      fs.rmSync(file, { force: true });
    }
  }
  const files: Record<string, Uint8Array> = {};
  for (const s of list) files[s.file] = fs.readFileSync(path.join(cache, `${sha(css, s.html, String(s.wide))}.png`));
  return files;
}
