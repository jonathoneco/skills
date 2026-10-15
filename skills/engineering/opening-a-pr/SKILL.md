---
name: opening-a-pr
description: Opening a PR on GitHub, from a branch that holds only this change to a body a reviewer can act on. Use when work is ready for review, when opening a child PR in a stack, and when writing or rewriting a PR title or body.
---

# Opening a PR

The bar: the PR holds only this change, its body says why it exists and how it was proven, and `gh pr view` shows it open, ready for review, on the right base.

GitHub is reached through `gh`. A repo's own PR template or contributing guide wins over the body shape below.

Open a todo list before step 1. Its first todo loads the `principle-*` skills the steps name; a step's principle is named where it applies. Then one todo per step, each checked off when its Done when holds, or marked `skip: <reason>`.

## Steps

1. **Check the branch.** Prefer several narrow PRs to one large one. Work sits on a branch cut from the trunk after a fetch, in the worktree the repo's or user's rules name. Run `git status` and `git log --oneline origin/main..HEAD`. Every commit and every staged file is this change, staged by name; nothing looks like a credential (`auth.json`, `*.env`, `*.pem`, `secrets/`, a token). Done when both commands list only this change's work.
2. **Shape the commits.** Each commit is a conventional commit, with the types the repo uses. Each commit builds on its own and passes its tests, except a failing-test commit that the next commit turns green; order the commits so the history tells the story, as the `principle-sequence-verifiable-units` skill says. Write each message as step 4 writes the title and body. A fix that belongs in the commit before it is amended into it. Done when the log from step 1 reads as that story.
3. **Run the gates.** Run the repo's tests, linter, and type checker, or say which run only in CI, and check the change itself as the `principle-prove-it-works` skill says. Update the docs the change affects in this same PR. Clear the diff's comments as the `no-comments` skill says. Done when each gate passed or is named as CI-only, and the docs the change touches are in the diff.
4. **Write the title and body.** Write the title and body with the `technical-writing` skill, then apply the `unslop` skill. The title is the conventional commit form, `type(scope): subject`, short and imperative, naming a real symbol when one carries the change. The body is a one-minute read, about 40 lines or fewer unless the repo's own template asks for more. It briefs a reviewer who has the diff, in these sections, dropping any with nothing to say:
   - `## Why`: the intent and the approach, in a paragraph or two.
   - `## Scope`: bullets of real symbols and paths, both sides of a rename, and what is left out where the line matters. A small defect fixed on the way is named here as a fix.
   - `## Tradeoffs`: only the rejected options a reviewer would ask about.
   - `## Blast radius`: who or what the change touches and why it is safe, from the `blast-radius` skill when the change reaches beyond its diff.
   - `## Verification`: each real run and its result. A performance change gives one number as `before → after` with its unit, explained as the `principle-explain-the-number` skill says.

   Passing state, such as ticket numbers, review status, and counts at a point in time, belongs here rather than in docs or code comments. Leave out SHAs, rebase history, file-by-file lists, and boilerplate headings such as `## Summary` or `## Test plan`. Done when every section left in says something the diff doesn't and the body fits the length.
5. **Open it.** Push the branch, then run `gh pr create --title "<title>" --body-file <file>`, ready for review, and `--base <parent-branch>` for a child in a stack. A stack's root targets the trunk; each child targets its parent's branch. Read it back with `gh pr view <number>`. Done when the view shows the base you meant, not draft, and the body as written.

Opening a PR does not start babysitting it. Post the URL and carry on; the `babysit-pr` skill runs when the user asks for it. Merging waits for the user's word.

Adapted from pstack's opening-a-pr (MIT, Lauren Tan).
