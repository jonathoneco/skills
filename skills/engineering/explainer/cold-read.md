# Cold read

A cold reader gets the page and the reader's profile, and nothing else. It shows where the page leans on what only you know.

Write the profile to `COLD-<n>-profile.md` in the build folder; `n` counts cold reads in the effort, from 1. It holds who the reader is, their role, and the systems they work in. What they will decide and the not-seen list stay in the notes: the cold reader has to find those on the page.

The **reader's copy** comes from `render <suite> --to cold` ([build.md](build.md), Commands): `out/cold/cold.md` holds the pages' text in reading order, each figure replaced by its caption, its text alternative and a picture of its still frame (shot at 1440 px wide in the light theme), each table kept with its cells, and no fonts, styles, or scripts. Copy it to `COLD-<n>-page.md` in the build folder, and its `stills/` beside it as `COLD-<n>-stills/`, whatever their size. The built page is mostly encoded fonts and markup, which a helper cannot read as a page.

Start one helper as the `scratch-agents` skill says, in its `explainer cold read` role, with this brief:

```text
You are the reader the profile describes. These files are everything that reader has: <COLD-n-page.md path>, the still-frame pictures in <COLD-n-stills path>, and <COLD-n-profile.md path>. Read those files and nothing else, no other file, note, repo, or search. Change no file except <COLD-n.md path>.
Write to <COLD-n.md path>, in your own words and nothing else:
1. In two or three sentences, what this page wants its reader to understand.
2. What the reader is asked to decide or do.
3. Every term, system, or premise the page used before it explained it, for this reader, each with the sentence where it first appears. Leave out a reference that names the section or page that explains it. Write "none" when there are none.
```

For several pages, `cold.md` already holds the hub and each page, in reading order. A Notion build's reader's copy is the read-back [notion.md](notion.md) names.

Read `COLD-<n>.md` against your takeaway and asks. Each item in its list is a place to teach earlier, to add a clause, or to cut.
