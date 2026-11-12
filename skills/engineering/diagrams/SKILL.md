---
name: diagrams
description: Choose which diagrams a problem needs and the type of each. Use when about to draw, show, or explain a system, workflow, data flow, or business process as a diagram, and when deciding which views a design or its docs need. Charts of numbers go to dataviz.
---

# Diagrams

A diagram answers one question for one reader. Pick the question, then the type, then the level, then where to draw it. The reader is whoever needs the answer: a teammate, or the person who receives a page. When the problem names no reader, the reader is the user.

## Steps

1. **Decompose.** List the questions the reader must answer to understand the problem. Put each under a concern: **boundary** (what is in, what is out), **structure** (the parts and how they connect), **interaction** (how the parts work together in one run), **behavior** (how one thing changes or one flow runs), **data**, **deployment** (where it runs), **process** (how work crosses people), **requirements** (who wants what). Start at the boundary, then structure; draw behavior, interaction, and deployment on top of the parts. Skip a concern the reader already holds. Ask the reader which concerns matter to them: a table of typical needs per reader is only a rough guide. With more than one reader, list each reader's questions; one diagram serves every reader who asks its question. Drop a question the reader does not need answered. Done when each question is one question, on one line.
2. **Pick.** Find each question in the table. Name the diagram as the row does, tradition included. The reader an entry names is what its source says, not a limit: match the question first, and when the reader cannot read the type, add a sentence or a table beside it. Done when every question has one row and no two diagrams answer the same question. A question with no row, or one about many items taken one by one such as each field, is two questions or not a diagram question: split it, or answer it in text or a table.
3. **Size.** Each row says what one box is. Keep one level in one diagram; a diagram that mixes levels is a defect. Show only what the reader's decision turns on. Hold a diagram to 15 elements at most; every box, participant, or state counts, in each diagram; the legend does not. When it grows past that, group cohesive elements into a named black box, or split it into diagrams that each have a specific focus at the same level. To go deeper, **zoom**: take one element and draw its parts as a new diagram. Done when the diagram has one question, one level, and a count within the limit.
4. **Draw.** Use the type's standard notation and invent no shapes. Give it a title with the type and the scope, a **legend**, the type of every element, and arrows that each run one way and carry a label that matches the direction. Keep element names the same across a set. Done when a stranger could read it with no narrative.
5. **Render.** Pick by where the diagram lives. In ASCII, write each element's type as a text tag and put a short key under the diagram. Done when the target holds the type's standard shapes and the box count; if it does not, split the diagram, or take the next place down the render table (`html-diagram` last) and link its file from the doc.

   | Place | Render as |
   |---|---|
   | A reply in the terminal | ASCII, up to about 10 boxes |
   | A doc in a repo, a PR, an agent doc | Mermaid |
   | A page for a reader | the `html-diagram` skill |

6. **Keep or discard.** A diagram drawn to think is erased once its lessons reach the code or the docs. A diagram that must last comes from source or text: generate it, or write it as text that merges like code.

## Which diagram

No source gives this table. Each row joins the type's own purpose (in [types.md](types.md), with its sources) with a level that is inference. A row's type is a pick among sources; where they disagree, the entry states the pick and cites both sides.

