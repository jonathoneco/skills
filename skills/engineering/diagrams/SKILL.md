---
name: diagrams
description: Choose and draw the diagrams a problem needs, each with the question it answers, its type, and its level. Use before drawing any diagram, in a reply, a doc, or a page, and when deciding which views a design or its docs need. Charts of numbers go to dataviz.
---

# Diagrams

A diagram answers **one question** at **one level**. A drawing that mixes two, such as programs and machines in one picture, or a flow laid over a structure, makes the reader work out which box is what. Every step below holds to that.

The **reader** is the person who needs the answer: the one the problem names, or the user when it names nobody.

## Steps

For one sketch inside a reply, the question is the thing you are about to explain. Write it as one line and start at step 2.

1. **List the questions.** Write the questions the reader must answer to understand the problem, one per line. Take the angles from the table's eight groups: a problem with a lifecycle has a behavior question even when nobody asked for one. List them from the outside in: the boundary, then the structure, then what runs on top of it. Keep a question only when something the reader will decide or do turns on it. When the problem does not say which angles matter, choose from the problem and say in one line what you assumed. Done when each line is one question and names its group, or says that no group fits.

2. **Pick a row for each question.** Name the diagram as the row does, tradition included: one word, such as component, means different things in different traditions. Read the row's last cell before you draw, because it says when the diagram is the wrong tool. A question that no row fits goes to [Outside the table](#outside-the-table). Done when each question has one row or one form from outside the table, and no two diagrams answer the same question.

3. **Size it.** The row says what one box is, and that holds for every box in the diagram: it is the diagram's **level**. A box at another level, such as a machine among services, belongs to another diagram. Draw only what the question turns on. Keep to 15 elements at most, counting each box, participant, and state. Past that, fold a group that belongs together into one named **black box**, a part shown only by what goes in and what comes out, or split the diagram by focus at the same level. To show the inside of a box, **zoom**: draw a new diagram whose scope is that box. Done when the diagram has one question, one level, and 15 elements or fewer.

4. **Draw it for its place.**

   | Place | Draw as |
   |---|---|
   | A reply in the terminal | Text art, about 10 boxes at most |
   | A doc in a repo, a PR, an agent doc | Mermaid |
   | A page for a reader | the `html-diagram` skill; give it the row, the level, and the elements |

   Mermaid has its own kind for four rows: `sequenceDiagram`, `stateDiagram-v2`, `classDiagram`, and `erDiagram`. Draw every other row as a `flowchart`, with a `subgraph` for each lane, boundary, or node. Where the place has the type's own notation, use it unchanged. Where it has none, as in text art, keep what the row means by a box and by an arrow. A mark the type does not have, such as a dotted arrow for a timer or a line for a wait, goes in the key.

   Draw in this order. When space runs short, cut from the bottom of the list:

   1. Each arrow runs one way and carries its label on the arrow: a verb phrase that reads in the arrow's direction, such as `writes` or `polls every 30s`.
   2. Each box says what it is. Put the type in the box when the types differ, as in `Redis [store]`. A C4 container or component also names its technology.
   3. Each thing has one name across every diagram in the answer.
   4. A title line names the type and the scope, as in `Sequence: one login and one token refresh`.
   5. A **key** explains each mark whose meaning the labels do not state, such as a line style, a colour, or a shape.

   Code-level structure, such as the classes or the tables as built, is generated from the code and not drawn by hand.

   Done when rules 1 to 3 hold, and rules 4 and 5 hold or the place had no room for them.

5. **Check it against the source.** Each box and each arrow is something you read in the code or the docs, or something the user told you. Mark a guess as assumed on the diagram, or leave it out. Done when every element traces to a source or carries that mark.

## Which diagram

