#!/usr/bin/env python3
"""Replays hook events against fake transcripts and checks what mode.py prints.
Run: python3 -I hooks/selftest.py   (prints FAIL lines and exits 1 on any miss)"""
import json
import os
import subprocess
import sys
import tempfile

HOOK = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mode.py")
failures = 0
CODEX_TEST = False
IN_HERDR = False


def line(kind, *content):
    if kind == "prompt":
        return {"type": "user", "message": {"role": "user", "content": content[0]}}
    if kind == "context":
        return {"type": "attachment", "attachment": {"type": "hook_additional_context", "content": [content[0]]}}
    if kind == "text":
        return {"type": "assistant", "message": {"content": [{"type": "text", "text": content[0]}]}}
    name, inp = content
    return {"type": "assistant", "message": {"content": [{"type": "tool_use", "name": name, "input": inp}]}}


def run(sub, event, transcript):
    """transcript: a list of entries, None for a path that doesn't exist, or "dir" for an unreadable one."""
    tmp = tempfile.mkdtemp()
    path = os.path.join(tmp, "t.jsonl")
    if transcript == "dir":
        os.mkdir(path)
    elif transcript is not None:
        with open(path, "w") as f:
            f.write("".join(json.dumps(e, separators=(",", ":")) + "\n" for e in transcript))
    raw = event if isinstance(event, str) else json.dumps(dict(event, transcript_path=path))
    env = {k: v for k, v in os.environ.items() if not k.startswith("HERDR_")}
    if IN_HERDR:
        env["HERDR_ENV"] = "1"
    out = subprocess.run([sys.executable, "-I", HOOK] + (["--codex"] if CODEX_TEST else []) + [sub], input=raw, capture_output=True,
                         text=True, timeout=10, env=env)
    if transcript == "dir":
        os.rmdir(path)
    elif transcript is not None:
        os.unlink(path)
    os.rmdir(tmp)
    return out.returncode, out.stdout


def check(label, sub, event, transcript, expect, absent=None):
    global failures
    code, out = run(sub, event, transcript)
    ok = code == 0 and '"deny"' not in out and (expect in out if expect else out == "")
    ok = ok and not (absent and absent in out)
    if not ok:
        failures += 1
        print("FAIL %s: expected %r, got exit %d %r" % (label, expect, code, out))


BUG = "count_rows in importer.py reports 4 rows for sample.csv. Fix it."
EDIT = ("Edit", {"file_path": "/r/importer.py", "old_string": "a", "new_string": "b"})
edited = [line("prompt", BUG), line("tool", *EDIT)]
loaded = edited + [line("tool", "Skill", {"skill": "principle-fix-root-causes"}),
                   line("tool", "Bash", {"command": "python3 -c 'import importer'"})]
STOP = {"stop_hook_active": False, "last_assistant_message": "Fixed it."}

# Routing: one generic word never fires; strong cues do.
for plain in ["Print the current git branch.", "Add a docstring to count_rows.", "Rename count_rows to row_count.",
              "What does csv.reader return for an empty file?", "Bump the version to 1.2 and add a changelog line.",
              "Write a short README for the users folder."]:
    check("no route, menu only: " + plain, "prompt", {"prompt": plain}, None, "No cue matched", "This task hits")
check("routes at first prompt (no transcript yet)", "prompt", {"prompt": BUG}, None, "`principle-fix-root-causes`")
check("routes a ticket", "prompt", {"prompt": "Write a ticket for adding a --dry-run flag."}, [], "principle-prove-it-works")
check("loaded principle not repeated", "prompt", {"prompt": BUG}, loaded, "Check the principle skills", "`principle-fix-root-causes`")
check("routed prompt also lists the rest", "prompt", {"prompt": BUG}, None, "Also check the principle skills")

# Heavy work: plan mode or a kickoff of planning, investigation, or writing for someone else.
HEAVY = "start of heavy work"
check("plan mode is heavy work", "prompt", {"prompt": "Add a --dry-run flag to the importer.", "permission_mode": "plan"}, None, HEAVY)
for kickoff in ["Investigate why the nightly import drops rows.", "Let's plan how we roll out the new importer.",
                "Write up the outage for the team.", "Go deep on why reviews keep missing this.",
                "Agreed /how /why /blueprint", "$research how other tools load rules"]:
    check("heavy kickoff: " + kickoff, "prompt", {"prompt": kickoff}, None, HEAVY)
