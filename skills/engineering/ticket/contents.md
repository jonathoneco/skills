# Ticket contents

The sections a ticket carries and the rules each holds. The `ticket` skill's SKILL.md has the bar, the write and check chains, the estimate, and relationships.

## Self-contained

The ticket carries what its implementer can't find by looking, and names what it can open: the repo by path and workspace symbol, other tickets by tracker key with the one fact used stated inline, and public URLs.

- **Inline** rulings, words the product's users read, new shapes, gotchas, and anything learned in private notes or the conversation. The user: "They shouldn't point to rulings.md, the tickets should be self contained."
- **A ruling code travels with the ruling's words.** `D-1366` or `Q40` appears only beside the decision it names; one effort cited codes bare in 47 of 74 tickets.
- **Existing code is read from `main`** (name the ref when it is another). The ticket states the change; current code, listings of how things stand today, and line numbers stay in the repo, since they drift before the ticket is picked up: 17 of 22 line numbers checked in one effort pointed elsewhere.
- **Standing rules the repo documents**, such as its code, testing, and CI rules, are named by doc path; a restated copy goes stale, and one that disagrees with the docs makes the lane stop and ask (29 lane answers in one week restated a standing rule). Decided holds what is specific to this ticket. A constraint the repo's docs don't hold, such as a ruling or contract kept in private notes, is written in as far as this ticket uses it: 4 lanes in one effort stopped to ask for contract rulings they couldn't open.
- **A team doc**, such as a Notion page, is context; the decision it informs is written into Decided with its own reason.

## Fidelity

These hold in every section:

- Each shape the ticket produces or changes appears verbatim, as a code snippet in Shapes and surface; other sections refer to it by name.
- Every quote is exact and findable. Every link resolves; open it before the ticket ships.
- **A shared contract has one owner.** A shape several tickets use, such as a chunk of a schema contract, belongs to the ticket that introduces it, which carries it verbatim. Each dependent names the shape and its owner, lists the owner under Blocked by, and reads the shape from `main`. One batch defined `vConfirmedStatement` in 6 tickets, and 37 tickets carried 120 "whichever lands first" clauses.

## Contents, in order

Title is the tracker's title field. Every other section is a `##` heading with the name below, since tools that build from a ticket read sections by name.

Every ticket carries the **core**: Title, Outcome, Decided, Steps, Done, Relationships, and Estimate, plus Refresh if drifted on every ticket that is filed rather than built at once. Each other section appears when its condition holds and is left out when it doesn't, so a ticket is as long as what it changes. A ticket meets the **Contents bar** when the core is present, each section whose condition holds is present, and every rule in this file holds.

- **Title:** the deliverable.
- **Outcome:** who sees what change, as the ticket's kind names it ([kinds.md](kinds.md)): today and after, shaped as the `principle-experience-first` skill says. An Outcome with nothing to see marks a layer, which folds into the ticket it feeds.
- **Decided:** every decision the work depends on, settled and stated as decided: the decision, the reason, who decided and when.
  - Paid runs, production reads and writes, migrations and backfills, and real emails or SMS are always decisions, even when the step looks routine. For each, the ticket says whether it is allowed, how many times, and where it may run, or that the operator does it.
  - A defect ticket states its fix here like any other decision, unless the ticket exists to ratify a fix already chosen.
  - A decision that contradicts an ADR names the ADR and why it is reopened; reopening it is the user's call.
