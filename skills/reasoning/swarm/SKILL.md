---
name: swarm
description: Swarm, a large task split into independent parts that run in parallel and are joined into one report. Use when work covers many files, packages, tickets, or checks that don't depend on each other, when one session would run out of context reading it all, and when the user says swarm.
---

# Swarm

The bar: every part of the task comes back with a result or a named gap, and the user reads one joined report, not a pile of worker dumps.

**Worth its cost** when the parts are truly independent and each is large enough that a separate run beats reading it here: an audit across twenty packages, a check run against ten commits, a sweep of every ticket in a project. **Not worth it** when the parts must happen in order, when they write the same files, or when the whole job fits in this session. For the same task given to several runners, use the `arena` skill instead.

## Steps

1. **Frame.** State the question the joined report answers and what counts as done for the whole task. Fix the shape each part returns: `PASS`, `ISSUES`, or `BLOCKED`, each with its evidence, and every issue a part can prove, not only the first. Done when the question, the done condition, and the result shape are written.
2. **Split.** List the parts from step 1's question. Check each pair: no part needs another's output, and no two write the same file; where two would, give each its own target as the `principle-separate-before-serializing-shared-state` skill says. Write down what falls outside every part, so a gap in coverage is a decision rather than an accident. A part that verifies or measures names the exact commit SHA and the method (what one sample is, how many, in what order). Done when a table lists each part's scope, output file, and how it verifies, and the parts together cover the task.
3. **Brief.** Write each part's prompt so it stands alone for a reader who has seen nothing else: the goal, its slice, what lies outside its slice, how to verify, the result shape, and the output file. Pick each part's row from the `scratch-agents` skill's role table by how hard you predict that part is: a part that only reads and checks is a `reader`, a settled edit is a `light code worker` or `prose worker`, and so on. Done when each brief would make sense to a cold colleague.
4. **Run.** Start every part as a scratch agent (the `scratch-agents` skill) at the row step 3 picked, in the background, each brief naming its own result file, and each with its own worktree when it writes. When there are more parts than the providers' capacity allows, start them in batches. Stop the rest early when a returned part shows the whole task's premise is wrong; say which part showed it. Done when every agent has settled, or the remaining ones were stopped with a reason.
5. **Join.** Read every result. A result missing the SHA or method its brief named is rerun once; after a second miss it is a gap, and a gap is never a pass. Merge duplicate issues and note which parts raised each. Sort the issues as the `sort-findings` skill says and grade them as the `grading-evidence` skill says. Done when every part has a result or a gap, and every issue has a bucket.
6. **Report.** One table of parts with their status, one line per issue with its evidence and the parts that raised it, then the gaps, the dropouts, and what step 2 left out of scope. Done when the report answers step 1's question or says what is missing to answer it.

Adapted from pstack's swarm (MIT, Lauren Tan).
