#!/usr/bin/env python3
"""Print an explainer page's text, as a reader meets it, for the cold read and the prose check.

Usage: python3 page-text.py PAGE.html [PAGE.html ...]

Drops <style>, <script>, <head>, and every drawing (<svg>, <canvas>); keeps each
figure's <figcaption> where the figure sits, marked "[Diagram: ...]". Headings
become Markdown headings, list items "- " lines, table rows "|"-joined lines.
"""
import re
import sys
from html.parser import HTMLParser

SKIP = {"style", "script", "head", "svg", "canvas", "noscript", "template"}
BLOCK = {"p", "div", "section", "article", "aside", "header", "footer", "main", "nav",
         "ul", "ol", "table", "thead", "tbody", "pre", "details", "summary", "figure",
         "blockquote", "br", "hr", "dl", "dt", "dd"}
HEADINGS = {"h1": "# ", "h2": "## ", "h3": "### ", "h4": "#### "}


class PageText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.skip = 0
        self.pre = 0
        self.cell = False
        self.spans = []

    def newline(self):
        if self.out and not self.out[-1].endswith("\n"):
            self.out.append("\n")

    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            self.skip += 1
            return
        if self.skip:
            return
        if tag == "span":
            classes = (dict(attrs).get("class") or "").split()
            self.spans.append("label" in classes or "chip" in classes)
        elif tag in HEADINGS:
            self.out.append("\n" + HEADINGS[tag])
        elif tag == "li":
            self.newline()
            self.out.append("- ")
        elif tag == "tr":
            self.newline()
            self.cell = False
        elif tag in ("td", "th"):
            if self.cell:
                self.out.append(" | ")
            self.cell = True
        elif tag == "figcaption":
            self.newline()
            self.out.append("[Diagram: ")
        elif tag == "pre":
            self.newline()
            self.out.append("```\n")
            self.pre += 1
        elif tag in BLOCK:
            self.newline()

    def handle_endtag(self, tag):
        if tag in SKIP:
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            return
        if tag == "span":
            if self.spans and self.spans.pop():
                self.out.append(" ")
        elif tag in HEADINGS or tag in ("p", "li", "tr", "summary"):
            self.newline()
        elif tag == "figcaption":
            self.out.append("]\n")
        elif tag == "pre":
            self.pre -= 1
            self.newline()
            self.out.append("```\n")

    def handle_data(self, data):
        if self.skip:
            return
        self.out.append(data if self.pre else re.sub(r"\s+", " ", data))

    def text(self):
        lines = []
        in_code = False
        for line in "".join(self.out).splitlines():
            if line.strip() == "```":
                in_code = not in_code
            lines.append(line.rstrip() if in_code else re.sub(r" {2,}", " ", line).strip())
        result, blank = [], False
        for line in lines:
            if line.strip():
                result.append(line)
                blank = False
            elif not blank:
                result.append("")
                blank = True
        return "\n".join(result).strip() + "\n"


def main(paths):
    if not paths:
        sys.exit(__doc__.strip())
    for i, path in enumerate(paths):
        parser = PageText()
        with open(path, encoding="utf-8") as f:
            parser.feed(f.read())
        if len(paths) > 1:
            print(("\n" if i else "") + f"<!-- {path} -->")
        sys.stdout.write(parser.text())


if __name__ == "__main__":
    main(sys.argv[1:])
