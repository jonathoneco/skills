## Orientation — read before starting work

Before kicking off **any** task, read the canonical surfaces and form a deep internal understanding of the project's current state, decisions, and direction. The on-disk state is the source of truth; your training data and prior sessions are not.

- **Root CAPS docs** — `CLAUDE.md`, `AGENTS.md`, `ARCHITECTURE.md`, `CONTEXT.md`, `DESIGN.md`, `DEVELOPMENT.md` (whichever the repo carries).
- **`docs/`** — deep docs, ADRs, agent substrate, operations runbooks, incidents.
- **The repo's issue tracker** — open issues for active work, recent closes for context.

Open the files — skimming filenames or recent commits is not enough.

**Delegate sweeps to sub-agents.** Reading `docs/` whole, or any other broad codebase exploration (>3 queries, multi-directory traversals, "find every place that does X", cross-file consistency checks) is a sub-agent job, not a main-thread job. Run independent sweeps in parallel — one message, multiple sub-agent calls. Brief each agent like a cold colleague: state the goal, the scope, and the expected report shape. Synthesize returned summaries in the main thread; don't re-do the searches yourself.

**Verify before asking.** Search the codebase and read relevant files in `docs/` and the root CAPS docs before asking the user a clarifying question. Most "where does X live", "how does Y work", "what's the convention for Z" questions are answered in-repo. When you do ask, cite what you already checked.

**Grill before scoping non-trivial work.** For non-trivial changes, designs, or open-ended exploration where multiple plausible shapes exist, run a `/grill-me` (or equivalent) loop first. Walk the design tree question-by-question, surface assumptions, name trade-offs, and reach shared understanding before producing a plan or writing code.

**Use plan mode once work is being planned.** When the conversation crosses from "what should we do" into "here's how I'd actually do it" — multi-step implementation, multi-surface file changes, schema/migration work — switch to plan mode (Claude `EnterPlanMode`, pi `/plan`, or equivalent) and present the plan for approval before edits land. Trivial single-file tweaks, doc edits, and one-shot answers don't need it.
