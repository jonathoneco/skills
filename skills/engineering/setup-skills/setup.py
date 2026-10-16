#!/usr/bin/env python3
"""Install this checkout's shared skills, rules, and working-mode hooks for Claude Code and Codex.

Run it as `python3 -I <checkout>/skills/engineering/setup-skills/setup.py`. Every step converges:
a second run changes nothing, and a run after `git pull` brings the install up to date. Anything
the user made themselves (a skill folder, a link into another checkout, text outside the rules
block) is left as it is and reported.
"""

import hashlib
import json
import os
import re
import sys

ROOT = os.path.realpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
HOME = os.path.expanduser("~")
# Both tools move their config folder when these are set, so the install follows them.
CLAUDE = os.environ.get("CLAUDE_CONFIG_DIR") or os.path.join(HOME, ".claude")
CODEX = os.environ.get("CODEX_HOME") or os.path.join(HOME, ".codex")
SHARED = ("engineering", "knowledge", "reasoning")

BEGIN = "<!-- from jonathoneco/skills · rerun /setup-skills to update · edit outside this block -->"
END = "<!-- end jonathoneco/skills -->"

HOOK_SCRIPT = os.path.join(ROOT, "mode", "hooks", "mode.py")
# event, subcommand, Claude Code matcher, Codex matcher (mode/README.md)
HOOKS = [
    ("UserPromptSubmit", "prompt", None, None),
    ("PreToolUse", "pretool", "Edit|Write|MultiEdit|NotebookEdit|Bash|Agent|Task|mcp__.*", "apply_patch|Bash|spawn_agent|mcp__.*"),
    ("PostToolUse", "posttool", "Bash|Read|Grep|Glob|WebFetch|Agent|Task", "apply_patch|Bash"),
    ("Stop", "stop", None, None),
]

report = []


def note(line):
    report.append(line)


def shared_skills():
    """Name -> folder for every shared skill in the checkout."""
    found = {}
    for cat in SHARED:
        base = os.path.join(ROOT, "skills", cat)
        for name in sorted(os.listdir(base)):
            if os.path.isfile(os.path.join(base, name, "SKILL.md")):
                found[name] = os.path.join(base, name)
    return found


def frontmatter(path):
    text = open(path).read()
    m = re.match(r"---\n(.*?)\n---", text, re.S)
    return dict(re.findall(r"^([\w-]+):\s*(.*)$", m.group(1), re.M)) if m else {}


def name_only(skills):
    """Skills Codex keeps from firing on their own that Claude Code would otherwise auto-load."""
    out = []
    for name, folder in skills.items():
        yaml = os.path.join(folder, "agents", "openai.yaml")
        codex_quiet = os.path.isfile(yaml) and re.search(r"allow_implicit_invocation:\s*false", open(yaml).read())
        typed_only = frontmatter(os.path.join(folder, "SKILL.md")).get("disable-model-invocation") == "true"
        if codex_quiet and not typed_only:
            out.append(name)
    return out


def ours(link):
    return os.path.islink(link) and os.path.realpath(link).startswith(ROOT + os.sep)


def link_skills(skills):
    for target in (os.path.join(HOME, ".agents", "skills"), os.path.join(CLAUDE, "skills")):
        os.makedirs(target, exist_ok=True)
        added = 0
        for name in sorted(os.listdir(target)):
            link = os.path.join(target, name)
            if ours(link) and not os.path.exists(link):  # a skill renamed or removed upstream
                os.remove(link)
                note(f"removed {link}: its skill is gone from the checkout")
        for name, folder in skills.items():
            link = os.path.join(target, name)
            if os.path.lexists(link):
                if ours(link):
                    if os.path.realpath(link) != folder:
                        os.remove(link)
                        os.symlink(folder, link)
                        added += 1
                    continue
                note(f"kept {link}: it is yours, not a link into {ROOT}")
                continue
            os.symlink(folder, link)
            added += 1
        note(f"{target}: {added} skill links added or moved, {len(skills)} shared skills in the checkout")


def write_rules():
    core = open(os.path.join(ROOT, "rules", "core.md")).read().strip()
    block = f"{BEGIN}\n{core}\n{END}"
    for path in (os.path.join(CLAUDE, "CLAUDE.md"), os.path.join(CODEX, "AGENTS.md")):
        if os.path.islink(path):
            note(f"kept {path}: it is a link, so the rules come from where it points")
            continue
        os.makedirs(os.path.dirname(path), exist_ok=True)
        text = open(path).read() if os.path.exists(path) else ""
        pattern = re.compile(re.escape(BEGIN) + r".*?" + re.escape(END), re.S)
        if pattern.search(text):
            new = pattern.sub(lambda _: block, text, count=1)
        else:
            new = (text.rstrip() + "\n\n" if text.strip() else "") + block + "\n"
        if new != text:
            open(path, "w").write(new)
            note(f"{path}: rules block written")
        else:
            note(f"{path}: rules block already current")


