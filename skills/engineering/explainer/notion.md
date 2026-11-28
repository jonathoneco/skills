# Notion

The Notion build of an explainer: the same reasoning, text, and agent context as the HTML page, built as Notion pages with the `notion-pages` skill. This file replaces SKILL.md's step 4, the file that step 5's cold read and prose check read, how step 6 publishes, and the comment route; every other step runs as SKILL.md says.

## Where the pages go

A page goes in the Artifacts database the ask names, or the default the install's rules name. When neither names one, ask once, before the build.

## Build

- `render <suite> --to notion` ([build.md](build.md), Commands) writes, in `out/notion/`, each page's source in Notion's markdown as `<page>.md` (the hub is `index.md`), its agent context as `<page>.agent-context.md`, the still frame of each figure and island in `stills/`, and `pages.json`, which lists each page's uploads, its links to other pages, and each place left for you.
- Until the image check in Diagrams passes, redraw each figure as Diagrams says and skip its picture: the HTML block takes the place of the image line that names its `stills/<file>`. Once the check passes, upload each picture `pages.json` lists, and put its link where the markdown names `stills/<file>`. Replace each `kit:page/<id>` with that page's Notion link once the page exists. Write by hand each place marked `⟦kit: …⟧`.
- Build each page as a row made from its shape's template (Templates below), with its Shape property set to the shape, and run the `notion-pages` skill's check on it. The build folder keeps `PUBLISHED.md` with each page's id and link.
- The agent context is a child page titled "Agent context: <page title>", built from `<page>.agent-context.md`.

The `notion-pages` skill's check stands in for step 4's browser look. Done when every page and its agent context are built from the kit's files, the `notion-pages` skill's check holds on each, and a handoff's privacy grep passes.

## Translate

To turn an existing HTML suite into Notion, run `render <suite> --to notion` on a suite in the kit's sources (an older hand-built page is ported first), upload the images it lists, and write by hand only the places it marks.

## Blocks

Which Notion block carries which kind of content, the same on every page of the set.

| Content | Block |
|---|---|
| Page title | A 2 to 4 word noun phrase naming the subject |
| Section of the argument | Heading 2, with Heading 3 below it. Headings 5 and 6 don't exist; a bold line on its own is a heading one level down. |
| The takeaway, the scope | 🧭 callout, background in the shape's accent colour |
| The worked case, a term card | 📖 callout, gray background |
| What a person sees | 👀 callout, no background, label in bold capitals ("THE CUSTOMER SEES", "NOBODY SEES") |
| A rule to remember | 💡 callout, yellow background |
| A trap, a warning | ⚠️ callout, red background |
| Done when | ✅ callout, green background |
| Parked or blocked | ⏸️ yellow callout, 🚧 orange callout |
| A field label on an item | Bold capitals before the text: "SEEN IN", "TODAY → AFTER", "WAITS ON" |
| Steps or hops with several attributes each | Native table, one row each |
| Two things side by side; two owners' lists; today against the design | Columns, a callout or list in each |
| Optional depth | Toggle, or a toggle heading |
| A diagram the reader looks at | HTML block, static, drawn as Diagrams below says |
| A diagram on an agent context page | Mermaid code block |
| A decision card's pick | 💡 callout |
| Records people add to later | A database, with properties and views |

Notion has nine text and background colours plus default. Map the subject's palette onto them once per artifact; the meanings stay fixed across the set, and the 🧭 callout keeps the accent colour its template gave it.

## Diagrams

**The image check:** upload one still frame, a PNG in the light theme, as an image block in the user's workspace, and look at it in Notion's light and dark themes. It passes when the picture reads in both.

The 670 × 500 box an HTML block lives in is the `notion-pages` skill's. Start every diagram from its `html-block-template.html`, which fills the box, follows Notion's theme, and fills every shape, and draw inside its `<g id="figure">`. Its `viewBox` is that box, so draw in those units; its colour tokens carry both themes, and it defines a class and an arrowhead for each mechanism kind. Save each diagram as `diagrams/<name>.html` and its caption as `diagrams/<name>.caption`; the caption goes on the block, not inside the frame. For Notion, [figures.md](figures.md) holds except its Drawing section: draw with the box and classes in the `notion-pages` skill's `html-block-template.html`. A diagram run uses these same output paths, and its brief carries that template instead of the `diagrams` skill's `drawing.md`.

## Templates

Each workspace's Artifacts database carries one template per shape, named for the shape. Find it by name among the database's templates; when the route can't list them, ask the user for its id once and keep it in `PUBLISHED.md`.

A page on how something works today uses the Spec template; its reasoning callout keeps steps 1 to 4 and 6. To build or repair a template, or before you change a shape file's Reasoning section, read [notion-templates.md](notion-templates.md).

On a page made from a template, the 🧭 callout carries the page's takeaway, and the reasoning callout is deleted once the page answers it.

## Cold read and prose

The cold reader's page, and the text step 5's prose check reads, is the `notion-pages` skill's markdown read-back of the built page, saved to `COLD-<n>-page.md`, with each `<embed …>` line replaced by that diagram's caption and its text alternative, and no child page's content. The cold reader also gets a screenshot of each diagram's still frame, as [cold-read.md](cold-read.md) says. A difference the read-back caused, such as a callout read back as a plain paragraph, is not a mismatch.

## Publish

After step 5, give the user the link to the hub or the one page, with what step 5 left for them.

## Comments

The user comments on blocks in Notion. Read every open thread on every page of the artifact as the `notion-pages` skill says, and reply on each thread there. An amendment callout, saying what changed and why, goes only on a page someone else owns.
