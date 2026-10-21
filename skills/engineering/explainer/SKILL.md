---
name: explainer
description: "Explainer: a Notion page that explains a design, incident, investigation, decision, workflow onboarding, or talk. Use when the user says show me the design, or asks for an explainer or a Notion page explaining one of those."
---

# Explainer

The bar: a reader who never opens the code sees what happens, why, and what is theirs to decide. Their coding agent acts from the same pages without digging the evidence up again.

The **author** is this session: it reasons, makes or asks for every ruling, and writes every page. [presentation.md](presentation.md) holds the terms this skill uses and how a page teaches, read from step 1; [page.md](page.md) how a page is laid out in Notion, read from step 3; [diagrams.md](diagrams.md) how to decide on and draw a diagram.

Open a todo list before step 1. Its first todo loads the `principle-*` skills the steps below name; then one todo per step, each checked off when its Done when holds, or marked `skip: <reason>`. The run is done when the user has the link to a build that passed step 4; each comment round after that ends as step 5 says.

## 1. Shape and frame

Take the shape from the ask; ask the user only when two shapes fit equally well.

- [spec.md](spec.md): settles or presents a design ("show me the design").
- [incident.md](incident.md): something broke; shows each failure mode and what fixes it.
- [investigation.md](investigation.md): answers an open question with evidence, including a review's findings.
- [handoff.md](handoff.md): onboards a person to a workflow and its tools.
- [decision-brief.md](decision-brief.md): puts calls in front of the user for a ruling.
- [talk.md](talk.md): a page the user presents from, talking over it.

Then set the path from the shape's usual split and the ask:

- **One page:** the author reasons, writes, and builds it in this session. Its files sit beside the effort's notes (the `agent-notes` skill): `<page>.md`, `<page>.context.md`, each diagram as `diagrams/<name>.html` with its `diagrams/<name>.caption`, and the cold read's `COLD-<n>` files. Screenshots and renders of 1 MB or more go to `~/.local/state/agent-runs/<effort>/`. The only background run is the cold read.
- **Several pages:** the full path in [full-path.md](full-path.md): the user checks the takeaway before any page is written, a build folder holds the source, and scratch agents do the evidence reading, the diagrams, and the cold read.

Done when the effort's notes name the shape and the path.

## 2. Reason

*Principles: `principle-experience-first`, `principle-explain-the-number`.* **This is the skill.** Writing and building are mechanical once the takeaway is backed.

Write each answer, with its evidence, in the effort's notes. Each claim an answer rests on becomes a row in the effort's **ledger** as it is read: the claim, its source, the commit or time it was read, and its grade as the `grading-evidence` skill says.

1. **Reader.** Who is the one person this is for, what do they already know of the subject, and what will they decide or do after reading? Done when the notes answer all three.
2. **Rulings.** Which rulings already bind this subject? Done when each is listed with where it is recorded, and any the artifact conflicts with is named.
3. **Names.** What does the source call each stage, step, group, and owner of each behavior and label? Done when each has one name, and a proposed name or disputed owner is marked open.
4. **The shape's chain**, in its order.
5. **Sort** every finding, open question, and recommendation the chain has not already sorted, as the `sort-findings` skill says. Done when each has its bucket, and each call carries your pick.
6. **Ripe.** Can each call be ruled with what the artifact shows? Done when each call that waits on a measurement or an undrawn part is marked coming (presentation.md's Calls).
7. **Pages**, as Splitting into pages says. Done when each page is named with its working set. A second working set moves a one-page artifact to the full path.
8. **Diagrams.** For each page's working set, work [diagrams.md](diagrams.md)'s Reasoning. Done when each relationship it names is either a sentence in the notes or a diagram with its question, parts, and place.
9. **Takeaway.** Write it and the asks as presentation.md's The reader and the takeaway says, carrying what the shape's chain says it carries. Done when it is two or three sentences in the notes and names each ask.

Done when step 9 is written and every claim it rests on has its ledger row. Then post the takeaway and the asks to the user in chat. On the full path, wait for their check as [full-path.md](full-path.md) says; otherwise carry on, so a wrong takeaway can be caught while the page is built.

## 3. Write

Write each page's text yourself, from your own understanding, by presentation.md and page.md, carrying the answers the shape file's Reasoning reached and laid out as its On the page says. When the prose needs a fact you haven't read, read its source and add its ledger row. Write each page's agent context, and draw each diagram. Then build the pages in Notion as the `notion-pages` skill's Build says, through its Check; each page a row made from its shape's template ([templates.md](templates.md)), with its Shape property set to the shape. A page for a teammate's workspace goes in the Artifacts database the user names; any other place waits on the user's word.

Done when every page and its agent context are built from source files, one pair per page named in step 2's Pages, and a handoff's privacy grep passes.

## 4. Check

*Principles: `principle-prove-it-works`.* Run these on the pages as they stand in Notion. The user sees the pages only once these hold:

- **Cold read**, on the first version and on any round that changed the takeaway, as Cold read below says; run the other checks while it works. Done when its answer matches the takeaway and asks. When it differs, fix the prose that let the reader land elsewhere, not the test, and run it again on the rebuilt pages. A difference the read-back caused, such as a callout read back as a plain paragraph, is not a mismatch. When two rebuilt rounds still land elsewhere, bring both answers to the user with the takeaway.
- **Facts:** live state the pages report is re-read after the latest build, and a claim is re-checked when its source has moved past the commit in its ledger row.
- **Prose:** on each page the build changed, every substantive line passes presentation.md's Every line.

Done when every check holds on the latest build. When one fails, change the source, rebuild the changed pages, and check the new build.

## 5. Hand over

Give the user the link to the hub, or to the one page, and name any setting the route couldn't make. Done when the user has the link.

Then work each round of comments. The user comments on blocks in Notion and tells the author; read every open thread on every page of the artifact, as the `notion-pages` skill's Comments says. Each round:

- An objection to a page's presentation usually surfaces reasoning skipped in step 2; look for that first.
- A comment that explains a term may be context rather than a request for change. Ask which before renaming anything.
- Record each ruling in the effort's rulings note (the `agent-notes` skill).
- Rewrite the source as page.md's Rewriting after rulings says, rebuild the changed pages, and run step 4 on the new build.
- Reply on each thread with what changed and where. The user resolves the thread.

A round is done when its pages pass step 4 and every thread from it carries a reply saying what changed, or a question for the user.

## Splitting into pages

1. Stay on one page when one working set covers everything the reader judges.
2. Otherwise, name what the reader must judge in this artifact, and the working set for each judgment.
3. A page holds one working set. A section that asks the reader to hold two, such as what a person sees and the fields behind it, becomes two pages.
4. Split a working set into its parts only when the reader judges each part on its own, such as one page per domain or per failure mode.
5. The hub links the pages, as page.md's Across pages says.

The shape file says what usually happens for that shape.

## Cold read

A cold read checks that a reader who has only the page lands on the takeaway. It runs as an `explainer cold read` scratch agent (the `scratch-agents` skill), told to change no file except its `COLD-<n>.md`. `n` counts cold reads in the effort, from 1. Save the page's markdown read-back (the `notion-pages` skill's Read-back) to `COLD-<n>-page.md` beside the page's source files, with each `<embed …>` line replaced by that diagram's caption and no child page's content. Brief the agent to write its answer to `COLD-<n>.md` beside it, with this prompt: `Read only <COLD-n-page.md path>. Then write, in your own words and nothing else: first, in two or three sentences, what this page wants its reader to understand; second, what the reader is asked to decide or do.` A multi-page artifact's cold read gets the hub and each page, as separate read-backs, in reading order.
