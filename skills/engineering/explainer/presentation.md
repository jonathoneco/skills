# Presentation

How an artifact teaches and how it looks, for every shape. Each sentence follows the `technical-writing` and `unslop` skills.

## Terms

- An **artifact** is the whole explainer; a **page** is one Notion page in it. The **hub** is the page a multi-page artifact opens on, which links the others.
- "The user" is the person the explainer works for. "The reader" is the one person the artifact is written for, often the user. "The product's users" are the people who use the product the artifact describes.
- The **takeaway** is two or three sentences the reader should be able to say after reading, plus the **asks**: what they are asked to decide or do.
- A **call** is anything awaiting a ruling.
- A **working set** is what the reader must hold in mind at once to make one judgment.
- The **worked case** is one real, named record that runs through the artifact; an incident report has one per failure mode.
- A **journey** is one worked case walked through the flow, step by step.
- **Ruling depth** is how a ruling is given: what was decided, why, what was considered and turned down, and where the ruling is recorded.
- The **agent context** is a child page of a page, holding what the reader's coding agent needs (Human side and agent context).

## The reader and the takeaway

- Write the takeaway before the prose. Each page opens with it in plain words, the asks included; on a multi-page artifact the hub carries the whole takeaway and each page opens with its part of it.
- Everything on the page serves the takeaway. A fact, section, or diagram that doesn't is left off, however true or hard-won.
- The page states what is true now. The author's own records stay in the notes: versions and round history, ruling ids and dates, "ruled" language, instructions to other owners, notes on what was or wasn't checked, and a count that drifts. Where a fact is uncertain, the claim says so (Numbers and claims). A dated status line belongs only on a page whose job is a snapshot, such as a handoff's "where this stands".

## Explaining

- State the central idea, the one mechanism or change the rest of the page depends on, before any detail that leans on it.
- Explain each term where it first appears, by what it does in product terms, in the reader's words rather than the author's. A term the author coined while working either gets that explanation or is replaced by a plain phrase. Several new terms at once get a glossary table under the takeaway.
- A metaphor may name one mechanism, glossed once with its literal meaning, then reused bare ("the doorway, the one builder every endpoint passes through"). It names; it never states what happens.
- Write in the order the reader needs: what they must know to follow the next paragraph comes before it.

## Every line

Every substantive line passes these; a line that fails joins one that passes, or goes.

- **Felt stake.** For every claim, point at three things in order: what the reader or the product's users suffer, the quiet cause, and the change. A line with vibe and no mechanism is a slogan; a line with mechanism and no stake is trivia. Both go.
- **One anchor per claim:** a name, a number, or a mechanism, never a stack. Too vague: "Logic gets a home." Too technical: a line number in a 15,600-line file. Right: "The staging logic becomes its own class, with a name and a short list of what it can touch." Big numbers live in a callout, a table, or a diagram, not inside sentences.
- **Actors as they are.** Agents read, write, and trace most code; humans brief, review, decide, and get paged. Frame every scenario that way.

## Calls

- A call appears on the human side only when the reader can make it there: each option carries its consequence for the product's users, or for the reader, and its cost. The decision card (decision-brief.md's Decision cards) is its form.
- A call waiting on a measurement is listed as coming, with what it waits on ("once the retry rate is measured"), and is not asked.

## Numbers and claims

- Each number and claim meets the `grading-evidence` skill and carries its grade in that skill's page wording, so a reader can tell what was seen from what was inferred. The query behind a number goes to the agent context.
- Draw the common shape, not the memorable one.
- A partial win is stated as partial ("one corner fixed; the rest still pays"). One overclaim taxes every other number on the page.
- A figure drawn for illustration, or a case constructed because no source covers it, is labelled as such.

## Human side and agent context

The test for each piece: would the reader act differently after reading it, before they start? If yes, it goes on the human side. If it matters only once someone is executing, it goes to the agent context.

- Human side: the takeaway, stated so a reader can stop after the first screen; one short real result per claim; tradeoffs and costs that bear on the choice; the code the reader judges, such as snippets of the shapes the design adds or changes, schemas, and class and ownership diagrams, each named by its symbol; further evidence in a toggle.
- Agent context: a child page titled "Agent context: <page title>", where the reader's agent goes to act on the artifact and to answer the reader's questions about it. It holds instructions, evidence, the reasoning behind each part, and any depth that would bury the human side: exact paths, commands, queries, line references, sequences, gates, edge cases, and the worked case's ids and states. Anchor each entry to the exact term or entity the human side uses, then attach the rest under it. Write what the agent does as instructions: imperative, one rule per line, each with its check.
- The agent context names each part as the page does. Where a part rests on a ruling, it gives the ruling at ruling depth, in the page's words, with the path of the file that records it.
