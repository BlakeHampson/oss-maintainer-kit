# Maintainer Workflow

If this is your first public repo, read `docs/START_HERE.md` first.

This repository uses a lightweight workflow so a solo builder or small team can stay organized without turning the repo into process theater.

If you are working alone, you are still the maintainer. That just means you are the person deciding what to merge, fix, or ship.

## Think in three loops

1. Incoming issues: what people say is broken, missing, or confusing
2. Pull requests: the actual proposed code or docs changes
3. Releases: when you package up a set of changes for users

## Issues

- The issue forms exist to reduce vague one-line reports.
- A useful bug report explains what someone tried, what happened, and how to reproduce it.
- A useful feature request explains the problem first, then the proposed fix.
- If you are working alone, triage can be as simple as deciding: ship now, later, or never.

## Pull requests

- Pull requests are where code changes should be explained, checked, and reviewed.
- The pull request template asks for three things: what changed, why it matters, and how it was checked.
- If `codex-pr-review.yml` exists, Codex can review pull requests through that workflow or through built-in GitHub review.
- Review should focus on bugs, risky behavior changes, missing tests, and confusing docs before style nits.

## Releases

- You can ignore releases entirely until people are actually using tagged versions of your project.
- If `codex-release-prep.yml` exists, it can draft a summary and a checklist from recent commits.
- If `.github/release-note-schema.yml` also exists, the same workflow can emit a structured YAML block for other tooling.
- Always review generated release notes before publishing anything.

## Repository instructions

- Keep `AGENTS.md` current. It is the fastest way to make Codex review feedback fit the repo.
- Delete or disable workflows you do not plan to use in the next couple of weeks.
- Small, understandable process is better than ambitious process you will not maintain.
