# Bundle Comparison

`--bundle` controls which optional advanced files get scaffolded on top of the preset you chose.

It does not change the core onboarding files like `AGENTS.md`, issue templates, the pull request template, or `docs/MAINTAINER_WORKFLOW.md`. Those still come from the preset.

## Short version

- `core`: keep the onboarding files and skip optional advanced workflows
- `checks`: keep low-risk checks, but skip Codex automation and release-prep extras
- `preset-default`: keep the preset's built-in opinion about which optional files should appear
- `full`: include every optional advanced file the preset can supply

If you are not sure, start with `core` for a first public repo or `checks` for an app or service repo.

## Optional file matrix

These are the files affected by bundle selection:

| Optional file | `preset-default` | `core` | `checks` | `full` |
| --- | --- | --- | --- | --- |
| `.github/workflows/repo-health.yml` | depends on preset | no | yes | yes |
| `.github/workflows/ci-smoke.yml` | depends on preset and only exists in app-oriented presets | no | yes, if the preset supplies it | yes, if the preset supplies it |
| `.github/workflows/codex-pr-review.yml` | depends on preset | no | no | yes, if the preset supplies it |
| `.github/workflows/codex-release-prep.yml` | depends on preset | no | no | yes, if the preset supplies it |
| `.github/release-note-schema.yml` | depends on preset | no | no | yes, if the preset supplies it |

## What "depends on preset" means

Some presets are intentionally lighter or stricter by default.

Examples:

- `base` includes the optional Codex workflows, release-note schema, and repo-health workflow by default
- `first-public-repo` leaves out release-prep by default because most new repos do not need it yet
- `security-sensitive-repo` leaves out the optional Codex workflows by default
- `nextjs-app` and `python-service` can also include `ci-smoke.yml`, because those presets define an app- or service-oriented smoke workflow starter

That is why `preset-default` exists. It means "trust the preset authoring and keep the current default behavior."

## How to choose quickly

### Choose `core` when

- this is your first public repo
- you want zero optional automation on day one
- you want the repo structure and contributor prompts, but prefer to add workflows later

### Choose `checks` when

- you want low-risk pull request checks without adding Codex or release automation
- you are using `nextjs-app` or `python-service` and want `ci-smoke.yml`
- you want `repo-health.yml` for docs or setup validation

### Choose `preset-default` when

- you want the current recommended default for the preset
- you are happy with the preset's built-in opinionated setup
- you do not want to think about bundle selection yet

### Choose `full` when

- you want every optional advanced file the preset can provide
- you prefer deleting extras later instead of adding them later
- you want to inspect the complete surface area with `--dry-run --diff`

## Concrete example: `nextjs-app`

These files are always scaffolded for `nextjs-app`, no matter which bundle you choose:

- `AGENTS.md`
- `.github/ISSUE_TEMPLATE/*`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `docs/START_HERE.md`
- `docs/MAINTAINER_WORKFLOW.md`
- `docs/DEPLOYMENT.md`
- `docs/ARCHITECTURE.md`
- `app/README.md`

What changes between bundles:

| Bundle | Extra optional files you get |
| --- | --- |
| `core` | none |
| `checks` | `.github/workflows/repo-health.yml`, `.github/workflows/ci-smoke.yml` |
| `preset-default` | `.github/workflows/repo-health.yml`, `.github/workflows/codex-pr-review.yml`, `.github/workflows/codex-release-prep.yml`, `.github/release-note-schema.yml`, `.github/workflows/ci-smoke.yml` |
| `full` | same as `preset-default` for this preset |

That makes `checks` the practical middle ground for app repos: you keep docs and smoke checks without committing to Codex automation or release-prep files.

## Commands to copy

First public repo, smallest setup:

```bash
npx oss-maintainer-kit init ../my-repo \
  --preset first-public-repo \
  --bundle core \
  --dry-run \
  --diff
```

Next.js app with low-risk checks:

```bash
npx oss-maintainer-kit init ../my-repo \
  --preset nextjs-app \
  --bundle checks \
  --dry-run \
  --diff
```

Security-sensitive repo with every optional file exposed for review:

```bash
npx oss-maintainer-kit init ../my-repo \
  --preset security-sensitive-repo \
  --bundle full \
  --dry-run \
  --diff
```

## Rule of thumb

If you are unsure, start smaller.

It is easier to add a workflow later than to keep a pile of optional files you do not understand or plan to maintain.
