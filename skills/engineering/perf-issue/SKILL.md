---
name: perf-issue
description: Make a known path faster, tying every fix to a before-and-after measurement and trying the cheapest fix first. Use when the user asks to speed up a path or cut its cost. An unknown slowdown or a bug goes to diagnosing-bugs; reading or capturing a profile goes to trace-forensics.
---

# Perf issue

**You own the measurement story. Plan, review, verify the numbers.** Tie every fix to a measurement, don't read source instead of measuring.

1. Capture a baseline trace on the real surface through the repo's verification skill, or drive the real surface when the repo has none. Vet the baseline, and each later number, with the **benchmark-checklist** skill.
2. `how` to ground hypotheses. Don't claim a perf ceiling without running it first.
   Try the performance mantras in order, cheapest first:
   1. Don't do it. Stop work whose result nothing uses rather than cheapening it.
   2. Do it, but don't do it again.
   3. Do it less.
   4. Do it later.
   5. Do it when they're not looking.
   6. Do it concurrently.
   7. Do it cheaper.

   When an earlier mantra meets the target, stop.
3. Plan the fix from the trace. If it crosses a function boundary, `architect` first. Delegate implementation to a scratch agent at the `scratch-agents` skill's code worker row. Review the diff. Capture a post-fix trace.
   Apply **principle-sequence-verifiable-units**, verifying each attempt before trying the next.
4. Parse and compare the artifacts with the **trace-forensics** skill (JSON to sqlite, diff). "Inconclusive" or wrong-surface is not a pass. Flag it.
5. Cite the measurement in the PR.
6. Open the PR as the `opening-a-pr` skill says.

For sustained improvement against a metric rather than a one-off fix, use the `hillclimb` skill.

**Reply:** baseline number, post-fix number, delta, artifact path.

Adapted from pstack's perf-issue playbook in poteto-mode (MIT, Lauren Tan).
