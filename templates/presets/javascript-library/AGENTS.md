# AGENTS.md

## Why this file exists

This file teaches AI reviewers and human contributors how `__PROJECT_NAME__` should be handled as a JavaScript or TypeScript package.

For this kind of repo, small changes can break downstream users in surprising ways. Prioritize stable behavior, clear upgrade paths, and docs that match the shipped package.

## Review priorities

- Prioritize bugs, regressions, and missing tests before style feedback.
- Treat public API changes, package export changes, and runtime behavior changes as high risk.
- Flag dependency creep, unsafe install scripts, and environment-specific assumptions.
- Check that README examples, CLI examples, and published package behavior still match the code.
- Call out changes that could break CommonJS or ESM consumers, bundlers, or Node version support.
- Use plain language when possible. A correct review is more useful when the project owner can actually follow it.

## Maintainer Notes

- Primary maintainer: `__MAINTAINER_NAME__`
- Replace this file's generic guidance with repo-specific priorities as soon as you can.
- If a pull request changes install steps, public exports, package scripts, or release flow, request docs updates in the same change.
- Before publishing, verify versioning, changelog entries, and user-facing examples.
