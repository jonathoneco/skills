---
name: ticket
description: Use when writing, checking, or estimating one implementation ticket, or relating two tickets (blocked by, merges after). Holds the bar a ticket meets so a lane can build it without guessing, the ticket kinds, and the chains for writing and checking one.
---

# Ticket

A ticket is built by a **lane**: one agent building one ticket in its own worktree, reporting through its lane engine (the `orchestrating` skill). The lane has only the repo and the ticket, and often runs at low effort.

**The bar:** every implementation detail is exact and verified, so the lane builds what was decided and has nothing left to decide. A shape (a type, schema, signature, table, event payload, or identifier the ticket produces or changes) appears verbatim; a paraphrase is a guess the lane has to resolve. What the lane can open, the ticket names; what it can't, the ticket carries. [contents.md](contents.md) holds the sections and the rules behind this bar. Each ticket has a **kind** (Feature, Bug, Improvement, Refactor or migration, Infrastructure or tooling, Decision, Investigation); [kinds.md](kinds.md) holds each kind's chain.

Write one and Check one each open a todo list before their step 1. Its first todo loads the `principle-*` skills named by the chain's steps and by the ticket's kind in kinds.md; a step's *Principles:* line says where each applies. Then one todo per step, each checked off when its Done when holds, or marked `skip: <reason>`.

## Write one

Input: the brief (the exploration report, the rulings, the effort's shared constraints, the ticket's kind) and the draft file to write.

The run is done when the draft meets the Contents bar, answers every question in its kind's chain, and holds no stop-and-ask line; or when it hands an open question, or one PR's limit, back to whoever briefed you.

1. **Read the brief and the sources it names.** Open a source only to copy a shape verbatim, confirm a quote, or confirm a `[hyp]` or `[spec]` claim a step rests on (the `grading-evidence` skill). A defect ticket's bug is reproduced against current `main` before its steps are written, and the reproduction goes in Evidence. A fact the brief lacks goes back to whoever briefed you as an open question. Done when every step you will write rests on the brief or on a source you opened.
2. **Settle every decision.** *Principles: `principle-fix-root-causes`.* A defect ticket's fix targets the root cause its reproduction shows. A product choice you can't settle, and each choice you settled yourself, goes in a `## DECISION PENDING` section at the top: the question, options with what the product's users see under each, your pick, and a body written assuming it. A pick that contradicts a ruling in the brief is a defect to fix, not a decision to raise. A draft with a pending section reads `Draft: incomplete`. Whoever briefed you sorts the pending calls, as the `blueprint` skill says, and each ruling moves into Decided; Decided holds only calls already ruled, by the brief or after. Done when no stop-and-ask line and no "if WRA-X has landed" branch is left: each is a Decided entry, a pending decision, or a `Merges after` line.
3. **Write the sections.** *Principles: `principle-experience-first`, `principle-test-behavior-not-implementation`.* Write them in contents.md's order, answering the ticket's kind's chain in kinds.md. Done when the draft meets its Contents bar and answers every question in its kind's chain.

A ticket that can't be one PR stops here: bring the evidence (the files, the independent behaviors, the domains) to whoever briefed you. The user decides the split.

## Check one

A check reads the draft as the lane would, with the repo, the ticket, and the facts the coordinator settled (its rulings and decision-log entries), so a settled call is not flagged as a guess. It fixes what it finds in place.

The run is done when step 1 finds no check is needed, or when the ledger has this check's row and the draft reads `Draft: ready`, or `Draft: incomplete` with each pending call written out.

1. **Look up the ledger.** The effort's `checks.tsv`, in its folder, has one tab-separated row per check: ticket, draft hash, base SHA, verdict (`ready` or `incomplete`), date. The draft hash is the SHA-256 of the draft file with its Refresh if drifted base SHA and date lines removed. A row whose draft hash matches, and whose base shows no change in the ticket's paths (`git diff --stat <base>..origin/main -- <paths>`), needs no new check. Done when you know whether this check runs.
2. **Read for wording:** each sentence changes what the lane does, each concept has one term, each rule states its positive target. Out of scope and a grep for what must be gone state negatives on purpose; they stay. Done when every sentence that changes nothing is cut, every concept uses one term, and every prohibition is rewritten as its target.
3. **Read as the lane.** *Principles: `principle-test-behavior-not-implementation`.* Each place you would guess, look outside, or reopen a decision is a defect. Each test proves the decision it names, passes that principle's check (would it still pass if every import returned `undefined`?), and gets past every guard in the code it runs through (grep the function under test for its guards). Every rule in contents.md holds, a migration lever with no deleting ticket is a defect, and the ticket's kind fits who sees the change and holds its kind's slice; a wrong kind is a defect, fixed in the draft. Done when every defect is fixed in the draft, or written as a `## DECISION PENDING` with the draft set to `Draft: incomplete`.
4. **Record.** Set `Draft: ready` when nothing is pending, and append the ledger row. Done when the row is written.

A check runs as a `ticket checker` scratch agent (the `scratch-agents` skill), one per ticket, each editing only its own draft file and appending only its own row to the ledger.

## Estimate

The estimate is the ticket's **complexity**, as a value on the scale the project's tracker doc names (0/1/2/4/8 when it names none), with one sentence why. Score what the lane must work out and how much risky code it touches. A ticket that meets the bar leaves the lane little to work out, so most score low; a high score names the hard part, written into Steps and Done. A check flags a value that isn't on the scale.

## Relationships

Each line in a ticket's Relationships section is one of these, and every line agrees with the other ticket's body:

- **Blocked by:** the other ticket introduces code, schema, or data that this ticket's Steps or tests call, and the line names that symbol: `Blocked by: ABC-150, for findPricingRules`. Direct blockers only; a link a chain of real links already implies is left off. Filed as `blocks`.
  - An audit of 273 `blocks` links across 237 filed tickets found about a quarter to a third fake; merge order filed as `blocks` was the largest cause, 36 links. In one family of 81 tickets, 33 of 37 fake links held an unstarted ticket and added 4 lanes to the longest chain (13 against 9).
- **Merges after:** this ticket builds now and merges once the other is on `main`, such as behind an eval gate. The line gives the reason: `Merges after: ABC-169, the eval gate passes before switch-on`. Steps name the stand-in the lane builds against meanwhile, such as a scripted `claim`. Filed as `related`; the lane starts at once and the orchestrator holds only the merge.
- **Related:** the key plus the one fact used.
- **Parent or children:** a parent covers one behavior too big for one PR, states the done condition for the whole, and has estimate 0. A link attaches to the child that needs it; a parent carries none of its children's links.

Everything else that ties two tickets is information in the body: a shared file or a rebase (a merge conflict the later lane resolves), a shape this ticket imitates without calling it, a verification or docs ticket. A ticket whose list is "whatever remains after WRA-X lands" lists those items when written.
