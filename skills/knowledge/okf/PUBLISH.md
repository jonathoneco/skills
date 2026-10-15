# Publish

Part of the `okf` skill. `SKILL.md` comes first: its Ingest steps define placement, the timestamp and log entry, validation, and landing, and this file builds on them.

After an ingest is green, inspect touched concept frontmatter for `sources` and `mirrors`.
`sources` records established material pulled into or materially shaping the concept;
`mirrors` records renderings of the concept. The direction is inbound through `sources`
and outbound through `mirrors`; `resource` remains the underlying thing the concept
describes.

The bundles are private to the user, and a published copy is read by people who can't open them. Make the copy stand alone: where the source links to another bundle doc, a repo path, or a local file, carry over the content the reader needs or link to something they can reach, such as the matching page at the destination. When several docs publish together, link them to each other at the destination, with one page as their index.

Before publishing, read the destination's owning concept doc or skill. It owns authorization,
rendering, and verification for that surface. Publish only within the authority granted for the
current task, then read the destination back and check that the meaning, links, and structural
elements survived. A mirror address never grants write permission. If publication cannot be
verified, leave the canonical bundle green and report the mirror as incomplete.
