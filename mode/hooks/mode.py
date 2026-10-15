#!/usr/bin/env python3
"""Working-mode hook: names the principle skills a moment calls for, as a reminder.

Use --codex before the subcommand for Codex CLI 0.160.1 rollouts.
Without it, events use the Claude Code transcript format.

One script, one subcommand per hook event:
  prompt    UserPromptSubmit  score the prompt against ROUTES and name what to load before the
                              reply, then list every other unloaded principle with its moment so
                              the model can pick from the session's context; in plan mode or at a
                              HEAVY cue, ask for every principle the work could reach
  pretool   PreToolUse        first test edit, and first code edit while the task's principles
                              are unloaded; one line of the operational rule (OPS) before starting
                              a helper, writing to an outside system, merging, deleting, stashing,
                              committing, or editing a shell script
  posttool  PostToolUse       output of a benchmark run, and oversized tool output
  stop      Stop              one follow-up when the task's routed principles are unloaded and the
                              reply names none, or when a substantial edit was never run

Every hook only adds context; none denies a tool call. Each reads its evidence back
from the session transcript and writes nothing to disk. Missing or unreadable
evidence, bad input, or any exception means exit 0 with no output. Two hooks
run without a transcript: the prompt hook at a session's
first prompt, where Claude Code has not created the transcript yet, so a
missing file means nothing is loaded.
"""
import json
import os
import re
import shlex
import sys

MARK = "[mode]"

# Isolated Python omits the script directory from sys.path. routes.py is the table.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from routes import HEAVY, HELPER_TOOLS, OPS, ROUTES, WRITE_VERBS

CODEX = "--codex" in sys.argv

for row in ROUTES:
    row["rx"] = [(2, re.compile(x, re.I | re.S)) for x in row["strong"]] + \
                [(1, re.compile(x, re.I | re.S)) for x in row["weak"]]
BY_TOOL = {row["tool"]: row for row in ROUTES if row.get("tool")}
HEAVY_RX = [re.compile(x, re.I | re.S) for x in HEAVY]
MAX_ROUTED = 3
THRESHOLD = 2

CODE_EXT = re.compile(r"\.(py|ts|tsx|js|jsx|mjs|cjs|go|rs|rb|java|kt|swift|c|cc|cpp|h|hpp|cs|php|sh|bash|zsh|lua|sql|scala|ex|exs|clj|vue|svelte)$", re.I)
TEST_PATH = re.compile(r"(^|/)(tests?|__tests__|spec)/|(^|/)test_[^/]*$|_test\.\w+$|\.(test|spec)\.\w+$", re.I)
BENCH_CMD = re.compile(r"\b(bench\w*|hyperfine|timeit|perf stat|wrk|k6|ab -n|locust|time\s+\S)|--bench", re.I)
READ_ONLY_CMD = re.compile(r"^\s*(cat|head|tail|less|sed|grep|rg|ls|wc|git|find)\b")
SHELL_WRITE = re.compile(r"(?:>>?|\btee(?:\s+-a)?)\s*['\"]?([^\s'\";|&<>]+)")
BIG_OUTPUT = 30000
SMALL_EDIT_LINES = 12      # an unrouted edit this small does not draw the Stop check
TAIL_BYTES = 8 * 1024 * 1024
EDIT_TOOLS = ("Edit", "Write", "MultiEdit", "NotebookEdit")


def route(prompt):
    scored = []
    for i, row in enumerate(ROUTES):
        score = sum(w for w, rx in row["rx"] if rx.search(prompt or ""))
        if score >= THRESHOLD:
            scored.append((-score, i, row))
    return [row for _, _, row in sorted(scored, key=lambda t: t[:2])[:MAX_ROUTED]]


def shell_writes(command):
    """Code files a shell command writes by redirect or tee, so heredoc edits count as edits."""
    return [p for p in SHELL_WRITE.findall(command or "") if CODE_EXT.search(p)]


def edit_lines(name, inp):
    if name == "Bash":
        return str(inp.get("command") or "").count("\n") + 1
    text = inp.get("new_string") or inp.get("content") or inp.get("new_source") or ""
    for e in inp.get("edits") or []:
        text += "\n" + str(e.get("new_string") or "")
    return str(text).count("\n") + 1


