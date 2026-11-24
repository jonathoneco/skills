// Embed the suite's type pair in a page, each face cut down to the characters that page uses, as WOFF2.
// The bundled faces in ../fonts/ are variable fonts; the cut keeps the weight axis from 400 to 700.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { need } from "./deps.ts";
import type { TypePair } from "./ir.ts";

export const fontsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "fonts");

/** The bundled faces, by file stem, such as `source-serif-4`. */
export const bundledFaces = () =>
  fs.readdirSync(fontsDir).filter((f) => f.endsWith(".css")).map((f) => f.slice(0, -4)).sort();

interface Face {
  family: string;
  style: string;
  weight: string;
  data: Buffer;
}

const faceCache = new Map<string, Face[]>();
function facesOf(stem: string): Face[] {
  let faces = faceCache.get(stem);
  if (!faces) {
    const css = fs.readFileSync(path.join(fontsDir, `${stem}.css`), "utf8");
    faces = [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(([, body]) => {
      const get = (prop: string) => body.match(new RegExp(`${prop}:\\s*([^;]+);`))?.[1].trim() ?? "";
      return {
        family: get("font-family").replace(/['"]/g, ""),
        style: get("font-style") || "normal",
        weight: get("font-weight") || "400",
        data: Buffer.from(body.match(/base64,([^)'"]+)/)?.[1] ?? "", "base64"),
      };
    });
    faceCache.set(stem, faces);
  }
  return faces;
}

/** The CSS family name of a bundled face, such as `Source Serif 4`. */
export const familyOf = (stem: string) => facesOf(stem)[0]?.family ?? stem;

/** Characters CSS can draw on its own: list counters, digits in generated content, and a few marks. */
const ALWAYS = "0123456789 .,:;·–—-()[]'\"‘’“”";

const subsetCache = new Map<string, string>();
async function subset(face: Face, chars: string): Promise<string> {
  const key = `${face.family}|${face.style}|${chars}`;
  let b64 = subsetCache.get(key);
  if (b64 === undefined) {
    const subsetFont = need<(b: Buffer, t: string, o: object) => Promise<Buffer>>("subset-font");
    const out = await subsetFont(face.data, chars, { targetFormat: "woff2", variationAxes: { wght: { min: 400, max: 700 } } });
    b64 = out.toString("base64");
    subsetCache.set(key, b64);
  }
  return b64;
}

const uniq = (s: string) => [...new Set(s)].sort().join("");

/**
 * `@font-face` rules for the type pair, cut to `text`. The mono face is cut to `monoText` alone and left out when that
 * is empty. Italic faces come only when `italic` is set, so a page with no italic text carries none.
 */
export async function embedFonts(type: TypePair, chars: { text: string; mono: string; italic: boolean }): Promise<string> {
  const rules: string[] = [];
  const plan: [string, string][] = [
    [type.text, uniq(chars.text + ALWAYS)],
    [type.heading, uniq(chars.text + ALWAYS)],
  ];
  if (chars.mono.trim()) plan.push([type.mono, uniq(chars.mono)]);
  const seen = new Set<string>();
  for (const [stem, set] of plan) {
    if (seen.has(stem)) continue;
    seen.add(stem);
    for (const face of facesOf(stem)) {
      if (face.style === "italic" && !chars.italic) continue;
      const weight = face.weight.includes(" ") ? "400 700" : face.weight;
      rules.push(
        `@font-face{font-family:'${face.family}';font-style:${face.style};font-weight:${weight};font-display:block;` +
          `src:url(data:font/woff2;base64,${await subset(face, set)}) format('woff2')}`,
      );
    }
  }
  return rules.join("\n");
}
