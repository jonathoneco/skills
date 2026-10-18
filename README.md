# Skills

Agent skills for Claude Code and Codex: hand-written ones, plus a pinned set of third-party skills.

The hand-written skills live here as ordinary folders, each with the git history it had in the repo it came from. Matt Pocock's skills and Cursor's pstack skills are copied in and edited here; [`vendored.md`](./vendored.md) records where each came from and the upstream commit it was last brought up to. The remaining third-party skills are not copied in. This repo pins them in [`skills-lock.json`](./skills-lock.json), and the `skills` CLI fetches them at the pinned commit.

## Layout

Skills sit in category folders under `skills/`, the same shape as [mattpocock/skills](https://github.com/mattpocock/skills):

| Folder | Holds |
| --- | --- |
| [`skills/engineering/`](./skills/engineering/README.md) | Work on code: tickets, writing them to Linear, orchestrating worker lanes, explainer pages, building Notion pages, driving Herdr panes safely. |
| [`skills/reasoning/`](./skills/reasoning/README.md) | Methods any work uses: sorting findings, grading evidence, weighing a call. |
| [`skills/knowledge/`](./skills/knowledge/README.md) | What agents keep between sessions: session notes, knowledge bundles, the decision log. |

Each category folder has a `README.md` listing its skills, generated from each skill's frontmatter. Matt's repo also uses `misc/` (kept but rarely used), `in-progress/`, and `deprecated/`; add one of those folders when a skill needs it.

[`mode/`](./mode/README.md) holds the working mode: hooks for Claude Code and Codex that have the agent load the `principle-*` skills at the moments they apply, so the user doesn't have to name them.

Four files run the repo:

- [`scripts/category-readmes.sh`](./scripts/category-readmes.sh) regenerates each category's `README.md` from its skills' frontmatter. Run it after adding, removing, or redescribing a skill.
- [`scripts/check-skills`](./scripts/check-skills) checks that every skill and file a skill names exists, that each SKILL.md's frontmatter names its folder, and that Codex keeps the same skills from firing on their own as Claude Code does. Run it before committing a skill change.
- [`vendored.md`](./vendored.md) lists each skill copied in from Matt Pocock's repo or pstack, with its upstream path and last-synced commit. Their MIT licence texts are in [`licenses/`](./licenses/).
- [`skills-lock.json`](./skills-lock.json) pins each remaining third-party skill to an upstream repo, a path in it, and a commit.

## Rules

[`rules/core.md`](./rules/core.md) holds the rules both tools read in every session. The setup script below writes it into `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`, between marker comments, since Codex's `AGENTS.md` cannot include another file.

This repo's own [`AGENTS.md`](./AGENTS.md), with `CLAUDE.md` linked to it, holds the rules for working in it.

## How skills load

Every skill here is installed at all times, so a skill's `description` decides when a model reaches for it. Each description opens with its triggers, then says what the skill is. A skill loads in one of three ways:

- **Auto-load**, the default: the agent loads the skill when it spots the skill's moment in the work. The frontmatter has no `disable-model-invocation`, and `agents/openai.yaml`, where present, sets no `policy`.
- **Typed-only**: the skill runs only when a person types its name. It sets `disable-model-invocation: true` in its frontmatter for Claude Code, and `policy: allow_implicit_invocation: false` in `agents/openai.yaml` for Codex, which ignores the frontmatter flag.
  These are the skills that would misfire if the agent loaded them on its own: `grill-me`, `wait-what`, `bro`.
- **Name-only**: other skills load these by name, and the model sees no description that would tempt it to load one by itself. In Claude Code, the user settings in dotfiles must set each one to `name-only` under `skillOverrides`.
  - Skills that launch several model runs, so a description must not start one by accident: `arena`, `swarm`, `hillclimb`, `interrogate`. Their `agents/openai.yaml` sets `allow_implicit_invocation: false`, which keeps them out of Codex's list.

The 24 `principle-*` skills in `skills/reasoning/` auto-load by their descriptions, and the [working mode](./mode/README.md) names them at the moments they apply.

## Install

### Everything shared, with the rules and the working mode

```bash
git clone https://github.com/jonathoneco/skills.git ~/src/skills
cd ~/src/skills && DO_NOT_TRACK=1 npx skills experimental_install
python3 -I ~/src/skills/skills/engineering/setup-skills/setup.py
```

The `npx` line fetches the pinned third-party skills into the checkout; the script then links the ones a shared skill names (today `herdr`, `notion-cli`, `playwright-cli`), and names any still missing. The script links every skill into `~/.agents/skills` (Codex) and `~/.claude/skills` (Claude Code), writes `rules/core.md` between marker comments in `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`, and adds the [working mode](./mode/README.md)'s hooks to both tools. Your own text outside the markers, your own skill folders, and your own hooks stay as they are. Type `/setup-skills` later to pull the checkout and run it again; a rerun with nothing new changes nothing. `python3 -I skills/engineering/setup-skills/selftest.py` checks the script against throwaway home folders.

### Single skills with the `skills` CLI

Set `DO_NOT_TRACK=1` for every `npx skills` command. Without it, the CLI reports the names of the skills you add, update, remove, or search for to Vercel.

```bash
export DO_NOT_TRACK=1
```

The repo is private, so the CLI clones it with your normal git credentials (or the GitHub CLI's).

#### The hand-written skills

```bash
# See what the repo offers
npx skills add jonathoneco/skills --list

# Pick skills interactively
npx skills add jonathoneco/skills

# Install named skills for Claude Code and Codex in the current project
npx skills add jonathoneco/skills --skill blueprint --skill explainer --skill notion-pages -a claude-code -a codex
```

Add `-g` to install into your home directory instead of the current project.

#### The pinned third-party skills

`npx skills add jonathoneco/skills` does not offer the third-party skills; the CLI treats the skills named in a repo's `skills-lock.json` as that repo's dependencies, not as skills it publishes. Install them at the pinned commits from a checkout of this repo:

```bash
git clone https://github.com/jonathoneco/skills.git && cd skills
npx skills experimental_install
```

That restores every skill in `skills-lock.json` into the checkout's `.agents/skills/` (which `.gitignore` leaves untracked). To take them from upstream directly, add the upstream repo at the pinned commit, for example `npx skills add 'heygen-com/hyperframes#<commit>' --skill hyperframes`.

#### Trying edits from a local checkout

The CLI installs from a local path too, but it always copies. Even its **Symlink** mode copies the skill into `.agents/skills/` and links each agent to that copy, so an edit in the checkout reaches the agent only after you run the same `add` again:

```bash
npx skills add ~/src/skills --skill blueprint -a claude-code -a codex
# after editing skills/engineering/blueprint/, refresh the copy
npx skills add ~/src/skills --skill blueprint -a claude-code -a codex -y
```

For edits that show up at the agent's next session with no reinstall, link the skill folder into the project by hand. Claude Code reads `.claude/skills/`, Codex reads `.agents/skills/`:

```bash
mkdir -p .claude/skills .agents/skills
ln -s ~/src/skills/skills/engineering/blueprint .claude/skills/blueprint
ln -s ~/src/skills/skills/engineering/blueprint .agents/skills/blueprint
```

Remove the links (`rm .claude/skills/blueprint .agents/skills/blueprint`) when you are done trying the edit.

## Updating

### Hand-written skills

Every hand-written skill is written here, and a change is a PR to this repo. Skills that belong to one project stay in that project's repo, under its `.agents/skills/`.

### Vendored skills

A vendored skill is edited here, so upstream changes come in by hand. The `updating-vendored` skill in `.agents/skills/` (used in a checkout of this repo, never installed) compares each source from the commit in `vendored.md` to upstream's newest, walks through carrying the changes over, and bumps the commit.

### Pinned third-party skills

To move a pin, add the skill again at the new commit from the repo root, then commit the changed `skills-lock.json`:

```bash
npx skills add 'heygen-com/hyperframes#<new-commit>' --skill hyperframes -a codex -y
```

`npx skills update` re-fetches each skill at the commit already pinned in the lock; it does not move the pin.

## Writing a skill

A skill is a folder with a `SKILL.md` whose frontmatter has a `name` and a `description` (see the [Agent Skills spec](https://agentskills.io)). A skill whose frontmatter sets `disable-model-invocation: true` runs only when a person invokes it; the category READMEs list those under **User-invoked**.
