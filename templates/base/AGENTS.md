# AGENTS.md

## Why this file exists

This file teaches AI reviewers and human contributors how `__PROJECT_NAME__` should be handled.

If this is a small or newly public repo, the goal is not to sound like a big company. The goal is to make good changes easier and confusing changes easier to spot.

## Review priorities

- Prioritize bugs, regressions, and missing tests before style feedback.
- Flag risky migrations, broad dependency changes, and silent behavior changes.
- Treat security issues, secret handling, and permission creep as high priority.
- Call out missing docs when behavior changes would surprise users or contributors.
- Prefer small, actionable findings over long essays.
- Use plain language when possible. A correct review is more useful when the maintainer can actually follow it.

## Maintainer Notes

- Primary maintainer: `__MAINTAINER_NAME__`
- Replace this file's generic guidance with repo-specific priorities as soon as you can.
- If a pull request changes release steps, contributor setup, or workflow permissions, request docs updates in the same change.
- If a pull request adds automation, verify the trigger conditions and GitHub token permissions are minimal.
