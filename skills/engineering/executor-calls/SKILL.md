---
name: executor-calls
description: "Use when calling Executor. Call and discover tools safely."
---

# Executor calls

## Call your client's `execute`

Use the configured client's one `execute` tool for its toolkit. The toolkit scopes which connections it can reach. A server name is not a tool name. Substitute the configured tool name for `mcp__executor_<toolkit>__execute` below.

Call it through `tool_call`, one local tool per call:

```json
{"calls": [{"name": "mcp__executor_<toolkit>__execute", "arguments": {"code": "<TypeScript>"}}]}
```

Do not run `tool_search` or `tool_describe` first. The outer catalog exposes Executor's entry points, not the connected tools. Discover connections inside `execute` instead.

Agents use the MCP tool, never the `executor` CLI. A device login can lapse, and a CLI call paused for approval cannot be resumed. Unattended scripts with no model use a script key rather than a device login.

## Inside `execute`

- Call a connection tool by its full path in brackets. Hyphens in a path parse as subtraction with dotted access.
- A call returns `{ ok: true, data }` or `{ ok: false, error: { code, message } }`. Check `r.ok` before reading `r.data`. Return an error unchanged.
- Return only fields the step needs. The whole return value enters your context. Batch related reads inside one `execute` and return one compact object.
- No `fetch`. Never enumerate `tools`, which is a lazy proxy and throws. Use the discovery methods below.

This example uses a placeholder connection path. Replace it with a known or discovered path and its described input:

```typescript
const r = await tools["example-api.user.exampleConnection.list_items"]({ limit: 10 });
if (!r.ok) return r;
return r.data;
```

## Discover a missing path

Before reporting a connection missing, search once inside `execute`. If a known path is refused as unknown, use the same lookup:

```typescript
const { items } = await tools.search({ query: "<intent and key nouns>", limit: 12 });
return items;
```

`tools.search` returns `{ items }`, not a list. For a matching `path`, call `await tools.describe.tool({path})` to learn its input, then call that path. Learn behavior from `describe`, never by probing an operation. Call a write tool only for the write the user approved. Do not fall back to outer `tool_search` or the CLI.

If the search returns no items, probe single nouns from different expected connections in the same `execute` call. If every probe is empty, stop searching and report the affected connections. A missing connection or a `tool_blocked` policy error can be transient. Check again when the user asks or before the next Executor-dependent step, rather than carrying an old outage forward as fact.
