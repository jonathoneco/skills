---
name: how
description: How code works, traced from its entry point through its flow to a model a senior engineer can work from, with a teach mode for building understanding step by step. Use when asked how something works, before changing code you haven't traced, when asked where something should live or which layer owns it, and when the user asks to be taught how a piece of code works.
---

# How

The bar: the reader can walk the flow from trigger to result without a gap, and knows which file to open for each part. A gap you could not trace is named, never filled with a guess.

The `why` skill answers why code is shaped the way it is.

## Steps

1. **Size the question.** A narrow one (one function, one module, one utility) is traced in this session. A wide one (a subsystem across files or services, a cross-cutting feature) splits into two to four angles, each a distinct slice, such as the write path, the read path, and the background jobs. When the scope is unclear, state your reading and go on. When the size is in doubt, treat it as narrow. Done when the question is narrow, or its angles are named.
2. **Trace.** For each angle from step 1, in this session or one read-only subagent each in the `how explorer` role (the `scratch-agents` skill's table):
   1. Find the entry point: the request, command, job, or event that starts it.
   2. Follow the calls, reading each function rather than guessing from its name, and note what data passes and how it changes.
   3. Read the key types, services, and interfaces the flow runs through.
   4. Find the boundaries: what comes in, what goes out, which other system it touches.
   5. Note what would surprise a newcomer: an odd ordering, a historical leftover, a name that misleads.

   A subagent returns its components with paths, the flow step by step with `file:line`, the files it read, the boundaries, the surprises, and what it could not trace. Done when every angle has a flow from entry to output, or its gap is named.
3. **Reconcile.** Merge overlapping findings. Where two disagree, read the code and settle it. Done when the picture holds no contradiction and every remaining gap is named.
4. **Explain.** Start from the question asked and walk the flow from step 2 in the order the reader meets it, naming real symbols: "`UserService` calls `AuthClient.refresh()`", where an abstract phrasing would say "the service delegates to the client". Where something is complex, say why it is complex; a simple thing gets a short answer. Add what a newcomer needs and nothing more: the concepts the flow leans on, the files to open first, and the surprises from step 2. Draw a diagram when several components talk or data passes through stages: mermaid for a structured flow (a sequence, a flowchart, a component graph), ASCII for a simple relationship.

   For "where should this live", answer with the owner and the reason, from the boundaries in step 2. Done when the bar above holds.

## Teach mode

When the user asks to be taught, or to really understand something, the goal is their understanding, and the explanation becomes a conversation.

1. **Pick what they should leave with:** a few ideas, chosen from why they are asking (about to change it, reviewing it, debugging it, new to it) and what they already show they know. Done when you can name those ideas.
2. **Gather.** Run steps 1 to 3 above, and the `why` skill when the reasons matter, kept narrow by scoping the ask itself (one question, git plus a source or two) and widened only when the reasons are the point. Keep `why`'s confidence wording as it is: its hedges are findings. Done when each idea from step 1 rests on traced code.
3. **Start plain.** Say what the thing is in general terms, by its common name if it has one, then tie it to this code. Give the smallest complete answer, a sentence or two, and stop. Done when that first answer is sent.
4. **Go deeper on their lead.** Add one layer at a time: the problem each part solves and how it does it, walked through as the user would meet it. Show the code or the diff when that lands faster. For three or more moving parts, draw a series where each diagram redraws the last and adds one part, rather than one diagram with everything. When the idea is spatial, such as layout, overlap, scroll position, or a before and after, and an image-generation tool is at hand, generate the picture marker-on-whiteboard style with a few short labels; the series rule holds for images too. Where you would pause, stop and let the user reply, then offer to go deeper or move on. Done when the user stops asking or says they have it.

**One-shot.** When nobody is there to reply, such as a run with no live user or a written page, deliver the layers in order in one piece and put the offer to go deeper at the end.

**Voice.** Speak as to a colleague across a desk: the concrete mechanism in short sentences, one or two commas each, and one name per concept kept throughout. Each point is said directly, its weight carried by the content alone. The words in these steps direct you; the reply is the explanation itself, never a report of what you did.
