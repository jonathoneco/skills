---
name: scratch-agents
description: Scratch agents, the helpers a session starts for one job. Use when a skill or task starts any helper agent, or when naming a model for a role. Holds the role-to-model table, and starts the helper in a Herdr scratch tab or through the harness's subagent tool.
---

# Scratch agents

A **scratch agent** is a helper this session starts for one job and reads back when it settles. In Herdr it runs where the user can see and steer it: one Herdr tab per session, the **scratch tab**, holds every scratch agent that session starts. This is the user's standing request, so the herdr skill's rule against creating tabs unasked doesn't apply to the scratch tab. Read `herdr-hazards` before the first prompt. Without Herdr, the last section says how to start one.

## Roles

Each skill splits its work into **roles** and names them; this table is the one place a role becomes a model. A skill's own row wins; a role with no row takes the general row its job matches. Codex accounts are separate from Claude's, so a long run doesn't drain the Claude pool, and lanes build on Codex, so a Codex checker reads a ticket as its builder will.

| Role | Model | Other provider | Why |
|---|---|---|---|
| **reader**: blueprint explorer, ticket checker, explainer evidence, why investigators, how explorer, orchestrating post-merge reading | Codex `gpt-6-luna` | Claude `sonnet` | reads code and named sources and checks them against a stated bar |
| **light code worker**: a small change the brief already settles (the files, the change, and how to check it) | Codex `gpt-6-luna` | Claude `sonnet` | matches the lane engine's light track |
| **code worker**: any scratch agent that edits code, such as a swarm worker | Codex `gpt-6.1-sol` | Claude `opus` | matches the lane engine's heavy track |
| reflect tooling | Codex `gpt-6.1-sol` | Claude `opus` | command flags, library quirks, and CI commands |
| **writer**: ticket writer, explainer diagram | Claude `opus` | Codex `gpt-6.1-sol` | writes something a person reads |
| **prose worker**: mechanical edits to prose, skills, and docs (sweeps, renames, rewiring, format files), recall reader, summarizing a run's notes | Claude `sonnet` | Codex `gpt-6-luna` | quick over text from a tight brief; reads conversation and prose the way a person does |
| explainer cold read | Claude `sonnet` | Codex `gpt-6-luna` | reads a page the way its reader will |
| **judge**: blueprint batch judge, why synthesizer, reflect judgment | Claude `opus` | Codex `gpt-6.1-sol` | synthesizes, explains, and picks |
| **panel**: interrogate reviewers | one Claude `opus`, one Codex `gpt-6.1-sol` | none; the panel already holds both families | a panel needs both families |
| architect runners | a panel of Claude `fable` and Codex `gpt-6-astra`, plus one Claude `opus` | none; the panel already holds both families | design from scratch is the hardest step |
| arena judge | `opus` or `gpt-6.1-sol`, the family that wrote fewer runs; on a tie, the family other than this session's | the other family | a judge outside the runners' family |
| **second opinion**: show-me-your-work's check, a check that repeats another run's job to compare | the other family from the first run, at the same strength and effort | none; it is already the other family | agreement across families is the signal |
| **frontier** | Claude `fable`, Codex `gpt-6-astra` | the other family's frontier model | the hardest steps, such as a design from scratch or reasoning a strong model is likely to get wrong, or on the user's word |

Pick each agent's row before it starts, by how hard you predict the job is. A brief that already holds the decisions, such as replacement text, a settled spec, or a list of edits, is a worker's job (light code worker or prose worker) unless the change itself is hard: concurrency, a subtle algorithm, or a change through shared code goes to the code worker, and the hardest steps go to frontier. When nothing about the job's difficulty calls for more, take the lowest row whose job fits: a stronger model than the job needs costs time and repeats reasoning the brief should have settled. Lanes on the lane engine take their models from the ticket's estimate, not from this table.

