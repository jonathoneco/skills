# Ticket kinds

A ticket's **kind** decides how it is cut and written: who sees the change, what one ticket holds, what its Outcome names, and what proves it. The kind follows who sees the change, not the subject: in a workspace about infrastructure, a new thing the user can do is still a Feature. The tracker's Kind label carries the kind.

Each kind below is a chain. The cut runs it to set the ticket's boundary; the writer runs it again to fill the sections. One ticket holds one coherent slice: when a kind's chain says the slice is whole, it stays one ticket however many files or findings it covers, and a small ticket names why it is small.

## Feature

A user can do something they couldn't before. Label `Feature`.

1. **Who gains what?** Name the user and the thing they can now do. That is the Outcome.
2. **What is the thinnest whole path?** The slice runs from where the user acts to where the result shows, through every layer it needs. Layers that only feed it belong to it.
3. **Does it fit one PR?** A path too big for one PR is a parent whose children each give the user a usable step.
4. **What proves it?** The user's path, run end to end at the effort's test boundary.

## Bug

Behavior differs from what was intended, and someone hits it. Label `Bug`. The intent is on record somewhere: a spec, a ticket, a doc, the product's own words, or code that did it right before; without one, the change is an Improvement.

1. **Who hits it, and what do they see?** Quote what they see today and what they should see. That is the Outcome. Priority follows who hits it now.
2. **What is the root cause?** Reproduce it on current `main` and trace it (the `principle-fix-root-causes` skill). The reproduction goes in Evidence.
3. **What shares the cause?** Every symptom of one cause, and findings the same lane fixes in one pass, are one ticket.
4. **What proves it?** A test that fails on today's `main` and passes after the fix.

## Improvement

Something that already works gets better for the person using it. Label `Improvement`.

1. **Who notices, and how?** Name the user and the difference they notice: faster, clearer, fewer steps. That is the Outcome, as today and after.
2. **Where else does it repeat?** The same improvement across many places is one ticket, each place an acceptance check.
3. **What proves it?** The before and after observed at the place the user looks.

## Refactor or migration

The behavior stays the same and the code takes a new shape. The person who sees the change is the next maintainer. Label `Refactor`. The lane builds it as the `refactoring` skill says.

1. **What does the maintainer find after?** Name it, such as one place to change instead of three. That is the Outcome.
2. **Which readers does it break?** They land in the same PR. When they are too many for one PR, expand and contract, as the `blueprint` skill's `sizing.md` says.
3. **What has to land first?** Fixes to the code being reshaped land before it; the refactor carries a `Merges after` line.
4. **What proves it?** The existing tests pass unchanged, and a grep finds the old form gone.

## Infrastructure or tooling

The only change is in how the system runs or is built: reliability, cost, speed, CI, or the tools around the code. Label `Infrastructure`.

1. **What number moves?** Name the measure and its value today, such as a monthly cost, a build time, or a failure rate. The Outcome is that number, today and the target.
2. **What is the one lever?** One ticket pulls one lever; a second lever that moves a different number is a second ticket.
3. **What proves it?** The number measured after, the same way it was measured before, with both sides run as the `benchmark-checklist` skill says (the `principle-explain-the-number` skill).

## Decision

A call that this session can't make: the person who has to rule isn't here, or the user chose to defer it. Label `Decision`.

1. **What blocks settling it now?** Name the person who has to rule and why they aren't in this session, or the user's deferral in their words. A call an agent can settle by reading or running something, or the user can answer in a line, is settled in the session and written into the ticket it shapes; it gets no ticket of its own.
2. **What are the options?** Each with what the product's users see under it, and a recommendation.
3. **What does it unblock?** The tickets that wait on the ruling list it under Blocked by. The decision ticket's assignee is the person who rules.
4. **What is done?** The ruling recorded on the ticket, and every ticket it shapes rewritten to match.

## Investigation

A question the facts can't answer yet, because the data or event it depends on doesn't exist. Label `Investigation`.

1. **What precondition is missing?** Write it as the trigger to come back, such as "once two weeks of income events are flowing". A question an agent can answer today by reading code or querying is answered in the session; it gets no ticket of its own.
2. **What would the answer change?** Name the decision or ticket that waits on it.
3. **What is done?** The answer with its evidence, and the change it leads to filed, or the waiting ticket closed with that evidence.
