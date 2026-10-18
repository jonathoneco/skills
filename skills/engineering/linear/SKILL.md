---
name: linear
description: Use before any write to Linear (filing a batch, rewriting, relating, or closing tickets, a receipt, a project) or when reading a ticket back against its draft. Holds the filing steps and Linear's quirks.
---

# Linear

Linear has two routes, and this skill assumes both are connected for the workspace: its MCP server, for single edits, and its GraphQL API, for a batch, a body long enough that a model shouldn't carry it (it takes the body from a file), up to 50 issues in one update, and what the MCP lacks, such as Initiatives. When the GraphQL route is missing, stop and ask the user to connect it before filing. The user's setup names both routes and the workspace each reaches. Eight efforts each wrote their own filer and relearned the quirks below; follow these steps instead.

What a ticket's fields hold, and where it belongs, is the `tracker-hygiene` skill's; each workspace's tracker doc holds the values. Write only after the user's go for this effort, such as "file the batch"; until then tickets are drafts in the effort's folder.

## Filing

Keep a **ledger** in the effort's folder, `linear-ledger.jsonl`, beside the drafts: one line per write as it returns, with the draft id (none for a ticket already filed), the key, the operation, and the result. A rerun from any session reads it first and skips what is done.

A rewrite of a filed ticket changes what the draft changes (body, estimate, labels, relations) and keeps its state and assignee unless the user confirmed a change to them in the proposal, since a regroom touches tickets other people own (39 of 62 in one batch).

