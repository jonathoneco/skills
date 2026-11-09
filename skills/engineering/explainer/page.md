# Page

How a page is laid out: which element carries what, how lines and emphasis read, how pages link, and how a page is rewritten after rulings. Read at Write and at each comment round; [presentation.md](presentation.md) holds how a page reasons and teaches.

## Across pages

- Each fact is stated in full on one page. Another page that needs it names the fact in one line and links to that page.
- The hub holds two things in order:
  1. The takeaway and the asks, with today against the design where the artifact proposes a change.
  2. **Read in this order:** each page, numbered, as a link with the one question the reader answers there ("Is the wiring right?") and a line on what it holds. A page for the user's rulings comes first, marked as the place to rule.

## Rewriting after rulings

After each round of rulings, reread the whole page against its takeaway. Restate the takeaway when the rulings moved it, then rewrite the prose wherever a ruling lands, so the page reads as if written fresh with the ruling known. A ruling's answer goes where it belongs in the argument, which is often not where the comment was left, and every sentence it makes stale is rewritten or removed.

The user calibrates by example. When they kill a line, generalise the kill to its pattern before the next pass: they are correcting a genre, not a sentence. Then re-sweep every page against Every line, not only the page they named, and report what was removed so they can recall any of it.

## Order

- Between the takeaway and the first section sits at most a small strip, such as a glossary table or a Today → Designed pair.
- Order steps by what triggers them, one step per trigger. A step that sits out of sequence opens with a line saying why it is there.
- Follow every item to its end: what clears it, who acts, what happens next.
- A dense reference table, such as the terms, states, and values the reader looks up while reading, goes at the end.

## Lines

- Density per line is the problem, not total length. Related sentences share a paragraph; a run of four or more one-sentence lines at the same weight becomes a paragraph, a list with a bold lead word on each line, or a row of key figures.
- When the content is right but reads as prose or labelled paragraphs, keep the words and change the element: a list, a table, a box, columns, or one diagram.
- One name and one colour per thing, everywhere it appears: prose, labels, diagrams, tables, boxes. A word covering several kinds of thing is split into their names.
- A set of values or cases is enumerated, one line per member, in the order they are tried.
- The text beside a diagram says what the diagram can't show, such as why a part is there or what it costs; the parts and arrows it draws are stated once, in the diagram.

## Emphasis

- The worked case sits in its box above the first step.
- Emphasis grows with rarity: an event that happens in most journeys gets plain text, and a rare one earns a box.
- Two owners' lists sit in two columns, each headed by its owner and when it applies.

## Elements

Which element carries which kind of content, the same on every page of the set. `templates/base.css` styles each class named here. A box is an `<aside class="box <kind>">` that opens with `<p class="label">` naming it in capitals.

| Content | Element |
|---|---|
| Page title | `<h1>`, a 2 to 4 word noun phrase naming the subject |
| Section of the argument | `<h2>`, with `<h3>` below it |
| The takeaway and the asks, the scope | `<section class="takeaway">`, first after the title |
| The worked case, a term card | `box case` |
| What a person sees | `box sees`, labelled "THE CUSTOMER SEES" or "NOBODY SEES" |
| A rule to remember | `box rule` |
| A trap, a warning | `box warn` |
| Done when | `box done` |
| Parked or blocked | `box parked`, `box blocked` |
| A field label on an item | `<span class="label">` before the text: "SEEN IN", "TODAY → AFTER", "WAITS ON". A numbered item joins its number to its title: "12 · The importer remembers the last file" |
| The state of a call | `<span class="chip open">`, `chip coming`, or `chip ruled` |
| Steps or hops with several attributes each | `<table>` in `<div class="scroll">`, one row each; a note column only where a row has a note |
| Peers with one attribute each | `<ul>` with a `<strong>` lead word |
| Two things side by side; two owners' lists; today against the design | `<div class="cols">` with one `<div>` per side |
| Key figures | `<div class="stats">`, one `<div class="stat"><strong>42</strong> what it counts</div>` each |
| A glossary | A short `<table class="glossary">` under the takeaway |
| Optional depth: further evidence, raw data, a long reference table | `<details>` with a `<summary>`. Content the reader must read, such as a journey or a rule, sits flat on the page. |
| A diagram | `<figure class="diagram">` with the drawing and a `<figcaption>`, as diagrams.md says |
| A decision card | `<article class="call">` (decision-brief.md's Decision cards), its pick in `<p class="pick">` |
| Code the reader judges | `<pre><code>`, never decorated |
| A prompt to paste | `<pre class="prompt"><code>`, which wraps its lines |
| The agent context | A link in the page's `<footer>` |

- A box carries what the reader must not miss. A box can hold several elements: a paragraph, then code or a list.
- Table cells hold rich text: a name in bold, a kind as a `label`, a value as `<code>`, a note in `<em>`. Keep columns few and put the long text last.
- Colour comes from the stylesheet's tokens, and its meanings stay fixed across the set. A page that needs a colour the stylesheet lacks adds it as a token in its own `<style>`, with a value for each theme.
