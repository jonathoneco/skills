# Build

The page is one `.html` file with its CSS and JavaScript inline. It opens from disk with no build step and no network.

## The design plan

Write it in the notes before any page code. Each later colour and type choice traces back to it.

- **Colour:** 4 to 6 hex values, each with a name and a job. Status colours (good, warning, critical) are their own values, apart from the accent and from any thread's hue. A neutral leans a little toward the accent.
- **Type:** the pair from [fonts/README.md](fonts/README.md), with the role of each face and one type scale.
- **Layout:** the organizing idea, in a sentence or two.

Where the look comes from, first match wins: what the user said, then the design system of the project the page is about (its `DESIGN.md`, tokens, or components), then the subject. A choice from the subject uses its materials, its tools, and its words. Test the plan: swap in a neighbouring subject. A plan that fits the neighbour as well is stock, so rework it.

The register is a working document: clear hierarchy, considered spacing, little ornament.

## Page code

- **Themes.** Declare the palette as custom properties on `:root`. Components read only those tokens. Reassign the tokens inside `@media (prefers-color-scheme: dark)`, and again under `:root[data-theme="dark"]` and `:root[data-theme="light"]`, so a viewer's toggle beats the system setting both ways. Choose the dark values by eye for legibility and a working accent.
- **Type.** Embed each face as the fonts README says. Text lines run to about 65 characters. Headings take `text-wrap: balance`. Columns of numbers take `font-variant-numeric: tabular-nums`.
- **Spacing.** A group of siblings is a flex or grid container with `gap`.
- **Wide content.** A table, a code block, or a diagram wider than the column scrolls inside its own container with `overflow-x: auto`, so the page body never scrolls sideways.
- **Structure marks.** An eyebrow, a number, or a divider states something true about the content. Numbers mark a real order.
- **State.** A state the reader scans for, such as held, open, or settled, shows as a pill or a chip in a status colour, with its word.
- **Controls.** Each control works from the keyboard and shows its focus. Motion stops under `prefers-reduced-motion`.

## Looking at it

Serve the page's folder over loopback, since `playwright-cli` refuses `file://` URLs: `python3 -m http.server --bind 127.0.0.1 <port>`, then open `http://127.0.0.1:<port>/<file>`.

Look at each viewport and theme that step 4's Done when names. Use every control and read the console. Fix clipped or overlapping text, a typeface that fell back, a broken state, and sideways scroll.

Adapted from plannotator/effective-html's `html` and `design-artifact` skills (MIT, plannotator).
