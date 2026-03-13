# AGENTS.md

## Why this file exists

This file teaches AI reviewers and human contributors how `__PROJECT_NAME__` should be handled as a Python package.

For this kind of repo, correctness is not just about code style. Packaging metadata, import paths, examples, and environment assumptions can all break users.

## Review priorities

- Prioritize bugs, regressions, and missing tests before style feedback.
- Treat packaging metadata, CLI entry points, import path changes, and dependency changes as high risk.
- Flag changes that assume a specific OS, shell, Python version, or virtual environment setup without documenting it.
- Check that README examples, quick starts, and command snippets still match the shipped behavior.
- Call out changes that weaken secret handling, subprocess safety, or file permissions.
- Use plain language when possible. A correct review is more useful when the project owner can actually follow it.

## Maintainer Notes

- Primary maintainer: `__MAINTAINER_NAME__`
- Replace this file's generic guidance with repo-specific priorities as soon as you can.
- If a pull request changes install steps, example commands, packaging config, or release flow, request docs updates in the same change.
- Before releasing, verify versioning, changelog entries, and at least one clean-environment install or smoke test.
