# Build

Every page is built with the kit in [scripts/](scripts/): you write the suite's sources, and the kit writes the files. A page is one `.html` file with its CSS and JavaScript inline. It opens with no build step. It may load scripts, styles, fonts and images from the network; it makes no live data calls.

## Commands

The command is the skill's `scripts/render`, named `render` below. It writes into `~/.local/state/agent-runs/<effort>/out/`, one folder per target, where `<effort>` is the folder under `agent-notes/` that holds the suite; `out` below means that folder. The renders stay out of the synced notes; `--out <dir>` moves them.

1. Write the suite's sources (Sources below) in the build folder, the design plan's values in `suite.yaml`.
2. `render <suite> --to page` writes `out/page/<page>.html` and its `<page>.context.md`. It fails when a source cites an id that `calls.yaml`, `facts.yaml` or `figures/` lacks, and when a page is over 8 MiB once JSON-escaped, the explainer's page budget.
3. `render <suite> --to check` opens each page at 1440 × 900 and 390 × 844 in both themes. Fix the source it names and run it again until it passes.
4. A ruling, a fact, or a look change is an edit to one source file and the same command again: only the pages whose inputs changed rebuild. `out/.kit/index.json` lists the pages that cite each call and fact.
5. Other targets from the same sources: `--to notion` ([notion.md](notion.md)), `--to cold` ([cold-read.md](cold-read.md)), `--to brief` (one fixed one-pager: the takeaway, the asks, the first figure's still frame, the open calls), and `--to pdf`. Join targets with commas.

`--only <page>` renders one page, and `--force` rebuilds every page. The first run fills the kit's dependency cache from the network. `check`, `pdf` and the still frames need Chromium: Playwright's own build, or the one `KIT_CHROMIUM` names. Playwright looks for its build under `XDG_CACHE_HOME`, so set `KIT_CHROMIUM` when that variable is moved.

## Sources

A suite folder holds, for a working example see [scripts/examples/lunch-orders/](scripts/examples/lunch-orders/):

- `suite.yaml`: `title`, `reader`, `read_at` (what the pages read, and when), `pages` in reading order (`id`, `title`, and for each page after the hub its `question`, `holds` and `thread`), `palette` (`light` and `dark`), `type` (`text`, `heading`, `mono`), `key` (the marks of the page's figures), and `notion.accent`.
- `pages/<id>.html`: the page's body in free HTML with marked blocks. The first page is the hub.
- `pages/<id>.context.md`: the page's agent context.
- `calls.yaml`: each call's `id`, `label`, `question`, `small`, `options`, `pick`, `state` (`open`, `waiting` with `waits_on`, or `settled` with `ruling`), and `supersedes`.
- `facts.yaml`: each fact's `id`, `value`, `source` and `grade`, the grade from the `grading-evidence` skill.
- `figures/<id>/`: `meta.yaml` and one drawing, as [figures.md](figures.md) says; `figures/figures.css` holds the suite's drawing styles.

Text in the YAML files is inline HTML. The marked blocks and the classes a page can use are in [scripts/components/README.md](scripts/components/README.md).

## The design plan

Write it in the notes before any page code; its values go into `suite.yaml`. Each later colour and type choice traces back to it.

- **Colour:** each hex value with a name and a job. First 4 to 6 base values: background, text, a neutral that leans a little toward the accent, and the accent. Then the status values (good, warning, critical). Then one hue for each mechanism kind and each thread. Choose the dark values by eye for legibility and a working accent.
- **Type:** the pair from [fonts/README.md](fonts/README.md) and the mono, with the role of each face and one type scale.
- **Layout:** the organizing idea, in a sentence or two.

Where the look comes from, first match wins: what the user said, then the design system of the project the page is about (its `DESIGN.md`, tokens, or components), then the subject. A choice from the subject uses its materials, its tools, and its words. Test the plan: swap in a neighbouring subject. A plan that fits the neighbour as well is stock, so rework it. Type always comes from the bundled faces: where a project's design system names a face, take the bundled face nearest to it, and say so in the plan.

The register is a field manual: flat colour and plain marks, with no gradients or shadows.

## Page code

The kit's shell in [scripts/components/](scripts/components/) carries the themes, the rail, the embedded type, the agent entry, and the controls on its own parts. In the HTML you write, these hold:

- **Depth.** Optional depth, such as raw data or a long reference table, folds behind `<x-detail summary="…">`. What the reader must read stays open.
- **Wide content.** A table or a code block wider than the column scrolls inside a `<div class="scroll">`, so the page body never scrolls sideways.
- **Structure marks.** An eyebrow, a number, or a divider states something true about the content. Numbers mark a real order.
- **State.** A state the reader scans for, such as held, open, or settled, shows as a pill or a chip in a status colour, with its word. A call's state comes from `calls.yaml` through `<x-call form="pill">`.
- **Controls.** A figure's controls work from the keyboard and show their focus, and motion stops under `prefers-reduced-motion`, as the `diagrams` skill says.
- **Sections.** Each `<h2>` is a rail link; `data-group="…"` on it groups the rail's links under that heading.

## Check

`render <suite> --to check` stands in for looking at the page. In every view and theme, and in every state of each interactive figure, it fails on a face that did not load, a sideways scroll, a clipped label, a title off the first screen, a figure label under 12 px at 390 px, an island or interactive figure with no still frame, an id used twice, a live data call (fetch, XHR, EventSource, WebSocket) to an outside host, a console error, and a file over the limit. Before each screenshot it waits for the network to go idle, so an island drawn from a CDN is whole. It writes `out/check/report.md` with each file's size and the outside hosts each page loads from: a review view that loads only its own domain shows the page without those assets. A look in a browser is still yours for what no rule names, such as overlapping marks or a reading order that fights the arrows. Serve the page's folder over 127.0.0.1, because `playwright-cli` refuses `file://` URLs, and switch the theme with `playwright-cli set-color-scheme dark`.

Adapted from the html and design-artifact skills of plannotator/effective-html (MIT, plannotator).
