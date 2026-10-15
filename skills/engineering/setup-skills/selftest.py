#!/usr/bin/env python3
"""Run setup.py against throwaway homes and check what it leaves. Prints `0 failures` when every check holds."""

import json
import os
import subprocess
import sys
import tempfile

SETUP = os.path.join(os.path.dirname(os.path.realpath(__file__)), "setup.py")
ROOT = os.path.realpath(os.path.join(os.path.dirname(SETUP), "..", "..", ".."))
failures = []


def check(name, ok):
    print(("ok   " if ok else "FAIL ") + name)
    if not ok:
        failures.append(name)


def run(home):
    return subprocess.run([sys.executable, "-I", SETUP], env={**os.environ, "HOME": home}, capture_output=True, text=True, check=True).stdout


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w").write(text)


def read(path):
    return open(path).read()


def snapshot(home):
    out = {}
    for d, _, files in os.walk(home):
        for f in files:
            p = os.path.join(d, f)
            out[p] = os.readlink(p) if os.path.islink(p) else read(p)
        for f in os.listdir(d):
            p = os.path.join(d, f)
            if os.path.islink(p):
                out[p] = os.readlink(p)
    return out


# A fresh home: everything installed, and a second run changes nothing.
home = tempfile.mkdtemp()
run(home)
claude_md = read(os.path.join(home, ".claude", "CLAUDE.md"))
check("fresh: rules block holds core.md", read(os.path.join(ROOT, "rules", "core.md")).strip() in claude_md)
check("fresh: Codex rules match Claude's", read(os.path.join(home, ".codex", "AGENTS.md")) == claude_md)
check("fresh: a shared skill resolves in both tools", all(os.path.isfile(os.path.join(home, d, "skills", "scratch-agents", "SKILL.md")) for d in (".agents", ".claude")))
before = snapshot(home)
run(home)
check("rerun: nothing changes", snapshot(home) == before)

# A home the user has already set up: their files survive, and old installs converge.
home = tempfile.mkdtemp()
mine = os.path.join(home, ".claude", "skills", "blueprint")
os.makedirs(mine)
write(os.path.join(mine, "SKILL.md"), "my own blueprint\n")
gone = os.path.join(home, ".agents", "skills", "herdr-scratch")
os.makedirs(os.path.dirname(gone))
os.symlink(os.path.join(ROOT, "skills", "engineering", "herdr-scratch"), gone)
write(os.path.join(home, ".claude", "CLAUDE.md"), "# Mine\n\nAlways use tabs.\n")
old_hook = 'm="$HOME/src/skills/mode/hooks/mode.py"; [ ! -f "$m" ] || python3 -I "$m" prompt'
other_hook = {"hooks": [{"type": "command", "command": "echo mine"}]}
write(os.path.join(home, ".claude", "settings.json"), json.dumps({"model": "opus", "hooks": {"UserPromptSubmit": [other_hook, {"hooks": [{"type": "command", "command": old_hook}]}]}}))
write(os.path.join(home, ".codex", "config.toml"), 'model = "x"\n\n[features]\nweb_search = true\n\n[tui]\nx = 1\n')
out = run(home)
check("existing: the user's own skill folder is kept", read(os.path.join(mine, "SKILL.md")) == "my own blueprint\n" and "kept " + mine in out)
check("existing: a link to a skill that left the checkout is removed", not os.path.lexists(gone))
text = read(os.path.join(home, ".claude", "CLAUDE.md"))
check("existing: the user's rules stay above the block", text.startswith("# Mine\n\nAlways use tabs.\n\n<!-- from"))
settings = json.load(open(os.path.join(home, ".claude", "settings.json")))
prompt = settings["hooks"]["UserPromptSubmit"]
check("existing: the user's own hook and model are kept", prompt[0] == other_hook and settings["model"] == "opus")
check("existing: an old mode hook is replaced, not doubled", len(prompt) == 2 and ROOT in prompt[1]["hooks"][0]["command"])
toml = read(os.path.join(home, ".codex", "config.toml"))
check("existing: hooks go into the [features] table", "[features]\nhooks = true\nweb_search = true\n" in toml and toml.count("[features]") == 1)
write(os.path.join(home, ".claude", "CLAUDE.md"), text.replace("# Agent rules", "# Stale rules") + "\nMy footer.\n")
run(home)
text = read(os.path.join(home, ".claude", "CLAUDE.md"))
check("update: the block is rewritten in place", "# Stale rules" not in text and text.count("<!-- from") == 1 and text.endswith("My footer.\n"))

print(f"{len(failures)} failures")
sys.exit(1 if failures else 0)
