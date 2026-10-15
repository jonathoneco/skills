# Epistemics

How to reason about confidence when evidence is historical, fragmentary, and sometimes contradictory, and how to communicate it without flattening it into false certainty.

Code doesn't carry its own motivation. You can read what code does. You can't read *why it exists*. That lives in commits, PRs, tickets, docs, and conversations, all incomplete, biased, and sometimes missing entirely. Pretending otherwise produces confident-sounding guesses that mislead the user.

## Confidence

Grade every claim on the five grades in the `grading-evidence` skill (observed, supported, inferred, speculative, unknown), with its wording rules. The grade decides which output section a claim goes in: observed and supported in What We Found, inferred in What We Can Reasonably Infer, speculative in Competing Hypotheses, unknown in What We Don't Know.

For a why question, **observed** means an author wrote the reason down; what the code does is observed by reading it, and why it does it is not. The grading-evidence skill's `grades.md` holds examples of each grade, the reasons behind its wording, and how to handle the asker's own hypothesis, sources that disagree, and missing evidence. Read it in full before grading. Use hedges liberally in What We Can Reasonably Infer.

## Avoid rationalization

Code that "makes sense" today may have been written for reasons that no longer apply, or that were wrong when they were written. Don't retrofit a clean rationale onto messy history.

Resist the urge to:
- Assume the author did the "right" thing and work backward to justify it
- Assume a consistent pattern across the codebase was intentional when it might be copy-paste
- Turn an absence of evidence into evidence of absence ("no one mentioned security concerns, so it must not have been a concern")

## Calibration Check Before Finalizing

Before delivering the output, the synthesizer should review every claim in "What We Found" and "What We Can Reasonably Infer" and ask:

1. Does this claim have a citation? If not, either add one or move it to "Inferred" / "Hypotheses".
2. Is the phrasing calibrated to the tier? (An observed claim can use "because". An inferred claim cannot.)
3. Am I treating the code itself as evidence for its own intent? If so, that's not evidence. Remove or reclassify.
4. Does the output include a "What We Don't Know" section? If no gaps are mentioned, that's suspicious. Either the evidence was unusually complete or something is being swept under the rug.
