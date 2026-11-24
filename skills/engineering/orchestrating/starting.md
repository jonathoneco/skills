# Handing tickets to builders

Handing out a ticket: on the first run, whenever a builder is free for its next ticket, and when a ticket from a stopped or failed builder runs again.

## 1. Pick the ticket

Read the tracker at the moment of the decision: each ticket's blockers, state, and files as they stand now. The **frontier** is every ticket startable now: every tracker blocker merged, and the paths in its Refresh if drifted `paths` block don't overlap another builder's open work. An overlap waits for that work to merge, or goes to the builder that holds those paths; it is not a blocker on the ticket. Before a fan-out, run the shared `pr-overlap.sh` on each builder's files and give each shared file one owner. The shared scripts folder is `~/.local/state/agent-notes/orchestrators/shared/scripts/`; its `README.md` lists the scripts. A `Merges after` line (the `ticket` skill's Relationships) holds only the merge, so that ticket is on the frontier at once. A ticket's priority, for this choice, is the highest of its own and of every ticket waiting on it, directly or through others, so an Urgent ticket's blockers start first. Start the highest priority first; among equal priorities, the one the most tickets wait on, directly or through others.

Done when the ticket is on the frontier, no frontier ticket has a higher priority by that measure, and none at its priority has more tickets waiting on it.

## 2. Refresh it if drifted

A ticket with no Refresh if drifted section skips this step. Its overlap test in step 1 uses the files its Steps name.

When `main` has moved in the ticket's paths since the base SHA in its Refresh if drifted section, follow that section and record the new base SHA and what changed there. A refresh that would change the ticket's Outcome, or finds a Decided premise that no longer holds, sends the ticket to the `tracker-hygiene` skill's grooming instead, and the next frontier ticket takes its place.

Done when the ticket's base SHA matches `main` in its paths, the ticket has no Refresh if drifted section, or the ticket is in grooming.

## 3. Hand the ticket to a builder

Before the ticket goes out, list the tree of `origin/main` once and confirm that every path or project the ticket names as a destination exists there. A missing destination sends the ticket to the `tracker-hygiene` skill's grooming.

Give the ticket to the running builder whose concern it fits. A ticket that fits no running builder's concern starts a new builder: `light-code` when every ticket in its concern is small and settled (the `ticket` skill's Estimate), else `code`.

Send the ticket with its start constraints, so the first build has them. News that arrives mid-ticket goes to the builder as an ordinary message through the engine. It reaches the same agent session without stopping the work; the agent reads it when its runtime next takes input. Stop a builder only to retire it. When the ticket has a `Merges after` line and the engine can hold a ready PR until a named PR lands and then catch the branch up, name that PR with the ticket; orchestrators otherwise relay each landing by hand. A brief built by copying another builder's brief is searched for the source's names, such as its bot, its secret names, and its ticket ID, before it is sent; a copied brief once named another bot's token. A new builder's first prompt carries the **worker brief** every builder gets:

- build against the stand-in the ticket names until the ticket it merges after is on `main`;
- stop a process only by a PID you started yourself;
- leave the rest of the machine and the working tree's other state as you found them; `pkill -f`, `git stash`, `git reset --hard`, and `git clean` are forbidden.

Done when the builder holds the ticket with its start constraints, and a new builder holds the worker brief.

## 4. Keep the builders working

Keep builders working up to the effort's builder cap. Keep more frontier tickets refreshed (step 2) than there are builders free to take them. A builder whose open PR waits only on review or a merge can take its next ticket. A builder retires when its concern has no ticket left or its context has gone stale: it writes what it learned to the effort's notes first, and a later builder on that concern starts from that note.

Done when every builder up to the cap holds a ticket, or the frontier is empty and the user queue names why each idle builder is idle: an overlap, a blocker, a hard stop, or a ticket in grooming.

## A builder that stopped or failed

1. **Name the cause** from the engine's record and the builder's last messages: a capacity error (Restart or reassign, below), a question (read its last message; [calls.md](calls.md)), something its ticket didn't foresee (Find whose defect it is, below), or a failed review round (Find whose defect it is, below). Done when one cause is named with the line that shows it, and the cause has gone where it points.
2. **Find whose defect it is.** *Principles: `principle-fix-root-causes`, `principle-attack-the-premise`.* Read the reviewer's defect, or what the builder stopped on, against the ticket's Steps and Decided. A defect the ticket's own text causes or allows, including anything it didn't foresee, sends the ticket to the `tracker-hygiene` skill's grooming. The same logic defect coming back after a fix round, on a ticket that rules it out, is the builder's: move the ticket to a builder on a stronger model, or on the model the user names for it, and log the move in the decision log (Hand the ticket to a builder, above). A defect that a missing check or a missing source let through is the environment's: a lint, type, or test that would have caught it, or logs, a test database, or a browser the builder could not reach. The ticket and the builder stay as they are, and a fix goes to the user queue as a proposal, at the level the `correct` skill picks. When the builder parked on a guard, a list, a slow test, or a gate, first check the premise of that guard against the toolchain, then bring the user "keep, replace, or delete" before "which repair". Done when the defect is pinned on the ticket, the builder, or the environment.
3. **Restart or reassign.**
   - **Capacity errors:** leave the retries to the engine when it retries them itself (the effort's practice says whether it does). A ticket whose builder still fails after the engine's retries moves to a builder on the other provider at the same strength.
   - **The builder's defect:** have it reach a safe point, then hand the ticket to the stronger builder (step 2) with a message saying what is done.
   - **The ticket's defect:** the ticket is in grooming; its builder takes the next frontier ticket.
   - **The environment's defect:** the builder carries on once its own fix lands; the proposal waits in the user queue.

   Done when the ticket runs again on its new model or provider, or its builder has taken the next frontier ticket with the reason in the user queue.
