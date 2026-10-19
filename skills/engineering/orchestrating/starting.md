# Starting lanes

Starting a lane: on the first run, whenever a slot frees, and when a stopped or failed lane runs again.

## 1. Pick the ticket

Read the tracker at the moment of the decision: each ticket's blockers, state, and files as they stand now. The **frontier** is every ticket startable now: every tracker blocker merged, and the paths in its Refresh if drifted `paths` block don't overlap a running lane's. An overlap waits for that lane to merge; it is not a blocker on the ticket. A `Merges after` line (the `ticket` skill's Relationships) holds only the merge, so that ticket is on the frontier at once. A ticket's priority, for this choice, is the highest of its own and of every ticket waiting on it, directly or through others, so an Urgent ticket's blockers start first. Start the highest priority first; among equal priorities, the one the most tickets wait on, directly or through others.

Done when the ticket is on the frontier, no frontier ticket has a higher priority by that measure, and none at its priority has more tickets waiting on it.

## 2. Refresh it if drifted

A ticket with no Refresh if drifted section skips this step. Its overlap test in step 1 uses the files its Steps name.

When `main` has moved in the ticket's paths since the base SHA in its Refresh if drifted section, follow that section and record the new base SHA and what changed there. A refresh that would change the ticket's Outcome, or finds a Decided premise that no longer holds, sends the ticket to the `tracker-hygiene` skill's grooming instead, and the next frontier ticket takes its place.

Done when the ticket's base SHA matches `main` in its paths, the ticket has no Refresh if drifted section, or the ticket is in grooming.

## 3. Start the lane

The lane takes its model from the ticket's estimate (the `ticket` skill's Estimate) through the lane engine.

Put the lane's start constraints in the lane engine's start field at launch, so the first build has them. News that arrives mid-lane goes to the lane as an ordinary message through the lane engine. It reaches the same agent session without stopping the work; the agent reads it when its runtime next takes input. Cancel a lane only to stop it. When the ticket has a `Merges after` line and the lane engine can hold a lane's ready PR until a named PR lands and then catch the lane up, name that PR at launch; orchestrators otherwise relay each landing by hand. Beside the ticket's own constraints, the start field carries the **worker brief** every lane gets:

- build against the stand-in the ticket names until the ticket it merges after is on `main`;
- stop a process only by a PID you started yourself;
- leave the rest of the machine and the working tree's other state as you found them; `pkill -f`, `git stash`, `git reset --hard`, and `git clean` are forbidden.

Done when the lane engine reports the lane running with its start field set.

## 4. Fill the slots

Fill the slots up to the effort's lane cap. Keep more frontier tickets refreshed (step 2) than there are free slots, and refresh the next one whenever a slot frees. A lane whose PR is ready and waits only on a merge doesn't count toward the cap.

Done when every slot up to the cap is running, or the frontier is empty and the user queue names why each idle slot is idle: an overlap, a blocker, a hard stop, or a ticket in grooming.

## A lane that stopped or failed

1. **Name the cause** from the lane engine's record: a capacity error (Restart or reassign, below), a question (read its last message; [calls.md](calls.md)), something its ticket didn't foresee (Find whose defect it is, below), or a failed review round (Find whose defect it is, below). Done when one cause is named with the line that shows it, and the cause has gone where it points.
2. **Find whose defect it is.** *Principles: `principle-fix-root-causes`, `principle-attack-the-premise`.* Read the reviewer's defect, or what the lane stopped on, against the ticket's Steps and Decided. A defect the ticket's own text causes or allows, including anything it didn't foresee, sends the ticket to the `tracker-hygiene` skill's grooming. The same logic defect coming back after a fix round, on a ticket that rules it out, is the lane's: raise the ticket's estimate to the lane engine's top track, or run it on the model the user names for it, log the move in the decision log, and switch the lane (Start the lane, above). A defect that a missing check or a missing source let through is the environment's: a lint, type, or test that would have caught it, or logs, a test database, or a browser the lane could not reach. The ticket and the lane stay as they are, and a fix goes to the user queue as a proposal, at the level the `correct` skill picks. Done when the defect is pinned on the ticket, the lane, or the environment.
3. **Restart or reassign.**
   - **Capacity errors:** leave the retries to the lane engine when it retries them itself (the effort's practice says whether it does). A lane that still fails after its engine's retries runs on the other provider at the same track.
   - **The lane's defect:** have it reach a safe point, cancel it, and start it again (Start the lane, above) on the raised estimate, with a start message saying what is done.
   - **The ticket's defect:** the ticket is in grooming; its slot goes to the next frontier ticket.
   - **The environment's defect:** the lane carries on once its own fix lands; the proposal waits in the user queue.

   Done when the lane runs again on its new model or provider, or its slot has gone to the next frontier ticket with the reason in the user queue.
