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
- Codex can review pull requests automatically through built-in GitHub review or the included `codex-pr-review.yml` example.
- Maintainers should focus first on correctness, user impact, tests, and documentation clarity.

## Releases

- Ignore release automation until you actually need releases.
- When you are ready, `codex-release-prep.yml` can generate a draft summary and checklist from recent commits.
- Review generated notes before publishing them.

## Repository instructions

- Keep `AGENTS.md` current. It is the fastest way to make Codex review feedback fit the repo.
- Delete or disable workflows you do not plan to use soon.
- Small, understandable process is better than ambitious process you will not maintain.
