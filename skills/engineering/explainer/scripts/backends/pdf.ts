// The pdf target: the pages in reading order as one print document, through Chromium's PDF export. Print CSS hides
// the rail and the agent entry, opens every <details>, and starts each page on a new sheet. An interactive figure or
// island prints as its still frame, the state it shows before anyone touches it.
import fs from "node:fs";
import path from "node:path";
import { openFile } from "../browser.ts";
import { baseCss, tokensCss } from "../components/shell.ts";
import { embedFonts } from "../fonts.ts";
import { pageInputs, pagesFor, type Target } from "../targets.ts";
import { charsOf, renderBody } from "./page.ts";

const PRINT = "@page{size:A4;margin:16mm 14mm}html{background:#fff}body{font-size:11pt}.kit-page>*+*{margin-top:.9rem}";

export const target: Target = {
  units: (suite, opts) => {
    const pages = pagesFor(suite, opts);
    const name = opts.only ?? "suite";
    return [
      {
        id: name,
        inputs: JSON.stringify(pages.map((p) => pageInputs(suite, p))),
        build: async () => {
          const bodies = pages.map((p) => renderBody(suite, p));
          const main = bodies.map((b) => `<section class="kit-page">${b.body}</section>`).join("\n");
          const css = [tokensCss(suite), baseCss, suite.figuresCss, ...bodies.map((b) => b.css), PRINT].join("\n");
          const fonts = await embedFonts(suite.config.type, charsOf(main));
          const file = path.join(opts.out, ".kit", `print-${process.pid}.html`);
          fs.mkdirSync(path.dirname(file), { recursive: true });
          fs.writeFileSync(file, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${suite.config.title}</title><style>${fonts}\n${css}</style></head><body><main>${main}</main></body></html>`);
          try {
            const { page, close } = await openFile(file, { width: 794, height: 1123, scheme: "light" });
            await page.evaluate(() => document.querySelectorAll("details").forEach((d) => d.setAttribute("open", "")));
            await page.emulateMedia({ media: "print", colorScheme: "light" });
            const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
            await close();
            return { [`${name}.pdf`]: pdf };
          } finally {
            fs.rmSync(file, { force: true });
          }
        },
      },
    ];
  },
};
