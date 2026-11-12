# Typefaces

Each `.css` file here holds one typeface as `@font-face` rules with the font embedded. A file is 30 to 165 KB of encoded data: insert it into the page's `<style>` with a command, such as `cat`, and do not open it. Each face is under the SIL Open Font License; its licence is the `.OFL.txt` file beside it.

Pick one text face, one face for headings and labels, and the mono. Four pairs that work, as a start:

| Text | Headings, labels, tables, diagrams | Character |
|---|---|---|
| `newsreader.css` (Newsreader) | `albert-sans.css` (Albert Sans) | A newspaper column with clean signage |
| `source-serif-4.css` (Source Serif 4) | `space-grotesk.css` (Space Grotesk) | A technical report with a quirky, geometric voice |
| `literata.css` (Literata) | `bricolage-grotesque.css` (Bricolage Grotesque) | A book page with loud, hand-cut headings |
| `source-serif-4.css` (Source Serif 4) | `ibm-plex-sans.css` (IBM Plex Sans) | An engineering manual |

`jetbrains-mono.css` (JetBrains Mono) is the mono for code and symbols with every pair.

Each face covers weights 400 to 700 (Albert Sans and Bricolage Grotesque to 800). The three text faces have italics. All hold the Latin character set only.

Name the family in CSS as the table spells it, such as `font-family: "Source Serif 4", Georgia, serif`.
