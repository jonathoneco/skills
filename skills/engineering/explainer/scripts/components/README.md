# Components

What a page's HTML can use. `blocks.ts` renders the marked blocks, `shell.ts` wears every page (head, theme tokens, rail, agent entry, foot), and `base.css` styles both from the suite's tokens. Read this before writing a page.

## Marked blocks

An element the kit knows. Each one needs its closing tag. Every target renders it: the page as below, Notion and the cold copy as the block named.

| Write | The page shows | Notion |
|---|---|---|
| `<x-takeaway>…</x-takeaway>` | The takeaway, ruled in the accent colour | 🧭 callout |
| `<x-ask>…</x-ask>`, one per ask, side by side | One "What you decide after reading" box; `heading="…"` on the first renames it | Heading and numbered list |
| `<x-call id="…"></x-call>` | A decision card from `calls.yaml`: your framing inside the tag, the options table, the pick, the ruling, then a `<figcaption>` from inside the tag | Framing, native table, 💡 pick |
| `<x-call id="…" form="row"></x-call>`, side by side, inside a `<figure>` | One small-calls table, a row each; `where="…"` sets the pill's place | Native table |
| `<x-call id="…" form="pill">place</x-call>` | The call's state pill, such as "open · Inbox Q3"; the text inside is the place | Coloured bold text |
| `<x-fact id="…"></x-fact>` | The fact's value from `facts.yaml`, inline; the agent context lists its source and grade | The value |
| `<x-figure id="…" class="wide"></x-figure>` | The drawing from `figures/<id>/`, the page's key under the first figure with marks, and the caption; `class="wide"` spans the wide column | Still-frame picture, caption beneath |
| `<x-detail summary="…">…</x-detail>` | A closed `<details>` for optional depth | Toggle |
| `<x-caveat heading="…">…</x-caveat>` | A note ruled in the critical colour | ⚠️ callout |
| `<x-pages></x-pages>` | The hub's numbered reading order from `suite.yaml`: each page's title, question and what it holds | Numbered list with page mentions |

## Classes

| Class | On | Shows |
|---|---|---|
| `eyebrow` | `<p>` above the `<h1>` | Small capitals; the kit adds the page's thread chip to the first one |
| `muted` | any | The secondary ink |
| `scroll` | a `<div>` around a wide table or code block | Scrolls sideways inside itself |
| `wide` | a top-level `<figure>` | Spans the wide column |
| `case` | a `<div>` | The worked case, set apart (Notion: 📖 callout) |
| `pill open`, `pill waiting`, `pill settled` | `<span>` | A state pill; prefer `<x-call form="pill">` for a call |
| `chip` | `<span>` | An outlined chip, coloured by a status class |
| `critical`, `warning`, `good`, `waiting` | any | The status colours |
| `hl`, `c` | a `<span>` inside `<pre>` | A highlighted line, a comment |

## What the kit changes outside marked blocks

Everything else is an **island** and reaches the page byte for byte. The kit adds an `id` to each `<h2>` that has none, for the rail, and puts the thread chip in the first `.eyebrow`. `data-group="…"` on an `<h2>` groups the rail's links. An island that holds a script or a control names its still frame in `data-still="…"`, or `check` fails.

## Adding a component

A part a second page could use becomes a component, in one change: its renderer in `blocks.ts` (or its class in `base.css`), its Notion and cold mapping in `../backends/markdown.ts`, a row in the tables above, a use in `../examples/lunch-orders/`, and the golden files updated with `KIT_UPDATE=1 ../render test`.
