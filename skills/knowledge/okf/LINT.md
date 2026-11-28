# Lint

Periodic health check (weekly review, or on request). The validator catches the
mechanical rot (broken links, orphans); lint hunts what it can't:

- contradictions between docs
- claims a newer source has superseded
- concepts mentioned across several docs that lack their own doc
- missing cross-links between docs that discuss each other's subject
- stale operational path text and links that resolve to the wrong concept

A doc that describes live state can disagree with a ruling the live system does not carry yet. Read the live system before you change that doc: when the live system matches the doc, the doc stays, and it names the ruling as made and not yet carried.

A lint is done when every finding is either fixed (as an ingest) or recorded in
`log.md` as an open question.
