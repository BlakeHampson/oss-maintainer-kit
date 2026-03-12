# Maintainer Workflow

This repository uses a lightweight maintainer workflow designed to keep review quality high without adding heavy process.

## Pull requests

- Contributors open pull requests with the included template.
- Codex can review pull requests automatically through built-in GitHub review or the included `codex-pr-review.yml` example.
- Maintainers should focus first on correctness, user impact, and tests.

## Issues

- Bug reports and feature requests use structured issue forms.
- Triage should label severity, owner, and whether a follow-up doc update is required.

## Releases

- Use `codex-release-prep.yml` to generate a release summary and maintainer checklist.
- Review the generated plan before creating release notes or tagging a release.

## Repository instructions

Keep `AGENTS.md` current. It is the fastest way to make Codex review feedback repository-aware.
