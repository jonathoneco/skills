---
name: recall
description: Recall earlier sessions' work, searching agent notes and the durable record before transcripts. Use when resuming an effort, when the user asks where they left off or to catch them up, and when a question turns on what an earlier session found, decided, or measured.
---

# Recall

The bar: the answer comes from the cheapest record that holds it, cited where a reader would open it, and checked against live state before anything is built on it.

Recall opens a todo list before step 1. Its first todo loads the `principle-*` skills named by the steps' *Principles:* lines. Then one todo per step, each checked off when its Done when holds, or marked `skip: <reason>`. Each step works from the one before, and the search stops at the step that answers the question, so the search steps after it are marked `skip: answered at step <n>`.

## 1. Frame

State in one line what the answer will decide, then fix the scope:

- **Question:** a fact ("where was X measured"), an effort to resume, or a catch-up ("what have I been working on").
- **Terms:** the subject's names and their near-synonyms, such as a ticket key, a branch, a page title, the product word and the code word.
- **Window:** a fact has none; a catch-up defaults to the last 7 days. Say the window back; a request for "all" stays all.
- **Project:** the one this session runs in. Another project's transcripts are read only when the user names that project.
- **Machine:** this one. Notes are the same on every machine. Only run output in `~/.local/state/agent-runs/` stays on the machine that made it. When the work may have run elsewhere, name the machines that might hold its run output, from a note's `RUNS-<host>.md` or `<host>:` pointer, the hosts the user's setup names, or by asking the user, and search them over SSH only after the user says yes.

When the user has already given the state (paths, branch, the change), work from it and go to step 5. Done when the question, terms, window, project, and machines are stated.

## 2. Agent notes

Search `~/.local/state/agent-notes/` on this machine (the `agent-notes` skill's layout; it needs no SSH):

1. Read `INDEX.md` and list the root beside it.
2. Read the headers of the notes in matching folders; read a note without a header by its first lines.
3. Grep the terms across the tree, and by header, such as `grep -rl '^Status: live'`.

Run output a note points at as `<host>:~/.local/state/agent-runs/<path>` lives on that host; read it over SSH only after the user says yes.

To resume an effort, read its handoff first. The trail the earlier sessions left (these notes, the durable record, the transcripts) is authoritative: what it says landed and what it decided stand, and the later steps build on them. Done when a note answers, or every term has been grepped and you can say what came back.

## 3. The durable record

*Principles: `principle-guard-the-context-window`.* What the sessions left outside the notes: repo docs and knowledge bundles (the `okf` skill), `git log` and PRs for the paths and branches the notes name, the tracker's tickets, the user's memory store when one is connected, and, for a named feature or bug, the team's chat and error-tracking sources when a tool reaches them. Ask each source what the current state is, what was tried and didn't hold, and what users still report. Past three sources, give one source to each `reader` scratch agent (the `scratch-agents` skill), all in parallel, each asked those three questions, with quotes and links. A catch-up on a named feature or bug always sweeps this step, since its fixes, reverts, and repeated reports live here under other names; a pure activity question ("what did I do this week") may skip it.

Done when each source is searched or named as unavailable; a source that returned nothing is a finding.

## 4. Transcripts

*Principles: `principle-guard-the-context-window`.* Only when steps 2 and 3 left the question open. Claude Code keeps `~/.claude/projects/<cwd with / and . as ->/<session>.jsonl`; Codex keeps `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` and `~/.codex/archived_sessions/` for every project together; keep the files whose first line's `"cwd"` is this project. `INDEX.md` lines name the sessions that worked each effort; start there.

Order candidates by modification time (`ls -t`), skip the current session, grep the terms first, and read only the matching regions. In a session that matches, read its end first, since the last messages say where it stopped, then scan back for the decision points. Transcripts run to tens of megabytes: for one long transcript, or past two or three files, give slices to `recall reader` scratch agents (the `scratch-agents` skill), each returning per session its id, the goal, decisions, open threads, corrections, and artifacts (PRs, tickets, branches). The raw text stays with them.

Done when the window's candidates are searched, or the answer is found.

## 5. Check live state

*Principles: `principle-prove-it-works`.* A note or transcript says what was true then. When the answer turns on what an agent actually did (the tools it ran, the files it read, the errors it hit), read that session's full transcript, beyond any summary or trimmed copy. For the PRs, branches, and tickets found, read their state now with `git`, `gh`, or the tracker. When repo paths a handoff names have commits after its `Touched:` date, re-read those paths. Confirm any claim graded below `[obs]` that the next step rests on (the `grading-evidence` skill). Check an inherited claim that work passed on the real artifact, since an earlier session's report of a pass is not the proof. A live job the trail names (a running helper, a CI run, a paid runner) keeps running: read its state here. Reading the current state is the whole check; completed work and an old repro stay as the trail left them.

Done when every item the answer rests on is read at its current state, or marked as not checked and why.

## 6. Answer

- **A fact:** the answer, its source as a path and line or a session id, and its grade. Name what was searched and found nothing when that bears on trust.
- **A resume or catch-up:** up to five bullets on what the work is and where it stands; then one line per thread, tagged `[merged #N]`, `[open PR #N]`, `[in flight <branch>]`, `[verified, uncommitted]`, `[reverted #N]`, or `[planned, not started]`; then the problems that recur, including fixes that shipped and were reverted; then the resume point, where done meets pending; then the verdict on the earlier work: continue it, ship a finished recommendation, ratify or override a prior conclusion, or postmortem a failed run; then the single next move, naming the skill that owns the rest of the work. Cut detail before cutting threads. An adjacent feature or ticket stays out unless it blocks this one.

Strip private context before the answer goes anywhere public. Done when every claim in the answer cites its source and carries its grade.

Adapted from pstack's recall and session-pickup (MIT, Lauren Tan).