| The reader asks | Diagram | One box is a |
|---|---|---|
| **Boundary** | | |
| What is outside my system, and who talks to it? | [C4 system context diagram](types.md#c4-system-context-diagram) | system |
| Over which channels and protocols does it reach its neighbours? | [arc42 technical context](types.md#arc42-technical-context) | neighbour system, with its channel |
| **Structure** | | |
| What are the big running parts, and how do they talk? | [C4 container diagram](types.md#c4-container-diagram) | application or data store |
| Inside one running part, which code groupings exist? | [C4 component diagram](types.md#c4-component-diagram) | component |
| Which business concepts exist, and how do they relate? | [UML class diagram (domain model)](types.md#uml-class-diagram-domain-model) | business concept |
| **Interaction** | | |
| Which part sends what to which, in order, in one run? | [UML sequence diagram](types.md#uml-sequence-diagram) | participant |
| How do the parts I already drew work together for one feature? | [C4 dynamic diagram](types.md#c4-dynamic-diagram-runtime-scenario) | system, container, or component |
| **Behavior** | | |
| What states can one thing be in, and what moves it? | [UML state machine diagram](types.md#uml-state-machine-diagram) | state |
| What does one flow do, step by step, with choices and parallel steps? | [UML activity diagram](types.md#uml-activity-diagram) | action |
| **Deployment** | | |
| Where does each piece run, in each environment? | [Deployment diagram](types.md#deployment-diagram-c4-uml) | node |
| **Data** | | |
| Which entities are stored, and how do they relate? | [Entity-relationship diagram](types.md#entity-relationship-diagram) | entity |
| Where does data come from, change, rest, and go? | [Data flow diagram](types.md#data-flow-diagram) | process, store, or external entity |
| **Process** | | |
| In what order do the steps and decisions of one team's business process run? | [Flowchart](types.md#flowchart-swimlane) | step |
| How does a business process run across departments, so that business and IT read it the same way? | [BPMN](types.md#bpmn) | activity, event, or gateway |
| **Requirements** | | |
| Who uses the system, and what do they want from it? | [UML use case diagram](types.md#uml-use-case-diagram) | actor or use case |
| How does a user move between screens? | [UI flow diagram](types.md#ui-flow-diagram) | screen |
| Which qualities matter, and how will we know each is met? | [arc42 quality tree and scenarios](types.md#arc42-quality-tree-and-quality-scenarios) | quality or scenario |
| When, who, how many, which pages (a business chart) | [Other business charts](types.md#other-business-charts) | one item of the chart |

## Words

- **Boundary**: the line between your system and what it talks to. Every set of diagrams starts there. ([arc42](https://docs.arc42.org/section-3/), [C4](https://c4model.com/introduction))
- **Zoom**: take one element and draw its parts in a new diagram. The element becomes the new diagram's scope. ([C4](https://c4model.com/introduction), [arc42](https://docs.arc42.org/section-5/))
- **Black box**: a part described by what goes in and out, with its insides hidden. Opening it shows a **white box** of smaller black boxes. ([arc42 FAQ](https://faq.arc42.org/questions/B-8/), [arc42 FAQ](https://faq.arc42.org/questions/B-9/))
- **Runtime scenario**: one concrete run of the system through its parts. A **quality scenario** is a different thing: it makes a quality requirement concrete, so you can decide whether it is met. Never use "scenario" bare. ([arc42](https://docs.arc42.org/section-6/), [arc42](https://docs.arc42.org/section-10/))
- **Legend**: a key that explains every shape, colour, and line used. C4 asks for it in any notation, UML included. ([C4](https://c4model.com/diagrams/notation))

## Basis

Facts in the steps, with their sources:

- Start at the boundary: C4 offers the context diagram as a starting point, and arc42 starts the hierarchy from the context view. The rule to start there is this skill's own. ([C4](https://c4model.com/introduction), [arc42 FAQ](https://faq.arc42.org/questions/B-10/))
- Ask the reader: arc42 says to ask your specific stakeholders, because its own table is a rough approximation. A reader who will not read static structure gets the runtime view. ([arc42 FAQ](https://faq.arc42.org/questions/B-15/), [arc42](https://docs.arc42.org/section-6/))
- Size: 5 to 15 elements (arc42) and 7 plus or minus 2 bubbles (Ambler, for use cases or classes on the package page) are two rules of thumb, a range and a narrower one. The skill states the top of the range as a limit. ([arc42 FAQ](https://faq.arc42.org/questions/D-7/), [Agile Modeling](https://agilemodeling.com/artifacts/packageDiagram.htm))
- Group cohesive elements into a named black box under explicit criteria; split into diagrams with a specific focus at the same level; mixed levels are a defect; show only what you have to. ([arc42 FAQ](https://faq.arc42.org/questions/D-7/), [C4 FAQ](https://c4model.com/faq), [C4](https://c4model.com/introduction), [Agile Modeling](https://agilemodeling.com/style/general.htm))
- Standard notation: Ambler says to prefer well-known notation. Fowler and Ambler also accept loose sketches that favour communication over the rules, and C4 and arc42 are notation-independent. This skill picks standard notation, so that any reader or tool can read it, and still asks for a legend. ([Agile Modeling](https://agilemodeling.com/style/general.htm), [Fowler](https://martinfowler.com/bliki/UmlAsSketch.html), [Agile Modeling](https://agilemodeling.com/artifacts/activityDiagram.htm), [C4](https://c4model.com/diagrams/notation))
- C4's notation rules call for a title, a legend, element types, labelled one-way relationships, and stand-alone reading; C4 extends the legend rule to UML, ArchiMate, and SysML. ([C4](https://c4model.com/diagrams/notation))
- Consistent names across a set: C4 lists inconsistent naming as a defect. ([C4](https://c4model.com/introduction))
- Keep or discard: Ambler typically erases an exploratory object diagram once its lessons are in code or models, and says keeping one is rare; C4 says to omit hand-made code diagrams or generate them on demand, because they may go stale quickly under active development; arc42 notes that text merges and versions like code. Step 6 extends the C4 code-level rule to every long-lived diagram; that extension is inference. ([Agile Modeling](https://agilemodeling.com/artifacts/objectDiagram.htm), [C4 FAQ](https://c4model.com/diagrams/faq), [arc42 tip 6-5](https://docs.arc42.org/tips/6-5/))
- Text for repo docs: arc42 recommends lightweight tools, paper or text-based, for scenarios, and Fowler says diagram layout is tedious to fiddle with in diagrammatic form. Choosing text-based Mermaid for repo docs is this skill's pick. ([arc42 tip 6-5](https://docs.arc42.org/tips/6-5/), [Fowler](https://martinfowler.com/bliki/UmlSketchingTools.html))

Inference, with the pieces each joins:

- One diagram answers one question: joins C4's "specific focus" and "same level of abstraction", C4's mixed-levels defect, and Kruchten's complaint that one drawing mixes programs, source, computers, and groupings. ([C4 FAQ](https://c4model.com/faq), [C4](https://c4model.com/introduction), [Kruchten](https://www.cs.ubc.ca/~gregor/teaching/papers/4+1view-architecture.pdf))
- The order boundary, structure, then behavior, interaction, deployment: arc42's section order, and its deployment section, which says the top deployment diagram may already sit in the technical context with your infrastructure as one black box, and zooms into that box. No source states it as a drawing order, and C4 says its levels imply no process. Kruchten starts from scenarios instead. ([arc42](https://docs.arc42.org/section-7/), [C4 FAQ](https://c4model.com/faq), [Kruchten](https://www.cs.ubc.ca/~gregor/teaching/papers/4+1view-architecture.pdf))
- The table's questions, its groups by concern, and the "one box is a" column: each joins the type's purpose in types.md with the elements its source names.
- The render table: the place decides, ASCII up to about 10 boxes, Mermaid in repo docs. These are conventions of this skill, not source claims.
- A question with no row, or about many items one by one, is answered in text or a table; an entry's reader is a hint; with several readers one diagram serves each reader who asks its question; a skipped target is linked from the doc; a concern the reader already holds is skipped: these are this skill's rules, not a source's.
