# Basis

Where each rule in SKILL.md comes from. A rule with a link rests on that page. A rule marked as this skill's own has no source; the entry says what it joins. Per-type facts are in [types.md](types.md).

## Words

- **Boundary**: the line between your system and what it talks to. Every set of diagrams starts there. ([arc42](https://docs.arc42.org/section-3/), [C4](https://c4model.com/introduction))
- **Zoom**: take one element and draw its parts in a new diagram. The element becomes the new diagram's scope. ([C4](https://c4model.com/introduction), [arc42](https://docs.arc42.org/section-5/))
- **Black box**: a part described by what goes in and out, with its insides hidden. Opening it shows a **white box** of smaller black boxes. ([arc42 FAQ](https://faq.arc42.org/questions/B-8/), [arc42 FAQ](https://faq.arc42.org/questions/B-9/))
- **Runtime scenario**: one concrete run of the system through its parts. A **quality scenario** is a different thing: it makes a quality requirement concrete, so you can decide whether it is met. Write "runtime scenario" or "quality scenario", not "scenario" alone. ([arc42](https://docs.arc42.org/section-6/), [arc42](https://docs.arc42.org/section-10/))
- **Key**: C4 asks for a key or legend on every diagram, to explain the notation in use, and extends that to UML, ArchiMate, and SysML. This skill narrows the key to the marks whose meaning the labels do not state, and ranks it last when space is short. The narrowing and the rank are this skill's own. ([C4](https://c4model.com/diagrams/notation))

## Step 1, the questions

- Start at the boundary: C4 offers the context diagram as a starting point, and arc42 starts the hierarchy from the context view. The rule to start there is this skill's own. ([C4](https://c4model.com/introduction), [arc42 FAQ](https://faq.arc42.org/questions/B-10/))
- Which angles matter: arc42 says to ask your specific stakeholders, because its own list of what each stakeholder needs is a rough approximation. This skill has the agent choose from the problem and state what it assumed, so that a sketch does not wait on a question. That choice is this skill's own. ([arc42 FAQ](https://faq.arc42.org/questions/B-15/))
- One diagram answers one question: joins C4's "specific focus" and "same level of abstraction", C4's mixed-levels defect, and Kruchten's complaint that one drawing mixes programs, source, computers, and groupings. ([C4 FAQ](https://c4model.com/faq), [C4](https://c4model.com/introduction), [Kruchten](https://www.cs.ubc.ca/~gregor/teaching/papers/4+1view-architecture.pdf))
- The order boundary, structure, then behavior, interaction, deployment: arc42's section order, and its deployment section, which says the top deployment diagram may already sit in the technical context with your infrastructure as one black box, and zooms into that box. No source states it as a drawing order, and C4 says its levels imply no process. Kruchten starts from scenarios instead. ([arc42](https://docs.arc42.org/section-7/), [C4 FAQ](https://c4model.com/faq), [Kruchten](https://www.cs.ubc.ca/~gregor/teaching/papers/4+1view-architecture.pdf))
- Keeping a question only when a decision turns on it, and the short path for one sketch in a reply, are this skill's own.

## Step 2, the table

- No source gives the table. Its questions, its eight groups, and the "One box is" column each join a type's purpose in types.md with the elements its source names.
- A "Wrong tool when" cell restates the skip rule in the row's types.md entry. Five cells are this skill's own reading, with no page that states them: the context diagram when the reader knows the neighbours; the component diagram when the question is not inside that one part; the deployment diagram when everything runs in one place; the entity-relationship diagram against the domain model; and BPMN where the place has no BPMN shapes.
- A comparison and a question about many items go to a table by this skill's own rule. The quality table is in types.md.
- The timeline and the tree in "Outside the table" are this skill's own lines. No source read for this skill gives a rule for either.

## Step 3, the size

- Size: 5 to 15 elements (arc42) and 7 plus or minus 2 bubbles (Ambler, for use cases or classes on the package page) are two rules of thumb, a range and a narrower one. The skill states the top of the range as a limit. ([arc42 FAQ](https://faq.arc42.org/questions/D-7/), [Agile Modeling](https://agilemodeling.com/artifacts/packageDiagram.htm))
- Group cohesive elements into a named black box under explicit criteria; split into diagrams with a specific focus at the same level; mixed levels are a defect; show only what you have to. ([arc42 FAQ](https://faq.arc42.org/questions/D-7/), [C4 FAQ](https://c4model.com/faq), [C4](https://c4model.com/introduction), [Agile Modeling](https://agilemodeling.com/style/general.htm))

## Step 4, the drawing

- Notation: C4 is notation independent and prescribes no notation, and arc42 works independent of notation. So for a C4 or an arc42 row the type fixes what a box and an arrow mean, not their shape. ([C4](https://c4model.com/diagrams/notation), [arc42 FAQ](https://faq.arc42.org/questions/B-2/))
- Ambler says to prefer well-known notation. Fowler and Ambler also accept loose sketches that favour communication over the rules. This skill uses the type's own notation where the place has it, and keeps only the type's meaning for a box and an arrow where it has none. ([Agile Modeling](https://agilemodeling.com/style/general.htm), [Fowler](https://martinfowler.com/bliki/UmlAsSketch.html), [Agile Modeling](https://agilemodeling.com/artifacts/activityDiagram.htm))
- C4's notation rules call for a title, a legend, element types, labelled one-way relationships, and stand-alone reading; C4 extends the legend rule to UML, ArchiMate, and SysML. ([C4](https://c4model.com/diagrams/notation))
- C4 asks for an explicit technology on every container and component. ([C4](https://c4model.com/diagrams/notation))
- Consistent names across a set: C4 lists inconsistent naming as a defect. ([C4](https://c4model.com/introduction))
- Fowler describes UML as sketch as informal and selective, with an emphasis on communication rather than complete specification. This skill uses the word sketch for a diagram inside a reply. ([Fowler](https://martinfowler.com/bliki/UmlAsSketch.html))
- The order of the five drawing rules, with labels on the arrows first, is this skill's own. It comes from a test in which type tags and a key pushed every arrow label off a text-art sequence diagram.
- Code-level structure: C4 says to omit hand-made code diagrams or generate them on demand, because they may go stale quickly under active development. ([C4 FAQ](https://c4model.com/diagrams/faq))
- Text for repo docs: arc42 recommends lightweight tools, paper or text-based, for scenarios, and Fowler says diagram layout is tedious to fiddle with in diagrammatic form. Choosing text-based Mermaid for repo docs is this skill's pick. ([arc42 tip 6-5](https://docs.arc42.org/tips/6-5/), [Fowler](https://martinfowler.com/bliki/UmlSketchingTools.html))
- The place table, the limit of about 10 boxes in text art, the Mermaid kind for each row, and the rule that an extra mark goes in the key are this skill's conventions and tool facts, not source claims.

## Step 5, the check

- Tracing each box and arrow to a source is this skill's own rule. No diagramming source read for this skill states it.