def read_claude_session(path):
    """What the transcript says about the current task (since the last real user prompt)
    and the current context window (since the last compaction). None if it can't be read."""
    s = {"prompt": "", "loaded": set(), "marks": "", "edits": [], "edit_lines": 0,
         "ran_after_edit": False, "reply": ""}
    with open(path, "rb") as f:
        f.seek(0, os.SEEK_END)
        f.seek(max(0, f.tell() - TAIL_BYTES))
        lines = f.read().decode("utf-8", "replace").splitlines()
    for line in lines:
        if '"user"' not in line and '"assistant"' not in line and "compact" not in line \
                and "hook_additional_context" not in line:
            continue
        try:
            e = json.loads(line)
        except ValueError:
            continue
        if e.get("subtype") == "compact_boundary" or e.get("isCompactSummary"):
            s["loaded"] = set()
            continue
        if e.get("isSidechain") or e.get("isMeta"):
            continue
        att = e.get("attachment") or {}
        if att.get("type") == "hook_additional_context":
            s["marks"] += " " + json.dumps(att.get("content"))
            continue
        content = (e.get("message") or {}).get("content")
        if e.get("type") == "user":
            text = content if isinstance(content, str) else " ".join(
                c.get("text", "") for c in content or [] if c.get("type") == "text")
            is_result = isinstance(content, list) and any(c.get("type") == "tool_result" for c in content)
            if text and not is_result and not text.lstrip().startswith("<"):
                s.update(prompt=text, marks="", edits=[], edit_lines=0, ran_after_edit=False, reply="")
            continue
        for c in content if isinstance(content, list) else []:
            if c.get("type") == "text":
                s["reply"] = c.get("text", "")
            if c.get("type") != "tool_use":
                continue
            name, inp = c.get("name"), c.get("input") or {}
            if name == "Skill":
                s["loaded"].add(str(inp.get("skill", "")).split(":")[-1])
            elif name in EDIT_TOOLS:
                path = str(inp.get("file_path") or inp.get("notebook_path") or "")
                if CODE_EXT.search(path):
                    s["edits"].append(path)
                    s["edit_lines"] += edit_lines(name, inp)
                    s["ran_after_edit"] = False
            elif name == "Bash":
                written = shell_writes(inp.get("command"))
                if written:
                    s["edits"].extend(written)
                    s["edit_lines"] += edit_lines(name, inp)
                    s["ran_after_edit"] = runs_after_write(inp.get("command"), written)
                elif s["edits"]:
                    s["ran_after_edit"] = True
    return s


def patch_paths(command):
    return re.findall(r"^\*\*\* (?:Update|Add|Delete) File: (.+)$", command or "", re.M) + re.findall(
        r"^\*\*\* Move to: (.+)$", command or "", re.M)


def skill_reads(command):
    # A pathname mentioned by echo/ls is not a read. Commands are evidence of
    # a load, not proof the model understood every byte of the file.
    if not re.search(r"\b(cat|head|tail|sed|less|more|read_text|open)\b", command or ""):
        return []
    return re.findall(r"(?:^|/)([a-zA-Z0-9_-]+)/SKILL\.md\b", command or "")


def read_codex_session(path):
    s = {"prompt": "", "loaded": set(), "marks": "", "edits": [], "edit_lines": 0,
         "ran_after_edit": False, "reply": ""}
    with open(path, "rb") as f:
        f.seek(0, os.SEEK_END)
        f.seek(max(0, f.tell() - TAIL_BYTES))
        lines = f.read().decode("utf-8", "replace").splitlines()
    for line in lines:
        try:
            e = json.loads(line)
        except ValueError:
            continue
        p = e.get("payload") or {}
        if e.get("type") == "compacted":
            s["loaded"] = set()
            continue
        # Completed runtime items cover nested tools.exec calls too. Parsing
        # response_item function calls as well would count these actions twice.
        if e.get("type") == "event_msg" and p.get("type") == "item_completed":
            item = p.get("item") or {}
            kind = item.get("type")
            if kind == "UserMessage":
                text = " ".join(c.get("text", "") for c in item.get("content", []))
                s.update(prompt=text, marks="", edits=[], edit_lines=0, ran_after_edit=False, reply="")
            elif kind == "AgentMessage" and item.get("phase") == "final_answer":
                s["reply"] = " ".join(c.get("text", "") for c in item.get("content", []))
            elif kind == "CommandExecution" and item.get("exit_code") == 0:
                command = item.get("command") or ""
                if isinstance(command, list):
                    command = command[-1] if command else ""
                s["loaded"].update(skill_reads(command))
                written = shell_writes(command)
                if written:
                    s["edits"].extend(written)
                    s["edit_lines"] += edit_lines("Bash", {"command": command})
                    s["ran_after_edit"] = runs_after_write(command, written)
                elif s["edits"]:
                    s["ran_after_edit"] = True
            elif kind == "FileChange" and item.get("status") == "completed":
                changes = item.get("changes") or {}
                for path, change in changes.items():
                    if CODE_EXT.search(path):
                        s["edits"].append(path)
                        s["edit_lines"] += sum(l.startswith("+") and not l.startswith("+++")
                                               for l in change.get("unified_diff", "").splitlines())
                        s["ran_after_edit"] = False
        if e.get("type") == "response_item" and p.get("type") == "message" and p.get("role") != "assistant":
            text = " ".join(c.get("text", "") for c in p.get("content", []))
            if MARK in text and not text.startswith("<environment_context>"):
                s["marks"] += " " + text
    return s


