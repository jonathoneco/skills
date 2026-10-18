# Working mode

The working mode makes Claude Code and Codex load the `principle-*` skills at the moments they apply, without the user naming them. It's a set of hooks plus a short set of standing rules. It stands in for what Cursor's poteto-mode does with an always-on rule.

## What the agent sees

- **Standing rules:** the Working mode section of the global rules ([`rules/core.md`](../rules/core.md)), which both tools load every session, after a resume or a compaction too.
- **On every prompt:**
  - The principles the prompt's wording calls for, matched against [`hooks/routes.py`](./hooks/routes.py), each with the moment it covers, as an instruction to load them before the first tool call or reply.
  - Then a menu of every principle not yet loaded in this context window, each with its moment, and an instruction to load the ones the task hits.

  The menu is what lets a terse reply mid-session ("3 - yes") reach the right principle: the model picks from the session's context, which no keyword in the prompt carries. It tells the model to load a principle when unsure, since an unneeded load costs a turn and a missed one costs the reasoning.
  - At the start of heavy work, the menu is headed by an ask to load every principle the work could reach, not only the next step's. The hook takes heavy work to mean plan mode (`permission_mode` is `plan` in both harnesses' hook input), a cue for planning, investigating or writing for someone else (`HEAVY` in `routes.py`), or one of the heavy workflow skills typed as a command.
- **Before the first code edit** while the task's principles are unloaded, and before the first test edit: a reminder to load them.
- **Just before an action one of the user's working rules governs:** one line of that rule, pointing to where it is written in full (`OPS` in `hooks/routes.py`). Starting a helper outside Herdr's scratch agents, or without a model and effort; a call that writes to an outside system; a merge the user's message didn't ask for; a delete outside `/tmp` or with a variable or wildcard in its path; and `git stash` remind on every action. A commit, a shell-script edit, and an edit to a document agents read (a `SKILL.md` or a file beside one, an `AGENTS.md`, a `CLAUDE.md`) remind once per task; the last asks for the `writing-for-agents` skill and every principle the change could reach. A rule a repo overrides is stated globally, with a pointer to that repo's `AGENTS.md`.
- **After a benchmark run, or a tool output over 30,000 characters:** a reminder to load `principle-explain-the-number` or `principle-guard-the-context-window`.
- **At Stop, once per turn:** when the prompt routes principles, the reply must name one routed or loaded this turn and the choice it changed, or say that none changed a choice. Loading a skill does not satisfy attribution. Turns with no routed cue have no attribution check. A substantial code edit also needs a later successful check or run of the changed artifact, regardless of skill loading. Read-only commands such as `git status` do not count. The hook recognizes check commands and runs that name the edited artifact. It cannot judge whether a check proves the intended behavior.

No hook denies a tool call. Each hook reads its evidence from the session transcript and writes nothing to disk. On unreadable evidence, malformed input, or an unexpected error, it exits 0 with a one-line diagnostic on stderr and no stdout. Stop also reports when the current prompt is absent from the transcript tail, including when the 8 MiB limit cuts it off. A missing transcript at the first prompt is expected and stays quiet.

Codex counts full shell reads of `SKILL.md`, including `cat` and whole-file Python reads. Partial readers such as `head`, `tail`, and `sed -n` leave the skill unloaded. Shell redirects into agent instruction documents receive the same reminder as native edits.

## Files

| File | Holds |
| --- | --- |
| [`hooks/mode.py`](./hooks/mode.py) | One script, one subcommand per hook event: `prompt`, `pretool`, `posttool` and `stop`. `--codex` before the subcommand reads Codex's rollout format and words each load as reading the skill's `SKILL.md`, since Codex has no Skill tool. |
| [`hooks/routes.py`](./hooks/routes.py) | The routing table: one row per principle, with its moment and its prompt cues. A strong cue scores 2 and a weak cue 1; a principle is named at 2 or more. |
| [`hooks/selftest.py`](./hooks/selftest.py) | Fixture checks for both harnesses. Run `python3 -I mode/hooks/selftest.py`; it prints `0 failures` when every check holds. |

## Install

The hooks run from this checkout, `~/src/skills`, so a change to the mode lands when its PR merges here. The user's dotfiles hold the switch that turns it on.

**Claude Code**, in `~/.claude/settings.json`: one hook per event, each running `python3 -I "$HOME/src/skills/mode/hooks/mode.py" <subcommand>`.

| Event | Matcher | Subcommand |
| --- | --- | --- |
| `UserPromptSubmit` | | `prompt` |
| `PreToolUse` | `Edit\|Write\|MultiEdit\|NotebookEdit\|Bash\|Agent\|Task\|mcp__.*` | `pretool` |
| `PostToolUse` | `Bash\|Read\|Grep\|Glob\|WebFetch\|Agent\|Task` | `posttool` |
| `Stop` | | `stop` |

**Codex**: set `[features] hooks = true` in `~/.codex/config.toml`, and in `~/.codex/hooks.json`:
- add the same events, in the same shape as Claude Code's;
- add `--codex` before each subcommand;
- use the matcher `apply_patch|Bash|spawn_agent|mcp__.*` for `PreToolUse` and `apply_patch|Bash` for `PostToolUse`.

Codex runs a hook only once it's trusted, and trust is pinned to each hook entry's text, not to the script it runs. The setup script ([`setup-skills`](../skills/engineering/setup-skills/SKILL.md)) writes that pin for the working-mode entries; a hand-made entry asks to be trusted on Codex's next start. A change to `mode.py` or `routes.py` doesn't need trusting again. A change to the hook entries in `hooks.json` does.

**To turn the mode off,** remove the hook entries. The Working mode section in the global rules still has the agent load principles at their moments, without the reminders.

## Changing it

- Tune the prompt cues in `routes.py`, and keep every other change in `mode.py`.
- Add a fixture to `selftest.py` for each behavior you change, and run it.
- The mode was measured in a sandbox that runs `claude -p` and `codex exec` against prompt sets labeled with the principle each calls for. A change to the routing or the reminders should be measured the same way, on prompts the change wasn't written against. Keyword cues fitted to one prompt set carry over poorly to new wording; that gap is why the menu exists.
