---
name: explainer
description: "Explainer: use when the user asks for an explainer, a findings report, or a page about a design, incident, investigation, decision, or handoff."
---

# Explainer

The bar: a reader who never opens the source sees what happens and why, and can make each call that is theirs. Their coding agent acts from the page's agent context without digging the evidence up again.

You write every page yourself, as a **teacher** who knows what this one reader has not seen. A page is one self-contained HTML file. Beside it sits its **agent context**, `<page>.context.md`: what the reader's agent needs to act, and the source and grade of each claim.

- A walk through a pull request or a diff goes to the `guided-review` skill.
- When the ask names Notion, read [notion.md](notion.md) before step 4.
- A draft or report made before this skill was called is source material. Every step still runs.

## 1. Frame

Take the shape from the ask, and read its file:

- [spec.md](spec.md): presents or settles a design.
- [incident.md](incident.md): something broke.
- [investigation.md](investigation.md): answers an open question with evidence, including a review's findings.
- [handoff.md](handoff.md): onboards a person to a workflow.
- [decision-brief.md](decision-brief.md): puts calls in front of the user.

Write three things in the effort's notes (the `agent-notes` skill):

- **The reader:** the one person the page is for, what they will decide or do after reading, and what they have not seen. That list holds each term, system, earlier decision, and premise the page needs. Your own context from this session counts as not seen. Note how this reader learns when the user or their rules say; with no word on it, the reader learns by seeing.
- **The takeaway:** two or three sentences the reader should be able to say after reading.
- **The asks:** what the reader is asked to decide or do.

Done when the notes hold all three. Rewrite the takeaway and the asks when step 2 changes them.

## 2. Reason

Work the shape file's chain. Three things hold for every shape:

- **Trace the worked case.** Pick one real, named record and walk it through the mechanism, hop by hop, using only rules you can state. A hop that no stated rule produces is a finding: a gap in the design, or a rule you have not read yet. When no real record exists, build a case and label it as built.
- **Sort the calls.** A call is anything that waits on a ruling. Sort findings and open questions as the `sort-findings` skill says. Each call gets its options, what each option means for each person it affects, its cost, and your pick with what result would reverse it. Mark each call open, waiting (with the measurement it waits on), or settled (with the ruling that settles it).
- **Grade the claims** as the `grading-evidence` skill says. Each claim the page rests on goes into the agent context with its source and its grade.

Several judgments that the reader makes apart from each other need several pages: read [full-path.md](full-path.md).

Done when the worked case is traced to its end and every call has its options, pick, and state. Post the takeaway and the asks to the user, then carry on. A correction from the user reopens this step.

## 3. Storyboard, then write

First the **storyboard**: the page as a sequence of frames, in the order the reader needs them. A frame is one figure with its caption: a diagram, a screenshot, a real record, a table, or a code view. [figures.md](figures.md) says how to choose each one.

- The first frame shows the whole subject in one picture. It sits directly under the takeaway and the asks, with no prose between. Each part in it carries a label that says what the part does, so the frame teaches its own terms.
- Each idea the reader must hold gets a frame. So does each hop of the worked case that changes what the reader believes, and each call whose options differ in a way a picture can show.
- A caption states the one claim its frame shows.

Write the storyboard in the notes, one line per frame: its question and its caption. Done when a person who reads only the captions, in order, would reach the takeaway.

Then write the prose, as the `technical-writing` skill says. The page opens with the takeaway and the asks. Prose joins the frames: it says what a frame cannot show, such as why a part is there, what it costs, or what follows. More than one screen of prose with no frame is a place to add a frame or cut.

- State the central idea, the one mechanism or change the rest depends on, before any detail that leans on it.
- Introduce each thing the reader has not seen where it is first needed: in a frame's labels or caption, or in the sentence that first uses it. A block of definitions ahead of the first frame is prose to move into frames.
- Set the worked case apart, above the first step that uses it.
- Give each thing one name, the source's name, everywhere.
- State what is true now. Round history and what you checked stay in the notes.
- Each claim names who is affected, the cause, and the change. A claim reads at its grade: seen, or reasoned out. A partial win is stated as partial.
- A call reads as its state. Around an open call, the prose holds each outcome. Each call that is not settled shows its options to the reader, in a card or in a table row.
- The human side holds what changes how the reader acts. Exact paths, commands, queries, and record ids go to the agent context, under the same names the page uses, written as instructions.

Done when the page's text and its agent context are written, and each item on the reader's not-seen list is taught where it is first needed, or cut.

## 4. Build

Build the page as the `html` skill says. Before any page code, write the design plan that the `design-artifact` skill asks for into the notes.

- Typefaces: pick a pair from [fonts/README.md](fonts/README.md) and embed it. The palette and the layout are yours to design for this subject.
- Both a light and a dark theme, following the reader's system setting.
- Draw each frame of the storyboard as [figures.md](figures.md) says.
- Optional depth, such as raw data or a long reference table, folds behind a `<details>` block. What the reader must read stays open.
- The page's foot links to its agent context.

Done when each frame of the storyboard is on the page and the browser shows the page whole at full width and at 390 px, in both themes, with the chosen typefaces loaded.

## 5. Check

- **Cold read:** run it once, as [cold-read.md](cold-read.md) says. Fix what it found, in the prose. When its takeaway or its asks differ from yours, fix the page and run it once more.
- **Caption walk:** on the built page, read only the figures and their captions, in order. They reach the takeaway, no figure needs the prose to be read, and only the takeaway and the asks sit above the first figure.
- **Facts:** read again any live state the page reports. Trace the worked case on the built page: each hop follows from a rule the page states.
- **Prose:** check the built text against the `technical-writing` skill.

Done when the cold reader's takeaway and asks match yours. Unexplained items that are left go to the user with the link.

## 6. Hand over

Publish as the install's rules say. With no rule, the page stays a local file. Give the user the link or the path, with any unexplained items left from the cold read.

The user comments on the page. For each round:

- Read every open thread. An objection to how a page reads often shows reasoning skipped in step 2.
- Record each ruling in the notes. Fold it into the page where it belongs in the argument, so the page reads as if written with the ruling known. Remove what the ruling makes stale.
- When the user kills a line, find every line of that kind on every page.
- Rebuild, run step 5's facts and prose checks, publish a new version, and reply on each thread with what changed.