for plain in ["Print the current git branch.", "Add a docstring to count_rows.", "Write a short README for the users folder.",
              "Merge it", "go", "Is this plan saved?", "Check ABC-1 as directed by /notes/design-bakeoff/brief.md"]:
    check("not heavy: " + plain, "prompt", {"prompt": plain, "permission_mode": "default"}, None, "Check the principle skills", HEAVY)
check("prompt: unreadable transcript is silent", "prompt", {"prompt": BUG}, "dir", "")

# Edit reminders: context only, once per task, silent without evidence.
check("first edit reminded", "pretool", {"tool_name": "Edit", "tool_input": {"file_path": "/r/importer.py"}}, edited, "first-edit:")
check("first-edit reminder fires once", "pretool", {"tool_name": "Edit", "tool_input": {"file_path": "/r/importer.py"}},
      edited + [line("context", "[mode] first-edit: x")], "")
check("pretool: missing transcript is silent", "pretool", {"tool_name": "Edit", "tool_input": {"file_path": "/r/importer.py"}}, None, "")
check("pretool: unreadable transcript is silent", "pretool", {"tool_name": "Edit", "tool_input": {"file_path": "/r/importer.py"}}, "dir", "")
check("doc edit quiet", "pretool", {"tool_name": "Write", "tool_input": {"file_path": "/r/ticket.md"}}, edited, "")
check("test edit reminded", "pretool", {"tool_name": "Write", "tool_input": {"file_path": "/r/tests/test_a.py"}}, loaded,
      "principle-test-behavior-not-implementation")
check("test reminder fires once", "pretool", {"tool_name": "Write", "tool_input": {"file_path": "/r/tests/test_a.py"}},
      loaded + [line("context", "[mode] test-edit: x")], "")
check("heredoc test write reminded", "pretool", {"tool_name": "Bash", "tool_input": {"command": "cat > tests/test_a.py <<EOF"}},
      loaded, "principle-test-behavior-not-implementation")
check("plain bash quiet", "pretool", {"tool_name": "Bash", "tool_input": {"command": "ls > /dev/null"}}, edited, "")

# Stop: bounded and conditional.
check("stop: routed, unloaded, unverified", "stop", STOP, edited, "principle-prove-it-works")
# A file written and run in the same shell line counts as run; a write alone or a git add doesn't.
WRITE = "cat > /tmp/count.py <<EOF\nx = 0\nx = 1\nx = 2\nx = 3\nx = 4\nx = 5\nx = 6\nx = 7\nx = 8\nx = 9\nx = 10\nx = 11\nx = 12\nx = 13\nx = 14\nx = 15\nx = 16\nx = 17\nx = 18\nx = 19\nx = 20\nx = 21\nx = 22\nx = 23\nx = 24\nx = 25\nx = 26\nx = 27\nx = 28\nx = 29\nEOF"
check("stop: write then run in one command", "stop", STOP,
      [line("prompt", BUG), line("tool", "Bash", {"command": WRITE + "\npython3 /tmp/count.py"})], "principle-fix-root-causes", "ran nothing")
check("stop: write alone is reminded", "stop", STOP, [line("prompt", BUG), line("tool", "Bash", {"command": WRITE})], "ran nothing")
check("stop: write then git add is not a run", "stop", STOP,
      [line("prompt", BUG), line("tool", "Bash", {"command": WRITE + "\ngit add /tmp/count.py"})], "ran nothing")
NAMED = dict(STOP, last_assistant_message="principle-fix-root-causes: traced it")
check("stop: reply names a principle, edit unverified", "stop", NAMED, edited, "principle-prove-it-works", "This task called for")
check("stop: reply names a principle, edit verified", "stop", NAMED,
      edited + [line("tool", "Bash", {"command": "python3 -c 'import importer'"})], "")
