# The full path

A multi-page artifact adds five things to SKILL.md's steps: how the artifact splits into pages, what the hub holds, a takeaway check with the user, a build folder, and background runs.

## Splitting into pages

1. Name what the reader must judge in this artifact, and the working set for each judgment.
2. A page holds one working set. A section that asks the reader to hold two, such as what a person sees and the fields behind it, becomes two pages.
3. Split a working set into its parts only when the reader judges each part on its own, such as one page per domain or per failure mode.
4. The hub links the pages, as The hub below says.

The shape file says what usually happens for that shape.

## The hub

Each fact is stated in full on one page. Another page that needs it names the fact in one line and links to that page. The hub holds two things in order:

1. The takeaway and the asks, with today against the design where the artifact proposes a change.
2. **Read in this order:** each page, numbered, as a link with the one question the reader answers there ("Is the wiring right?") and a line on what it holds. A page for the user's rulings comes first, marked as the place to rule.

## Takeaway check

Between Reason and Write, send the user one short message: the reader, the takeaway, and the asks. Done when the user has given the go or a correction, and a correction is folded into the takeaway.

## Build folder

Make it under the effort's notes folder before the first background run, which starts there; screenshots and renders of 1 MB or more go to `~/.local/state/agent-runs/<effort>/`. It holds the artifact's source:

- `<page>.html` per page, the hub as `index.html`.
- `<page>.context.md` per page: its agent context (SKILL.md's Human side and agent context).
- `diagrams/<name>.svg` per diagram a diagram run draws, pasted into its page's figure at build.
- `PUBLISHED.md`: the artifact's id and links on its host, one line per published version.
- Each run's result and log: `evidence-<k>.md`, `COLD-<n>.md`, `diagrams/<name>.log`.

Every name, title, quote, and count the pages show is in the source files.

## Background runs

Every background run starts as a scratch agent (the `scratch-agents` skill), at the role named here, in the build folder. A run is done when the author has read its result file and checked it against the brief's completion criterion. A failed run stays open; handle a blocked run as the `scratch-agents` skill says.

- **Evidence run:** reading that Reason sends out, such as tracing a flow through a repo or surveying docs. The `explainer evidence` role, briefed to use the `how` skill for what code does or the `why` skill for why it is that way; the brief names the repo's path, the question, the evidence that would settle it, and the report file. Its report's claims enter the ledger (SKILL.md's Reason) like any other.
- **Diagram run:** draws one diagram. The `explainer diagram` role; its brief names `diagrams/<name>.svg` as the result file, and carries the complete drawing brief from diagrams.md's Reasoning and the design plan's palette and type, with its Rules and Drawing by path.
- **Cold read:** SKILL.md's Cold read, with its files in the build folder.
