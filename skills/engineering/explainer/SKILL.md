---
name: explainer
description: "Explainer: use when the user asks for an explainer or a reader page: how something works, a spec page, a findings, incident, or investigation report, a decision brief, or a handoff page that onboards a person to a workflow."
---

# Explainer

The bar: a reader who never opens the source sees what happens and why, and can make each call that is theirs. Their coding agent acts from the page's agent context without digging the evidence up again.

You write every page yourself, as a teacher who knows what this one reader has not seen. A page is one self-contained HTML file. Beside it sits its **agent context**, `<page>.context.md`: what the reader's agent needs to act, and the source and grade of each claim.

- A walk through a pull request or a diff goes to a guided-review skill, where one is installed.
- When the page will go to Notion, because the ask says so or the install's rules send it there, read [notion.md](notion.md) before step 3.
- A draft or report made before this skill was called is source material. Every step still runs.
- Reading across a repo goes to an evidence run. A page with four or more diagrams sends each to a diagram run, side by side. For either, read [runs.md](runs.md).
- A change to this skill leaves existing artifacts as they are; rebuild one only when the user asks.

Every file of the work lives in one **build folder** under the effort's notes: the suite's sources ([build.md](build.md)), `PUBLISHED.md` with the artifact's id and links on its host, and each helper run's brief and result. Renders, and other screenshots of 1 MB or more, stay out of the notes ([build.md](build.md), Commands), except the cold read's, which stay in the build folder.

## 1. Frame

Take the shape from the ask, and read its file:

- [spec.md](spec.md): presents or settles a design.
- [incident.md](incident.md): something broke.
- [investigation.md](investigation.md): answers an open question with evidence, including a review's findings.
- [handoff.md](handoff.md): onboards a person to a workflow.
- [decision-brief.md](decision-brief.md): puts calls in front of the user.
- A page that explains how something works today, with nothing proposed: [spec.md](spec.md)'s Reasoning steps 1 to 4 and 6. Its takeaway carries how it works and how it fails, its asks may be none, and spec.md's page rules for today against the proposal and for what is outside the work do not apply. When the reader rules on a proposed change to what the page explains, the page is a spec: run all eight steps.

Write three things in the effort's notes (the `agent-notes` skill):

- **The reader:** the one person the page is for, what they will decide or do after reading, and what they have not seen. That list holds each term, system, earlier decision, and premise the page needs. Your own context from this session counts as not seen. Note how this reader learns when the user or their rules say; with no word on it, the reader learns by seeing.
- **The takeaway:** two or three sentences the reader should be able to say after reading.
- **The asks:** what the reader is asked to decide or do.

Done when the notes hold all three, and the not-seen list names every term, system, earlier decision, and premise that the takeaway and the asks use. Rewrite the takeaway and the asks when step 2 changes them.

## 2. Reason

Work the shape file's Reasoning steps. Three things hold for every shape:

- **Trace the worked case.** Pick one real, named record and walk it through the mechanism, hop by hop, using only rules you can state. A hop that no stated rule produces is a finding: a gap in the design, or a rule you have not read yet. When no real record exists, build a case and label it as built.
- **Sort the calls.** A call is anything that waits on a ruling. Sort findings and open questions as the `sort-findings` skill says. Each call gets its options, what each option means for each person it affects, and your pick. A call is **small** when it is cheap and easy to undo either way, and neither option changes what the reader or the product's users see or do. A call that is not small also gets its cost and what result would reverse the pick, as the `weighing` skill says. Mark each call open, waiting (with the measurement it waits on), or settled (with the ruling that settles it).
- **Grade the claims** as the `grading-evidence` skill says. Each claim the page rests on goes into the agent context with its source and its grade.

Several judgments that the reader makes apart from each other need several pages: read [several-pages.md](several-pages.md).

Done when the worked case is traced to its end, every call has its options, pick, and state, and each claim the page rests on has its source and grade in the agent context. Post the takeaway and the asks to the user, then carry on. A correction from the user reopens this step.

## 3. Storyboard, then write

First the **storyboard**: the page as a sequence of frames, in the order the reader needs them. A frame is one figure with its caption: a diagram, a screenshot, a real record, a table, or a code view. [figures.md](figures.md) says how to choose each one.

