# skills

Shareable agent skills and catalogs maintained by Jonathan Edwards.

This repo intentionally keeps authored skills separate from third-party skills. Vendor skills are referenced from catalogs by their original upstream URLs; they are not mirrored here.

## Layout

```text
src/variants/<harness>/<skill>/   # canonical authored harness variants
dist/<harness>/skills/<skill>/     # committed install surfaces for npx skills
catalogs/                         # curated install sets
docs-fragments/                   # reusable agent-doc fragments
bin/render-dist                   # deterministic dist renderer
```

Same-name variants are supported by separate install surfaces. For example, `next-afk` can exist in both `dist/pi` and `dist/claude` because each catalog installs only one surface.

## Install examples

```sh
npx skills@latest add https://github.com/jonathoneco/skills/tree/main/dist/pi --skill next-afk teammate
npx skills@latest add https://github.com/jonathoneco/skills/tree/main/dist/claude --skill next-afk teammate
```

Prefer catalogs for normal project setup.
