# Lint

Part of the `okf` skill. `SKILL.md` comes first: its Ingest steps define placement, the timestamp and log entry, validation, and landing, and this file builds on them.

Periodic health check (weekly review, or on request). The validator catches the
mechanical rot (broken links, orphans); lint hunts what it can't:

- contradictions between docs
- claims a newer source has superseded
- concepts mentioned across several docs that lack their own doc
- missing cross-links between docs that discuss each other's subject
- stale operational path text and links that resolve to the wrong concept

A lint is done when every finding is either fixed (as an ingest) or recorded in
`log.md` as an open question.
