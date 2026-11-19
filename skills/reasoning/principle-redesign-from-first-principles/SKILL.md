---
name: principle-redesign-from-first-principles
description: "Apply when integrating a new requirement into an existing design. Redesign as if the requirement had been a foundational assumption from day one, instead of bolting it on."
---

# Redesign From First Principles

When integrating a change, don't bolt it onto the existing design. Redesign as if the requirement had been there from the start.

- Read all affected files and understand the current design
- Ask: "if we were writing this from scratch with this new requirement, what would we build?"
- Start from the platform's own primitives (what the runtime already offers: scheduling, memory, delegation, existing stores and gateways), not the old design's parts. Asking piece by piece which old parts survive anchors the redesign on the old shape.
- Split state by who must see it and how long it lasts, reusing existing stores and fields before proposing new ones.
- Once the core model settles, propose the smallest version that can run and let real use drive the next decisions; a long run of option menus with nothing running repeats the old process instead of replacing it.
- Propagate the change through every reference: types, docs, examples, rationale sections
- Think about the whole redesign, then deliver it incrementally
- A redesign wider than the ask is a proposal: sketch it, say what it changes, and wait for a yes.

This is the method for preserving option value when integrating changes into an existing design.
