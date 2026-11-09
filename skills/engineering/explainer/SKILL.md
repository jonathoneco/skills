---
name: explainer
description: "Explainer: use when the user asks for an explainer, a findings report, or a page about a design, incident, investigation, decision, or handoff."
---

# Explainer

The bar: a reader who never opens the code sees what happens, why, and what is theirs to decide. Their coding agent acts from the same page and its agent context without digging the evidence up again.

The **author** is this session: it reasons, makes or asks for every ruling, and writes every page. A page is one self-contained HTML file. Terms below holds the words this skill uses, and How a page teaches, after step 6, holds how a page teaches and is laid out. [diagrams.md](diagrams.md) holds how to decide on and draw a diagram.

**Notion:** when the ask names Notion, read [notion.md](notion.md) before step 3. It builds the same content as Notion pages.

## Terms

- An **artifact** is the whole explainer; a **page** is one HTML file in it. The **hub** is the page a multi-page artifact opens on, which links the others.
- "The user" is the person the explainer works for. "The reader" is the one person the artifact is written for, often the user. "The product's users" are the people who use the product the artifact describes.
- The **takeaway** is two or three sentences the reader should be able to say after reading, plus the **asks**: what they are asked to decide or do.
- A **call** is anything awaiting a ruling.
- A **working set** is what the reader must hold in mind at once to make one judgment.
- The **worked case** is one real, named record that runs through the artifact; an incident report has one per failure mode.
- A **journey** is one worked case walked through the flow, step by step.
- **Ruling depth** is how a ruling is given: what was decided, why, what was considered and turned down, and where the ruling is recorded.
- The **agent context** is a Markdown file beside a page, holding what the reader's coding agent needs (Human side and agent context).

Open a todo list before step 1. Its first todo loads the `principle-*` skills the steps below name; then one todo per step, each checked off when its Done when holds, or marked `skip: <reason>`. The run is done when the user has the link to a build that passed step 5; each comment round after that ends as step 6 says.

## 1. Shape and frame

Take the shape from the ask; ask the user only when two shapes fit equally well.

- [spec.md](spec.md): settles or presents a design ("show me the design").
- [incident.md](incident.md): something broke; shows each failure mode and what fixes it.
- [investigation.md](investigation.md): answers an open question with evidence, including a review's findings.
- [handoff.md](handoff.md): onboards a person to a workflow and its tools.
- [decision-brief.md](decision-brief.md): puts calls in front of the user for a ruling.

Then set the path from the shape's usual split and the ask:

- **One page:** the author reasons, writes, and builds it in this session. Its files sit beside the effort's notes (the `agent-notes` skill): `<page>.html`, `<page>.context.md`, and the cold read's `COLD-<n>` files. Screenshots and renders of 1 MB or more go to `~/.local/state/agent-runs/<effort>/`. The only background run is the cold read.
- **Several pages:** the full path in [full-path.md](full-path.md): the user checks the takeaway before any page is written, a build folder holds the source, and scratch agents do the evidence reading, the diagrams, and the cold read.

Done when the effort's notes name the shape and the path.

## 2. Reason

*Principles: `principle-experience-first`, `principle-explain-the-number`.* **This is the skill.** Writing and building are mechanical once the takeaway is backed.

Write each answer, with its evidence, in the effort's notes. Each claim an answer rests on becomes a row in the effort's **ledger** as it is read: the claim, its source, the commit or time it was read, and its grade as the `grading-evidence` skill says. **Ledger:** Done when every source the session read, and every source the user or the effort's notes name on the subject, has its rows.

1. **Reader.** Who is the one person this is for, and what will they decide or do after reading? In the notes, write their **profile**: what they bring, and what they lack (each term, system, earlier decision, and premise the page needs that they have not seen). Count the session's own context as lacked unless the reader was there; that is the curse of knowledge. The profile stays in the notes. Done when the notes hold it.
2. **Rulings.** Which rulings already bind this subject? Done when each is listed with where it is recorded, and any the artifact conflicts with is named.
3. **Names.** What does the source call each stage, step, group, and owner of each behavior and label? Done when each has one name, and a proposed name or disputed owner is marked open.
4. **The shape's chain**, in its order.
5. **Sort** every finding, open question, and recommendation the chain has not already sorted, as the `sort-findings` skill says. Each call carries your pick as a recommendation, and stays *open* until the user rules it. The page writes an open call as the reader's to make. Done when each has its bucket, and each call carries your pick.
6. **Ripe.** Can each call be ruled with what the artifact shows? Done when each call that waits on a measurement or an undrawn part is marked coming (Calls below).
7. **Pages.** One working set stays on one page. For several working sets, read [full-path.md](full-path.md) and map each judgment to a page as its Splitting into pages says. Done when each page is named with its working set. A second working set moves a one-page artifact to the full path.
8. **Diagrams.** For each page's working set, work [diagrams.md](diagrams.md)'s Reasoning. Done when diagrams.md's Reasoning completion criterion holds for every page's working set.
9. **Takeaway.** Write it and the asks as The reader and the takeaway below says, built from the sorted findings: it carries the strongest finding and names every open call, with what the shape's chain says it carries. Done when it is two or three sentences in the notes and names each ask.

