// Chromium, through playwright-core, for `check`, `pdf` and the still frames that every target but `page` shows.
import fs from "node:fs";
import path from "node:path";
import { need } from "./deps.ts";

type Playwright = typeof import("playwright-core");
export type Browser = import("playwright-core").Browser;
export type PwPage = import("playwright-core").Page;

/**
 * The Chromium to launch: `KIT_CHROMIUM`, else Playwright's own build for this playwright-core. Playwright looks for
 * its build under `$PLAYWRIGHT_BROWSERS_PATH`, else `$XDG_CACHE_HOME/ms-playwright`, so a moved XDG_CACHE_HOME hides
 * `~/.cache/ms-playwright`; set KIT_CHROMIUM then.
 */
export function findChromium(): string {
  const env = process.env.KIT_CHROMIUM;
  if (env) {
    if (!fs.existsSync(env)) throw new Error(`KIT_CHROMIUM=${env} does not exist`);
    return env;
  }
  const own = need<Playwright>("playwright-core").chromium.executablePath();
  if (fs.existsSync(own)) return own;
  throw new Error(
    `explainer kit: no Chromium at ${own}, where Playwright looks. ` +
      "Set KIT_CHROMIUM to a Chromium binary, such as /usr/bin/chromium or ~/.cache/ms-playwright/chromium-<n>/chrome-linux64/chrome.",
  );
}

let open: Promise<Browser> | undefined;

/** One browser per run, started on first use and closed by `closeBrowser`. */
export function browser(): Promise<Browser> {
  open ??= need<Playwright>("playwright-core").chromium.launch({ executablePath: findChromium() });
  return open;
}

export async function closeBrowser() {
  if (open) await (await open).close();
  open = undefined;
}

/** Every host a page reached while it was open, and each live data call it made to one. */
export interface Network {
  hosts: Set<string>;
  dataCalls: string[];
}

/** A page may load scripts, styles, fonts and images from the network; these request kinds are live data calls. */
const LIVE = new Set(["fetch", "xhr", "eventsource", "websocket"]);
const isLocal = (url: string) => /^(file|data|blob|about):/.test(url);

/**
 * Open a local file in a fresh context at the given size and theme. When the page loads anything from the network,
 * wait for the network to go idle, so an island drawn from a CDN is whole before any screenshot.
 */
export async function openFile(file: string, o: { width: number; height: number; scheme: "light" | "dark"; scale?: number }) {
  const ctx = await (await browser()).newContext({
    viewport: { width: o.width, height: o.height },
    colorScheme: o.scheme,
    deviceScaleFactor: o.scale ?? 1,
  });
  const page = await ctx.newPage();
  const net: Network = { hosts: new Set(), dataCalls: [] };
  const seen = (url: string, kind: string) => {
    if (isLocal(url)) return;
    net.hosts.add(new URL(url).host);
    if (LIVE.has(kind)) net.dataCalls.push(`${kind} ${url}`);
  };
  page.on("request", (r) => seen(r.url(), r.resourceType()));
  page.on("websocket", (ws) => seen(ws.url(), "websocket"));
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`file://${path.resolve(file)}`);
  if (net.hosts.size) await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  return { page, errors, net, close: () => ctx.close() };
}

export interface StillJob {
  /** The built page that holds the figure or island. */
  file: string;
  /** A selector for the element to shoot. */
  selector: string;
  out: string;
  width: number;
}

/** Screenshot each figure's still frame: the state it shows before anyone touches a control. Light theme. */
export async function stills(jobs: StillJob[]) {
  const byPage = new Map<string, StillJob[]>();
  for (const j of jobs) {
    const key = `${j.file}|${j.width}`;
    const list = byPage.get(key) ?? [];
    list.push(j);
    byPage.set(key, list);
  }
  for (const list of byPage.values()) {
    const { page, close } = await openFile(list[0].file, { width: list[0].width, height: 900, scheme: "light", scale: 2 });
    for (const j of list) {
      fs.mkdirSync(path.dirname(j.out), { recursive: true });
      await page.locator(j.selector).first().screenshot({ path: j.out, type: "png", animations: "disabled" });
    }
    await close();
  }
}
