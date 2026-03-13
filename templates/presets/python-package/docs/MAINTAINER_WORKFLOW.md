# Maintainer Workflow

This preset is for Python packages where packaging, examples, and environment assumptions affect whether users can actually run the project.

## Issues

- Treat install problems, import errors, environment drift, and outdated examples as high-value issues.
- Ask for Python version, OS, dependency manager, and exact reproduction steps when debugging.

## Pull requests

- Focus first on behavior changes, packaging implications, tests, and docs.
- Review changes to entry points, dependency constraints, packaging metadata, and subprocess behavior carefully.
- If a change affects setup instructions or example commands, update docs in the same pull request.

## Releases

- Verify version numbers, changelog notes, and installation docs before publishing.
- Prefer one clean virtual environment or packaging smoke test before shipping.

## Repository instructions

- Keep `AGENTS.md` current so Codex reviews focus on the real packaging and runtime risks.
- Favor clear setup docs over clever abstractions that make the package harder to understand.
