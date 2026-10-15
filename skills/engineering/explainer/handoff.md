# Handoff

A handoff onboards a person to a workflow and its tools. The **owner** is whoever already runs the workflow, often the user. The reader learns how to run it; their agent sets it up on their machine. It usually splits: the pages the person reads, then the kit their agent works from, on the agent context page. Its job is a snapshot, so it may carry a dated "where this stands" line.

## Reasoning

1. **Setup gap.** Find who the reader is and how their setup differs from the owner's, assuming none of the owner's machinery. Done when everything the workflow needs is marked as brought by the kit or installed by the reader's agent.
2. **Parts.** Name who does what and where the work is written, from the owner's own runs. Done when the reader's own role is named among them.
3. **What the reader drives.** Separate what the reader runs from what runs for them out of view, one mode at a time, and count how often each thing happens in the owner's transcripts. Done when each step left on the page is one a newcomer operates, and the owner's shorthand, exact commands, and gate phrases have moved to the agent context.
4. **Agreements.** Sort each claim as universal or as an agreement made per effort, such as when work merges. Done when every agreement is stated as one the reader makes for each effort.
5. **Kit.** List what the reader's agent installs and the files that outlive the effort, such as the rulings, settling what a search, a doc, or a `--help` can before writing "ask someone". Done when each file has its path, and each remaining "ask someone" survived that check.
6. **Privacy.** List what is private to the owner: their name, private paths, and private tools. Done when each is a grep term in the effort's notes.

**The takeaway carries** what the reader will be able to run, and the onboarding prompt, in the page's words, so the reader and their agent name things the same way.

## On the page

- The onboarding prompt sits at the top, in the 🧭 callout as a `text` code block, labelled "Read this page first, then give this prompt to your agent".
- Orchestration that happens out of view gets one line saying it happens.
- A claim that holds only in some modes names which.
- The kit is a page mention of the agent context page, which holds each file the reader's agent installs; a file written back later, such as the rulings, gets its own place in it.

## Onboarding prompt and privacy check

- The onboarding prompt tells the agent to read the page until it can name the page's parts in the page's words, then read the agent context page, then explore the reader's environment and ask what their next focus is.
- The prompt also tells the reader's agent to narrate each step before and after it, define terms on first use, and ask one yes per install or config change, showing the exact command or diff.
- The privacy grep searches every file the pages are built from, the page sources, the agent context sources, and the diagrams, for each grep term from the notes. It passes when it returns nothing.

## Agent context

Setup instructions, in order: each step with its command, its check, and where it asks for consent. It starts from the reader's environment. The kit's files follow, each as a code block named by its path.
