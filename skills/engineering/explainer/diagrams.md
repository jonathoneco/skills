# Diagrams

How to decide on and draw an explainer's diagrams. A diagram sits in the page as a figure with its caption. Rich diagrams are wanted: colour that carries meaning, the real parts with labelled arrows, the subject's own records. How far to take the richness is the author's judgment per diagram; every diagram the Reasoning keeps is drawn at that richness.

## Reasoning

List every relationship in each page's working set that the reader must understand to reach the takeaway: how parts connect, what happens in what order, who owns what, or how two options differ. Each journey and each failure mode the shape's chain traced is one. Then work these for each relationship, in order, and write the answers into the effort's notes; they are the diagram run's brief:

1. **Question:** what one question does this diagram answer? A diagram that answers two becomes two. The question picks the form:

   | Question | Form |
   |---|---|
   | What exists, and how is it connected? | Topology or system map |
   | What happens over time? | Sequence, timeline, or request trace |
   | What decisions or transformations occur? | Process flow |
   | How can something change? | State diagram |
   | What contains or owns what? | Hierarchy or nested boundary map |
   | How do alternatives compare? | Matrix or aligned comparison |
   | How much, how often, or how fast? | A chart, drawn as the `dataviz` skill says |

2. **Code beside it:** when the reader also judges code shape, such as which function calls which or what a change adds, put a code view beside the drawing as a code block: pseudocode, a call tree, a file tree, or a `diff` of one of these.
3. **Parts:** what are the real parts and connections, taken from the source? Each block is one real thing, each arrow something that happens, and the kinds of mechanism come from the source.
4. **Use:** the reader looks at it, so it is static. Show every explanatory step together. Use interaction when the reader must try an input and see its result. Put explanatory rows in a table below the diagram.
5. **Place:** which page and which section, and what the caption claims.

Done when each listed relationship has a drawing brief, and each brief names one question, its form, source-backed parts and connections, static or interactive use, page, section, and caption claim.

## Rules

- One small diagram per step, showing only that step's arrows. One diagram that carries everything teaches nothing.
- Each kind of part has its own shape and weight: a person, a store, a queue, a service, a boundary, and a transformation each look different, so the reader tells them apart before reading a label. People are drawn as people, and decorative arrows go.
- Type every mechanism. Each kind in the artifact, such as a read, a write, an event, a direct call, a timer, a webhook, a person acting drawn thicker and dotted, or a provider port, gets its own colour, line, and arrowhead. Line style and weight carry the kind too, so the drawing reads for a colour-blind reader.
- Group the legend the way a reader traces a chain: triggers (person, webhook, direct call, timer), then reactions (event, read, provider port).
- One name and one colour per thing, as SKILL.md's Order says.
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

Draw each diagram as the `html-diagram` skill says, inside the page's own `<figure>`. Three things that skill leaves to the page:

- The caption states the one claim the picture shows, such as "The webhook writes before the sync reads, so the sync sees the new status." It is the figure's `<figcaption>`.
- Prefix every SVG id with the figure's name, such as `step2-write`: all the diagrams on a page share one id space.
- At a 390 px wide viewport, every label renders at 12 px or larger. A diagram too wide for that keeps its full size and scrolls sideways inside its figure, or is redrawn top to bottom for narrow screens. Done when the `html` skill's narrow-width inspection shows every label at that size.