| The reader asks | Diagram | One box is | Wrong tool when |
|---|---|---|---|
| **Boundary**: what is in, what is out | | | |
| What is outside the system, and who or what talks to it? | [C4 system context diagram](types.md#c4-system-context-diagram) | a system or a person | the reader already knows the neighbours |
| Over which channels and protocols does it reach them? | [arc42 technical context](types.md#arc42-technical-context) | a neighbour and its channel | it is a web or information system: the deployment diagram covers it |
| **Structure**: the parts and how they connect | | | |
| What are the big running parts, and how do they talk? | [C4 container diagram](types.md#c4-container-diagram) | an application or a data store | the question is where they run: deployment diagram |
| Inside one running part, which code groupings exist? | [C4 component diagram](types.md#c4-component-diagram) | a component: a code grouping, not a deployable unit | the question is not inside that one part |
| Which business concepts exist, and how do they relate? | [UML class diagram, as a domain model](types.md#uml-class-diagram-domain-model) | a business concept | the detail is code-level: generate it |
| **Interaction**: how the parts work together in one run | | | |
| Which part sends what to which, in order, in one run? | [UML sequence diagram](types.md#uml-sequence-diagram) | a participant | the logic is straightforward: show the code |
| How do the boxes I already drew work together for one feature? | [C4 dynamic diagram](types.md#c4-dynamic-diagram-runtime-scenario) | a box from the earlier diagram | the order of messages is the point: sequence diagram |
| **Behavior**: how one thing changes, or one flow runs | | | |
| What states can one thing be in, and what moves it? | [UML state machine diagram](types.md#uml-state-machine-diagram) | a state | its behavior does not differ by state |
| What does one flow do, step by step, with choices and parallel steps? | [UML activity diagram](types.md#uml-activity-diagram) | an action | it explains one complex operation: refactor that first. People hand work to each other: flowchart |
| **Deployment**: where it runs | | | |
| Where does each piece run, in each environment? | [Deployment diagram (C4, UML)](types.md#deployment-diagram-c4-uml) | a node: a machine or a runtime that software runs on | it all runs in one place |
| **Data**: what is stored, and how it moves | | | |
| Which entities are stored, and how do they relate? | [Entity-relationship diagram](types.md#entity-relationship-diagram) | an entity | the question is business meaning, not storage: domain model |
| Where does data come from, change, rest, and go? | [Data flow diagram](types.md#data-flow-diagram) | a process, a store, or an external entity | order and decisions are the question: flowchart |
| **Process**: how work crosses people | | | |
| In what order do the steps and decisions of a business process run, and who does each? | [Flowchart](types.md#flowchart-swimlane), with a swimlane per role when several roles act | a step | it is logic inside code: show the code |
| How does a process run across departments, in a notation that business and IT both read? | [BPMN](types.md#bpmn) | an activity, an event, or a gateway | the place has no BPMN shapes, as in the terminal and in Mermaid: swimlane flowchart, or a page when the reader works in BPMN |
| **Requirements**: who wants what | | | |
| Who uses the system, and what do they want from it? | [UML use case diagram](types.md#uml-use-case-diagram) | an actor or a use case | nearly always: write the use cases as text. Draw it only for a stakeholder presentation |
| How does a user move between screens? | [UI flow diagram](types.md#ui-flow-diagram) | a major UI element, such as a screen | the question is one screen's layout: a prototype |

## Outside the table

- How do the options compare? A table, with the same rows for each option.
- A question about many items taken one by one, such as each field or each endpoint: a table.
- Which qualities matter, and how will we know each is met? A table of quality scenarios.
- What happened when, on one clock? A timeline: one axis, with the events in order.
- What contains or owns what? A tree, or boxes nested inside their owner.
- How much, how often, or how fast? A few numbers go in a table or on the arrows. A series is a chart, drawn as the `dataviz` skill says.
- When tasks run, who reports to whom, how sets overlap, how a site is laid out: a Gantt chart, an org chart, a Venn diagram, a sitemap.

## Reference

- [types.md](types.md) has one entry per row: what each source says, and the pick where sources disagree. Open a row's entry when its last cell needs its reason, or when two rows seem to fit.
- [basis.md](basis.md) has the source of each rule in the steps. Open it before you change this skill, or when the user asks why a rule holds.
