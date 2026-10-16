---
name: blueprint
description: Blueprint an effort into implementation-ready tickets. Use when the user says blueprint, or asks to write or file tickets.
---

# Blueprint

Blueprint turns an effort into tickets lanes can build. The `ticket` skill holds the bar each ticket meets and the ticket kinds; the `tracker-hygiene` skill holds the clean state the tracker is left in and the metadata each ticket carries. This skill frames the effort, cuts it into slices, and runs the writing, rulings, checks, and filing. This session is the **coordinator**: it frames, cuts, briefs, and judges, and hands narrow reading and writing to scratch agents (the `scratch-agents` skill), each at the row its role names in that skill's table.

## Frame

1. **Open the todo list.** Its first todo loads every `principle-*` skill the effort could reach: those the latest `[mode]` reminder names, or, when none came, each one whose moment the full principle list shows the effort reaching. When unsure, load it. Then one todo per Frame step, and one per step of the chosen path once step 3 picks it. Check a todo off when its step's Done when holds, or mark it `skip: <reason>`. A step's *Principles:* line names the ones it applies; load any the first todo missed.
2. **Re-read the rules.** Read the `tracker-hygiene` skill and the tracker doc's values (usually named in the repo's `AGENTS.md` or `docs/`: states, labels, estimate scale), and confirm the `linear` skill's GraphQL route answers. Done when you can name the tracker's build-ready state, its Kind labels, and its estimate scale.
3. **Count.** List the behaviors the effort asks for, by name, and the likely tickets. One or two tickets take the short path; three or more take the full path.
4. **Place it.** Find the project the effort belongs to, as the `tracker-hygiene` skill says: an existing project whose outcome it serves, or a new project with its outcome, overview, and lead, proposed to the user.
5. **Name the test boundary:** the one seam the effort's tickets test through, so lanes test the same behavior one way. Propose one; the user confirms it or picks another.
6. **Write the done condition:** every behavior from step 3, each ending in exactly one filed ticket at `Draft: ready` that meets the clean state, or closed with a receipt.
Done when the behaviors, the project, the test boundary, and the done condition are in the effort's notes (the `agent-notes` skill), and the user has confirmed the boundary and the project. For a single ticket filed on the way through other work, propose the boundary and project in the cut instead.

## The short path

For one or two tickets, this session does the work itself.

1. **Explore** with the `how` and `why` skills. Done when every source the tickets rest on is read.
2. **Cut.** Run step 3 of the full path on these tickets. Done when the user has confirmed the cut.
3. **Write** each ticket as the `ticket` skill's Write one says. Done when each draft meets the Contents bar.
4. **Rule.** Sort each `DECISION PENDING` call as the full path's step 5 says. Done when no ticket carries a pending section.
5. **Check.** One `ticket checker` runs the `ticket` skill's Check one on each ticket. A draft it leaves at `Draft: incomplete` goes back to step 4. Done when each draft reads `Draft: ready`.
6. **File** on the user's go, as the full path's step 7 says.

## The full path

1. **Explore.** Run three searches, one `blueprint explorer` each:
   - **Sources:** the files, tickets, docs, recent commits and open PRs in the touched paths, and teammates' design pages the effort touches. Group them into clusters that share a source or a root cause.
   - **Already built:** each requested behavior, searched by its domain concept. A behavior already built leaves the cut and is listed for closing with a receipt at filing; one partly built stays in the cut, holding only what remains.
   - **Retired:** each system the effort replaces or removes, whether or not the effort says "retire", traced through every open ticket that builds on it; each such ticket joins the cut to be rewritten or closed.

   Then, for each cluster, one `blueprint explorer` reads its sources and writes one exploration report, pinned to the SHA it read, each claim graded as the `grading-evidence` skill says. Done when every source sits in a cluster and every cluster has its report.
2. **Investigate.** *Principles: `principle-fix-root-causes`.* Each unknown cause in the reports goes to the `how` skill (what the code does) or the `why` skill (why it is that way), and its report joins the cluster's. A defect is traced to its root cause before it shapes a ticket. A step every ticket shares, such as a restart or deploy command taken from a tool's docs, is run once where the tickets will run before the cut rests on it: one batch rewrote every ticket around `hermes gateway restart`, and all of them were reverted once the command proved unsafe in the container. Done when every unknown cause the reports name has its report. A fact a ruling turns out to need comes back here from step 5.
3. **Cut.** *Principles: `principle-experience-first`, `principle-sequence-verifiable-units`.* Cut the effort into **slices**, each one ticket:
   1. **Kind.** For each piece of work, name its kind and run the kind's chain (the `ticket` skill's [kinds.md](../ticket/kinds.md)). The chain sets who sees the change, what the slice holds, and what proves it.
   2. **Slice.** Draw each slice whole, as [sizing.md](sizing.md) says: a coherent slice stays one ticket; one too big for one PR becomes a parent.
   3. **Relationships.** What each slice calls from another (Blocked by, naming the symbol), and what only orders its merge (Merges after), as the `ticket` skill's Relationships says.
   4. **Metadata.** Each ticket's project, assignee, priority, milestone, Kind label, and estimate with its reason, as the `tracker-hygiene` skill says.

   Then check coverage: every behavior from Frame sits in exactly one ticket. Show the user the cut, each ticket's title, kind, Outcome, estimate, assignee, priority, milestone, and relationships, and take their confirmation or reshape. Done when every behavior sits in exactly one ticket, every ticket has its draft id and every Metadata field, and the user has confirmed the cut.
4. **Write.** Each cluster's tickets go to one `ticket writer`, briefed with the cluster's report, the effort's shared constraints and rulings, each ticket's kind and Metadata, and its draft file names; each draft is its own file in the effort's folder. Answer each open question a writer returns with a step-2 investigation, and send the answer, and any later ruling its drafts need, to the same writer, which keeps its context; brief a fresh one from the drafts only when that writer is gone. Done when every draft meets the Contents bar and every open question is answered.
5. **Rule.** *Principles: `principle-never-block-on-the-human`, `principle-exhaust-the-design-space`.* Collect every `DECISION PENDING` section and sort each call:
   - **Yours:** a call the `decision-log` skill's log already holds a precedent for, applied as the precedent says, and a purely mechanical call with no design content. Record each with its reason in the log.
   - **The user's:** every other call, whether its options change what a user, an operator, or the next maintainer lives with. Weigh two shapes for each that has no precedent, and bring them all in one `grilling` round, each with your pick. A fork paper can't settle goes to the `prototype` skill and is thrown away after.
   - **Not yet answerable:** a call that waits on someone outside the session or on data that doesn't exist yet becomes a Decision or Investigation ticket, only when its kind's gate in kinds.md holds. Anything an agent can find out now goes back to step 2.

   Write each ruling into its ticket's Decided section. Done when no ticket carries a pending section.
6. **Check.** One `ticket checker` per ticket, briefed with every ruling from step 5, runs the `ticket` skill's Check one, in parallel; the checker sets `Draft: ready`. Then the `blueprint batch judge` reads the whole batch: no ticket contradicts another; every ruling is applied everywhere it bears; every relationship meets the `ticket` skill's Relationships against both bodies. The judge sets a ticket it faults back to `Draft: incomplete` with the reason. A new call a check raises goes back to step 5; after its ruling, the checker reruns on each ticket the ruling touches, and then the batch judge reruns. Done when every draft reads `Draft: ready` after the latest batch pass.
7. **File** on the user's go, as the `linear` skill says, then draft the project update the `tracker-hygiene` skill asks for. Done when the effort's done condition holds: every behavior is filed at `Draft: ready` and meets the clean state, or is closed with a receipt.
