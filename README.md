# OSS Maintainer Kit

[![npm version](https://img.shields.io/npm/v/oss-maintainer-kit)](https://www.npmjs.com/package/oss-maintainer-kit)
[![npm downloads](https://img.shields.io/npm/dm/oss-maintainer-kit)](https://www.npmjs.com/package/oss-maintainer-kit)
![Release](https://img.shields.io/github/v/release/BlakeHampson/oss-maintainer-kit?display_name=tag)
![License](https://img.shields.io/github/license/BlakeHampson/oss-maintainer-kit)
![Issues](https://img.shields.io/github/issues/BlakeHampson/oss-maintainer-kit)
[![Example repo](https://img.shields.io/badge/example-first--public--repo-0ea5e9)](https://github.com/BlakeHampson/oss-maintainer-kit-example)

Turn a code repository into a public project that other people can understand, review, and contribute to.

If you can already get software working with Codex, Claude Code, or by hand, but GitHub and open-source process still feel confusing, this kit fills in the repository setup that usually gets skipped. It gives you the structure around your code: contributor forms, pull request prompts, repo instructions for AI reviewers, and optional Codex workflows.

In this repo, "maintainer" just means the person responsible for the project. If you are working solo, that is you.

It ships with a tiny CLI and a practical starter pack:

- `AGENTS.md` guidance that helps AI reviews fit your repo
- `docs/START_HERE.md` so a new repo owner knows what to do first
- GitHub issue and pull request templates
- example Codex GitHub Action workflows for pull request review and release prep
- a repeatable label sync command for first-pass GitHub triage labels
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

If you want a concrete generated repo to inspect, see [oss-maintainer-kit-example](https://github.com/BlakeHampson/oss-maintainer-kit-example).

## Suggested first hour after setup

1. Read `docs/START_HERE.md`.
2. Edit `AGENTS.md` so it reflects your stack, risk areas, and review priorities.
3. Keep the issue and pull request templates unless they actively get in your way.
4. Commit the generated files.
5. Decide later whether you want the optional OpenAI-powered GitHub Actions.

## Optional AI workflows

The included GitHub Actions are based on OpenAI's official docs and the `openai/codex-action` repository. They are optional:

- `codex-pr-review.yml` posts a Codex review comment on pull requests
- `codex-release-prep.yml` drafts a release summary and checklist

They are intentionally conservative and require an `OPENAI_API_KEY` GitHub secret.

If you already use built-in Codex GitHub reviews, you may not want the pull request workflow as well, because it can create duplicate feedback.

## Presets

| Preset | Best for | What changes |
| --- | --- | --- |
| `first-public-repo` | first-time public repos and solo builders | leaves out release-prep automation by default |
| `base` | general-purpose repos | includes both optional Codex workflows |
| `javascript-library` | JavaScript and TypeScript packages | adds package-focused review guidance and docs |
| `python-package` | Python packages and tools | adds packaging and environment-focused guidance |
| `docs-heavy` | docs, guides, and content-heavy repos | adds accuracy, examples, and structure-focused guidance |

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

## What this kit does not do

- It does not write application code.
- It does not replace tests or human review.
- It does not guarantee project traction, security, or contributor activity.
- It does not force you into heavyweight process.

## Local development

Run tests:

```bash
npm test
```

Smoke check the CLI:

```bash
node ./bin/maintainer-kit.js explain
node ./bin/maintainer-kit.js init ../example-repo --preset first-public-repo --dry-run
```

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the next set of presets and workflow improvements.

## License

MIT
