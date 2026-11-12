# Diagram types

One entry per type in SKILL.md's table, in table order. Each fact links its source page; a line marked *inference* joins the facts named in it. "Reader" is the audience a source names, not a role this skill assigns.

## Boundary

### C4 system context diagram
- Shows your system as one box in the centre, surrounded by its users and the systems it talks to. The focus is on people and software systems, not on technologies, protocols, and other low-level details. ([C4](https://c4model.com/diagrams/system-context))
- Reader: everybody, technical or not, inside or outside the team. C4 recommends it for all teams. ([C4](https://c4model.com/diagrams/system-context))
- arc42 calls the same question "context and scope"; the C4 FAQ maps one to the other. ([C4 FAQ](https://c4model.com/faq))
- Keep the system a single box. arc42's FAQ says to keep the context apart from building block level 1, which C4 calls the container diagram, because merging them dilutes both. It allows an exception for heterogeneous systems. ([arc42 FAQ](https://faq.arc42.org/questions/C-3-3/), [C4 FAQ](https://c4model.com/faq))
- Avoid overly detailed interface descriptions in it. ([arc42 tip 3-5](https://docs.arc42.org/tips/3-5/))
- A system landscape diagram is the same diagram with no one system in focus; use it for a whole organisation. ([C4](https://c4model.com/diagrams/system-landscape))

### arc42 technical context
- Shows the channels, protocols, and hardware that link your system to its neighbours. ([arc42](https://docs.arc42.org/section-3/))
- Reader: infrastructure and hardware designers, who decide these interfaces. ([arc42](https://docs.arc42.org/section-3/))
- arc42 suggests a UML deployment diagram of the channels, plus a mapping table from each input or output to its channel. ([arc42](https://docs.arc42.org/section-3/))
- Embedded systems almost always need it. Information and web systems rarely do; their deployment view is usually enough. ([arc42 tip 3-15](https://docs.arc42.org/tips/3-15/))
- In arc42's web-system example, protocols such as HTTPS and SSH appear in the technical context and are deliberately left out of the domain context. ([arc42 tip 3-10](https://docs.arc42.org/tips/3-10/))

## Structure

### C4 container diagram
- A container is an application or a data store. ([C4](https://c4model.com/diagrams/container))
- Shows the high-level shape of the software, how responsibilities are spread across it, the major technology choices, and how the containers communicate. ([C4](https://c4model.com/diagrams/container))
- Reader: technical people inside and outside the team. C4 recommends it for all teams. ([C4](https://c4model.com/diagrams/container))
- It says little about clustering, load balancers, replication, or failover. Draw deployment diagrams for those, one per environment. ([C4](https://c4model.com/diagrams/container))
- arc42 building block level 1 is the same level. ([C4 FAQ](https://c4model.com/faq))

### C4 component diagram
- Zooms into one container and shows the components inside it, their responsibilities, and their technology. ([C4](https://c4model.com/diagrams/component))
- Reader: software architects and developers. ([C4](https://c4model.com/diagrams/component))
- A C4 component is a grouping of related functionality behind a well-defined interface. It is not separately deployable; the container is the deployable unit. ([C4](https://c4model.com/abstractions/component))
- Optional: draw it only when it adds value, and consider generating it. When drawn by hand in software under active development, it may change frequently. ([C4](https://c4model.com/diagrams/component), [C4 FAQ](https://c4model.com/diagrams/faq))
- A UML component is a modular, replaceable part that may be manifested by artifacts, which may be deployed to an execution environment, so it is a different thing. C4 itself calls "component" hugely overloaded. The table holds the C4 one. ([UML 2.5.1](https://www.omg.org/spec/UML/2.5.1/PDF), [C4](https://c4model.com/abstractions/component))

### UML class diagram (domain model)
- Shows classes, their relations (inheritance, aggregation, association), and their attributes and operations. ([Agile Modeling](https://agilemodeling.com/artifacts/classDiagram.htm))
- One notation serves two jobs: conceptual or domain modelling, and detailed design. ([Agile Modeling](https://agilemodeling.com/artifacts/classDiagram.htm))
- For the domain model, the page sets visibility aside and says that giving a class both an attribute box and a method box arguably makes design decisions. ([Agile Modeling](https://agilemodeling.com/artifacts/classDiagram.htm))
- arc42 suggests you can include a graphical overview of the business or domain model in its concepts section, with the textual definitions in the glossary. ([arc42 tip 8-6](https://docs.arc42.org/tips/8-6/))
- Code-level class detail: C4 says no for long-lived documentation, because IDEs generate it on demand, and only for the most important or complex components at all. Ambler treats detailed design class diagrams as a normal use. This skill's pick: generate it from the code and do not hand-draw it. ([C4](https://c4model.com/diagrams/code), [Agile Modeling](https://agilemodeling.com/artifacts/classDiagram.htm))

## Interaction

### UML sequence diagram
- Answers who sends what to whom, in what order, for one scenario. Ambler calls it the most popular UML artifact for dynamic modelling. ([Agile Modeling](https://agilemodeling.com/artifacts/sequenceDiagram.htm))
- A system-level sequence diagram helps stakeholders see and check the logic of a usage scenario. ([Agile Modeling](https://agilemodeling.com/artifacts/sequenceDiagram.htm))
- arc42 uses it for runtime scenarios because it shows each building block's responsibility. Focus on the risky, difficult, or interesting parts. With graphical modeling tools, making and managing them may take a lot of effort. ([arc42 tip 6-11](https://docs.arc42.org/tips/6-11/), [arc42 tip 6-6](https://docs.arc42.org/tips/6-6/))
- Draw one only for logic complex enough to think through; for straightforward logic, go straight to code. Fowler, arguing against model-driven architecture, doubts that sequence or activity diagrams match code for expressing behavioral logic, while he endorses sketches that convey design ideas. This skill's pick: draw when the logic needs thinking through, otherwise write the code. ([Agile Modeling](https://agilemodeling.com/artifacts/sequenceDiagram.htm), [Fowler](https://martinfowler.com/bliki/ModelDrivenArchitecture.html))

### C4 dynamic diagram (runtime scenario)
- Shows how elements of the static diagrams work together at runtime for a user story, use case, or feature. The boxes may be systems, containers, or components. ([C4](https://c4model.com/diagrams/dynamic))
- Reader: technical and non-technical people. C4 says use it sparingly, for interesting or recurring patterns that need a complicated set of interactions. ([C4](https://c4model.com/diagrams/dynamic))
- arc42 section 6 holds the same idea: pick scenarios by architectural relevance, a few only, and keep them schematic. ([arc42](https://docs.arc42.org/section-6/), [arc42 tip 6-3](https://docs.arc42.org/tips/6-3/))
- arc42 aims scenarios at stakeholders who will not read the static models. ([arc42](https://docs.arc42.org/section-6/))
- C4 says its collaboration and sequence styles show the same information. Ambler says that, in his experience, needing sequence numbers on a communication diagram is a good indication to use a sequence diagram instead. This skill's pick: a UML sequence diagram when message order matters; a C4 dynamic diagram when the boxes must be those of the static diagram. ([C4](https://c4model.com/diagrams/dynamic), [Agile Modeling](https://agilemodeling.com/artifacts/communicationDiagram.htm))

## Behavior

### UML state machine diagram
- Shows the states one object can be in and the transitions between them. ([Agile Modeling](https://agilemodeling.com/artifacts/stateMachineDiagram.htm))
- Create one when behavior differs by state. ([Agile Modeling](https://agilemodeling.com/style/statechartdiagram.htm))
- Reader: developers exploring the complex behavior of a class, actor, subsystem, or component. ([Agile Modeling](https://agilemodeling.com/style/statechartdiagram.htm))
- For a very complex entity, build a hierarchy of state machines. ([Agile Modeling](https://agilemodeling.com/style/statechartdiagram.htm))
- C4's FAQ says to supplement C4 diagrams with UML state diagrams, timing diagrams, and others when you need to. ([C4 FAQ](https://c4model.com/faq))

### UML activity diagram
- Typical uses: business process modelling, the logic of one use case or usage scenario, and the detailed logic of a business rule. ([Agile Modeling](https://agilemodeling.com/artifacts/activityDiagram.htm))
- Partitions (swimlanes) show who or what does each activity. Swimlanes suit linear processes; keep them under five. ([Agile Modeling](https://agilemodeling.com/artifacts/activityDiagram.htm), [Agile Modeling style](https://agilemodeling.com/style/activitydiagram.htm))
- For a complex operation Ambler says to rewrite the operation until it needs no diagram; his style page lists the same operation as a use and says to consider refactoring. This skill's pick: when the code needs a diagram to be understood, refactor first. ([Agile Modeling](https://agilemodeling.com/artifacts/activityDiagram.htm), [Agile Modeling style](https://agilemodeling.com/style/activitydiagram.htm))
- For a business process across people or departments, Ambler says that an activity diagram for a business process "often proves less than ideal"; see BPMN and the swimlane flowchart. ([Agile Modeling](https://agilemodeling.com/essays/realisticUML.htm))

## Deployment

### Deployment diagram (C4, UML)
- C4: shows how instances of software systems and containers are deployed onto infrastructure within one deployment environment; it is based on the UML deployment diagram. ([C4](https://c4model.com/diagrams/deployment))
- Reader: technical people, including infrastructure architects and operations staff. ([C4](https://c4model.com/diagrams/deployment))
- arc42: document each relevant environment, and especially document it when the system runs on more than one computer or container. ([arc42](https://docs.arc42.org/section-7/))
- With many machines, a less-detailed network diagram is often better, because deployment diagrams grow very large very quickly. ([Agile Modeling](https://agilemodeling.com/artifacts/deploymentDiagram.htm))

## Data

### Entity-relationship diagram
- Shows entities, their relationships, and attributes, as a blueprint for a database. Source: a vendor page. ([Miro](https://miro.com/diagramming/types-of-diagrams/))
- If you do not document a full domain-driven design model with static and dynamic aspects, arc42 recommends at least a business or domain data model, which gives an overview of the basic data structures and their relationships. ([arc42 tip 8-7](https://docs.arc42.org/tips/8-7/))
- Physical level: tables, columns, keys, and the relations between tables. ([Agile Modeling](https://agilemodeling.com/artifacts/physicalDataModel.htm))
- To explore domain concepts with stakeholders, Ambler uses an ORM diagram, then records the result in a class diagram or code and erases the sketch. ([Agile Modeling](https://agilemodeling.com/artifacts/ormDiagram.htm))

### Data flow diagram
- Shows data flowing from external entities into the system, from one process to the next, and into storage. ([Agile Modeling](https://agilemodeling.com/artifacts/dataFlowDiagram.htm))
- Each process can get its own, more detailed diagram. ([Agile Modeling](https://agilemodeling.com/artifacts/dataFlowDiagram.htm))
- A data flow diagram follows how data moves; a process flow diagram follows the sequence of steps in a workflow. Miro lists data flow diagrams both apart from flowcharts and as a kind of flowchart; this skill keeps them apart. ([Miro](https://miro.com/diagramming/data-flow-diagram/), [Miro](https://miro.com/flowchart/), [Miro](https://miro.com/diagramming/types-of-diagrams/))
- Ambler warns that many traditional methods use these diagrams in dysfunctional ways. ([Agile Modeling](https://agilemodeling.com/artifacts/dataFlowDiagram.htm))

## Process

### Flowchart (swimlane)
- Describes the detailed logic of a business process or business rule: activities, decisions, and the flow of control. ([Agile Modeling](https://agilemodeling.com/artifacts/flowChart.htm))
- A swimlane flowchart adds who or what performs each action. Not every process needs it. ([Miro](https://miro.com/diagramming/what-is-a-swimlane-diagram/))
- Flowcharts have dropped out of favor for software module logic, because object methods are small. ([Agile Modeling](https://agilemodeling.com/artifacts/flowChart.htm))
- Inference joining this entry and BPMN: use a flowchart for one team's process, and BPMN when the process crosses departments and business and IT must read it the same way.

### BPMN
- BPMN's stated goal: a notation that all business users can read, from the analysts who draft processes to the people who implement them. ([OMG BPMN 2.0.2](https://www.omg.org/spec/BPMN/2.0.2/PDF))
- It follows the tradition of flowcharting notations. ([OMG BPMN 2.0.2](https://www.omg.org/spec/BPMN/2.0.2/PDF))
- A process is one organisation's flow of activities. A collaboration shows the interaction between two or more business entities, as pools. A choreography shows the exchange of messages between participants, with no central controller. ([OMG BPMN 2.0.2](https://www.omg.org/spec/BPMN/2.0.2/PDF))
- Miro says UML diagrams model software, while BPMN diagrams outline business processes. Source: a vendor page. ([Miro](https://miro.com/diagramming/what-is-bpmn/))

## Requirements

### UML use case diagram
- Gives an overview of the usage requirements for a system. It suits presentations to management and stakeholders; for development, the use cases give much more value. ([Agile Modeling](https://agilemodeling.com/artifacts/useCaseDiagram.htm))
- Fowler: the diagram is very close to useless, and the value lies in the text that describes each use case. This skill's pick: draw the diagram only for a stakeholder presentation, and write the use-case text for the people who build. ([Fowler](https://martinfowler.com/bliki/IncludeAndExtend.html))
- Ambler avoids arrowheads on the associations, because readers mistake them for data flow. ([Agile Modeling](https://agilemodeling.com/artifacts/useCaseDiagram.htm))

### UI flow diagram
- Models the high-level relationships between major user interface elements and lets you ask basic usability questions. Boxes are those elements; arrows are the possible moves between them. ([Agile Modeling](https://agilemodeling.com/artifacts/uiFlowDiagram.htm))
- Many boxes and many connections may signal a system too large for people to learn and understand. ([Agile Modeling](https://agilemodeling.com/artifacts/uiFlowDiagram.htm))
- UML has no diagram for it. A UI prototype shows screen detail. ([Agile Modeling](https://agilemodeling.com/artifacts/uiFlowDiagram.htm))

### arc42 quality tree and quality scenarios
- Quality scenarios make quality requirements concrete and let you decide whether each is met. ([arc42](https://docs.arc42.org/section-10/))
- arc42 now favors a simple table over the graphic tree, because a large tree loses overview. A graphic is still useful for finding gaps: a branch with no scenarios may be missing some. ([arc42 tip 10-2](https://docs.arc42.org/tips/10-2/), [arc42 tip 10-4](https://docs.arc42.org/tips/10-4/))
- This skill's pick, inference joining those two tips: record the qualities in a table, and use a tree only in a workshop to check for gaps.

## Other business charts

Each answers one question. Source for all: vendor pages.

- Gantt chart: which tasks run when, who owns them, and how long they take. ([Miro](https://miro.com/templates/gantt-chart/))
- Org chart: how roles and reporting lines are structured. ([Miro](https://miro.com/organizational-chart/))
- Venn diagram: how different concepts overlap. ([Miro](https://miro.com/diagramming/types-of-diagrams/))
- Sitemap: the structure and navigation of a website or app. ([Miro](https://miro.com/diagramming/sitemap/))
- Mind map: the topics around one central idea. ([Miro](https://miro.com/mind-map/what-is-a-mind-map/))
