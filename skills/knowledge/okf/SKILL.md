---
name: okf
description: Operate knowledge/ bundles (OKF). Use when the user says ground yourself in an initiative, a bundle, or a subject one holds; before acting on a system a bundle documents; when writing, moving, retiring, publishing, or researching bundle knowledge; when a session has produced something worth keeping; and for bundle lint or creation.
---

`knowledge/` is the home of all bundles; each immediate subdirectory is one **bundle** — a
directory tree of markdown **concept docs** (YAML frontmatter, `type` required) whose
markdown links form the knowledge graph. The format contract, frontmatter template,
and grain rules live in `knowledge/README.md` — read it before writing any bundle
file.

## Consult

Two cases bring you here, and both end with you acting on what a doc says.

**Operating a system.** Read its concept doc before the first tool call. Enter at the bundle's root `index.md` and follow the indexes down. Done when the fact you acted on came from a doc you read this session.

**Grounding in a subject.** The user names an initiative, a bundle, or a topic and says ground yourself.

1. Find its front door. Follow the indexes from the bundle root to the section's or the initiative's `index.md`.
2. Read the front door yourself: that `index.md`, the top entries of its `log.md` for what moved recently, its rulings, and whatever it lists as open.
3. When the rest is large, send `reader` scratch agents (the `scratch-agents` skill) to survey it, one per stage folder, each reporting what is decided, what is open, and what contradicts something else. Build on their reports, and read in full only the docs this session will change or argue with.
4. Read the practice that matches the work ahead, in the `practices/` section of the bundle that owns it.
5. Report what you found: what is settled, what is open, and anything that looks stale against the code or the disk. When grounding was the whole ask, the report is the deliverable; when more was asked, carry on into it.

Done when you can name the decisions that constrain the work and the questions still open, each with the doc it came from.

## Ingest

An **ingest** is source-driven: a document read, an incident written up, a research
session concluded, a mining pass finished, a confirmed agent memory graduating from
review. Choose its depth before writing:

- **Direct ingest** for a bounded correction or source whose consequences are clear in one pass.
- **Reviewed ingest** for a synthesis that becomes an implementation or operating authority,
  changes several connected concepts, or carries enough settled decisions that stale conclusions
  can survive a one-pass rewrite.

One source fans out across the bundle — every doc the source touches, not just the nearest one:

1. Place it before writing. The README's bundle table says which bundle owns a domain, and that bundle's root `index.md` says what each section is for.
    - A spec says what a thing is when it is done and goes in `specs/`. A plan says the order of work and goes in `plans/`.
    - An initiative holds what serves its purpose. When the work has moved past that purpose, open a new initiative and link back; a settled initiative that keeps absorbing new work becomes too large to ground in.
    - What the user rules goes in the initiative's rulings doc, such as `design/rulings.md`, or in the bundle's `decisions/` when no initiative owns it.
    - What a session taught about a kind of work goes into that work's practice as a case: what was done, what happened, and the evidence.
2. Find every owning concept doc via the bundle root; edit each in place. A fact
   lives in exactly one doc — other docs link to it.
3. New concept → new file: frontmatter per `knowledge/README.md`, relative links from
   the containing file to its neighbours, and a link from the nearest owning index.
4. Bump each touched doc's `timestamp` and add one prefixed `log.md` entry (format
   in `knowledge/README.md`) naming the source and the docs touched.
5. Apply the Markdown rendering contract in `knowledge/README.md`, including one physical line per prose paragraph and list item.
6. Validate every touched bundle (invocation lives in `knowledge/README.md`) when you add or move a file, and again before landing — each prints `OK` with zero warnings. An orphan or a broken link is cheapest to fix while the file that caused it is the only thing that changed.
7. Land it. Commit the files you changed, by name, and push, following the repo's landing rule in `AGENTS.md`.

Done means every affected validator prints `OK` with zero warnings and the change has landed as the repo's rule says (on `origin/main`, or in an open PR where the repo lands through PRs).

**File answers back.** When a session produces a durable synthesis — a vendor
comparison, a deep-research conclusion, a design investigation — that synthesis is a
source: ingest it before the session ends rather than letting it die in the
transcript.

### Reviewed ingest

The ingest steps above are the **writer** round. Follow them with:

1. **Sediment:** give the written result a distinct cold read for stale consequences,
   contradictions, duplicate ownership, and connected docs the writer missed. Correct the owning
   docs in place.
2. **Verify:** check every substantive addition against its owning source and correct the final
   graph.

Use a `reader` scratch agent (the `scratch-agents` skill) for sediment and verify when one can run;
the reader returns findings and the primary agent applies bundle edits. Otherwise separate the
rounds with a fresh read. Bump timestamps for meaningful corrections, add one newest-first
`log.md` entry per round, and validate after each. Completion means all three rounds are logged
and each validation reports zero errors and zero warnings.

## Other branches

Each of these has its own file beside this one. Read it when its case comes up.

- Moving, renaming, or retiring a doc: read `REORGANIZE.md`.
- Publishing a bundle doc anywhere outside the bundles: read `PUBLISH.md`.
- Starting an investigation, such as a vendor evaluation, a design question, or a deep-dive: read `RESEARCH.md`.
- A periodic health check, or a request to lint a bundle: read `LINT.md`.
- Creating a bundle: read `NEW-BUNDLE.md`.
