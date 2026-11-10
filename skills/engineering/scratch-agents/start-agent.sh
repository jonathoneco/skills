#!/usr/bin/env bash
set -euo pipefail
export LC_ALL=C

fail() {
    printf 'start-agent: %s\n' "$*" >&2
    exit 1
}

usage() {
    printf '%s\n' 'Usage: start-agent.sh --name NAME --kind claude|codex --model ID --effort LEVEL --pane PANE --brief FILE [--dry-run]'
}

name=''
kind=''
model=''
effort=''
pane=''
brief=''
dry_run=false
while (( "$#" )); do
    case "$1" in
        --name|--kind|--model|--effort|--pane|--brief)
            (( "$#" >= 2 )) || fail "Missing value for $1"
            [[ -n "$2" && "$2" != --* && "$2" != *$'\n'* && "$2" != *$'\r'* ]] || fail "Invalid value for $1"
            case "$1" in
                --name) name="$2" ;;
                --kind) kind="$2" ;;
                --model) model="$2" ;;
                --effort) effort="$2" ;;
                --pane) pane="$2" ;;
                --brief) brief="$2" ;;
            esac
            shift 2
            ;;
        --dry-run) dry_run=true; shift ;;
        --help|-h) usage; exit 0 ;;
        *) fail "Unknown argument: $1" ;;
    esac
done

[[ "$name" =~ ^[a-z][a-z0-9_-]{0,31}$ ]] || fail 'The name must match [a-z][a-z0-9_-]{0,31}'
[[ "$kind" == claude || "$kind" == codex ]] || fail 'The kind must be claude or codex'
[[ -n "$model" ]] || fail '--model is required'
[[ -n "$effort" ]] || fail '--effort is required'
[[ -n "$pane" ]] || fail '--pane is required'
[[ -f "$brief" && -r "$brief" ]] || fail '--brief must name a readable file'
brief_dir="$(cd -- "$(dirname -- "$brief")" && pwd -P)" || fail 'Cannot resolve the brief folder'
brief="$brief_dir/$(basename -- "$brief")"
prompt="Read the brief file at \"$brief\" and do everything it says."

if [[ "$kind" == claude ]]; then
    native=(--model "$model" --effort "$effort" --permission-mode bypassPermissions)
else
    native=(-m "$model" -c "model_reasoning_effort=$effort" --dangerously-bypass-approvals-and-sandbox)
fi
start=(herdr agent start "$name" --kind "$kind" --pane "$pane" -- "${native[@]}")
if [[ "$dry_run" == true ]]; then
    printf 'Dry run:'
    printf ' %q' "${start[@]}"
    printf '\nPrompt: %s\nAgent: %s\nPane: %s\n' "$prompt" "$name" "$pane"
    exit 0
fi

command -v herdr >/dev/null || fail 'herdr is not installed'
start_status=0
start_output="$("${start[@]}" 2>&1)" || start_status="$?"
pane_text="$(herdr agent read "$name" --source recent-unwrapped 2>&1)" || fail "Cannot read the agent pane: $pane_text. Start result: $start_output"
if (( "$start_status" != 0 )) && ! printf '%s' "$start_output" | grep -Eq 'agent_not_ready|timeout'; then
    fail "Cannot start the agent: $start_output"
fi
if [[ "$kind" == codex ]] && printf '%s' "$pane_text" | grep -Eiq 'update available|model.upgrade|upgrade your model'; then
    herdr agent send-keys "$name" esc || fail 'Cannot dismiss the Codex update prompt'
    herdr agent wait "$name" --until idle --timeout 30000 || fail 'Codex did not become idle after esc'
    pane_text="$(herdr agent read "$name" --source recent-unwrapped 2>&1)" || fail "Cannot read Codex after esc: $pane_text"
elif (( "$start_status" != 0 )); then
    fail "Cannot start the agent: $start_output. Pane: $pane_text"
fi
herdr agent prompt "$name" "$prompt" || fail 'Cannot submit the brief pointer'
printf 'Agent: %s\nPane: %s\n' "$name" "$pane"
