---
name: sort-findings
description: Use when findings come back from a review, an investigation, or a worker, and before writing calls into a page or a queue. Puts every item in fix, repair, call, noted, or dismissed, and holds the never-skip list.
---

# Sort findings

The bar: every finding ends in one bucket with a reason, the user sees only the calls and proposals that are theirs, and nothing on the never-skip list is dropped by an agent alone.

Findings come from anywhere: your own reading, a review run (a scratch agent, the `scratch-agents` skill), a review bot's comments, a worker's question, or the user. The sort is the same.

## 1. Frame

- **What will the answer decide?** A finding worth chasing changes what someone would do. Put the ones that change nothing in Dismissed, with the reason "changes nothing".
- **What does the asker believe now?** Answer against that belief, and correct anything said earlier that turned out wrong.
- **Scope:** does each item belong to this effort? One driven by an incident, or owned by another effort, is handed off with what was learned, not settled here.

Done when the question is stated in one line, and each item is in scope or handed off.

## 2. Sort

Every item lands in one bucket. The bucket describes the finding:

- **Fix:** a certain defect, wrong under every option. Name the lowest PR or file that owns it.
- **Repair:** one record is wrong, not the mechanism. Name the record and the correction.
- **Call:** a choice whose options differ in what the product's users see, or a change the user must rule on. Weigh it as the `weighing` skill says.
- **Noted:** valid, not actionable now: context-dependent, low impact at this stage, or a preference ("I would have done it differently") with no concrete problem behind it.
- **Dismissed:** wrong, or made without the context you have, with one line why. The dismissed list stays visible: it is how the user overrides your judgment where they disagree.

Who acts: an item inside the ask, you do. An item outside it is a proposal to the user: say what it changes and wait for a yes (the `principle-never-block-on-the-human` skill). Heavy work outside this change gets a ticket, named in the PR body.

Rules for the sort:

- **Reuse before new machinery.** Before an item becomes a fix that adds a mechanism, find the existing mechanism that reaches the same outcome. A benefit means simpler code, less machinery, or something the product's users notice.
- **Trace the path.** "What if this is null?" is a finding only when a caller can pass null. Read the call site. A finding with a concrete execution path outranks a hypothetical one.
- **Agreement is signal.** A finding two independent readers raised is read first; one reader's finding is still read.
- **Your own open questions:** close the ones you can by reading code or querying production; the ones only the user can rule on are calls.
- **Pick.** Every recommendation is your own, with one sentence why.

Done when every item has one bucket and its reason, every fix and repair names where it lands, and every call carries your pick.

## 3. Show

Show the sort in this shape, every heading present with its count, in this order:

```
**Question:** <the one line from step 1>
**Handed off:** <item> → <the effort that owns it>

## 🔧 Fix (n)
- <item>: <reason>. → <the PR or file it lands in, or "proposal" when it sits outside the ask>
## 🩹 Repair (n)
- <record>: <the correction>. → <where it is made>
## ⚖️ Your call (n)
- [🚨 if never-skip] <item>: <each option and what it means for the product's users>. Pick: <yours>, because <one sentence>.
## 📝 Noted (n)
- <item>: <why it waits>.
## 🗑️ Dismissed (n)
- <item>: <why>.
```

🚨 marks an item on the never-skip list, in whichever bucket it sits. Done when the user can see every item under one heading, each with its reason and where it lands.

## The never-skip list

An item in these classes is never noted or dismissed by an agent alone, however an earlier round or PR treated something like it. It is a fix, or a call to the user:

- security, privacy, auth, billing, data retention, and permission boundaries;
- anything high-severity, such as data loss or wrong behavior shipped to the product's users;
- migrations, schema changes, idempotency, concurrency, and behavior that crosses systems;
- a small change that clearly reduces risk without changing what the product does.

When in doubt, it is a call. Skipping a noisy style comment is cheap; skipping a real data or security bug is not.
