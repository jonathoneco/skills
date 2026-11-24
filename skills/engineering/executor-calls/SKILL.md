---
name: executor-calls
description: "Use when calling Executor or a tool is missing. Look inside."
---

# Executor calls

## Call your client's `execute`

Each Executor client has one `execute` tool for its toolkit, and the toolkit scopes which connections it reaches. A server name is not a tool name: substitute your configured tool for `mcp__executor_<toolkit>__execute` below.

In Hermes, where `execute` is a deferred tool, call it by its known name through `tool_call`, one tool per call:

```json
{"calls": [{"name": "mcp__executor_<toolkit>__execute", "arguments": {"code": "<TypeScript>"}}]}
```

The outer catalog lists only Executor's entry points, so the connected tools are found inside `execute`, not with an outer tool search.

Agents call the MCP tool. The `executor` CLI rides a device login that lapses, and a CLI call paused for approval cannot be resumed. Unattended scripts with no model use a script key.

## Inside `execute`

- Paths take the form `<integration>.user.<connection>.<op>`. Call one by its full path in brackets, since a hyphen in dotted access parses as subtraction. Get an unfamiliar path's input once from `tools.describe.tool({path})`.
- A call returns `{ ok: true, data }` or `{ ok: false, error: { code, status, message } }`. Check `r.ok` before reading `r.data`, and return an error as it came. `status` is the upstream HTTP status, missing when Executor itself failed or timed out: retry 429, 5xx and status-less failures; a 400 or 422 is the caller's own bad request.
- Executor cuts an `execute` result's text at 30,000 characters, mid-string, so the text of a larger result never parses as JSON: return only what you need. Inside Hermes, a spilled result's file ends in a `<mcp-result-metadata>` block whose `structuredContent.result` holds the whole return value as valid JSON; parse that block.
- Return only the fields the step needs; the whole return value enters your context. Batch related reads in one `execute` and return one compact object.
- Reach the network only through connection tools, since `execute` has no `fetch`. Find tools with `tools.search`; enumerating the `tools` proxy throws.

```typescript
const r = await tools["example-api.user.exampleConnection.list_items"]({ limit: 10 });
if (!r.ok) return r;
return r.data;
```

## Paused calls

A call that needs approval pauses and returns an `approvalUrl` and an `executionId`. Give the user the URL; once they approve, call the same server's `resume` tool with the `executionId`.

## Find a missing path

Before reporting a connection missing, search once inside `execute`. A known path refused as unknown gets the same lookup:

```typescript
const { items } = await tools.search({ query: "<intent and key nouns>", limit: 12 });
return items;
```

`tools.search` returns `{ items }`, not a list. For a matching `path`, read its input with `tools.describe.tool({path})`, then call it. Learn behavior from `describe`, and call a write tool only for the write the user approved: a search hit that looked like a "who am I" read was once a create-comment op, and probing it posted an empty comment.

If the search returns nothing, probe single nouns from different expected connections in the same `execute` call. If every probe is empty, stop and name the affected connections. A missing connection or a `tool_blocked` error can be transient: check again when the user asks or before the next step that needs it, rather than carrying an old outage forward as fact.
