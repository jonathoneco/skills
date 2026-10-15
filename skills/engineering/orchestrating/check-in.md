# The user's check-in

The user checks in: read what has fallen due, then give them one digest.

## 1. Run the readings that fell due

For each post-merge reading in the user queue whose date has passed, start an `orchestrating post-merge reading` scratch agent (the `scratch-agents` skill). It runs the reading exactly as the ticket's After merge section gives it, closes the tickets whose readings hold with a receipt (the tracker's skill, `linear` on Linear), and returns every other reading with the value it saw.

Done when every fallen-due reading is closed, or listed for the digest's Waiting on you with the value it read.

## 2. Build the digest and apply the answers

Build the digest and apply the user's answers as the `decision-log` skill says for a digest. Each item that waits on the user opens with what is stopped and what their answer frees. When a cross-project session exists, hand it the digest instead; it merges every orchestrator's digest into the one the user reads.

Done when the `decision-log` skill's digest is built and applied, or the cross-project session holds the digest.
