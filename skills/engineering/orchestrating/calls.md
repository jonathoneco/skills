# Calls in the user's place

A lane may send any message, including a question, news, or a call that would wait on the user. Read each message, reply when it needs a reply, and carry on when it does not. A lane's question arrives as a message the agent sent. A message to a deliberately parked lane is held until the orchestrator explicitly resumes it. The orchestrator answers "what would the user say?" from **precedent**: the user's past rulings, found and logged as the `decision-log` skill says.

## 1. Check the question itself

- **A second question its ticket should have answered:** stop the lane at a safe point and send the ticket to the `tracker-hygiene` skill's grooming. Its slot goes to the next frontier ticket ([starting.md](starting.md)).
- **A file the lane says is missing:** look for it at the exact head of `origin/main`. When it is there, the lane's `origin/main` is stale: answer with that head and "merge your origin/main".
- **A gap in what the lane was started with** (a missing constraint, a worker-brief rule it broke, a refresh step that misled it): answer the lane, then fix it where it lasts, in the effort's practice and in the start field of every lane not yet started.

Done when the question is one only a call can answer, or it has been answered or sent to grooming.

## 2. Sort the call into a tier

Ask these in order; the first yes sets the tier.

1. **Does it change another effort's tickets, code, or queue?** It goes to the cross-project session as an ask, or to the user queue when none exists, and skips the steps below.
2. **Is it hard to undo** (a merge, a deploy, a tracker write other than ticket upkeep, a message sent), does it touch production or a flag, or does it cost money beyond what a ticket names? **Ask.**
3. **Is it a product choice nobody made, and can the product's users see its effect** (not behind a flag, not internal, not deployed only to dev), or can a follow-up PR not undo it without data cleanup? **Ask.**
4. Otherwise **Decide**: operational calls, reading a drifted ticket, design inside a settled principle (a name, where code lives, which ticket carries a step), scope moves between tickets, ticket upkeep (refreshing a ticket against `main`, fixing a ticket for its lane, closing one whose post-merge readings held), and product choices a ticket or ruling already settles.

Precedent leaves an Ask an Ask; only a standing rule moves it. Done when the call has one tier, has gone to another effort's owner, or a standing rule authorizes its class.

## 3. Check the hard stops

When the call hits one of the effort's hard stops:

- **Route around it** when another option reaches the same goal without crossing a stop and can be undone, or when the next step finds a ruling covering that option. Take it, and log it with a `Look first:` line ("chose B because A adds cost").
- **Otherwise park it:** the question goes into the user queue (step 5, on an ask). The lane keeps working on everything the answer does not gate. When nothing ungated is left, stop the lane at a safe point and give its slot to the next frontier ticket. A parked call skips step 4; its reason in the queue is the hard stop it hits.

Done when the call crosses no hard stop, is routed around one, or is parked.

## 4. Find the precedent

Find the precedent as the `decision-log` skill says, with the user's judgment reference for orchestrating, when their rules name one, and the `blueprint` skill's `sizing.md` for a call on how work is cut into tickets.

Done when the `decision-log` skill's precedent search meets its own done condition.

## 5. Decide, act, log; or ask

*Principles: `principle-never-block-on-the-human`.* **Standing rule:** a call a standing rule authorizes still goes through step 4, to find and quote that rule, and this step acts on it without the decide tests below. Its log entry is graded `user`, its `Precedent:` line naming the rule's source and quoting it.

Every other call: **decide** when all of these hold, and ask otherwise:
- the tier is Decide;
- a call that adds a mechanism, a guard, an alert, a ticket, or long-lived infrastructure has a direct or analog ruling, because heavier mechanisms are where recommendations most often miss;
- at least one ruling covers the call, no counter-example pulls against the pick, and no conflict stands; a route-around of a hard stop may rest on being undoable instead of on a covering ruling.

**On a decide or a standing-rule action,** act, then write the log entry in the same turn, before the next call, in the `decision-log` skill's entry form. A product choice nobody made gets a `Look first:` line. Reply to the lane with the pick as an ordinary message; it steers the same agent session and does not cancel or restart it. The reply reaches the active session during a turn, or starts the next turn in that same saved session after the agent ends its current turn. Acceptance means the lane engine retained the reply, not that the agent read it or did the requested work; judge that from the lane's next work. Label the pick "orchestrator call D-<n>", since lanes copy answers into PR bodies; "relayed from the user" is reserved for the user's own words.

**On an ask, and on a parked hard stop,** put the question in the effort's user queue. It opens with what is stopped and what the user's answer frees, such as "Refund approval (ABC-142) can't merge until you pick A or B; your answer frees 3 tickets". Name each ticket by its title with its key beside it; a bare key means nothing to the user at check-in. Then it frames the call as a product choice: the options with what the product's users see under each (the `weighing` skill), your pick, and why it is asked (the hard stop it hits; no covering ruling, with the sources searched; a conflict, naming both sides; or its Ask tier). When the effort's practice sets the queue's format, that format holds. The user meets the question at check-in rather than mid-run. A question carried over from an earlier session is re-derived against today's rules and rulings before it is asked.

Done when every call in the turn has a log entry or a question in the user queue, and no slot is held by a lane with nothing ungated left to do.