**Effort** is picked with the model, before the agent starts, and each model has a default: low for the strong models, Codex `gpt-6.1-sol` and Claude `opus`; medium for the light ones, Codex `gpt-6-luna` and Claude `sonnet`. Pick a higher level when the job's difficulty calls for it, such as a judgment the brief can't settle or a change through shared code, and say why in the brief. The level is set once, at start (step 2). Claude `fable` and Codex `gpt-6-astra` run high wherever a row names them.

## Steps

1. **Find or make the scratch tab.** Its label is `scratch · <what this session is working on>`, two to four plain words such as `scratch · comms tickets`, so the user can tell sessions' tabs apart. Keep its id in the session's notes (the `agent-notes` skill) and reuse it; after a restart, find it with `herdr tab list --workspace "$HERDR_WORKSPACE_ID"` by that label. When none exists, `herdr tab create --workspace "$HERDR_WORKSPACE_ID" --label "scratch · <topic>" --cwd <folder>`; it opens without taking focus. When the session's work moves on, `herdr tab rename <tab> "scratch · <new topic>"`. Done when you hold the scratch tab's id and its root pane.
2. **Open a pane and start the agent.** The tab's root pane takes its first agent; split a pane in the scratch tab for each later one, with `--cwd` set to the folder the job works in and `--no-focus`, so the user's focus stays put. Start the agent with a name that says its job (`ticket-check-abc-141`), its kind, and its model after `--`:
   - Claude: `herdr agent start <name> --kind claude --pane <pane> -- --model <model> --effort <effort> --permission-mode bypassPermissions`
   - Codex: `herdr agent start <name> --kind codex --pane <pane> -- -m <model> -c model_reasoning_effort=<effort> --dangerously-bypass-approvals-and-sandbox`

   A scratch agent has the reach of the user's own sessions: shell, network, and the user's MCP servers. A brief that should leave files alone says so in words ("change no file"). Done when `agent start` returns ready and a read of the pane (`herdr agent read <name> --source recent-unwrapped`) shows an empty input box with no dialog; `herdr-hazards` says how to clear each dialog.
3. **Prompt it and wait.** `herdr agent prompt <name> "<brief>" --wait --timeout <ms>`. The brief names the file the agent writes its result to. Start several agents and wait on each in the background when the jobs are independent. Done when the wait returns `idle` or `done`; a `blocked` agent is waiting at a question or approval, so read it (`herdr agent read <name> --source recent-unwrapped`) and answer it or bring it to the user. When the wait times out, read the agent (`herdr agent get`, `herdr agent read`): a `working` agent gets another `herdr agent wait`; only a stalled one is a failure below.
4. **Read the result file.** It is the agent's product; an agent that settled without writing it gets one more prompt naming the file. Write your own summary of what it found; you own its work. Done when the result is read. Close a split pane once its agent's result is read (`herdr pane close <pane>`); the root pane stays as the tab's anchor and takes the next agent once its agent exits.

5. **Close out.** When no agent in the scratch tab is running or still owes a result, close the tab: `herdr tab close <tab>`, which ends its agents and its root pane. Close it when the session's work is done, before writing a handoff, and before the session ends; a later job opens a fresh scratch tab. Close only this session's scratch tab; another session's tab is that session's to close. Done when `herdr tab list` shows no scratch tab of this session's.

When an agent fails, the failure decides the retry:

- **Rate limit or capacity:** wait a minute and prompt again; when it repeats, start the same brief on the row's Other provider model.
- **Context ran out:** start a fresh agent on a smaller slice of the job.
- **A tool or harness error stopped it:** start the same brief on the row's Other provider model.
- **Anything else,** including no result after step 4's extra prompt: start it once more as it was.
- **A second failure on the same job:** stop, and bring the job and both failures to the user, unless the calling skill says how a dropout is handled (arena, interrogate).
- **The harness rejects a model name** because it was renamed or retired: start on that family's nearest model at the same strength, and tell the user the table needs the new name.

## Without Herdr

Where `HERDR_ENV` is unset, such as in a lane or in CI, start the same brief with the harness's own subagent tool, at the role's model from the table, and wait for its completion. Steps 3 and 4 hold as written. When the role's model is the other family's, use this harness's model of the same strength from the table, and say in the result that a panel lost its second family.
