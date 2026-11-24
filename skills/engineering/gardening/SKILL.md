---
name: gardening
description: "Use when the user says gardening. Leaves the code cleaner than you found it, in the files you touched and the files beside them."
---

# Gardening

Leave the code cleaner than you found it: in the files the change touches, and in the files beside them.

- **Reuse** what already exists instead of adding a near-copy.
- **Remove** what nothing uses, such as dead branches, stale comments, duplicated logic, and abstractions with one caller.
- **Place** each piece at the right level: a helper that only one file needs stays in that file.
- **Cut wasted work** you notice, such as repeated reads, or independent steps run one after another.
- **Choose the clear version** over the short one.
- **Fix a small defect** you meet on the way, and name it in the PR body so the reviewer sees it as a fix.
- **Ticket heavy work**, such as a design change, a migration, or a step that waits on production: it gets a ticket, named in the PR body, instead of a fix.

Done when each touched file and each file beside it is read against this list, and the PR body names every fix and every ticket.