check("stop: loaded and ran", "stop", STOP, loaded, "")
check("stop: active continuation", "stop", dict(STOP, stop_hook_active=True), edited, "")
check("stop: flag absent", "stop", {"last_assistant_message": "ok"}, edited, "")
check("stop: missing transcript", "stop", STOP, None, "")
check("stop: unreadable transcript", "stop", STOP, "dir", "")
check("stop: small unrouted edit stays quiet", "stop", STOP,
      [line("prompt", "Add a docstring to count_rows."), line("tool", *EDIT)], "")
check("stop: large unrouted edit unverified", "stop", STOP,
      [line("prompt", "Add a docstring to count_rows."),
       line("tool", "Write", {"file_path": "/r/a.py", "content": "x\n" * 40})], "principle-prove-it-works")
check("stop: compaction forgets loads", "stop", STOP,
      loaded[:3] + [{"type": "system", "subtype": "compact_boundary"}] + loaded[3:], "principle-fix-root-causes")
check("stop: reply read from transcript", "stop", {"stop_hook_active": False}, edited + [line("text", "Fixed.")], "principle-fix-root-causes")

# Operational rules: one line before the action. Merges, deletes and outside writes remind every time.
def pre(tool, inp):
    return {"tool_name": tool, "tool_input": inp}
def sh(command):
    return pre("Bash", {"command": command})
FIX = [line("prompt", "Fix the importer.")]
SKILL_DIR = tempfile.mkdtemp()
open(os.path.join(SKILL_DIR, "SKILL.md"), "w").close()
IN_HERDR = True
check("helper: built-in tool in Herdr", "pretool", pre("Agent", {"prompt": "x", "model": "sonnet"}), FIX, "scratch-agents")
check("helper: herdr start without model", "pretool", sh("herdr agent start r1 --kind claude --pane w1:p1"), FIX, "model and effort")
check("helper: herdr start with model and effort", "pretool",
      sh("herdr agent start r1 --kind claude --pane w1:p1 -- --model sonnet --effort medium"), FIX, "")
check("helper: codex start with model and effort", "pretool",
      sh("herdr agent start r1 --kind codex --pane w1:p1 -- -m gpt-6-luna -c model_reasoning_effort=medium"), FIX, "")
check("helper: once per task", "pretool", pre("Agent", {"prompt": "x"}), FIX + [line("context", "[mode] helper: x")], "")
IN_HERDR = False
check("helper: built-in tool outside Herdr", "pretool", pre("Agent", {"prompt": "x", "model": "sonnet"}), FIX, "")
check("outside write", "pretool", pre("mcp__notion__notion-update-page", {"page_id": "p"}), FIX, "outside-write:")
check("outside write every time", "pretool", pre("mcp__notion__notion-update-page", {"page_id": "p"}),
      FIX + [line("context", "[mode] outside-write: x")], "outside-write:")
