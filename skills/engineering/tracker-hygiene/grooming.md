# Grooming

Grooming brings filed work back to the **clean state** ([SKILL.md](SKILL.md)). A pass covers one project or a whole workspace. Until the user says go, every change is a proposal; after it, each write gets a line in the effort's ledger, as the `linear` skill says.

Open a todo list before the first step. Its first todo loads every `principle-*` skill the pass could reach: those the latest `[mode]` reminder names, or, when none came, each one whose moment the full principle list shows the pass reaching. Then one todo per step below, each checked off when its Done when holds, or marked `skip: <reason>`. The effort's folder is the pass's notes folder (the `agent-notes` skill).

1. **Re-read the rules:** this skill's clean state and Metadata, and the tracker doc's values; confirm the `linear` skill's GraphQL route answers. Done when you can name the tracker's Kind labels and estimate scale.
2. **Read the state.** In one list read, fetch every open issue and project in scope with its body, project, assignee, priority, labels, estimate, milestone, state, parent, and last update; for projects, also their lead, status, and overview. This read is the pass's before-read: step 6 compares against it rather than reading each ticket again. Done when the read is saved in the effort's folder.
3. **Settle what has merged.** For each ticket, check `main` for the work before believing its status. Work that merged but doesn't finish the ticket stays open with what remains stated. Done when every ticket's status matches `main`.
4. **Find the gaps.** Check each issue and project against every rule of the clean state, and each ticket's body against the `ticket` skill's Contents bar (its `contents.md`). Each finding names the ticket, the rule it misses, and the fix: a field value set as Metadata says, a fold into a duplicate, a move to the project whose outcome it serves, a close with a reason, a container converted into a milestone, a parent, or a project document, or a redraft. For a project: its outcome, lead, status, and milestones, and an initiative when a goal spans several projects. A fix the reads can't settle, such as who should own a ticket or whether a container becomes a milestone, a parent, or a project document, is a question for the user, carried into the proposal with your pick. Done when every issue and project in scope has been checked against every rule.
5. **Propose.** Bring the user the findings grouped by fix, with a count for each group and the tickets in it. Done when the user has said go, on all of it or on the groups they name.
6. **Apply** what the user approved:
   - Field-only changes go as one batch, read before and after as the `linear` skill says for a batch of field changes.
   - Body and relation changes, folds, and closes are written as the `linear` skill says for a rewrite, with a receipt on every close.
   - A ticket below the Contents bar is redrafted with the `blueprint` skill's short path, briefed with the ticket's current body and its finding from step 4; the user's go on the proposal confirms its kind and Metadata. It is written back as a rewrite.

   Done when every approved change is written and read back, and each write has its ledger line.
7. **Record the plan.** Draft a project update for each project the pass changed, as the clean state says. Done when each is drafted for the user.

Done when every issue and project in scope meets the clean state, is closed with a receipt, or is named in the proposal as left as it is on the user's word.
