# OSS Maintainer Kit

OSS Maintainer Kit helps maintainers stand up a clean, Codex-ready open-source workflow in minutes.

It ships with a tiny CLI and a practical starter pack:

- `AGENTS.md` guidance for repository-aware reviews
- GitHub issue and pull request templates
- example Codex GitHub Action workflows for pull request review and release prep
- maintainer workflow documentation you can drop into a new or existing repository

## Why this exists

Open-source maintainers are asked to do too much at once: review pull requests, triage issues, prepare releases, document decisions, and keep contributor guidance current. This repo packages the basics into a reusable starter so teams can adopt Codex-assisted maintenance without building the setup from scratch.

## Quick start

Clone this repository and run the initializer against a target repo:

```bash
node ./bin/maintainer-kit.js init ../my-repo \
  --repo-name my-repo \
  --maintainer "Your Name"
```

By default, existing files are left untouched. Add `--force` if you want to overwrite matching files.

## What gets added

- `AGENTS.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/workflows/codex-pr-review.yml`
- `.github/workflows/codex-release-prep.yml`
- `docs/MAINTAINER_WORKFLOW.md`

## Example workflows

The included GitHub Actions are based on OpenAI's official docs and the `openai/codex-action` repository:

- automatic or on-demand pull request review
- release-prep drafts from git history and changelog context

They are intentionally conservative:

- they expect an `OPENAI_API_KEY` GitHub secret
- they default to safe permissions
- they tell Codex to follow `AGENTS.md`

## Local development

Run tests:

```bash
npm test
```

## Recommended repo setup after scaffolding

1. Turn on Codex automatic reviews in your Codex GitHub settings if you want built-in PR review.
2. Add `OPENAI_API_KEY` to repository secrets if you want the example GitHub Actions to run.
3. Tighten `AGENTS.md` to match your stack, risk areas, and release process.
4. Add labels, CODEOWNERS, and branch protections once the basics are in place.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the next set of presets and workflow improvements.

## License

MIT
