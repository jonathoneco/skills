---
name: notion-pages
description: "Notion pages: making, editing, reading back, and checking one, and replying to its comments. Use whenever a session builds or changes a Notion page."
---

# Notion pages

How a page is made in Notion and checked before someone reads it. What the page says, and which block carries which kind of content, belongs to the skill that asked for the page, such as the `explainer` skill. For `ntn` command syntax, the `notion-cli` skill.

## Build

1. **Pick the route.** Two routes do the same operations (Routes below): the hosted Notion MCP, for a harness that connects it, and the REST API through `ntn` or direct calls, for a session with an integration token. Done when one route answers a search.
2. **Create the page.** In a database with templates, the page is a row made from the template the asking skill names; elsewhere a plain page under the parent the user names. Done when the page exists with its title, icon, and cover (Frame).
3. **Write the body** in Notion's markdown (Markdown below), or through the blocks API where a block the markdown can't make is needed. On a templated page, the body replaces the template's guidance blocks. Done when the write returns without error and the page holds no guidance text.
4. **Place each HTML block** as HTML blocks says, and each child page under its parent. Done when every block and child page in the source is on the page.
5. **Read the page back** (Read-back) and run Check before handing over. Done when every check holds.
6. **Record** each page's id and link, its icon, the template id used, and each upload id, where the work's notes keep them, so a rebuild or a later session finds them without searching. Done when the record lists every page.

A rebuild writes the page again from its source. A page that holds HTML blocks is never read back as markdown and written back: an HTML block reads back as `<embed src="<signed url>">`, and the signed link expires.

## Frame

- **The page is authored for Notion.** Its structure is Notion's own: callouts, toggles, columns, dividers, mentions, native tables, with HTML blocks only where a diagram needs them. Prose, rules, and tables are native blocks, so they can be searched, commented on, edited, and read by agents.
- **Type and width** come from the template; a child page made under a row has neither. A setting the asking skill wants that no route can make goes in the hand-over, for the user to switch on from the page's ••• menu.
- **Every page has its own emoji icon**, naming its subject rather than the document type, and keeps it across rebuilds; that includes each child page.
- **The cover is the template's**; leave it as the template set it. A page built without a template gets the cover the asking skill names, set through the route.
- **The headings are the navigation.** Notion's sidebar outline shows them, so a page carries no table-of-contents block and no hand-built list of jump links.
- **A child page's title carries its parent's name**, as in "Agent context: Journeys", so search and the sidebar say whose it is.

## Routes

| Operation | Hosted MCP | REST or `ntn` |
|---|---|---|
| Find a database and its templates | `notion-search`, then fetch the database | `POST /v1/search`, then `GET /v1/databases/{id}` |
| Create a page from a template | `notion-create-pages` with the database as parent, `template_id`, the title, and its properties | No template parameter is known: `POST /v1/pages` under the data source, then Frame's hand-over for the template's settings |
| Write or replace the body | `notion-update-page` with the page's markdown | `PATCH /v1/pages/{id}/markdown`, or `ntn pages edit <id>`; the blocks API (`PATCH /v1/blocks/{id}/children`) for a block the markdown can't make |
| Set the icon or cover | `notion-update-page` with `icon` or `cover` | `PATCH /v1/pages/{id}` with `icon` or `cover` |
| Make an HTML block | `notion-create-attachment` with the file's HTML as `content` (up to 200 KiB), then `<embed src="file-upload://<id>"></embed>` on its own line in a page update; the bare upload link lands as plain text | `POST /v1/file_uploads` or `ntn files create --filename "<title>.html" --content-type text/html`, then an `embed` block with `file_upload.id` and the caption through the blocks API |
| Delete a block | — | `DELETE /v1/blocks/{id}` |
| Make a child page | `notion-create-pages` with the page as parent | `POST /v1/pages` with the page as parent, or `ntn pages create --parent page:<id>` |

- The blocks API nests children two levels deep per request and takes 100 blocks per array; Notion averages about three requests a second. Retry an append only on `rate_limited`: a retried append once duplicated a table.
- A long call through `ntn` is usually stdin waiting: redirect it from `/dev/null`. A timed-out call usually didn't apply, so read before retrying.

## Markdown

Notion's enhanced markdown is what the create and update routes take. Headings `#` to `####`, each with `{color="…"}`; `## Title {toggle="true"}` for a toggle heading; lists, to-dos, quotes, `---`, fenced code (` ```mermaid ` too); `<callout icon="…" color="…_bg">` with its children indented by a tab; `<details><summary>` for a toggle; `<columns><column>`; `<table header-row="true">` with `<tr>`/`<td>` and row, column, and cell colours; `<page url>`; `<database url inline>`; `<mention-page url>`, `<mention-user>`, `<mention-date>`; inline bold, italic, `~~strike~~`, `<span color="…">`, code, links, `<br>`.

What goes wrong:

