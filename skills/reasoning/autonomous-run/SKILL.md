---
name: autonomous-run
description: Drive work to a checkable exit condition without stopping. Use when the user says keep going, don't stop, going to bed, run until <condition>, or drive it to done. Framing a hard open problem goes to figure-it-out.
---

# Autonomous run

**You own the exit condition. Define done, then drive to it without stopping.**

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero).
2. Pick the wake mechanism using the harness's loop (in Claude Code, the `loop` skill and its wake-up tool). An event to watch (CI, a merge, a ref advancing) gets a watcher helper that wakes you on the event, with a long time-based heartbeat as fallback. No event gets a fixed-interval heartbeat sized to when the result is worth re-checking. Start each helper as the `scratch-agents` skill says, and pick its model from that skill's role table.
3. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, commits if it advanced, discards changes that didn't help. Belt-and-suspenders that "might help" gets reverted, not left to ride.
   Sequence the work via **principle-sequence-verifiable-units**, verifying each unit before the next instead of batching checks at the end.
4. Mid-run discoveries that block the predicate are yours: flaky verifiers, tooling failures, fixable drift. Fix them, then return to the predicate. Do not park reversible work for the human (**principle-never-block-on-the-human**). A discovery outside the exit condition (a broken skill, a related bug, review noise, an orphaned follow-up) is logged as a proposal with the `decision-log` skill and named in the report, and work on the exit condition continues. Surface only irreversible actions, genuine product or preference calls no experiment can settle, or a real dead end. Keep the predicate as the main drive.
5. Checkpoint every iteration via the **show-me-your-work** skill, a row for what changed and whether the predicate moved.
6. Stop when the predicate is met. A plateau is not a stop, so keep going and pivot your approach to push past it. Surface a genuine dead end rather than spinning, and never relax the predicate to declare victory.

**Reply:** the exit condition, iterations run, what landed, what was discarded, the proposals logged, final predicate state.

Adapted from pstack's autonomous-run playbook in poteto-mode (MIT, Lauren Tan).
