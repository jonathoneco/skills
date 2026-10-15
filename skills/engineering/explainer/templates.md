# Templates

Each workspace's "Artifacts" database carries one template per explainer shape, named for the shape: one per shape in each workspace's Artifacts database. A template carries the shape's look and its reasoning chain, never an outline: the page's headings come from its content.

Find the template by the shape's name among the database's templates. When the route can't list them, ask the user for the template's id once and keep it in the record (the `notion-pages` skill's Build, step 6).

## What every template holds

- Serif type and full width, set on the template page.
- The cover and the placeholder icon, from House themes below.
- The 🧭 callout, background in the accent colour, holding the guidance "Open with the takeaway: two or three sentences the reader should be able to say afterwards, and what they are asked to decide or do."
- One 💡 callout, no background, titled "<Shape>: reasoning chain". Its body is the shape file's Reasoning chain, word for word, as numbered items with each step's label in bold, then its takeaway line, followed by "Delete this callout once the page answers it; the page's headings come from its content."

Nothing else. Child pages are made under the row when the page is built.

On a page made from a template, the 🧭 callout carries the page's takeaway in place of its guidance text, and the reasoning callout is deleted once the page answers it.

## House themes

A house theme is a cover and an accent colour, so a reader knows at a glance which kind of page they opened. The accent colours the 🧭 takeaway callout and any coloured heading. The other callouts keep their own colours on every shape, since those colours carry meaning.

| Shape | Cover | Accent | Placeholder icon |
|---|---|---|---|
| Spec | `gradients_6` (blue) | Blue | 📐 |
| Incident | `solid_red` | Red | 🚨 |
| Investigation | `gradients_5` (purple) | Purple | 🔎 |
| Handoff | `gradients_8` (teal) | Green | 🤝 |
| Decision brief | `gradients_2` (orange-red) | Orange | ⚖️ |
| Talk | `solid_beige` | Gray | 🎤 |

A cover is one of Notion's own, at `https://www.notion.so/images/page-cover/<name>.png`. The placeholder icon is the template's own; the page replaces it with one that names its subject.

## Changing a shape's chain

A shape file's Reasoning chain is the only source of its template's reasoning callout. When a chain changes, update that shape's two templates, one per workspace, in the same change:

1. Find the reasoning callout among the template's blocks, the 💡 callout after the 🧭 one, through the `notion-pages` skill's Routes.
2. Replace it with a new one holding the title, then the chain's steps, its takeaway line, and the closing line as children.
3. Read the template's blocks back. Done when it holds exactly the 🧭 callout and the reasoning callout, and the steps match the shape file word for word.
