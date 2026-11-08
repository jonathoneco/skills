#!/usr/bin/env bash
# Build one scenario repo: build.sh <a|b|c> <dir> <with|without>
set -euo pipefail
s="$1"; d="$2"; arm="$3"
rm -rf "$d"; mkdir -p "$d"; cd "$d"
git init -q -b main .
git config user.email dev@example.com; git config user.name Dev
c() { git add -A; git commit -qm "$1"; }
case "$s" in
a)
  mkdir -p src
  printf '# Changelog\n\n## Unreleased\n\n- Initial release.\n' > CHANGELOG.md
  printf 'pub fn focus_next(ws: &mut Vec<u32>, cur: usize) -> usize {\n    (cur + 1) %% ws.len()\n}\n' > src/workspace.rs
  c "init"
  git checkout -qb feat/wrap-focus
  printf '# Changelog\n\n## Unreleased\n\n- Focus wraps backward with focus_prev.\n- Initial release.\n' > CHANGELOG.md
  printf 'pub fn focus_next(ws: &mut Vec<u32>, cur: usize) -> usize {\n    (cur + 1) %% ws.len()\n}\n\npub fn focus_prev(ws: &mut Vec<u32>, cur: usize) -> usize {\n    (cur + ws.len() - 1) %% ws.len()\n}\n' > src/workspace.rs
  c "feat: add focus_prev"
  git checkout -q main
  printf '# Changelog\n\n## Unreleased\n\n- focus_next returns 0 on an empty workspace list.\n- Initial release.\n' > CHANGELOG.md
  printf 'pub fn focus_next(ws: &mut Vec<u32>, cur: usize) -> usize {\n    if ws.is_empty() {\n        return 0;\n    }\n    (cur + 1) %% ws.len()\n}\n' > src/workspace.rs
  c "fix: guard empty workspace list in focus_next"
  git checkout -q feat/wrap-focus
  git merge main >/dev/null 2>&1 || true
  ;;
b)
  mkdir -p convex infra/posthog
  printf 'export function needsDigest(items: string[]) {\n  return items.filter((i) => i.length > 0);\n}\n' > convex/needs.ts
  printf '{"dashboard": {"name": "needs", "tiles": 3}}\n' > infra/posthog/posthog.tf.json
  c "init"
  git checkout -qb feat/needs-sorted
  printf 'export function needsDigest(items: string[]) {\n  return items.filter((i) => i.length > 0).sort();\n}\n' > convex/needs.ts
  printf '{"dashboard": {"name": "needs", "tiles": 4}}\n' > infra/posthog/posthog.tf.json
  c "feat: sort needs digest and add a dashboard tile"
  git checkout -q main
  printf 'export function needsDigest(items: string[]) {\n  return items.map((i) => i.trim()).filter((i) => i.length > 0);\n}\n' > convex/needs.ts
  git rm -rq infra/posthog
  c "chore: trim needs; remove posthog terraform (dashboards now managed in the PostHog UI)"
  git checkout -q feat/needs-sorted
  git merge main >/dev/null 2>&1 || true
  ;;
c)
  mkdir -p src
  printf 'export const config = { retries: 2 };\n' > src/config.ts
  printf 'export function run() { return "ok"; }\n' > src/app.ts
  c "init"
  git checkout -qb sam/retries
  printf 'export const config = { retries: 5, backoffMs: 200 };\n' > src/config.ts
  c "feat: raise retries and add backoff"
  git checkout -qb feat/run-label
  # shellcheck disable=SC2016
  printf 'export function run(label = "job") { return `${label}: ok`; }\n' > src/app.ts
  c "feat: label run output"
  git checkout -q main
  printf 'export const config = { retries: 3, timeoutMs: 1000 };\n' > src/config.ts
  c "feat: retries 3 and a timeout (squash of sam/retries v2)"
  git checkout -q feat/run-label
  git rebase main >/dev/null 2>&1 || true
  ;;
esac
if [ "$arm" = with ]; then
  mkdir -p .claude/skills/resolving-merge-conflicts
  cp "$HOME/src/skills/skills/engineering/resolving-merge-conflicts/SKILL.md" .claude/skills/resolving-merge-conflicts/
fi
printf '.claude/\n' >> .git/info/exclude
git status --short
