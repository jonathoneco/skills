# The grades, by example

Examples of each grade, and the reasons behind the wording rules. Read it when a claim's grade is a close call, or before grading a why question, where the evidence is historical, fragmentary, and sometimes contradictory.

Code doesn't carry its own motivation. You can read what code does. You can't read *why it exists*. That lives in commits, PRs, tickets, docs, and conversations, all incomplete, biased, and sometimes missing entirely. Pretending otherwise produces confident-sounding guesses that mislead the user.

## Observed

An explicit, textual source that answers the question. Not "the code does X so the author must have wanted X." Something an author actually *wrote* that says why, or something you ran and saw.

- A PR description that says "this fixes the bug where users with >1000 items couldn't paginate"
- A ticket that says "we're adding this because customer Acme requested it in their security review"
- A code comment that says "// clamp to 100 because the upstream API rejects larger values"
- A design doc that says "we chose option A over option B because we need persistence across restarts"
- A chat message from the author saying "switching to this approach since the old one was flaky in tests"
- A query you ran that returned 9 of 16 rows with the wrong label this week

## Supported

Several pieces of indirect evidence converge. No single source states it, but the pattern across sources makes it likely.

- The PR title says "improve performance," the ticket is labeled "perf," and the surrounding commits all touch the same hot path
- Several tests were added alongside the change, all exercising edge cases with very large inputs
- The author's other PRs from the same week all mention the same incident in their descriptions

## Inferred

A reasonable reading of the context, but nothing explicitly supports it. The reader should understand this is *your interpretation*, not a fact from the record.

- The PR doesn't say why, but given the error was happening in production (per the incident channel timing) and the fix was rushed (merged the same day), it was likely a hotfix.
- The function name suggests retry logic. The retry count is 3. This matches the team's general convention of "3 retries" seen elsewhere in the codebase.

## Speculative

A plausible hypothesis, but the evidence is thin and other explanations fit equally well. Presenting these is valuable when they are marked as guesses.

- "This might be a workaround for a browser bug that's since been fixed, but we found no contemporary evidence of that."
- "It's possible this threshold was chosen to match an SLA commitment, but no SLA doc references it."

## Unknown

You looked and couldn't find out. A valid and important outcome. "We couldn't find out" is less useful than "we searched the ticket tracker with keywords A and B, scanned the 6 PRs that touched this file since 2023, and grep'd the repo for string literals matching the threshold. None surfaced a rationale."

An honest "we don't know" is one of the most valuable answers you can give. The user now knows:

- The answer isn't in the obvious places
- They'll need to ask a person (the original author, the product owner, the team lead) to find out
- Or they can decide the question isn't worth pursuing further

A gap filled with a confident guess harms the user: they act on the guess.

## Why the wording rules

- **Words that claim certainty** ("because", "the reason is", "was designed to", "fixes", "addresses", "solves", "the team decided") each claim a cause, an author's intent, a goal reached, or a group decision. Each needs a source beside it.
- **Hedges** ("appears to", "seems to", "likely", "suggests", "is consistent with", "one reading is", "plausibly", "may have been", "the evidence points toward") tell the reader you are interpreting, not reporting.
- **Words that hide uncertainty:** "obviously": if it were obvious, the user wouldn't be asking. "Clearly" almost always comes before a claim that isn't clear; "of course" is the same. "Just" ("it's just X for performance") is dismissive and usually hides uncertainty. "I think" and "I believe" put an opinion where the evidence goes: "the evidence suggests" says the same with its source.

## The asker's hypothesis

People often ask with a hypothesis inside the question: "Why do we do it this way, I assume it's for performance?" Treat it as one candidate among others and check the evidence for it independently. When the evidence supports it, say so with citations. When it doesn't, say so and present what the evidence *does* support. The asker's guess is a prompt for investigation, not a conclusion to validate.

## Sources that disagree

When two sources disagree, show both rather than the one that fits a tidier story. A typical pattern:

- **The ticket says** "we need this for customer X's compliance requirement"
- **The PR says** "cleaning up tech debt in this area"

Both may be true (the ticket motivated the work, the PR is the author's framing of it), or one may be wrong. Present both with their citations and let the user make the call.
