# Maintainer Workflow

If this is your first public repo, this preset is the recommended place to start.

`__PROJECT_NAME__` uses a lightweight workflow so the project can stay understandable without adding more process than it needs.

If you are working alone, you are still the maintainer. That just means you are the person deciding what to merge, fix, or ship.

## Think in two active loops

1. Incoming issues: what people say is broken, missing, or confusing
2. Pull requests: the proposed code or docs changes

## Issues

- The issue forms exist to reduce vague bug reports and feature requests.
- A useful bug report explains what someone tried, what happened, and how to reproduce it.
- A useful feature request explains the problem first, then the proposed fix.
- If you are working alone, triage can be as simple as deciding: ship now, later, or never.

## Pull requests

- Contributors open pull requests with the included template.
- Codex can review pull requests automatically through built-in GitHub review or, if your scaffold includes it, the `codex-pr-review.yml` example.
- Reviews should focus first on correctness, user impact, tests, and documentation clarity.

## When to add release workflow

Add release automation later, once you actually need tags, versions, or release notes.

Until then, a simple changelog and clear pull requests are enough.

## Repository instructions

- Keep `AGENTS.md` current. It is the fastest way to make Codex review feedback fit the repo.
- Small, understandable process is better than ambitious process you will not maintain.
