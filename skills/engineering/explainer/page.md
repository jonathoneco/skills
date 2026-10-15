# Page

How a written page is laid out in Notion: which block carries what, how lines and emphasis read, how pages link, and how a page is rewritten after rulings. Read at Write and at each comment round; [presentation.md](presentation.md) holds how a page reasons and teaches.

## Across pages

- Each fact is stated in full on one page. Another page that needs it names the fact in one line and links to that page with a mention.
- The hub holds two things in order:
  1. The takeaway and the asks, with today against the design where the artifact proposes a change.
  2. **Read in this order:** each page, numbered, as a page mention with the one question the reader answers there ("Is the wiring right?") and a line on what it holds. A page for the user's rulings comes first, marked as the place to rule.

## Rewriting after rulings

After each round of rulings, reread the whole page against its takeaway. Restate the takeaway when the rulings moved it, then rewrite the prose wherever a ruling lands, so the page reads as if written fresh with the ruling known. A ruling's answer goes where it belongs in the argument, which is often not where the comment was left, and every sentence it makes stale is rewritten or removed. An amendment callout, saying what changed and why, goes only on a page someone else owns.

The user calibrates by example. When they kill a line, generalise the kill to its pattern before the next pass: they are correcting a genre, not a sentence. Then re-sweep every page against Every line, not only the page they named, and report what was removed so they can recall any of it.

## Order

- Between the takeaway and the first section sits at most a small strip, such as a glossary table or a Today → Designed pair.
- Order steps by what triggers them, one step per trigger. A step that sits out of sequence opens with a line saying why it is there.
- Follow every item to its end: what clears it, who acts, what happens next.
- A dense reference table, such as the terms, states, and values the reader looks up while reading, goes at the end.

## Lines

- Density per line is the problem, not total length. Related sentences share a paragraph; a run of four or more one-sentence lines at the same weight becomes a paragraph, a list with a bold lead word on each line, or a row of key figures.
- When the content is right but reads as prose or labelled paragraphs, keep the words and change the block: a list, a table, a callout, columns, or one diagram.
- One name and one colour per thing, everywhere it appears: prose, labels, diagrams, tables, callouts. A word covering several kinds of thing is split into their names.
- A set of values or cases is enumerated, one line per member, in the order they are tried.
- The text beside a diagram says what the diagram can't show, such as why a part is there or what it costs; the parts and arrows it draws are stated once, in the diagram.

## Emphasis

- The worked case sits in its callout above the first step.
- Emphasis grows with rarity: an event that happens in most journeys gets plain text, and a rare one earns a callout.
- Two owners' lists sit in two columns, each headed by its owner and when it applies.

## Blocks

Which Notion block carries which kind of content, the same on every page of the set:

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
| A field label on an item | Bold capitals before the text: "SEEN IN", "TODAY → AFTER", "WAITS ON". A numbered item joins its number to its title: "12 · The importer remembers the last file" |
| Steps or hops with several attributes each | Native table, one row each; a note column only where a row has a note |
| Peers with one attribute each | Bulleted list with a bold lead word |
| Two things compared side by side; two owners' lists | Columns, a callout or list in each |
| Today against the design | Two columns, or a table with a Today and an After column |
| A glossary | A short table under the takeaway |
| Optional depth: further evidence, raw data, a long reference table | Toggle, or a toggle heading. Content the reader must read, such as a journey or a rule, is a plain heading with its blocks flat on the page. |
| A diagram the reader looks at | HTML block, static, drawn as diagrams.md says |
| A diagram on an agent context page | Mermaid code block, which agents read back and people edit in place |
| Code the reader judges; a prompt to paste | Code block tagged with its language, `text` for plain text; never decorated |
| Records people add to later | A database, with properties and views, not a table on a page |

- Callouts carry what the reader must not miss. A callout can hold several blocks: a paragraph, then a code block or a list.
- Table cells hold rich text: a name bold in its colour, a kind in bold capitals, a value as code, a note in italics, a step number in gray. Columns start at equal width, so keep them few and put the long text last.
- Notion has nine text and background colours plus default. Map the subject's palette onto them once per artifact. Colour carries meaning, and the meanings stay fixed across the set. The 🧭 callout keeps the accent colour its template gave it.

