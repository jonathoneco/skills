# Merges

A lane's PR is ready: check it at its exact head against the merge rule, then merge, enqueue, or send it back.

## 1. Look up the merge-check ledger

The effort's notes hold `merge-checks.tsv`, one row per check: PR, head SHA, check, verdict, date. A row is reused while its head SHA still matches, whatever else lands on `main`. Two reports void a row at the same head: the lane engine reporting an overlap voids the overlap row (step 2), and a linked ticket that merged or changed its Decided section since the row's date voids the Merges-after and cross-ticket rows.

Done when you know which checks run at this head.

## 2. Run the merge rule

*Principles: `principle-prove-it-works`.* A ready PR merges when all of these hold, plus the effort's own checks:

- (engine) CI is green on the exact head, confirmed at the provider. A skipped check shows green there, so confirm each required check ran.
- (engine) Without a merge queue, the branch has no **overlap** with `main`: `main` has changed no source file the branch also changes since the lane's last catch-up. An overlap only in docs that merges cleanly (`git merge-tree`) merges as it is, and `main` gaining changes to other files leaves the PR as it is. The lane engine reports an overlap, and a ready verdict holds until it does; then have the lane catch up, and merge only once CI is green on the new exact head. With a merge queue, the queue owns this check (step 4).
- (engine) Every ticket named on the ticket's `Merges after` lines is on `origin/main`. Until then the PR waits at ready; once they are, the lane catches up, replaces the stand-in with the real code, and CI is green on the new exact head.
- (you) Every Done box is met, judged by behavior, not by shape (the `ticket` skill's Done). The lane proves each box; the orchestrator reads that proof and spot-checks one against the real artifact, as the `principle-prove-it-works` skill says. A box whose prover is merge-time CI is ticked when the merge lands (step 5).
- (you) The cross-ticket check is clean (step 3).
- (you) The PR body is read against the ticket's Decided section, not only against the diff. A body that states a target nobody ruled, or cites a question as the ruling, is corrected before the merge.
- (you) No question to the user about this PR is open.

When the lane engine verifies an (engine) check at ready, record its verdict from the engine's ready event instead of checking again. Run the (you) checks and the effort's own checks yourself.

A PR that breaks a worker-brief rule goes back to its lane, and the gap is fixed where it lasts ([calls.md](calls.md) step 1).

Done when every check, the skill's and the effort's, has a ledger row that step 1 counts as current.

## 3. The cross-ticket check

This is the check only the orchestrator can do. It runs before the merge, since a PR merged before its check can break the premise of the tickets after it. For each ticket linked directly (blocks, blocked by, merges after): list each Decided premise that names a path, shape, or behavior the diff touches. For each premise, say whether the diff keeps it true, breaks it, does its work early, or leaves out work the premise expects from this PR. A break or a leave-out goes back to the lane; work done early is noted on the linked ticket.

Done when every listed premise has one of those verdicts with a `file:line` from the diff.

## 4. Merge

A merge is an Ask ([calls.md](calls.md)) unless a standing rule authorizes merges for the effort. Under that rule, merge every PR that passes the merge rule when the ticket's decisions approve the change, cost included. When a production step follows the merge, such as a drain, a strip, or a re-run, the merge goes in and the production step waits for the user's go. Merges pause on the user's word or on a failed production deploy (step 5), and only the user resumes them; lanes keep building and opening ready PRs during a pause.

**When `main` has a merge queue, enqueue each PR as soon as it passes.** The queue tests each PR against everything ahead of it and merges them one at a time, so the orchestrator doesn't wait for the previous merge's production deploy before enqueueing the next. The queue deploys a PR as soon as it merges, so a PR with a step that must run before its production deploy, such as a feature-flag check or a production migration's precondition, is enqueued only after that step is read.

Enqueue the PR with the labels its lane gave it; the merge queue runs the full test tier, and a red there comes back to the lane. When the queue removes a PR, the lane engine reports it ready again once the lane has fixed the failure or judged it outside the change; enqueue it again then.

**Without a merge queue, merge one at a time.** Confirm the merge commit is on `origin/main` and its production deploy succeeded before the next merge.

Done when the PR is merged or enqueued, sent back to its lane with what failed, blocked by a question in the user queue, or, with no standing rule authorizing merges, waiting in the user queue for the user's merge go.

## 5. After the merge

*Principles: `principle-prove-it-works`.* Runs when the lane engine reports the PR merged, and at each later check until the merge commit's production deploy status reads succeeded or failed. Read that status and the merge commit's post-merge checks. A failed production deploy pauses merging (step 4): enqueue nothing new, dequeue what is still queued, and put the failed deploy first in the user queue.

Stop the lane if it is still running, close any duplicate PR it opens, and hand its slot back ([starting.md](starting.md)). Tick each Done box whose prover is merge-time CI once that run is green on the merge commit. A ticket whose After merge section names production readings goes into the user queue with the date each reading falls due, and stays open until then; the check-in reads them ([check-in.md](check-in.md)).

Done when the deploy has read succeeded or failed (a pending deploy is read again at the next check), the post-merge checks are read, the lane is stopped, no duplicate PR is open, every merge-time CI box is ticked, and every post-merge reading is in the user queue with its due date.
