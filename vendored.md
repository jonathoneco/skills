# Vendored skills

These skills were copied in from upstream repos and are edited here; this repo owns them now. Each row says where a skill came from and the upstream commit it was last brought up to. The `updating-vendored` skill in `.agents/skills/` walks through bringing in upstream changes, and bumps the commit here when they are in.

The three repo sources are MIT licensed; the copies listed at the end keep their own licence file. `dataviz` and `simplify` are copied from skills Claude Code bundles, which ship with no licence file; they stay under Anthropic's terms, not this repo's MIT licence. Its palette checker carries Color.js's MIT notice in `scripts/validate_palette.py`. Their licence texts are kept word for word in [`licenses/`](./licenses/): [mattpocock/skills](./licenses/mattpocock.txt), [cursor/plugins pstack](./licenses/pstack.txt), and [DietrichGebert/ponytail](./licenses/ponytail.txt).

| Skill | Here | Source | Upstream path | Last synced |
| --- | --- | --- | --- | --- |
| architect | `skills/engineering/architect` | cursor/plugins | `pstack/skills/architect` | `41e4009` |
| automate-me | `skills/knowledge/automate-me` | cursor/plugins | `pstack/skills/automate-me` | `41e4009` |
| benchmark-checklist | `skills/engineering/benchmark-checklist` | cursor/plugins | `pstack/skills/benchmark-checklist` | `41e4009` |
| blast-radius | `skills/engineering/blast-radius` | cursor/plugins | `pstack/skills/blast-radius` | `41e4009` |
| bro | `skills/reasoning/bro` | cursor/plugins | `pstack/skills/bro` | `41e4009` |
| code-review | `skills/engineering/code-review` | mattpocock/skills | `skills/engineering/code-review` | `6f7f783` |
| codebase-design | `skills/engineering/codebase-design` | mattpocock/skills | `skills/engineering/codebase-design` | `6f7f783` |
| correct | `skills/engineering/correct` | cursor/plugins | `pstack/skills/correct` | `41e4009` |
| create-verification-skill | `skills/engineering/create-verification-skill` | cursor/plugins | `pstack/skills/create-verification-skill` | `41e4009` |
| dataviz | `skills/engineering/dataviz` | Claude Code (bundled skill) | `dataviz` | `2.1.312` |
| diagnosing-bugs | `skills/engineering/diagnosing-bugs` | mattpocock/skills | `skills/engineering/diagnosing-bugs` | `6f7f783` |
| domain-modeling | `skills/engineering/domain-modeling` | mattpocock/skills | `skills/engineering/domain-modeling` | `6f7f783` |
| figure-it-out | `skills/reasoning/figure-it-out` | cursor/plugins | `pstack/skills/figure-it-out` | `41e4009` |
| grill-me | `skills/reasoning/grill-me` | mattpocock/skills | `skills/productivity/grill-me` | `6f7f783` |
| grill-with-docs | `skills/reasoning/grill-with-docs` | mattpocock/skills | `skills/engineering/grill-with-docs` | `6f7f783` |
| grilling | `skills/reasoning/grilling` | mattpocock/skills | `skills/productivity/grilling` | `6f7f783` |
| improve-codebase-architecture | `skills/engineering/improve-codebase-architecture` | mattpocock/skills | `skills/engineering/improve-codebase-architecture` | `6f7f783` |
| interrogate | `skills/reasoning/interrogate` | cursor/plugins | `pstack/skills/interrogate` | `41e4009` |
| loop-me | `skills/reasoning/loop-me` | mattpocock/skills | `skills/in-progress/loop-me` | `6f7f783` |
| maintain-verification-skill | `skills/engineering/maintain-verification-skill` | cursor/plugins | `pstack/skills/maintain-verification-skill` | `41e4009` |
| no-comments | `skills/engineering/no-comments` | cursor/plugins | `pstack/skills/no-comments` | `41e4009` |
| ponytail | `skills/engineering/ponytail` | DietrichGebert/ponytail | `skills/ponytail` | `ebd8654` |
| ponytail-audit | `skills/engineering/ponytail-audit` | DietrichGebert/ponytail | `skills/ponytail-audit` | `ebd8654` |
| ponytail-debt | `skills/engineering/ponytail-debt` | DietrichGebert/ponytail | `skills/ponytail-debt` | `ebd8654` |
| ponytail-gain | `skills/engineering/ponytail-gain` | DietrichGebert/ponytail | `skills/ponytail-gain` | `ebd8654` |
| ponytail-help | `skills/engineering/ponytail-help` | DietrichGebert/ponytail | `skills/ponytail-help` | `ebd8654` |
| ponytail-review | `skills/engineering/ponytail-review` | DietrichGebert/ponytail | `skills/ponytail-review` | `ebd8654` |
| principle-attack-the-premise | `skills/reasoning/principle-attack-the-premise` | cursor/plugins | `pstack/skills/principle-attack-the-premise` | `41e4009` |
| principle-boundary-discipline | `skills/reasoning/principle-boundary-discipline` | cursor/plugins | `pstack/skills/principle-boundary-discipline` | `41e4009` |
| principle-build-the-lever | `skills/reasoning/principle-build-the-lever` | cursor/plugins | `pstack/skills/principle-build-the-lever` | `41e4009` |
| principle-encode-lessons-in-structure | `skills/reasoning/principle-encode-lessons-in-structure` | cursor/plugins | `pstack/skills/principle-encode-lessons-in-structure` | `41e4009` |
| principle-exhaust-the-design-space | `skills/reasoning/principle-exhaust-the-design-space` | cursor/plugins | `pstack/skills/principle-exhaust-the-design-space` | `41e4009` |
| principle-experience-first | `skills/reasoning/principle-experience-first` | cursor/plugins | `pstack/skills/principle-experience-first` | `41e4009` |
| principle-explain-the-number | `skills/reasoning/principle-explain-the-number` | cursor/plugins | `pstack/skills/principle-explain-the-number` | `41e4009` |
| principle-fix-root-causes | `skills/reasoning/principle-fix-root-causes` | cursor/plugins | `pstack/skills/principle-fix-root-causes` | `41e4009` |
| principle-foundational-thinking | `skills/reasoning/principle-foundational-thinking` | cursor/plugins | `pstack/skills/principle-foundational-thinking` | `41e4009` |
| principle-guard-the-context-window | `skills/reasoning/principle-guard-the-context-window` | cursor/plugins | `pstack/skills/principle-guard-the-context-window` | `41e4009` |
| principle-laziness-protocol | `skills/reasoning/principle-laziness-protocol` | cursor/plugins | `pstack/skills/principle-laziness-protocol` | `41e4009` |
| principle-make-operations-idempotent | `skills/reasoning/principle-make-operations-idempotent` | cursor/plugins | `pstack/skills/principle-make-operations-idempotent` | `41e4009` |
| principle-migrate-callers-then-delete-legacy-apis | `skills/reasoning/principle-migrate-callers-then-delete-legacy-apis` | cursor/plugins | `pstack/skills/principle-migrate-callers-then-delete-legacy-apis` | `41e4009` |
| principle-minimize-reader-load | `skills/reasoning/principle-minimize-reader-load` | cursor/plugins | `pstack/skills/principle-minimize-reader-load` | `41e4009` |
| principle-model-the-domain | `skills/reasoning/principle-model-the-domain` | cursor/plugins | `pstack/skills/principle-model-the-domain` | `41e4009` |
| principle-never-block-on-the-human | `skills/reasoning/principle-never-block-on-the-human` | cursor/plugins | `pstack/skills/principle-never-block-on-the-human` | `41e4009` |
| principle-outcome-oriented-execution | `skills/reasoning/principle-outcome-oriented-execution` | cursor/plugins | `pstack/skills/principle-outcome-oriented-execution` | `41e4009` |
| principle-prove-it-works | `skills/reasoning/principle-prove-it-works` | cursor/plugins | `pstack/skills/principle-prove-it-works` | `41e4009` |
| principle-redesign-from-first-principles | `skills/reasoning/principle-redesign-from-first-principles` | cursor/plugins | `pstack/skills/principle-redesign-from-first-principles` | `41e4009` |
| principle-separate-before-serializing-shared-state | `skills/reasoning/principle-separate-before-serializing-shared-state` | cursor/plugins | `pstack/skills/principle-separate-before-serializing-shared-state` | `41e4009` |
| principle-sequence-verifiable-units | `skills/reasoning/principle-sequence-verifiable-units` | cursor/plugins | `pstack/skills/principle-sequence-verifiable-units` | `41e4009` |
| principle-subtract-before-you-add | `skills/reasoning/principle-subtract-before-you-add` | cursor/plugins | `pstack/skills/principle-subtract-before-you-add` | `41e4009` |
| principle-test-behavior-not-implementation | `skills/reasoning/principle-test-behavior-not-implementation` | cursor/plugins | `pstack/skills/principle-test-behavior-not-implementation` | `41e4009` |
| principle-type-system-discipline | `skills/reasoning/principle-type-system-discipline` | cursor/plugins | `pstack/skills/principle-type-system-discipline` | `41e4009` |
| prototype | `skills/engineering/prototype` | mattpocock/skills | `skills/engineering/prototype` | `6f7f783` |
| reflect | `skills/knowledge/reflect` | cursor/plugins | `pstack/skills/reflect` | `41e4009` |
| research | `skills/reasoning/research` | mattpocock/skills | `skills/engineering/research` | `6f7f783` |
| show-me-your-work | `skills/reasoning/show-me-your-work` | cursor/plugins | `pstack/skills/show-me-your-work` | `41e4009` |
| simplify | `skills/engineering/simplify` | Claude Code (built-in command) | `simplify` | `2.1.317` |
| teach | `skills/reasoning/teach` | mattpocock/skills | `skills/productivity/teach` | `6f7f783` |
| technical-writing | `skills/knowledge/technical-writing` | cursor/plugins | `pstack/skills/technical-writing` | `41e4009` |
| typescript-best-practices | `skills/engineering/typescript-best-practices` | cursor/plugins | `pstack/skills/typescript-best-practices` | `41e4009` |
| unslop | `skills/knowledge/unslop` | cursor/plugins | `pstack/skills/unslop` | `41e4009` |
| wait-what | `skills/reasoning/wait-what` | mattpocock/skills | `skills/productivity/wait-what` | `6f7f783` |
| why | `skills/engineering/why` | cursor/plugins | `pstack/skills/why` | `41e4009` |
| wizard | `skills/engineering/wizard` | mattpocock/skills | `skills/engineering/wizard` | `6f7f783` |
| writing-beats | `skills/knowledge/writing-beats` | mattpocock/skills | `skills/in-progress/writing-beats` | `6f7f783` |
| writing-for-agents | `skills/knowledge/writing-for-agents` | mattpocock/skills | `skills/productivity/writing-for-agents` | `6f7f783` |
| writing-fragments | `skills/knowledge/writing-fragments` | mattpocock/skills | `skills/in-progress/writing-fragments` | `6f7f783` |
| writing-shape | `skills/knowledge/writing-shape` | mattpocock/skills | `skills/in-progress/writing-shape` | `6f7f783` |

`skills/engineering/no-comments/references/comment-sicko.md` is pstack's `pstack/agents/comment-sicko.md` at `41e4009`, the subagent `no-comments` briefs; Cursor ran it as a custom agent type.

## Third-party skills kept as copies

These are upstream's text, copied in rather than pinned in `skills-lock.json`, and refreshed by hand. `notion-cli` keeps two local notes in its `ntn api` section (close stdin on every `-d` call, and send `position` with a block insert); keep them when refreshing.

| Skill | Upstream |
|---|---|
| notion-cli | makenotion/skills |
| show-me | humanlayer/skills, `plugins/show-me/skills/show-me/` at `4d69d20`; MIT (`LICENSE`) |
| one-pager, big-pics-little-words | plannotator/effective-html, `skills/` at `5ce160a`; MIT (`LICENSE`) |
| theme-factory | anthropics/skills, `skills/theme-factory/` at `2c5958ecac7cee2b583967a2c4981d0f4a75c579`; Apache-2.0 (`LICENSE.txt`) |
| write-better, asd-ste100 | plannotator/write-better, `skills/<name>/` at `8f0ed39`; MIT (`LICENSE`) |
