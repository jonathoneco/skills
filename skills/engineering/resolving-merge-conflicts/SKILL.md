---
name: resolving-merge-conflicts
description: "Use when you need to resolve an in-progress git merge/rebase conflict."
---

1. **See the current state** of the merge/rebase. Check git history, and the conflicting files.

2. **Find the primary sources** for each conflict. Understand deeply why each change was made, and what the original intent was. Read the commit messages, check the PRs, check original issues/tickets.

3. **Resolve each hunk.** Preserve both intents where possible. Where incompatible, pick the one matching the merge's stated goal and note the trade-off. Do **not** invent new behaviour. Resolve each conflict in a file this change touched. When a conflict is in a file the change never touched, abort (`git merge --abort` or `git rebase --abort`) and bring it to the user.

4. Discover the project's **automated checks** and run them — typically typecheck, then tests, then format. Fix anything the merge broke.

5. **Finish the merge/rebase.** Stage each resolved file by name (`git add <path>`), check `git status` shows no other file staged, and commit. If rebasing, continue the rebase process until all commits are rebased.

Adapted from Matt Pocock's resolving-merge-conflicts (mattpocock/skills, MIT), which upstream deleted at `daa01d8`.
