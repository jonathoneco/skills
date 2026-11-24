---
name: status
description: "Use when the user says status. Reports where the session stands, built to scan, from state read this session."
---

# Status

Where the session stands, built to scan.

1. **One line first:** the goal, and how far along it is.
2. **An inline diagram** of the pieces, and where each stands.
3. **A short section per state,** each opened with its marker:
   - ✅ **done:** what landed, linked.
   - 🔄 **running:** helpers, CI, queues, with what each waits on.
   - ⏭️ **next:** the one step about to happen.
   - 🗓️ **planned:** what follows, in order.
   - 🙋 **needs you:** each call, with your recommendation, phrased so a word answers it.

Leave out an empty section. Done when every line comes from state read this session, such as a PR, a ticket, or a running job, not from memory.
