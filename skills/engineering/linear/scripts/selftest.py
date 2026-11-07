"""Checks the linear scripts offline. Run: python3 -I selftest.py"""
import importlib.machinery
import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))


def load(name):
    loader = importlib.machinery.SourceFileLoader(name.replace("-", "_"), os.path.join(HERE, name))
    spec = importlib.util.spec_from_loader(loader.name, loader)
    module = importlib.util.module_from_spec(spec)
    loader.exec_module(module)
    return module


cut = load("cut-bodies").cut
compare = load("compare-readback").compare

DRAFT = """# T1: Fix the parser

## Outcome

Run this:

```sh
# a comment, not a heading
make parse
```

## Done

- [ ] parses

# T2: Next ticket

## Outcome

Second body.

# Notes

Paths for the session: briefs/a.md
"""


class CutBodies(unittest.TestCase):
    def test_hash_line_inside_fence_stays_in_body(self):
        tickets = cut(DRAFT)
        self.assertEqual([t["heading"] for t in tickets], ["T1: Fix the parser", "T2: Next ticket"])
        self.assertEqual(tickets[0]["body"], DRAFT.split("# T1: Fix the parser\n\n")[1].split("\n# T2")[0].rstrip("\n") + "\n")

    def test_closing_notes_stay_out(self):
        self.assertEqual(cut(DRAFT)[1]["body"], "## Outcome\n\nSecond body.\n")


class CompareReadback(unittest.TestCase):
    def test_every_rewrite_linear_makes_matches(self):
        draft = ("## Outcome\n\n- a bullet\n> - quoted bullet\n- [x] done\n\n1. step\n\n| a | b |\n|---|---|\n| #1 | x |\n\n"
                 "**In `a.ts`,** see [obs] and ~ and _(note `x`)_ and ``a`b`` at https://e.com and [doc](docs/a.md).\n")
        stored = ("## Outcome\n\n* a bullet\n> * quoted bullet\n* [X] done\n\n 1. step\n\n| a | b |\n| -- | -- |\n| \\#1 | x |\n\n"
                  "**In** `a.ts`**,** see \\[obs\\] and \\~ and *note* `x` and `` a`b `` at <https://e.com> and [doc](<docs/a.md>).\n")
        self.assertIsNone(compare(draft, stored))

    def test_changed_word_is_caught(self):
        self.assertIn("first difference", compare("## A\n\nkeep this\n", "## A\n\nkeep that\n"))

    def test_wrong_cut_is_caught_by_sections(self):
        self.assertIn("sections differ", compare("## A\n\nx\n## B\n\ny\n", "## A\n\nx\n"))


class LedgerAppend(unittest.TestCase):
    def test_appends_one_line_per_write(self):
        with tempfile.TemporaryDirectory() as d:
            ledger = os.path.join(d, "linear-ledger.jsonl")
            for args in (["ABC-1", "create", "ok", "T1"], ["ABC-2", "relate", "ok"]):
                subprocess.run([sys.executable, "-I", os.path.join(HERE, "ledger-append"), ledger, *args], check=True)
            rows = [json.loads(line) for line in open(ledger)]
        self.assertEqual([(r["draft"], r["key"], r["op"]) for r in rows], [("T1", "ABC-1", "create"), (None, "ABC-2", "relate")])


if __name__ == "__main__":
    unittest.main()
