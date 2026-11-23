# Several pages

An artifact splits into pages when the reader makes several judgments apart from each other. It adds two things to SKILL.md's steps: the split and the hub.

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

## Passes that fold in rulings

A suite that goes through several rounds of rulings has to be quick to update, or each pass costs 30-60 minutes.

- **Keep decision state as data.** Every call, its state and its lean live in one call file, and key numbers live in one facts file. Pages render both, so a new ruling is a one-line edit and a rebuild. Never restate a ruling in page prose.
- **Sequence the work.** Edit the call file yourself first, then dispatch builders against it once it is fixed. Builders rendering from a file another builder is editing collide and need steering.
- **Touch only what changed.** Rebuild only the pages a ruling touches. Do small text and state edits directly rather than dispatching them.
- **Brief from one digest.** Give each builder one short digest of current truth, not ten source files to read cold.
- **Tier the checks.** A working draft gets the link check and the layout check. Vision-check only an SVG whose hash changed. Cold reads and full vision sweeps are for the final version.
- **Use the full model for lanes that count or trace.** The fast model's lanes come back thin and have to be redone.
