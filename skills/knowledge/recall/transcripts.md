# Where transcripts live

- **Claude Code:** `~/.claude/projects/<cwd with / and . as ->/<session>.jsonl`, one message per line. Claude Code deletes transcripts older than its `cleanupPeriodDays` setting (30 days by default), so a longer window has a gap unless another machine holds the rest: say where the search starts.
- **Codex:** `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` and `~/.codex/archived_sessions/`, every project together; keep the files whose first line's `"cwd"` is this project. A message the user typed is a `response_item` with role `user`, and so is a brief an orchestrating session sent a helper: tell them apart before counting the user's words.
- **This session:** the newest file in its project folder whose first user message matches this session's.
- **A Hermes bot:** its profile's `state.db`, searched with the `session_search` tool.
- **After a compaction:** the compaction summary is material too, since a message sent at the moment of compaction is recorded only there.