def hook_command(sub, codex):
    flag = "--codex " if codex else ""
    return f'm="{HOOK_SCRIPT}"; [ ! -f "$m" ] || python3 -I "$m" {flag}{sub}'


def merge_hooks(data, codex):
    """Replace every working-mode entry with this checkout's, whichever checkout the old one ran."""
    hooks = data.setdefault("hooks", {})
    for event, sub, claude_matcher, codex_matcher in HOOKS:
        kept = [e for e in hooks.get(event, []) if not any("/mode/hooks/mode.py" in h.get("command", "") for h in e.get("hooks", []))]
        entry = {"hooks": [{"type": "command", "command": hook_command(sub, codex), "timeout": 5}]}
        matcher = codex_matcher if codex else claude_matcher
        if matcher:
            entry = {"matcher": matcher, **entry}
        hooks[event] = kept + [entry]


def update_json(path, change):
    if os.path.islink(path):
        note(f"kept {path}: it is a link, so its settings come from where it points")
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    before = open(path).read() if os.path.exists(path) else ""
    data = json.loads(before) if before.strip() else {}
    change(data)
    after = json.dumps(data, indent=2) + "\n"
    if after != before:
        open(path, "w").write(after)
        note(f"{path}: updated")
    else:
        note(f"{path}: already current")


def claude_settings(quiet):
    def change(data):
        merge_hooks(data, codex=False)
        overrides = data.setdefault("skillOverrides", {})
        for name in quiet:
            overrides[name] = "name-only"
    update_json(os.path.join(CLAUDE, "settings.json"), change)


def event_key(name):
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


def trust_hash(event, group, hook):
    """Codex's hook_hash: the key-sorted, compact JSON of the normalized entry."""
    handler = {"type": hook["type"], "command": hook["command"], "timeout": hook["timeout"], "async": False}
    identity = {"event_name": event_key(event), "hooks": [handler]}
    if "matcher" in group:
        identity["matcher"] = group["matcher"]
    return "sha256:" + hashlib.sha256(json.dumps(identity, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def codex_settings():
    hooks_path = os.path.join(CODEX, "hooks.json")
    update_json(hooks_path, lambda data: merge_hooks(data, codex=True))
    path = os.path.join(CODEX, "config.toml")
    before = open(path).read() if os.path.exists(path) else ""
    text = before
    section = re.search(r"^\[features\]\n(.*?)(?=^\[|\Z)", text, re.M | re.S)
    if section and re.search(r"^hooks\s*=", section.group(1), re.M):
        if not re.search(r"^hooks\s*=\s*true", section.group(1), re.M):
            note(f"kept {path}: [features] sets hooks to something other than true; set `hooks = true` to turn the working mode on")
    elif section:
        text = text[: section.start(1)] + "hooks = true\n" + text[section.start(1):]
    else:
        text = (text.rstrip() + "\n\n" if text.strip() else "") + "[features]\nhooks = true\n"
    # Codex runs a hook only once it is trusted, and pins that trust to the entry's text. The
    # working-mode entries come from this checkout, so the install trusts them; other hooks keep
    # Codex's own prompt.
    ours = {hook_command(sub, codex=True) for _, sub, _, _ in HOOKS}
    for event, groups in json.load(open(hooks_path))["hooks"].items():
        for gi, group in enumerate(groups):
            for hi, hook in enumerate(group.get("hooks", [])):
                if hook.get("command") not in ours:
                    continue
                header = f'[hooks.state."{hooks_path}:{event_key(event)}:{gi}:{hi}"]'
                line = f'{header}\ntrusted_hash = "{trust_hash(event, group, hook)}"'
                pin = re.compile(re.escape(header) + r'\ntrusted_hash = "[^"]*"')
                if pin.search(text):
                    text = pin.sub(lambda _: line, text, count=1)
                else:
                    if "[hooks.state]" not in text:
                        text = text.rstrip("\n") + "\n\n[hooks.state]\n"
                    text = text.rstrip("\n") + "\n\n" + line + "\n"
    if text != before:
        open(path, "w").write(text)
        note(f"{path}: hooks on and the working-mode hooks trusted")
    else:
        note(f"{path}: already current")


def main():
    skills = shared_skills()
    link_skills(skills)
    write_rules()
    quiet = name_only(skills)
    claude_settings(quiet)
    codex_settings()
    print("\n".join(report))
    print(f"name-only in Claude Code: {', '.join(quiet)}")


if __name__ == "__main__":
    sys.exit(main())
