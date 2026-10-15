---
name: prototype
description: Build a throwaway prototype to settle one design decision. Use when the user wants to sanity-check whether a state model or logic feels right, explore what a UI should look like, or settle an empirical fork (which behavior, timing, or approach) by running it.
---

# Prototype

A prototype is **throwaway code that settles one decision**. The decision decides the shape. You own the decision, not the code: speed over polish, and the rigor goes into picking the right design cheaply. Propose variations the user didn't ask for, and throw an approach away to try another.

The run opens a todo list before step 1. Its first todo loads the `principle-*` skills named by the steps; a step's *Principles:* line says where each applies. Then one todo per step, each checked off when its Done when holds, or marked `skip: <reason>`.

## Steps

1. **Scope the decision.** Name the one decision the prototype exists to make: which layout, which interaction, which density, which state model, or for an empirical fork which behavior, timing, or approach. No decision means no prototype: the work is a build, and goes to the `blueprint` skill, or the `architect` skill for its shape. Done when the decision is written in one sentence, or the work has gone to `blueprint` or `architect`.
2. **Gather references when the design space is open.** Search for prior art, summarize a moodboard of themes, palettes, and layouts (for logic, the approaches others took), and let the user pick directions before building. Done when the user has picked directions, or `skip: direction set`.
3. **Pick a branch and build.** *Principles: `principle-exhaust-the-design-space`.* Pick a branch below and follow it. When the decision compares alternatives, build them behind one switcher, each labeled. Done when the branch's build is runnable in one command or one double-click.
4. **Verify on the matching surface.** *Principles: `principle-prove-it-works`.* Observe the thing you are deciding; the observation is the test here, not an assertion. For a UI, screenshot each variant through the repo's verification skill or the `playwright-cli` skill, drive the interaction yourself, and bring the screenshots to chat. For logic, run each guided walkthrough and report the state it ends in. For an empirical fork, run the script and bring its printed output or timing. Done when every variant has its evidence in chat.
5. **Present and capture.** Present the alternatives, the tradeoffs, and your recommendation, with the URL or file so the user can try it. Feedback like "the header from B with the sidebar from C" or "wait, that shouldn't be possible" names the design they want: add what it asks for and repeat step 4. When the user has picked, capture the prototype as a **primary source**: with the user's yes, commit it to a throwaway branch, out of main, and leave a context pointer to that branch on the implementation issue, with the verdict and the decision it settled. Then hand the pick to the `blueprint` skill, or `architect` for the shape, for the real build; main gets only that build. Done when the user has picked, the branch and pointer exist, and the pick is with `blueprint` or `architect`.

## Branches

- **"Does this logic / state model feel right?"** → [LOGIC.md](LOGIC.md). Build a single shareable HTML file, free-play buttons plus tabbed guided walkthroughs, that pushes the state machine through cases that are hard to reason about on paper, and that a non-developer can drive.
- **"What should this look like?"** → [UI.md](UI.md). Generate several radically different UI variations on the real route, switchable via a URL search param and a floating bottom bar.
- **"Which behavior, timing, or approach holds up?"** Write the smallest script that exercises the question, next to the code it questions, and have it print what you are deciding: the output, the ordering, the timing. For two approaches, one flag or argument switches between them. A timing question about a path already known to be slow goes to the `perf-issue` skill.

Ask the user which branch fits when the decision leaves it open. If the user isn't reachable, default to whichever branch better matches the surrounding code (a backend module → logic; a page or component → UI) and state the assumption at the top of the prototype.

## Rules for every branch

1. **Throwaway from day one, and clearly marked as such.** Locate the prototype code close to where it will actually be used (next to the module or page it's prototyping for) so context is obvious, but name it so a casual reader can see it's a prototype, not production. For throwaway UI routes, obey whatever routing convention the project already uses.
2. **Trivial to run.** A UI prototype or a script starts from one command in the project's task runner: `pnpm <name>`, `python <path>`, `bun <path>`, etc. A logic demo is a single HTML file the user double-clicks.
3. **No persistence by default.** State lives in memory. Persistence is the thing the prototype is _checking_, not something it should depend on. If the decision explicitly involves a database, hit a scratch DB or a local file with a clear "PROTOTYPE — wipe me" name.
4. **Skip the polish.** No tests, no error handling beyond what makes the prototype _runnable_, no abstractions. The point is to learn something fast.
5. **Surface the state.** After every action (logic), on every variant switch (UI), or at the end of every run (script), print or render the full relevant state so the user can see what changed.

Adapted from Matt Pocock's prototype skill (MIT) and pstack's prototype playbook (MIT, Lauren Tan).
