## Git

- Conventional commits: `feat:` / `fix:` / `chore:` / `docs:` / `refactor:` / `test:` / `infra:`.
- Stage explicit paths: `git add path/to/file`. NEVER `git add -A` or `git add .`.
- NEVER `git reset --hard`, `git checkout .`, `git stash`, `git clean -fd`, or `git commit --no-verify` unless the user explicitly says so.
- NEVER force-push to `main` / `master`.
- Never commit `auth.json`, `*.env`, `*.pem`, `secrets/`, or anything matching credentials.
- Only commit files YOU touched in this session. Run `git status` and verify the staged set before every commit.
- On rebase conflicts in files you didn't modify: abort and ask.
