# OSS Maintainer Kit

[![npm version](https://img.shields.io/npm/v/oss-maintainer-kit)](https://www.npmjs.com/package/oss-maintainer-kit)
[![npm downloads](https://img.shields.io/npm/dm/oss-maintainer-kit)](https://www.npmjs.com/package/oss-maintainer-kit)
![Release](https://img.shields.io/github/v/release/BlakeHampson/oss-maintainer-kit?display_name=tag)
![License](https://img.shields.io/github/license/BlakeHampson/oss-maintainer-kit)
![Issues](https://img.shields.io/github/issues/BlakeHampson/oss-maintainer-kit)
[![Example repo](https://img.shields.io/badge/example-first--public--repo-0ea5e9)](https://github.com/BlakeHampson/oss-maintainer-kit-example)
[![JS example](https://img.shields.io/badge/example-javascript--library-f59e0b)](https://github.com/BlakeHampson/oss-maintainer-kit-javascript-example)
[![Python example](https://img.shields.io/badge/example-python--package-2563eb)](https://github.com/BlakeHampson/oss-maintainer-kit-python-example)
[![Docs example](https://img.shields.io/badge/example-docs--heavy-16a34a)](https://github.com/BlakeHampson/oss-maintainer-kit-docs-example)
[![Next.js example](https://img.shields.io/badge/example-nextjs--app-111827)](https://github.com/BlakeHampson/oss-maintainer-kit-nextjs-example)
[![Python service example](https://img.shields.io/badge/example-python--service-0f766e)](https://github.com/BlakeHampson/oss-maintainer-kit-python-service-example)
[![Security example](https://img.shields.io/badge/example-security--sensitive--repo-dc2626)](https://github.com/BlakeHampson/oss-maintainer-kit-security-sensitive-example)
[![Security web example](https://img.shields.io/badge/example-security--web--service-b91c1c)](https://github.com/BlakeHampson/oss-maintainer-kit-security-web-service-example)

Turn a code repository into a public project that other people can understand, review, and contribute to.

If you can already get software working with Codex, Claude Code, or by hand, but GitHub and open-source process still feel confusing, this kit fills in the repository setup that usually gets skipped. It gives you the structure around your code: contributor forms, pull request prompts, repo instructions for AI reviewers, and optional Codex workflows.

In this repo, "maintainer" just means the person responsible for the project. If you are working solo, that is you.

It ships with a tiny CLI and a practical starter pack:

- `AGENTS.md` guidance that helps AI reviews fit your repo
- `docs/START_HERE.md` so a new repo owner knows what to do first
- GitHub issue and pull request templates
- an optional repo-health workflow that runs low-risk checks like `check-docs`
- example Codex GitHub Action workflows for pull request review and release prep
- a repeatable label sync command for first-pass GitHub triage labels
- a local docs check command for broken Markdown links and anchors
- plain-English workflow documentation you can drop into a new or existing repository

## What this solves

Most new public repos have the same gap:

- the code works, but nobody knows how to report a bug well
- pull requests arrive with no context
- AI review tools do not know what matters in the repo
- the owner is still learning GitHub and does not want heavyweight process

OSS Maintainer Kit gives you the minimum useful structure without forcing a giant maintainer handbook on day one.

## What this does in plain English

| File or folder | Why it exists | Do you need it on day one? |
| --- | --- | --- |
| `docs/START_HERE.md` | Explains the generated files and what to do first. | Yes |
| `AGENTS.md` | Tells Codex and contributors what good changes look like in your repo. | Yes |
| `.github/ISSUE_TEMPLATE/*` | Turns vague bug reports and ideas into something you can act on. | Yes |
| `.github/PULL_REQUEST_TEMPLATE.md` | Helps contributors explain what changed and how they checked it. | Yes |
| `.github/workflows/repo-health.yml` | Optional GitHub Action that runs low-risk checks like `check-docs` in pull requests. | Often yes, especially for docs-heavy or security-sensitive repos |
| `.github/workflows/codex-pr-review.yml` | Optional GitHub Action that asks Codex to review pull requests. | Later if you want AI review in Actions |
| `.github/workflows/codex-release-prep.yml` | Optional GitHub Action that drafts release prep notes. | Later, once you actually ship versions |
| `docs/MAINTAINER_WORKFLOW.md` | Explains how issues, pull requests, and releases are handled. | Helpful, but not urgent |

## Who this is for

- solo builders opening up their first public repo
- people doing AI-assisted or "vibe-coded" development who want cleaner GitHub workflows
- experienced maintainers who want a lightweight starter instead of building templates from scratch

## If you are new to GitHub or open source

- You do not need outside contributors before this becomes useful.
- You do not need to understand every workflow file immediately.
- You can ignore the release workflow until you start shipping versions.
- Rough-but-clear docs beat perfect docs that never get written.

## Quick start

See the CLI flow first:

![Quick start demo](docs/assets/quickstart-demo.gif)

Try it without cloning anything:

```bash
npx oss-maintainer-kit explain
```

If this is your first public repo, start with the lighter preset and preview the files before writing anything:

```bash
npx oss-maintainer-kit init ../my-repo \
  --repo-name my-repo \
  --maintainer "Your Name" \
  --preset first-public-repo \
  --dry-run
```

If the preview looks right, apply it:

```bash
npx oss-maintainer-kit init ../my-repo \
  --repo-name my-repo \
  --maintainer "Your Name" \
  --preset first-public-repo
```

By default, existing files are left untouched. Add `--force` only if you want to overwrite matching files.

Then open `docs/START_HERE.md` in the generated repo. That is the fastest path to understanding what just happened.

If you want the full starter, omit `--preset` or set `--preset base`.

If you want a concrete generated repo to inspect, start with one of these:

- [oss-maintainer-kit-example](https://github.com/BlakeHampson/oss-maintainer-kit-example) for `first-public-repo`
- [oss-maintainer-kit-javascript-example](https://github.com/BlakeHampson/oss-maintainer-kit-javascript-example) for `javascript-library`
- [oss-maintainer-kit-python-example](https://github.com/BlakeHampson/oss-maintainer-kit-python-example) for `python-package`
- [oss-maintainer-kit-nextjs-example](https://github.com/BlakeHampson/oss-maintainer-kit-nextjs-example) for `nextjs-app`
- [oss-maintainer-kit-python-service-example](https://github.com/BlakeHampson/oss-maintainer-kit-python-service-example) for `python-service`
- [oss-maintainer-kit-docs-example](https://github.com/BlakeHampson/oss-maintainer-kit-docs-example) for `docs-heavy`
- [oss-maintainer-kit-security-sensitive-example](https://github.com/BlakeHampson/oss-maintainer-kit-security-sensitive-example) for `security-sensitive-repo`
- [oss-maintainer-kit-security-web-service-example](https://github.com/BlakeHampson/oss-maintainer-kit-security-web-service-example) for a deployable web-service take on `security-sensitive-repo`

## Suggested first hour after setup

1. Read `docs/START_HERE.md`.
2. Edit `AGENTS.md` so it reflects your stack, risk areas, and review priorities.
3. Keep the issue and pull request templates unless they actively get in your way.
4. Commit the generated files.
5. Decide later whether you want the optional OpenAI-powered GitHub Actions.

## Adoption snapshots

This kit is already being used in two different ways:

- Public examples: there are now 8 live example repos covering beginner, package, app, service, docs, and security-sensitive repository shapes, so you can inspect the generated files instead of guessing what a preset does.
- Social surface: each public example repo now ships with a repo-specific social-preview card, so the README hero and upload-ready share asset are deliberate instead of default.
- Private security-sensitive repo: `ShuleDocs`, a secure Microsoft Office add-in project, is using the kit for maintainer onboarding, repo-specific `AGENTS.md` guidance, and GitHub issue and pull request templates without enabling the optional Codex Actions by default.

That split is intentional. The same kit should be useful for a beginner opening a repo to contributors and for a more security-sensitive project that wants better review discipline without immediately adding more automation.

More detail: [docs/CASE_STUDY_SHULEDOCS.md](docs/CASE_STUDY_SHULEDOCS.md)

## Optional workflows

The included GitHub Actions and workflow templates are optional:

- `repo-health.yml` runs low-risk checks like `check-docs` in pull requests and does not require API keys
- `codex-pr-review.yml` posts a Codex review comment on pull requests
- `codex-release-prep.yml` drafts a release summary and checklist

The Codex workflows are intentionally conservative and require an `OPENAI_API_KEY` GitHub secret.

If you already use built-in Codex GitHub reviews, you may not want the pull request workflow as well, because it can create duplicate feedback.

## Presets

| Preset | Best for | What changes | Example repo |
| --- | --- | --- | --- |
| `first-public-repo` | first-time public repos and solo builders | leaves out release-prep automation by default | [oss-maintainer-kit-example](https://github.com/BlakeHampson/oss-maintainer-kit-example) |
| `base` | general-purpose repos | includes both optional Codex workflows | scaffold from the main examples if you want the full starter |
| `javascript-library` | JavaScript and TypeScript packages | adds package-focused review guidance and docs | [oss-maintainer-kit-javascript-example](https://github.com/BlakeHampson/oss-maintainer-kit-javascript-example) |
| `python-package` | Python packages and tools | adds packaging and environment-focused guidance | [oss-maintainer-kit-python-example](https://github.com/BlakeHampson/oss-maintainer-kit-python-example) |
| `nextjs-app` | Next.js web apps | adds routing, rendering, env var, and deploy-focused guidance | [oss-maintainer-kit-nextjs-example](https://github.com/BlakeHampson/oss-maintainer-kit-nextjs-example) |
| `python-service` | Python APIs, workers, and services | adds runtime, config, migration, and deploy-focused guidance | [oss-maintainer-kit-python-service-example](https://github.com/BlakeHampson/oss-maintainer-kit-python-service-example) |
| `docs-heavy` | docs, guides, and content-heavy repos | adds accuracy, examples, and structure-focused guidance | [oss-maintainer-kit-docs-example](https://github.com/BlakeHampson/oss-maintainer-kit-docs-example) |
| `security-sensitive-repo` | repos where auth, secrets, packaging, or trust boundaries need stricter review discipline | adds security-oriented review guidance, risk-aware PR and issue templates, and disables optional Codex Actions by default | [packaging-heavy example](https://github.com/BlakeHampson/oss-maintainer-kit-security-sensitive-example)<br>[web-service example](https://github.com/BlakeHampson/oss-maintainer-kit-security-web-service-example) |

The `first-public-repo` preset intentionally leaves out release-prep automation. Most new repos do not need it yet.

## Standard label sync

Most repos eventually want the same first-pass labels for triage.

Preview the standard label set on any repo:

```bash
npx oss-maintainer-kit sync-labels BlakeHampson/oss-maintainer-kit --dry-run
```

This command uses the GitHub CLI, so `gh auth status` should show that you are logged in first.

Apply it:

```bash
npx oss-maintainer-kit sync-labels BlakeHampson/oss-maintainer-kit
```

What the standard manifest manages:

- `bug`
- `enhancement`
- `docs`
- `release`
- `good first issue`
- `needs reproduction`
- `blocked`

The sync is intentionally non-destructive. It creates missing labels and updates matching labels, but leaves unrelated labels alone.

More detail: [docs/LABELS.md](docs/LABELS.md)

## Docs checks

If your repo is docs-heavy or security-sensitive, run this after editing Markdown:

```bash
npx oss-maintainer-kit check-docs .
```

It checks local Markdown links and heading anchors so broken navigation gets caught before a PR is merged.

## What this kit does not do

- It does not write application code.
- It does not replace tests or human review.
- It does not guarantee project traction, security, or contributor activity.
- It does not force you into heavyweight process.

## Local development

Run tests:

```bash
npm test
npm run docs:check
npm run previews:render
```

Smoke check the CLI:

```bash
node ./bin/maintainer-kit.js explain
node ./bin/maintainer-kit.js init ../example-repo --preset first-public-repo --dry-run
node ./bin/maintainer-kit.js check-docs .
```

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the next set of presets and workflow improvements.

## License

MIT