def commands(command):
    """Each simple command in a shell line as its words, heredoc bodies dropped, leading
    variable assignments and wrappers stripped."""
    text = re.sub(r"<<-?\s*['\"]?(\w+)['\"]?[^\n]*\n.*?^\s*\1\s*$", " ", command or "", flags=re.S | re.M)
    out = []
    for seg in re.split(r"[;&|\n]+", text):
        try:
            words = shlex.split(seg)
        except ValueError:
            words = seg.split()
        while words and (re.match(r"^\w+=", words[0]) or words[0] in ("sudo", "command", "time", "exec", "env")):
            words = words[1:]
        if words:
            out.append(words)
    return out


RUNNERS = ("python", "python3", "bash", "sh", "zsh", "node", "deno", "bun", "ruby", "tsx", "pytest", "uv", "go", "npx")


def runs_after_write(command, written):
    """True when a later command in the same shell line runs a file this line wrote: an
    interpreter given the file, or the file run as a program."""
    names = {os.path.basename(p) for p in written}
    seen_write = False
    for words in commands(command):
        named = any(os.path.basename(w) in names for w in words)
        if not seen_write:
            seen_write = named
            continue
        if named and (words[0] in RUNNERS or os.path.basename(words[0]) in names):
            return True
    return False


def agent_doc(path):
    """True for a document agents read as instructions: a skill's SKILL.md or a file beside it,
    an AGENTS.md, or a CLAUDE.md."""
    name = os.path.basename(path)
    if name in ("SKILL.md", "AGENTS.md", "CLAUDE.md"):
        return True
    return name.endswith(".md") and os.path.isfile(os.path.join(os.path.dirname(path), "SKILL.md"))


def ops(tool, inp, cwd=""):
    """The operational reminders this action calls for, as (key, text) pairs. cwd resolves
    relative delete targets, following any `cd` earlier in the same command."""
    found = []
    if tool in HELPER_TOOLS and os.environ.get("HERDR_ENV"):
        found.append(("helper", OPS["helper"]["builtin"]))
    if str(tool).startswith("mcp__"):
        name = tool.split("__")[-1].lower()
        writes = any(w.startswith(WRITE_VERBS) for w in re.split(r"[-_.]", name))
        if name == "execute":
            writes = bool(re.search(r"\.(%s)\w*\s*\(" % "|".join(WRITE_VERBS), str(inp.get("code") or "")))
        if writes:
            found.append(("outside-write", OPS["outside-write"]["text"]))
        if "merge" in name:
            found.append(("merge", OPS["merge"]["text"]))
    paths = []
    if tool in ("Edit", "Write", "MultiEdit"):
        paths = [str(inp.get("file_path") or "")]
    elif tool == "apply_patch":
        paths = patch_paths(inp.get("command"))
    for words in commands(inp.get("command")) if tool == "Bash" else []:
        head = " ".join(words[:3])
        if words[0] == "cd" and len(words) > 1:
            cwd = os.path.join(cwd or "", os.path.expanduser(words[1]))
        if head.startswith("herdr agent start"):
            line = " ".join(words)
            if not (re.search(r"(--model|(^|\s)-m)\s+\S", line) and re.search(r"--effort\s+\S|model_reasoning_effort=", line)):
                found.append(("helper", OPS["helper"]["unnamed"]))
        elif head.startswith("gh pr merge"):
            found.append(("merge", OPS["merge"]["text"]))
        elif words[0] in ("rm", "rmdir", "unlink") or (words[0] == "find" and "-delete" in words):
            targets = [os.path.join(cwd or "", w) for w in words[1:] if not w.startswith("-") and not re.search(r"[<>]", w)]
            if any(re.search(r"[$*?\[]", t) for t in targets):
                found.append(("delete", OPS["delete"]["unresolved"]))
            elif any(not t.startswith(("/tmp/", "/private/tmp/")) for t in targets):
                found.append(("delete", OPS["delete"]["text"]))
        elif words[:2] == ["git", "stash"] and (len(words) < 3 or words[2] not in ("list", "show")):
            found.append(("stash", OPS["stash"]["text"]))
        elif words[:2] == ["git", "commit"]:
            found.append(("commit", OPS["commit"]["text"]))
        elif words[0] == "ntn" and len(words) > 2 and words[2] in ("create", "edit", "delete", "update"):
            found.append(("outside-write", OPS["outside-write"]["text"]))
    if tool == "Bash":
        paths = shell_writes(inp.get("command"))
    if any(re.search(r"\.(sh|bash|zsh)$", p) for p in paths):
        found.append(("shell-script", OPS["shell-script"]["text"]))
    if any(agent_doc(p) for p in paths):
        found.append(("agent-doc", OPS["agent-doc"]["text"]))
    first = {}
    for key, text in found:
        first.setdefault(key, text)
    return list(first.items())


