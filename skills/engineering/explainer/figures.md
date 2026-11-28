# Figures

A figure is anything the reader looks at: a diagram, a screenshot, a real record, a table, or a code view. It sits in the page as a `<figure>` whose `<figcaption>` states the one claim it shows, such as "The webhook writes before the sync reads, so the sync sees the new status."

## Which figures

For each diagram, the `diagrams` skill decides its question, its type, and how much it holds.

- **The whole in one picture.** Where it is a picture of the whole subject, it shows that whole at the level a newcomer needs, with groups folded into black boxes as the `diagrams` skill says. A later frame that opens a box draws the parts outside it faint.
- **A table is a frame** when the reader compares things: options against what each means for each person, today against the proposal, or cases against outcomes.
- **Screenshots.** Where the subject has screens the reader has not seen, take real screenshots and caption each with what to look at. Replace or blur any personal data before the shot.
- **Code beside it.** When the reader also judges code shape, put a code view beside the drawing: pseudocode, a call tree, a file tree, or a `diff` of one of these.
- **The difference, when comparing.** Draw both designs on one layout with the same worked case, and mark the one edge each adds or removes. In a table of today against the proposal, mark each cell that changes.

## Coding across the page

These hold across every diagram on a page, so the reader learns the marks once:

- Each kind of part has its own shape: a person, a store, a queue, a service, a boundary. A person is drawn as a person.
- Each kind of mechanism has its own colour, line style, and arrowhead: such as a read, a write, an event, a direct call, a timer, a webhook, a person acting.
- One key per page states the marks, in the order a reader traces a chain: what triggers, then what reacts. It replaces each diagram's own key. Write it in the notes before the first diagram is drawn. On the page it sits under the first frame that uses its marks.
- A part keeps one colour on every figure.
- A thread the page follows side by side with others, such as a lane or a track, keeps one hue on every figure, card, table, and rail link.
- After the first walk of a case, later walks draw the known path faint and the new wiring strong.
- A diagram the user approved keeps its shape on a rebuild.

## Drawing

Draw each diagram as the `diagrams` skill says for a page, with the design plan's palette and typefaces. A diagram lives in `figures/<id>/` of the suite, and the page places it with `<x-figure id="<id>"></x-figure>`. The folder holds `meta.yaml` (`caption`, the claim; `note`, the rest of the caption; `alt`; `marks`; and for an interactive figure `still` and `states`) and one of three drawing forms:

- `figure.svg`: one drawing for every width. `min_width` in `meta.yaml` sets the width below which it scrolls instead of shrinking.
- `wide.svg` plus `narrow.svg`: the kit shows the narrow drawing when the figure's container is narrower than `narrow_below` (560 px unless `meta.yaml` says).
- `figure.html`: HTML and CSS, for a grid form such as a matrix, a timeline, or lanes of cards.

The page's key of marks is built from `suite.yaml`'s `key` and each figure's `marks`.

- Prefix every SVG id with the figure's name, such as `step2-write`: all figures on a page share one id space.
- At 390 px wide, every label renders at 12 px or larger. A diagram whose labels would be smaller is redrawn top to bottom, for every width.
- A figure takes interaction, such as stepping through stages, picking a case, or a switch between designs, where the `diagrams` skill says it helps. Its still frame, the state it shows before anyone touches a control, shows the caption's claim, because a reader of the caption walk, a print, or a Notion copy sees only that frame. `meta.yaml` names it in `still`, and gives each other state's `name`, `text`, and the `click` selector that reaches it; the kit adds those texts to the agent context. An interactive island outside a figure names its still frame in a `data-still` attribute.
- A figure that runs the reader's own input, such as a simulation, is plain script in the page. It opens at the moment the problem shows, is labelled illustrative, and shows its parameters.
