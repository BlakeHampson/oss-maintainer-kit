# Changelog

## 0.14.0 - 2026-03-15

- make the app smoke workflow starter auto-detect npm, pnpm, or yarn defaults from common repo hints
- make the Python service smoke workflow starter auto-detect `uv`, `requirements.txt`, or editable `pyproject.toml` defaults
- update docs so maintainers know when to trust the starter and when to replace it

## 0.13.0 - 2026-03-15

- add `docs/BUNDLES.md` with a side-by-side comparison of `core`, `checks`, `preset-default`, and `full`
- add a beginner-friendly bundle chooser table to the README
- document a concrete `nextjs-app` example so users can understand what `checks` adds over `core`

## 0.12.0 - 2026-03-15

- add `--bundle` support so users can choose `preset-default`, `core`, `checks`, or `full` advanced-file output during scaffolding
- update generated docs so optional files are described correctly when lighter bundles are used
- document bundle selection in plain English for first-time maintainers

## 0.11.0 - 2026-03-15

- add editable `ci-smoke.yml` workflow starters to the `nextjs-app` and `python-service` presets
- document that the smoke workflows are conservative starting points, not full CI pipelines
- align the app-oriented example repos with the new smoke-check templates

## 0.10.0 - 2026-03-15

- add deployment and architecture stubs to the `nextjs-app` preset
- add runbook and architecture stubs to the `python-service` preset
- align the app-oriented presets with the public example repos that already demonstrated those docs

## 0.9.0 - 2026-03-15

- add an optional `.github/release-note-schema.yml` scaffold for teams that want machine-readable release prep
- update `codex-release-prep.yml` to emit structured YAML when that schema file exists
- document when to keep or delete the schema file and how to adopt it safely

## 0.8.0 - 2026-03-14

- add `--diff` support for `init --dry-run` so scaffold previews can show unified diffs
- preview overwrite changes cleanly when `--force --dry-run --diff` is used on an existing repo
- update the README and roadmap so the new preview flow is the default recommendation

## 0.7.1 - 2026-03-14

- add a generator for repo-specific example social-preview cards
- replace the example README preview assets with richer PNG social cards
- prepare GitHub-ready social preview assets for the example repo family

## 0.7.0 - 2026-03-14

- add `nextjs-app` and `python-service` presets for deployable application and service repos
- publish matching public example repositories for both presets
- update the README and roadmap so the new presets are visible in the main product surface

## 0.6.0 - 2026-03-14

- add a `repo-health` workflow template that runs low-risk checks like `check-docs` in pull requests
- enable the new workflow in public example repos so it is demonstrated, not just documented
- update the main README so optional workflows and docs checks are easier to understand

## 0.5.0 - 2026-03-14

- add a `check-docs` command to catch broken local Markdown links and anchors
- add a second public security-sensitive example repo for a deployable web-service shape
- add a public `ShuleDocs` case study with concrete adoption outcomes
- extract docs and security guidance so the new checks are part of the preset workflow

## 0.4.0 - 2026-03-14

- add the `security-sensitive-repo` preset with stricter review guidance and no optional Codex Actions by default
- add a public `ShuleDocs`-derived case study for applying the kit in a security-sensitive repo
- add a public example repository for the new preset and link it from the main README

## 0.3.2 - 2026-03-13

- add an adoption snapshot section to the main README
- document the live example repos more clearly for first-time users
- use the kit on the private `ShuleDocs` repo for maintainer onboarding, review guidance, and issue or pull request templates

## 0.3.1 - 2026-03-13

- link all live preset example repositories from the main README
- publish public example repositories for `javascript-library`, `python-package`, and `docs-heavy`
- align the npm package README with the expanded example catalog

## 0.3.0 - 2026-03-13

- add a standard label manifest and `sync-labels` command
- add docs for safe repeated label sync runs
- add npm/package badges and a stronger README discoverability pass
- dogfood the managed label set on the main repository

## 0.2.0 - 2026-03-13

- add `javascript-library`, `python-package`, and `docs-heavy` presets
- add a generated quick-start GIF for the README
- add a render script for regenerating the demo asset
- publish an example repo generated from the `first-public-repo` preset

## 0.1.1 - 2026-03-13

- add a beginner-first README and `docs/START_HERE.md`
- add an `explain` command with plain-English guidance
- add a `first-public-repo` preset that leaves out release prep by default
- make the package ready for npm publishing and `npx` use
- simplify generated templates for new GitHub and open-source users

## 0.1.0 - 2026-03-12

- initial CLI for scaffolding maintainer-ready repository files
- Codex pull request review workflow template
- Codex release-prep workflow template
- issue and pull request templates
- maintainer workflow documentation