def read_session(path):
    return read_codex_session(path) if CODEX else read_claude_session(path)


def unloaded(rows, s):
    return [r for r in rows if "principle-" + r["p"] not in s["loaded"]]


def skills(rows):
    return ", ".join("`principle-%s`" % r["p"] for r in rows)


def principle_dir():
    """The folder holding the principle skills, so Codex, which has no Skill tool, is told
    where each SKILL.md is rather than guessing a path under the repo."""
    for d in ("~/.agents/skills", "~/.codex/skills", "~/.claude/skills"):
        d = os.path.expanduser(d)
        if os.path.isfile(os.path.join(d, "principle-prove-it-works", "SKILL.md")):
            return d
    return None


PRINCIPLE_DIR = principle_dir()


def emit(obj):
    if CODEX:
        # Keep the same events and Stop decision, change only load instructions.
        def wording(text):
            text = text.replace("call the Skill tool for it", "read its SKILL.md file in full")
            text = text.replace("call the Skill tool for each of", "read the SKILL.md file in full for each of")
            text = text.replace("Call the Skill tool for", "Read the SKILL.md file in full for")
            text = text.replace("Load each with the Skill tool", "Read each skill's SKILL.md file in full")
            text = text.replace("load the `", "read the SKILL.md file in full for `")
            if "principle-" in text and PRINCIPLE_DIR:
                text += " Each `principle-<name>` skill's file is `%s/principle-<name>/SKILL.md`." % PRINCIPLE_DIR
            return text
        if "reason" in obj:
            obj["reason"] = wording(obj["reason"])
        if "hookSpecificOutput" in obj:
            out = obj["hookSpecificOutput"]
            out["additionalContext"] = wording(out["additionalContext"])
    sys.stdout.write(json.dumps(obj))


def context(event, text):
    emit({"hookSpecificOutput": {"hookEventName": event, "additionalContext": text}})


def remind(row):
    return "%s %s: %s, load the `principle-%s` skill and follow it." % (MARK, row["tool"], row["before"], row["p"])


def on_prompt(ev, path):
    # At a session's first prompt the transcript does not exist yet: nothing is loaded.
    s = read_session(path) if path and os.path.exists(path) else {"loaded": set()}
    rows = unloaded(route(ev.get("prompt") or ""), s)
    text = MARK
    if rows:
        text += (" This task hits these moments: %s.\nBefore your first tool call or reply, "
                 "call the Skill tool for each of %s and follow it." % ("; ".join(r["moment"] for r in rows), skills(rows)))
    listed = [r for r in unloaded(ROUTES, s) if r not in rows]
    words = re.sub(r"\S*\w[/\\]\S*", " ", ev.get("prompt") or "")
    if ev.get("permission_mode") == "plan" or any(rx.search(words) for rx in HEAVY_RX):
        text += ("\nThis is the start of heavy work: a plan, an investigation, or writing for someone else. Before "
                 "the first step, go through the whole list below and load every principle this work could reach, "
                 "not only the next step's.")
    text += ("\n%s the principle skills by the moment each covers:\n%s\nBefore your first tool call or reply, "
             "pick each one whose moment this task could hit and call the Skill tool for it. When unsure, load it: "
             "an unneeded load costs a turn, a missed one costs the reasoning. A lookup or a one-line edit hits "
             "none; then load none." % ("Also check" if rows else "No cue matched. Check",
             "\n".join("- `principle-%s`: %s" % (r["p"], r["moment"]) for r in listed)))
    context("UserPromptSubmit", text + "\nIn the reply, name each principle that changed a choice and the choice "
            "it changed; if one turns out not to fit, say so in a line.")


