#!/usr/bin/env python3
"""Run with python3 skills/engineering/babysit-pr/selftest.py. Drives scripts/watch-pr --once against a fake gh."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(os.environ.get("WATCH_PR", Path(__file__).with_name("scripts") / "watch-pr")).resolve()
FAKE = r'''
import json, os, sys
args = sys.argv[1:]
fixture = json.loads(os.environ["GH_FIXTURE"])
if args[:2] == ["pr", "view"]:
    print(json.dumps({"number": 7, "url": "https://github.com/o/r/pull/7", "state": "OPEN", "isDraft": False,
                      "headRefOid": "a" * 40, "mergeable": "MERGEABLE", "mergeStateStatus": "BLOCKED",
                      "reviewDecision": "", "comments": [], "reviews": []}))
elif args[:2] == ["pr", "checks"]:
    print(json.dumps(fixture["required"] if "--required" in args else fixture["all"]))
elif args[:1] == ["api"] and "graphql" in args:
    print(json.dumps({"data": {"repository": {"pullRequest": {"reviewThreads": {"nodes": []}}}}}))
elif args[:1] == ["api"]:
    print("[[]]")
else:
    sys.exit("unexpected gh call: %s" % args)
'''

OLD_SKIP = {"name": "check", "bucket": "skipping", "workflow": "CI", "startedAt": "2026-11-15T23:57:03Z"}
NEW_PASS = {"name": "check", "bucket": "pass", "workflow": "CI", "startedAt": "2026-11-16T00:56:04Z"}
SHARD_RUNNING = {"name": "tests (4)", "bucket": "pending", "workflow": "CI", "startedAt": "2026-11-16T00:37:10Z"}


class WatchPrTests(unittest.TestCase):
    def run_once(self, required, every):
        with tempfile.TemporaryDirectory() as tmp:
            fake = Path(tmp) / "gh"
            fake.write_text("#!" + sys.executable + "\n" + FAKE)
            fake.chmod(0o755)
            env = dict(os.environ, PATH=tmp + os.pathsep + os.environ["PATH"],
                       GH_FIXTURE=json.dumps({"required": required, "all": every}))
            return subprocess.run([sys.executable, str(SCRIPT), "7", "--once"], text=True,
                                  capture_output=True, env=env, timeout=20)

    def test_draft_skip_while_ready_run_is_still_running_is_pending(self):
        result = self.run_once([OLD_SKIP], [OLD_SKIP, SHARD_RUNNING])
        self.assertEqual(result.returncode, 10, result.stdout + result.stderr)
        self.assertIn("watch-pr: PENDING", result.stdout)

    def test_newer_pass_beats_older_skip_of_the_same_check(self):
        result = self.run_once([OLD_SKIP, NEW_PASS], [OLD_SKIP, NEW_PASS])
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("watch-pr: GREEN", result.stdout)

    def test_skip_with_nothing_running_stays_red(self):
        result = self.run_once([OLD_SKIP], [OLD_SKIP])
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("required checks skipped, so they never ran: check", result.stdout)


if __name__ == "__main__":
    unittest.main()
