# Maintainer Workflow

This preset is for JavaScript or TypeScript packages where contributors and users may consume the project through npm.

## Issues

- Treat install failures, import path breaks, and example drift as high-value issues.
- Ask for exact Node version, package manager, and reproduction steps when behavior differs across environments.

## Pull requests

- Focus first on behavior changes, public exports, versioning implications, tests, and docs.
- If a change affects the public API, make the upgrade path explicit in the pull request.
- If a change touches package metadata, release scripts, or publish flow, review it carefully.

## Releases

- Verify version numbers, changelog notes, and README examples before publishing.
- Prefer one real install or smoke test from a clean environment before shipping.

## Repository instructions

- Keep `AGENTS.md` current so Codex reviews focus on the real package risks.
- Favor small releases and clear change notes over large batches of silent behavior changes.