- The first frame shows the whole subject in one picture. On a hub it is the numbered reading-order list, on an incident page the ranking, and on a decision brief the calls and which call each depends on. It sits directly under the takeaway and the asks, with no prose between; a date or a "read at" line is part of the takeaway. Each part in it carries a label that says what the part does, so the frame teaches its own terms.
- Each idea the reader must hold gets a frame. So does each hop of the worked case that changes what the reader believes, and each call whose options differ in a way a picture can show.
- A caption states the one claim its frame shows.

Write the storyboard in the notes, one line per frame: its question and its caption. Done when a person who reads only the captions, in order, would reach the takeaway.

Then write the prose, as the `technical-writing` skill says. The page opens with the takeaway, held to the two or three sentences in the notes, and the asks. Prose joins the frames: it says what a frame cannot show, such as why a part is there, what it costs, or what follows. More than one screen of prose with no frame is a place to add a frame or cut.

- State the central idea, the one mechanism or change the rest depends on, before any detail that leans on it.
- Introduce each thing the reader has not seen where it is first needed: in a frame's labels or caption, or in the sentence that first uses it. A block of definitions ahead of the first frame is prose to move into frames.
- Set the worked case apart, above the first step that uses it.
- Give each thing one name, the source's name, everywhere.
- State what is true now. Round history and what you checked stay in the notes, except what the shape file asks the page to show. A section that reports live state, such as code, records, or a ticket, names what it read and when, such as a commit or a date.
- Each claim names who is affected, the cause, and the change. A claim reads at its grade, worded as the `grading-evidence` skill's table says. A partial win is stated as partial.
- A call reads as its state. Around an open call, the prose holds each outcome. Each call that is not settled shows its options to the reader, in a decision card or a row of the small-calls table, as [decision-brief.md](decision-brief.md) says.
- The human side holds what changes how the reader acts. Exact paths, commands, queries, and record ids go to the agent context, under the same names the page uses, written as instructions.

Done when the page's text and its agent context are written, and each item on the reader's not-seen list is taught where it is first needed, or cut.

## 4. Build

Build the page as [build.md](build.md) says, from the design plan it asks for, written into the notes before any page code. Draw each frame of the storyboard as [figures.md](figures.md) says. Read [scripts/components/README.md](scripts/components/README.md) before writing a page.

Done when each frame of the storyboard is on the page and `render <suite> --to check` passes ([build.md](build.md), Check).

## 5. Check

- **Shape checks:** run each check the shape file names, when it names one.
- **Caption walk:** on the built page, read only the figures and their captions, in order. They reach the takeaway, no figure needs the prose to be read, and only the takeaway and the asks sit above the first figure, apart from the rail's fold line.
- **Facts:** read again any live state the page reports. Trace the worked case on the built page: each hop follows from a rule the page states.
- **Cold read:** run it once, as [cold-read.md](cold-read.md) says. Fix what it found, on the page. When its takeaway or its asks differ from yours, fix the page and run it once more. A second read that still differs goes to the user at hand-over, as both takeaways.
- **Prose:** check the built text against the `technical-writing` skill.

Done when every check above passes, or is set aside for the user as it says, and each item in the third list of the last `COLD-<n>.md` is taught on the page, or kept for the user at hand-over with the reason it stays.

## 6. Hand over

Publish the page and its agent context together, as the install's rules say, and open the agent context from the published page's link to it. With no rule, both stay local files. Give the user the link or the path, with what step 5 left for them.

The user comments on the page. For each round:

- Read every open thread. An objection to how a page reads often shows reasoning skipped in step 2.
- Record each ruling in the notes. Fold it into the page where it belongs in the argument, so the page reads as if written with the ruling known. Remove what the ruling makes stale.
- When the user kills a line, find every line of that kind on every page.
- Fold each ruling into its source file, such as a call's `state` and `ruling` in `calls.yaml`, and render again; only the pages that cite it rebuild. Run step 5's facts and prose checks, publish a new version, and reply on each thread with what changed.

Done when the user has the link or the path and, after each round, every open thread has a reply that says what changed.