Done when step 9 is written and every claim it rests on has its ledger row. Then post the takeaway and the asks to the user in chat. On the full path, wait for their check as [full-path.md](full-path.md) says; otherwise carry on, so a wrong takeaway can be caught while the page is built.

## 3. Write

Load the `technical-writing`, `unslop`, and `asd-ste100` skills before the first sentence. Load `dataviz` when a page carries a chart, and `writing-shape` when the user handed over raw notes to build from.

Write each page's text yourself, from your own understanding, by How a page teaches below, carrying the answers the shape file's Reasoning reached, laid out as its On the page says. Introduce each lacked item the way a teacher does: in the sentence that first needs it, in a clause or a short paragraph, inside the story. Every section moves the reader toward the takeaway. When the prose needs a fact you haven't read, read its source and add its ledger row. Write each page's agent context, and draw each diagram.

Done when every lacked item is introduced where it is first needed, or cut from the page, and each page named in step 2's Pages has its text and its agent context.

## 4. Build

Build each page as the `html` skill says. Load `web-artifacts-builder` only when the reader must operate something on the page, such as trying an input and seeing the result.

Each page also holds what only this skill knows about its reader:

- The takeaway and the asks, first after the title (The reader and the takeaway below).
- The worked case, set apart above the first step.
- Each call shown as decision-brief.md's On the page and Decision cards say, with its state beside it: open or coming. After a ruling, fold the decision into the explanation and record the ruling in the notes and agent context, as step 6's rewrite says.
- Optional depth, such as further evidence, raw data, or a long reference table, folded behind a `<details>` block. What the reader must read, such as a journey or a rule, stays open on the page.
- A link in the page's foot to its agent context.

Done when every page and its agent context are built files, one pair per page named in step 2's Pages, each page holds the parts above, the `html` skill's browser inspection finds nothing left to fix, and a handoff's privacy grep passes.

## 5. Check

*Principles: `principle-prove-it-works`.* Run these on the built pages. The user sees the pages only once these hold:

- **Cold read**, on the first version and after a change to the takeaway, the asks, or explanatory prose, as Cold read below says; run the other checks while it works. Done when its takeaway and ask match yours and its list of unexplained items is empty. When either fails, fix the prose that let the reader land elsewhere or leaned on what they lack, not the test, and run it again on the rebuilt page. When two rebuilt rounds still land elsewhere, bring both answers to the user with the takeaway.
- **Facts:** live state the pages report is re-read after the latest build, and a claim is re-checked when its source has moved past the commit in its ledger row.
- **Prose:** run `technical-writing`, `unslop`, and `asd-ste100` again on the text of each `.html` file the build changed; every substantive line also passes Every line below.

Done when every check holds on the latest build. When one fails, change the page, rebuild, and check the new build.

## 6. Publish and hand over

Publish the pages as the install's rules say; the rules name the host and who may open a page, such as Artifact Server (the `artifact-server` skill). When no rule names a host, the pages stay local files. A multi-page artifact publishes as one artifact: the hub first, then the other pages, then each agent context file. Give the user the link to the hub, or to the one page, or its path. Done when the user has it.

Then work each round of comments. The user comments on the page and tells the author; read every open thread on every page through the host's comment route, such as the `artifact-server` skill's. Each round:

- An objection to a page's presentation usually surfaces reasoning skipped in step 2; look for that first.
- A comment that explains a term may be context rather than a request for change. Ask which before renaming anything.
- Record each ruling in the effort's rulings note (the `agent-notes` skill).
- Reread the whole page against its takeaway, and restate the takeaway when the rulings moved it. Rewrite the prose wherever a ruling lands, so the page reads as if written fresh with the ruling known. A ruling's answer goes where it belongs in the argument, which is often not where the comment was left. Rewrite or remove every sentence it makes stale.
- When the user kills a line, generalise the kill to its pattern: they are correcting a genre, not a sentence. Re-sweep every page against Every line below, not only the page they named, and report what was removed so they can recall any of it.
- Rebuild the page, run step 5 on the new build, and publish it as a new version.
- Reply on each thread with what changed and where. The user resolves the thread.

A round is done when its pages pass step 5 and every thread from it carries a reply saying what changed, or a question for the user.

## How a page teaches

These hold for every shape and both builds.

### The reader and the takeaway

- Write the takeaway before the prose. Each page opens with it in plain words, the asks included; on a multi-page artifact the hub carries the whole takeaway and each page opens with its part of it.
- Everything on the page serves the takeaway. A fact, section, or diagram that doesn't is left off, however true or hard-won.
- The page states what is true now. The author's own records stay in the notes: the reader's profile, versions and round history, ruling ids and dates, "ruled" language, instructions to other owners, notes on what was or wasn't checked, and a count that drifts. Where a fact is uncertain, the claim says so (Numbers and claims). A dated status line belongs only on a page whose job is a snapshot, such as a handoff's "where this stands".