1. **Re-pin.** Right before creating each ticket, compare its base SHA with current `main` over its `paths` block (the `ticket` skill's Refresh if drifted), update the ticket where those paths changed, and set its base SHA and date to current `main`. Run the `ticket` skill's Check one on every ticket whose paths changed; its ledger skips the rest. Done when every ticket's base is today's `main`.
2. **Cut each body.** A ticket's body runs from its first `##` section to the next ticket's heading or the next top-level heading outside a fenced code block, whichever comes first. A `# ` line inside a fence is body text: cutting there once truncated WRA-8189 silently. A draft file's closing notes sit under a top-level heading after the ticket, and filing to the end of the file hands them to the ticket: one batch would have filed notes paths in 10 bodies. Scan every body for paths into the effort's folder (reports, briefs, draft file names) and for the quirks below. Done when every body is clean.
3. **Create, then swap keys.** Create each ticket from its draft with the fields the `tracker-hygiene` skill names, record its key in the ledger, then replace every draft id in every body with its key and write each body whole. The swap covers quoted words and data files too: inside a quote of the user's words, keep the quote verbatim and add the key after it (`"Keep H4 as drafted" (ABC-157)`); one batch's swap rewrote two of the user's quotes, and a draft name inside a JSON `reason` field escaped the search. Search the bodies for a draft name left behind (`T3`, `SC-7`, "piece 6") and for text the swap doubled ("ABC-181, filed as ABC-181"); one batch left them in 22 of 74 tickets. Done when no body holds a draft name.
4. **Relate from the bodies.** Each Relationships line becomes its relation: `Blocked by` as `blocks`, `Merges after` and Related as `related`. Linear has no call that writes a ticket's whole relation list, so create each relation once with `issueRelationCreate`, which takes keys such as `ABC-19` directly, then read each ticket's full list back and compare it with the body. Write a reciprocal pair once, not from both sides. Creating a relation on a pair that already has one replaces it, and the old relation's id stops existing: to change a link's type, create the new type rather than deleting first. After a regroom, re-derive every link from the bodies: add each one a body states, remove each one no body states (`issueRelationDelete`). Done when every relation matches the bodies.
5. **Read before each write, read back after.** Fetch a ticket's current body just before changing it, and compare the written ticket with its draft after, with the quirks below normalized on both sides. Compare the draft's full list of `##` sections and its length with the stored body, not only the cut text: a readback against a wrong cut passes. Those are the only two reads of a ticket in a pass: Linear's rate limit is per user and shared with every tool on the account. A batch that changes only fields, such as state, priority, or project, reads the whole batch in one list before and one after, comparing each ticket's updated time. Your own receipt comments change a ticket's updated time, so a staleness check compares content. Done when every ticket reads back as drafted.
6. **Close with a receipt.** Every close, merge, or move gets a comment saying why and where the work went. A condensed ticket lists each absorbed ticket's key beside the place it covers; each absorbed ticket closes as a duplicate of it. A ticket that several new tickets replace closes with one receipt naming every covering ticket and the part each covers. Filing children leaves the ticket or spec they came from as it is. Done when every close carries its receipt.

Filing is done when steps 1–6 each meet their done condition.

## Linear's quirks

Linear stores a description with its markdown rewritten and its words unchanged. Normalize these on both sides before comparing:

- `- ` bullets become `* `. Bold splits around a code span: `` **In `a.ts`,** `` reads back as `` **In** `a.ts`**,** ``. An ordered list is indented a space, along with any code block inside it. A table divider `|---|` becomes `| -- |`. Square brackets are escaped, so `[obs]` reads back `\[obs\]`, and a `#` in a table cell reads back `\#`. A double-backtick span gains a space on each side. A bare URL becomes a link. A relative link `[x](path)` reads back as `[x](<path>)`. A `~` outside code reads back `\~`, and a `\"` outside code loses its backslash. Italic `_(…)_` reads back as `*…*`, split around a code span inside it the way bold is. A `> - ` bullet in a blockquote reads back as `> * `.

Fix these in the draft before writing:

- A bare dotted identifier whose last part is a real top-level domain, such as `fact.es`, `approved.map` or `source.id`, becomes a link. Put each in a code span; one batch wrapped 289 and read back clean. `ctx.run` was linked even inside backticks, so reword around that one.
- A backslash-backtick inside a code span is re-escaped and breaks the span. Write a span holding a backtick with double backticks: ``` `` a`b `` ```.
- A table indented inside a list item loses each cell's leading characters, and the lines after it can turn into a code block. Put tables at the left margin.
- An ordered list is renumbered by position. Renumber after moving or removing an item, and keep numbers out of bold item names inside another item.
- `__ADMIN__` outside a code span is stored as bold `**ADMIN**`.
- A backslash escape such as `\n` outside a code span is stored with its backslash doubled, so it reads back `\\n`. Put it in a code span.
- A bare URL followed by `'s` gets linked with the `'s` in it. Write it as a markdown link.
- A code span right after a double quote is still linked when its text ends in a top-level-domain-like suffix: in `"Unit `network-online.target` could not be found"`, `network-online.target` was stored as a link. Make the whole quoted message one code span.
- A bare URL inside an escaped quote in prose, as in `"Doppler Error: Get \"https://api.doppler.com/…\""`, is linked with the trailing backslash inside the link. Put the message in a code span.
- An empty body or title is refused.
- A paragraph right after a bullet, with no blank line between them, is stored indented as a continuation of that bullet. Leave a blank line after a list before the next paragraph.

Write around these:

- A string-replacement edit anchored on the draft's text matches nothing in the stored body, so it writes nothing. Send the whole body.
- A ticket's state can't be set to Duplicate until the duplicate relation exists. Add the relation first.
- An estimate of 0 is refused with "invalid issue estimate" on a team whose estimates aren't configured (`issueEstimationType: notUsed`), while 1, 2 and 4 are accepted. File an estimate-0 ticket, such as a design ticket, with no estimate.
- A project description holds at most 255 characters, and a longer one fails the create. Put the rest in the project's content.
- The API's `projects` filter needs `accessibleTeams: { some: { key: { eq: "<KEY>" } } }`; a bare team filter errors.
- `initiativeCreate` fails with "Initiatives are disabled for this workspace." until someone turns Initiatives on in the workspace's settings; no API call turns them on.
- An initiative's `projects` come back unordered. Read the stored order through `initiativeToProjects` and its `sortOrder`.

When you find a new quirk, propose it for this list in the session's report; the change lands through a PR to the skills repo.
