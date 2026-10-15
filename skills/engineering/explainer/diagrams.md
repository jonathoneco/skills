# Diagrams

How to decide on and draw an explainer's diagrams. The frame an HTML block lives in, and what a file needs to work there, is the `notion-pages` skill's; start every diagram from its `html-block-template.html`, which already fills the frame, follows Notion's theme, and fills every shape. Rich diagrams are wanted: colour that carries meaning, the real parts with labelled arrows, the subject's own records. How far to take the richness is the author's judgment per diagram; every diagram the Reasoning keeps is drawn at that richness.

## Reasoning

For each diagram, work these in order and write the answers into the effort's notes; they are the diagram run's brief:

1. **Relationship:** what relationship in the reader's working set, such as how parts connect, what happens in what order, who owns what, or how two options differ, would prose make them assemble themselves? If none, or one sentence says it faster, write the sentence.
2. **Question:** what one question does this diagram answer? A diagram that answers two becomes two.
3. **Parts:** what are the real parts and connections, taken from the source? Each block is one real thing, each arrow something that happens, and the kinds of mechanism come from the source.
4. **Use:** the reader looks at it, so it is a static HTML block (page.md's Blocks). A click is allowed only when operating it is the point, such as trying an input and seeing the result, and never to step through content; stepping through rows hides content, the same fault as a toggle on main content. Rows that explain a diagram go in a native table under it.
5. **Place:** which page and which section, and what the caption claims.

## Rules

- One small diagram per step, showing only that step's arrows. One diagram that carries everything teaches nothing.
- People are drawn as people, and decorative arrows go.
- Type every mechanism. Each kind in the artifact, such as a read, a write, an event, a direct call, a timer, a webhook, a person acting drawn thicker and dotted, or a provider port, gets its own colour, line, and arrowhead. Line style and weight carry the kind too, so the drawing reads for a colour-blind reader.
- Group the legend the way a reader traces a chain: triggers (person, webhook, direct call, timer), then reactions (event, read, provider port).
- The colours are the artifact's Notion palette (page.md's Blocks), one name and one colour per thing as page.md's Lines says.
- After the first journey, later journeys draw the established path faint and highlight only the new wiring.
- A model that compares two designs changes one thing. Anything else it changes, such as capacity or cost, is equalised or stated on the page.
- A diagram the user has already approved keeps its shape on a rebuild: resize and respace it rather than inventing a new one.

## What to draw

Draw as the engineer who has to live with the decision.

- **The mechanism, not its name.** A box labelled "cache" says less than the prose does. The path a request takes through it, the two stores it sits between, and the arrow that disappears when it is removed say what words can't. Draw the parts the argument hinges on, such as the boundary crossed, the hop added, or the data that moves, and leave the rest out.
- **The difference, when comparing.** Draw the two designs on the same layout and the same worked case, with the one edge each adds or removes marked, so the reader can point at what they are choosing between. A separate box per option, connected to nothing, restates the option list.
- **As much as the decision turns on.** A one-hop question is three boxes. A migration that reroutes writes through a queue needs the queue, the writer, the reader, and the ordering arrow.
- **Labels on the arrows.** An unlabelled arrow says only "related somehow"; `writes`, `invalidates`, and `polls every 30s` are information. The legend covers the encoding that repeats; a one-off meaning goes on the mark itself.

## Drawing

- Copy the `notion-pages` skill's `html-block-template.html` and draw inside its `<g id="figure">`. Its `viewBox` is the 670 × 500 frame and it scales with the frame, so draw in those units; its colour tokens carry both themes. It defines a class and an arrowhead for each mechanism kind the Rules name, and a legend grouped as the Rules say: keep the kinds the diagram uses and delete the rest.
- Labels are at least 12px at 670 wide. A label that would overlap another moves to the nearest free spot, with 7px between labels side by side.
- Give every shape an explicit `fill` from a token, or `fill="none"` for an outline: an unfilled shape paints black on a dark ground.
- The caption states the one claim the picture shows, such as "The webhook writes before the sync reads, so the sync sees the new status." It sits in a `.caption` file beside the drawing and goes on the block, not inside the frame, where it would cost height.
- Draw with native shapes (`rect`, `circle`, `line`, `polyline`, `path`) and `<text>`, aligned to a grid: shared baselines, one box height per row, even gaps. Wide flows read left to right; layered stacks top to bottom. Straight segments and right-angle elbows read better than curves.
- Size each box to its longest label: at 12px, allow 7 units of width per character plus 8 units of padding each side. Keep each label to a word or three: the part's name as the page uses it, or the arrow's verb.
- Draw an arrowhead as a `<marker>` in `<defs>`, one per mechanism colour, filled from the same token as its line. Prefix ids per figure, such as `step2-write`, since two files on one page are separate frames but one file with two drawings shares ids.
- Neutral strokes and text use `currentColor` or a neutral token; each mechanism colour is a token applied by class. A hex literal written into the SVG is right in one theme only.
