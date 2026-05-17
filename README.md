# skills

Shareable agent skills and catalogs maintained by Jonathan Edwards.

This repo intentionally keeps authored skills separate from third-party skills. Vendor skills are referenced from catalogs by their original upstream URLs; they are not mirrored here.

## Layout

```text
src/variants/<harness>/<skill>/   # canonical authored harness variants
dist/<harness>/skills/<skill>/     # committed install surfaces for npx skills
catalogs/                         # curated install sets
agent-docs/fragments/             # reusable agent-doc fragments
agent-docs/catalogs/              # doc render target catalogs
bin/render-dist                   # deterministic skill dist renderer
bin/agent-doc-render              # deterministic agent-doc renderer/checker
```

Same-name variants are supported by separate install surfaces. For example, `next-afk` can exist in both `dist/pi` and `dist/claude` because each catalog installs only one surface.

## Install examples

```sh
npx skills@latest add https://github.com/jonathoneco/skills/tree/main/dist/pi --skill next-afk teammate
npx skills@latest add https://github.com/jonathoneco/skills/tree/main/dist/claude --skill next-afk teammate
```

Prefer catalogs for normal project setup.

## Agent docs

`bin/agent-doc-render` renders clean runtime prompt docs from TOML catalogs. Full-render targets are used for personal global docs. Project docs can use explicit managed-block markers so only shared policy blocks are updated while project-owned content stays in the project.

```sh
bin/agent-doc-render check agent-docs/catalogs/dotfiles.toml
bin/agent-doc-render apply agent-docs/catalogs/dotfiles.toml
```
