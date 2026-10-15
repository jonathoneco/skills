# Sizing

The `blueprint` skill's judgment reference for cutting work into tickets: the Cut step reads it, and so does a precedent search for a call on how work is cut (the `decision-log` skill).

Each rule below is followed by the cases it came from. A case marked **Counter-example** is a recommendation the user turned down; it shows which way they lean at that edge.

**One ticket is one PR; split before the lane starts.** Make the change easy, then make the easy change: a prefactor the change needs is the ticket's first step, in the same PR. A ticket too big for one PR becomes a parent with the fewest children that each land alone (the `ticket` skill's Relationships); a big PR that is one coherent thing stays one PR.
- A codemod over ~1,000 functions became a parent with 4 to 5 grouped children.
- Two domain moves at the top estimate stayed one PR each: "Neither shows a seam between behaviours."

**Cut by slice.** A slice is the whole of one coherent change, as its kind's chain draws it. It stays one ticket however many files, findings, or behaviors it covers, and a small ticket names why it is small. A layer that only feeds another slice is part of that slice.
- Recommended: one ticket per finding for four findings on one crashing page. The user: "one ticket for all 4" (filed as ABC-161). **Counter-example.**
- Outcomes saying nobody sees a change: 35 of 77 tickets in one effort, 17 of 81 in another, 8 of 74 in a third. One read: "Nothing calls these members until ABC-168."

**A shared file joins slices only when the work is one slice.** Related work in one slice that touches the same files is a step of that ticket. Work from two slices that only shares a file ships as two PRs, and the later lane resolves the conflict.
- A recovery batch that combined work sharing a file broke the most.

**Condense by default.** One change repeated across many files or domains is one ticket, with each place listed as an acceptance check.

**A change lands with every reader it breaks.**
- Recommended: one ticket first, then the schema changes. The user: "when we swap out a schema we should also swap its readers in the same PR." **Counter-example.** Readers too many for one PR expand and contract, below.
- Fixes to a class land before the refactor that splits it; the refactor carries a `Merges after` line (the `ticket` skill's Relationships).

**Wide refactors expand, then contract.** When a change's readers are too many for one PR, add the new form beside the old, move callers in batches sized by blast radius, then delete the old form in a last ticket blocked by every batch (the `principle-migrate-callers-then-delete-legacy-apis` skill).

**When the design moves on, stop building the old shape and convert what exists in the same pass.**
- Recommended: domains not yet converted may keep adding old-shape units. The user: stop, and undo the existing ones in this pass, "they started doing it to align with an older iteration of the platform." **Counter-example.**

## Duplicates and the whole plan

**A duplicate folds into the surviving ticket.**

**The tracker holds the whole plan, not the session.** File everything the plan knows, each ticket self-contained (the `ticket` skill) with its own Refresh if drifted section, so nothing depends on a session staying alive.
- Recommended: file each ramp's children only as each became next (the repo's own tracker rule). The user: "We should file now, all at once, and each ticket body should say what to do to refresh it if things have drifted. What I'm trying to do is not rely on this session being long-running." **Counter-example**; the user overrode the repo's rule for that effort.
- Recommended: parents carry their children in the body. The user: file all 55 as tickets. **Counter-example.**
