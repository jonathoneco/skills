---
name: worktree-cleanup
description: Worktree cleanup, finding the git worktrees whose work has landed and removing them with nothing lost. Use when the user asks to clean up or prune worktrees, or when disk runs short in a repo that keeps them.
---

# Worktree cleanup

The bar: every removed worktree had its work on the trunk and nothing uncommitted, and the user said yes to the list before anything was removed.

`scripts/worktree-audit` reads the worktrees from `git worktree list`, so a worktree outside `.worktrees/` is found too. Removing a clean worktree loses nothing, since its branch and commits stay. Uncommitted work is gone for good.

A cleanup opens a todo list before step 1. Its first todo loads the `principle-*` skills the steps name; a step's *Principles:* line says where each applies. Then one todo per step, each checked off when its Done when holds, or marked `skip: <reason>`.

## Steps

1. **Audit.** *Principles: `principle-build-the-lever`, `principle-encode-lessons-in-structure`.* Record `df -h /`, then run `<this skill's folder>/scripts/worktree-audit --repo <repo>`. The script is the lever: it takes its paths from `git worktree list`, so a worktree that lives outside `.worktrees/` is still found, where a hand-typed path would miss it. It fetches `origin`, then marks each worktree `safe` or `hold` with its reasons:
   - **merged:** its HEAD is an ancestor of the trunk, or its branch's merged PR has the same head and that PR's merge commit is an ancestor of the trunk. A squash merge never makes the branch itself an ancestor, so the merge commit is what the script checks.
   - **clean:** `git status --porcelain` is empty.
   - **held** besides: locked, folder missing, or a running process has its working directory inside.

   Done when `df -h /` is recorded, the table is printed, and the trunk it names is the one the repo merges to.
2. **Check what the script can't see.** *Principles: `principle-prove-it-works`.* The live panes and lanes are the real artifact; the script's `safe` is advice. A session can work in a worktree by absolute path while its working directory sits elsewhere, so the in-use check misses it. For each `safe` row, check `herdr pane list` for a pane whose cwd is inside it and the lane engine's lanes for its branch, and read its last commit time (`git -C <path> log -1 --format=%cr`). A row with a live pane or lane, or a commit from the last few days you can't account for, moves to held with that reason. Done when every `safe` row is either confirmed unused or moved to held.
3. **Show the holds that lose work.** For each row held for uncommitted work, show `git -C <path> status --short` and the diff. This skill never removes it; the user commits, stashes, or deletes that work by hand, and the next audit picks it up. Done when each such row is shown.
4. **Get the yes.** Show the user the list to remove, with each one's merged reason, and the list kept, with one reason each. Done when the user says yes to that list.
5. **Remove.** *Principles: `principle-prove-it-works`.* Run the script again with `--remove`, and one `--only <name>` for each worktree on the user's list. It runs `git worktree remove` on each safe row, never `--force`, so a worktree that gained a file since step 1 is refused and left in place, then runs `git worktree prune`. Local branches stay. Then run `df -h /` again. Done when the rerun lists none of the worktrees on the user's list, `df -h /` is read again, and every refusal is in the hand-back.

## Hand back

The disk space before and after (`df -h /` from step 1 and from step 5) with the space reclaimed, the worktrees removed, the ones kept with one reason each, and any removal the script refused.

Adapted from pstack's worktree-cleanup (MIT, Lauren Tan).
