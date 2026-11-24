// The kit's npm dependencies live in a cache outside the skill folder, because bots run skills from a clone that a
// sync loop owns. The cache folder is keyed by the hash of package.json, so a dependency change installs afresh.
// The first run fills it from the network; every later run only reads it.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const manifest = fs.readFileSync(path.join(here, "package.json"));
const key = createHash("sha256").update(manifest).digest("hex").slice(0, 16);
const cacheHome = process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache");
export const depsDir = path.join(cacheHome, "explainer-kit", key);

// Each installer, in order of preference. npm honours the lock file; Deno installs from package.json.
const installers: [string, string[]][] = [
  ["npm", ["ci", "--no-audit", "--no-fund", "--loglevel=error"]],
  ["deno", ["install", "--quiet"]],
];

function install() {
  fs.mkdirSync(path.dirname(depsDir), { recursive: true });
  const tmp = fs.mkdtempSync(`${depsDir}.tmp-`);
  for (const f of ["package.json", "package-lock.json"]) fs.copyFileSync(path.join(here, f), path.join(tmp, f));
  const tried: string[] = [];
  for (const [cmd, args] of installers) {
    const r = spawnSync(cmd, args, { cwd: tmp, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    if (r.error) continue; // not on PATH
    if (r.status === 0 && fs.existsSync(path.join(tmp, "node_modules", "yaml"))) {
      fs.writeFileSync(path.join(tmp, ".ready"), `${cmd}\n`);
      try {
        fs.renameSync(tmp, depsDir);
      } catch {
        fs.rmSync(tmp, { recursive: true, force: true }); // another run finished first
      }
      return;
    }
    tried.push(`${cmd} ${args.join(" ")} exited ${r.status}: ${(r.stderr || r.stdout).trim().slice(-400)}`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  throw new Error(
    `explainer kit: could not install its dependencies into ${depsDir}.\n` +
      (tried.length ? tried.join("\n") : "No npm or deno on PATH."),
  );
}

let req: NodeJS.Require | undefined;

/** Load one of the kit's dependencies, filling the cache on first use. */
export function need<T = any>(name: string): T {
  if (!req) {
    if (!fs.existsSync(path.join(depsDir, ".ready"))) install();
    req = createRequire(path.join(depsDir, "package.json"));
  }
  return req(name) as T;
}
