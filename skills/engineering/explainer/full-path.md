# Several pages

An artifact splits into pages when the reader makes several judgments apart from each other. It adds four things to SKILL.md's steps: the split, the hub, a build folder, and background runs.

## The split

1. Name what the reader must judge, and what they must hold in mind at once for each judgment.
2. One page holds one such set. A section that asks the reader to hold two, such as what a person sees and the fields behind it, becomes two pages.
3. Split a set further only when the reader judges each part on its own, such as one page per domain or per failure mode.

The shape file says how its shape usually splits.

## The hub

The hub is the page the artifact opens on, `index.html`. Each fact is stated in full on one page; another page that needs it names it in one line and links there. The hub holds two things, in order:

1. The takeaway and the asks, with today against the design where the artifact proposes a change.
2. **Read in this order:** each page, numbered, as a link with the one question the reader answers there ("Is the wiring right?") and a line on what it holds. A page for the user's rulings comes first.

Each other page opens with its part of the takeaway. The cold read takes the hub and every page.

## Build folder

Make one folder under the effort's notes. It holds `<page>.html` and `<page>.context.md` per page, `PUBLISHED.md` with the artifact's id and links on its host, and each background run's brief and result. Screenshots and renders of 1 MB or more go to `~/.local/state/agent-runs/<effort>/`.

## Background runs

Each run starts as the `scratch-agents` skill says, at the role named here, in the build folder. A run is done when you have read its result file and checked it against its brief.

- **Evidence run:** reading that step 2 sends out, such as tracing a flow through a repo. The `explainer evidence` role, briefed to use the `how` skill for what code does or the `why` skill for why. The brief names the repo's path, the question, the evidence that would settle it, and the result file.
- **Diagram run:** draws one diagram into a file its brief names. The `explainer diagram` role. The brief carries the figure's question and caption, its parts from the source, the design plan's palette and typefaces, and the path of [figures.md](figures.md).
- **Cold read:** as [cold-read.md](cold-read.md) says.
