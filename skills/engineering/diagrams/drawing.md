# Drawing on a page

How to draw a diagram inside an HTML page, once steps 1 to 3 have set its row, its level, and its elements. The diagram sits inline in the page's own file and takes the page's palette and typefaces.

## Render

- Draw in SVG where arrows route between boxes. Draw in HTML and CSS where the form is a grid, such as a matrix, a timeline, or lanes of cards.
- Make labels, grouping, direction, and connectors legible first. Route edges so that few cross, and give each arrow one clear head.
- A box keeps its position in every diagram the reader compares, such as two states or the steps of one run.
- Meaning reads without colour: a line style, a shape, or a label carries it as well. The diagram has a text alternative.

## Interaction

Add stepping, filtering, path tracing, or pan and zoom when it helps answer the diagram's question, such as one layout that would otherwise repeat for each stage or case.

- The default state is the **still frame**: it answers the question with no click. A print or a copy shows only that frame.
- Each control works from the keyboard. An overlay can be dismissed. Motion stops under `prefers-reduced-motion`.

## Check

Look at the diagram in a browser at a wide and a narrow width, in every interactive state. Fix label collisions, clipped nodes, edges that cross a box, and a reading order that fights the arrows.

Adapted from plannotator/effective-html's `html-diagram` skill (MIT, plannotator).
