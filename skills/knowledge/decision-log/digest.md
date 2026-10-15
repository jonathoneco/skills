# Check-in: the digest and the user's answers

When the user checks in, show them the calls made in their place, and apply what they answer.

## 1. Build the digest

Run `scripts/digest DECISIONS.md` for a draft: it reads every entry after the one `Last digest:` names, counts them by grade, lifts the entries for Look at these first, and lists the candidates. Fill in what it leaves as `<...>`, such as the user queue's path and count, and check the lines it flags as ungraded. Then write the digest into the check-in message, and set the log's `Last digest:` line to this digest's time and last id.

```markdown
# Digest · <date -Iseconds> · D-<first> to D-<last>

<n> entries since the last check-in: <n> direct, <n> analog, <n> principle calls; <n> user answers; <n> standing-rule actions; <n> overturns. <n> questions waiting.

## Look at these first
<!-- Entries with a Look first line, principle-level calls, calls that moved scope between tickets, and calls that reached anything hard to undo, one short paragraph each: the question, the pick, the precedent, the undo and whether anything hard to undo was reached. -->
- D-<n> (<effort>) ...

## The rest
<!-- One line each: id, effort, question, pick, precedent. -->
- D-<n> (<effort>): <question> → (<x>), per <doc § section>.

## Waiting on you
<n> questions in the user queue: <path to the queue>.

## Candidate precedents
<!-- Each with the entry it came from. -->
- From D-<n>: <rule>.

Answer with "ok" to confirm everything not named, "overturn D-<n>: <reason>", the queue's questions by number, or "promote", "drop" or an edit for each candidate.
```

Done when every log entry since the last digest appears in this one with its id, the digest points at the user queue for what is waiting, every `Candidate:` line since the last digest is listed under Candidate precedents, and `Last digest:` is updated.

## 2. Apply the user's answers

- **Confirmed**, including everything a blanket "ok" leaves unnamed: mark the entry confirmed.
- **Overturned:** undo the call if it can be undone, and say what the undo did and whether the call reached anything hard to undo. Record the correction as a new entry in the overturn form below, with the user's reason in their words, and set the overturned entry's Status to `overturned <date> (see D-<m>)`.
- **Answered question:** act on the answer, log it in the entry form graded `user`, and remove it from the user queue.
- **Candidate promoted, dropped, or edited:** a candidate binds once the user promotes it. A promoted one goes into the doc that owns it: a general principle into the judgment reference of the skill that made the call, such as the `blueprint` skill's `sizing.md`, or the one the user's rules name; a repo rule into the repo's judgment doc through that repo's PR process. The promotion is the approval for that edit. A dropped one's line becomes `Candidate: dropped <date>`; an edited one takes the user's wording.

The overturn form:

```markdown
### D-<n> · <date> · overturn of D-<m>

- The user: "<their words>"
- Undo: <what was reversed, and how it was checked> · reached: <what, if anything, could not be reversed>
- Counter-example: <the call, what was recommended, what the user picked, their reason>
- Candidate: <the corrected rule>
```

Done when every entry in the digest is confirmed, overturned with its undo reported, or still open by the user's choice; every answered question is logged and cleared from the user queue; and every promoted candidate is on `origin/main` in its doc, or opened as that repo's PR.
