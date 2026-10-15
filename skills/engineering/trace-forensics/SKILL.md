---
name: trace-forensics
description: Read a profile, trace, heap snapshot, or spindump down to a cited cause in source, capturing one live first when none exists. Use when the user hands over a profile or asks for one to be taken. A bug or an unknown slowdown goes to diagnosing-bugs; making a known path faster goes to perf-issue.
---

# Trace forensics

**You own the diagnosis from the artifact.** The deliverable is a cited diagnosis, not a fix.

Once captured, the artifact is a fixed dataset, read it, don't re-run it. Keep tooling generic: a DevTools or trace parser for cpuprofile and `.json.gz`, a text editor for a spindump, your heap tooling for a heapsnapshot.

1. If no capture exists yet, capture the live signal on the matching surface through the repo's verification skill, or drive the real surface when the repo has none: a CPU profile for a spinning process, a heap snapshot for a leak, a CDP trace for a visual glitch. A real artifact, not a guess.
2. Identify the format and load it with the right tool. Parse large artifacts in a scratch agent the `scratch-agents` skill starts (the **principle-guard-the-context-window** skill) and keep the reduced finding in the main thread.
3. Transform the raw artifact into a form you can query. Dump the trace or heap snapshot into sqlite, one row per sample, frame, or node. Reach the queryable shape before you read.
4. Narrow to the cause. Query for the frames that hold the most time and walk the call tree to the hot path. For a leak, follow the retainer chain from the leaked object to a GC root. For a spindump, find the thread stuck on-CPU or blocked and its wait reason.
5. Attribute to source. Map the hot frame to file, symbol, and line via the artifact's own symbols. A frame with no source mapping is not yet a diagnosis. Resolve the symbols, or say plainly the artifact does not carry them.
6. Prove the mechanism before believing it. If you have a paired capture, diff the before and after artifacts to confirm. If the process is live, inject instrumentation via CDP eval on the running process, or hotfix the live code without reloading where the runtime allows it, to confirm the hypothesis cheaply. Otherwise, mark the finding as the strongest hypothesis the artifact supports, not a confirmed cause: `[hyp]` in the **grading-evidence** skill.
7. Hand back a cited diagnosis, no fix unless asked. Route to the `diagnosing-bugs` or `perf-issue` skill once the cause is known.

**Reply:** the artifact and format, the reduced finding, the source location, the artifact paths, and how the mechanism was proven: a paired capture, live instrumentation, or neither.

Adapted from pstack's trace-forensics and runtime-forensics playbooks in poteto-mode (MIT, Lauren Tan).