def on_pretool(ev, path):
    tool, inp = ev.get("tool_name"), ev.get("tool_input") or {}
    if CODEX and tool == "apply_patch":
        paths = patch_paths(inp.get("command"))
    elif tool == "Bash":
        paths = shell_writes(inp.get("command"))
    else:
        paths = [str(inp.get("file_path") or inp.get("notebook_path") or "")]
    paths = [p for p in paths if CODE_EXT.search(p)]
    due = ops(tool, inp, ev.get("cwd") or "")
    if not paths and not due:
        return
    s = read_session(path)
    notes = []
    for key, text in due:
        if key == "merge" and re.search(r"\bmerg", s["prompt"], re.I):
            continue
        if OPS[key]["every"] or "%s %s:" % (MARK, key) not in s["marks"]:
            notes.append("%s %s: %s" % (MARK, key, text))
    test = BY_TOOL["test-edit"]
    rows = unloaded(route(s["prompt"]), s)
    if paths and any(TEST_PATH.search(p) for p in paths) and unloaded([test], s) and "test-edit:" not in s["marks"]:
        notes.append(remind(test))
    elif paths and rows and "first-edit:" not in s["marks"]:
        notes.append("%s first-edit: this task's principles are still unloaded. Call the Skill tool "
                     "for %s now and check this edit against each." % (MARK, skills(rows)))
    if notes:
        context("PreToolUse", " ".join(notes))


def on_posttool(ev, path):
    tool, inp = ev.get("tool_name"), ev.get("tool_input") or {}
    command = str(inp.get("command") or "")
    due = []
    if tool == "Bash" and BENCH_CMD.search(command) and not READ_ONLY_CMD.match(command):
        due.append(BY_TOOL["bench-run"])
    if len(json.dumps(ev.get("tool_response"), default=str)) > BIG_OUTPUT:
        due.append(BY_TOOL["big-output"])
    if not due:
        return
    s = read_session(path)
    notes = [remind(r) for r in unloaded(due, s) if r["tool"] + ":" not in s["marks"]]
    if notes:
        context("PostToolUse", " ".join(notes))


def on_stop(ev, path):
    if ev.get("stop_hook_active") is not False:
        return
    s = read_session(path)
    reply = ev.get("last_assistant_message") or s["reply"]
    if not s["prompt"] or not reply:
        return
    routed = route(s["prompt"])
    asks = []
    missing = unloaded(routed, s)
    if missing and "principle-" not in reply:
        asks.append("This task called for %s, and the reply names no principle. Load each with the Skill tool "
                    "now, check your work and reply against it, and send the corrected reply; if nothing "
                    "changes, say which principle confirmed what." % skills(missing))
    verify = BY_TOOL["unverified-edit"]
    substantial = routed or s["edit_lines"] > SMALL_EDIT_LINES
    if s["edits"] and substantial and not s["ran_after_edit"] and unloaded([verify], s):
        asks.append("You changed %s and ran nothing after the last edit. Before you call it done, load the "
                    "`principle-prove-it-works` skill and verify against the real artifact." % s["edits"][-1])
    if asks:
        emit({"decision": "block", "reason": "%s %s" % (MARK, " ".join(asks))})


HANDLERS = {"prompt": on_prompt, "pretool": on_pretool, "posttool": on_posttool, "stop": on_stop}


def main():
    if CODEX:
        sys.argv.remove("--codex")
    try:
        ev = json.load(sys.stdin)
        if not isinstance(ev, dict) or ev.get("agent_id"):
            return
        path = ev.get("transcript_path")
        if not path and sys.argv[1] != "prompt":
            return
        HANDLERS[sys.argv[1]](ev, path)
    except Exception:  # missing evidence, bad input, or a bug: say nothing, never fail the turn
        return


if __name__ == "__main__":
    main()
    sys.exit(0)
