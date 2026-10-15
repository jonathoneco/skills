# Incident report

Something broke. The reader decides what to fix and in what order. Their agent picks up the fix, or the next round of digging, from the artifact. An incident with several failure modes usually splits: a hub with the bottom line and the ranking, then one page per failure mode.

## Reasoning

1. **Who saw what.** Name the people and records hit, and what each saw, quoted exactly, from the reports and the live records. Done when each is named with the value they saw.
2. **The record.** Pick the record that shows it best, from step 1. Done when its id, its state, and the time that state was read are written down.
3. **The mechanism.** Trace what produced that state, every step, in the code and the logs, with the `how` skill. Done when each step cites its file or log line, and where the team's belief about the system differed from what it did is stated.
4. **Failure modes.** Find which failures the same mechanism produces, and set aside the symptoms that only happened at the same time, saying why. Done when each mode is marked still live, with what fires next, such as a paused job, a queued email, or a pending sync, or contained.
5. **Rank.** Count the records each mode hit against its total, compare a control case the bug spared, and find when it started and what changed, with the `why` skill. Done when the modes are ordered by who they hurt and how often, each with its count.
6. **Fixes.** For each mode, list the fixes that end it at its root cause (the `principle-fix-root-causes` skill), and test each against the real cases it must still allow, such as two people who share a name, and the working behavior it must keep. Done when each fix is a repair or a call for the user, and anyone downstream who must act is named.

**The takeaway carries** the modes, the fixes, and the calls, from steps 5 and 6.

## On the page

- What broke, what is still live, and the ranking come first; the reader acts on them before anything else.
- Each failure mode is a worked case on a real record, with a diagram of its mechanism and its numbers.
- The calls are decision cards (decision-brief.md's Decision cards); the repairs are listed apart from them.
- What the repair so far taught, wrong turns included, follows the fixes.
- A downstream session, person, or team is named only where it changes what the reader does, such as a team the reader must warn; what each of them needs goes to them, not onto the page.
- Each fix's shape is agreed in the artifact before anyone files tickets.

## Agent context

The heaviest of any shape. Under each failure mode and finding: every record id, the query or command that found it and what it returned, the diagnostics, logs and file paths, and the time each state was read. An agent that picks up the fix starts from these and never re-digs them.
