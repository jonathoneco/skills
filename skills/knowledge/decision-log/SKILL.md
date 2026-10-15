---
name: decision-log
description: Decision log, the record of calls an agent makes in the user's place, where the user already decided something, and the digest they review. Use before deciding anything in the user's place, to find the precedent; when logging such a call; and when the user checks in, to build the digest and apply their answers.
---

# Decision log

A **decision log** is the ledger of calls an agent made in the user's place, kept so the user can review each one and so later calls find what is already decided. One file per effort, `DECISIONS.md` in the effort's agent-notes folder (the `agent-notes` skill). Entries are numbered in order and listed newest first; an entry is kept for good and edited in place when the user answers it.

The **user queue** is the file where the calling skill keeps questions waiting on the user (orchestrating keeps one per effort); with none, the digest's Waiting on you section lists the open questions inline.

Three branches:

- **Has this been decided?** Before any call in the user's place, search as [precedent.md](precedent.md) says. A covering ruling decides the call; with none, the calling skill says whether the call is asked or may rest on being undoable.
- **Log a call.** Write the entry below in the same turn as the action, before the next call. An answer given to a worker is labelled "call D-<n>", since workers copy answers into PR bodies; "relayed from the user" is reserved for the user's own words.
- **The user checks in.** Build the digest and apply their answers as [digest.md](digest.md) says; `scripts/digest DECISIONS.md` drafts the digest from the log.

## The file

```markdown
Purpose: calls this session made on the user's behalf, for their review at check-in
Status: live
Touched: <date -Iseconds>

# Decisions: <effort>

Last digest: <date -Iseconds>, through D-<n>.

## Calls

<entries, newest first>
```

## One entry

```markdown
### D-<n> · <date -Iseconds> · <worker or ticket> · <the question in one line>

- Tier: decide | standing rule
- Options: (a) <...>; (b) <...>
- Pick: (<x>). <What changes for the product's users or the code, today vs after, one sentence.>
- Precedent: <doc> § <section>, "<the rule's bold line or the ruling's words, quoted>". <direct | analog | principle | user>
- Checked against: <the counter-example or second ruling read, and why it doesn't pull the other way>
- Scope change: none | <what moved from which ticket to which>
- Undo: <how to reverse it> · reached: nothing hard to undo | <which hard-to-undo action, such as a merge sha>
- Look first: <why the user should read this call before the rest, when they should>
- Status: open | confirmed <date> | overturned <date> (see D-<m>)
- Candidate: <the rule this call suggests, one present-tense sentence>
```

- One `Precedent:` line per covering ruling, graded as precedent.md says.
- `Look first:` is present on a product choice nobody made, on a route around a hard stop, and wherever the calling skill marks a call for the top of the digest; the digest also lifts principle-level calls, scope changes, and calls that reached anything hard to undo on its own.
- `Candidate:` is required when the precedent is analog or principle, and on every overturn.
