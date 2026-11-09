---
name: explainer
description: "Explainer: an HTML page that explains a design, incident, investigation, decision, or handoff to one reader. Use when the user asks for an explainer, a report or findings write-up, or a page, in HTML or Notion, explaining one of those."
---

# Explainer

The bar: a reader who never opens the code sees what happens, why, and what is theirs to decide. Their coding agent acts from the same page and its agent context without digging the evidence up again.

The **author** is this session: it reasons, makes or asks for every ruling, and writes every page. A page is one self-contained HTML file. [presentation.md](presentation.md) holds the terms this skill uses and how a page teaches, read from step 1; [page.md](page.md) how a page is laid out, read from step 3; [diagrams.md](diagrams.md) how to decide on and draw a diagram.

**Notion:** when the ask names Notion, read [notion.md](notion.md) before step 3. It builds the same content as Notion pages.

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
6. **Ripe.** Can each call be ruled with what the artifact shows? Done when each call that waits on a measurement or an undrawn part is marked coming (presentation.md's Calls).
7. **Pages**, as Splitting into pages says. Done when each page is named with its working set. A second working set moves a one-page artifact to the full path.
8. **Diagrams.** For each page's working set, work [diagrams.md](diagrams.md)'s Reasoning. Done when each relationship it names is either a sentence in the notes or a diagram with its question, parts, and place.
9. **Takeaway.** Write it and the asks as presentation.md's The reader and the takeaway says, built from the sorted findings: it carries the strongest finding and names every open call, with what the shape's chain says it carries. Done when it is two or three sentences in the notes and names each ask.

Done when step 9 is written and every claim it rests on has its ledger row. Then post the takeaway and the asks to the user in chat. On the full path, wait for their check as [full-path.md](full-path.md) says; otherwise carry on, so a wrong takeaway can be caught while the page is built.

## 3. Write

Load the `technical-writing`, `unslop`, and `asd-ste100` skills before the first sentence. Load `dataviz` when a page carries a chart, and `writing-shape` when the user handed over raw notes to build from.

Write each page's text yourself, from your own understanding, by presentation.md and page.md, carrying the answers the shape file's Reasoning reached, laid out as its On the page says. Introduce each lacked item the way a teacher does: in the sentence that first needs it, in a clause or a short paragraph, inside the story. Every section moves the reader toward the takeaway. When the prose needs a fact you haven't read, read its source and add its ledger row. Write each page's agent context, and draw each diagram.

Done when every lacked item is introduced where it is first needed, or cut from the page, and each page named in step 2's Pages has its text and its agent context.

## 4. Build

Load the `design-artifact` skill. Start each page from [templates/page.html](templates/page.html). Into its `<style>` block paste [templates/base.css](templates/base.css), then one kind stylesheet, picked by the reader:

- [templates/working.css](templates/working.css): the reader is the user, working through a spec, an incident, or an investigation.
- [templates/decision.css](templates/decision.css): a decision brief, or any page whose calls come first.
- [templates/handoff.css](templates/handoff.css): the reader is someone other than the user, such as a teammate taking over the work.

The two stylesheets are the page's design system; `design-artifact` decides only what they leave open. The fonts are the system's own, so each file stays well under 1 MB. Load `web-artifacts-builder` only when the reader must operate something on the page, such as trying an input and seeing the result.

Done when every page and its agent context are built files, one pair per page named in step 2's Pages, every `<style>` holds the base and one kind stylesheet, and a handoff's privacy grep passes.

## 5. Check

*Principles: `principle-prove-it-works`.* Run these on the built pages. The user sees the pages only once these hold:

- **Cold read**, on the first version and on any round that changed the takeaway, as Cold read below says; run the other checks while it works. Done when its takeaway and ask match yours and its list of unexplained items is empty. When either fails, fix the prose that let the reader land elsewhere or leaned on what they lack, not the test, and run it again on the rebuilt page. When two rebuilt rounds still land elsewhere, bring both answers to the user with the takeaway.
- **Facts:** live state the pages report is re-read after the latest build, and a claim is re-checked when its source has moved past the commit in its ledger row.
- **Prose:** run `technical-writing`, `unslop`, and `asd-ste100` again on the text of each page the build changed, as `scripts/page-text.py` prints it; every substantive line also passes presentation.md's Every line.
- **Render:** open each changed page in a browser, in light and dark themes (the `playwright-cli` skill takes the screenshots). Done when no label overlaps another, no diagram is clipped, and every table and diagram scrolls inside its own box.

Done when every check holds on the latest build. When one fails, change the page, rebuild, and check the new build.

## 6. Publish and hand over

Publish the pages as the install's rules say; the rules name the host and who may open a page, such as Artifact Server (the `artifact-server` skill). When no rule names a host, the pages stay local files. A multi-page artifact publishes as one artifact: the hub first, then the other pages, then each agent context file. Give the user the link to the hub, or to the one page, or its path. Done when the user has it.

Then work each round of comments. The user comments on the page and tells the author; read every open thread on every page through the host's comment route, such as the `artifact-server` skill's. Each round:

- An objection to a page's presentation usually surfaces reasoning skipped in step 2; look for that first.
- A comment that explains a term may be context rather than a request for change. Ask which before renaming anything.
- Record each ruling in the effort's rulings note (the `agent-notes` skill).
- Rewrite the page as page.md's Rewriting after rulings says, rebuild it, run step 5 on the new build, and publish it as a new version.
- Reply on each thread with what changed and where. The user resolves the thread.

A round is done when its pages pass step 5 and every thread from it carries a reply saying what changed, or a question for the user.

## Splitting into pages

1. Stay on one page when one working set covers everything the reader judges.
2. Otherwise, name what the reader must judge in this artifact, and the working set for each judgment.
3. A page holds one working set. A section that asks the reader to hold two, such as what a person sees and the fields behind it, becomes two pages.
4. Split a working set into its parts only when the reader judges each part on its own, such as one page per domain or per failure mode.
5. The hub links the pages, as page.md's Across pages says.

The shape file says what usually happens for that shape.

## Cold read

**Cold read:** the cold reader gets the page and the profile. Into `COLD-<n>.md` it writes the takeaway, the ask, and every term, system, or premise the page used before it explained it, for that reader. The page publishes when that list is empty.

It runs as an `explainer cold read` scratch agent (the `scratch-agents` skill), told to change no file except its `COLD-<n>.md`. `n` counts cold reads in the effort, from 1. Beside the page, save its text with `python3 scripts/page-text.py <page>.html > COLD-<n>-page.md` (the script is in this skill's folder; it keeps each diagram's caption where the diagram sits), and copy the profile from the notes to `COLD-<n>-profile.md`. Brief the agent with this prompt:

```text
Read only <COLD-n-page.md path> and <COLD-n-profile.md path>. You are the reader the profile describes.
Then write to <COLD-n.md path>, in your own words and nothing else:
1. In two or three sentences, what this page wants its reader to understand.
2. What the reader is asked to decide or do.
3. Every term, system, or premise the page used before it explained it, for this reader, each with the sentence where it first appears. Write "none" when there are none.
```

A multi-page artifact's cold read gets the hub and each page, as separate text files, in reading order.