- **Evidence,** when an investigation fed the ticket: its findings with their date and SHA. A defect ticket's Evidence carries observed behavior and a reproduction against current `main` or production.
- **Refresh if drifted,** on every ticket that is filed rather than built at once: how the implementer brings the ticket up to date before Step 1, since `main` moves while filed work waits:
  - one base SHA and the date the ticket was written against; a refresh replaces both;
  - the paths the ticket touches, in a fenced block opened with ```` ```paths ````, one path per line, so a script can read them; the command that lists what changed in them since the base, and which symbols to re-read when one did;
  - the tickets whose landing changes this one, and how, as information for the refresh; what the lane waits on is in Relationships;
  - where the refresh is recorded (new base SHA, what changed, what was updated).
- **Steps:**
  - Every step names the file and symbol it changes and what the change is. A step reads like: in `src/orders/refund.ts`, `approveRefund` returns `RefundDecision` instead of `boolean`, shape `RefundDecision` in Shapes and surface.
  - Code in Steps is binding unless marked *illustrative*. Wording that must survive a cleanup, such as a code comment or a string the product's users read, is quoted.
- **Verification,** when the ticket adds or changes tests: the test boundary and the exact cases or scenario numbers, so passing them is the definition of done. Each case asserts behavior as the `principle-test-behavior-not-implementation` skill says. A check that needs a running backend names the environment the implementer builds against and the seeded data it relies on. A check of what the product's users see names the page and the fixture or persona to look at it with. How CI runs, such as which test tier runs where or a label that triggers it, belongs to the repo's practice; the ticket names the checks, not the CI mechanics. The lane runs every check in its own container, so a check names the command alone; where the writer's own machine runs tests is the writer's rule, not the ticket's.
- **Done:** checkable boxes, each ticked by observing a result, each true before merge.
  - Every box names its prover, one of two:
    - **The lane:** its worktree, the tests it runs, its own dev deployment with the seeded data Verification names, and the CI results the lane engine reports.
    - **Merge-time CI,** when the repo runs part of its suite only at merge, such as a full test tier in a merge queue: the box names the exact check. The lane can't see that run, so the box is ticked when the merge lands.

    A check that needs production, an operator, another ticket's merge, a paid run the ticket doesn't allow, or a tracker or GitHub action goes under After merge, with the exact action and its owner. In one week of lane runs, lanes asked 40 times how to prove a box only the merge-time run could prove, and 54 times about checks someone else owed.
  - One test or command whose single run proves several boxes is named once, with the boxes it covers; the lane proves them together. A condensed ticket's places usually share one such run.
  - A box states what to measure or observe.
  - Each box checks what the code does: a test that passes, an observable result, a symbol that exists, or a grep for something that must be gone.
  - Use a line count or fixed-text match only when the code's exact form is the decision.
  - A Done list is judged by behavior, not by shape, by the writer and by whoever merges: a box that fails only because the code took an equivalent form is a note on the PR, not a blocker. A grep in a Done list printed 7 lines instead of 6 because a return type was annotated; recommended: fix first. The user: "this feels like an overly pedantic reading of the ticket and it sounds like the ticket was resolved in a better way." **Counter-example**: a recommendation the user turned down.
- **After merge,** when a check holds only once the change is merged and deployed: each check, the exact read or command, the result that shows it holds, and who runs it.
- **Out of scope,** when a reader would assume something is included that isn't: what a reader would assume is included and is not.
- **Relationships:** as SKILL.md's Relationships says.
  - A ticket that adds a migration lever (a codemod, one-off script, or generator) names the ticket that deletes it once the migration ends, in Relationships or Decided; a lever with no deleting ticket outlives its migration.
- **Revert,** when backing the change out takes more than reverting its PR: how to back the change out, and what data or deploy state it leaves behind.
- **Estimate:** as SKILL.md's Estimate says, with its one-sentence reason.
- **Shapes and surface,** when the ticket produces or changes a shape, words the product's users read, or paths it shares:
  - Every shape snippet (see Fidelity). A snippet a prototype produced that encodes a decision is inlined here, marked as coming from the prototype.
  - Words the product's users read, such as labels, errors, and confirmations, in a table: where, what they read, and the existing string on that screen it matches. They are in the language the screen is written in, and use the users' words rather than internal terms.
  - Exclusive paths this ticket alone changes, and shared paths where it touches only its own entries.
- **PR description,** when the PR must carry wording as written, such as a `Closes …` line or a sentence the team asked for.

