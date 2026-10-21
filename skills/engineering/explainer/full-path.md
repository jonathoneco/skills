# The full path

A multi-page artifact adds three things to SKILL.md's steps: a takeaway check with the user, a build folder, and background runs.

## Takeaway check

Between Reason and Write, send the user one short message: the reader, the takeaway, and the asks. Done when the user has given the go or a correction, and a correction is folded into the takeaway.

## Build folder

Make it under the effort's notes folder before the first background run, which starts there; page builds stay beside the notes, and screenshots and renders of 1 MB or more go to `~/.local/state/agent-runs/<effort>/`. It holds the artifact's source:

- `<page>.md` per page, in Notion's markdown (the `notion-pages` skill's Markdown), the hub as `index.md`.
- `<page>.context.md` per page: its agent context, which becomes the page's child (presentation.md's Human side and agent context).
- `diagrams/<name>.html` per HTML block, with a one-line caption in `diagrams/<name>.caption` beside it.
- `PUBLISHED.md`: the record the `notion-pages` skill's Build keeps.
- Each run's result and log: `evidence-<k>.md`, `COLD-<n>.md`, `diagrams/<name>.log`.

Every name, title, quote, and count the pages show is in the source files.

## Background runs

Every background run starts as a scratch agent (the `scratch-agents` skill), at the role named here, in the build folder, and is done when it settles; a `blocked` agent is read and answered as that skill says.

- **Evidence run:** reading that Reason sends out, such as tracing a flow through a repo or surveying docs. The `explainer evidence` role, briefed to use the `how` skill for what code does or the `why` skill for why it is that way; the brief names the repo's path and the report file. Its report's claims enter the ledger (SKILL.md's Reason) like any other.
- **Diagram run:** draws one HTML block from the answers to diagrams.md's Reasoning. The `explainer diagram` role; its brief names `diagrams/<name>.html` as the result file, and carries the diagram's question, parts, mechanism kinds, and theme, with diagrams.md's Drawing section and the `notion-pages` skill's `html-block-template.html` by path.
- **Cold read:** SKILL.md's Cold read, with its files in the build folder.
