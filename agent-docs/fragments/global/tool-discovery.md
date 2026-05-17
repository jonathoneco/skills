## Tool discovery

- Project-local CLIs live in `./bin/`, `./scripts/`, or via `mise tasks`.
- Read a tool's `--help` or its adjacent README before invoking unfamiliar ones.
- Prefer thin CLIs over MCP servers. If a tool isn't installed, propose adding it before using a workaround.

### Kept MCPs and when to reach for them

These are deliberately kept after audit; reach for them when their trigger fits, otherwise prefer CLIs and built-ins.

- **serena** (`mcp__plugin_serena_serena__*`) — symbol-aware code nav. Use `find_symbol`, `find_referencing_symbols`, `replace_symbol_body` for cross-file refactors and rename-aware edits when `Grep`+`Edit` would miss call sites. Without explicit prompting it sits idle — name it.
- **playwright** (`mcp__plugin_playwright_playwright__*`) — real browser session. Use for UI verification, headed flow capture, screenshot diffs. Pairs with the `webapp-testing` skill.
- **context7** (`mcp__plugin_context7_context7__*`) — current library docs. Use before relying on training-data API recall, especially for fast-moving frameworks (React, Next.js, Convex, TanStack, etc.).
- **claude_ai_Notion / Gmail / Google_Calendar** — first choice for those domains. SaaS connectors, no subprocess cost. Never spawn a subprocess Notion/Gmail/Calendar MCP.
- **open-brain** — personal knowledge base, scoped to `~/src/openbrain`. Use when the user references their personal notes.
