# Research

Part of the `okf` skill. `SKILL.md` comes first: its Ingest steps define placement, the timestamp and log entry, validation, and landing, and this file builds on them.

Starting an investigation (a vendor evaluation, a design question, a deep-dive):

1. **Route it.** Pick the owning bundle from the table in `knowledge/README.md`
   and file under its `research/` section; personal/domain research goes to the
   Notion Notes DB, not a bundle. A months-long multi-source deep-dive gets its
   own research bundle (shape in `knowledge/README.md`); a single question gets a
   research doc.
2. **Frame the verdict before gathering.** Write the doc first, named for the
   question, with `Verdict (<date>): open — <the question the verdict must answer,
   including the deciding criteria>`. Research without a framed verdict sprawls.
3. **Gather from both directions:** external sources (the `research` skill for
   multi-source sweeps) and internal evidence (the repo, CLI, or data that grounds
   the decision — a verdict without a measured baseline is vibes). Grade each
   finding as the `grading-evidence` skill says. Revise the doc
   as sources land — the doc is the working artifact, and it alone carries the
   investigation between sessions.
4. **Conclude as an ingest:** rewrite the verdict at top, update any practice or
   concept doc the verdict changes in the same pass, one log entry naming all
   touched docs, validate. Follow-on work is tracked in the domain's tracker
   (e.g. Linear); the research doc records the decision and links it.

Each `research/index.md` carries its section's content conventions (naming,
verdict-first, dated corrections) — read it before creating the doc.