check("outside read quiet", "pretool", pre("mcp__notion__notion-fetch", {"id": "p"}), FIX, "")
check("executor write", "pretool", pre("mcp__executor__execute", {"code": "await tools.notion.pages.update({id})"}), FIX, "outside-write:")
check("executor read quiet", "pretool", pre("mcp__executor__execute", {"code": "await tools.notion.databases.query({id})"}), FIX, "")
check("merge not asked for", "pretool", sh("gh pr merge 48 --merge"), FIX, "merge:")
check("merge asked for", "pretool", sh("gh pr merge 48 --merge"), [line("prompt", "Merge it and do that next")], "")
check("delete in tmp quiet", "pretool", sh("rm -rf /tmp/arena/out"), FIX, "")
check("delete outside tmp", "pretool", sh("rm -f ~/src/app/build.log"), FIX, "blast radius")
check("delete with a variable", "pretool", sh('rm -rf "$U"'), FIX, "literal paths")
check("delete with a wildcard in tmp", "pretool", sh("rm /tmp/x/renders/*"), FIX, "literal paths")
check("delete every time", "pretool", sh("rm -f ~/src/app/build.log"), FIX + [line("context", "[mode] delete: x")], "blast radius")
check("delete in tmp with a redirect", "pretool", sh("rm -rf /tmp/nix-f5 2>/dev/null"), FIX, "")
check("relative delete after cd into tmp", "pretool", sh("cd /tmp/w && rm -f probe.ts"), FIX, "")
check("relative delete in a tmp working folder", "pretool", dict(sh("rm -f probe.ts"), cwd="/tmp/w"), FIX, "")
check("relative delete in a repo", "pretool", dict(sh("rm -f probe.ts"), cwd="/Users/x/src/app"), FIX, "blast radius")
check("word rm in an argument is not a delete", "pretool", sh("grep -n 'rm -rf' notes.md"), FIX, "")
check("stash", "pretool", sh("git stash"), FIX, "stash:")
check("stash list quiet", "pretool", sh("git stash list"), FIX, "")
check("commit", "pretool", sh("git commit -m 'fix: x' -- a.md"), FIX, "commit:")
check("commit once per task", "pretool", sh("git commit -m 'fix: x' -- a.md"), FIX + [line("context", "[mode] commit: x")], "")
check("shell script edit", "pretool", pre("Write", {"file_path": "/r/build.sh", "content": "echo hi"}), FIX, "shellcheck")
check("python edit has no shell reminder", "pretool", pre("Write", {"file_path": "/r/a.py", "content": "x"}), FIX, "", "shellcheck")
check("skill edit", "pretool", pre("Edit", {"file_path": "/r/skills/blueprint/SKILL.md", "old_string": "a", "new_string": "b"}), FIX, "writing-for-agents")
check("agents file edit", "pretool", pre("Write", {"file_path": "/r/AGENTS.md", "content": "x"}), FIX, "writing-for-agents")
check("skill sibling edit", "pretool", pre("Edit", {"file_path": os.path.join(SKILL_DIR, "kinds.md"), "old_string": "a", "new_string": "b"}), FIX, "writing-for-agents")
check("plain doc edit is quiet", "pretool", pre("Write", {"file_path": "/r/docs/notes.md", "content": "x"}), FIX, "", "writing-for-agents")
check("skill edit once per task", "pretool", pre("Edit", {"file_path": "/r/SKILL.md", "old_string": "a", "new_string": "b"}),
      FIX + [line("context", "[mode] agent-doc: x")], "", "writing-for-agents")

# Tool output reminders.
check("bench output", "posttool", {"tool_name": "Bash", "tool_input": {"command": "hyperfine ./a"}, "tool_response": "1s"},
      edited, "principle-explain-the-number")
check("bench reminder fires once", "posttool", {"tool_name": "Bash", "tool_input": {"command": "hyperfine ./a"}, "tool_response": "1s"},
      edited + [line("context", "[mode] bench-run: x")], "")
check("reading bench notes is not a run", "posttool", {"tool_name": "Bash", "tool_input": {"command": "cat BENCH.txt"}, "tool_response": "2.3x"},
      edited, "")
check("big output", "posttool", {"tool_name": "Read", "tool_input": {"file_path": "/r/a.log"}, "tool_response": "x" * 40000},
      edited, "principle-guard-the-context-window")
check("posttool: missing transcript", "posttool", {"tool_name": "Read", "tool_input": {}, "tool_response": "x" * 40000}, None, "")

# Bad input and subagents.
check("subagent untouched", "pretool", {"agent_id": "a1", "tool_name": "Edit", "tool_input": {"file_path": "/r/importer.py"}}, edited, "")
for sub in ("prompt", "pretool", "posttool", "stop"):
    check("bad json: " + sub, sub, "not json", [], "")
    check("non-object json: " + sub, sub, "[1, 2]", [], "")

# Codex fixtures use completed runtime items from CLI 0.160.1 captures.
CODEX_TEST = True

def cx(kind, **values):
    return {"type": "event_msg", "payload": {"type": "item_completed", "item": dict(type=kind, **values)}}

