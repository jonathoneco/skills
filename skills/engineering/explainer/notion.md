# Notion

The Notion build of an explainer: the same reasoning, text, and agent context as the HTML page, built as Notion pages with the `notion-pages` skill. This file replaces SKILL.md's Build, its Render check, the text the cold read and the Prose check read, its Publish, and the comment route; every other step runs as SKILL.md says.

## Where the pages go

A page goes in the Artifacts database the user names. When the ask names none, ask once, before the build.

## Build

- Write each page's source in Notion's markdown (the `notion-pages` skill), as `<page>.md` beside the notes; the hub is `index.md`. The full path's build folder (full-path.md) holds the same files with `.md` in place of `.html`, and keeps the `PUBLISHED.md` record the `notion-pages` skill's build keeps.
- Build each page as a row made from its shape's template (Templates below), with its Shape property set to the shape, and run the `notion-pages` skill's check on it.
- The agent context is a child page titled "Agent context: <page title>", built from `<page>.context.md`.
- On the hub, each page in the reading order is a page mention; a fact stated on another page is linked with a mention.

Done when every page and its agent context are built from source files, and the `notion-pages` check holds on each. That check stands in for the Render check; the user gets the link to the hub, or to the one page.

## Blocks

Which Notion block carries which kind of content, the same on every page of the set. It replaces page.md's Elements.

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

The frame an HTML block lives in is the `notion-pages` skill's. Start every diagram from its `html-block-template.html`, which fills the frame, follows Notion's theme, and fills every shape, and draw inside its `<g id="figure">`. Its `viewBox` is the 670 × 500 frame, so draw in those units; its colour tokens carry both themes, and it defines a class and an arrowhead for each mechanism kind. Save each as `diagrams/<name>.html` with its caption in `diagrams/<name>.caption`; the caption goes on the block, not inside the frame. Everything else is diagrams.md.

## Templates

Each workspace's Artifacts database carries one template per shape, named for the shape. Find it by name among the database's templates; when the route can't list them, ask the user for its id once and keep it in `PUBLISHED.md`.

A template holds only:

- Serif type and full width, set on the template page.
- The cover, accent, and placeholder icon from the table below. The accent colours the 🧭 callout and any coloured heading.
- The 🧭 callout with the guidance "Open with the takeaway: two or three sentences the reader should be able to say afterwards, and what they are asked to decide or do."
- One 💡 callout, no background, titled "<Shape>: reasoning chain": the shape file's Reasoning chain word for word, its takeaway line, then "Delete this callout once the page answers it; the page's headings come from its content."

| Shape | Cover | Accent | Placeholder icon |
|---|---|---|---|
| Spec | `gradients_6` (blue) | Blue | 📐 |
| Incident | `solid_red` | Red | 🚨 |
| Investigation | `gradients_5` (purple) | Purple | 🔎 |
| Handoff | `gradients_8` (teal) | Green | 🤝 |
| Decision brief | `gradients_2` (orange-red) | Orange | ⚖️ |

A cover is at `https://www.notion.so/images/page-cover/<name>.png`. On a page made from a template, the 🧭 callout carries the page's takeaway, and the reasoning callout is deleted once the page answers it.

A shape file's Reasoning chain is the only source of its template's reasoning callout. When a chain changes, replace that callout in the shape's template in each workspace in the same change, then read the template's blocks back. Done when each template holds exactly the 🧭 callout and the reasoning callout, and the steps match the shape file word for word.

## Cold read and prose

The cold reader's page, and the text the Prose check reads, is the `notion-pages` skill's markdown read-back of the built page, saved to `COLD-<n>-page.md`, with each `<embed …>` line replaced by that diagram's caption and no child page's content. A difference the read-back caused, such as a callout read back as a plain paragraph, is not a mismatch.

## Comments

The user comments on blocks in Notion. Read every open thread on every page of the artifact as the `notion-pages` skill says, and reply on each thread there. An amendment callout, saying what changed and why, goes only on a page someone else owns.
