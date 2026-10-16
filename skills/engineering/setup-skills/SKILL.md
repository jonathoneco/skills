---
name: setup-skills
description: Install or update the shared skills, the agent rules, and the working-mode hooks for Claude Code and Codex from a checkout of this repo. Use when the user types /setup-skills.
disable-model-invocation: true
---

# Setup skills

A first install starts from a clone, since this skill isn't installed yet:

```bash
git clone https://github.com/jonathoneco/skills.git ~/src/skills
cd ~/src/skills && DO_NOT_TRACK=1 npx skills experimental_install
python3 -I ~/src/skills/skills/engineering/setup-skills/setup.py
```

To update, run these steps.

1. **Find the checkout.** It is the folder `~/.agents/skills/setup-skills` links into, three levels up from the skill. Done when you hold its path.
2. **Pull it.** `git -C <checkout> pull --ff-only`. When the pull refuses because the checkout has local changes or commits, show the user `git -C <checkout> status -sb` and stop; those changes are theirs to keep or drop. Done when the pull succeeds.
3. **Run the setup script.** `python3 -I <checkout>/skills/engineering/setup-skills/setup.py`. It links every shared skill, and each pinned third-party skill a shared skill names once `npx skills experimental_install` has restored it, into `~/.agents/skills` (Codex) and `~/.claude/skills` (Claude Code), removes links to skills that left the checkout, writes `rules/core.md` between the marker comments in `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`, and adds the working-mode hooks to both tools' settings, trusted for Codex. With `CLAUDE_CONFIG_DIR` or `CODEX_HOME` set, it writes into those folders instead, as the tools read them. Each run converges: a second run changes nothing. Done when it prints its report.
4. **Report** each line the script printed under "kept" or "not installed", since those are places it left the user's own files alone, and say that a new session picks up the changes. Done when the user has the report.

The user's own rules go outside the marker block in `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`; the script rewrites only what is between the markers.
