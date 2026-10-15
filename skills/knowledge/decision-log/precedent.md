# Precedent: has this been decided?

Before deciding anything in the user's place, find where the question is already decided. Search each source for the call's shape, not its words: the same trade-off on a different object counts.

## Sources, highest rank first

1. The ticket the call is about: its Decided, Steps, and Out of scope.
2. The tickets it blocks and is blocked by, its parent, and the effort's other open and not-yet-started tickets, since a later ticket that owns the question may carry no link to this one.
3. The effort's rulings: its rulings note in agent notes (the `agent-notes` skill), any rulings file the repo's docs keep for that effort, and this log's own entries that the user confirmed or whose candidates they promoted.
4. The initiative's own research, design, and specs, including its contracts with their field-path tables, and its vendor audits, wherever the repo or bundle keeps them.
5. The repo's judgment doc, when the repo's `AGENTS.md` names one.
6. The calling skill's judgment reference, such as the `blueprint` skill's `sizing.md`, or one the user's rules name: general principles, each with its cases.

## Grading a ruling

A **covering ruling** is one whose reason, read plainly, decides this call. Grade each one:

- **Direct:** a ruling on this exact case or object, including a later ticket whose Decided or Steps already owns it. A step that ticket needs goes into that ticket.
- **Analog:** a ruling on the same shape elsewhere ("leave a misleading value out" applied to a new field).
- **Principle:** only a general principle reaches it.
- **User:** the call carries the user's own authority: they answered it directly ([digest.md](digest.md)), or a standing rule of theirs authorizes its class.

Then read the **counter-examples** under each covering ruling. A counter-example is a recommendation the user turned down, so it shows which way they lean at that edge; it pulls against your pick when your pick looks like the recommendation that lost. What counts depends on the source: for a principle in a judgment reference, its cases marked **Counter-example**; for any other source, a recommendation the user turned down on that ruling, where the source records one.

A higher-ranked ruling outranks a lower one; two rulings of the same rank that point opposite ways are a **conflict**, and a conflict is never resolved by the agent alone.

Done when every source has been searched and every covering ruling is named by its source, section, and bold line (or a rulings-note line, ticket section, or research verdict), quoted, with its grade, and its counter-examples read. A call with no covering ruling names the sources searched.
