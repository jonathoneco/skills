# Spec

A spec presents a design. Its reader judges the design without opening the code.

A **journey** is the worked case walked through the flow, step by step. A spec that needs several pages ([full-path.md](full-path.md)) usually splits into a rulings page first when calls are open, then the flow, then the records behind it.

## Reasoning

1. **Parts.** Name each part and what it does, from the code and the rulings. Done when every part a journey will touch is named.
2. **Worked case.** Pick the one real case the page follows, from the records those parts handle. Done when its ids and states are written down.
3. **First journey.** Trace the case through the parts hop by hop with the `how` skill, naming each hop's mechanism, such as a direct call, an event, a read, or a timer, and what the product's users see or get. Done when every hop cites the symbol that does it, each hop re-read from the source rather than from memory of the argument.
4. **Further journeys.** Add a journey for each mechanism, hold, race, or delivery case the first did not show, enumerating the outcomes of any event with several. Done when every mechanism, hold, race, and delivery case has a journey, and every outcome of an event with several is shown.
5. **Change.** For each part that changes, set today against the proposal on the same case. Done when each part's one difference is named.
6. **Failures.** For each failure a journey can hit, find how the product's staff see it and the tool or surface that repairs it live. Done when each failure has both, or the page says plainly that none exists.
7. **Bounds.** Say what stays the same for the product's users, and what is outside this work. Done when the notes list what stays the same for the product's users and what is outside this work, and the page states both lists.
8. **Open points.** Give each unsettled point the recommended answer. Done when each has one; when they pile up, gather them into a decision brief (decision-brief.md), as its own artifact or as a page in the spec's.

**The takeaway carries** the design, what changes for the product's users, and the calls the reader rules on, from steps 5 to 8.

## On the page

- A part sits in the same spot in every diagram.
- A journey shows its diagram, then its hops as a native table, one row per hop: the step number, from and to, the kind, what moves, and who it reaches or who acts. Each row says what the product's users see or get, and what the code does about it, with the symbol that does it.
- Today and the proposal sit side by side on the same case, so the one difference stands out.

## Agent context

The heaviest on rulings: every section gives each ruling in full (what was decided, why, what was turned down, and the file that records it), plus the paths behind its symbols and the checks that show the design holds.
