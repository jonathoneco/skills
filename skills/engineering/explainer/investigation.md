# Investigation report

An investigation answers an open question with evidence. The reader needs the answer and how far to trust it. It is usually one page; evidence that outweighs the answer gets a page of its own.

## Reasoning

1. **The question.** Decide what the answer will change and what the asker believes now, from the ask, as the `sort-findings` skill says. Done when both are written down.
2. **Hypotheses.** List the candidate answers, from that belief and a first reading. Done when each is stated so a measurement could prove it wrong.
3. **Measurements.** Run the cheapest measurement for each hypothesis, break down any heavy number, explain any measured speedup, latency, or eval result as the `principle-explain-the-number` skill says, and find a control case, as the `grading-evidence` skill says. A hypothesis about what code does goes to the `how` skill; one about why it is that way, to the `why` skill. Done when each hypothesis is settled, or carries the measurement that would settle it, each query has its date, and each claim it leaves is a ledger row.

**The takeaway carries** the answer against the asker's belief, how far to trust it, and any choice it leads to, correcting anything said earlier that turned out wrong.

## On the page

- The answer comes first, in one or two lines, with how far to trust it and the date any data was queried.
- A choice is a decision card (decision-brief.md's Decision cards).

## Agent context

The commit the code was read at. Under each claim: the query, command or file that produced the observation, and what it returned. Under each hypothesis: the measurement that would settle it, written so an agent can run it.
