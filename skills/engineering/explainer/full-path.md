# The full path

A multi-page artifact adds three things to SKILL.md's steps: a takeaway check with the user, a build folder, and background runs.

## Takeaway check

Between Reason and Write, send the user one short message: the reader, the takeaway, and the asks. Done when the user has given the go or a correction, and a correction is folded into the takeaway.

## Build folder

Make it under the effort's notes folder before the first background run, which starts there; screenshots and renders of 1 MB or more go to `~/.local/state/agent-runs/<effort>/`. It holds the artifact's source:

- `<page>.html` per page, the hub as `index.html`.
- `<page>.context.md` per page: its agent context (presentation.md's Human side and agent context).
- `diagrams/<name>.svg` per diagram a diagram run draws, pasted into its page's figure at build.
- `PUBLISHED.md`: the artifact's id and links on its host, one line per published version.
- Each run's result and log: `evidence-<k>.md`, `COLD-<n>.md`, `diagrams/<name>.log`.

Every name, title, quote, and count the pages show is in the source files.

## Background runs

Every background run starts as a scratch agent (the `scratch-agents` skill), at the role named here, in the build folder, and is done when it settles; a `blocked` agent is read and answered as that skill says.

- **Evidence run:** reading that Reason sends out, such as tracing a flow through a repo or surveying docs. The `explainer evidence` role, briefed to use the `how` skill for what code does or the `why` skill for why it is that way; the brief names the repo's path and the report file. Its report's claims enter the ledger (SKILL.md's Reason) like any other.
- **Diagram run:** draws one diagram from the answers to diagrams.md's Reasoning. The `explainer diagram` role; its brief names `diagrams/<name>.svg` as the result file, and carries the diagram's question, parts, and mechanism kinds, with diagrams.md's Drawing section and `templates/base.css` by path.
- **Cold read:** SKILL.md's Cold read, with its files in the build folder.
