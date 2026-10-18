---
name: agent-notes
description: Agent notes, the machine-local notes one session leaves for the next. Use when writing a handoff, rulings, or lessons for a later session, and to harvest an effort's notes at wrap-up.
---

# Agent notes

They live in `~/.local/state/agent-notes/` on the machine where the work ran. The bar: a later session finds the note it needs from `INDEX.md` and the note headers, without mining transcripts.

Every note shares the language below, so notes can be found and gathered. A note is done when it has the header, every finding in it carries an evidence tag, and it sits in its effort's folder with that effort's `INDEX.md` line current.

## Layout

- **One folder per effort**, named for its subject in kebab-case with no date, such as `money-picture-wireframe`. Related efforts may sit one level down in a group folder, such as `workstreams/<name>/`, with the group's rules note beside them; each effort still gets its own `INDEX.md` line.
- **`INDEX.md`** at the root has one line per effort folder: `- <folder>/ — <what the effort is> — <status>`, followed by the ids of the sessions that worked the effort, so their transcripts can be mined later. Create it, and the root with mode 0700, when missing.
- **`machine/`** holds stable facts about this machine that outlast any effort: paths, tool quirks, where something is installed.
- **`archive/`** holds the folders of done efforts.
- **Files that aren't notes**, such as scripts, data pulls, page builds, and markdown that is data, such as a cached ticket body, live in their effort's folder and carry no header. Database dumps and raw production rows that hold personal data go only where the user names.

## Shared language

**Kinds.** Name each new file by its kind, alone (`HANDOFF.md`, `RULINGS.md`) or as a folder of them (`briefs/extract.md`, `reports/latency.md`): handoff, log, return, brief, report, rulings, lessons, ledger, draft, facts, rules. A file another skill names, such as the explainer's build sheet, keeps that skill's name.

- **handoff:** one per effort, in that effort's folder, rewritten in place so it holds only the current state, and a reader never has to work out which handoff is current. What it held before goes to the effort's log. A handoff written elsewhere, such as into a temp directory, is folded into the effort's handoff. It names every helper, job, and paid resource still running, and says whether each was stopped or left running for the next session on purpose. It names the skills the next session loads first. When the user asks to stop, stop at a safe boundary: finish or back out of the current step and start nothing new, then write the handoff.
- **log:** `log.md`, the effort's history, newest entry first, each entry stamped.
- **rulings:** numbered, each with the decider's words, the date, the reason, and what was turned down. A reversed ruling stays, marked with the one that replaced it.
- **lessons:** each entry holds what happened, the user's words, the rule it suggests, and a `Seen before:` line naming where the same lesson appeared earlier, or `no`.
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

**Harvest marks.** End a harvested entry with `→ <destination path or key>`, one still open with `→ open`, and one the user declined to keep with `→ declined <YYYY-MM-DD>`.

## Keeping notes findable

- Keep one copy of each draft; an older version worth keeping goes in a `vN/` folder beside it.
- A note points at durable places: the effort's folder, a repo path, a tracker key, or a URL, never `/tmp`.
- A note another replaces is marked superseded, naming the note that replaces it.
- The session that moves a file updates every path that pointed at it: grep the notes tree and the repos for the old path, and change each hit. The move is done when that grep finds the old path nowhere.
- A folder whose notes have no header predates this skill; the first session that works in it follows [legacy.md](legacy.md).

## Searching

To find or resume earlier work, run the `recall` skill; it searches these notes first, then the durable record, then transcripts.

## Harvest

At wrap-up, move what the notes taught to where it lasts. Lessons left `→ open` come back up when the user runs the `reflect` skill, which lists them across all notes, oldest first.

- A rule for the work goes to the repo that owns it: into the skill or doc that governs the work, and its case into that repo's record of cases, such as a practices doc; in a knowledge bundle, land it as an ingest, as the `okf` skill says.
- A rule for every project goes to the global agent rules, edited in a dotfiles worktree.
- A ruling goes where that repo records decisions, such as an ADR, a rulings doc, or the ticket or spec it settles.
- A report's verdict goes to the doc or ticket it bears on.
- A decision, constraint, failure, or lesson a later session in this repo should know is recorded as a finding in the user's memory store when one is connected; a capture is made only when the user asks to remember something. The finding holds the substance and its condition in your words; the user's quoted words stay in the note.

Done when every lesson, ruling, decision, constraint, and report verdict in the folder carries a harvest mark, and the effort's `INDEX.md` line and place follow **Status**.

Adapted from pstack's pause-safely (MIT, Lauren Tan).