- Every source line is a block: hard-wrapped prose arrives as a stack of one-line paragraphs. Write each paragraph and list item on one line.
- Children sit one tab deeper than their parent. Blank lines are stripped; `<empty-block/>` makes a deliberate gap.
- Each `>` line is its own quote; join lines with `<br>` or put one `>` line with tab-indented children.
- Escape `\ * ~ ` $ [ ] < > { } | ^` outside code, never inside it. A `\|` inside a table cell truncates the page after the table on a round trip; write "or" or a slash instead.
- A bare `*.md` token outside backticks is auto-linked as a web address. Wrap paths in backticks.
- Two tables with nothing between them merge into one; put a divider between them.
- Every table column starts the same width, and no route sets widths.
- Markdown names a background `gray_bg`; the blocks API names it `gray_background`. A malformed callout tag hangs the `ntn` CLI on a hidden prompt.
- An edit replaces the whole page. A child page missing from the markdown counts as a deletion, and the call refuses; carry a `<page url>` line for every child, and leave `allow_deleting_content` unset.
- An H1 holding a colon leaves a created page's title empty, and `ntn pages create` under a page parent keeps the H1 as the first body block. Set the title as a property and write the body without an H1.
- A Mermaid block made through any route shows both its code and its drawing, and the view can't be set.
- One write holds at most 5,000 blocks, and a page too heavy fails the same way on every retry: split it into child pages.
- Comments take inline markdown only: no headings, lists, tables, or code blocks.

## Links

- **A page links only to what its reader can open:** another Notion page, a tracker issue, a pull request. What the reader needs from an artifact host, a repo doc, a local file, or agent notes is carried onto the page or dropped. A repo file path that tells someone in a checkout where to look stays as code text, even inside a pasted prompt.
- A link to a page or a section is a native mention (`<mention-page url="…">`). A mention shows the target's own words, so keep the lead-in as text before it: "Records → " then the mention.
- A table row has no text of its own, so a mention of one reads "Untitled". A link to a row, and any link inside a table cell, is a text link in your own words to the block's URL (`https://www.notion.so/<page-id>#<block-id>`, the URL "Copy link to block" gives); a click lands on the table, so the link text names the row ("Records and reads → arrivals").
- Block ids change when a page is rebuilt, so every link into a rebuilt page breaks. After the last page of a set is rebuilt, resolve every mention and anchor link again.
- A `<page url="…">` line places a child page.

## HTML blocks

Notion shows an HTML block in a sandboxed frame of 670 × 500 CSS pixels inline on the page, and 1310 × 682 when the reader expands it. The frame runs inline script and reaches nothing outside. Start every file from [html-block-template.html](html-block-template.html), which meets all three conditions below: copy it and replace the example inside `<g id="figure">`. A file works in the frame when:

- It fills the frame in one view: it reads the frame's width and height on load and on every resize and lays itself out to them, with the SVG's `viewBox` set to the frame, or it is drawn at a 670 × 500 `viewBox` with `width: 100%; height: 100%` and no fixed pixel sizes. No scrolling inside the frame, no empty band, no small drawing centred in a wide frame.
- It is self-contained: inline CSS, inline script, inline SVG, no CDN, no web font.
- It follows Notion's theme: colour tokens with a light set and a `prefers-color-scheme: dark` set.

Placing one:

- Upload under a readable title, the section's name: Notion shows the file's name above the block, with spaces as underscores and punctuation dropped.
- An upload id stays attachable, so one upload serves several blocks and later rebuilds. Re-upload only a file that changed.
- The caption goes on the embed block where the route sets one, and as the line beneath the block where it can't.

## Read-back

Read a page back with `notion-fetch`, `GET /v1/pages/{id}/markdown`, or `ntn pages get`. To count blocks, walk `GET /v1/blocks/{id}/children` into every block with children: the markdown read-back misreports some blocks, such as every callout showing the first callout's icon, or a callout as a plain paragraph.

## Check before handing over

Run every check on the pages as built in Notion.

1. **Blocks match the source.** Count block types against the source: headings, paragraphs, callouts, tables and their rows, toggles, HTML blocks, mentions, child pages. Each drop has a reason.
2. **No leftovers:** no placeholder, no template guidance callout, no literal markdown (`**`, `\|`), no stray `<br>`, no probe block.
3. **Self-contained:** every link meets Links' first rule.
4. **Links resolve:** every mention and anchor link points at a block that exists after the last rebuild, and no mention reads "Untitled".
5. **Frame:** every page has its icon, its cover, and the right title; a templated row has the properties the asking skill named; and the hand-over names any setting the route couldn't make.

## Comments

Read every open thread with `notion-get-comments` on each page, or `GET /v1/comments?block_id=<page id>`; a thread carries its `discussion_id` and the block it sits on. Reply on the same thread with `notion-create-comment`, or `POST /v1/comments` with that `discussion_id`, in inline markdown. No route resolves a thread, so the user resolves it after reading the reply.
