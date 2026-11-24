# The explainer page kit

`render` turns a suite's sources into pages and the other targets. How to write a suite is in [../build.md](../build.md); this file is for changing the kit.

## Layout

```
render            POSIX launcher: Node 22.18+, then Bun 1.1.5+, then Deno 2+
render.ts         command line, content hashes, the rule that rebuilds only changed pages
frontends/        suite.ts loads and checks a suite folder; html.ts parses a page; schema.ts checks the YAML
ir.ts             the types every backend reads
backends/         one file per target: page, notion, cold, brief, pdf, check; markdown.ts and stills.ts are shared
components/       the page shell, the marked blocks, base.css
fonts.ts          the bundled faces, cut to each page's characters
browser.ts        Chromium for check, pdf and still frames
deps.ts           the dependency cache
test/             harness.ts runs the *.test.ts files; corpus/ holds the golden files
examples/         lunch-orders, a built suite that uses every field and every figure form
```

The shape follows pstack's statechart (`cursor/plugins`, `pstack/skills/statechart/`): plain TypeScript with no build step, frontends into one IR, one backend per target.

## Tests

`./render test` runs every test under the runtime the launcher picks; `./render test <words>` runs the tests whose names hold them. `KIT_UPDATE=1 ./render test` rewrites the golden files; read their diff before committing it. Run them under Node and again under Deno, with `node` off `PATH` and `KIT_CHROMIUM` set, since bots run the kit on either.

## Dependencies and Chromium

Dependencies install on first use into `${XDG_CACHE_HOME:-~/.cache}/explainer-kit/<hash of package.json>/`, never into this folder, because bots run skills from a clone that a sync loop owns. A change to `package.json` installs afresh; refresh `package-lock.json` with `npm install --package-lock-only`. The installer tries npm, then Deno.

`playwright-core` is pinned to the release whose Chromium build sits in the user's Playwright cache. Playwright looks for its browsers under `XDG_CACHE_HOME`, so when that variable moves, set `KIT_CHROMIUM` to a Chromium, such as `/usr/bin/chromium` or the build in `~/.cache/ms-playwright`. The launcher grants Deno sys access because Playwright reads the OS release to start Chromium.

Still frames and the screenshots `check` takes differ a little between Chromium builds, so the golden tests compare text exactly and pictures by size.
