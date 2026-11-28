---
name: executor-calls
description: "Use before writing Executor `execute` code, or when an Executor path is missing."
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

## Send a file

An upload op whose body is `multipart/form-data` takes the file as a `ToolFile` in its file field: `{ _tag: "ToolFile", name, mimeType, encoding: "base64", data, byteLength }`. A plain string there arrives as a missing field (Notion answers `body.file should be defined`). The sandbox has no `btoa` or `TextEncoder`, so build a text file's bytes with this helper:

```typescript
const toolFile = (name, mimeType, text) => {
  const bytes = [];
  for (const ch of text) {
    const c = ch.codePointAt(0);
    if (c < 0x80) bytes.push(c);
    else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let data = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i], b = bytes[i + 1], c = bytes[i + 2];
    const n = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
    data += A[(n >> 18) & 63] + A[(n >> 12) & 63] + (b === undefined ? "=" : A[(n >> 6) & 63]) + (c === undefined ? "=" : A[n & 63]);
  }
  return { _tag: "ToolFile", name, mimeType, encoding: "base64", data, byteLength: bytes.length };
};
```

Put the file's text in the `execute` code as a string literal, built outside the sandbox with `JSON.stringify(text)`. Done when the reply shows the upload received, with any byte count it reports equal to `byteLength`.

## Paused calls

A call that needs approval pauses and returns an `executionId`. In `browser` mode it also returns an `approvalUrl`, and only that URL approves it: give it to the user, and once they approve, call the same server's `resume` tool with the `executionId`. While pending, `resume` returns the same URL, so end the turn. In `model` mode, the default when the client's URL sets no `elicitation_mode`, call `resume` with `accept` only for a call the user approved in this task. A second `execute` writes twice.

## Find a missing path

Before reporting a connection missing, search once inside `execute`. A known path refused as unknown gets the same lookup:

```typescript
const { items } = await tools.search({ query: "<intent and key nouns>", limit: 12 });
return items;
```

`tools.search` returns `{ items }`, not a list. For a matching `path`, read its input with `tools.describe.tool({path})`, then call it. Learn behavior from `describe`, and call a write tool only for the write the user approved: a hit that reads like a lookup can be a write.

If the search returns nothing, probe single nouns from different expected connections in the same `execute` call. If every probe is empty, stop and name the affected connections. A missing connection or a `tool_blocked` error can be transient: check again when the user asks or before the next step that needs it, rather than carrying an old outage forward as fact.
