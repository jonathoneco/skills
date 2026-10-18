---
name: tracker-hygiene
description: Use when placing work in the tracker (a new project, work for an existing project, a stray ticket), when setting a ticket's project, owner, priority, kind, or milestone, or when the user says groom or regroom. Holds the tracker's clean state, the metadata each ticket carries, and the grooming pass.
---

# Tracker hygiene

This skill holds the rules for where work goes in the tracker and what each ticket carries; each workspace's **tracker doc** (usually named in the repo's `AGENTS.md` or `docs/`) holds the values: its states, labels, estimate scale, and whether triage is on. The `linear` skill holds how to write to Linear. A grooming pass of a project or a workspace runs as [grooming.md](grooming.md) says.

## The clean state

The **clean state** is what every write leaves the tracker in, and what grooming restores. It follows Linear's own method where the user adopted it. Each filing, move, or close is checked against it; a field Linear leaves optional and the clean state doesn't name is left as it is.

- **An issue is one unit of work,** with a deliverable a lane or a person can finish. A stage of a project is a milestone; a bundle too big for one PR is a parent with sub-issues (the `ticket` skill); a plan or a brief is a project document. An issue named for a stage or a brief ("Milestone 0", "Brief 1") is converted at the next grooming pass.
- **An issue joins the project whose outcome it serves.** An issue that serves no project's outcome is standalone team work, reached through its owner and priority. When several standalone issues share an outcome, they become a project, proposed to the user.
- **Every open issue and project has a named owner**: the issue's assignee, the project's lead.
- **Every accepted open issue has a priority;** every planned one also has its Kind label and an estimate (Metadata, below).
- **A project states its outcome.** Its overview says what will be true when it is done, its lead is set, its status matches the work, and it has dates only when they are known. Its overview and its issue list describe the same work.
- **A project with stages has milestones,** each a point the team checks progress at, and each open issue sits in its stage.
- **An initiative holds a goal that spans several projects;** a single project's goal is that project's overview.
- **Triage holds only work from outside the team**: automatic filings such as error trackers and in-product QA reports, intake flows, other teams, customers, and filings from a QA pass, whoever runs it. A filing by a team member or an agent carries its project, owner, and priority and skips triage. Work leaves triage one of four ways: accepted (project, owner, and priority set), declined (canceled with a reason a later search for the same request will find), duplicate (related to the original first), or snoozed (with the reason and a wake date).
- **Open work moves.** An open issue untouched for 30 days gets a disposition at the next grooming pass: re-prioritized, re-assigned, folded into another, or closed with a reason. The team's auto-close, at the period the tracker doc names, catches what grooming misses.
- **A project's plan and its record agree.** After a blueprint filing or a grooming pass that changes a project, draft a project update (health, decisions, blockers, scope changes) and publish it on the user's word.
- Cycles are off; no ticket is placed in one.

### Where new work goes

Each starting point ends with every ticket it touched meeting the clean state.

- **A new body of work:** name the outcome first. A concrete task is an issue; a small bundle that must land together is a parent with sub-issues; work toward one deliverable that needs coordinating is a project, with milestones when it has stages; several projects toward one goal are an initiative. Propose the project with its outcome, overview, and lead, cut its tickets with the `blueprint` skill, and create the project on the user's go, before its tickets are filed.
- **Work for an existing project:** compare it with the project's outcome. Work that serves the outcome joins the project in its stage. Work that changes the outcome is a scope change: bring it to the user with what it does to the plan and dates. A separate deliverable is its own project.
- **A stray ticket:** search for an open issue that already covers it, and fold into that one if so. Search canceled issues too: a match declined before goes to the user with its reason ("declined on <date> because …; does that still hold?") before the new one is accepted. Otherwise place it in the project whose outcome it serves, or keep it standalone, and set its Metadata; then write, check, and file it with the `blueprint` skill, whose short path shows the user its values before filing. Work that turns out to need coordinating is a proposal for a new project, brought to the user.
- **A project that has drifted:** groom it, as [grooming.md](grooming.md) says.

## Metadata

Each field below is set when the ticket is filed. The `blueprint` skill's cut proposes each value, on either of its paths, and the user confirms it with the cut; a grooming pass proposes changed values in its proposal. The tracker doc names the values.

| Field | Rule |
|---|---|
| Project | The project whose outcome the ticket serves; standalone when it serves none. |
| Assignee | The person who will see it through: the person the session works for, or a teammate when the work is theirs or they asked for it. Unassigned only on purpose, with the reason in the body. |
| Priority | Urgent: users are blocked now, with no way around it. High: users hit it, or it blocks a committed outcome. Medium: planned work. Low: when there's room. |
| Kind label | The label for the ticket's kind, as the `ticket` skill's [kinds.md](../ticket/kinds.md) names it. |
| Estimate | As the `ticket` skill says, on the tracker doc's scale. |
| Milestone | The stage the ticket lands in, when the project has milestones. |
| State | The tracker doc's build-ready state for a ticket at `Draft: ready`; its placeholder state for one that still needs a blueprint. |
| Other labels | Each label the tracker doc's registry says applies, such as an area or a source. |
| Relations | From the body's Relationships lines, as the `linear` skill files them. |
