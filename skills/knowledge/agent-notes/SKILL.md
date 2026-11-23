---
name: agent-notes
description: Agent notes, the working state of an open effort, synced across the user's machines. Use when writing an effort's handoff or rulings, including a handoff to reground yourself after /compact, when resuming an effort, and when closing one.
---

# Agent notes

They live in `~/.local/state/agent-notes/`, one folder that sync keeps the same on every machine, so a note saved on one machine is readable on the others within a minute. They hold an open effort's working state: where it stands, what was ruled, and what still runs. Work that only one Hermes bot reads keeps its state in that bot's own notes, in its home; an effort another bot or a session on another machine reads stays here. The bar: a later session finds the note it needs from `INDEX.md` and the note headers, without mining transcripts.

Every note shares the language below, so notes can be found and gathered. A note is done when it has the header, every finding in it carries an evidence tag, and it sits in its effort's folder with that effort's `INDEX.md` line current.

## Layout

- **One folder per effort**, named for its subject in kebab-case with no date, such as `money-picture-wireframe`. Related efforts may sit one level down in a group folder, such as `workstreams/<name>/`, with the group's rules note beside them; each effort still gets its own `INDEX.md` line.
- **`INDEX.md`** at the root has one line per effort folder: `- <folder>/ — <what the effort is> — <status>`, followed by the ids of the sessions that worked the effort, so their transcripts can be mined later. Create it, and the root with mode 0700, when missing.
- **`machine/<host>/`** holds machine facts written earlier; read them there.
- **`archive/`** holds the folders of done efforts.
- **Files that aren't notes**, such as scripts, small data, page builds, and markdown that is data, such as a cached ticket body, live in their effort's folder and carry no header.
- **`~/.local/state/agent-runs/<effort>/`** is the local home for bulk or machine-bound run output. It never syncs. These go there, not into the notes: test-run trees and fixtures, logs and event dumps, any file of 1 MB or more, cloned repos (`.git`), `node_modules`, archives, database dumps, `private/` data, and copies of agent config. Database dumps, raw production rows that hold personal data, and `private/` data go only there. A note points at such output as `<host>:~/.local/state/agent-runs/<path>`.

## Shared language

**Kinds.** Name each new file by its kind, alone (`HANDOFF.md`, `RULINGS.md`) or as a folder of them (`briefs/extract.md`, `reports/latency.md`): handoff, log, return, brief, report, rulings, ledger, draft, facts, rules. A file another skill names, such as the explainer's `COLD-<n>.md`, keeps that skill's name.

- **handoff:** one per effort, in that effort's folder, rewritten in place so it holds only the current state, and a reader never has to work out which handoff is current. What it held before goes to the effort's log. A handoff written elsewhere, such as into a temp directory, is folded into the effort's handoff. It names every helper, job, and paid resource still running, and says whether each was stopped or left running for the next session on purpose. It names the skills the next session loads first. When the user asks to stop, stop at a safe boundary: finish or back out of the current step and start nothing new, then write the handoff.
- **log:** `log.md`, the effort's history, newest entry first, each entry stamped.
- **rulings:** numbered, each with the decider's words, the date, the reason, and what was turned down. A reversed ruling stays, marked with the one that replaced it.
- **rules:** how a group of efforts works, as `RULES.md` in the group folder.

**Header.** Every markdown note opens with three lines, above its title:

```
Purpose: <who reads this next, and what for>
Status: live | parked | done
Touched: <date -Iseconds>
```

Bump `Touched:` whenever you change a note.

**Time.** Every date and time in a note comes from running `date`, never from memory, and a time carries its zone offset, as `date -Iseconds` prints it (`2026-10-01T17:47:06-04:00`), so dates in one effort never mix zones.

**Status.** `live` holds whether or not an agent is running on the effort right now; `done` also marks a draft that has gone where it was bound. An effort's status is its handoff's `Status:`, or, with no handoff, its newest note's. `INDEX.md` and `archive/` follow it: when it changes, update the effort's `INDEX.md` line, and when it becomes `done`, move the folder to `archive/` and point its `INDEX.md` line there.

**Evidence tags.** Every finding carries one of `[obs]`, `[sup]`, `[hyp]`, `[spec]`, or `[unk]`, graded as the `grading-evidence` skill says.

**Old marks.** Entries in older notes end with `→ <destination>`, `→ open`, or `→ declined <date>`. They need no upkeep.

## Keeping notes findable

- Keep one copy of each draft; an older version worth keeping goes in a `vN/` folder beside it.
- A note points at durable places: the effort's folder, a repo path, a tracker key, or a URL, never `/tmp`.
- A note another replaces is marked superseded, naming the note that replaces it.
- The session that moves a file updates every path that pointed at it: grep the notes tree and the repos for the old path, and change each hit. The move is done when that grep finds the old path nowhere. When the file moves into `agent-runs`, the note's pointer names the host.
- A folder whose notes have no header predates this skill; the first session that works in it follows [legacy.md](legacy.md).

## Sync

Two machines that save one file within seconds leave a `*.sync-conflict-*` copy beside it. Merge the copy into the original, then delete the copy. Find them with `find ~/.local/state/agent-notes -name '*.sync-conflict-*'`. `INDEX.md` stays one file.

## Searching

To resume an effort, read its handoff here first; the `recall` skill rebuilds the rest of its context.

## Closing an effort

When an effort ends, move what lasts to its owner:

- A ruling goes where its repo records decisions, such as an ADR, a rulings doc, or the ticket or spec it settles.
- A report's verdict goes to the doc or ticket it bears on.
- A lesson goes into the skill or doc that governs the work, in the repo that owns it, once the user approves the edit.

Then set the handoff's `Status:` to `done`.

Done when every ruling and verdict in the folder sits with its owner, and the effort's `INDEX.md` line and place follow **Status**.

Adapted from pstack's pause-safely (MIT, Lauren Tan).
