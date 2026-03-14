# Maintainer Workflow

If this is your first public repo, start with `docs/START_HERE.md`.

`__PROJECT_NAME__` uses a lightweight workflow so the project can stay understandable without adding heavy process.

If you are working alone, you are still the maintainer. That just means you are the person deciding what to merge, fix, or ship.

## Think in three loops

1. Incoming issues: what people say is broken, missing, or confusing
2. Pull requests: the proposed code or docs changes
3. Releases: when you package up a group of changes for users

## Issues

- The issue forms exist to reduce vague bug reports and feature requests.
- A useful bug report explains what someone tried, what happened, and how to reproduce it.
- A useful feature request explains the problem first, then the proposed fix.
- If you are working alone, triage can be as simple as deciding: ship now, later, or never.

## Pull requests

- Contributors open pull requests with the included template.
- If `repo-health.yml` exists, it can run low-risk checks like `check-docs` in pull requests without any API keys.
- If `codex-pr-review.yml` exists, Codex can review pull requests automatically through that workflow or through built-in GitHub review.
- Maintainers should focus first on correctness, user impact, tests, and documentation clarity.

## Releases

- Ignore release automation until you actually need releases.
- If `codex-release-prep.yml` exists, it can generate a draft summary and checklist from recent commits.
- If `.github/release-note-schema.yml` also exists, the same workflow can emit a structured YAML block for other tooling.
- Review generated notes before publishing them.

## Repository instructions

- Keep `AGENTS.md` current. It is the fastest way to make Codex review feedback fit the repo.
- Delete or disable workflows you do not plan to use soon.
- Small, understandable process is better than ambitious process you will not maintain.
