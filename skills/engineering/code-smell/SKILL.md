---
name: code-smell
description: "Use when the user says code smell, or senses something is off before they can say why, in code, wiring, a design, or prose. Traces the hunch to the mechanism behind it before any edit."
---

# Code smell

The user senses something is off before they can say why, in code, wiring, a design, or prose. Their hunch ("feels provider-specific") is a lead to test, not a conclusion.

1. **Trace** the hunch to the mechanism that produces it.
2. **Report** that mechanism before you edit the flagged spot. Name the smell when it has a name, such as a Fowler smell from the `code-review` skill's smell baseline.

Done when the report names the mechanism, and the smell when it has a name, before any edit to the flagged spot.
