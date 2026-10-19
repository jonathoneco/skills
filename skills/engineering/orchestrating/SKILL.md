---
name: orchestrating
description: Orchestrating worker lanes through to merged work. Use when starting lanes on an effort's tickets, when a lane asks a question or its PR is ready, when the user checks in, and when picking up an effort whose lanes are already running.
---

# Orchestrating

The **orchestrator** is the session that carries an effort's tickets to merged work through **lanes**: one agent building one ticket to a ready PR, run by the effort's **lane engine** (the tool the effort's practice names). It starts, answers, and merges lanes, and keeps the **user queue**: what only the user can decide. Lanes do all the building. One lane or forty runs the same loop, and one orchestrator runs an effort unless the user splits it.

## Terms every event uses

- A **hard stop** is a call the orchestrator never makes alone; the effort's practice lists them.
- A **safe point** is where a lane can stop with nothing lost: committed, pushed, nothing half-applied.
- A **standing rule** is one of the user's rules for the effort, such as its `FLOW.md` or a ruling, that authorizes a class of Ask-tier action ([calls.md](calls.md)), such as merging. An action in that class carries the user's own authority; without one, it waits on the user.
- The **cross-project session** is the session the user names to span several efforts.

## Where state lives

State is read, not kept. Read it live at each decision; lane self-reports and notes written from memory are often wrong:

- **Lanes**, their models and progress: the lane engine.
- **Tickets**, their state, blockers and bodies: the tracker.
- **Code**: the exact head of the PR or of `origin/main`.

The orchestrator's agent notes (the `agent-notes` skill), one folder per effort, keep only what none of those hold: the user queue, the user's rulings during the effort, each call the user hasn't confirmed, each production step waiting on the user's go, the decision log (the `decision-log` skill), the ledger of tracker writes (the tracker's skill, `linear` on Linear), and the merge-check ledger ([merges.md](merges.md)). Each is written the moment it arises, so the notes and the live state always hold the whole effort. A lesson the effort teaches goes into the owning practice's Cases when it is learned.

## The loop

The effort is done when every ticket is merged with its After merge readings closed, or closed with a receipt, and the user queue is empty.

Each wake that finds an event opens a todo list: one todo per event, expanded into its file's steps, each checked off when its Done when holds, or marked `skip: <reason>`, such as an event an earlier one settled. Its first todo loads the `principle-*` skills the steps it holds name. Events run in this order, since each can change what the next one reads: questions and calls (a PR merges only once no question about it is open), then merges, then the user's check-in, then starts, so a slot a merge frees is filled in the same wake. A todo that waits on something outside the wake, such as a pending deploy or answers the user hasn't given, is written to the notes and opens the next wake's list.

1. **Load,** on the effort's first wake. When the effort has a practice (an effort practice doc, in the repo's docs or the user's notes), read it except its Cases section: it adds the hard stops, its own merge checks, the lane cap, the check interval and how this session wakes for each check (the lane engine's event wait, or the harness's loop command), and the user queue's format. With no practice, ask the user for the hard stops, lane cap, check interval, and how this session wakes for each check before the first start, and frame the user queue as [calls.md](calls.md) step 5 says. Then read the effort's notes folder, or create it on a first run. Done when the notes folder exists and has been read, and the hard stops, lane cap, check interval, wake, and queue format are known.
2. **Start** as [starting.md](starting.md) says. Done when its step 4 done condition holds.
3. **React.** At each check interval, read the effort's notes, then each lane's state from the lane engine since the last check, and the production deploy status of each merge commit not yet read as succeeded or failed, and route each event:

   | Event | File |
   |---|---|
   | A lane sends a message (a question, news, or a call that would wait on the user) | [calls.md](calls.md) |
   | A lane's PR is ready | [merges.md](merges.md) |
   | Without a merge queue, the lane engine reports an overlap with a ready PR's base | [merges.md](merges.md) step 2 |
   | The lane engine reports a PR merged, or a merge commit's production deploy reads succeeded or failed | [merges.md](merges.md) step 5 |
   | A slot frees, or a lane stopped or failed | [starting.md](starting.md) |
   | The user checks in | [check-in.md](check-in.md) |

   A quiet check ends silently. Done when every lane is running, at a ready PR, waiting on an answered or queued question, or stopped with its next action recorded, and every event has run its file's done condition.
