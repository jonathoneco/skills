# Skills repo

The user's agent skills for Claude Code and Codex, and the rules both tools read. [README.md](./README.md) holds the layout, how skills load, and how to install them.

## Changing a skill or the rules

- Load the `writing-for-agents` skill before the first edit, and follow it. Skills call the person they serve "the user".
- One skill per PR. Sessions load the main checkout, so a change reaches them when it merges and `main` is pulled, on every machine that uses them.
- When a helper makes the edit, read its whole diff before the commit is pushed, and check it against the ruling it carries out.
- When one PR names a skill another PR adds, merge the one that adds it first.
- The rules every install reads live in `rules/core.md`.

## Skills copied from upstream

- A skill listed in [`vendored.md`](./vendored.md) keeps its upstream wording. It changes only where something breaks here, where it conflicts with the user's rules, or in its frontmatter, so upstream changes still come in cleanly.
- To change a copied skill's content, merge into it and make it the user's own: remove its row from `vendored.md`, and credit both sources in its closing line.
- Adopting an upstream skill or playbook, such as one of pstack's: copy it at upstream wording and swap only what breaks here. Model and speed lines go to the `scratch-agents` skill's roles; a short principle name ("the **x** principle skill") becomes the exact name, `principle-x`; a tool only the upstream harness has becomes the local one or goes.
- When comparing an upstream skill with one of the user's, compare what each makes an agent do, step by step, quoting both. This repo's conventions, such as a "Done when" on every step, are not the yardstick.

## Before committing

- Run `scripts/check-skills`. It reports a skill or file named that does not exist, frontmatter that does not name its folder, a skill Codex and Claude Code disagree on letting fire on its own.
- After adding a skill or changing a description, run `scripts/category-readmes.sh`.
- A new skill gets `agents/openai.yaml`. A skill only the user invokes carries `disable-model-invocation: true` in its frontmatter and `policy: allow_implicit_invocation: false` in that file, so both tools treat it alike.
- A new skill loads only once the dotfiles repo links it; open that PR beside this one.
