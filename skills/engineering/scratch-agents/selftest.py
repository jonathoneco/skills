#!/usr/bin/env python3
"""Run with python3 skills/engineering/scratch-agents/selftest.py. Uses a fake Herdr CLI."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).with_name("start-agent.sh").resolve()
FAKE = r'''
import json
import os
from pathlib import Path
import sys

log = Path(os.environ["HERDR_TEST_LOG"])
calls = [json.loads(line) for line in log.read_text().splitlines()] if log.exists() else []
args = sys.argv[1:]
with log.open("a") as f:
    f.write(json.dumps(args) + "\n")
scenario = os.environ.get("HERDR_TEST_SCENARIO", "")
action = args[1]
if scenario == "fail-" + action:
    sys.exit("fixture " + action + " failure")
if action == "start" and scenario in ("update", "duplicate"):
    sys.exit("agent_not_ready" if scenario == "update" else "duplicate_agent_name")
if action == "read":
    dismissed = any(call[1] == "send-keys" for call in calls)
    print("Update available! Press esc." if scenario in ("update", "duplicate") and not dismissed else "Ask Codex to do anything")
'''


class StartAgentTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.brief = self.root / "brief with spaces.md"
        self.brief.write_text("A brief with " + chr(96) + "touch SHOULD_NOT_EXIST" + chr(96) + " and $(touch ALSO_NOT).\n")
        self.log = self.root / "calls.jsonl"
        fake = self.root / "herdr"
        fake.write_text("#!" + sys.executable + "\n" + FAKE)
        fake.chmod(0o755)
        self.env = dict(os.environ, PATH=str(self.root) + os.pathsep + os.environ["PATH"],
                        HERDR_TEST_LOG=str(self.log))

    def args(self, kind="codex"):
        return ["--name", "hook-check", "--kind", kind, "--model",
                "gpt-6.1-sol" if kind == "codex" else "opus", "--effort", "high",
                "--pane", "w1:p9", "--brief", str(self.brief)]

    def run_script(self, args, scenario=""):
        return subprocess.run(["bash", str(SCRIPT)] + args, text=True, capture_output=True,
                              cwd=self.root, env=dict(self.env, HERDR_TEST_SCENARIO=scenario), timeout=10)

    def calls(self):
        return [json.loads(line) for line in self.log.read_text().splitlines()]

    def test_dry_run_and_validation(self):
        for kind in ("claude", "codex"):
            with self.subTest(kind=kind):
                result = self.run_script(self.args(kind) + ["--dry-run"])
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn("--model opus --effort high" if kind == "claude" else "-m gpt-6.1-sol -c model_reasoning_effort=high", result.stdout)
                self.assertFalse(self.log.exists())
        for name in ("Upper", "1agent", "bad.name", "a" * 33, "ümlaut", ""):
            with self.subTest(name=name):
                args = self.args()
                args[1] = name
                result = self.run_script(args + ["--dry-run"])
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("name" if name else "--name", result.stderr)
        for flag in ("--model", "--effort", "--pane", "--brief"):
            with self.subTest(missing=flag):
                args = self.args()
                index = args.index(flag)
                del args[index:index + 2]
                result = self.run_script(args + ["--dry-run"])
                self.assertNotEqual(result.returncode, 0)
                self.assertIn(flag, result.stderr)
        for extra in (["--unknown"], ["--model"], ["--kind", "other"], ["--brief", "missing.md"],
                      ["--brief", "line\nbreak.md"]):
            result = self.run_script(self.args() + extra + ["--dry-run"])
            self.assertNotEqual(result.returncode, 0, extra)
        self.assertFalse(self.log.exists())

    def test_start_arguments_and_brief_pointer(self):
        for kind in ("claude", "codex"):
            with self.subTest(kind=kind):
                result = self.run_script(self.args(kind))
                self.assertEqual(result.returncode, 0, result.stderr)
                calls = self.calls()[-3:]
                native = (["--model", "opus", "--effort", "high", "--permission-mode", "bypassPermissions"]
                          if kind == "claude" else ["-m", "gpt-6.1-sol", "-c", "model_reasoning_effort=high",
                                                   "--dangerously-bypass-approvals-and-sandbox"])
                self.assertEqual(calls, [
                    ["agent", "start", "hook-check", "--kind", kind, "--pane", "w1:p9", "--"] + native,
                    ["agent", "read", "hook-check", "--source", "recent-unwrapped"],
                    ["agent", "prompt", "hook-check",
                     'Read the brief file at "' + str(self.brief) + '" and do everything it says.'],
                ])
                self.assertIn("Agent: hook-check\nPane: w1:p9\n", result.stdout)
                self.assertNotIn("SHOULD_NOT_EXIST", self.log.read_text())

    def test_update_prompt(self):
        result = self.run_script(self.args(), "update")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual([call[1] for call in self.calls()], ["start", "read", "send-keys", "wait", "read", "prompt"])
        self.assertEqual(self.calls()[2], ["agent", "send-keys", "hook-check", "esc"])
        self.assertEqual(self.calls()[3], ["agent", "wait", "hook-check", "--until", "idle", "--timeout", "30000"])

    def test_failures_have_a_reason(self):
        for action in ("start", "read", "prompt"):
            with self.subTest(action=action):
                result = self.run_script(self.args(), "fail-" + action)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("fixture " + action + " failure", result.stderr)

    def test_duplicate_name_does_not_prompt_existing_agent(self):
        result = self.run_script(self.args(), "duplicate")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("duplicate_agent_name", result.stderr)
        self.assertEqual([call[1] for call in self.calls()], ["start", "read"])


if __name__ == "__main__":
    unittest.main()
