---
name: updating-vendored
description: Use when the user asks to update, sync, or pull upstream changes into the vendored skills (Matt Pocock's, pstack's), or to check whether upstream has moved. Brings each source's changes since the commit in vendored.md into this repo's edited copies by hand.
---

# Updating vendored skills

The vendored skills were copied in from upstream and are edited here: wired to the `scratch-agents` skill's roles, given this repo's loading flags and descriptions, and reshaped where the user ruled. An update carries upstream's *intent* into the edited copy. Every hunk is a judgment, never a file copy.

`vendored.md` is the record: one row per skill with its source, upstream path, and last-synced commit. Last-synced means upstream was reviewed up to that commit, including hunks deliberately left out.

## 1. Fetch

For each source in `vendored.md` (`mattpocock/skills`, `cursor/plugins`), clone it with full history into a temporary folder (`git clone --filter=blob:none https://github.com/<source>`), and note its newest commit on the default branch.

Done when each source has a local clone and a newest commit, and each source whose rows all already carry that commit is reported up to date and skipped.

## 2. Survey

For each remaining source, from its oldest last-synced commit to its newest:

- `git diff --stat <last-synced>..<newest> -- <upstream path>` for each vendored row: the skills that changed.
- Skills added upstream since, and vendored skills upstream deleted or moved: list them for the user; adopting or dropping one is the user's call.

Show the user the survey: per source, the changed skills with their line counts, the new ones, and the gone ones. Done when the user has said which changed skills to bring in (default: all).

## 3. Carry over

For each changed skill, read two diffs side by side:

- **Upstream's change:** `git diff <last-synced>..<newest> -- <upstream path>`.
- **Our edits:** the clone's `<upstream path>` at `<last-synced>` against this repo's copy. These are the edits the update keeps.

Sort each upstream hunk:

- **Take:** it lands on text we left as upstream wrote it. Apply it.
- **Adapt:** it touches text we rewired or reworded. Write its intent into our version: model lines name a role from the `scratch-agents` skill's role table, never a model; frontmatter keeps this repo's loading rule (README, "How skills load"); names and paths stay ours.
- **Leave out:** it conflicts with a ruling here, or depends on something this repo replaced. Note it with one line why.

Done when every hunk of every chosen skill is taken, adapted, or left out with a reason.

## 4. Record

Set each brought-in row's last-synced commit in `vendored.md` to the newest commit, including rows whose hunks were all left out. Commit the skill folders and `vendored.md` by name as `chore: sync <source> skills to <short commit>`, with the left-out hunks listed in the commit body.

Done when `vendored.md` carries the new commit for every brought-in row and the commit body names every left-out hunk.
