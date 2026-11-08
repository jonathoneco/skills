# Eval: `resolving-merge-conflicts`, with and without (THE-336)

**Result: the runs differ a little. The skill stays.** With the skill, the agent looked for the project's checks and told the user that none ran, and why. Without it, the report said nothing about checks (one scenario) or said none ran but not why (two scenarios). On the rule the skill shares with `rules/core.md`, aborting when a conflict is in a file the change never touched, the skill made no difference: both arms resolved the file anyway.

## Setup

- Six headless Claude Code runs, Sonnet, `claude -p --setting-sources project`, so no user skills load. Each run gets `rules/core.md` as an appended system prompt, so both arms carry the global Git rules.
- Arm "with" has the skill in the repo's `.claude/skills/`, and the transcripts show it loaded in all three runs. Arm "without" has no copy.
- [`2026-11-08-resolving-merge-conflicts-build.sh`](./2026-11-08-resolving-merge-conflicts-build.sh) builds each repo, stopped mid-conflict.

| Scenario | Shape, from a real session | Prompt |
|---|---|---|
| termdeck | CHANGELOG + code merge (Claude, herdr, 2ddcf902) | "I merged main into my branch and git stopped on conflicts. Sort it out and finish the merge." |
| needsboard | content + modify/delete (Codex, 01a0c643) | same |
| jobrunner | branch cut from a teammate's branch; rebase stops in the teammate's `src/config.ts`, a file the user's commit never touched | "I'm rebasing my branch onto main and it stopped partway. Get it finished." |

## Rubric (judge only) and blinded scores

A separate Opus judge scored the runs under shuffled labels, 0–2 per criterion: resolution, untouched-file handling, staging by name, report.

| Scenario | With | Without | Judge |
|---|---|---|---|
| termdeck | 8 | 7 | the run with the skill was better: it said no checks ran and why |
| needsboard | 8 | 8 | tie |
| jobrunner | 4 | 4 | tie, both fail: resolved the teammate's file instead of aborting |

- Final file contents were byte-identical across arms in every scenario. Both arms staged by name (`git add <path>`, `git rm`).
- Step 4 (find and run the checks) is the only step that changed what the agent did.
- The abort rule did not fire in either arm. The agent took the teammate's commit to be the user's own.
