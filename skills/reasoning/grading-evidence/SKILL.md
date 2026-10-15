---
name: grading-evidence
description: Use when writing a finding, report, or ticket claim; putting a number or frequency word on a page; answering with evidence; or acting on a claim someone else graded. Grades each claim observed, supported, inferred, speculative, or unknown.
---

# Grading evidence

The bar: a reader can tell what was seen from what was reasoned out, and every number can be re-run.

## The grades

Five grades, one tag each in notes and reports, one wording each on a page. A claim's grade is the strongest its evidence earns, never the one that reads best.

| Grade | Means | In notes and reports | On a page |
|---|---|---|---|
| **observed** | You saw it: ran the command, read the rows or the logs, reproduced it, or read the text itself in its source at a named SHA or date. For why something exists, observed means someone wrote the reason down: a commit, a PR, a ticket, a comment, a doc. | `[obs]` | Stated plainly, with its source where a reader would check it. |
| **supported** | Several observations converge on it and none states it outright, such as a PR titled "improve performance", a `perf` label, and every nearby commit touching the same hot path. | `[sup]`, naming the observations | "The evidence points to X: A, B, and C." |
| **inferred** | You reasoned it out from things observed. | `[hyp]`, with what would measure it | Hedged, with the chain shown: "Given A and B, C is likely, because D." Add what would measure it where that bears on what the reader decides. |
| **speculative** | It fits, but the evidence is thin and other explanations fit as well. | `[spec]`, beside the competing explanations | "One possibility is X, but nothing shows it", listed with the other candidates, never alone. |
| **unknown** | You looked and could not find out. | `[unk]`, with what was searched | "We searched X, Y, and Z for this and found nothing." |

When a claim's grade is a close call, or the question is why something exists, read [grades.md](grades.md): examples of each grade, and the reasons behind the wording rules.

An unknown is a finding, not a gap to fill with a guess: name the question, each source searched, what was searched for in each, and what came back. The reader learns the answer isn't in the obvious places and who could answer it.

A claim a person, a worker, a doc, or a ticket made and you have not checked is theirs, not yours: quote it, name the source, and grade only what you checked. A worker's self-report or a note written from memory is often wrong; the file at the exact head is what you observe.

### Wording

- **Words that claim certainty** carry a source beside them: "because", "the reason is", "was designed to", "fixes", "the team decided". Each is a claim of observed or supported.
- **Hedges mark inference:** "appears to", "likely", "suggests", "is consistent with", "one reading is", "may have been".
- **Words that hide uncertainty** come out: "obviously", "clearly", "of course", "just" ("it's just for performance"), and "I think" in place of the evidence.
- **Two sources that disagree are both shown,** each with its citation. Both may be true, such as a ticket that motivated the work and a PR that framed it differently; the reader makes the call.

## Rules every graded claim meets

- **Count before saying how often.** A word for frequency, such as "often" or "rare", carries its count, and every number carries its denominator and its date window: "9 of 16 in production this week". One case is an anecdote. Fetch the measurement rather than estimating it.
- **Quote a wrong value exactly** as the reader saw it, such as the label or the field's contents.
- **The cheapest measurement first.** For each hypothesis, find the cheapest measurement that turns it into an observation, and run it. When it can't be run, for lack of access or because it would write to production, say what blocks it.
- **Break a heavy number down** until its parts explain it, and say where the breakdown stops and why.
- **Name the unit**, and how far off earlier estimates were. Wall-clock time and billed time are different numbers.
- **Find a control case** that shows the answer is not an accident of the one case examined: a record the bug spared, a run from before the change.
- **Code is not evidence of its own intent.** What code does is observed by reading it; why it exists is observed only in what someone wrote: a commit, a PR, a ticket, a comment. Without that, the why is inferred.
- **The asker's hypothesis is a prompt, not a conclusion.** "I assume it's for performance" is one candidate among others; check it like the rest, and answer against what the asker believes.

## Acting on a grade

- Before a step rests on a `[sup]`, `[hyp]`, or `[spec]` claim, confirm it in the source and regrade it.
- When a measurement later disagrees with a claim graded below observed, the measurement wins; correct the claim where it was made, and anything built on it.
