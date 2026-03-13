# AGENTS.md

## Why this file exists

This file teaches AI reviewers and human contributors how `__PROJECT_NAME__` should be handled as a docs-heavy repository.

In this kind of repo, clarity is the product. Broken links, misleading examples, and outdated instructions can be as damaging as code bugs.

## Review priorities

- Prioritize factual accuracy, broken links, outdated steps, and confusing structure before style feedback.
- Treat example drift, contradictory guidance, and screenshots or assets that no longer match the docs as high risk.
- Flag changes that make contributor setup harder to follow without a clear payoff.
- Check that examples, commands, filenames, and URLs match the current repository layout.
- If a workflow or automation is added, make sure it reduces maintenance work instead of adding more confusion.
- Use plain language when possible. A correct review is more useful when the project owner can actually follow it.

## Maintainer Notes

- Primary maintainer: `__MAINTAINER_NAME__`
- Replace this file's generic guidance with repo-specific priorities as soon as you can.
- If a pull request changes structure, navigation, examples, screenshots, or automation, request docs updates in the same change.
- Prefer changes that make the docs easier to scan, verify, and maintain.