### Explaining

- State the central idea, the one mechanism or change the rest of the page depends on, before any detail that leans on it.
- A term the author coined while working is introduced like any lacked item, by what it does in product terms, or replaced by a plain phrase. Several new terms at once get a glossary table under the takeaway.
- A metaphor may name one mechanism, glossed once with its literal meaning, then reused bare ("the doorway, the one builder every endpoint passes through"). It names; it never states what happens.

### Order

- Between the takeaway and the first section sits at most a small strip, such as a glossary table or a today-against-the-design pair.
- Order steps by what triggers them, one step per trigger. A step that sits out of sequence opens with a line saying why it is there.
- Follow every item to its end: what clears it, who acts, and what happens next.
- A set of values or cases is listed one line per member, in the order they are tried.
- A dense reference table, such as the terms, states, and values the reader looks up while reading, goes at the end.
- Emphasis grows with rarity: an event that happens in most journeys gets plain text, and a rare one is set apart.
- One name and one colour per thing, everywhere it appears: prose, labels, diagrams, and tables. A word that covers several kinds of thing is split into their names.
- The text beside a diagram says what the diagram can't show, such as why a part is there or what it costs. The parts and arrows it draws are stated once, in the diagram.

### Every line

Every substantive line passes these; a line that fails joins one that passes, or goes.

- **Felt stake.** For every claim, point at three things in order: what the reader or the product's users suffer, the quiet cause, and the change. A line with vibe and no mechanism is a slogan; a line with mechanism and no stake is trivia. Both go.
- **One anchor per claim:** a name, a number, or a mechanism, never a stack. Too vague: "Logic gets a home." Too technical: a line number in a 15,600-line file. Right: "The staging logic becomes its own class, with a name and a short list of what it can touch." Big numbers live in a row of key figures, a table, or a diagram, not inside sentences.
- **Actors as they are.** Agents read, write, and trace most code; humans brief, review, decide, and get paged. Frame every scenario that way.

### Calls

- A call appears on the human side only when the reader can make it there: each option carries its consequence for the product's users, or for the reader, and its cost. Its form is set by decision-brief.md's On the page and Decision cards: a card for a call that isn't small, one line for a small call.
- An open call (step 2's Sort) reads as open wherever the page touches it: the prose around it holds each outcome.
- A call waiting on a measurement is listed as coming, with what it waits on ("once the retry rate is measured"), and is not asked.

### Numbers and claims

- Each number and claim meets the `grading-evidence` skill and carries its grade in that skill's page wording, so a reader can tell what was seen from what was inferred. The query behind a number goes to the agent context.
- Draw the pattern supported by the source records.
- A partial win is stated as partial ("one corner fixed; the rest still pays"). One overclaim taxes every other number on the page.
- A figure drawn for illustration, or a case constructed because no source covers it, is labelled as such.

### Human side and agent context

The test for each piece: would the reader act differently after reading it, before they start? If yes, it goes on the human side. If it matters only once someone is executing, it goes to the agent context.

- Human side: the takeaway, stated so a reader can stop after the first screen; one short real result per claim; tradeoffs and costs that bear on the choice; the code the reader judges, such as snippets of the shapes the design adds or changes, schemas, and class and ownership diagrams, each named by its symbol; further evidence in a `<details>` block.
- Agent context: `<page>.context.md`, published beside the page and linked from its foot, where the reader's agent goes to act on the artifact and to answer the reader's questions about it. It holds instructions, evidence, the reasoning behind each part, and any depth that would bury the human side: exact paths, commands, queries, line references, sequences, gates, edge cases, and the worked case's ids and states. Anchor each entry to the exact term or entity the human side uses, then attach the rest under it. Write what the agent does as instructions: imperative, one rule per line, each with its check. A diagram there is a Mermaid code block, which agents read and people edit in place.
- The agent context names each part as the page does. Where a part rests on a ruling, it gives the ruling at ruling depth, in the page's words, with the path of the file that records it.

## Cold read

**Cold read:** the cold reader gets the page and the profile. Into `COLD-<n>.md` it writes the takeaway, the ask, and every term, system, or premise the page used before it explained it, for that reader. The page publishes when that list is empty.

It runs as an `explainer cold read` scratch agent (the `scratch-agents` skill), told to change no file except its `COLD-<n>.md`. `n` counts cold reads in the effort, from 1. Copy the profile from the notes to `COLD-<n>-profile.md` beside the page. Brief the agent with this prompt:

```text
You are the reader the profile describes. These files are everything that reader has: <page path> and <COLD-n-profile.md path>. Read those files and nothing else, no other file, note, repo, or search.
Then write to <COLD-n.md path>, in your own words and nothing else:
1. In two or three sentences, what this page wants its reader to understand.
2. What the reader is asked to decide or do.
3. Every term, system, or premise the page used before it explained it, for this reader, each with the sentence where it first appears. Write "none" when there are none.
```

A multi-page artifact's cold read puts the hub and each page's file, in reading order, in place of <page path>.