cx_prompt = cx("UserMessage", content=[{"type": "text", "text": BUG}])
cx_edit = cx("FileChange", status="completed", changes={"/r/a.py": {"unified_diff": "+b\n-a"}})
cx_load = cx("CommandExecution", exit_code=0, command=["/bin/zsh", "-lc", "cat /r/principle-fix-root-causes/SKILL.md"])
cx_run = cx("CommandExecution", exit_code=0, command=["/bin/zsh", "-lc", "python3 a.py"])
cx_edited = [cx_prompt, cx_edit]
cx_loaded = cx_edited + [cx_load, cx_run]
patch = "*** Begin Patch\n*** Update File: /r/a.py\n@@\n-a\n+b\n*** End Patch"
check("codex prompt wording", "prompt", {"prompt": BUG}, None, "read the SKILL.md file in full")
check("codex prompt names the file", "prompt", {"prompt": BUG}, None, os.path.expanduser("~/.agents/skills") + "/principle-<name>/SKILL.md")
check("codex no route, menu only", "prompt", {"prompt": "Print the current branch."}, [], "No cue matched", "This task hits")
check("codex plan mode is heavy work", "prompt", {"prompt": "Print the current branch.", "permission_mode": "plan"}, [], "start of heavy work")
check("codex loaded principle not repeated", "prompt", {"prompt": BUG}, cx_loaded, "read its SKILL.md file in full", "`principle-fix-root-causes`")
check("codex patch first edit", "pretool", {"tool_name": "apply_patch", "tool_input": {"command": patch}}, cx_edited, "first-edit:")
check("codex patch test edit", "pretool", {"tool_name": "apply_patch", "tool_input": {"command": patch.replace("/r/a.py", "/r/tests/test_a.py")}}, cx_loaded, "principle-test-behavior-not-implementation")
check("codex doc patch quiet", "pretool", {"tool_name": "apply_patch", "tool_input": {"command": patch.replace("a.py", "a.md")}}, cx_edited, "")
check("codex missing transcript", "pretool", {"tool_name": "apply_patch", "tool_input": {"command": patch}}, None, "")
check("codex stop unverified", "stop", STOP, cx_edited, "principle-prove-it-works")
check("codex stop loaded verified", "stop", STOP, cx_loaded, "")
check("codex stop bounded", "stop", dict(STOP, stop_hook_active=True), cx_edited, "")
check("codex compaction forgets loads", "stop", STOP, cx_loaded + [{"type": "compacted", "payload": {"replacement_history": []}}], "principle-fix-root-causes")
check("codex failed skill read not loaded", "prompt", {"prompt": BUG}, [cx_prompt, cx("CommandExecution", exit_code=1, command="cat /r/principle-fix-root-causes/SKILL.md")], "principle-fix-root-causes")
check("codex pathname listing not loaded", "prompt", {"prompt": BUG}, [cx_prompt, cx("CommandExecution", exit_code=0, command="ls /r/principle-fix-root-causes/SKILL.md")], "principle-fix-root-causes")
check("codex new task resets edits", "stop", STOP, cx_loaded + [cx("UserMessage", content=[{"text": "Print the current branch."}])], "")
check("codex marker suppresses repeat", "pretool", {"tool_name": "apply_patch", "tool_input": {"command": patch}}, cx_edited + [{"type": "response_item", "payload": {"type": "message", "role": "developer", "content": [{"text": "[mode] first-edit: x"}]}}], "")
IN_HERDR = True
check("codex spawn_agent in Herdr", "pretool", pre("spawn_agent", {"message": "x"}), [cx_prompt], "scratch-agents")
IN_HERDR = False
check("codex skill patch", "pretool", pre("apply_patch", {"command": patch.replace("/r/a.py", "/r/CLAUDE.md")}), cx_edited, "writing-for-agents")
check("codex shell script patch", "pretool", pre("apply_patch", {"command": patch.replace("/r/a.py", "/r/run.sh")}), cx_edited, "shellcheck")
check("codex outside write", "pretool", pre("mcp__linear__create_issue", {"title": "x"}), [cx_prompt], "outside-write:")
check("codex benchmark", "posttool", {"tool_name": "Bash", "tool_input": {"command": "hyperfine ./a"}, "tool_response": "1s"}, cx_edited, "principle-explain-the-number")
check("codex oversized output", "posttool", {"tool_name": "Bash", "tool_input": {"command": "cat a.log"}, "tool_response": "x" * 40000}, cx_edited, "principle-guard-the-context-window")

print("%d failures" % failures)
sys.exit(1 if failures else 0)
